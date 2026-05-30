import { defineStore } from 'pinia'
import { ref } from 'vue'

// BGM 音乐库 - 使用免费的 ambient 音乐 CDN
const BGM_LIBRARY: Record<string, { url: string; name: string }[]> = {
  // 山野场景 - 治愈自然风
  mountain: [
    { url: 'https://cdn.pixabay.com/audio/2024/11/28/audio_a067818b34.mp3', name: '山间清晨' },
    { url: 'https://cdn.pixabay.com/audio/2024/02/14/audio_8e35e04856.mp3', name: '森林漫步' },
    { url: 'https://cdn.pixabay.com/audio/2023/10/30/audio_fdd6da3e0e.mp3', name: '自然之声' },
  ],
  // 咖啡店场景 - 温馨舒缓
  cafe: [
    { url: 'https://cdn.pixabay.com/audio/2024/11/04/audio_4426f74c3f.mp3', name: '咖啡时光' },
    { url: 'https://cdn.pixabay.com/audio/2024/09/09/audio_6e4a67db41.mp3', name: '午后阳光' },
    { url: 'https://cdn.pixabay.com/audio/2024/03/14/audio_c36432dea2.mp3', name: '温馨时刻' },
  ],
  // 夜市/城市场景 - 都市烟火
  city: [
    { url: 'https://cdn.pixabay.com/audio/2024/10/08/audio_6b43149799.mp3', name: '城市夜景' },
    { url: 'https://cdn.pixabay.com/audio/2024/09/25/audio_6e1e0b029f.mp3', name: '都市节奏' },
    { url: 'https://cdn.pixabay.com/audio/2024/06/18/audio_1393826522.mp3', name: '夜色温柔' },
  ],
  // 暧昧/心动场景 - 浪漫氛围
  romantic: [
    { url: 'https://cdn.pixabay.com/audio/2024/11/01/audio_aa21a749ab.mp3', name: '心动瞬间' },
    { url: 'https://cdn.pixabay.com/audio/2024/08/06/audio_c953249648.mp3', name: '暧昧氛围' },
    { url: 'https://cdn.pixabay.com/audio/2024/05/20/audio_4335268533.mp3', name: '温柔时光' },
  ],
  // 治愈/放松场景 - 轻柔舒缓
  healing: [
    { url: 'https://cdn.pixabay.com/audio/2024/10/14/audio_9527cf4515.mp3', name: '治愈时刻' },
    { url: 'https://cdn.pixabay.com/audio/2024/07/22/audio_d520486741.mp3', name: '心灵栖息' },
    { url: 'https://cdn.pixabay.com/audio/2024/04/15/audio_a9c186778c.mp3', name: '宁静致远' },
  ],
  // 通用/默认 - 轻音乐
  default: [
    { url: 'https://cdn.pixabay.com/audio/2024/11/18/audio_c0dff18d41.mp3', name: '轻音乐' },
    { url: 'https://cdn.pixabay.com/audio/2024/08/30/audio_5f158f0a0f.mp3', name: '悠然自得' },
    { url: 'https://cdn.pixabay.com/audio/2024/06/04/audio_bfa55958e0.mp3', name: '午后时光' },
  ],
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
  romantic: 'romantic',
}

// 角色专属 BGM 类型
const CHARACTER_BGM: Record<string, string> = {
  suqingyan: 'cafe',      // 苏清颜 - 温馨明媚
  linwanxing: 'healing',   // 林晚星 - 温柔治愈
  xuzhinan: 'city',        // 许知楠 - 沉稳都市
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
  let currentAudio: HTMLAudioElement | null = null
  let fadeTimer: number | null = null

  // 初始化音频上下文
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      gainNode = audioContext.createGain()
      gainNode.connect(audioContext.destination)
      gainNode.gain.value = volume.value
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

  // 随机选择一个 BGM
  function getRandomTrack(type: string): { url: string; name: string } {
    const tracks = BGM_LIBRARY[type] || BGM_LIBRARY.default
    const randomIndex = Math.floor(Math.random() * tracks.length)
    return tracks[randomIndex]
  }

  // 淡出当前音乐
  function fadeOut(duration: number = 1000): Promise<void> {
    return new Promise((resolve) => {
      if (!currentAudio) {
        resolve()
        return
      }

      const startVolume = currentAudio.volume
      const startTime = Date.now()

      if (fadeTimer) {
        clearInterval(fadeTimer)
      }

      fadeTimer = window.setInterval(() => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        currentAudio!.volume = startVolume * (1 - progress)

        if (progress >= 1) {
          if (fadeTimer) {
            clearInterval(fadeTimer)
            fadeTimer = null
          }
          currentAudio!.pause()
          currentAudio = null
          isPlaying.value = false
          resolve()
        }
      }, 50)
    })
  }

  // 淡入播放音乐
  function fadeIn(audio: HTMLAudioElement, duration: number = 1000) {
    audio.volume = 0
    const targetVolume = isMuted.value ? 0 : volume.value
    const startTime = Date.now()

    if (fadeTimer) {
      clearInterval(fadeTimer)
    }

    fadeTimer = window.setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      audio.volume = targetVolume * progress

      if (progress >= 1) {
        if (fadeTimer) {
          clearInterval(fadeTimer)
          fadeTimer = null
        }
      }
    }, 50)
  }

  // 播放 BGM
  async function play(type: string = 'default') {
    if (!isEnabled.value) return

    // 如果已经是同类型音乐，不切换
    if (currentBgmType.value === type && isPlaying.value) return

    try {
      // 淡出当前音乐
      await fadeOut(500)

      // 选择新音乐
      const track = getRandomTrack(type)
      currentBgmType.value = type
      currentTrackName.value = track.name

      // 创建新的音频元素
      currentAudio = new Audio(track.url)
      currentAudio.loop = true
      currentAudio.preload = 'auto'

      // 等待加载
      await new Promise((resolve, reject) => {
        currentAudio!.addEventListener('canplaythrough', resolve, { once: true })
        currentAudio!.addEventListener('error', reject, { once: true })
        currentAudio!.load()
      })

      // 播放
      await currentAudio.play()
      isPlaying.value = true

      // 淡入
      fadeIn(currentAudio, 800)

      // 保存状态
      saveState()

    } catch (error) {
      console.warn('BGM 播放失败:', error)
      // 静默失败，不影响游戏
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
  async function pause() {
    await fadeOut(300)
  }

  // 恢复播放
  async function resume() {
    if (currentAudio && !isPlaying.value) {
      try {
        await currentAudio.play()
        isPlaying.value = true
        fadeIn(currentAudio, 300)
      } catch (error) {
        console.warn('BGM 恢复失败:', error)
      }
    }
  }

  // 停止
  function stop() {
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
      isPlaying.value = false
    }
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (currentAudio) {
      currentAudio.volume = isMuted.value ? 0 : volume.value
    }
    saveState()
  }

  // 设置音量
  function setVolume(value: number) {
    volume.value = Math.max(0, Math.min(1, value))
    if (currentAudio && !isMuted.value) {
      currentAudio.volume = volume.value
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
        currentBgmType: currentBgmType.value,
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
      if (currentAudio) {
        currentAudio.volume = volume.value * 0.3
      }
    } else {
      // 页面显示时恢复音量
      if (currentAudio && !isMuted.value) {
        currentAudio.volume = volume.value
      }
    }
  }

  // 初始化
  function init() {
    loadState()

    // 监听页面可见性变化
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // 监听用户交互以启用音频上下文
    const enableAudio = () => {
      initAudioContext()
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
    refreshTrack,
  }
})
