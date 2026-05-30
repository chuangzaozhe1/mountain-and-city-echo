<template>
  <div class="gallery-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>角色图鉴</h1>
    </header>

    <main class="content">
      <div class="characters-grid">
        <button
          v-for="char in characters"
          :key="char.id"
          class="character-card"
          @click="router.push(`/characters/${char.id}`)"
        >
          <img :src="char.image" :alt="char.name" />
          <div class="info">
            <span class="name">{{ char.name }}</span>
            <span class="desc">{{ char.desc }}</span>
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const baseUrl = import.meta.env.BASE_URL
const characters = [
  { id: 'tangxin', name: '唐鑫', desc: '故事的男主角', image: `${baseUrl}data/avatars/tangxin_hiking.jpg` },
  { id: 'suqingyan', name: '苏清颜', desc: '明媚飒爽的群主', image: `${baseUrl}data/avatars/suqingyan_avatar.jpg` },
  { id: 'linwanxing', name: '林晚星', desc: '温柔腼腆的小学老师', image: `${baseUrl}data/avatars/linwanxing_avatar.jpg` },
  { id: 'xuzhinan', name: '许知楠', desc: '成熟克制的国企行政', image: `${baseUrl}data/avatars/xuzhinan_avatar.jpg` }
]
</script>

<style scoped>
.gallery-screen {
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

.characters-grid {
  display: grid;
  gap: 1rem;
}

.character-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 16px;
  padding: 1rem;
  text-align: left;
  transition: all 0.3s ease;
}

.character-card:hover {
  border-color: var(--color-primary);
}

.character-card img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background: rgba(232, 232, 232, 0.1);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.name {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--color-on-background);
}

.desc {
  font-size: 0.85rem;
  color: rgba(232, 232, 232, 0.6);
}
</style>