import { ref, onUnmounted } from 'vue'

export function useTypewriter() {
  const displayedText = ref('')
  const isTextComplete = ref(true)
  let typewriterInterval: number | null = null

  function startTypewriter(text: string, speed: number = 50) {
    stopTypewriter()

    let index = 0
    isTextComplete.value = false
    displayedText.value = ''

    typewriterInterval = window.setInterval(() => {
      if (index < text.length) {
        displayedText.value = text.substring(0, index + 1)
        index++
      } else {
        stopTypewriter()
        displayedText.value = text
        isTextComplete.value = true
      }
    }, speed)
  }

  function stopTypewriter() {
    if (typewriterInterval) {
      clearInterval(typewriterInterval)
      typewriterInterval = null
    }
  }

  function completeText(text: string) {
    stopTypewriter()
    displayedText.value = text
    isTextComplete.value = true
  }

  function skipToEnd() {
    stopTypewriter()
    isTextComplete.value = true
  }

  onUnmounted(() => {
    stopTypewriter()
  })

  return {
    displayedText,
    isTextComplete,
    startTypewriter,
    stopTypewriter,
    completeText,
    skipToEnd
  }
}
