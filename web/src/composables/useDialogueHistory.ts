import { ref } from 'vue'
import type { DialogueData } from '@/types/story'

export function useDialogueHistory(maxLength: number = 50) {
  const historyDialogues = ref<DialogueData[]>([])

  function addToHistory(dialogue: DialogueData) {
    historyDialogues.value = [...historyDialogues.value, dialogue]
    if (historyDialogues.value.length > maxLength) {
      historyDialogues.value = historyDialogues.value.slice(-maxLength)
    }
  }

  function clearHistory() {
    historyDialogues.value = []
  }

  function getHistory(): DialogueData[] {
    return [...historyDialogues.value]
  }

  function getHistoryCount(): number {
    return historyDialogues.value.length
  }

  return {
    historyDialogues,
    addToHistory,
    clearHistory,
    getHistory,
    getHistoryCount
  }
}
