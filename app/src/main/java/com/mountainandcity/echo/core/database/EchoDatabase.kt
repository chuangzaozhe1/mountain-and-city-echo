package com.mountainandcity.echo.core.database

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(
    entities = [
        SaveEntity::class,
        BondEntity::class,
        UnlockEntity::class
    ],
    version = 1,
    exportSchema = false
)
abstract class EchoDatabase : RoomDatabase() {
    abstract fun saveDao(): SaveDao
    abstract fun bondDao(): BondDao
    abstract fun unlockDao(): UnlockDao

    companion object {
        private const val DATABASE_NAME = "echo_database"

        @Volatile
        private var INSTANCE: EchoDatabase? = null

        fun getInstance(context: Context): EchoDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    EchoDatabase::class.java,
                    DATABASE_NAME
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}