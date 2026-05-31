<template>
  <Transition name="panel-slide">
    <div v-if="visible" class="save-load-panel">
      <div class="panel-header">
        <h3>{{ mode === 'save' ? '存档' : '读档' }}</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="panel-content">
        <!-- 自动存档 -->
        <div class="save-slot auto-save" @click="handleAutoSave">
          <div class="slot-info">
            <span class="slot-label">自动存档</span>
            <span v-if="autoSaveData" class="slot-time">
              {{ formatTime(autoSaveData.timestamp) }}
            </span>
            <span v-else class="slot-empty">暂无存档</span>
          </div>
          <div v-if="autoSaveData" class="slot-preview">
            <span class="slot-chapter">{{ getChapterTitle(autoSaveData.chapterId) }}</span>
          </div>
        </div>

        <!-- 手动存档槽位 -->
        <div
          v-for="slot in saveSlots"
          :key="slot.index"
          class="save-slot"
          :class="{ active: slot.data }"
          @click="handleSlotClick(slot.index)"
        >
          <div class="slot-info">
            <span class="slot-label">存档 {{ slot.index + 1 }}</span>
            <span v-if="slot.data" class="slot-time">
              {{ formatTime(slot.data.timestamp) }}
            </span>
            <span v-else class="slot-empty">空槽位</span>
          </div>
          <div v-if="slot.data" class="slot-preview">
            <span class="slot-chapter">{{ getChapterTitle(slot.data.chapterId) }}</span>
          </div>
          <button
            v-if="slot.data && mode === 'save'"
            class="delete-btn"
            @click.stop="handleDelete(slot.index)"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const props = defineProps<{
  visible: boolean
  mode: 'save' | 'load'
}>()

const emit = defineEmits<{
  close: []
  save: [slot: number]
  load: [slot: number]
}>()

const gameStore = useGameStore()

const autoSaveData = computed(() => {
  if (gameStore.hasAutoSave) {
    return gameStore.getSaveData()
  }
  return null
})

const saveSlots = computed(() => {
  const slots = gameStore.getSaveSlots()
  return slots.map((data, index) => ({
    index,
    data
  }))
})

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`

  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
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

function handleAutoSave() {
  if (props.mode === 'load' && autoSaveData.value) {
    emit('load', -1) // -1 表示自动存档
  }
}

function handleSlotClick(index: number) {
  if (props.mode === 'save') {
    emit('save', index)
  } else {
    const slot = saveSlots.value[index]
    if (slot.data) {
      emit('load', index)
    }
  }
}

function handleDelete(index: number) {
  if (confirm('确定要删除这个存档吗？')) {
    gameStore.deleteSlot(index)
  }
}
</script>

<style scoped>
.save-load-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  color: white;
  font-size: 1.2rem;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1.1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.panel-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.save-slot {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.save-slot:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--color-primary, #7c6fcd);
}

.save-slot.auto-save {
  border-color: rgba(124, 111, 205, 0.3);
  background: rgba(124, 111, 205, 0.1);
}

.slot-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.slot-label {
  font-size: 1rem;
  font-weight: 600;
  color: white;
}

.slot-time {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.slot-empty {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
}

.slot-preview {
  display: flex;
  align-items: center;
  gap: 12px;
}

.slot-chapter {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.delete-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(229, 115, 115, 0.2);
  border: none;
  font-size: 1rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
}

.save-slot:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(229, 115, 115, 0.4);
}

/* 过渡动画 */
.panel-slide-enter-active,
.panel-slide-leave-active {
  transition: all 0.3s ease;
}

.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
