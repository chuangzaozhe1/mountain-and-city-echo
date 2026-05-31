<template>
  <Transition name="notification-slide">
    <div v-if="achievement" class="achievement-notification" @click="$emit('dismiss')">
      <div class="notification-content">
        <div class="notification-icon">{{ achievement.icon }}</div>
        <div class="notification-info">
          <span class="notification-label">成就解锁</span>
          <span class="notification-title">{{ achievement.title }}</span>
          <span class="notification-desc">{{ achievement.description }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Achievement } from '@/stores/achievement'

defineProps<{
  achievement: Achievement | null
}>()

defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.achievement-notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  cursor: pointer;
}

.notification-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  background: linear-gradient(135deg, rgba(124, 111, 205, 0.95) 0%, rgba(155, 89, 182, 0.9) 100%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(124, 111, 205, 0.4);
  backdrop-filter: blur(10px);
}

.notification-icon {
  font-size: 2rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.notification-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.notification-label {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.notification-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
}

.notification-desc {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

/* 过渡动画 */
.notification-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.notification-slide-leave-active {
  transition: all 0.3s ease;
}

.notification-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(-100px) scale(0.8);
}

.notification-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-20px);
}
</style>
