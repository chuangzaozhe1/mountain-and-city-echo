package com.mountainandcity.echo.feature.home

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.mountainandcity.echo.feature.home.HomeViewModel
import com.mountainandcity.echo.theme.Background
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary

@Composable
fun HomeScreen(
    onNavigateToStory: (String) -> Unit,
    onNavigateToChapterSelect: () -> Unit,
    onNavigateToAlbum: () -> Unit,
    onNavigateToSettings: () -> Unit,
    onNavigateToHikingMap: () -> Unit,
    viewModel: HomeViewModel = hiltViewModel()
) {
    val hasAutoSave by viewModel.hasAutoSave.collectAsState()
    val hasQuickSave by viewModel.hasQuickSave.collectAsState()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    colors = listOf(
                        Color(0xFF1A1A2E),
                        Background
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Logo 和标语
            Text(
                text = "山与城的回响",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = Primary
            )

            Text(
                text = "\"我们不是彼此的替代品，而是四季不同的花\"",
                fontSize = 12.sp,
                color = OnBackground.copy(alpha = 0.6f),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 8.dp)
            )

            Spacer(modifier = Modifier.height(60.dp))

            // 主按钮
            HomeButton(
                text = if (hasAutoSave) "继续游戏" else "新的开始",
                modifier = Modifier.fillMaxWidth()
            ) {
                viewModel.autoSaveChapterId.value?.let { chapterId ->
                    onNavigateToStory(chapterId)
                } ?: onNavigateToStory("chapter_01")
            }

            HomeButton(
                text = "章节选择",
                modifier = Modifier.fillMaxWidth(),
                isSecondary = true
            ) {
                onNavigateToChapterSelect()
            }

            HomeButton(
                text = "回忆相册",
                modifier = Modifier.fillMaxWidth(),
                isSecondary = true
            ) {
                onNavigateToAlbum()
            }

            HomeButton(
                text = "设置",
                modifier = Modifier.fillMaxWidth(),
                isSecondary = true
            ) {
                onNavigateToSettings()
            }
        }

        // 右下角徒步地图按钮
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(24.dp)
                .size(56.dp)
                .clip(CircleShape)
                .background(Primary)
                .clickable { onNavigateToHikingMap() },
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = "🗺️",
                fontSize = 24.sp
            )
        }

        // 底部版权信息
        Text(
            text = "个人娱乐版 · 非商用",
            fontSize = 10.sp,
            color = OnBackground.copy(alpha = 0.4f),
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 16.dp)
        )
    }
}

@Composable
private fun HomeButton(
    text: String,
    modifier: Modifier = Modifier,
    isSecondary: Boolean = false,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier
            .padding(vertical = 8.dp)
            .height(56.dp),
        shape = RoundedCornerShape(24.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSecondary) OnBackground.copy(alpha = 0.1f) else Primary
        )
    ) {
        Text(
            text = text,
            fontSize = 16.sp,
            fontWeight = FontWeight.Medium,
            color = if (isSecondary) OnBackground else Color.White
        )
    }
}