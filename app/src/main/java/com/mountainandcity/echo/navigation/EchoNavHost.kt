package com.mountainandcity.echo.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.mountainandcity.echo.feature.album.AlbumScreen
import com.mountainandcity.echo.feature.character.CharacterDetailScreen
import com.mountainandcity.echo.feature.character.CharacterGalleryScreen
import com.mountainandcity.echo.feature.home.HomeScreen
import com.mountainandcity.echo.feature.home.SplashScreen
import com.mountainandcity.echo.feature.hiking.HikingMapScreen
import com.mountainandcity.echo.feature.settings.SaveLoadScreen
import com.mountainandcity.echo.feature.settings.SettingsScreen
import com.mountainandcity.echo.feature.story.ChapterSelectScreen
import com.mountainandcity.echo.feature.story.StoryScreen

@Composable
fun EchoNavHost(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = Screen.Splash.route,
        enterTransition = {
            slideIntoContainer(
                towards = AnimatedContentTransitionScope.SlideDirection.Left,
                animationSpec = tween(300)
            )
        },
        exitTransition = {
            slideOutOfContainer(
                towards = AnimatedContentTransitionScope.SlideDirection.Left,
                animationSpec = tween(300)
            )
        },
        popEnterTransition = {
            slideIntoContainer(
                towards = AnimatedContentTransitionScope.SlideDirection.Right,
                animationSpec = tween(300)
            )
        },
        popExitTransition = {
            slideOutOfContainer(
                towards = AnimatedContentTransitionScope.SlideDirection.Right,
                animationSpec = tween(300)
            )
        }
    ) {
        composable(Screen.Splash.route) {
            SplashScreen(
                onNavigateToHome = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.Splash.route) { inclusive = true }
                    }
                }
            )
        }

        composable(Screen.Home.route) {
            HomeScreen(
                onNavigateToStory = { chapterId ->
                    navController.navigate(Screen.Story.createRoute(chapterId))
                },
                onNavigateToChapterSelect = {
                    navController.navigate(Screen.ChapterSelect.route)
                },
                onNavigateToAlbum = {
                    navController.navigate(Screen.Album.route)
                },
                onNavigateToSettings = {
                    navController.navigate(Screen.Settings.route)
                },
                onNavigateToHikingMap = {
                    navController.navigate(Screen.HikingMap.route)
                }
            )
        }

        composable(
            route = Screen.Story.route,
            arguments = listOf(navArgument("chapterId") { type = NavType.StringType })
        ) { backStackEntry ->
            val chapterId = backStackEntry.arguments?.getString("chapterId") ?: "chapter_01"
            StoryScreen(
                chapterId = chapterId,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.HikingMap.route) {
            HikingMapScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToStory = { chapterId ->
                    navController.navigate(Screen.Story.createRoute(chapterId))
                }
            )
        }

        composable(Screen.Album.route) {
            AlbumScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.CharacterGallery.route) {
            CharacterGalleryScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToDetail = { characterId ->
                    navController.navigate(Screen.CharacterDetail.createRoute(characterId))
                }
            )
        }

        composable(
            route = Screen.CharacterDetail.route,
            arguments = listOf(navArgument("characterId") { type = NavType.StringType })
        ) { backStackEntry ->
            val characterId = backStackEntry.arguments?.getString("characterId") ?: ""
            CharacterDetailScreen(
                characterId = characterId,
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.Settings.route) {
            SettingsScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToSaveLoad = {
                    navController.navigate(Screen.SaveLoad.route)
                }
            )
        }

        composable(Screen.SaveLoad.route) {
            SaveLoadScreen(
                onNavigateBack = { navController.popBackStack() }
            )
        }

        composable(Screen.ChapterSelect.route) {
            ChapterSelectScreen(
                onNavigateBack = { navController.popBackStack() },
                onNavigateToStory = { chapterId ->
                    navController.navigate(Screen.Story.createRoute(chapterId))
                }
            )
        }
    }
}