package com.mountainandcity.echo.feature.settings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mountainandcity.echo.core.database.SaveEntity
import com.mountainandcity.echo.story.repository.GameRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class SaveLoadViewModel @Inject constructor(
    private val gameRepository: GameRepository
) : ViewModel() {

    val saves: StateFlow<List<SaveEntity>> = gameRepository.getAllSaves()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = emptyList()
        )

    fun deleteSave(slotId: Int) {
        viewModelScope.launch {
            gameRepository.deleteSave(slotId)
        }
    }

    fun deleteAllSaves() {
        viewModelScope.launch {
            gameRepository.deleteAllSaves()
        }
    }
}