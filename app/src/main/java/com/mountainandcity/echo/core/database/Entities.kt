package com.mountainandcity.echo.core.database

import androidx.room.Entity
import androidx.room.PrimaryKey

/**
 * 存档实体
 */
@Entity(tableName = "saves")
data class SaveEntity(
    @PrimaryKey val slotId: Int,
    val chapterId: String,
    val sceneId: String,
    val dialogueIndex: Int,
    val thumbnail: String? = null,
    val saveTime: Long,
    val isAutoSave: Boolean = false,
    val isQuickSave: Boolean = false
)

/**
 * 羁绊实体
 */
@Entity(tableName = "bonds")
data class BondEntity(
    @PrimaryKey val characterId: String,
    val points: Int = 0
)

/**
 * 解锁内容实体
 */
@Entity(tableName = "unlocks")
data class UnlockEntity(
    @PrimaryKey val id: String,
    val type: String, // CHAPTER, PHOTO, CG, CHARACTER_STORY, HIKING_ROUTE, HIKING_NODE
    val unlockTime: Long
)

/**
 * 解锁类型枚举
 */
enum class UnlockType {
    CHAPTER,
    PHOTO,
    CG,
    CHARACTER_STORY,
    HIKING_ROUTE,
    HIKING_NODE
}