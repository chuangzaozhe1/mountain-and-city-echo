package com.mountainandcity.echo.core.datastore

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.longPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "echo_settings")

/**
 * 阅读设置
 */
data class ReadingSettings(
    val textSpeed: String = "MEDIUM", // SLOW, MEDIUM, FAST
    val autoPlayInterval: Long = 3000, // 毫秒
    val typewriterEnabled: Boolean = true,
    val keepScreenOn: Boolean = true
)

/**
 * 音频设置
 */
data class AudioSettings(
    val bgmVolume: Float = 0.7f, // 0-1
    val sfxVolume: Float = 0.8f, // 0-1
    val globalMute: Boolean = false
)

class EchoDataStore(private val context: Context) {

    // 阅读设置
    private object ReadingKeys {
        val TEXT_SPEED = stringPreferencesKey("text_speed")
        val AUTO_PLAY_INTERVAL = longPreferencesKey("auto_play_interval")
        val TYPEWRITER_ENABLED = booleanPreferencesKey("typewriter_enabled")
        val KEEP_SCREEN_ON = booleanPreferencesKey("keep_screen_on")
    }

    // 音频设置
    private object AudioKeys {
        val BGM_VOLUME = stringPreferencesKey("bgm_volume")
        val SFX_VOLUME = stringPreferencesKey("sfx_volume")
        val GLOBAL_MUTE = booleanPreferencesKey("global_mute")
    }

    val readingSettings: Flow<ReadingSettings> = context.dataStore.data.map { prefs ->
        ReadingSettings(
            textSpeed = prefs[ReadingKeys.TEXT_SPEED] ?: "MEDIUM",
            autoPlayInterval = prefs[ReadingKeys.AUTO_PLAY_INTERVAL] ?: 3000L,
            typewriterEnabled = prefs[ReadingKeys.TYPEWRITER_ENABLED] ?: true,
            keepScreenOn = prefs[ReadingKeys.KEEP_SCREEN_ON] ?: true
        )
    }

    val audioSettings: Flow<AudioSettings> = context.dataStore.data.map { prefs ->
        AudioSettings(
            bgmVolume = prefs[AudioKeys.BGM_VOLUME]?.toFloatOrNull() ?: 0.7f,
            sfxVolume = prefs[AudioKeys.SFX_VOLUME]?.toFloatOrNull() ?: 0.8f,
            globalMute = prefs[AudioKeys.GLOBAL_MUTE] ?: false
        )
    }

    suspend fun updateReadingSettings(settings: ReadingSettings) {
        context.dataStore.edit { prefs ->
            prefs[ReadingKeys.TEXT_SPEED] = settings.textSpeed
            prefs[ReadingKeys.AUTO_PLAY_INTERVAL] = settings.autoPlayInterval
            prefs[ReadingKeys.TYPEWRITER_ENABLED] = settings.typewriterEnabled
            prefs[ReadingKeys.KEEP_SCREEN_ON] = settings.keepScreenOn
        }
    }

    suspend fun updateAudioSettings(settings: AudioSettings) {
        context.dataStore.edit { prefs ->
            prefs[AudioKeys.BGM_VOLUME] = settings.bgmVolume.toString()
            prefs[AudioKeys.SFX_VOLUME] = settings.sfxVolume.toString()
            prefs[AudioKeys.GLOBAL_MUTE] = settings.globalMute
        }
    }

    suspend fun resetAllSettings() {
        context.dataStore.edit { it.clear() }
    }
}