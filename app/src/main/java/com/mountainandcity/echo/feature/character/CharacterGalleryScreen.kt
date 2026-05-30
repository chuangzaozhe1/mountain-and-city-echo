package com.mountainandcity.echo.feature.character

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
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mountainandcity.echo.story.model.CharacterEnum
import com.mountainandcity.echo.theme.ChenxiColor
import com.mountainandcity.echo.theme.JiangwanColor
import com.mountainandcity.echo.theme.LinxiColor
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary
import com.mountainandcity.echo.theme.SuwanColor

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharacterGalleryScreen(
    onNavigateBack: () -> Unit,
    onNavigateToDetail: (String) -> Unit
) {
    val characters = remember {
        CharacterEnum.entries.filter { it != CharacterEnum.TANGXIN }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "角色图鉴",
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

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(characters) { character ->
                CharacterCard(
                    character = character,
                    bondPoints = 15, // TODO: 从数据库获取
                    onClick = { onNavigateToDetail(character.info.characterId) }
                )
            }
        }
    }
}

@Composable
private fun CharacterCard(
    character: CharacterEnum,
    bondPoints: Int,
    onClick: () -> Unit
) {
    val color = character.info.color
    val hearts = bondPoints / 10

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.15f))
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 头像
        Box(
            modifier = Modifier
                .size(80.dp)
                .clip(CircleShape)
                .background(color),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = character.info.name.first().toString(),
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        Spacer(modifier = Modifier.width(16.dp))

        // 信息
        Column(
            modifier = Modifier.weight(1f)
        ) {
            Text(
                text = character.info.name,
                fontSize = 22.sp,
                fontWeight = FontWeight.Bold,
                color = OnBackground
            )

            Text(
                text = character.info.identity,
                fontSize = 14.sp,
                color = Color.Gray
            )

            Spacer(modifier = Modifier.height(8.dp))

            // 羁绊心
            Row {
                repeat(5) { index ->
                    Text(
                        text = if (index < hearts) "❤️" else "🖤",
                        fontSize = 16.sp
                    )
                }
            }

            Text(
                text = "${character.info.representImage}",
                fontSize = 12.sp,
                color = color,
                modifier = Modifier.padding(top = 4.dp)
            )
        }

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Color.Gray
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CharacterDetailScreen(
    characterId: String,
    onNavigateBack: () -> Unit
) {
    val character = remember(characterId) {
        CharacterEnum.fromId(characterId) ?: CharacterEnum.SUWAN
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = character.info.name,
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
                containerColor = character.info.color
            )
        )

        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 角色立绘
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(300.dp)
                        .clip(RoundedCornerShape(16.dp))
                        .background(character.info.color.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "🎭",
                        fontSize = 80.sp
                    )
                }
            }

            // 基本信息
            item {
                InfoSection(
                    title = "基本信息",
                    items = listOf(
                        "身份" to character.info.identity,
                        "性格" to character.info.personality,
                        "代表意象" to character.info.representImage
                    ),
                    color = character.info.color
                )
            }

            // 羁绊进度
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(character.info.color.copy(alpha = 0.1f))
                        .padding(16.dp)
                ) {
                    Column {
                        Text(
                            text = "羁绊等级",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = character.info.color
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row {
                            repeat(5) { index ->
                                Text(
                                    text = "❤️",
                                    fontSize = 28.sp
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "相伴",
                            fontSize = 14.sp,
                            color = Color.Gray
                        )
                    }
                }
            }

            // 经典台词
            item {
                InfoSection(
                    title = "经典台词",
                    items = listOf(
                "你一定要成为更好的人。" to "",
                "以后的每一个十二年，我都想陪你走。" to ""
            ),
                    color = character.info.color
                )
            }
        }
    }
}

@Composable
private fun InfoSection(
    title: String,
    items: List<Pair<String, String>>,
    color: Color
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(color.copy(alpha = 0.1f))
            .padding(16.dp)
    ) {
        Text(
            text = title,
            fontSize = 16.sp,
            fontWeight = FontWeight.Bold,
            color = color
        )
        Spacer(modifier = Modifier.height(8.dp))
        items.forEach { (label, value) ->
            Row(
                modifier = Modifier.padding(vertical = 4.dp)
            ) {
                Text(
                    text = "$label：",
                    fontSize = 14.sp,
                    color = Color.Gray
                )
                Text(
                    text = value,
                    fontSize = 14.sp,
                    color = OnBackground
                )
            }
        }
    }
}