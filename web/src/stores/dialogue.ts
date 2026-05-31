import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { DialogueData, ChoiceData } from '@/types/story'

export const useDialogueStore = defineStore('dialogue', () => {
  // 当前对话
  const currentDialogue = ref<DialogueData | null>(null)
  const currentDialogueIndex = ref(0)
  const displayedText = ref('')
  const isTextComplete = ref(true)

  // 对话历史
  const historyDialogues = ref<DialogueData[]>([])
  const MAX_HISTORY = 50

  // 选择
  const choices = ref<ChoiceData[]>([])
  const showChoices = computed(() => choices.value.length > 0)

  // 已读对话
  const readDialogues = ref<Set<string>>(new Set())

  // 更新对话
  function updateDialogue(dialogue: DialogueData, index: number, chapterId?: string, sceneId?: string) {
    // 保存当前对话到历史
    if (currentDialogue.value) {
      addToHistory(currentDialogue.value)
    }

    currentDialogue.value = dialogue
    currentDialogueIndex.value = index
    displayedText.value = ''
    isTextComplete.value = false

    // 标记为已读
    if (chapterId && sceneId) {
      markAsRead(chapterId, sceneId, index)
    }
  }

  // 添加到历史
  function addToHistory(dialogue: DialogueData) {
    historyDialogues.value = [...historyDialogues.value, dialogue]
    if (historyDialogues.value.length > MAX_HISTORY) {
      historyDialogues.value = historyDialogues.value.slice(-MAX_HISTORY)
    }
  }

  // 清空历史
  function clearHistory() {
    historyDialogues.value = []
  }

  // 设置显示文本
  function setDisplayedText(text: string) {
    displayedText.value = text
  }

  // 完成文本显示
  function completeText(text: string) {
    displayedText.value = text
    isTextComplete.value = true
  }

  // 设置选择
  function setChoices(newChoices: ChoiceData[]) {
    choices.value = newChoices
  }

  // 清空选择
  function clearChoices() {
    choices.value = []
  }

  // 标记为已读
  function markAsRead(chapterId: string, sceneId: string, index: number) {
    const key = `${chapterId}_${sceneId}_${index}`
    readDialogues.value.add(key)
  }

  // 检查是否已读
  function isRead(chapterId: string, sceneId: string, index: number): boolean {
    const key = `${chapterId}_${sceneId}_${index}`
    return readDialogues.value.has(key)
  }

  // 重置
  function reset() {
    currentDialogue.value = null
    currentDialogueIndex.value = 0
    displayedText.value = ''
    isTextComplete.value = true
    historyDialogues.value = []
    choices.value = []
  }

  return {
    // 状态
    currentDialogue,
    currentDialogueIndex,
    displayedText,
    isTextComplete,
    historyDialogues,
    choices,
    showChoices,
    readDialogues,

    // 方法
    updateDialogue,
    addToHistory,
    clearHistory,
    setDisplayedText,
    completeText,
    setChoices,
    clearChoices,
    markAsRead,
    isRead,
    reset
  }
})
