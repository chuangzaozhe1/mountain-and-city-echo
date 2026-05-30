package com.mountainandcity.echo.feature.settings

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
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
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
import androidx.hilt.navigation.compose.hiltViewModel
import com.mountainandcity.echo.core.database.SaveEntity
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SaveLoadScreen(
    onNavigateBack: () -> Unit,
    viewModel: SaveLoadViewModel = hiltViewModel()
) {
    val saves by viewModel.saves.collectAsState()
    var showDeleteDialog by remember { mutableStateOf<Int?>(null) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "存档管理",
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
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            // 手动存档
            item {
                Text(
                    text = "手动存档",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Primary,
                    modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                )
            }

            items(saves.filter { it.slotId >= 0 && !it.isAutoSave && !it.isQuickSave }) { save ->
                SaveSlotCard(
                    save = save,
                    onDelete = { showDeleteDialog = save.slotId }
                )
            }

            if (saves.filter { it.slotId >= 0 && !it.isAutoSave && !it.isQuickSave }.isEmpty()) {
                item {
                    EmptySlot()
                }
            }

            // 特殊存档
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    text = "快速存档",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Primary,
                    modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                )
            }

            items(saves.filter { it.isQuickSave }) { save ->
                SaveSlotCard(
                    save = save,
                    title = "快速存档",
                    onDelete = { viewModel.deleteSave(save.slotId) }
                )
            }

            if (saves.none { it.isQuickSave }) {
                item {
                    Text(
                        text = "暂无快速存档",
                        fontSize = 14.sp,
                        color = Color.Gray,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(12.dp))
                            .background(Color.Gray.copy(alpha = 0.1f))
                            .padding(16.dp)
                    )
                }
            }
        }
    }

    showDeleteDialog?.let { slotId ->
        AlertDialog(
            onDismissRequest = { showDeleteDialog = null },
            title = { Text("删除存档") },
            text = { Text("确定要删除这个存档吗？此操作不可撤销。") },
            confirmButton = {
                TextButton(
                    onClick = {
                        viewModel.deleteSave(slotId)
                        showDeleteDialog = null
                    }
                ) {
                    Text("删除", color = Color.Red)
                }
            },
            dismissButton = {
                TextButton(onClick = { showDeleteDialog = null }) {
                    Text("取消")
                }
            }
        )
    }
}

@Composable
private fun SaveSlotCard(
    save: SaveEntity,
    title: String? = null,
    onDelete: () -> Unit
) {
    val dateFormat = remember { SimpleDateFormat("yyyy-MM-dd HH:mm", Locale.getDefault()) }

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Primary.copy(alpha = 0.1f))
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // 缩略图
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Primary.copy(alpha = 0.3f)),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "📷", fontSize = 24.sp)
        }

        Spacer(modifier = Modifier.width(16.dp))

        Column(modifier = Modifier.weight(1f)) {
            Text(
                text = title ?: "存档 ${save.slotId}",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = OnBackground
            )
            Text(
                text = save.chapterId.replace("chapter_", "第") + "章",
                fontSize = 14.sp,
                color = Color.Gray
            )
            Text(
                text = dateFormat.format(Date(save.saveTime)),
                fontSize = 12.sp,
                color = Color.Gray
            )
        }

        IconButton(onClick = onDelete) {
            Icon(
                imageVector = Icons.Default.Delete,
                contentDescription = "删除",
                tint = Color.Red
            )
        }
    }
}

@Composable
private fun EmptySlot() {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(Color.Gray.copy(alpha = 0.1f))
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(60.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color.Gray.copy(alpha = 0.2f)),
            contentAlignment = Alignment.Center
        ) {
            Text(text = "📭", fontSize = 24.sp)
        }

        Spacer(modifier = Modifier.width(16.dp))

        Text(
            text = "暂无存档",
            fontSize = 14.sp,
            color = Color.Gray
        )
    }
}