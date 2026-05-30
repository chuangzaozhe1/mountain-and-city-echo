import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
  unlockedAt?: number
}

const STORAGE_KEY = 'echo_achievements'

export const useAchievementStore = defineStore('achievement', () => {
  const achievements = ref<Achievement[]>([
    { id: 'chapter_1_complete', title: '初遇', description: '完成第一章', icon: '📖', unlocked: false },
    { id: 'chapter_2_complete', title: '再会', description: '完成第二章', icon: '📖', unlocked: false },
    { id: 'chapter_3_complete', title: '咖啡时光', description: '完成第三章', icon: '☕', unlocked: false },
    { id: 'chapter_4_complete', title: '山野漫步', description: '完成第四章', icon: '⛰️', unlocked: false },
    { id: 'chapter_5_complete', title: '夜市奇遇', description: '完成第五章', icon: '🌃', unlocked: false },
    { id: 'chapter_6_complete', title: '回响', description: '完成第六章', icon: '🎵', unlocked: false },
    { id: 'all_chapters', title: '故事完结', description: '完成所有章节', icon: '🏆', unlocked: false },
    { id: 'suqingyan_max', title: '清颜之心', description: '苏清颜好感度达到100', icon: '💕', unlocked: false },
    { id: 'linwanxing_max', title: '晚星之约', description: '林晚星好感度达到100', icon: '💕', unlocked: false },
    { id: 'xuzhinan_max', title: '知楠之守', description: '许知楠好感度达到100', icon: '💕', unlocked: false },
  ])

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
      return true
    }
    return false
  }

  function isUnlocked(id: string): boolean {
    return achievements.value.find(a => a.id === id)?.unlocked || false
  }

  const unlockedCount = computed(() => achievements.value.filter(a => a.unlocked).length)
  const totalCount = computed(() => achievements.value.length)

  return {
    achievements,
    loadFromStorage,
    unlock,
    isUnlocked,
    unlockedCount,
    totalCount
  }
})
