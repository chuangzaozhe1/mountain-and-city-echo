import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'echo_statistics'

export interface GameStatistics {
  totalPlayTime: number // 总游戏时长（秒）
  chapterPlayTime: Record<string, number> // 每章游戏时长
  totalDialogues: number // 总对话数
  totalChoices: number // 总选择数
  choiceHistory: Array<{ chapterId: string; choiceId: string; timestamp: number }> // 选择历史
  firstPlayTime: number // 首次游玩时间
  lastPlayTime: number // 最后游玩时间
  chaptersCompleted: string[] // 已完成章节
  totalSaves: number // 总存档次数
  totalLoads: number // 总读档次数
  maxBondPoints: Record<string, number> // 最高好感度
}

export const useStatisticsStore = defineStore('statistics', () => {
  const stats = ref<GameStatistics>({
    totalPlayTime: 0,
    chapterPlayTime: {},
    totalDialogues: 0,
    totalChoices: 0,
    choiceHistory: [],
    firstPlayTime: 0,
    lastPlayTime: 0,
    chaptersCompleted: [],
    totalSaves: 0,
    totalLoads: 0,
    maxBondPoints: {}
  })

  // 游戏计时器
  let playTimer: number | null = null

  // 计算属性
  const formattedPlayTime = computed(() => {
    const hours = Math.floor(stats.value.totalPlayTime / 3600)
    const minutes = Math.floor((stats.value.totalPlayTime % 3600) / 60)
    if (hours > 0) {
      return `${hours} 小时 ${minutes} 分钟`
    }
    return `${minutes} 分钟`
  })

  const completedChapterCount = computed(() => stats.value.chaptersCompleted.length)

  const averageChoicePerChapter = computed(() => {
    if (stats.value.chaptersCompleted.length === 0) return 0
    return Math.round(stats.value.totalChoices / stats.value.chaptersCompleted.length * 10) / 10
  })

  // 从本地存储加载
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved)
        stats.value = { ...stats.value, ...data }
      } catch (e) {
        console.warn('Failed to load statistics')
      }
    }
  }

  // 保存到本地存储
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats.value))
  }

  // 开始计时
  function startTimer() {
    playTimer = window.setInterval(() => {
      stats.value.totalPlayTime += 1
      saveToStorage()
    }, 1000)
  }

  // 停止计时
  function stopTimer() {
    if (playTimer) {
      clearInterval(playTimer)
      playTimer = null
    }
    saveToStorage()
  }

  // 记录对话
  function recordDialogue() {
    stats.value.totalDialogues++
    saveToStorage()
  }

  // 记录选择
  function recordChoice(chapterId: string, choiceId: string) {
    stats.value.totalChoices++
    stats.value.choiceHistory.push({
      chapterId,
      choiceId,
      timestamp: Date.now()
    })
    saveToStorage()
  }

  // 记录章节完成
  function recordChapterComplete(chapterId: string) {
    if (!stats.value.chaptersCompleted.includes(chapterId)) {
      stats.value.chaptersCompleted.push(chapterId)
    }
    saveToStorage()
  }

  // 记录存档
  function recordSave() {
    stats.value.totalSaves++
    saveToStorage()
  }

  // 记录读档
  function recordLoad() {
    stats.value.totalLoads++
    saveToStorage()
  }

  // 更新最高好感度
  function updateMaxBond(characterId: string, points: number) {
    const current = stats.value.maxBondPoints[characterId] || 0
    if (points > current) {
      stats.value.maxBondPoints[characterId] = points
      saveToStorage()
    }
  }

  // 更新首次和最后游玩时间
  function updatePlayTimes() {
    const now = Date.now()
    if (stats.value.firstPlayTime === 0) {
      stats.value.firstPlayTime = now
    }
    stats.value.lastPlayTime = now
    saveToStorage()
  }

  // 获取章节游戏时长
  function getChapterPlayTime(chapterId: string): number {
    return stats.value.chapterPlayTime[chapterId] || 0
  }

  // 格式化章节时长
  function formatChapterPlayTime(chapterId: string): string {
    const seconds = getChapterPlayTime(chapterId)
    const minutes = Math.floor(seconds / 60)
    return `${minutes} 分钟`
  }

  // 重置统计
  function reset() {
    stats.value = {
      totalPlayTime: 0,
      chapterPlayTime: {},
      totalDialogues: 0,
      totalChoices: 0,
      choiceHistory: [],
      firstPlayTime: 0,
      lastPlayTime: 0,
      chaptersCompleted: [],
      totalSaves: 0,
      totalLoads: 0,
      maxBondPoints: {}
    }
    saveToStorage()
  }

  // 初始化
  loadFromStorage()

  return {
    stats,
    formattedPlayTime,
    completedChapterCount,
    averageChoicePerChapter,
    startTimer,
    stopTimer,
    recordDialogue,
    recordChoice,
    recordChapterComplete,
    recordSave,
    recordLoad,
    updateMaxBond,
    updatePlayTimes,
    getChapterPlayTime,
    formatChapterPlayTime,
    reset
  }
})
