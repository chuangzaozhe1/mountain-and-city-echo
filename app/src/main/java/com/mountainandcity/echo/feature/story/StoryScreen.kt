package com.mountainandcity.echo.feature.story

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableLongStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.mountainandcity.echo.story.StoryViewModel
import com.mountainandcity.echo.story.model.CharacterEnum
import kotlinx.coroutines.launch
import com.mountainandcity.echo.theme.ChenxiColor
import com.mountainandcity.echo.theme.LinxiColor
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary
import com.mountainandcity.echo.theme.SuwanColor

@Composable
fun StoryScreen(
    chapterId: String,
    onNavigateBack: () -> Unit,
    viewModel: StoryViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val scope = rememberCoroutineScope()

    LaunchedEffect(chapterId) {
        viewModel.loadChapter(chapterId)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black)
    ) {
        when {
            uiState.isLoading -> {
                LoadingContent()
            }
            uiState.error != null -> {
                ErrorContent(
                    error = uiState.error!!,
                    onNavigateBack = onNavigateBack
                )
            }
            uiState.isChapterComplete -> {
                ChapterCompleteContent(
                    nextChapterId = uiState.nextChapterId,
                    onContinue = { nextId ->
                        if (nextId != null) {
                            scope.launch {
                                viewModel.loadChapter(nextId)
                            }
                        } else {
                            onNavigateBack()
                        }
                    },
                    onBack = onNavigateBack
                )
            }
            else -> {
                StoryContent(
                    uiState = uiState,
                    onScreenTap = { viewModel.nextDialogue() },
                    onLongPress = { viewModel.resetTextAnimation() },
                    onChoiceSelected = { viewModel.makeChoice(it) }
                )
            }
        }
    }
}

@Composable
private fun LoadingContent() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator(color = Primary)
    }
}

@Composable
private fun ErrorContent(
    error: String,
    onNavigateBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "加载失败",
            color = Color.White,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = error,
            color = Color.Gray,
            fontSize = 14.sp
        )
        Spacer(modifier = Modifier.height(32.dp))
        Button(
            onClick = onNavigateBack,
            colors = ButtonDefaults.buttonColors(containerColor = Primary)
        ) {
            Text("返回")
        }
    }
}

@Composable
private fun ChapterCompleteContent(
    nextChapterId: String?,
    onContinue: (String?) -> Unit,
    onBack: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = "本章完",
            color = Primary,
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(48.dp))

        if (nextChapterId != null) {
            Button(
                onClick = { onContinue(nextChapterId) },
                modifier = Modifier.width(200.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Primary)
            ) {
                Text("下一章")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = { onContinue(null) },
            modifier = Modifier.width(200.dp),
            colors = ButtonDefaults.buttonColors(containerColor = Primary.copy(alpha = 0.2f))
        ) {
            Text("返回首页", color = Primary)
        }
    }
}

@Composable
private fun StoryContent(
    uiState: com.mountainandcity.echo.story.StoryUiState,
    onScreenTap: () -> Unit,
    onLongPress: () -> Unit,
    onChoiceSelected: (String) -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .pointerInput(Unit) {
                detectTapGestures(
                    onTap = { onScreenTap() },
                    onLongPress = { onLongPress() }
                )
            }
    ) {
        // 背景图
        BackgroundLayer(background = uiState.currentScene?.background)

        // 角色立绘
        CharacterSpritesLayer(
            characters = uiState.currentScene?.characters ?: emptyList()
        )

        // 对话框
        DialogueBox(
            modifier = Modifier.align(Alignment.BottomCenter),
            uiState = uiState
        )

        // 选择按钮
        AnimatedVisibility(
            visible = uiState.choices.isNotEmpty(),
            enter = fadeIn() + slideInVertically { it },
            exit = fadeOut() + slideOutVertically { it },
            modifier = Modifier.align(Alignment.Center)
        ) {
            ChoiceButtons(
                choices = uiState.choices,
                onChoiceSelected = onChoiceSelected
            )
        }

        // 羁绊增加提示
        AnimatedVisibility(
            visible = uiState.showBondIncrease && uiState.lastIncreasedCharacter != null,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier.align(Alignment.Center)
        ) {
            BondIncreaseHint(
                character = uiState.lastIncreasedCharacter,
                points = uiState.lastIncreasedPoints
            )
        }
    }
}

@Composable
private fun BackgroundLayer(background: String?) {
    // 加载背景图（暂时使用纯色占位）
    val backgroundColor = when {
        background?.contains("school") == true -> Color(0xFF87CEEB)
        background?.contains("library") == true -> Color(0xFFDEB887)
        background?.contains("station") == true -> Color(0xFF696969)
        else -> Color(0xFF1A1A2E)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(backgroundColor)
    )
}

@Composable
private fun CharacterSpritesLayer(
    characters: List<com.mountainandcity.echo.story.model.CharacterInScene>
) {
    Box(modifier = Modifier.fillMaxSize()) {
        characters.forEach { char ->
            val position = when (char.position) {
                "left" -> Alignment.BottomStart
                "right" -> Alignment.BottomEnd
                else -> Alignment.BottomCenter
            }

            val alignment = when (position) {
                Alignment.BottomStart -> Alignment.BottomStart
                Alignment.BottomEnd -> Alignment.BottomEnd
                else -> Alignment.BottomCenter
            }

            val offsetX = when (char.position) {
                "left" -> 50.dp
                "right" -> (-50).dp
                else -> 0.dp
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(start = offsetX, bottom = 200.dp),
                contentAlignment = alignment
            ) {
                // 角色颜色占位圆
                val charColor = getCharacterColor(char.characterId)
                Box(
                    modifier = Modifier
                        .width(120.dp)
                        .height(300.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(charColor.copy(alpha = 0.7f))
                )
            }
        }
    }
}

private fun getCharacterColor(characterId: String): Color {
    return when (characterId) {
        "tangxin" -> Color(0xFF8B4513)
        "suwan" -> SuwanColor
        "linxi" -> LinxiColor
        "jiangwan" -> Color(0xFF7B4397)
        "chenxi" -> ChenxiColor
        else -> Color.Gray
    }
}

@Composable
private fun DialogueBox(
    modifier: Modifier = Modifier,
    uiState: com.mountainandcity.echo.story.StoryUiState
) {
    val dialogue = uiState.currentDialogue ?: return

    val speakerColor = when (dialogue.speaker) {
        "唐鑫" -> Color(0xFF8B4513)
        "苏晚" -> SuwanColor
        "林溪" -> LinxiColor
        "江晚" -> Color(0xFF7B4397)
        "陈曦" -> ChenxiColor
        else -> Color.White
    }

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {
        // 角色名
        if (dialogue.speaker != "旁白") {
            Text(
                text = dialogue.speaker,
                color = speakerColor,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(start = 16.dp, bottom = 4.dp)
            )
        }

        // 对话框
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White.copy(alpha = 0.85f))
                .padding(16.dp)
        ) {
            Text(
                text = uiState.displayedText,
                color = OnBackground,
                fontSize = 16.sp,
                lineHeight = 24.sp
            )
        }
    }
}

@Composable
private fun ChoiceButtons(
    choices: List<com.mountainandcity.echo.story.model.ChoiceData>,
    onChoiceSelected: (String) -> Unit
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        modifier = Modifier.padding(32.dp)
    ) {
        choices.forEach { choice ->
            Button(
                onClick = { onChoiceSelected(choice.choiceId) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(24.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Primary)
            ) {
                Text(
                    text = choice.text,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }
}

@Composable
private fun BondIncreaseHint(
    character: CharacterEnum?,
    points: Int
) {
    character ?: return

    val color = character.info.color
    val name = character.info.name

    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Color.Black.copy(alpha = 0.7f))
            .padding(24.dp)
    ) {
        Text(
            text = "$name",
            color = color,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(8.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(points.coerceAtMost(5)) {
                Text(
                    text = "♡",
                    color = Color.Red,
                    fontSize = 24.sp
                )
            }
            Text(
                text = " +$points",
                color = Color.White,
                fontSize = 18.sp
            )
        }
    }
}