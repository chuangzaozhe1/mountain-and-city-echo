package com.mountainandcity.echo.navigation

sealed class Screen(val route: String) {
    data object Splash : Screen("splash")
    data object Home : Screen("home")
    data object Story : Screen("story/{chapterId}") {
        fun createRoute(chapterId: String) = "story/$chapterId"
    }
    data object HikingMap : Screen("hiking_map")
    data object Album : Screen("album")
    data object CharacterGallery : Screen("character_gallery")
    data object CharacterDetail : Screen("character_detail/{characterId}") {
        fun createRoute(characterId: String) = "character_detail/$characterId"
    }
    data object Settings : Screen("settings")
    data object SaveLoad : Screen("save_load")
    data object ChapterSelect : Screen("chapter_select")
}