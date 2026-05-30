<template>
  <div class="album-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>回忆相册</h1>
    </header>

    <main class="content">
      <p v-if="gameStore.state.photos.length === 0" class="empty">
        还没有解锁任何照片，继续游戏解锁回忆吧~
      </p>

      <div v-else class="photos-grid">
        <div v-for="photo in gameStore.state.photos" :key="photo" class="photo-item">
          <img :src="`${baseUrl}data/images/photos/${photo}.jpg`" :alt="photo" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()
const baseUrl = import.meta.env.BASE_URL
</script>

<style scoped>
.album-screen {
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

.empty {
  text-align: center;
  color: rgba(232, 232, 232, 0.5);
  margin-top: 3rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.photo-item {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(232, 232, 232, 0.1);
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>