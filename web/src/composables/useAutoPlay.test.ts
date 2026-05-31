import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useAutoPlay } from './useAutoPlay'

describe('useAutoPlay', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize with auto play disabled', () => {
    const { isAutoPlay, autoPlayInterval } = useAutoPlay()
    expect(isAutoPlay.value).toBe(false)
    expect(autoPlayInterval.value).toBe(3000)
  })

  it('should toggle auto play', () => {
    const { isAutoPlay, toggleAutoPlay } = useAutoPlay()

    expect(isAutoPlay.value).toBe(false)

    toggleAutoPlay()
    expect(isAutoPlay.value).toBe(true)

    toggleAutoPlay()
    expect(isAutoPlay.value).toBe(false)
  })

  it('should call callback when auto play is enabled', () => {
    const { isAutoPlay, setCallback, toggleAutoPlay } = useAutoPlay()
    const callback = vi.fn()

    setCallback(callback)
    toggleAutoPlay()

    expect(isAutoPlay.value).toBe(true)

    vi.advanceTimersByTime(3000)
    expect(callback).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(3000)
    expect(callback).toHaveBeenCalledTimes(2)
  })

  it('should not call callback when auto play is disabled', () => {
    const { setCallback, toggleAutoPlay } = useAutoPlay()
    const callback = vi.fn()

    setCallback(callback)
    toggleAutoPlay()
    toggleAutoPlay()

    vi.advanceTimersByTime(6000)
    expect(callback).not.toHaveBeenCalled()
  })

  it('should update auto play interval', () => {
    const { setCallback, toggleAutoPlay, setAutoPlayInterval } = useAutoPlay()
    const callback = vi.fn()

    setCallback(callback)
    setAutoPlayInterval(1000)
    toggleAutoPlay()

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledTimes(1)
  })

  it('should stop auto play', () => {
    const { setCallback, toggleAutoPlay, stopAutoPlay } = useAutoPlay()
    const callback = vi.fn()

    setCallback(callback)
    toggleAutoPlay()

    vi.advanceTimersByTime(1500)
    stopAutoPlay()

    vi.advanceTimersByTime(3000)
    expect(callback).not.toHaveBeenCalled()
  })
})
