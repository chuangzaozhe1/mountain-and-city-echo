import { defineStore } from 'pinia'
import { ref } from 'vue'

// Mixkit 免费音乐资源
const BGM_TRACKS: Record<string, { name: string; urls: string[] }> = {
  mountain: {
    name: '山野清风',
    urls: [
      'https://assets.mixkit.co/music/738/738.mp3',
      'https://assets.mixkit.co/music/580/580.mp3',
      'https://assets.mixkit.co/music/897/897.mp3'
    ]
  },
  cafe: {
    name: '咖啡时光',
    urls: [
      'https://assets.mixkit.co/music/32/32.mp3',
      'https://assets.mixkit.co/music/130/130.mp3',
      'https://assets.mixkit.co/music/443/443.mp3'
    ]
  },
  city: {
    name: '城市夜景',
    urls: [
      'https://assets.mixkit.co/music/493/493.mp3',
      'https://assets.mixkit.co/music/614/614.mp3',
      'https://assets.mixkit.co/music/623/623.mp3'
    ]
  },
  romantic: {
    name: '心动瞬间',
    urls: [
      'https://assets.mixkit.co/music/132/132.mp3',
      'https://assets.mixkit.co/music/250/250.mp3',
      'https://assets.mixkit.co/music/339/339.mp3'
    ]
  },
  healing: {
    name: '治愈时刻',
    urls: [
      'https://assets.mixkit.co/music/127/127.mp3',
      'https://assets.mixkit.co/music/262/262.mp3',
      'https://assets.mixkit.co/music/281/281.mp3'
    ]
  },
  default: {
    name: '轻音乐',
    urls: [
      'https://assets.mixkit.co/music/138/138.mp3',
      'https://assets.mixkit.co/music/139/139.mp3',
      'https://assets.mixkit.co/music/371/371.mp3'
    ]
  }
}

// 场景到音乐类型的映射
const SCENE_TO_BGM: Record<string, string> = {
  // 山野场景
  jinyun_mountain_trail: 'mountain',
  jinyun_summit: 'mountain',
  mountain_trail: 'mountain',
  mountain_path: 'mountain',
  mountain_viewpoint: 'mountain',
  mountain_night: 'mountain',
  mountain_rain: 'mountain',
  wugongshan: 'mountain',
  geluoshan: 'mountain',
  changbaishan: 'mountain',
  jinfoshan: 'mountain',
  nanshan: 'mountain',
  desert: 'mountain',
  desert_night: 'mountain',

  // 咖啡店场景
  cafe: 'cafe',
  cafe_interior: 'cafe',
  coffee_shop: 'cafe',
  restaurant: 'cafe',
  hotpot_restaurant: 'cafe',

  // 城市/夜市场景
  chongqing_night: 'city',
  chongqing_station: 'city',
  station: 'city',
  night_market: 'city',
  night_street: 'city',
  home_night: 'city',
  office: 'city',
  school_office: 'city',
  school_entrance: 'city',
  meeting_hall: 'city',
  classroom: 'city',
  metro_station: 'city',

  // 湖边/野餐场景
  dai_lake_picnic: 'healing',
  minsu: 'healing',

  // 浪漫场景
  romantic: 'romantic'
}

// 角色专属音乐类型
const CHARACTER_BGM: Record<string, string> = {
  suqingyan: 'romantic',
  linwanxing: 'healing',
  xuzhinan: 'cafe'
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
  let audio: HTMLAudioElement | null = null
  let currentTrackIndex = 0

  // 获取场景对应的音乐类型
  function getBgmTypeForScene(sceneId: string): string {
    return SCENE_TO_BGM[sceneId] || 'default'
  }

  // 获取角色对应的音乐类型
  function getBgmTypeForCharacter(characterId: string): string {
    return CHARACTER_BGM[characterId] || 'default'
  }

  // 获取随机音乐URL
  function getRandomTrackUrl(type: string): string {
    const tracks = BGM_TRACKS[type] || BGM_TRACKS.default
    currentTrackIndex = Math.floor(Math.random() * tracks.urls.length)
    return tracks.urls[currentTrackIndex]
  }

  // 播放音乐
  async function play(type: string = 'default') {
    if (!isEnabled.value) return

    // 如果已经是同类型音乐且正在播放，不切换
    if (currentBgmType.value === type && isPlaying.value) return

    try {
      // 停止当前播放
      stop()

      // 更新状态
      currentBgmType.value = type
      currentTrackName.value = BGM_TRACKS[type]?.name || '轻音乐'

      // 创建音频元素
      audio = new Audio()
      audio.volume = isMuted.value ? 0 : volume.value
      audio.loop = true

      // 获取随机音乐URL
      const url = getRandomTrackUrl(type)
      audio.src = url

      // 播放结束时切换到下一首
      audio.addEventListener('ended', () => {
        playNext(type)
      })

      // 开始播放
      await audio.play()
      isPlaying.value = true

      // 保存状态
      saveState()

    } catch (error) {
      console.warn('BGM 播放失败:', error)
      // 尝试播放下一首
      playNext(type)
    }
  }

  // 播放下一首
  async function playNext(type: string) {
    if (!audio) return

    try {
      const tracks = BGM_TRACKS[type] || BGM_TRACKS.default
      currentTrackIndex = (currentTrackIndex + 1) % tracks.urls.length
      const url = tracks.urls[currentTrackIndex]

      audio.src = url
      await audio.play()
    } catch (error) {
      console.warn('播放下一首失败:', error)
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
    if (audio) {
      audio.pause()
      isPlaying.value = false
    }
  }

  // 恢复播放
  async function resume() {
    if (audio && !isPlaying.value) {
      try {
        await audio.play()
        isPlaying.value = true
      } catch (error) {
        console.warn('恢复播放失败:', error)
      }
    }
  }

  // 停止
  function stop() {
    if (audio) {
      audio.pause()
      audio.currentTime = 0
      audio.src = ''
      audio = null
      isPlaying.value = false
    }
  }

  // 切换静音
  function toggleMute() {
    isMuted.value = !isMuted.value
    if (audio) {
      audio.volume = isMuted.value ? 0 : volume.value
    }
    saveState()
  }

  // 设置音量
  function setVolume(value: number) {
    volume.value = Math.max(0, Math.min(1, value))
    if (audio && !isMuted.value) {
      audio.volume = volume.value
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

    // 监听用户交互以启用音频
    const enableAudio = async () => {
      if (audio && audio.paused) {
        try {
          await audio.play()
        } catch (e) {
          // 忽略
        }
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
