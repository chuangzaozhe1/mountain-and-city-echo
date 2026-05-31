<template>
  <div class="album-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>回忆相册</h1>
      <div class="progress">{{ cgStore.unlockedCount }}/{{ cgStore.totalCGs }}</div>
    </header>

    <main class="content">
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

      <!-- CG 网格 -->
      <div v-if="filteredCGs.length > 0" class="cg-grid">
        <div
          v-for="cg in filteredCGs"
          :key="cg.id"
          class="cg-item"
          :class="{ locked: !cgStore.isUnlocked(cg.id) }"
          @click="viewCG(cg)"
        >
          <div class="cg-thumbnail">
            <img
              v-if="cgStore.isUnlocked(cg.id)"
              :src="`${baseUrl}${cg.thumbnail}`"
              :alt="cg.title"
            />
            <div v-else class="lock-icon">🔒</div>
          </div>
          <div class="cg-info">
            <span class="cg-title">{{ cgStore.isUnlocked(cg.id) ? cg.title : '???' }}</span>
            <span class="cg-hint" v-if="!cgStore.isUnlocked(cg.id)">{{ cg.unlockCondition }}</span>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty">
        <p>还没有解锁任何 {{ activeTabLabel }}，继续游戏解锁吧~</p>
      </div>
    </main>

    <!-- CG 查看器 -->
    <Transition name="viewer-fade">
      <div v-if="viewingCG" class="cg-viewer" @click="viewingCG = null">
        <div class="viewer-content" @click.stop>
          <img :src="`${baseUrl}${viewingCG.fullImage}`" :alt="viewingCG.title" />
          <div class="viewer-info">
            <h3>{{ viewingCG.title }}</h3>
            <p>{{ viewingCG.unlockCondition }}</p>
          </div>
          <button class="viewer-close" @click="viewingCG = null">✕</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCgStore } from '@/stores/cg'
import type { CGItem } from '@/stores/cg'

const router = useRouter()
const cgStore = useCgStore()
const baseUrl = import.meta.env.BASE_URL

const activeTab = ref<'all' | 'character' | 'scene' | 'ending'>('all')
const viewingCG = ref<CGItem | null>(null)

const tabs = [
  { id: 'all' as const, label: '全部', icon: '📷' },
  { id: 'character' as const, label: '角色', icon: '👤' },
  { id: 'scene' as const, label: '场景', icon: '🏞️' },
  { id: 'ending' as const, label: '结局', icon: '🎬' }
]

const activeTabLabel = computed(() =>
  tabs.find(t => t.id === activeTab.value)?.label || 'CG'
)

const filteredCGs = computed(() => {
  if (activeTab.value === 'all') return cgStore.allCGs
  return cgStore.allCGs.filter(cg => cg.category === activeTab.value)
})

function viewCG(cg: CGItem) {
  if (cgStore.isUnlocked(cg.id)) {
    viewingCG.value = cg
  }
}
</script>

<style scoped>
.album-screen {
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
  background: var(--color-primary, #4a9eff);
  color: white;
}

/* CG 网格 */
.cg-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.cg-item {
  border-radius: 8px;
  overflow: hidden;
  background: rgba(232, 232, 232, 0.05);
  cursor: pointer;
  transition: transform 0.2s;
}

.cg-item:hover {
  transform: translateY(-2px);
}

.cg-item.locked {
  opacity: 0.6;
  cursor: default;
}

.cg-item.locked:hover {
  transform: none;
}

.cg-thumbnail {
  aspect-ratio: 1;
  position: relative;
  overflow: hidden;
}

.cg-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lock-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(232, 232, 232, 0.1);
}

.cg-info {
  padding: 0.5rem;
}

.cg-title {
  display: block;
  font-size: 0.75rem;
  color: var(--color-on-background);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cg-hint {
  display: block;
  font-size: 0.65rem;
  color: rgba(232, 232, 232, 0.4);
  margin-top: 0.25rem;
}

.empty {
  text-align: center;
  color: rgba(232, 232, 232, 0.5);
  margin-top: 3rem;
}

/* CG 查看器 */
.cg-viewer {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.viewer-content {
  position: relative;
  max-width: 90%;
  max-height: 90%;
}

.viewer-content img {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
}

.viewer-info {
  text-align: center;
  margin-top: 1rem;
}

.viewer-info h3 {
  color: white;
  font-size: 1.1rem;
}

.viewer-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.viewer-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
}

/* 过渡动画 */
.viewer-fade-enter-active,
.viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}

.viewer-fade-enter-from,
.viewer-fade-leave-to {
  opacity: 0;
}
</style>
