package com.mountainandcity.echo.core.di

import android.content.Context
import com.mountainandcity.echo.core.database.BondDao
import com.mountainandcity.echo.core.database.EchoDatabase
import com.mountainandcity.echo.core.database.SaveDao
import com.mountainandcity.echo.core.database.UnlockDao
import com.mountainandcity.echo.core.datastore.EchoDataStore
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideDatabase(@ApplicationContext context: Context): EchoDatabase {
        return EchoDatabase.getInstance(context)
    }

    @Provides
    fun provideSaveDao(database: EchoDatabase): SaveDao {
        return database.saveDao()
    }

    @Provides
    fun provideBondDao(database: EchoDatabase): BondDao {
        return database.bondDao()
    }

    @Provides
    fun provideUnlockDao(database: EchoDatabase): UnlockDao {
        return database.unlockDao()
    }
}

@Module
@InstallIn(SingletonComponent::class)
object DataStoreModule {

    @Provides
    @Singleton
    fun provideDataStore(@ApplicationContext context: Context): EchoDataStore {
        return EchoDataStore(context)
    }
}