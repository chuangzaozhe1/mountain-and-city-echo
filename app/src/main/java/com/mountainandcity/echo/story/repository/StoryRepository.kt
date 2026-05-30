package com.mountainandcity.echo.story.repository

import android.content.Context
import com.mountainandcity.echo.story.model.ChapterData
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class StoryRepository @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private val json = Json {
        ignoreUnknownKeys = true
        isLenient = true
    }

    /**
     * 加载章节数据
     */
    suspend fun loadChapter(chapterId: String): Result<ChapterData> = withContext(Dispatchers.IO) {
        runCatching {
            val fileName = "story/$chapterId.json"
            val jsonString = context.assets.open(fileName).bufferedReader().use { it.readText() }
            json.decodeFromString<ChapterData>(jsonString)
        }
    }

    /**
     * 获取章节列表（从 assets/story 目录）
     */
    suspend fun getChapterList(): Result<List<String>> = withContext(Dispatchers.IO) {
        runCatching {
            val files = context.assets.list("story") ?: emptyArray()
            files.filter { it.endsWith(".json") }
                .map { it.removeSuffix(".json") }
                .sorted()
        }
    }

    /**
     * 检查章节文件是否存在
     */
    suspend fun chapterExists(chapterId: String): Boolean = withContext(Dispatchers.IO) {
        try {
            context.assets.open("story/$chapterId.json").close()
            true
        } catch (e: Exception) {
            false
        }
    }
}