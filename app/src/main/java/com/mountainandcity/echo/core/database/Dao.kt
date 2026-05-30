package com.mountainandcity.echo.core.database

import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Dao
interface SaveDao {
    @Query("SELECT * FROM saves ORDER BY saveTime DESC")
    fun getAllSaves(): Flow<List<SaveEntity>>

    @Query("SELECT * FROM saves WHERE slotId = :slotId")
    suspend fun getSave(slotId: Int): SaveEntity?

    @Query("SELECT * FROM saves WHERE isAutoSave = 1 LIMIT 1")
    suspend fun getAutoSave(): SaveEntity?

    @Query("SELECT * FROM saves WHERE isQuickSave = 1 LIMIT 1")
    suspend fun getQuickSave(): SaveEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertSave(save: SaveEntity)

    @Update
    suspend fun updateSave(save: SaveEntity)

    @Query("DELETE FROM saves WHERE slotId = :slotId")
    suspend fun deleteSave(slotId: Int)

    @Query("DELETE FROM saves")
    suspend fun deleteAllSaves()

    @Query("DELETE FROM saves WHERE isAutoSave = 1")
    suspend fun deleteAutoSave()

    @Query("DELETE FROM saves WHERE isQuickSave = 1")
    suspend fun deleteQuickSave()
}

@Dao
interface BondDao {
    @Query("SELECT * FROM bonds")
    fun getAllBonds(): Flow<List<BondEntity>>

    @Query("SELECT * FROM bonds WHERE characterId = :characterId")
    suspend fun getBond(characterId: String): BondEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBond(bond: BondEntity)

    @Update
    suspend fun updateBond(bond: BondEntity)

    @Query("DELETE FROM bonds")
    suspend fun deleteAllBonds()
}

@Dao
interface UnlockDao {
    @Query("SELECT * FROM unlocks")
    fun getAllUnlocks(): Flow<List<UnlockEntity>>

    @Query("SELECT * FROM unlocks WHERE type = :type")
    fun getUnlocksByType(type: String): Flow<List<UnlockEntity>>

    @Query("SELECT * FROM unlocks WHERE id = :id")
    suspend fun getUnlock(id: String): UnlockEntity?

    @Query("SELECT EXISTS(SELECT 1 FROM unlocks WHERE id = :id)")
    suspend fun isUnlocked(id: String): Boolean

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUnlock(unlock: UnlockEntity)

    @Query("DELETE FROM unlocks WHERE id = :id")
    suspend fun deleteUnlock(id: String)

    @Query("DELETE FROM unlocks")
    suspend fun deleteAllUnlocks()
}