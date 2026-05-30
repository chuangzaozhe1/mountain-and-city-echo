package com.mountainandcity.echo.story

import com.mountainandcity.echo.story.model.CharacterEnum
import kotlinx.coroutines.flow.StateFlow
import com.mountainandcity.echo.story.model.ChapterData
import com.mountainandcity.echo.story.model.ChoiceData
import com.mountainandcity.echo.story.model.DialogueData
import com.mountainandcity.echo.story.model.SceneData

/**
 * 文本速度
 */
enum class TextSpeed {
    SLOW,
    MEDIUM,
    FAST;

    fun toDelayMs(): Long = when (this) {
        SLOW -> 80L
        MEDIUM -> 50L
        FAST -> 25L
    }

    companion object {
        fun fromString(value: String): TextSpeed {
            return entries.find { it.name == value } ?: MEDIUM
        }
    }
}

/**
 * 剧情引擎状态
 */
data class StoryUiState(
    val isLoading: Boolean = true,
    val error: String? = null,
    val chapterData: ChapterData? = null,
    val currentChapterId: String = "",
    val currentChapterTitle: String = "",
    val currentScene: SceneData? = null,
    val currentSceneIndex: Int = 0,
    val currentDialogue: DialogueData? = null,
    val currentDialogueIndex: Int = 0,
    val displayedText: String = "", // 打字机效果显示的文本
    val isTextComplete: Boolean = true, // 打字机效果是否完成
    val choices: List<ChoiceData> = emptyList(),
    val isAutoPlay: Boolean = false,
    val textSpeed: TextSpeed = TextSpeed.MEDIUM,
    val autoPlayInterval: Long = 3000,
    val historyDialogues: List<DialogueData> = emptyList(),
    val bondChanges: Map<String, Int> = emptyMap(), // 当前场景需要增加的羁绊值
    val showBondIncrease: Boolean = false,
    val lastIncreasedCharacter: CharacterEnum? = null,
    val lastIncreasedPoints: Int = 0,
    val isChapterComplete: Boolean = false,
    val nextChapterId: String? = null
)

/**
 * 剧情引擎接口
 */
interface StoryEngine {
    val uiState: StateFlow<StoryUiState>

    suspend fun loadChapter(chapterId: String)
    fun nextDialogue()
    fun previousDialogue()
    fun makeChoice(choiceId: String)
    fun toggleAutoPlay()
    fun setTextSpeed(speed: TextSpeed)
    fun setAutoPlayInterval(interval: Long)
    suspend fun saveAutoSave()
    suspend fun saveQuickSave()
    fun resetTextAnimation()
}