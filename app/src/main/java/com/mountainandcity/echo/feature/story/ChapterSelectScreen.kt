package com.mountainandcity.echo.feature.story

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChapterSelectScreen(
    onNavigateBack: () -> Unit,
    onNavigateToStory: (String) -> Unit,
    viewModel: ChapterSelectViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadChapters()
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "章节选择",
                    color = Color.White,
                    fontWeight = FontWeight.Bold
                )
            },
            navigationIcon = {
                IconButton(onClick = onNavigateBack) {
                    Icon(
                        Icons.AutoMirrored.Filled.ArrowBack,
                        contentDescription = "返回",
                        tint = Color.White
                    )
                }
            },
            colors = TopAppBarDefaults.topAppBarColors(
                containerColor = Primary
            )
        )

        if (uiState.isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = Primary)
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(uiState.chapters) { chapter ->
                    ChapterItem(
                        chapter = chapter,
                        isUnlocked = uiState.unlockedChapters.contains(chapter.chapterId),
                        onClick = {
                            if (uiState.unlockedChapters.contains(chapter.chapterId)) {
                                onNavigateToStory(chapter.chapterId)
                            }
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun ChapterItem(
    chapter: ChapterSelectItem,
    isUnlocked: Boolean,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(
                if (isUnlocked) Primary.copy(alpha = 0.1f)
                else Color.Gray.copy(alpha = 0.1f)
            )
            .clickable(enabled = isUnlocked) { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 状态图标
        Box(
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(if (isUnlocked) Primary else Color.Gray.copy(alpha = 0.5f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (chapter.isCompleted) Icons.Default.Check else if (isUnlocked) Icons.Default.Check else Icons.Default.Lock,
                contentDescription = null,
                tint = Color.White,
                modifier = Modifier.size(24.dp)
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        // 章节信息
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = "第${chapter.number}章",
                fontSize = 14.sp,
                color = if (isUnlocked) Primary else Color.Gray
            )
            Text(
                text = chapter.title,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = if (isUnlocked) OnBackground else Color.Gray
            )
        }

        // 卷标签
        Text(
            text = "卷${chapter.volume}",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier
                .clip(RoundedCornerShape(8.dp))
                .background(Color.Gray.copy(alpha = 0.1f))
                .padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}

data class ChapterSelectItem(
    val chapterId: String,
    val title: String,
    val volume: Int,
    val number: Int,
    val isCompleted: Boolean = false
)

data class ChapterSelectUiState(
    val isLoading: Boolean = true,
    val chapters: List<ChapterSelectItem> = emptyList(),
    val unlockedChapters: List<String> = listOf("chapter_01") // 默认解锁第一章
)