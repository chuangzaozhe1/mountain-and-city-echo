package com.mountainandcity.echo.feature.settings

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.VolumeUp
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SettingsScreen(
    onNavigateBack: () -> Unit,
    onNavigateToSaveLoad: () -> Unit,
    viewModel: SettingsViewModel = hiltViewModel()
) {
    val readingSettings by viewModel.readingSettings.collectAsState()
    val audioSettings by viewModel.audioSettings.collectAsState()
    var showResetDialog by remember { mutableStateOf(false) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "设置",
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

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // 阅读设置
            SettingsSection(title = "阅读设置") {
                SettingsItem(
                    icon = Icons.AutoMirrored.Filled.List,
                    title = "文本速度",
                    subtitle = when (readingSettings.textSpeed) {
                        "SLOW" -> "慢"
                        "MEDIUM" -> "中"
                        "FAST" -> "快"
                        else -> "中"
                    },
                    onClick = { viewModel.cycleTextSpeed() }
                )

                SettingsItem(
                    icon = Icons.AutoMirrored.Filled.List,
                    title = "打字机效果",
                    subtitle = if (readingSettings.typewriterEnabled) "开启" else "关闭",
                    onClick = { viewModel.toggleTypewriter() }
                )

                SettingsItem(
                    icon = Icons.AutoMirrored.Filled.List,
                    title = "屏幕常亮",
                    subtitle = if (readingSettings.keepScreenOn) "开启" else "关闭",
                    onClick = { viewModel.toggleKeepScreenOn() }
                )
            }

            // 音频设置
            SettingsSection(title = "音频设置") {
                var bgmVolume by remember { mutableFloatStateOf(audioSettings.bgmVolume) }
                var sfxVolume by remember { mutableFloatStateOf(audioSettings.sfxVolume) }

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White.copy(alpha = 0.05f))
                        .padding(16.dp)
                ) {
                    Text(
                        text = "背景音乐",
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Slider(
                            value = bgmVolume,
                            onValueChange = { bgmVolume = it },
                            onValueChangeFinished = { viewModel.setBgmVolume(bgmVolume) },
                            modifier = Modifier.weight(1f),
                            colors = SliderDefaults.colors(
                                thumbColor = Primary,
                                activeTrackColor = Primary
                            )
                        )
                        Text(
                            text = "${(bgmVolume * 100).toInt()}%",
                            fontSize = 12.sp,
                            color = Color.Gray,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        text = "音效",
                        fontSize = 14.sp,
                        color = Color.Gray
                    )
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Slider(
                            value = sfxVolume,
                            onValueChange = { sfxVolume = it },
                            onValueChangeFinished = { viewModel.setSfxVolume(sfxVolume) },
                            modifier = Modifier.weight(1f),
                            colors = SliderDefaults.colors(
                                thumbColor = Primary,
                                activeTrackColor = Primary
                            )
                        )
                        Text(
                            text = "${(sfxVolume * 100).toInt()}%",
                            fontSize = 12.sp,
                            color = Color.Gray,
                            modifier = Modifier.padding(start = 8.dp)
                        )
                    }
                }
            }

            // 存档管理
            SettingsSection(title = "存档管理") {
                SettingsItem(
                    icon = Icons.AutoMirrored.Filled.List,
                    title = "存档管理",
                    subtitle = "查看、删除存档",
                    onClick = onNavigateToSaveLoad
                )
            }

            // 关于
            SettingsSection(title = "关于") {
                SettingsItem(
                    icon = Icons.Default.Info,
                    title = "应用版本",
                    subtitle = "1.0.0 个人娱乐版",
                    onClick = { }
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // 重置游戏
            Text(
                text = "清除所有存档和进度",
                fontSize = 14.sp,
                color = Color.Red,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(Color.Red.copy(alpha = 0.1f))
                    .clickable { showResetDialog = true }
                    .padding(16.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center
            )
        }
    }

    if (showResetDialog) {
        AlertDialog(
            onDismissRequest = { showResetDialog = false },
            title = { Text("重置游戏") },
            text = { Text("确定要清除所有存档和进度吗？此操作不可撤销。") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.resetGame()
                        showResetDialog = false
                    }
                ) {
                    Text("确定", color = Color.Red)
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetDialog = false }) {
                    Text("取消")
                }
            }
        )
    }
}

@Composable
private fun SettingsSection(
    title: String,
    content: @Composable () -> Unit
) {
    Column {
        Text(
            text = title,
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Primary,
            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
        )
        content()
    }
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.White.copy(alpha = 0.05f))
            .clickable { onClick() }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = Primary,
            modifier = Modifier.padding(end = 12.dp)
        )

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title,
                fontSize = 16.sp,
                color = OnBackground
            )
            Text(
                text = subtitle,
                fontSize = 12.sp,
                color = Color.Gray
            )
        }

        Icon(
            imageVector = Icons.Default.ChevronRight,
            contentDescription = null,
            tint = Color.Gray
        )
    }
}