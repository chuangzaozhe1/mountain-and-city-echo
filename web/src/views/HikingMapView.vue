<template>
  <div class="hiking-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>徒步地图</h1>
    </header>

    <main class="content">
      <div class="map-container">
        <svg viewBox="0 0 400 600" class="map-svg">
          <!-- 山脉背景 -->
          <path d="M0 600 L100 400 L200 500 L300 350 L400 600 Z" fill="#2D3436" opacity="0.3"/>
          <path d="M0 600 L150 450 L250 550 L350 400 L400 600 Z" fill="#2D3436" opacity="0.2"/>

          <!-- 路径线 -->
          <path
            d="M50 550 Q150 450 200 400 T280 300 Q320 200 200 150"
            stroke="var(--color-primary)"
            stroke-width="4"
            fill="none"
            stroke-dasharray="10,5"
          />

          <!-- 地点标记 -->
          <g
            v-for="spot in spots"
            :key="spot.id"
            :transform="`translate(${spot.x}, ${spot.y})`"
            class="spot"
            @click="handleSpotClick(spot)"
          >
            <circle r="20" :fill="spot.unlocked ? 'var(--color-primary)' : '#555'" />
            <text y="5" text-anchor="middle" fill="white" font-size="12">
              {{ spot.icon }}
            </text>
          </g>
        </svg>
      </div>

      <div class="spot-info" v-if="selectedSpot">
        <h3>{{ selectedSpot.name }}</h3>
        <p>{{ selectedSpot.desc }}</p>
        <button
          v-if="selectedSpot.chapterId && selectedSpot.unlocked"
          @click="goToChapter(selectedSpot.chapterId)"
        >
          进入章节
        </button>
        <span v-else-if="!selectedSpot.unlocked" class="locked">🔒 需要解锁</span>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const spots = [
  { id: 'start', name: '立信操场', desc: '蝉鸣与羽毛球拍', icon: '🏫', x: 50, y: 550, unlocked: true, chapterId: 'chapter_01' },
  { id: 'c2', name: '立信图书馆', desc: '图书馆的灯与金佛山的云', icon: '📚', x: 180, y: 480, unlocked: gameStore.isChapterUnlocked('chapter_02'), chapterId: 'chapter_02' },
  { id: 'c3', name: '中核营地', desc: '中核的围墙与腾格里的星', icon: '⛺', x: 300, y: 420, unlocked: gameStore.isChapterUnlocked('chapter_03'), chapterId: 'chapter_03' },
  { id: 'c4', name: '三十二中', desc: '三十二中的爬山虎与酱肉包', icon: '🏢', x: 150, y: 360, unlocked: gameStore.isChapterUnlocked('chapter_04'), chapterId: 'chapter_04' },
  { id: 'c5', name: '主席台', desc: '主席台上的重逢', icon: '🎤', x: 280, y: 300, unlocked: gameStore.isChapterUnlocked('chapter_05'), chapterId: 'chapter_05' },
  { id: 'c6', name: '便利店', desc: '突然出现的背包', icon: '🏪', x: 80, y: 250, unlocked: gameStore.isChapterUnlocked('chapter_06'), chapterId: 'chapter_06' },
  { id: 'c7', name: '语文办公室', desc: '新来的语文老师', icon: '📖', x: 200, y: 200, unlocked: gameStore.isChapterUnlocked('chapter_07'), chapterId: 'chapter_07' },
  { id: 'c8', name: '教室', desc: '四份生日礼', icon: '🎁', x: 320, y: 160, unlocked: gameStore.isChapterUnlocked('chapter_08'), chapterId: 'chapter_08' },
  { id: 'c9', name: '火锅店', desc: '红汤翻滚', icon: '🍲', x: 140, y: 120, unlocked: gameStore.isChapterUnlocked('chapter_09'), chapterId: 'chapter_09' },
  { id: 'c10', name: '沙漠营地', desc: '腾格里的银河', icon: '✨', x: 260, y: 80, unlocked: gameStore.isChapterUnlocked('chapter_10'), chapterId: 'chapter_10' },
  { id: 'c11', name: '南山', desc: '南山的烟火', icon: '🎆', x: 100, y: 50, unlocked: gameStore.isChapterUnlocked('chapter_11'), chapterId: 'chapter_11' },
  { id: 'c12', name: '长白山', desc: '长白山的雪', icon: '❄️', x: 220, y: 30, unlocked: gameStore.isChapterUnlocked('chapter_12'), chapterId: 'chapter_12' },
  { id: 'c13', name: '喀纳斯', desc: '喀纳斯的金色秋天', icon: '🍂', x: 340, y: 55, unlocked: gameStore.isChapterUnlocked('chapter_13'), chapterId: 'chapter_13' },
  { id: 'c14', name: '校园', desc: '校园里的春日日常', icon: '🌸', x: 180, y: 15, unlocked: gameStore.isChapterUnlocked('chapter_14'), chapterId: 'chapter_14' },
  { id: 'c15', name: '南山之巅', desc: '山与城的回响', icon: '🏔️', x: 80, y: 10, unlocked: gameStore.isChapterUnlocked('chapter_15'), chapterId: 'chapter_15' }
]

const selectedSpot = ref<typeof spots[0] | null>(null)

function handleSpotClick(spot: typeof spots[0]) {
  selectedSpot.value = spot
}

function goToChapter(chapterId: string) {
  router.push(`/story/${chapterId}`)
}
</script>

<style scoped>
.hiking-screen {
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.map-container {
  width: 100%;
  max-width: 400px;
}

.map-svg {
  width: 100%;
  background: linear-gradient(180deg, #87CEEB 0%, #98D8C8 50%, #2D3436 100%);
  border-radius: 16px;
}

.spot {
  cursor: pointer;
  transition: transform 0.3s ease;
}

.spot:hover {
  transform: scale(1.2);
}

.spot-info {
  margin-top: 2rem;
  text-align: center;
  padding: 1.5rem;
  background: rgba(232, 232, 232, 0.05);
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}

.spot-info h3 {
  color: var(--color-on-background);
  margin-bottom: 0.5rem;
}

.spot-info p {
  color: rgba(232, 232, 232, 0.6);
  margin-bottom: 1rem;
}

.spot-info button {
  background: var(--color-primary);
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 24px;
}

.locked {
  color: rgba(232, 232, 232, 0.5);
}
</style>