package com.mountainandcity.echo.feature.hiking

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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mountainandcity.echo.theme.Background
import com.mountainandcity.echo.theme.OnBackground
import com.mountainandcity.echo.theme.Primary

data class HikingRoute(
    val id: String,
    val name: String,
    val location: String,
    val isUnlocked: Boolean,
    val nodeCount: Int,
    val completedNodes: Int = 0,
    val unlockChapter: String
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HikingMapScreen(
    onNavigateBack: () -> Unit,
    onNavigateToStory: (String) -> Unit
) {
    val routes = listOf(
        HikingRoute("route_01", "歌乐山", "重庆·沙坪坝", true, 5, 3, "chapter_09"),
        HikingRoute("route_02", "金佛山", "重庆·南川", false, 5, 0, "chapter_02"),
        HikingRoute("route_03", "腾格里沙漠", "内蒙古·阿拉善", false, 5, 0, "chapter_10"),
        HikingRoute("route_04", "长白山", "吉林·安图", false, 5, 0, "chapter_12"),
        HikingRoute("route_05", "喀纳斯", "新疆·布尔津", false, 5, 0, "chapter_13")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(OnBackground)
    ) {
        TopAppBar(
            title = {
                Text(
                    text = "徒步地图",
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
            // 地图说明
            Text(
                text = "跟随主线剧情解锁徒步路线，完成节点可获得羁绊值",
                color = Color.Gray,
                fontSize = 14.sp,
                modifier = Modifier.padding(bottom = 8.dp)
            )

            // 路线列表
            routes.forEach { route ->
                HikingRouteCard(
                    route = route,
                    onClick = {
                        if (route.isUnlocked) {
                            onNavigateToStory(route.unlockChapter)
                        }
                    }
                )
            }
        }
    }
}

@Composable
private fun HikingRouteCard(
    route: HikingRoute,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(
                if (route.isUnlocked) Primary.copy(alpha = 0.1f)
                else Color.Gray.copy(alpha = 0.1f)
            )
            .clickable(enabled = route.isUnlocked) { onClick() }
            .padding(16.dp)
    ) {
        // 路线名称
        Text(
            text = route.name,
            fontSize = 20.sp,
            fontWeight = FontWeight.Bold,
            color = if (route.isUnlocked) Primary else Color.Gray
        )

        Text(
            text = route.location,
            fontSize = 14.sp,
            color = Color.Gray
        )

        Spacer(modifier = Modifier.height(12.dp))

        // 节点进度
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            // 节点指示器
            Row(
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                repeat(route.nodeCount) { index ->
                    Box(
                        modifier = Modifier
                            .size(12.dp)
                            .clip(CircleShape)
                            .background(
                                if (index < route.completedNodes) Primary
                                else if (route.isUnlocked) Primary.copy(alpha = 0.3f)
                                else Color.Gray.copy(alpha = 0.3f)
                            )
                    )
                }
            }

            // 状态
            Text(
                text = if (!route.isUnlocked) "🔒 解锁：${route.unlockChapter.removePrefix("chapter_")}章"
                       else "${route.completedNodes}/${route.nodeCount} 节点",
                fontSize = 12.sp,
                color = Color.Gray
            )
        }
    }
}