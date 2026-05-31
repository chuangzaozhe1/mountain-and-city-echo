<template>
  <div class="scene-review-screen">
    <header class="header">
      <button class="back-btn" @click="router.back()">←</button>
      <h1>场景回顾</h1>
    </header>

    <main class="content">
      <!-- 章节列表 -->
      <div class="chapter-list">
        <div
          v-for="chapter in chapters"
          :key="chapter.id"
          class="chapter-card"
          :class="{ locked: !chapter.unlocked }"
        >
          <div class="chapter-header" @click="toggleChapter(chapter.id)">
            <span class="chapter-icon">{{ chapter.unlocked ? '📖' : '🔒' }}</span>
            <span class="chapter-title">{{ chapter.title }}</span>
            <span class="chapter-arrow">{{ expandedChapter === chapter.id ? '▼' : '▶' }}</span>
          </div>

          <!-- 场景列表 -->
          <Transition name="expand">
            <div v-if="expandedChapter === chapter.id && chapter.unlocked" class="scene-list">
              <div
                v-for="scene in chapter.scenes"
                :key="scene.id"
                class="scene-item"
                @click="reviewScene(chapter.id, scene.id)"
              >
                <div class="scene-preview">
                  <div class="scene-bg" :style="{ background: getSceneBg(scene.background) }"></div>
                </div>
                <div class="scene-info">
                  <span class="scene-name">{{ scene.name }}</span>
                  <span class="scene-desc">{{ scene.description }}</span>
                </div>
              </div>
            </div>
          </Transition>
        </div>
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

interface SceneInfo {
  id: string
  name: string
  description: string
  background: string
}

interface ChapterInfo {
  id: string
  title: string
  unlocked: boolean
  scenes: SceneInfo[]
}

const chapters = ref<ChapterInfo[]>([])
const expandedChapter = ref<string | null>(null)

onMounted(() => {
  // 加载章节和场景数据
  chapters.value = [
    {
      id: 'chapter_01',
      title: '第一章：山城内耗与山野契机',
      unlocked: gameStore.isChapterUnlocked('chapter_01'),
      scenes: [
        { id: 'scene_01_01', name: '办公室', description: '唐鑫的日常工作', background: 'office' },
        { id: 'scene_01_02', name: '出租屋', description: '夜晚的思考', background: 'home_night' }
      ]
    },
    {
      id: 'chapter_02',
      title: '第二章：缙云山初见',
      unlocked: gameStore.isChapterUnlocked('chapter_02'),
      scenes: [
        { id: 'scene_02_01', name: '山间小径', description: '登山的开始', background: 'mountain_trail' },
        { id: 'scene_02_02', name: '山顶', description: '美丽的风景', background: 'mountain_viewpoint' }
      ]
    },
    {
      id: 'chapter_03',
      title: '第三章：咖啡香里的三束温柔',
      unlocked: gameStore.isChapterUnlocked('chapter_03'),
      scenes: [
        { id: 'scene_03_01', name: '咖啡厅', description: '温暖的相遇', background: 'cafe' }
      ]
    },
    {
      id: 'chapter_04',
      title: '第四章：夜市烟火与心动试探',
      unlocked: gameStore.isChapterUnlocked('chapter_04'),
      scenes: [
        { id: 'scene_04_01', name: '夜市', description: '热闹的夜晚', background: 'night_market' }
      ]
    },
    {
      id: 'chapter_05',
      title: '第五章：面试前夜的抉择',
      unlocked: gameStore.isChapterUnlocked('chapter_05'),
      scenes: [
        { id: 'scene_05_01', name: '重庆夜景', description: '城市的另一面', background: 'chongqing_night' }
      ]
    },
    {
      id: 'chapter_06',
      title: '第六章：山野落幕',
      unlocked: gameStore.isChapterUnlocked('chapter_06'),
      scenes: [
        { id: 'scene_06_01', name: '浪漫场景', description: '故事的终章', background: 'romantic' }
      ]
    }
  ]
})

function toggleChapter(chapterId: string) {
  expandedChapter.value = expandedChapter.value === chapterId ? null : chapterId
}

function reviewScene(chapterId: string, sceneId: string) {
  // 跳转到场景回顾
  router.push(`/story/${chapterId}?scene=${sceneId}&review=true`)
}

function getSceneBg(background: string): string {
  const bgColors: Record<string, string> = {
    office: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
    home_night: 'linear-gradient(180deg, #2d3436 0%, #1e272e 100%)',
    mountain_trail: 'linear-gradient(135deg, #00b894 0%, #55efc4 100%)',
    mountain_viewpoint: 'linear-gradient(180deg, #74b9ff 0%, #a29bfe 100%)',
    cafe: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 100%)',
    night_market: 'linear-gradient(180deg, #1a1a2e 0%, #e74c3c 100%)',
    chongqing_night: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 100%)',
    romantic: 'linear-gradient(180deg, #2d3436 0%, #6c5ce7 100%)'
  }
  return bgColors[background] || 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)'
}
</script>

<style scoped>
.scene-review-screen {
  width: 100%;
  height: 100%;
  background: var(--color-background);
  overflow-y: auto;
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  gap: 1rem;
  position: sticky;
  top: 0;
  background: var(--color-background);
  z-index: 10;
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
  padding: 0 1rem 2rem;
}

.chapter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chapter-card {
  background: rgba(232, 232, 232, 0.05);
  border: 1px solid rgba(232, 232, 232, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.chapter-card.locked {
  opacity: 0.5;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.chapter-header:hover {
  background: rgba(232, 232, 232, 0.05);
}

.chapter-icon {
  font-size: 1.2rem;
}

.chapter-title {
  flex: 1;
  font-size: 1rem;
  color: var(--color-on-background);
}

.chapter-arrow {
  font-size: 0.8rem;
  color: rgba(232, 232, 232, 0.5);
}

.scene-list {
  padding: 0 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scene-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(232, 232, 232, 0.05);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.scene-item:hover {
  background: rgba(124, 111, 205, 0.1);
  transform: translateX(4px);
}

.scene-preview {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.scene-bg {
  width: 100%;
  height: 100%;
}

.scene-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.scene-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-on-background);
}

.scene-desc {
  font-size: 0.8rem;
  color: rgba(232, 232, 232, 0.6);
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
