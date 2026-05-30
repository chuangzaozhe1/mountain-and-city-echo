import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MusicGenerator, MUSIC_STYLES, SCENE_TO_MUSIC, CHARACTER_TO_MUSIC } from '@/utils/musicGenerator'

export const useBgmStore = defineStore('bgm', () => {
  // 状态
  const isPlaying = ref(false)
  const isMuted = ref(false)
  const volume = ref(0.3)
  const currentBgmType = ref('default')
  const currentTrackName = ref('')
  const isEnabled = ref(true)

  // 音频相关
  let audioContext: AudioContext | null = null
  let masterGain: GainNode | null = null
  let musicGenerator: MusicGenerator | null = null

  // 初始化音频上下文
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // 创建主音量控制
      masterGain = audioContext.createGain()
      masterGain.gain.value = isMuted.value ? 0 : volume.value
      masterGain.connect(audioContext.destination)

      // 创建音乐生成器
      musicGenerator = new MusicGenerator(audioContext, masterGain)
    }
  }

  // 获取场景对应的音乐风格
  function getBgmTypeForScene(sceneId: string): string {
    return SCENE_TO_MUSIC[sceneId] || 'default'
  }

  // 获取角色对应的音乐风格
  function getBgmTypeForCharacter(characterId: string): string {
    return CHARACTER_TO_MUSIC[characterId] || 'default'
  }

  // 播放 BGM
  async function play(type: string = 'default') {
    if (!isEnabled.value) return

    // 如果已经是同类型音乐，不切换
    if (currentBgmType.value === type && isPlaying.value) return

    try {
      initAudioContext()

      if (audioContext?.state === 'suspended') {
        await audioContext.resume()
      }

      // 停止当前播放
      if (musicGenerator) {
        musicGenerator.stop()
      }

      // 更新状态
      currentBgmType.value = type
      currentTrackName.value = MUSIC_STYLES[type]?.name || '轻音乐'

      // 开始播放新音乐
      if (musicGenerator) {
        await musicGenerator.play(type)
      }

      isPlaying.value = true

      // 保存状态
      saveState()

    } catch (error) {
      console.warn('BGM 播放失败:', error)
    }
  }

  // 根据场景播放
  async function playForScene(sceneId: string) {
    const type = getBgmTypeForScene(sceneId)
    await play(type)
  }

  // 根据角色播放
  async function playForCharacter(characterId: string) {
    const type = getBgmTypeForCharacter(characterId)
    await play(type)
  }

  // 暂停
  function pause() {
    if (musicGenerator) {
      musicGenerator.pause()
    }
    isPlaying.value = false
  }

  // 恢复播放
  async function resume() {
    if (!isPlaying.value && currentBgmType.value) {
      if (musicGenerator) {
        musicGenerator.resume()
      }
      isPlaying.value = true
    }
  }

  // 停止
  function stop() {
    if (musicGenerator) {
      musicGenerator.stop()
    }
    isPlaying.value = false
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (masterGain) {
      masterGain.gain.value = isMuted.value ? 0 : volume.value
    }
    saveState()
  }

  // 设置音量
  function setVolume(value: number) {
    volume.value = Math.max(0, Math.min(1, value))
    if (masterGain && !isMuted.value) {
      masterGain.gain.value = volume.value
    }
    saveState()
  }

  // 切换启用状态
  function toggleEnabled() {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) {
      stop()
    }
    saveState()
  }

  // 刷新当前曲目
  async function refreshTrack() {
    if (musicGenerator) {
      musicGenerator.stop()
    }
    await play(currentBgmType.value)
  }

  // 保存状态到本地存储
  function saveState() {
    try {
      localStorage.setItem('bgm_state', JSON.stringify({
        volume: volume.value,
        isMuted: isMuted.value,
        isEnabled: isEnabled.value,
        currentBgmType: currentBgmType.value
      }))
    } catch (e) {
      // 忽略存储错误
    }
  }

  // 加载状态
  function loadState() {
    try {
      const saved = localStorage.getItem('bgm_state')
      if (saved) {
        const state = JSON.parse(saved)
        volume.value = state.volume ?? 0.3
        isMuted.value = state.isMuted ?? false
        isEnabled.value = state.isEnabled ?? true
        currentBgmType.value = state.currentBgmType ?? 'default'
      }
    } catch (e) {
      // 忽略加载错误
    }
  }

  // 处理页面可见性变化
  function handleVisibilityChange() {
    if (document.hidden) {
      // 页面隐藏时暂停
      pause()
    } else {
      // 页面显示时恢复
      resume()
    }
  }

  // 初始化
  function init() {
    loadState()

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 监听用户交互以启用音频上下文
    const enableAudio = async () => {
      initAudioContext()
      if (audioContext?.state === 'suspended') {
        await audioContext.resume()
      }
      document.removeEventListener('click', enableAudio)
      document.removeEventListener('touchstart', enableAudio)
    }
    document.addEventListener('click', enableAudio)
    document.addEventListener('touchstart', enableAudio)
  }

  return {
    // 状态
    isPlaying,
    isMuted,
    volume,
    currentBgmType,
    currentTrackName,
    isEnabled,

    // 方法
    init,
    play,
    playForScene,
    playForCharacter,
    pause,
    resume,
    stop,
    toggleMute,
    setVolume,
    toggleEnabled,
    refreshTrack
  }
})
