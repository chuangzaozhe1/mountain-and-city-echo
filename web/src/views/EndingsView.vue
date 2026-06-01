<template>
  <div class="endings-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>结局图鉴</h1>
      <div class="progress">{{ endingsStore.unlockedCount }}/{{ endingsStore.totalEndings }}</div>
    </header>

    <main class="content">
      <!-- 进度条 -->
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${endingsStore.completionRate}%` }"></div>
        <span class="progress-text">{{ endingsStore.completionRate }}%</span>
      </div>

      <!-- 角色结局 -->
      <div v-for="(endings, character) in endingsStore.characterEndings" :key="character" class="character-section">
        <h2 class="character-title">
          <span class="character-icon">{{ getCharacterIcon(character) }}</span>
          {{ getCharacterName(character) }}
        </h2>

        <div class="endings-grid">
          <div
            v-for="ending in endings"
            :key="ending.id"
            class="ending-card"
            :class="{ unlocked: endingsStore.isUnlocked(ending.id) }"
            @click="viewEnding(ending)"
          >
            <div class="ending-icon">{{ ending.icon }}</div>
            <div class="ending-info">
              <span class="ending-title">{{ endingsStore.isUnlocked(ending.id) ? ending.title : '???' }}</span>
              <span class="ending-desc">
                {{ endingsStore.isUnlocked(ending.id) ? ending.description : '未解锁' }}
              </span>
            </div>
            <div v-if="endingsStore.isUnlocked(ending.id)" class="ending-check">✓</div>
          </div>
        </div>
      </div>
    </main>

    <!-- 结局详情弹窗 -->
    <Transition name="modal-fade">
      <div v-if="selectedEnding" class="ending-modal" @click="selectedEnding = null">
        <div class="modal-content" @click.stop>
          <div class="modal-icon">{{ selectedEnding.icon }}</div>
          <h3 class="modal-title">{{ selectedEnding.title }}</h3>
          <p class="modal-desc">{{ selectedEnding.description }}</p>
          <div class="modal-character">
            <span class="character-label">角色：</span>
            <span class="character-name">{{ getCharacterName(selectedEnding.character) }}</span>
          </div>
          <div v-if="selectedEnding.unlockedAt" class="modal-time">
            解锁时间：{{ formatTime(selectedEnding.unlockedAt) }}
          </div>
          <button class="modal-close" @click="selectedEnding = null">关闭</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useEndingsStore, type Ending } from '@/stores/endings'

const router = useRouter()
const endingsStore = useEndingsStore()

const selectedEnding = ref<Ending | null>(null)

function getCharacterIcon(character: string): string {
  const icons: Record<string, string> = {
    suqingyan: '♀',
    linwanxing: '✿',
    xuzhinan: '◆',
    all: '👥',
    none: '👤'
  }
  return icons[character] || '?'
}

function getCharacterName(character: string): string {
  const names: Record<string, string> = {
    suqingyan: '苏清颜',
    linwanxing: '林晚星',
    xuzhinan: '徐指南',
    all: '全员',
    none: '独自'
  }
  return names[character] || character
}

function viewEnding(ending: Ending) {
  if (endingsStore.isUnlocked(ending.id)) {
    selectedEnding.value = ending
  }
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.endings-screen {
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

/* 角色区块 */
.character-section {
  margin-bottom: 1.5rem;
}

.character-title {
  font-size: 1rem;
  color: var(--color-on-background);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.character-icon {
  font-size: 1.2rem;
}

/* 结局网格 */
.endings-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ending-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.ending-card:not(.unlocked) {
  opacity: 0.5;
  cursor: default;
}

.ending-card.unlocked {
  background: rgba(124, 111, 205, 0.1);
  border-color: rgba(124, 111, 205, 0.3);
}

.ending-card.unlocked:hover {
  background: rgba(124, 111, 205, 0.2);
  transform: translateX(4px);
}

.ending-icon {
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

.ending-card.unlocked .ending-icon {
  background: rgba(124, 111, 205, 0.2);
}

.ending-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ending-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-on-background);
}

.ending-desc {
  font-size: 0.8rem;
  color: rgba(232, 232, 232, 0.6);
}

.ending-check {
  font-size: 1.2rem;
  color: #4caf50;
}

/* 弹窗 */
.ending-modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 2rem;
}

.modal-content {
  background: linear-gradient(135deg, rgba(20, 20, 35, 0.98) 0%, rgba(30, 25, 50, 0.95) 100%);
  border-radius: 20px;
  border: 1px solid rgba(124, 111, 205, 0.3);
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  color: white;
  margin-bottom: 0.5rem;
}

.modal-desc {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
}

.modal-character {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.character-label {
  color: rgba(255, 255, 255, 0.4);
}

.character-name {
  color: var(--color-primary);
}

.modal-time {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

.modal-close {
  padding: 10px 24px;
  background: rgba(124, 111, 205, 0.3);
  border: 1px solid rgba(124, 111, 205, 0.5);
  border-radius: 10px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(124, 111, 205, 0.5);
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .content {
    padding: 0 0.75rem 1.5rem;
  }

  .character-section {
    margin-bottom: 1rem;
  }

  .endings-grid {
    gap: 8px;
  }

  .ending-card {
    padding: 12px;
    gap: 10px;
  }

  .ending-icon {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
  }

  .ending-title {
    font-size: 0.9rem;
  }

  .ending-desc {
    font-size: 0.75rem;
  }

  .ending-modal {
    padding: 1rem;
  }

  .modal-content {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .modal-icon {
    font-size: 2.5rem;
  }

  .modal-title {
    font-size: 1.3rem;
  }

  .modal-desc {
    font-size: 0.95rem;
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

  .character-title {
    font-size: 0.95rem;
  }

  .character-icon {
    font-size: 1rem;
  }

  .endings-grid {
    gap: 6px;
  }

  .ending-card {
    padding: 10px;
    gap: 8px;
  }

  .ending-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .ending-title {
    font-size: 0.85rem;
  }

  .ending-desc {
    font-size: 0.7rem;
  }

  .ending-check {
    font-size: 1rem;
  }

  .ending-modal {
    padding: 0.75rem;
  }

  .modal-content {
    padding: 1.25rem;
    border-radius: 12px;
  }

  .modal-icon {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }

  .modal-title {
    font-size: 1.2rem;
  }

  .modal-desc {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
  }

  .modal-character {
    font-size: 0.85rem;
  }

  .modal-time {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .modal-close {
    padding: 8px 20px;
    font-size: 0.95rem;
  }
}
</style>
