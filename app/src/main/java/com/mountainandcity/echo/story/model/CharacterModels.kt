package com.mountainandcity.echo.story.model

import androidx.compose.ui.graphics.Color
import com.mountainandcity.echo.theme.ChenxiColor
import com.mountainandcity.echo.theme.LinxiColor
import com.mountainandcity.echo.theme.SuwanColor
import com.mountainandcity.echo.theme.JiangwanColor

/**
 * 角色信息
 */
data class CharacterInfo(
    val characterId: String,
    val name: String,
    val identity: String,
    val personality: String,
    val representImage: String,
    val color: Color,
    val heartLevel: Int = 0, // 0-5 颗心
    val bondPoints: Int = 0  // 羁绊值
)

/**
 * 角色枚举
 */
enum class CharacterEnum(
    val info: CharacterInfo
) {
    TANGXIN(
        CharacterInfo(
            characterId = "tangxin",
            name = "唐鑫",
            identity = "重庆三十二中行政文员",
            personality = "踏实肯干、温柔内敛、有责任心，热爱徒步",
            representImage = "蜿蜒向上的徒步山路",
            color = Color(0xFF8B4513)
        )
    ),
    SUWAN(
        CharacterInfo(
            characterId = "suwan",
            name = "苏晚",
            identity = "重庆一中语文老师",
            personality = "温柔知性、执着深情、细腻体贴",
            representImage = "羽毛球场上的月光",
            color = SuwanColor
        )
    ),
    LINXI(
        CharacterInfo(
            characterId = "linxi",
            name = "林溪",
            identity = "重庆市教育局公务员",
            personality = "干练理性、通透独立、有理想有担当",
            representImage = "图书馆的灯光",
            color = LinxiColor
        )
    ),
    JIANGWAN(
        CharacterInfo(
            characterId = "jiangwan",
            name = "江晚",
            identity = "自由设计师",
            personality = "张扬洒脱、热爱自由、敢想敢做",
            representImage = "沙漠的星空",
            color = JiangwanColor
        )
    ),
    CHENXI(
        CharacterInfo(
            characterId = "chenxi",
            name = "陈曦",
            identity = "重庆三十二中语文老师",
            personality = "青涩单纯、软萌可爱、细心温暖",
            representImage = "校园的桂花",
            color = ChenxiColor
        )
    );

    companion object {
        fun fromId(id: String): CharacterEnum? = entries.find { it.info.characterId == id }
    }
}

/**
 * 羁绊等级
 */
enum class BondLevel(val levelName: String, val minPoints: Int) {
    ESTRANGED("陌生", 0),
    ACQUAINTED("初识", 10),
    FAMILIAR("熟悉", 20),
    CLOSE("知己", 30),
    AFFECTIONATE("倾心", 40),
    ACCOMPANYING("相伴", 50);

    companion object {
        fun fromPoints(points: Int): BondLevel {
            return entries.lastOrNull { points >= it.minPoints } ?: ESTRANGED
        }

        fun fromHearts(hearts: Int): BondLevel {
            return entries.getOrNull(hearts.coerceIn(0, 5)) ?: ESTRANGED
        }
    }
}
