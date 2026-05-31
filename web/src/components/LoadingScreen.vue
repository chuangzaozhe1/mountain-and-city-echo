<template>
  <div class="loading-screen">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      <div class="loading-text">{{ text }}</div>
      <div v-if="showProgress" class="loading-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <span class="progress-text">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  text?: string
  showProgress?: boolean
  progress?: number
}>(), {
  text: '加载中...',
  showProgress: false,
  progress: 0
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background, #1e1e2e);
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.loading-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--color-primary, #7c6fcd);
  animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-ring:nth-child(1) {
  animation-delay: -0.45s;
}

.spinner-ring:nth-child(2) {
  animation-delay: -0.3s;
  border-top-color: rgba(124, 111, 205, 0.6);
}

.spinner-ring:nth-child(3) {
  animation-delay: -0.15s;
  border-top-color: rgba(124, 111, 205, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.loading-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 200px;
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary, #7c6fcd) 0%, #a29bfe 100%);
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  min-width: 40px;
  text-align: right;
}
</style>
