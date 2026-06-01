<template>
  <div class="achievement-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>成就系统</h1>
      <div class="progress">
        {{ achievementStore.unlockedCount }}/{{ achievementStore.totalCount }}
      </div>
    </header>

    <main class="content">
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${achievementStore.completionRate}%` }"></div>
        <span class="progress-text">{{ achievementStore.completionRate }}%</span>
      </div>

      <!-- 分类标签 -->
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="tab-btn"
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.label }}
        </button>
      </div>

      <!-- 成就列表 -->
      <div class="achievement-list">
        <div
          v-for="achievement in filteredAchievements"
          :key="achievement.id"
          class="achievement-item"
          :class="{ unlocked: achievement.unlocked }"
        >
          <div class="achievement-icon">{{ achievement.icon }}</div>
          <div class="achievement-info">
            <span class="achievement-title">{{ achievement.title }}</span>
            <span class="achievement-desc">{{ achievement.description }}</span>
            <span v-if="achievement.unlocked && achievement.unlockedAt" class="achievement-time">
              {{ formatTime(achievement.unlockedAt) }}
            </span>
          </div>
          <div class="achievement-status">
            <span v-if="achievement.unlocked" class="status-unlocked">✓</span>
            <span v-else class="status-locked">🔒</span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAchievementStore } from '@/stores/achievement'

const router = useRouter()
const achievementStore = useAchievementStore()

const activeTab = ref<'all' | 'chapter' | 'choice' | 'bond' | 'special'>('all')

const tabs = [
  { id: 'all' as const, label: '全部', icon: '🏆' },
  { id: 'chapter' as const, label: '章节', icon: '📖' },
  { id: 'choice' as const, label: '选择', icon: '🔀' },
  { id: 'bond' as const, label: '好感度', icon: '💕' },
  { id: 'special' as const, label: '特殊', icon: '⭐' }
]

const filteredAchievements = computed(() => {
  if (activeTab.value === 'all') return achievementStore.achievements
  return achievementStore.achievements.filter(a => a.category === activeTab.value)
})

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.achievement-screen {
  width: 100%;
  height: 100%;
  background: var(--color-background);
  overflow-y: auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  position: sticky;
  top: 0;
  background: var(--color-background);
  z-index: 10;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(232, 232, 232, 0.1);
  color: var(--color-on-background);
  font-size: 1.2rem;
}

h1 {
  font-size: 1.25rem;
  color: var(--color-on-background);
  flex: 1;
}

.progress {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.6);
}

.content {
  padding: 0 1rem 2rem;
}

/* 进度条 */
.progress-bar {
  height: 24px;
  background: rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, #a29bfe 100%);
  border-radius: 12px;
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* 分类标签 */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(232, 232, 232, 0.1);
  color: rgba(232, 232, 232, 0.7);
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--color-primary, #7c6fcd);
  color: white;
}

/* 成就列表 */
.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  transition: all 0.2s;
}

.achievement-item.unlocked {
  background: rgba(124, 111, 205, 0.1);
  border-color: rgba(124, 111, 205, 0.3);
}

.achievement-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  background: rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  flex-shrink: 0;
}

.achievement-item.unlocked .achievement-icon {
  background: rgba(124, 111, 205, 0.2);
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.achievement-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-on-background);
}

.achievement-desc {
  font-size: 0.85rem;
  color: rgba(232, 232, 232, 0.6);
}

.achievement-time {
  font-size: 0.75rem;
  color: rgba(232, 232, 232, 0.4);
}

.achievement-status {
  flex-shrink: 0;
}

.status-unlocked {
  font-size: 1.2rem;
  color: #4caf50;
}

.status-locked {
  font-size: 1.2rem;
  opacity: 0.5;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .content {
    padding: 0 0.75rem 1.5rem;
  }

  .tabs {
    gap: 0.4rem;
    margin-bottom: 1rem;
  }

  .tab-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .achievement-list {
    gap: 10px;
  }

  .achievement-item {
    gap: 10px;
    padding: 12px;
  }

  .achievement-title {
    font-size: 0.95rem;
  }

  .achievement-desc {
    font-size: 0.8rem;
  }
}

@media (max-width: 375px) {
  .header {
    padding: 0.75rem;
    gap: 0.75rem;
  }

  h1 {
    font-size: 1.1rem;
  }

  .content {
    padding: 0 0.5rem 1rem;
  }

  .tabs {
    gap: 0.3rem;
    margin-bottom: 0.75rem;
  }

  .tab-btn {
    padding: 0.35rem 0.7rem;
    font-size: 0.75rem;
  }

  .achievement-list {
    gap: 8px;
  }

  .achievement-item {
    gap: 8px;
    padding: 10px;
  }

  .achievement-icon {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .achievement-title {
    font-size: 0.9rem;
  }

  .achievement-desc {
    font-size: 0.75rem;
  }

  .achievement-time {
    font-size: 0.7rem;
  }

  .status-unlocked,
  .status-locked {
    font-size: 1rem;
  }
}
</style>
