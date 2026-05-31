import { defineStore } from 'pinia'
import { ref } from 'vue'

const STORAGE_KEY = 'echo_settings'

export const useSettingsStore = defineStore('settings', () => {
  const textSpeed = ref(50) // 30=fast, 50=normal, 80=slow
  const autoPlaySpeed = ref(3000) // ms
  const bgmVolume = ref(0.5)
  const sfxVolume = ref(0.5)
  const showBondChanges = ref(true)
  const textSize = ref(1.0) // 字体大小倍数
  const dialogueOpacity = ref(0.95) // 对话框透明度

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
        if (data.textSize !== undefined) textSize.value = data.textSize
        if (data.dialogueOpacity !== undefined) dialogueOpacity.value = data.dialogueOpacity
      } catch (e) {}
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      textSpeed: textSpeed.value,
      autoPlaySpeed: autoPlaySpeed.value,
      bgmVolume: bgmVolume.value,
      sfxVolume: sfxVolume.value,
      showBondChanges: showBondChanges.value,
      textSize: textSize.value,
      dialogueOpacity: dialogueOpacity.value
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

  function setTextSize(size: number) {
    textSize.value = Math.max(0.8, Math.min(1.5, size))
    saveToStorage()
  }

  function setDialogueOpacity(opacity: number) {
    dialogueOpacity.value = Math.max(0.5, Math.min(1, opacity))
    saveToStorage()
  }

  return {
    textSpeed,
    autoPlaySpeed,
    bgmVolume,
    sfxVolume,
    showBondChanges,
    textSize,
    dialogueOpacity,
    loadFromStorage,
    setTextSpeed,
    setAutoPlaySpeed,
    setBgmVolume,
    setSfxVolume,
    setShowBondChanges,
    setTextSize,
    setDialogueOpacity
  }
})
