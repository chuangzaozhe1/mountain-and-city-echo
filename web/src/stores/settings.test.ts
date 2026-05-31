import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from './settings'

describe('useSettingsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with default values', () => {
    const store = useSettingsStore()

    expect(store.textSpeed).toBe(50)
    expect(store.autoPlaySpeed).toBe(3000)
    expect(store.bgmVolume).toBe(0.5)
    expect(store.sfxVolume).toBe(0.5)
    expect(store.showBondChanges).toBe(true)
    expect(store.textSize).toBe(1.0)
    expect(store.dialogueOpacity).toBe(0.95)
  })

  it('should set text speed', () => {
    const store = useSettingsStore()

    store.setTextSpeed(30)
    expect(store.textSpeed).toBe(30)

    store.setTextSpeed(80)
    expect(store.textSpeed).toBe(80)
  })

  it('should set auto play speed', () => {
    const store = useSettingsStore()

    store.setAutoPlaySpeed(2000)
    expect(store.autoPlaySpeed).toBe(2000)
  })

  it('should set bgm volume', () => {
    const store = useSettingsStore()

    store.setBgmVolume(0.8)
    expect(store.bgmVolume).toBe(0.8)
  })

  it('should clamp bgm volume', () => {
    const store = useSettingsStore()

    store.setBgmVolume(1.5)
    expect(store.bgmVolume).toBe(1)

    store.setBgmVolume(-0.5)
    expect(store.bgmVolume).toBe(0)
  })

  it('should set sfx volume', () => {
    const store = useSettingsStore()

    store.setSfxVolume(0.7)
    expect(store.sfxVolume).toBe(0.7)
  })

  it('should clamp sfx volume', () => {
    const store = useSettingsStore()

    store.setSfxVolume(1.5)
    expect(store.sfxVolume).toBe(1)

    store.setSfxVolume(-0.5)
    expect(store.sfxVolume).toBe(0)
  })

  it('should set show bond changes', () => {
    const store = useSettingsStore()

    store.setShowBondChanges(false)
    expect(store.showBondChanges).toBe(false)
  })

  it('should set text size', () => {
    const store = useSettingsStore()

    store.setTextSize(1.2)
    expect(store.textSize).toBe(1.2)
  })

  it('should clamp text size', () => {
    const store = useSettingsStore()

    store.setTextSize(2.0)
    expect(store.textSize).toBe(1.5)

    store.setTextSize(0.5)
    expect(store.textSize).toBe(0.8)
  })

  it('should set dialogue opacity', () => {
    const store = useSettingsStore()

    store.setDialogueOpacity(0.8)
    expect(store.dialogueOpacity).toBe(0.8)
  })

  it('should clamp dialogue opacity', () => {
    const store = useSettingsStore()

    store.setDialogueOpacity(1.5)
    expect(store.dialogueOpacity).toBe(1)

    store.setDialogueOpacity(0.3)
    expect(store.dialogueOpacity).toBe(0.5)
  })

  it('should save to localStorage', () => {
    const store = useSettingsStore()

    store.setTextSpeed(30)
    store.setTextSize(1.2)

    const saved = JSON.parse(localStorage.getItem('echo_settings') || '{}')
    expect(saved.textSpeed).toBe(30)
    expect(saved.textSize).toBe(1.2)
  })

  it('should load from localStorage', () => {
    localStorage.setItem('echo_settings', JSON.stringify({
      textSpeed: 80,
      textSize: 1.3
    }))

    const store = useSettingsStore()
    store.loadFromStorage()

    expect(store.textSpeed).toBe(80)
    expect(store.textSize).toBe(1.3)
  })
})
