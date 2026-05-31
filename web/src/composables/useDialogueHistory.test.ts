import { describe, it, expect } from 'vitest'
import { useDialogueHistory } from './useDialogueHistory'

describe('useDialogueHistory', () => {
  const mockDialogue = {
    dialogueId: 'd1',
    speaker: '唐鑫',
    text: '你好'
  }

  const mockDialogue2 = {
    dialogueId: 'd2',
    speaker: '苏清颜',
    text: '你好呀'
  }

  it('should initialize with empty history', () => {
    const { historyDialogues, getHistoryCount } = useDialogueHistory()
    expect(historyDialogues.value).toEqual([])
    expect(getHistoryCount()).toBe(0)
  })

  it('should add dialogue to history', () => {
    const { historyDialogues, addToHistory, getHistoryCount } = useDialogueHistory()

    addToHistory(mockDialogue)

    expect(historyDialogues.value).toHaveLength(1)
    expect(historyDialogues.value[0]).toEqual(mockDialogue)
    expect(getHistoryCount()).toBe(1)
  })

  it('should add multiple dialogues', () => {
    const { historyDialogues, addToHistory } = useDialogueHistory()

    addToHistory(mockDialogue)
    addToHistory(mockDialogue2)

    expect(historyDialogues.value).toHaveLength(2)
    expect(historyDialogues.value[0]).toEqual(mockDialogue)
    expect(historyDialogues.value[1]).toEqual(mockDialogue2)
  })

  it('should limit history length', () => {
    const { historyDialogues, addToHistory } = useDialogueHistory(2)

    addToHistory(mockDialogue)
    addToHistory(mockDialogue2)
    addToHistory({ dialogueId: 'd3', speaker: '林晚星', text: '嗨' })

    expect(historyDialogues.value).toHaveLength(2)
    expect(historyDialogues.value[0]).toEqual(mockDialogue2)
    expect(historyDialogues.value[1].dialogueId).toBe('d3')
  })

  it('should clear history', () => {
    const { historyDialogues, addToHistory, clearHistory } = useDialogueHistory()

    addToHistory(mockDialogue)
    addToHistory(mockDialogue2)
    clearHistory()

    expect(historyDialogues.value).toEqual([])
  })

  it('should get history copy', () => {
    const { addToHistory, getHistory } = useDialogueHistory()

    addToHistory(mockDialogue)
    const history = getHistory()

    expect(history).toEqual([mockDialogue])

    // 修改返回的数组不应影响原始数据
    history.push(mockDialogue2)
    expect(getHistory()).toHaveLength(1)
  })
})
