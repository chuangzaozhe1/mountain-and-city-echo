import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'echo_endings'

export interface Ending {
  id: string
  title: string
  description: string
  character: string
  icon: string
  isUnlocked: boolean
  unlockedAt?: number
  requirements: {
    minBond?: Record<string, number>
    requiredChoices?: string[]
    requiredChapters?: string[]
  }
}

export const useEndingsStore = defineStore('endings', () => {
  const endings = ref<Ending[]>([
    // 苏清颜结局
    {
      id: 'ending_suqingyan_good',
      title: '清颜之约',
      description: '与苏清颜携手走向未来',
      character: 'suqingyan',
      icon: '💕',
      isUnlocked: false,
      requirements: {
        minBond: { suqingyan: 8 },
        requiredChapters: ['chapter_06']
      }
    },
    {
      id: 'ending_suqingyan_normal',
      title: '清颜之友',
      description: '与苏清颜成为好朋友',
      character: 'suqingyan',
      icon: '💙',
      isUnlocked: false,
      requirements: {
        minBond: { suqingyan: 4 },
        requiredChapters: ['chapter_06']
      }
    },
    // 林晚星结局
    {
      id: 'ending_linwanxing_good',
      title: '晚星之约',
      description: '与林晚星共度美好时光',
      character: 'linwanxing',
      icon: '🌟',
      isUnlocked: false,
      requirements: {
        minBond: { linwanxing: 8 },
        requiredChapters: ['chapter_06']
      }
    },
    {
      id: 'ending_linwanxing_normal',
      title: '晚星之友',
      description: '与林晚星建立深厚友谊',
      character: 'linwanxing',
      icon: '⭐',
      isUnlocked: false,
      requirements: {
        minBond: { linwanxing: 4 },
        requiredChapters: ['chapter_06']
      }
    },
    // 徐指南结局
    {
      id: 'ending_xuzhinan_good',
      title: '指南之约',
      description: '与徐指南并肩前行',
      character: 'xuzhinan',
      icon: '🎯',
      isUnlocked: false,
      requirements: {
        minBond: { xuzhinan: 8 },
        requiredChapters: ['chapter_06']
      }
    },
    {
      id: 'ending_xuzhinan_normal',
      title: '指南之友',
      description: '与徐指南成为挚友',
      character: 'xuzhinan',
      icon: '🧭',
      isUnlocked: false,
      requirements: {
        minBond: { xuzhinan: 4 },
        requiredChapters: ['chapter_06']
      }
    },
    // 特殊结局
    {
      id: 'ending_all_friends',
      title: '友谊万岁',
      description: '与所有人保持良好关系',
      character: 'all',
      icon: '🤝',
      isUnlocked: false,
      requirements: {
        minBond: { suqingyan: 4, linwanxing: 4, xuzhinan: 4 },
        requiredChapters: ['chapter_06']
      }
    },
    {
      id: 'ending_lonely',
      title: '独行者',
      description: '独自走完旅程',
      character: 'none',
      icon: '🚶',
      isUnlocked: false,
      requirements: {
        minBond: { suqingyan: 0, linwanxing: 0, xuzhinan: 0 },
        requiredChapters: ['chapter_06']
      }
    }
  ])

  const unlockedEndingIds = ref<string[]>([])

  // 计算属性
  const unlockedEndings = computed(() =>
    endings.value.filter(e => unlockedEndingIds.value.includes(e.id))
  )

  const totalEndings = computed(() => endings.value.length)
  const unlockedCount = computed(() => unlockedEndingIds.value.length)
  const completionRate = computed(() =>
    totalEndings.value > 0 ? Math.round((unlockedCount.value / totalEndings.value) * 100) : 0
  )

  const characterEndings = computed(() => {
    const grouped: Record<string, Ending[]> = {}
    endings.value.forEach(ending => {
      if (!grouped[ending.character]) {
        grouped[ending.character] = []
      }
      grouped[ending.character].push(ending)
    })
    return grouped
  })

  // 从本地存储加载
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        unlockedEndingIds.value = JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to load endings data')
      }
    }
  }

  // 保存到本地存储
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedEndingIds.value))
  }

  // 解锁结局
  function unlockEnding(endingId: string): boolean {
    if (!unlockedEndingIds.value.includes(endingId)) {
      unlockedEndingIds.value.push(endingId)
      saveToStorage()
      return true
    }
    return false
  }

  // 检查结局是否已解锁
  function isUnlocked(endingId: string): boolean {
    return unlockedEndingIds.value.includes(endingId)
  }

  // 检查是否满足结局条件
  function checkEndingConditions(
    endingId: string,
    bondPoints: Record<string, number>,
    completedChapters: string[]
  ): boolean {
    const ending = endings.value.find(e => e.id === endingId)
    if (!ending) return false

    const { requirements } = ending

    // 检查章节要求
    if (requirements.requiredChapters) {
      const hasAllChapters = requirements.requiredChapters.every(ch =>
        completedChapters.includes(ch)
      )
      if (!hasAllChapters) return false
    }

    // 检查好感度要求
    if (requirements.minBond) {
      for (const [characterId, minPoints] of Object.entries(requirements.minBond)) {
        const currentPoints = bondPoints[characterId] || 0
        if (currentPoints < minPoints) return false
      }
    }

    return true
  }

  // 根据游戏状态解锁结局
  function unlockEndingsForGame(
    bondPoints: Record<string, number>,
    completedChapters: string[]
  ): string[] {
    const newUnlocks: string[] = []

    endings.value.forEach(ending => {
      if (!isUnlocked(ending.id)) {
        if (checkEndingConditions(ending.id, bondPoints, completedChapters)) {
          if (unlockEnding(ending.id)) {
            newUnlocks.push(ending.id)
          }
        }
      }
    })

    return newUnlocks
  }

  // 获取结局描述
  function getEndingDescription(endingId: string): string {
    const ending = endings.value.find(e => e.id === endingId)
    return ending?.description || '未知结局'
  }

  // 获取结局标题
  function getEndingTitle(endingId: string): string {
    const ending = endings.value.find(e => e.id === endingId)
    return ending?.title || '未知结局'
  }

  // 重置
  function reset() {
    unlockedEndingIds.value = []
    saveToStorage()
  }

  // 初始化
  loadFromStorage()

  return {
    endings,
    unlockedEndingIds,
    unlockedEndings,
    totalEndings,
    unlockedCount,
    completionRate,
    characterEndings,
    unlockEnding,
    isUnlocked,
    checkEndingConditions,
    unlockEndingsForGame,
    getEndingDescription,
    getEndingTitle,
    reset
  }
})
