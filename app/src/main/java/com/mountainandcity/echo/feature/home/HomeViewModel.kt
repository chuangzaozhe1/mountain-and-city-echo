package com.mountainandcity.echo.feature.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mountainandcity.echo.story.repository.GameRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val gameRepository: GameRepository
) : ViewModel() {

    private val _hasAutoSave = MutableStateFlow(false)
    val hasAutoSave: StateFlow<Boolean> = _hasAutoSave.asStateFlow()

    private val _hasQuickSave = MutableStateFlow(false)
    val hasQuickSave: StateFlow<Boolean> = _hasQuickSave.asStateFlow()

    private val _autoSaveChapterId = MutableStateFlow<String?>(null)
    val autoSaveChapterId: StateFlow<String?> = _autoSaveChapterId.asStateFlow()

    init {
        checkSaveState()
    }

    private fun checkSaveState() {
        viewModelScope.launch {
            val autoSave = gameRepository.getAutoSave()
            _hasAutoSave.value = autoSave != null
            _autoSaveChapterId.value = autoSave?.chapterId
            _hasQuickSave.value = gameRepository.getQuickSave() != null
        }
    }

    suspend fun getAutoSaveChapterId(): String? {
        return gameRepository.getAutoSave()?.chapterId
    }

    suspend fun getQuickSaveChapterId(): String? {
        return gameRepository.getQuickSave()?.chapterId
    }

    suspend fun resetGame() {
        gameRepository.resetGame()
        checkSaveState()
    }
}