import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTypewriter } from './useTypewriter'

describe('useTypewriter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with empty text and complete state', () => {
    const { displayedText, isTextComplete } = useTypewriter()
    expect(displayedText.value).toBe('')
    expect(isTextComplete.value).toBe(true)
  })

  it('should start typewriter effect', () => {
    const { displayedText, isTextComplete, startTypewriter } = useTypewriter()

    startTypewriter('Hello', 100)

    expect(displayedText.value).toBe('')
    expect(isTextComplete.value).toBe(false)

    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('H')

    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('He')
  })

  it('should complete typewriter effect', () => {
    const { displayedText, isTextComplete, startTypewriter } = useTypewriter()

    startTypewriter('Hi', 100)

    // H
    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('H')
    expect(isTextComplete.value).toBe(false)

    // i
    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('Hi')
    expect(isTextComplete.value).toBe(false)

    // 完成
    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('Hi')
    expect(isTextComplete.value).toBe(true)
  })

  it('should complete text immediately', () => {
    const { displayedText, isTextComplete, completeText } = useTypewriter()

    completeText('Hello World')

    expect(displayedText.value).toBe('Hello World')
    expect(isTextComplete.value).toBe(true)
  })

  it('should skip to end', () => {
    const { isTextComplete, startTypewriter, skipToEnd } = useTypewriter()

    startTypewriter('Hello', 100)
    expect(isTextComplete.value).toBe(false)

    skipToEnd()
    expect(isTextComplete.value).toBe(true)
  })

  it('should stop previous typewriter when starting new one', () => {
    const { displayedText, startTypewriter } = useTypewriter()

    startTypewriter('Hello', 100)
    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('H')

    startTypewriter('World', 100)
    expect(displayedText.value).toBe('')

    vi.advanceTimersByTime(100)
    expect(displayedText.value).toBe('W')
  })
})
