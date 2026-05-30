package com.mountainandcity.echo.feature.album

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
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
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary

data class PhotoItem(
    val id: String,
    val title: String,
    val category: String,
    val isUnlocked: Boolean
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AlbumScreen(
    onNavigateBack: () -> Unit
) {
    var selectedCategory by remember { mutableIntStateOf(0) }
    val categories = listOf("全部", "剧情 CG", "风景照", "五人同框")

    val allPhotos = remember {
        listOf(
            // 剧情 CG
            PhotoItem("cg_001", "操场初遇", "剧情 CG", true),
            PhotoItem("cg_002", "图书馆的灯光", "剧情 CG", true),
            PhotoItem("cg_003", "火锅局", "剧情 CG", false),
            PhotoItem("cg_004", "腾格里星空", "剧情 CG", false),
            PhotoItem("cg_005", "长白山天池", "剧情 CG", false),
            // 风景照
            PhotoItem("photo_001", "歌乐山瀑布", "风景照", true),
            PhotoItem("photo_002", "金佛山云海", "风景照", false),
            PhotoItem("photo_003", "腾格里沙漠", "风景照", false),
            PhotoItem("photo_004", "长白山雪景", "风景照", false),
            PhotoItem("photo_005", "喀纳斯湖", "风景照", false),
            // 五人同框
            PhotoItem("group_001", "歌乐山合影", "五人同框", false),
            PhotoItem("group_002", "跨年烟花", "五人同框", false),
            PhotoItem("group_003", "禾木村星空", "五人同框", false)
        )
    }

    val filteredPhotos = remember(selectedCategory, allPhotos) {
        if (selectedCategory == 0) allPhotos
        else allPhotos.filter { it.category == categories[selectedCategory] }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "回忆相册",
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

        // 分类标签
        LazyVerticalGrid(
            columns = GridCells.Fixed(4),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.height(50.dp)
        ) {
            items(categories.size) { index ->
                FilterChip(
                    selected = selectedCategory == index,
                    onClick = { selectedCategory = index },
                    label = { Text(categories[index], fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = Primary,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        // 照片网格
        LazyVerticalGrid(
            columns = GridCells.Fixed(3),
            contentPadding = PaddingValues(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.fillMaxSize()
        ) {
            items(filteredPhotos) { photo ->
                PhotoGridItem(photo = photo)
            }
        }
    }
}

@Composable
private fun PhotoGridItem(photo: PhotoItem) {
    Box(
        modifier = Modifier
            .aspectRatio(1f)
            .clip(RoundedCornerShape(8.dp))
            .background(
                if (photo.isUnlocked) Primary.copy(alpha = 0.3f)
                else Color.Gray.copy(alpha = 0.2f)
            )
            .clickable(enabled = photo.isUnlocked) { },
        contentAlignment = Alignment.Center
    ) {
        if (photo.isUnlocked) {
            // 已解锁照片显示标题
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "📷",
                    fontSize = 24.sp
                )
                Text(
                    text = photo.title,
                    fontSize = 10.sp,
                    color = Color.White
                )
            }
        } else {
            // 未解锁照片显示锁
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "🔒",
                    fontSize = 24.sp
                )
                Text(
                    text = "未解锁",
                    fontSize = 10.sp,
                    color = Color.Gray
                )
            }
        }
    }
}