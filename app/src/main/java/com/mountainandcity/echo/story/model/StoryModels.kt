package com.mountainandcity.echo.story.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

/**
 * 章节数据模型
 */
@Serializable
data class ChapterData(
    @SerialName("chapterId") val chapterId: String,
    @SerialName("title") val title: String,
    @SerialName("volume") val volume: Int,
    @SerialName("number") val number: Int,
    @SerialName("unlockCondition") val unlockCondition: String? = null,
    @SerialName("scenes") val scenes: List<SceneData> = emptyList()
)

/**
 * 场景数据模型
 */
@Serializable
data class SceneData(
    @SerialName("sceneId") val sceneId: String,
    @SerialName("background") val background: String,
    @SerialName("bgm") val bgm: String? = null,
    @SerialName("characters") val characters: List<CharacterInScene> = emptyList(),
    @SerialName("dialogues") val dialogues: List<DialogueData> = emptyList(),
    @SerialName("choices") val choices: List<ChoiceData>? = null,
    @SerialName("unlockPhoto") val unlockPhoto: String? = null,
    @SerialName("bondChanges") val bondChanges: Map<String, Int>? = null
)

/**
 * 场景中的角色
 */
@Serializable
data class CharacterInScene(
    @SerialName("characterId") val characterId: String,
    @SerialName("position") val position: String, // left, center, right
    @SerialName("expression") val expression: String = "normal"
)

/**
 * 对话数据模型
 */
@Serializable
data class DialogueData(
    @SerialName("dialogueId") val dialogueId: String,
    @SerialName("speaker") val speaker: String,
    @SerialName("text") val text: String
)

/**
 * 选择数据模型
 */
@Serializable
data class ChoiceData(
    @SerialName("choiceId") val choiceId: String,
    @SerialName("text") val text: String,
    @SerialName("nextSceneId") val nextSceneId: String,
    @SerialName("bondChanges") val bondChanges: Map<String, Int>? = null
)
