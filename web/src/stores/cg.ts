import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface CGItem {
  id: string
  title: string
  category: 'character' | 'scene' | 'ending'
  thumbnail: string
  fullImage: string
  unlockCondition: string
  isUnlocked: boolean
}

const STORAGE_KEY = 'echo_cg_gallery'

export const useCgStore = defineStore('cg', () => {
  // 所有 CG 定义
  const allCGs = ref<CGItem[]>([
    // 角色 CG
    {
      id: 'tangxin_hiking',
      title: '唐信·登山',
      category: 'character',
      thumbnail: 'data/avatars/tangxin_hiking.jpg',
      fullImage: 'data/avatars/tangxin_hiking.jpg',
      unlockCondition: '完成第一章',
      isUnlocked: false
    },
    {
      id: 'tangxin_maiwan',
      title: '唐信·埋碗',
      category: 'character',
      thumbnail: 'data/avatars/tangxin_maiwan.jpg',
      fullImage: 'data/avatars/tangxin_maiwan.jpg',
      unlockCondition: '完成第二章',
      isUnlocked: false
    },
    {
      id: 'suqingyan_normal',
      title: '苏清颜·日常',
      category: 'character',
      thumbnail: 'data/avatars/suqingyan_normal.jpg',
      fullImage: 'data/avatars/suqingyan_normal.jpg',
      unlockCondition: '初次遇见苏清颜',
      isUnlocked: false
    },
    {
      id: 'suqingyan_sport',
      title: '苏清颜·运动',
      category: 'character',
      thumbnail: 'data/avatars/suqingyan_sport.jpg',
      fullImage: 'data/avatars/suqingyan_sport.jpg',
      unlockCondition: '与苏清颜一起登山',
      isUnlocked: false
    },
    {
      id: 'linwanxing_avatar',
      title: '林晚星',
      category: 'character',
      thumbnail: 'data/avatars/linwanxing_avatar.jpg',
      fullImage: 'data/avatars/linwanxing_avatar.jpg',
      unlockCondition: '初次遇见林晚星',
      isUnlocked: false
    },
    {
      id: 'xuzhinan_avatar',
      title: '徐指南',
      category: 'character',
      thumbnail: 'data/avatars/xuzhinan_avatar.jpg',
      fullImage: 'data/avatars/xuzhinan_avatar.jpg',
      unlockCondition: '初次遇见徐指南',
      isUnlocked: false
    },
    {
      id: 'xuzhinan_hiking',
      title: '徐指南·登山',
      category: 'character',
      thumbnail: 'data/avatars/xuzhinan_hiking.jpg',
      fullImage: 'data/avatars/xuzhinan_hiking.jpg',
      unlockCondition: '与徐指南一起登山',
      isUnlocked: false
    },
    // 场景 CG
    {
      id: 'city_night',
      title: '重庆夜景',
      category: 'scene',
      thumbnail: 'data/images/city_1.jpg',
      fullImage: 'data/images/city_1.jpg',
      unlockCondition: '到达重庆',
      isUnlocked: false
    },
    {
      id: 'mountain_trail',
      title: '山间小径',
      category: 'scene',
      thumbnail: 'data/images/mountain_1.jpg',
      fullImage: 'data/images/mountain_1.jpg',
      unlockCondition: '开始登山',
      isUnlocked: false
    },
    {
      id: 'mountain_summit',
      title: '山顶风光',
      category: 'scene',
      thumbnail: 'data/images/mountain_2.jpg',
      fullImage: 'data/images/mountain_2.jpg',
      unlockCondition: '到达山顶',
      isUnlocked: false
    },
    {
      id: 'cafe_scene',
      title: '咖啡厅',
      category: 'scene',
      thumbnail: 'data/images/cafe_1.jpg',
      fullImage: 'data/images/cafe_1.jpg',
      unlockCondition: '进入咖啡厅',
      isUnlocked: false
    },
    {
      id: 'night_scene',
      title: '夜色',
      category: 'scene',
      thumbnail: 'data/images/night_1.jpg',
      fullImage: 'data/images/night_1.jpg',
      unlockCondition: '夜晚场景',
      isUnlocked: false
    },
    {
      id: 'romantic_scene',
      title: '浪漫时刻',
      category: 'scene',
      thumbnail: 'data/images/romantic_1.jpg',
      fullImage: 'data/images/romantic_1.jpg',
      unlockCondition: '触发浪漫剧情',
      isUnlocked: false
    }
  ])

  // 已解锁的 CG ID 列表
  const unlockedCGIds = ref<string[]>([])

  // 计算属性
  const unlockedCGs = computed(() =>
    allCGs.value.filter(cg => unlockedCGIds.value.includes(cg.id))
  )

  const characterCGs = computed(() =>
    allCGs.value.filter(cg => cg.category === 'character')
  )

  const sceneCGs = computed(() =>
    allCGs.value.filter(cg => cg.category === 'scene')
  )

  const endingCGs = computed(() =>
    allCGs.value.filter(cg => cg.category === 'ending')
  )

  const totalCGs = computed(() => allCGs.value.length)
  const unlockedCount = computed(() => unlockedCGIds.value.length)
  const completionRate = computed(() =>
    totalCGs.value > 0 ? Math.round((unlockedCount.value / totalCGs.value) * 100) : 0
  )

  // 从本地存储加载
  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        unlockedCGIds.value = JSON.parse(saved)
      } catch (e) {
        console.warn('Failed to load CG data')
      }
    }
  }

  // 保存到本地存储
  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unlockedCGIds.value))
  }

  // 解锁 CG
  function unlockCG(cgId: string) {
    if (!unlockedCGIds.value.includes(cgId)) {
      unlockedCGIds.value.push(cgId)
      saveToStorage()
      return true // 新解锁
    }
    return false // 已解锁
  }

  // 检查 CG 是否已解锁
  function isUnlocked(cgId: string): boolean {
    return unlockedCGIds.value.includes(cgId)
  }

  // 批量解锁（根据游戏进度）
  function unlockByChapter(chapterId: string) {
    // 根据章节解锁对应 CG
    const unlockMap: Record<string, string[]> = {
      'chapter_01': ['tangxin_hiking', 'city_night'],
      'chapter_02': ['tangxin_maiwan', 'suqingyan_normal'],
      'chapter_03': ['mountain_trail', 'cafe_scene'],
      'chapter_04': ['mountain_summit', 'suqingyan_sport'],
      'chapter_05': ['linwanxing_avatar', 'night_scene'],
      'chapter_06': ['xuzhinan_avatar', 'romantic_scene', 'xuzhinan_hiking']
    }

    const cgsToUnlock = unlockMap[chapterId] || []
    let newUnlocks = 0

    cgsToUnlock.forEach(cgId => {
      if (unlockCG(cgId)) {
        newUnlocks++
      }
    })

    return newUnlocks
  }

  // 根据角色好感度解锁
  function unlockByBond(characterId: string, bondLevel: number) {
    const bondCGs: Record<string, Record<number, string>> = {
      'suqingyan': { 5: 'suqingyan_normal', 10: 'suqingyan_sport' },
      'linwanxing': { 5: 'linwanxing_avatar' },
      'xuzhinan': { 5: 'xuzhinan_avatar', 10: 'xuzhinan_hiking' }
    }

    const charCGs = bondCGs[characterId]
    if (charCGs) {
      Object.entries(charCGs).forEach(([level, cgId]) => {
        if (bondLevel >= parseInt(level)) {
          unlockCG(cgId)
        }
      })
    }
  }

  // 重置
  function reset() {
    unlockedCGIds.value = []
    saveToStorage()
  }

  // 初始化
  loadFromStorage()

  return {
    allCGs,
    unlockedCGIds,
    unlockedCGs,
    characterCGs,
    sceneCGs,
    endingCGs,
    totalCGs,
    unlockedCount,
    completionRate,
    unlockCG,
    isUnlocked,
    unlockByChapter,
    unlockByBond,
    reset
  }
})
