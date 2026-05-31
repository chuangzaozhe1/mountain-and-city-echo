import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDialogueStore } from './dialogue'
import type { DialogueData, ChoiceData } from '@/types/story'

describe('useDialogueStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const mockDialogue: DialogueData = {
    dialogueId: 'd1',
    speaker: '唐鑫',
    text: '你好'
  }

  const mockDialogue2: DialogueData = {
    dialogueId: 'd2',
    speaker: '苏清颜',
    text: '你好呀'
  }

  const mockChoice: ChoiceData = {
    choiceId: 'c1',
    text: '去公园',
    nextSceneId: 'scene_02'
  }

  it('should initialize with empty state', () => {
    const store = useDialogueStore()

    expect(store.currentDialogue).toBeNull()
    expect(store.currentDialogueIndex).toBe(0)
    expect(store.displayedText).toBe('')
    expect(store.isTextComplete).toBe(true)
    expect(store.historyDialogues).toEqual([])
    expect(store.choices).toEqual([])
    expect(store.showChoices).toBe(false)
  })

  it('should update dialogue', () => {
    const store = useDialogueStore()

    store.updateDialogue(mockDialogue, 0, 'chapter_01', 'scene_01')

    expect(store.currentDialogue).toEqual(mockDialogue)
    expect(store.currentDialogueIndex).toBe(0)
    expect(store.displayedText).toBe('')
    expect(store.isTextComplete).toBe(false)
  })

  it('should save previous dialogue to history', () => {
    const store = useDialogueStore()

    store.updateDialogue(mockDialogue, 0)
    store.updateDialogue(mockDialogue2, 1)

    expect(store.historyDialogues).toHaveLength(1)
    expect(store.historyDialogues[0]).toEqual(mockDialogue)
  })

  it('should limit history length', () => {
    const store = useDialogueStore()

    for (let i = 0; i < 60; i++) {
      store.updateDialogue({
        dialogueId: `d${i}`,
        speaker: 'speaker',
        text: `text ${i}`
      }, i)
    }

    expect(store.historyDialogues).toHaveLength(50)
  })

  it('should add to history', () => {
    const store = useDialogueStore()

    store.addToHistory(mockDialogue)
    store.addToHistory(mockDialogue2)

    expect(store.historyDialogues).toHaveLength(2)
  })

  it('should clear history', () => {
    const store = useDialogueStore()

    store.addToHistory(mockDialogue)
    store.addToHistory(mockDialogue2)
    store.clearHistory()

    expect(store.historyDialogues).toEqual([])
  })

  it('should set displayed text', () => {
    const store = useDialogueStore()

    store.setDisplayedText('Hello')
    expect(store.displayedText).toBe('Hello')
  })

  it('should complete text', () => {
    const store = useDialogueStore()

    store.completeText('Hello World')

    expect(store.displayedText).toBe('Hello World')
    expect(store.isTextComplete).toBe(true)
  })

  it('should set choices', () => {
    const store = useDialogueStore()

    store.setChoices([mockChoice])

    expect(store.choices).toEqual([mockChoice])
    expect(store.showChoices).toBe(true)
  })

  it('should clear choices', () => {
    const store = useDialogueStore()

    store.setChoices([mockChoice])
    store.clearChoices()

    expect(store.choices).toEqual([])
    expect(store.showChoices).toBe(false)
  })

  it('should mark as read', () => {
    const store = useDialogueStore()

    store.markAsRead('chapter_01', 'scene_01', 0)

    expect(store.isRead('chapter_01', 'scene_01', 0)).toBe(true)
    expect(store.isRead('chapter_01', 'scene_01', 1)).toBe(false)
    expect(store.isRead('chapter_01', 'scene_02', 0)).toBe(false)
  })

  it('should reset state', () => {
    const store = useDialogueStore()

    store.updateDialogue(mockDialogue, 0)
    store.addToHistory(mockDialogue2)
    store.setChoices([mockChoice])

    store.reset()

    expect(store.currentDialogue).toBeNull()
    expect(store.currentDialogueIndex).toBe(0)
    expect(store.displayedText).toBe('')
    expect(store.isTextComplete).toBe(true)
    expect(store.historyDialogues).toEqual([])
    expect(store.choices).toEqual([])
  })
})
