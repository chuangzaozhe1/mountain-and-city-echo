<template>
  <TransitionGroup name="error-slide" tag="div" class="error-container">
    <div
      v-for="error in errors"
      :key="error.id"
      class="error-notification"
      :class="error.type"
      @click="removeError(error.id)"
    >
      <div class="error-icon">
        {{ error.type === 'error' ? '✕' : error.type === 'warning' ? '⚠' : 'ℹ' }}
      </div>
      <div class="error-content">
        <span class="error-message">{{ error.message }}</span>
        <span class="error-time">{{ formatTime(error.timestamp) }}</span>
      </div>
      <button class="error-close" @click.stop="removeError(error.id)">✕</button>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { useError } from '@/composables/useError'

const { errors, removeError } = useError()

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}
</script>

<style scoped>
.error-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 400px;
}

.error-notification {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
}

.error-notification.error {
  background: rgba(229, 115, 115, 0.9);
  border: 1px solid rgba(229, 115, 115, 1);
}

.error-notification.warning {
  background: rgba(255, 183, 77, 0.9);
  border: 1px solid rgba(255, 183, 77, 1);
}

.error-notification.info {
  background: rgba(100, 181, 246, 0.9);
  border: 1px solid rgba(100, 181, 246, 1);
}

.error-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.error-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.error-message {
  font-size: 0.9rem;
  color: white;
  line-height: 1.4;
}

.error-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.error-close {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.7rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.2s;
}

.error-notification:hover .error-close {
  opacity: 1;
}

/* 过渡动画 */
.error-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.error-slide-leave-active {
  transition: all 0.3s ease;
}

.error-slide-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.8);
}

.error-slide-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.error-slide-move {
  transition: transform 0.3s ease;
}
</style>
