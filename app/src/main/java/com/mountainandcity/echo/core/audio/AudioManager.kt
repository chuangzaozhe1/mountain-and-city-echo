package com.mountainandcity.echo.core.audio

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.MediaItem
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import com.mountainandcity.echo.core.datastore.AudioSettings
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AudioManager @Inject constructor(
    @ApplicationContext private val context: Context
) {
    private var bgmPlayer: ExoPlayer? = null
    private var sfxPlayer: ExoPlayer? = null
    private var currentBgm: String? = null

    private val scope = CoroutineScope(Dispatchers.Main + Job())

    private val _isPlaying = MutableStateFlow(false)
    val isPlaying: StateFlow<Boolean> = _isPlaying.asStateFlow()

    private var currentVolume = 0.7f
    private var isMuted = false

    @OptIn(UnstableApi::class)
    fun playBgm(bgmName: String, fadeIn: Long = 1000) {
        if (currentBgm == bgmName && bgmPlayer?.isPlaying == true) return

        scope.launch {
            // 淡出当前音乐
            fadeOutCurrentBgm()

            // 播放新音乐
            bgmPlayer = ExoPlayer.Builder(context).build().apply {
                val uri = "file:///android_asset/audio/bgm_$bgmName.mp3"
                setMediaItem(MediaItem.fromUri(uri))
                repeatMode = Player.REPEAT_MODE_ALL
                prepare()
                volume = 0f
                play()
            }

            currentBgm = bgmName
            _isPlaying.value = true

            // 淡入
            fadeInBgm(fadeIn)
        }
    }

    private suspend fun fadeInBgm(duration: Long) {
        val steps = 20
        val stepDuration = duration / steps
        val targetVolume = if (isMuted) 0f else currentVolume

        for (i in 1..steps) {
            bgmPlayer?.volume = (targetVolume * i) / steps
            delay(stepDuration)
        }
    }

    private suspend fun fadeOutCurrentBgm() {
        val player = bgmPlayer ?: return
        val steps = 20
        val stepDuration = 50L
        val startVolume = player.volume

        for (i in steps downTo 0) {
            player.volume = (startVolume * i) / steps
            delay(stepDuration)
        }

        player.stop()
        player.release()
        bgmPlayer = null
        currentBgm = null
        _isPlaying.value = false
    }

    fun stopBgm() {
        scope.launch {
            fadeOutCurrentBgm()
        }
    }

    fun playSfx(sfxName: String) {
        if (isMuted) return

        sfxPlayer?.release()
        sfxPlayer = ExoPlayer.Builder(context).build().apply {
            val uri = "file:///android_asset/audio/sfx_$sfxName.mp3"
            setMediaItem(MediaItem.fromUri(uri))
            volume = currentVolume
            prepare()
            play()
        }
    }

    fun setVolume(volume: Float) {
        currentVolume = volume.coerceIn(0f, 1f)
        bgmPlayer?.volume = if (isMuted) 0f else currentVolume
    }

    fun setMute(muted: Boolean) {
        isMuted = muted
        bgmPlayer?.volume = if (muted) 0f else currentVolume
    }

    fun updateFromSettings(settings: AudioSettings) {
        currentVolume = settings.bgmVolume
        isMuted = settings.globalMute
        bgmPlayer?.volume = if (isMuted) 0f else currentVolume
    }

    fun release() {
        bgmPlayer?.release()
        sfxPlayer?.release()
        bgmPlayer = null
        sfxPlayer = null
    }
}