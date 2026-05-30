package com.mountainandcity.echo.feature.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mountainandcity.echo.core.audio.AudioManager
import com.mountainandcity.echo.core.datastore.AudioSettings
import com.mountainandcity.echo.core.datastore.EchoDataStore
import com.mountainandcity.echo.core.datastore.ReadingSettings
import com.mountainandcity.echo.story.repository.GameRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SettingsViewModel @Inject constructor(
    private val dataStore: EchoDataStore,
    private val audioManager: AudioManager,
    private val gameRepository: GameRepository
) : ViewModel() {

    val readingSettings: StateFlow<ReadingSettings> = dataStore.readingSettings
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = ReadingSettings()
        )

    val audioSettings: StateFlow<AudioSettings> = dataStore.audioSettings
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = AudioSettings()
        )

    fun cycleTextSpeed() {
        viewModelScope.launch {
            val current = readingSettings.value.textSpeed
            val next = when (current) {
                "SLOW" -> "MEDIUM"
                "MEDIUM" -> "FAST"
                else -> "SLOW"
            }
            updateReadingSettings(readingSettings.value.copy(textSpeed = next))
        }
    }

    fun toggleTypewriter() {
        viewModelScope.launch {
            updateReadingSettings(
                readingSettings.value.copy(
                    typewriterEnabled = !readingSettings.value.typewriterEnabled
                )
            )
        }
    }

    fun toggleKeepScreenOn() {
        viewModelScope.launch {
            updateReadingSettings(
                readingSettings.value.copy(
                    keepScreenOn = !readingSettings.value.keepScreenOn
                )
            )
        }
    }

    fun setBgmVolume(volume: Float) {
        viewModelScope.launch {
            val newSettings = audioSettings.value.copy(bgmVolume = volume)
            dataStore.updateAudioSettings(newSettings)
            audioManager.setVolume(volume)
        }
    }

    fun setSfxVolume(volume: Float) {
        viewModelScope.launch {
            val newSettings = audioSettings.value.copy(sfxVolume = volume)
            dataStore.updateAudioSettings(newSettings)
        }
    }

    fun resetGame() {
        viewModelScope.launch {
            gameRepository.resetGame()
        }
    }

    private suspend fun updateReadingSettings(settings: ReadingSettings) {
        dataStore.updateReadingSettings(settings)
    }
}