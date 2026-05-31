<template>
  <div class="statistics-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>游戏统计</h1>
    </header>

    <main class="content">
      <!-- 总览卡片 -->
      <div class="overview-cards">
        <div class="stat-card primary">
          <div class="stat-icon">⏱️</div>
          <div class="stat-info">
            <span class="stat-value">{{ statsStore.formattedPlayTime }}</span>
            <span class="stat-label">总游戏时长</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📖</div>
          <div class="stat-info">
            <span class="stat-value">{{ statsStore.completedChapterCount }}</span>
            <span class="stat-label">已完成章节</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-info">
            <span class="stat-value">{{ statsStore.stats.totalDialogues }}</span>
            <span class="stat-label">总对话数</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">🔀</div>
          <div class="stat-info">
            <span class="stat-value">{{ statsStore.stats.totalChoices }}</span>
            <span class="stat-label">总选择数</span>
          </div>
        </div>
      </div>

      <!-- 存档统计 -->
      <div class="section">
        <h2 class="section-title">存档统计</h2>
        <div class="stat-row">
          <span class="stat-name">存档次数</span>
          <span class="stat-value">{{ statsStore.stats.totalSaves }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">读档次数</span>
          <span class="stat-value">{{ statsStore.stats.totalLoads }}</span>
        </div>
      </div>

      <!-- 好感度统计 -->
      <div class="section">
        <h2 class="section-title">最高好感度</h2>
        <div class="bond-stats">
          <div
            v-for="(points, characterId) in statsStore.stats.maxBondPoints"
            :key="characterId"
            class="bond-item"
          >
            <div class="bond-icon" :class="`bond-${characterId}`">
              {{ getCharacterIcon(characterId) }}
            </div>
            <div class="bond-info">
              <span class="bond-name">{{ getCharacterName(characterId) }}</span>
              <div class="bond-bar">
                <div
                  class="bond-fill"
                  :style="{ width: `${Math.min(points * 10, 100)}%` }"
                ></div>
              </div>
            </div>
            <span class="bond-value">{{ points }}</span>
          </div>
        </div>
      </div>

      <!-- 时间信息 -->
      <div class="section">
        <h2 class="section-title">时间信息</h2>
        <div class="stat-row">
          <span class="stat-name">首次游玩</span>
          <span class="stat-value">{{ formatTime(statsStore.stats.firstPlayTime) }}</span>
        </div>
        <div class="stat-row">
          <span class="stat-name">最后游玩</span>
          <span class="stat-value">{{ formatTime(statsStore.stats.lastPlayTime) }}</span>
        </div>
      </div>

      <!-- 选择历史 -->
      <div class="section">
        <h2 class="section-title">最近选择</h2>
        <div class="choice-history">
          <div
            v-for="(choice, index) in recentChoices"
            :key="index"
            class="choice-item"
          >
            <span class="choice-chapter">{{ getChapterTitle(choice.chapterId) }}</span>
            <span class="choice-time">{{ formatTime(choice.timestamp) }}</span>
          </div>
          <div v-if="recentChoices.length === 0" class="empty">
            暂无选择记录
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStatisticsStore } from '@/stores/statistics'

const router = useRouter()
const statsStore = useStatisticsStore()

const recentChoices = computed(() => {
  return [...statsStore.stats.choiceHistory]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5)
})

function getCharacterIcon(characterId: string): string {
  const icons: Record<string, string> = {
    tangxin: '♂',
    suqingyan: '♀',
    linwanxing: '✿',
    xuzhinan: '◆'
  }
  return icons[characterId] || '?'
}

function getCharacterName(characterId: string): string {
  const names: Record<string, string> = {
    tangxin: '唐鑫',
    suqingyan: '苏清颜',
    linwanxing: '林晚星',
    xuzhinan: '徐指南'
  }
  return names[characterId] || characterId
}

function getChapterTitle(chapterId: string): string {
  const titles: Record<string, string> = {
    'chapter_01': '第一章',
    'chapter_02': '第二章',
    'chapter_03': '第三章',
    'chapter_04': '第四章',
    'chapter_05': '第五章',
    'chapter_06': '第六章'
  }
  return titles[chapterId] || chapterId
}

function formatTime(timestamp: number): string {
  if (timestamp === 0) return '未记录'
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
.statistics-screen {
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
}

.content {
  padding: 0 1rem 2rem;
}

/* 总览卡片 */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.stat-card.primary {
  background: linear-gradient(135deg, rgba(124, 111, 205, 0.2) 0%, rgba(155, 89, 182, 0.15) 100%);
  border-color: rgba(124, 111, 205, 0.3);
  grid-column: span 2;
}

.stat-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(232, 232, 232, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: rgba(124, 111, 205, 0.2);
}

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-on-background);
}

.stat-card.primary .stat-value {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.8rem;
  color: rgba(232, 232, 232, 0.6);
}

/* 区块 */
.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.5);
  margin-bottom: 1rem;
}

.stat-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(232, 232, 232, 0.1);
}

.stat-name {
  font-size: 0.95rem;
  color: var(--color-on-background);
}

.stat-row .stat-value {
  font-size: 0.95rem;
  color: rgba(232, 232, 232, 0.7);
}

/* 好感度统计 */
.bond-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.bond-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(232, 232, 232, 0.05);
  border-radius: 10px;
}

.bond-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: white;
  flex-shrink: 0;
}

.bond-tangxin { background: linear-gradient(135deg, #3498db 0%, #2980b9 100%); }
.bond-suqingyan { background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%); }
.bond-linwanxing { background: linear-gradient(135deg, #00b894 0%, #55efc4 100%); }
.bond-xuzhinan { background: linear-gradient(135deg, #636e72 0%, #2d3436 100%); }

.bond-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bond-name {
  font-size: 0.85rem;
  color: var(--color-on-background);
}

.bond-bar {
  height: 6px;
  background: rgba(232, 232, 232, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.bond-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, #9b59b6 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.bond-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  min-width: 30px;
  text-align: right;
}

/* 选择历史 */
.choice-history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.choice-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  background: rgba(232, 232, 232, 0.05);
  border-radius: 8px;
}

.choice-chapter {
  font-size: 0.9rem;
  color: var(--color-on-background);
}

.choice-time {
  font-size: 0.8rem;
  color: rgba(232, 232, 232, 0.5);
}

.empty {
  text-align: center;
  color: rgba(232, 232, 232, 0.4);
  padding: 1rem;
}
</style>
