import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'chapter' | 'choice' | 'bond' | 'special'
  unlocked: boolean
  unlockedAt?: number
}

const STORAGE_KEY = 'echo_achievements'

export const useAchievementStore = defineStore('achievement', () => {
  const achievements = ref<Achievement[]>([
    // 章节成就
    { id: 'chapter_1_complete', title: '初遇', description: '完成第一章', icon: '📖', category: 'chapter', unlocked: false },
    { id: 'chapter_2_complete', title: '再会', description: '完成第二章', icon: '📖', category: 'chapter', unlocked: false },
    { id: 'chapter_3_complete', title: '咖啡时光', description: '完成第三章', icon: '☕', category: 'chapter', unlocked: false },
    { id: 'chapter_4_complete', title: '山野漫步', description: '完成第四章', icon: '⛰️', category: 'chapter', unlocked: false },
    { id: 'chapter_5_complete', title: '夜市奇遇', description: '完成第五章', icon: '🌃', category: 'chapter', unlocked: false },
    { id: 'chapter_6_complete', title: '回响', description: '完成第六章', icon: '🎵', category: 'chapter', unlocked: false },
    { id: 'all_chapters', title: '故事完结', description: '完成所有章节', icon: '🏆', category: 'chapter', unlocked: false },
    // 选择成就
    { id: 'first_choice', title: '命运岔路口', description: '做出第一个选择', icon: '🔀', category: 'choice', unlocked: false },
    { id: 'all_choices', title: '探索者', description: '尝试所有分支选择', icon: '🔍', category: 'choice', unlocked: false },
    // 好感度成就
    { id: 'suqingyan_bond_5', title: '清颜之友', description: '苏清颜好感度达到 5', icon: '💙', category: 'bond', unlocked: false },
    { id: 'suqingyan_bond_10', title: '清颜知己', description: '苏清颜好感度达到 10', icon: '💜', category: 'bond', unlocked: false },
    { id: 'suqingyan_max', title: '清颜之心', description: '苏清颜好感度达到 100', icon: '💕', category: 'bond', unlocked: false },
    { id: 'linwanxing_bond_5', title: '晚星之友', description: '林晚星好感度达到 5', icon: '⭐', category: 'bond', unlocked: false },
    { id: 'linwanxing_bond_10', title: '晚星知己', description: '林晚星好感度达到 10', icon: '🌟', category: 'bond', unlocked: false },
    { id: 'linwanxing_max', title: '晚星之约', description: '林晚星好感度达到 100', icon: '💕', category: 'bond', unlocked: false },
    { id: 'xuzhinan_bond_5', title: '指南之友', description: '徐指南好感度达到 5', icon: '🧭', category: 'bond', unlocked: false },
    { id: 'xuzhinan_bond_10', title: '指南知己', description: '徐指南好感度达到 10', icon: '🎯', category: 'bond', unlocked: false },
    { id: 'xuzhinan_max', title: '知楠之守', description: '徐指南好感度达到 100', icon: '💕', category: 'bond', unlocked: false },
    // 特殊成就
    { id: 'speed_reader', title: '速读者', description: '使用快速模式完成一章', icon: '⚡', category: 'special', unlocked: false },
    { id: 'patient_reader', title: '耐心读者', description: '使用慢速模式完成一章', icon: '🐢', category: 'special', unlocked: false },
    { id: 'auto_reader', title: '自动播放', description: '使用自动播放完成一章', icon: '▶️', category: 'special', unlocked: false },
    { id: 'cg_collector', title: '收藏家', description: '解锁所有 CG', icon: '🖼️', category: 'special', unlocked: false }
  ])

  // 新解锁的成就（用于通知）
  const newAchievement = ref<Achievement | null>(null)

  const chapterAchievements = computed(() =>
    achievements.value.filter(a => a.category === 'chapter')
  )
  const choiceAchievements = computed(() =>
    achievements.value.filter(a => a.category === 'choice')
  )
  const bondAchievements = computed(() =>
    achievements.value.filter(a => a.category === 'bond')
  )
  const specialAchievements = computed(() =>
    achievements.value.filter(a => a.category === 'special')
  )

  function loadFromStorage() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const data = JSON.parse(saved) as Achievement[]
        achievements.value = achievements.value.map(a => {
          const found = data.find(d => d.id === a.id)
          return found ? { ...a, unlocked: found.unlocked, unlockedAt: found.unlockedAt } : a
        })
      } catch (e) {}
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements.value))
  }

  function unlock(id: string) {
    const achievement = achievements.value.find(a => a.id === id)
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = Date.now()
      saveToStorage()
      newAchievement.value = { ...achievement }
      return true
    }
    return false
  }

  function clearNewAchievement() {
    newAchievement.value = null
  }

  function isUnlocked(id: string): boolean {
    return achievements.value.find(a => a.id === id)?.unlocked || false
  }

  function unlockByChapter(chapterId: string) {
    const chapterNum = parseInt(chapterId.replace('chapter_', ''))
    const achievementId = `chapter_${chapterNum}_complete`
    unlock(achievementId)

    // 检查是否完成所有章节
    const allChaptersComplete = [1, 2, 3, 4, 5, 6].every(n =>
      isUnlocked(`chapter_${n}_complete`)
    )
    if (allChaptersComplete) {
      unlock('all_chapters')
    }
  }

  function unlockByChoice() {
    unlock('first_choice')
  }

  function unlockByBond(characterId: string, bondLevel: number) {
    const bondMap: Record<string, Record<number, string>> = {
      'suqingyan': { 5: 'suqingyan_bond_5', 10: 'suqingyan_bond_10', 100: 'suqingyan_max' },
      'linwanxing': { 5: 'linwanxing_bond_5', 10: 'linwanxing_bond_10', 100: 'linwanxing_max' },
      'xuzhinan': { 5: 'xuzhinan_bond_5', 10: 'xuzhinan_bond_10', 100: 'xuzhinan_max' }
    }

    const charMap = bondMap[characterId]
    if (charMap) {
      Object.entries(charMap).forEach(([level, achId]) => {
        if (bondLevel >= parseInt(level)) {
          unlock(achId)
        }
      })
    }
  }

  function unlockSpecial(specialId: string) {
    unlock(specialId)
  }

  const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length)
  const totalCount = computed(() => achievements.value.length)
  const completionRate = computed(() =>
    totalCount.value > 0 ? Math.round((unlockedCount.value / totalCount.value) * 100) : 0
  )

  loadFromStorage()

  return {
    achievements,
    newAchievement,
    chapterAchievements,
    choiceAchievements,
    bondAchievements,
    specialAchievements,
    loadFromStorage,
    unlock,
    clearNewAchievement,
    isUnlocked,
    unlockByChapter,
    unlockByChoice,
    unlockByBond,
    unlockSpecial,
    unlockedCount,
    totalCount,
    completionRate
  }
})
