import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'echo_settings'

export const useSettingsStore = defineStore('settings', () => {
  const textSpeed = ref(50) // 30=fast, 50=normal, 80=slow
  const autoPlaySpeed = ref(3000) // ms
  const bgmVolume = ref(0.5)
  const sfxVolume = ref(0.5)
  const showBondChanges = ref(true)

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        if (data.textSpeed !== undefined) textSpeed.value = data.textSpeed
        if (data.autoPlaySpeed !== undefined) autoPlaySpeed.value = data.autoPlaySpeed
        if (data.bgmVolume !== undefined) bgmVolume.value = data.bgmVolume
        if (data.sfxVolume !== undefined) sfxVolume.value = data.sfxVolume
        if (data.showBondChanges !== undefined) showBondChanges.value = data.showBondChanges
      } catch (e) {}
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      textSpeed: textSpeed.value,
      autoPlaySpeed: autoPlaySpeed.value,
      bgmVolume: bgmVolume.value,
      sfxVolume: sfxVolume.value,
      showBondChanges: showBondChanges.value
    }))
  }

  function setTextSpeed(speed: number) {
    textSpeed.value = speed
    saveToStorage()
  }

  function setAutoPlaySpeed(speed: number) {
    autoPlaySpeed.value = speed
    saveToStorage()
  }

  function setBgmVolume(volume: number) {
    bgmVolume.value = Math.max(0, Math.min(1, volume))
    saveToStorage()
  }

  function setSfxVolume(volume: number) {
    sfxVolume.value = Math.max(0, Math.min(1, volume))
    saveToStorage()
  }

  function setShowBondChanges(show: boolean) {
    showBondChanges.value = show
    saveToStorage()
  }

  return {
    textSpeed,
    autoPlaySpeed,
    bgmVolume,
    sfxVolume,
    showBondChanges,
    loadFromStorage,
    setTextSpeed,
    setAutoPlaySpeed,
    setBgmVolume,
    setSfxVolume,
    setShowBondChanges
  }
})
