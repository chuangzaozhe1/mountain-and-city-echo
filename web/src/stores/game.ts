import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { GameState, SaveData } from '@/types/game'

const STORAGE_KEY = 'echo_game_save'
const SAVE_SLOTS = 3

export const useGameStore = defineStore('game', () => {
  const state = ref<GameState>({
    currentChapterId: null,
    currentSceneId: null,
    currentDialogueIndex: 0,
    bondPoints: {
      tangxin: 0,
      suqingyan: 0,
      linwanxing: 0,
      xuzhinan: 0
    },
    unlockedChapters: ['chapter_01'],
    photos: []
  })

  const hasAutoSave = computed(() => {
    return state.value.currentChapterId !== null
  })

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved) as SaveData
        state.value = {
          currentChapterId: data.chapterId,
          currentSceneId: data.sceneId,
          currentDialogueIndex: data.dialogueIndex,
          bondPoints: data.bondPoints,
          unlockedChapters: data.unlockedChapters,
          photos: data.photos
        }
      } catch (e) {
        console.warn('Failed to load save data')
      }
    }
  }

  function saveToStorage() {
    const data: SaveData = {
      chapterId: state.value.currentChapterId || 'chapter_01',
      sceneId: state.value.currentSceneId || '',
      dialogueIndex: state.value.currentDialogueIndex,
      bondPoints: state.value.bondPoints,
      unlockedChapters: state.value.unlockedChapters,
      photos: state.value.photos,
      timestamp: Date.now()
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  function autoSave(chapterId: string, sceneId: string, dialogueIndex: number) {
    state.value.currentChapterId = chapterId
    state.value.currentSceneId = sceneId
    state.value.currentDialogueIndex = dialogueIndex
    saveToStorage()
  }

  function quickSave(chapterId: string, sceneId: string, dialogueIndex: number) {
    state.value.currentChapterId = chapterId
    state.value.currentSceneId = sceneId
    state.value.currentDialogueIndex = dialogueIndex
    // Quick save uses a different key
    const data: SaveData = {
      ...getSaveData(),
      timestamp: Date.now()
    }
    localStorage.setItem('echo_quick_save', JSON.stringify(data))
  }

  function getSaveData(): SaveData {
    return {
      chapterId: state.value.currentChapterId || 'chapter_01',
      sceneId: state.value.currentSceneId || '',
      dialogueIndex: state.value.currentDialogueIndex,
      bondPoints: { ...state.value.bondPoints },
      unlockedChapters: [...state.value.unlockedChapters],
      photos: [...state.value.photos],
      timestamp: Date.now()
    }
  }

  function unlockChapter(chapterId: string) {
    if (!state.value.unlockedChapters.includes(chapterId)) {
      state.value.unlockedChapters.push(chapterId)
      saveToStorage()
    }
  }

  function isChapterUnlocked(chapterId: string): boolean {
    return state.value.unlockedChapters.includes(chapterId)
  }

  function addBondPoints(characterId: string, points: number) {
    const current = state.value.bondPoints[characterId] || 0
    state.value.bondPoints[characterId] = current + points
    saveToStorage()
  }

  function addPhoto(photoId: string) {
    if (!state.value.photos.includes(photoId)) {
      state.value.photos.push(photoId)
      saveToStorage()
    }
  }

  function hasPhoto(photoId: string): boolean {
    return state.value.photos.includes(photoId)
  }

  // 多存档系统
  function saveToSlot(slot: number) {
    if (slot < 0 || slot >= SAVE_SLOTS) return
    const data: SaveData = {
      ...getSaveData(),
      timestamp: Date.now()
    }
    localStorage.setItem(`echo_save_slot_${slot}`, JSON.stringify(data))
  }

  function loadFromSlot(slot: number): SaveData | null {
    if (slot < 0 || slot >= SAVE_SLOTS) return null
    const saved = localStorage.getItem(`echo_save_slot_${slot}`)
    if (saved) {
      try {
        return JSON.parse(saved) as SaveData
      } catch (e) {
        return null
      }
    }
    return null
  }

  function deleteSlot(slot: number) {
    if (slot < 0 || slot >= SAVE_SLOTS) return
    localStorage.removeItem(`echo_save_slot_${slot}`)
  }

  function getSaveSlots(): (SaveData | null)[] {
    const slots: (SaveData | null)[] = []
    for (let i = 0; i < SAVE_SLOTS; i++) {
      slots.push(loadFromSlot(i))
    }
    return slots
  }

  function resetGame() {
    state.value = {
      currentChapterId: null,
      currentSceneId: null,
      currentDialogueIndex: 0,
      bondPoints: {
        tangxin: 0,
        suqingyan: 0,
        linwanxing: 0,
        xuzhinan: 0
      },
      unlockedChapters: ['chapter_01'],
      photos: []
    }
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('echo_quick_save')
  }

  return {
    state,
    hasAutoSave,
    loadFromStorage,
    autoSave,
    quickSave,
    getSaveData,
    unlockChapter,
    isChapterUnlocked,
    addBondPoints,
    addPhoto,
    hasPhoto,
    saveToSlot,
    loadFromSlot,
    deleteSlot,
    getSaveSlots,
    resetGame
  }
})