import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSfxStore = defineStore('sfx', () => {
  const baseUrl = import.meta.env.BASE_URL
  const enabled = ref(true)
  const volume = ref(0.5)

  const sounds: Record<string, HTMLAudioElement> = {}

  function getSound(name: string): HTMLAudioElement {
    if (!sounds[name]) {
      sounds[name] = new Audio(`${baseUrl}data/sounds/${name}.mp3`)
      sounds[name].volume = volume.value
    }
    return sounds[name]
  }

  function play(name: string) {
    if (!enabled.value) return
    try {
      const sound = getSound(name)
      sound.currentTime = 0
      sound.volume = volume.value
      sound.play().catch(() => {})
    } catch (e) {}
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    Object.values(sounds).forEach(s => {
      s.volume = volume.value
    })
  }

  function toggle() {
    enabled.value = !enabled.value
  }

  return {
    enabled,
    volume,
    play,
    setVolume,
    toggle
  }
})
