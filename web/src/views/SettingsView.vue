<template>
  <div class="settings-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>设置</h1>
    </header>

    <main class="content">
      <section class="setting-group">
        <h2>文字</h2>
        <div class="setting-item">
          <span>文字速度</span>
          <div class="speed-options">
            <button
              v-for="opt in speedOptions"
              :key="opt.value"
              :class="{ active: textSpeed === opt.value }"
              @click="textSpeed = opt.value; storyStore.setTextSpeed(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
        <div class="setting-item">
          <span>自动播放间隔</span>
          <div class="speed-options">
            <button
              v-for="opt in intervalOptions"
              :key="opt.value"
              :class="{ active: autoInterval === opt.value }"
              @click="autoInterval = opt.value; storyStore.setAutoPlayInterval(opt.value)"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>
      </section>

      <section class="setting-group">
        <h2>音频</h2>
        <div class="setting-item">
          <span>背景音乐</span>
          <button class="toggle-btn" :class="{ active: bgmStore.isEnabled }" @click="bgmStore.toggleEnabled()">
            {{ bgmStore.isEnabled ? '开启' : '关闭' }}
          </button>
        </div>
        <div class="setting-item" v-if="bgmStore.isEnabled">
          <span>音乐音量</span>
          <input type="range" v-model="bgmVolume" min="0" max="100" @input="updateBgmVolume" />
        </div>
        <div class="setting-item" v-if="bgmStore.isEnabled">
          <span>当前曲目</span>
          <span class="track-name">{{ bgmStore.currentTrackName || '未播放' }}</span>
        </div>
        <div class="setting-item">
          <span>音效音量</span>
          <input type="range" v-model="sfxVolume" min="0" max="100" @input="updateSfxVolume" />
        </div>
      </section>

      <section class="setting-group">
        <h2>存档</h2>
        <button class="danger-btn" @click="handleReset">重置游戏进度</button>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStoryStore } from '@/stores/story'
import { useGameStore } from '@/stores/game'
import { useBgmStore } from '@/stores/bgm'
import { useSfxStore } from '@/stores/sfx'

const router = useRouter()
const storyStore = useStoryStore()
const gameStore = useGameStore()
const bgmStore = useBgmStore()
const sfxStore = useSfxStore()

const speedOptions = [
  { label: '快', value: 30 },
  { label: '中', value: 50 },
  { label: '慢', value: 80 }
]

const intervalOptions = [
  { label: '2秒', value: 2000 },
  { label: '3秒', value: 3000 },
  { label: '5秒', value: 5000 }
]

const textSpeed = ref(storyStore.state.textSpeed)
const autoInterval = ref(storyStore.state.autoPlayInterval)
const bgmVolume = ref(bgmStore.volume * 100)
const sfxVolume = ref(80)

function updateBgmVolume() {
  bgmStore.setVolume(bgmVolume.value / 100)
}

function updateSfxVolume() {
  sfxStore.setVolume(sfxVolume.value / 100)
}

function handleReset() {
  if (confirm('确定要重置游戏进度吗？所有数据将被清空。')) {
    gameStore.resetGame()
    router.replace('/')
  }
}
</script>

<style scoped>
.settings-screen {
  width: 100%;
  height: 100%;
  background: var(--color-background);
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
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
  padding: 1rem;
}

.setting-group {
  margin-bottom: 2rem;
}

.setting-group h2 {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.5);
  margin-bottom: 1rem;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(232, 232, 232, 0.1);
}

.setting-item span {
  color: var(--color-on-background);
}

.speed-options {
  display: flex;
  gap: 0.5rem;
}

.speed-options button {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(232, 232, 232, 0.1);
  color: var(--color-on-background);
  font-size: 0.85rem;
}

.speed-options button.active {
  background: var(--color-primary);
}

input[type="range"] {
  width: 150px;
}

.danger-btn {
  width: 100%;
  padding: 1rem;
  background: rgba(229, 115, 115, 0.2);
  border: 1px solid #E57373;
  border-radius: 12px;
  color: #E57373;
  font-size: 1rem;
}

.toggle-btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  background: rgba(232, 232, 232, 0.1);
  color: var(--color-on-background);
  font-size: 0.85rem;
  min-width: 60px;
}

.toggle-btn.active {
  background: var(--color-primary);
}

.track-name {
  font-size: 0.85rem;
  color: rgba(232, 232, 232, 0.6);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>