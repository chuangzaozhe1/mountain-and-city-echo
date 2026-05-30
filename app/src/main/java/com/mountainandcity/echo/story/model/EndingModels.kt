package com.mountainandcity.echo.story.model

/**
 * 结局类型
 */
enum class EndingType(val displayName: String) {
    SUWAN_ENDING("月光结局"),
    LINXI_ENDING("林溪结局"),
    JIANGWAN_ENDING("江晚结局"),
    CHENXI_ENDING("陈曦结局"),
    PERFECT_ENDING("完美结局")
}

/**
 * 计算结局类型
 * @param bondPoints 各角色的羁绊值
 */
fun calculateEndingType(bondPoints: Map<String, Int>): EndingType {
    val maxPoints = bondPoints.values.maxOrNull() ?: 0
    val maxCharacters = bondPoints.filter { it.value == maxPoints }.keys

    // 如果四个角色全满，触发完美结局
    val allFullHearts = CharacterEnum.entries
        .filter { it != CharacterEnum.TANGXIN }
        .all { (bondPoints[it.info.characterId] ?: 0) >= 50 }

    if (allFullHearts) {
        return EndingType.PERFECT_ENDING
    }

    // 如果只有一个角色最高
    if (maxCharacters.size == 1) {
        return when (maxCharacters.first()) {
            "suwan" -> EndingType.SUWAN_ENDING
            "linxi" -> EndingType.LINXI_ENDING
            "jiangwan" -> EndingType.JIANGWAN_ENDING
            "chenxi" -> EndingType.CHENXI_ENDING
            else -> EndingType.SUWAN_ENDING
        }
    }

    // 如果多个角色并列最高，默认月光结局（苏晚）
    return EndingType.SUWAN_ENDING
}

/**
 * 羁绊心数计算：每 10 点升 1 颗心
 */
fun calculateHearts(bondPoints: Int): Int = (bondPoints / 10).coerceIn(0, 5)
