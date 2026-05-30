<template>
  <div class="detail-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
    </header>

    <main class="content">
      <div class="character-image">
        <img :src="character?.image" :alt="character?.name" />
      </div>
      <h1 class="name">{{ character?.name }}</h1>
      <p class="desc">{{ character?.desc }}</p>

      <div class="bond-section">
        <h2>羁绊等级</h2>
        <div class="bond-bar">
          <div class="bond-fill" :style="{ width: bondPercent + '%' }"></div>
        </div>
        <span class="bond-points">{{ bondPoints }} / 100</span>
      </div>

      <div class="expressions">
        <h2>照片</h2>
        <div class="expressions-grid">
          <img
            v-for="photo in characterPhotos"
            :key="photo"
            :src="`${baseUrl}data/avatars/${photo}.jpg`"
            :alt="photo"
            @error="($event.target as HTMLImageElement).style.display='none'"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const route = useRoute()
const router = useRouter()
const gameStore = useGameStore()

const baseUrl = import.meta.env.BASE_URL
const characterData: Record<string, { name: string; desc: string; image: string; photos: string[] }> = {
  tangxin: { name: '唐鑫', desc: '故事的男主角', image: `${baseUrl}data/avatars/tangxin_hiking.jpg`, photos: ['tangxin_hiking', 'tangxin_maiwan'] },
  suqingyan: { name: '苏清颜', desc: '明媚飒爽的群主', image: `${baseUrl}data/avatars/suqingyan_avatar.jpg`, photos: ['suqingyan_normal', 'suqingyan_sport'] },
  linwanxing: { name: '林晚星', desc: '温柔腼腆的小学老师', image: `${baseUrl}data/avatars/linwanxing_avatar.jpg`, photos: ['linwanxing_avatar'] },
  xuzhinan: { name: '许知楠', desc: '成熟克制的国企行政', image: `${baseUrl}data/avatars/xuzhinan_avatar.jpg`, photos: ['xuzhinan_avatar', 'xuzhinan_hiking'] }
}

const character = computed(() => characterData[route.params.id as string])
const characterPhotos = computed(() => character.value?.photos || [])
const bondPoints = computed(() => gameStore.state.bondPoints[route.params.id as string] || 0)
const bondPercent = computed(() => Math.min(100, bondPoints.value))
</script>

<style scoped>
.detail-screen {
  width: 100%;
  height: 100%;
  background: var(--color-background);
}

.header {
  padding: 1rem;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(232, 232, 232, 0.1);
  color: var(--color-on-background);
  font-size: 1.2rem;
}

.content {
  padding: 1rem;
  text-align: center;
}

.character-image img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-primary);
}

.name {
  font-size: 1.5rem;
  color: var(--color-on-background);
  margin: 1rem 0 0.5rem;
}

.desc {
  color: rgba(232, 232, 232, 0.6);
  margin-bottom: 2rem;
}

.bond-section {
  margin-bottom: 2rem;
}

.bond-section h2 {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.5);
  margin-bottom: 0.5rem;
}

.bond-bar {
  height: 8px;
  background: rgba(232, 232, 232, 0.2);
  border-radius: 4px;
  overflow: hidden;
}

.bond-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bond-points {
  display: block;
  margin-top: 0.5rem;
  color: var(--color-on-background);
  font-size: 0.85rem;
}

.expressions h2 {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.5);
  margin-bottom: 1rem;
}

.expressions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.expressions-grid img {
  aspect-ratio: 1;
  border-radius: 12px;
  background: rgba(232, 232, 232, 0.1);
  object-fit: cover;
}
</style>