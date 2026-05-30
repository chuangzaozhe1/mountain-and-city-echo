package com.mountainandcity.echo.story

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mountainandcity.echo.core.audio.AudioManager
import com.mountainandcity.echo.story.model.ChoiceData
import com.mountainandcity.echo.story.model.CharacterEnum
import com.mountainandcity.echo.story.repository.GameRepository
import com.mountainandcity.echo.story.repository.StoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class StoryViewModel @Inject constructor(
    private val storyRepository: StoryRepository,
    private val gameRepository: GameRepository,
    private val audioManager: AudioManager
) : ViewModel(), StoryEngine {

    private val _uiState = MutableStateFlow(StoryUiState())
    override val uiState: StateFlow<StoryUiState> = _uiState.asStateFlow()

    private var autoPlayJob: Job? = null
    private var typewriterJob: Job? = null

    override suspend fun loadChapter(chapterId: String) {
        _uiState.update { it.copy(isLoading = true, error = null) }

        storyRepository.loadChapter(chapterId).fold(
            onSuccess = { chapter ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        chapterData = chapter,
                        currentChapterId = chapter.chapterId,
                        currentChapterTitle = chapter.title,
                        currentScene = chapter.scenes.firstOrNull(),
                        currentSceneIndex = 0,
                        currentDialogue = null,
                        currentDialogueIndex = 0,
                        historyDialogues = emptyList(),
                        choices = emptyList(),
                        isChapterComplete = false,
                        nextChapterId = null
                    )
                }

                // 解锁章节
                gameRepository.unlockChapter(chapterId)

                // 播放 BGM
                chapter.scenes.firstOrNull()?.bgm?.let { bgm ->
                    audioManager.playBgm(bgm)
                }

                // 自动进入第一句对话
                nextDialogue()
            },
            onFailure = { error ->
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        error = error.message ?: "加载章节失败"
                    )
                }
            }
        )
    }

    override fun nextDialogue() {
        val state = _uiState.value
        val scene = state.currentScene ?: return

        // 如果打字机效果未完成，先完成它
        if (!state.isTextComplete) {
            resetTextAnimation()
            return
        }

        // 如果有选择，先处理选择
        if (state.choices.isNotEmpty()) {
            return
        }

        val dialogueIndex = state.currentDialogueIndex
        val nextIndex = dialogueIndex + 1

        if (nextIndex < scene.dialogues.size) {
            // 下一句对话
            updateDialogue(scene.dialogues[nextIndex], nextIndex)
        } else if (scene.choices != null && scene.choices.isNotEmpty()) {
            // 显示选择
            val changes = scene.bondChanges ?: emptyMap()
            val hasChanges = changes.isNotEmpty()
            _uiState.update {
                it.copy(
                    choices = scene.choices!!,
                    bondChanges = changes,
                    showBondIncrease = hasChanges
                )
            }

            if (hasChanges) {
                applyBondChanges(changes)
            }
        } else {
            // 场景结束，切换到下一场景
            moveToNextScene()
        }
    }

    override fun previousDialogue() {
        val state = _uiState.value
        val history = state.historyDialogues

        if (history.isNotEmpty()) {
            val lastDialogue = history.last()
            val newHistory = history.dropLast(1)

            _uiState.update {
                it.copy(
                    currentDialogue = lastDialogue,
                    currentDialogueIndex = state.currentDialogueIndex - 1,
                    historyDialogues = newHistory,
                    displayedText = lastDialogue.text,
                    isTextComplete = true
                )
            }
        }
    }

    override fun makeChoice(choiceId: String) {
        val state = _uiState.value
        val choice = state.choices.find { it.choiceId == choiceId } ?: return

        // 播放选择音效
        audioManager.playSfx("select")

        // 关闭选择 UI
        _uiState.update {
            it.copy(
                choices = emptyList(),
                showBondIncrease = false
            )
        }

        // 切换到下一场景
        val chapter = state.chapterData ?: return
        val nextScene = chapter.scenes.find { it.sceneId == choice.nextSceneId }

        if (nextScene != null) {
            _uiState.update {
                it.copy(
                    currentScene = nextScene,
                    currentSceneIndex = chapter.scenes.indexOf(nextScene),
                    currentDialogue = null,
                    currentDialogueIndex = 0,
                    historyDialogues = emptyList(),
                    bondChanges = choice.bondChanges ?: emptyMap()
                )
            }

            // 处理选择中的羁绊变化
            choice.bondChanges?.let { applyBondChanges(it) }

            // 播放新场景 BGM
            nextScene.bgm?.let { bgm ->
                audioManager.playBgm(bgm)
            }

            nextDialogue()
        } else {
            // 如果找不到下一场景，说明章节结束
            handleChapterComplete()
        }
    }

    override fun toggleAutoPlay() {
        val newAutoPlay = !_uiState.value.isAutoPlay
        _uiState.update { it.copy(isAutoPlay = newAutoPlay) }

        if (newAutoPlay) {
            startAutoPlay()
        } else {
            stopAutoPlay()
        }
    }

    override fun setTextSpeed(speed: TextSpeed) {
        _uiState.update { it.copy(textSpeed = speed) }
    }

    override fun setAutoPlayInterval(interval: Long) {
        _uiState.update { it.copy(autoPlayInterval = interval) }
    }

    override suspend fun saveAutoSave() {
        val state = _uiState.value
        val scene = state.currentScene ?: return

        gameRepository.autoSave(
            chapterId = state.currentChapterId,
            sceneId = scene.sceneId,
            dialogueIndex = state.currentDialogueIndex
        )
    }

    override suspend fun saveQuickSave() {
        val state = _uiState.value
        val scene = state.currentScene ?: return

        gameRepository.quickSave(
            chapterId = state.currentChapterId,
            sceneId = scene.sceneId,
            dialogueIndex = state.currentDialogueIndex
        )
    }

    override fun resetTextAnimation() {
        val dialogue = _uiState.value.currentDialogue ?: return
        typewriterJob?.cancel()
        _uiState.update {
            it.copy(
                displayedText = dialogue.text,
                isTextComplete = true
            )
        }
    }

    private fun updateDialogue(dialogue: com.mountainandcity.echo.story.model.DialogueData, index: Int) {
        val state = _uiState.value

        // 保存到历史
        val newHistory = if (state.currentDialogue != null) {
            state.historyDialogues + state.currentDialogue!!
        } else {
            state.historyDialogues
        }

        // 保留最多 20 条历史
        val trimmedHistory = if (newHistory.size > 20) {
            newHistory.takeLast(20)
        } else {
            newHistory
        }

        _uiState.update {
            it.copy(
                currentDialogue = dialogue,
                currentDialogueIndex = index,
                historyDialogues = trimmedHistory,
                isTextComplete = false,
                displayedText = ""
            )
        }

        // 启动打字机效果
        startTypewriter(dialogue.text)

        // 播放打字机音效
        audioManager.playSfx("type")
    }

    private fun startTypewriter(text: String) {
        typewriterJob?.cancel()
        typewriterJob = viewModelScope.launch {
            val state = _uiState.value
            val delayMs = state.textSpeed.toDelayMs()

            for (i in text.indices) {
                if (_uiState.value.isTextComplete) break

                val partialText = text.substring(0, i + 1)
                _uiState.update { it.copy(displayedText = partialText) }
                delay(delayMs)
            }

            _uiState.update { it.copy(isTextComplete = true) }
        }
    }

    private fun moveToNextScene() {
        val state = _uiState.value
        val chapter = state.chapterData ?: return
        val nextSceneIndex = state.currentSceneIndex + 1

        if (nextSceneIndex < chapter.scenes.size) {
            val nextScene = chapter.scenes[nextSceneIndex]

            _uiState.update {
                it.copy(
                    currentScene = nextScene,
                    currentSceneIndex = nextSceneIndex,
                    currentDialogue = null,
                    currentDialogueIndex = 0,
                    historyDialogues = emptyList(),
                    choices = emptyList()
                )
            }

            // 播放新场景 BGM
            nextScene.bgm?.let { bgm ->
                audioManager.playBgm(bgm)
            }

            nextDialogue()
        } else {
            // 章节完成
            handleChapterComplete()
        }
    }

    private fun handleChapterComplete() {
        val state = _uiState.value
        val chapter = state.chapterData ?: return

        // 计算下一章
        val chapterNumber = chapter.number
        val nextChapterId = "chapter_${(chapterNumber + 1).toString().padStart(2, '0')}"

        viewModelScope.launch {
            // 解锁下一章
            if (storyRepository.chapterExists(nextChapterId)) {
                gameRepository.unlockChapter(nextChapterId)
            }
        }

        _uiState.update {
            it.copy(
                isChapterComplete = true,
                nextChapterId = nextChapterId
            )
        }
    }

    private fun applyBondChanges(changes: Map<String, Int>) {
        viewModelScope.launch {
            changes.forEach { (characterId, points) ->
                gameRepository.addBondPoints(characterId, points)
                val character = CharacterEnum.fromId(characterId)
                if (character != null) {
                    _uiState.update {
                        it.copy(
                            lastIncreasedCharacter = character,
                            lastIncreasedPoints = points
                        )
                    }
                }
            }
        }
    }

    private fun startAutoPlay() {
        autoPlayJob?.cancel()
        autoPlayJob = viewModelScope.launch {
            while (_uiState.value.isAutoPlay) {
                delay(_uiState.value.autoPlayInterval)
                if (_uiState.value.isAutoPlay) {
                    nextDialogue()
                }
            }
        }
    }

    private fun stopAutoPlay() {
        autoPlayJob?.cancel()
        autoPlayJob = null
    }

    override fun onCleared() {
        super.onCleared()
        autoPlayJob?.cancel()
        typewriterJob?.cancel()
    }
}