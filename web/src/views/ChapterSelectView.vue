<template>
  <div class="chapter-select">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>章节选择</h1>
    </header>

    <main class="content">
      <div class="chapters-grid">
        <button
          v-for="chapter in chapters"
          :key="chapter.id"
          class="chapter-card"
          :class="{ locked: !chapter.unlocked }"
          :disabled="!chapter.unlocked"
          @click="selectChapter(chapter.id)"
        >
          <span class="chapter-number">{{ chapter.number }}</span>
          <span class="chapter-title">{{ chapter.title }}</span>
          <span v-if="!chapter.unlocked" class="lock-icon">🔒</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

interface ChapterInfo {
  id: string
  number: number
  title: string
  unlocked: boolean
}

const chapters = ref<ChapterInfo[]>([])

onMounted(() => {
  gameStore.loadFromStorage()
  chapters.value = [
    { id: 'chapter_01', number: 1, title: '山城内耗与山野契机', unlocked: true },
    { id: 'chapter_02', number: 2, title: '缙云山初见，风里藏着心动的味道', unlocked: gameStore.isChapterUnlocked('chapter_02') },
    { id: 'chapter_03', number: 3, title: '咖啡香里的三束温柔', unlocked: gameStore.isChapterUnlocked('chapter_03') },
    { id: 'chapter_04', number: 4, title: '夜市烟火与心动试探', unlocked: gameStore.isChapterUnlocked('chapter_04') },
    { id: 'chapter_05', number: 5, title: '面试前夜的抉择', unlocked: gameStore.isChapterUnlocked('chapter_05') },
    { id: 'chapter_06', number: 6, title: '雨夜山径与开放式结局', unlocked: gameStore.isChapterUnlocked('chapter_06') },
  ]
})

function selectChapter(chapterId: string) {
  router.push(`/story/${chapterId}`)
}
</script>

<style scoped>
.chapter-select {
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

.chapters-grid {
  display: grid;
  gap: 1rem;
}

.chapter-card {
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.chapter-card:not(.locked):hover {
  border-color: var(--color-primary);
  background: rgba(124, 111, 205, 0.1);
}

.chapter-card.locked {
  opacity: 0.5;
}

.chapter-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
}

.chapter-title {
  font-size: 1rem;
  color: var(--color-on-background);
}

.lock-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.2rem;
}
</style>