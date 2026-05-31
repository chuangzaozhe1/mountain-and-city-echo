import { ref, onUnmounted } from 'vue'

export function useAutoPlay() {
  const isAutoPlay = ref(false)
  const autoPlayInterval = ref(3000)
  let autoPlayTimeout: number | null = null
  let callback: (() => void) | null = null

  function setCallback(cb: () => void) {
    callback = cb
  }

  function toggleAutoPlay() {
    isAutoPlay.value = !isAutoPlay.value
    if (isAutoPlay.value) {
      startAutoPlay()
    } else {
      stopAutoPlay()
    }
  }

  function startAutoPlay() {
    stopAutoPlay()
    if (!callback) return

    autoPlayTimeout = window.setTimeout(function tick() {
      if (isAutoPlay.value && callback) {
        callback()
        autoPlayTimeout = window.setTimeout(tick, autoPlayInterval.value)
      }
    }, autoPlayInterval.value)
  }

  function stopAutoPlay() {
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout)
      autoPlayTimeout = null
    }
  }

  function setAutoPlayInterval(interval: number) {
    autoPlayInterval.value = interval
    if (isAutoPlay.value) {
      startAutoPlay()
    }
  }

  onUnmounted(() => {
    stopAutoPlay()
  })

  return {
    isAutoPlay,
    autoPlayInterval,
    setCallback,
    toggleAutoPlay,
    startAutoPlay,
    stopAutoPlay,
    setAutoPlayInterval
  }
}
