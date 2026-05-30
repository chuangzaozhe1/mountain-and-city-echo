package com.mountainandcity.echo.feature.story

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mountainandcity.echo.story.repository.GameRepository
import com.mountainandcity.echo.story.repository.StoryRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ChapterSelectViewModel @Inject constructor(
    private val storyRepository: StoryRepository,
    private val gameRepository: GameRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChapterSelectUiState())
    val uiState: StateFlow<ChapterSelectUiState> = _uiState.asStateFlow()

    fun loadChapters() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            storyRepository.getChapterList().fold(
                onSuccess = { chapterIds ->
                    val chapters = chapterIds.mapIndexed { index, id ->
                        ChapterSelectItem(
                            chapterId = id,
                            title = extractChapterTitle(id, index + 1),
                            volume = (index / 4) + 1,
                            number = index + 1
                        )
                    }

                    // 获取已解锁的章节
                    gameRepository.getUnlockedChapterIds().collect { unlocked ->
                        _uiState.update {
                            it.copy(
                                isLoading = false,
                                chapters = chapters,
                                unlockedChapters = unlocked.ifEmpty { listOf("chapter_01") }
                            )
                        }
                    }
                },
                onFailure = {
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            chapters = defaultChapters()
                        )
                    }
                }
            )
        }
    }

    private fun defaultChapters(): List<ChapterSelectItem> {
        return listOf(
            ChapterSelectItem("chapter_01", "立信的蝉鸣与羽毛球拍", 1, 1),
            ChapterSelectItem("chapter_02", "图书馆的灯与金佛山的云", 1, 2),
            ChapterSelectItem("chapter_03", "中核的围墙与腾格里的星", 1, 3),
            ChapterSelectItem("chapter_04", "三十二中的爬山虎与酱肉包", 2, 4),
            ChapterSelectItem("chapter_05", "主席台上的重逢与徒步攻略", 2, 5),
            ChapterSelectItem("chapter_06", "突然出现的背包与麦理浩径", 2, 6),
            ChapterSelectItem("chapter_07", "新来的语文老师与菊花茶", 2, 7),
            ChapterSelectItem("chapter_08", "四份生日礼与校门口的相遇", 3, 8),
            ChapterSelectItem("chapter_09", "红汤翻滚的暗流与歌乐山的映山红", 3, 9),
            ChapterSelectItem("chapter_10", "腾格里的银河与许愿瓶", 3, 10),
            ChapterSelectItem("chapter_11", "南山的烟火与四份新年愿", 3, 11),
            ChapterSelectItem("chapter_12", "长白山的雪与温泉边的约定", 4, 12),
            ChapterSelectItem("chapter_13", "喀纳斯的金色秋天", 4, 13),
            ChapterSelectItem("chapter_14", "校园里的春日日常", 4, 14)
        )
    }

    private fun extractChapterTitle(chapterId: String, number: Int): String {
        val titles = mapOf(
            "chapter_01" to "立信的蝉鸣与羽毛球拍",
            "chapter_02" to "图书馆的灯与金佛山的云",
            "chapter_03" to "中核的围墙与腾格里的星",
            "chapter_04" to "三十二中的爬山虎与酱肉包",
            "chapter_05" to "主席台上的重逢与徒步攻略",
            "chapter_06" to "突然出现的背包与麦理浩径",
            "chapter_07" to "新来的语文老师与菊花茶",
            "chapter_08" to "四份生日礼与校门口的相遇",
            "chapter_09" to "红汤翻滚的暗流与歌乐山的映山红",
            "chapter_10" to "腾格里的银河与许愿瓶",
            "chapter_11" to "南山的烟火与四份新年愿",
            "chapter_12" to "长白山的雪与温泉边的约定",
            "chapter_13" to "喀纳斯的金色秋天",
            "chapter_14" to "校园里的春日日常"
        )
        return titles[chapterId] ?: "第${number}章"
    }
}