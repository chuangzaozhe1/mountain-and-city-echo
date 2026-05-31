<template>
  <Transition name="history-slide">
    <div v-if="visible" class="history-panel">
      <div class="history-header">
        <h3>对话历史</h3>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>
      <div class="history-list" ref="listRef">
        <div
          v-for="(item, index) in history"
          :key="index"
          class="history-item"
          :class="{ narrator: item.speaker === '旁白' }"
        >
          <span class="history-speaker">{{ item.speaker }}</span>
          <span class="history-text">{{ item.text }}</span>
        </div>
        <div v-if="history.length === 0" class="history-empty">
          暂无对话历史
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

interface DialogueItem {
  speaker: string
  text: string
}

const props = defineProps<{
  visible: boolean
  history: DialogueItem[]
}>()

defineEmits<{
  close: []
}>()

const listRef = ref<HTMLElement | null>(null)

watch(() => props.history.length, async () => {
  await nextTick()
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
})
</script>

<style scoped>
.history-panel {
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  max-height: 60vh;
  background: linear-gradient(135deg, rgba(10, 10, 25, 0.98) 0%, rgba(20, 15, 40, 0.95) 100%);
  border-radius: 16px;
  border: 1px solid rgba(180, 160, 255, 0.25);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  z-index: 60;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(180, 160, 255, 0.15);
}

.history-header h3 {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0;
}

.close-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.history-list::-webkit-scrollbar {
  width: 4px;
}

.history-list::-webkit-scrollbar-track {
  background: transparent;
}

.history-list::-webkit-scrollbar-thumb {
  background: rgba(180, 160, 255, 0.3);
  border-radius: 2px;
}

.history-item {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.history-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.history-speaker {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary, #7c6fcd);
  margin-right: 8px;
}

.history-item.narrator .history-speaker {
  color: rgba(255, 255, 255, 0.5);
}

.history-text {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
}

.history-empty {
  text-align: center;
  color: rgba(255, 255, 255, 0.4);
  padding: 2rem 0;
}

/* 过渡动画 */
.history-slide-enter-active,
.history-slide-leave-active {
  transition: all 0.3s ease;
}

.history-slide-enter-from,
.history-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
