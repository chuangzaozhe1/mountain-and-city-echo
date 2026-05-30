package com.mountainandcity.echo.story.repository

import com.mountainandcity.echo.core.database.BondDao
import com.mountainandcity.echo.core.database.BondEntity
import com.mountainandcity.echo.core.database.SaveDao
import com.mountainandcity.echo.core.database.SaveEntity
import com.mountainandcity.echo.core.database.UnlockDao
import com.mountainandcity.echo.core.database.UnlockEntity
import com.mountainandcity.echo.story.model.CharacterEnum
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class GameRepository @Inject constructor(
    private val saveDao: SaveDao,
    private val bondDao: BondDao,
    private val unlockDao: UnlockDao
) {
    // ==================== 存档相关 ====================

    suspend fun getSave(slotId: Int): SaveEntity? = saveDao.getSave(slotId)

    suspend fun getAutoSave(): SaveEntity? = saveDao.getAutoSave()

    suspend fun getQuickSave(): SaveEntity? = saveDao.getQuickSave()

    fun getAllSaves(): Flow<List<SaveEntity>> = saveDao.getAllSaves()

    suspend fun saveGame(slotId: Int, chapterId: String, sceneId: String, dialogueIndex: Int) {
        val save = SaveEntity(
            slotId = slotId,
            chapterId = chapterId,
            sceneId = sceneId,
            dialogueIndex = dialogueIndex,
            saveTime = System.currentTimeMillis()
        )
        saveDao.insertSave(save)
    }

    suspend fun autoSave(chapterId: String, sceneId: String, dialogueIndex: Int) {
        saveDao.deleteAutoSave()
        val save = SaveEntity(
            slotId = -1, // 约定 auto save 的 slotId 为 -1
            chapterId = chapterId,
            sceneId = sceneId,
            dialogueIndex = dialogueIndex,
            saveTime = System.currentTimeMillis(),
            isAutoSave = true
        )
        saveDao.insertSave(save)
    }

    suspend fun quickSave(chapterId: String, sceneId: String, dialogueIndex: Int) {
        saveDao.deleteQuickSave()
        val save = SaveEntity(
            slotId = -2, // 约定 quick save 的 slotId 为 -2
            chapterId = chapterId,
            sceneId = sceneId,
            dialogueIndex = dialogueIndex,
            saveTime = System.currentTimeMillis(),
            isQuickSave = true
        )
        saveDao.insertSave(save)
    }

    suspend fun deleteSave(slotId: Int) = saveDao.deleteSave(slotId)

    suspend fun deleteAllSaves() = saveDao.deleteAllSaves()

    // ==================== 羁绊相关 ====================

    fun getAllBonds(): Flow<Map<String, Int>> = bondDao.getAllBonds().map { list ->
        list.associate { it.characterId to it.points }
    }

    suspend fun getBond(characterId: String): Int = bondDao.getBond(characterId)?.points ?: 0

    suspend fun addBondPoints(characterId: String, points: Int) {
        val currentBond = bondDao.getBond(characterId)
        val newPoints = (currentBond?.points ?: 0) + points
        bondDao.insertBond(BondEntity(characterId, newPoints))
    }

    suspend fun resetAllBonds() = bondDao.deleteAllBonds()

    // ==================== 解锁相关 ====================

    fun getAllUnlocks(): Flow<List<UnlockEntity>> = unlockDao.getAllUnlocks()

    fun getUnlockedChapterIds(): Flow<List<String>> = unlockDao.getUnlocksByType("CHAPTER").map { list ->
        list.map { it.id }
    }

    suspend fun isUnlocked(id: String): Boolean = unlockDao.isUnlocked(id)

    suspend fun unlock(id: String, type: String) {
        unlockDao.insertUnlock(UnlockEntity(id, type, System.currentTimeMillis()))
    }

    suspend fun unlockChapter(chapterId: String) = unlock(chapterId, "CHAPTER")

    suspend fun unlockPhoto(photoId: String) = unlock(photoId, "PHOTO")

    suspend fun unlockCg(cgId: String) = unlock(cgId, "CG")

    suspend fun deleteAllUnlocks() = unlockDao.deleteAllUnlocks()

    // ==================== 重置游戏 ====================

    suspend fun resetGame() {
        deleteAllSaves()
        resetAllBonds()
        deleteAllUnlocks()
        // 解锁第一章
        unlockChapter("chapter_01")
    }
}