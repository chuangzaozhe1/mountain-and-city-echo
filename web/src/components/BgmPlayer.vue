<template>
  <div class="bgm-player" v-if="bgmStore.isEnabled">
    <!-- 播放状态指示器 -->
    <div class="bgm-indicator" :class="{ playing: bgmStore.isPlaying }">
      <span class="bgm-icon">♪</span>
      <span class="bgm-name" v-if="bgmStore.currentTrackName">{{ bgmStore.currentTrackName }}</span>
    </div>

    <!-- 控制按钮 -->
    <div class="bgm-controls">
      <button class="bgm-btn" @click="bgmStore.toggleMute()" :title="bgmStore.isMuted ? '取消静音' : '静音'">
        {{ bgmStore.isMuted ? '🔇' : '🔊' }}
      </button>
      <button class="bgm-btn" @click="bgmStore.refreshTrack()" title="切换音乐">
        🔄
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBgmStore } from '@/stores/bgm'

const bgmStore = useBgmStore()
</script>

<style scoped>
.bgm-player {
  position: fixed;
  top: 60px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  pointer-events: auto;
}

.bgm-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.bgm-icon {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  animation: pulse 2s ease-in-out infinite;
}

.bgm-indicator.playing .bgm-icon {
  color: #8b5cf6;
  animation: bounce 1s ease-in-out infinite;
}

.bgm-name {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bgm-controls {
  display: flex;
  gap: 4px;
}

.bgm-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.bgm-btn:hover {
  background: rgba(139, 92, 246, 0.5);
  transform: scale(1.1);
}

@keyframes pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
</style>
