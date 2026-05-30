import { defineStore } from 'pinia'
import { ref } from 'vue'

// BGM 风格配置
const BGM_STYLES: Record<string, { name: string; notes: number[]; tempo: number; mood: string }> = {
  mountain: {
    name: '山野清风',
    notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25], // C大调
    tempo: 0.8,
    mood: 'peaceful'
  },
  cafe: {
    name: '咖啡时光',
    notes: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00], // A小调
    tempo: 0.6,
    mood: 'warm'
  },
  city: {
    name: '城市夜景',
    notes: [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00], // G小调
    tempo: 0.7,
    mood: 'urban'
  },
  romantic: {
    name: '心动瞬间',
    notes: [261.63, 293.66, 329.63, 392.00, 440.00, 493.88, 523.25, 587.33], // C大调高音
    tempo: 0.5,
    mood: 'romantic'
  },
  healing: {
    name: '治愈时刻',
    notes: [174.61, 196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23], // F大调
    tempo: 0.4,
    mood: 'healing'
  },
  default: {
    name: '轻音乐',
    notes: [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25],
    tempo: 0.6,
    mood: 'neutral'
  }
}

// 场景到 BGM 类型的映射
const SCENE_TO_BGM: Record<string, string> = {
  // 山野场景
  jinyun_mountain_trail: 'mountain',
  jinyun_summit: 'mountain',
  mountain_trail: 'mountain',
  mountain_path: 'mountain',
  mountain_viewpoint: 'mountain',
  wugongshan: 'mountain',
  geluoshan: 'mountain',
  changbaishan: 'mountain',
  jinfoshan: 'mountain',
  nanshan: 'mountain',
  desert: 'mountain',
  desert_night: 'mountain',

  // 咖啡店场景
  cafe: 'cafe',
  coffee_shop: 'cafe',
  restaurant: 'cafe',
  hotpot_restaurant: 'cafe',

  // 城市/夜市场景
  chongqing_night: 'city',
  chongqing_station: 'city',
  station: 'city',
  night_market: 'city',
  home_night: 'city',
  office: 'city',
  school_office: 'city',
  school_entrance: 'city',
  meeting_hall: 'city',
  classroom: 'city',

  // 湖边/野餐场景
  dai_lake_picnic: 'healing',
  minsu: 'healing',

  // 浪漫场景
  romantic: 'romantic'
}

// 角色专属 BGM 类型
const CHARACTER_BGM: Record<string, string> = {
  suqingyan: 'cafe',
  linwanxing: 'healing',
  xuzhinan: 'city'
}

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
  let gainNode: GainNode | null = null
  let oscillators: OscillatorNode[] = []
  let intervalId: number | null = null

  // 初始化音频上下文
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNode = audioContext.createGain()
      gainNode.connect(audioContext.destination)
      gainNode.gain.value = isMuted.value ? 0 : volume.value
    }
  }

  // 获取场景对应的 BGM 类型
  function getBgmTypeForScene(sceneId: string): string {
    return SCENE_TO_BGM[sceneId] || 'default'
  }

  // 获取角色对应的 BGM 类型
  function getBgmTypeForCharacter(characterId: string): string {
    return CHARACTER_BGM[characterId] || 'default'
  }

  // 停止当前播放
  function stopCurrent() {
    if (oscillators.length > 0) {
      oscillators.forEach(osc => {
        try {
          osc.stop()
        } catch (e) {
          // 忽略已停止的振荡器
        }
      })
      oscillators = []
    }
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  // 生成环境音
  function generateAmbientSound(type: string) {
    if (!audioContext || !gainNode) return

    const style = BGM_STYLES[type] || BGM_STYLES.default
    const { notes, tempo } = style

    // 停止当前播放
    stopCurrent()

    // 创建主音色
    const mainOsc = audioContext.createOscillator()
    const mainGain = audioContext.createGain()
    mainOsc.type = 'sine'
    mainOsc.frequency.value = notes[0]
    mainGain.gain.value = 0.15
    mainOsc.connect(mainGain)
    mainGain.connect(gainNode)
    mainOsc.start()
    oscillators.push(mainOsc)

    // 创建和弦音
    const chordOsc = audioContext.createOscillator()
    const chordGain = audioContext.createGain()
    chordOsc.type = 'triangle'
    chordOsc.frequency.value = notes[2] * 2
    chordGain.gain.value = 0.08
    chordOsc.connect(chordGain)
    chordGain.connect(gainNode)
    chordOsc.start()
    oscillators.push(chordOsc)

    // 创建低音
    const bassOsc = audioContext.createOscillator()
    const bassGain = audioContext.createGain()
    bassOsc.type = 'sine'
    bassOsc.frequency.value = notes[0] / 2
    bassGain.gain.value = 0.1
    bassOsc.connect(bassGain)
    bassGain.connect(gainNode)
    bassOsc.start()
    oscillators.push(bassOsc)

    // 随机变化音符
    let noteIndex = 0
    intervalId = window.setInterval(() => {
      if (isMuted.value) return

      noteIndex = (noteIndex + 1) % notes.length
      const nextNote = notes[noteIndex]

      // 平滑过渡
      mainOsc.frequency.exponentialRampToValueAtTime(
        nextNote,
        audioContext!.currentTime + tempo
      )
      chordOsc.frequency.exponentialRampToValueAtTime(
        nextNote * 1.5,
        audioContext!.currentTime + tempo
      )
    }, tempo * 2000)
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
      stopCurrent()

      // 更新状态
      currentBgmType.value = type
      currentTrackName.value = BGM_STYLES[type]?.name || '轻音乐'

      // 生成新音乐
      generateAmbientSound(type)
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
    if (gainNode) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext!.currentTime + 0.5)
    }
    setTimeout(() => {
      stopCurrent()
      isPlaying.value = false
    }, 500)
  }

  // 恢复播放
  async function resume() {
    if (!isPlaying.value && currentBgmType.value) {
      await play(currentBgmType.value)
    }
  }

  // 停止
  function stop() {
    stopCurrent()
    isPlaying.value = false
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (gainNode) {
      gainNode.gain.value = isMuted.value ? 0 : volume.value
    }
    saveState()
  }

  // 设置音量
  function setVolume(value: number) {
    volume.value = Math.max(0, Math.min(1, value))
    if (gainNode && !isMuted.value) {
      gainNode.gain.value = volume.value
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
      // 页面隐藏时降低音量
      if (gainNode) {
        gainNode.gain.value = volume.value * 0.3
      }
    } else {
      // 页面显示时恢复音量
      if (gainNode && !isMuted.value) {
        gainNode.gain.value = volume.value
      }
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
