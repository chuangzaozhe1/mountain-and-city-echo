<template>
  <div
    class="story-screen"
    @click="handleClick"
  >
    <!-- 背景 -->
    <transition name="bg-fade" mode="out-in">
      <div
        :key="storyStore.currentBackground"
        class="bg-layer"
        :style="{ background: storyStore.currentBackground ? getBackgroundStyle(storyStore.currentBackground) : defaultBg }"
      ></div>
    </transition>

    <!-- 角色层 -->
    <div class="characters">
      <div
        v-for="(char, idx) in storyStore.currentCharacters"
        :key="char.characterId"
        class="character-slot"
        :class="[`pos-${char.position}`, `enter-${idx}`]"
      >
        <div class="char-frame" :class="`theme-${char.characterId}`">
          <img class="char-avatar-img" :src="`${baseUrl}data/avatars/${char.characterId}_avatar.jpg`" :alt="getCharName(char.characterId)" @error="($event.target as HTMLImageElement).style.display='none'" />
          <div class="char-avatar-emoji" :style="{ display: 'none' }">{{ getAvatar(char.characterId) }}</div>
          <div class="char-label">{{ getCharName(char.characterId) }}</div>
        </div>
      </div>
    </div>

    <!-- 加载 -->
    <div v-if="storyStore.state.isLoading" class="overlay loading">
      <div class="loader">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
      <span>加载中</span>
    </div>

    <!-- 错误 -->
    <div v-else-if="storyStore.state.error" class="overlay error">
      <div class="err-box">
        <span class="err-icon">✕</span>
        <p>{{ storyStore.state.error }}</p>
        <button class="btn" @click="router.back()">返回</button>
      </div>
    </div>

    <!-- 章节结束 -->
    <div v-else-if="storyStore.state.isChapterComplete" class="overlay chapter-end">
      <div class="end-box">
        <div class="end-badge">COMPLETE</div>
        <h2>{{ storyStore.state.currentChapterTitle }}</h2>
        <div class="end-btns">
          <button v-if="hasNextChapter" class="btn primary" @click.stop="goToNext">
            继续下一章 →
          </button>
          <button class="btn ghost" @click.stop="router.back()">← 返回</button>
        </div>
      </div>
    </div>

    <!-- 对话框 -->
    <div class="dialogue-area">
      <transition name="dialogue-slide" mode="out-in">
        <div v-if="storyStore.state.choices.length > 0" key="choices" class="choice-wrap">
          <div class="choice-label">— 请选择 —</div>
          <div
            v-for="c in storyStore.state.choices"
            :key="c.choiceId"
            class="choice-item"
            @click.stop="sfxStore.play('choice'); storyStore.makeChoice(c.choiceId)"
          >
            {{ c.text }}
          </div>
        </div>

        <div v-else key="dialogue" class="dialogue-wrap">
          <div class="dialogue-box" :class="{ 'typing': !storyStore.state.isTextComplete }">
            <!-- 说话人 -->
            <div class="speaker" :class="{ 'narrator': storyStore.currentSpeaker === '旁白' }">
              <span class="speaker-txt">{{ storyStore.currentSpeaker }}</span>
            </div>
            <!-- 正文 -->
            <div class="text-body">
              {{ storyStore.state.displayedText }}<span v-if="!storyStore.state.isTextComplete" class="blinker">▐</span>
            </div>
          </div>
          <!-- BGM 控制器 -->
          <div class="bgm-bar" v-if="bgmStore.isEnabled">
            <span class="bgm-icon" :class="{ playing: bgmStore.isPlaying }">♪</span>
            <span class="bgm-name" v-if="bgmStore.currentTrackName">{{ bgmStore.currentTrackName }}</span>
            <button class="bgm-btn" @click.stop="bgmStore.toggleMute()">{{ bgmStore.isMuted ? '🔇' : '🔊' }}</button>
            <button class="bgm-btn" @click.stop="bgmStore.refreshTrack()">🔄</button>
          </div>
          <!-- 底部提示 -->
          <div class="tap-hint">
            <span class="tap-icon">▼</span>
            <span>点击继续</span>
          </div>
        </div>
      </transition>
    </div>

    <!-- 顶部栏 -->
    <div class="top-bar">
      <button class="bar-btn" @click.stop="handleBack">✕</button>
      <div class="bar-title">{{ storyStore.state.currentChapterTitle }}</div>
      <button class="bar-btn" :class="{ on: storyStore.state.isAutoPlay }" @click.stop="storyStore.toggleAutoPlay">
        {{ storyStore.state.isAutoPlay ? '⏸' : '▶' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStoryStore } from '@/stores/story'
import { useSfxStore } from '@/stores/sfx'
import { useBgmStore } from '@/stores/bgm'

const route = useRoute()
const router = useRouter()
const storyStore = useStoryStore()
const sfxStore = useSfxStore()
const bgmStore = useBgmStore()
const baseUrl = import.meta.env.BASE_URL

const chapterId = computed(() => route.params.chapterId as string)
const hasNextChapter = computed(() => !!storyStore.state.nextChapterId)

onMounted(() => {
  storyStore.loadChapter(chapterId.value)
  window.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  storyStore.cleanup()
})

function handleKeydown(e: KeyboardEvent) {
  if (e.code === 'Space' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}

function handleClick() {
  sfxStore.play('click')
  storyStore.nextDialogue()
}
function handleBack() {
  sfxStore.play('click')
  router.back()
}

function goToNext() {
  const n = storyStore.state.nextChapterId
  if (n) storyStore.loadChapter(n)
}

function getAvatar(id: string) {
  return { tangxin: '♂', suqingyan: '♀', linwanxing: '✿', xuzhinan: '◆' }[id] || '?'
}
function getCharName(id: string) {
  return { tangxin: '唐鑫', suqingyan: '苏清颜', linwanxing: '林晚星', xuzhinan: '许知楠' }[id] || id
}

// 背景图片 - 使用本地图片（Unsplash 免费图片）
const bgImages: Record<string, string> = {
  // 城市场景
  office: `${baseUrl}data/images/city_1.jpg`,
  home_night: `${baseUrl}data/images/night_1.jpg`,
  chongqing_night: `${baseUrl}data/images/night_2.jpg`,
  chongqing_station: `${baseUrl}data/images/night_2.jpg`,
  station: `${baseUrl}data/images/night_2.jpg`,
  metro_station: `${baseUrl}data/images/night_2.jpg`,

  // 咖啡店/餐厅场景
  cafe_interior: `${baseUrl}data/images/cafe_1.jpg`,
  cafe: `${baseUrl}data/images/cafe_1.jpg`,
  restaurant: `${baseUrl}data/images/cafe_1.jpg`,
  hotpot_restaurant: `${baseUrl}data/images/cafe_1.jpg`,

  // 夜市/夜景场景
  night_market: `${baseUrl}data/images/night_2.jpg`,
  night_street: `${baseUrl}data/images/night_2.jpg`,

  // 山野场景
  jinyun_mountain_trail: `${baseUrl}data/images/mountain_1.jpg`,
  jinyun_summit: `${baseUrl}data/images/mountain_2.jpg`,
  mountain_trail: `${baseUrl}data/images/mountain_1.jpg`,
  mountain_path: `${baseUrl}data/images/mountain_1.jpg`,
  mountain_viewpoint: `${baseUrl}data/images/mountain_2.jpg`,
  mountain_night: `${baseUrl}data/images/night_1.jpg`,
  mountain_rain: `${baseUrl}data/images/night_1.jpg`,

  // 湖边/野餐场景
  dai_lake_picnic: `${baseUrl}data/images/mountain_1.jpg`,
  minsu: `${baseUrl}data/images/night_1.jpg`,

  // 浪漫场景
  romantic: `${baseUrl}data/images/romantic_1.jpg`,

  // 沙漠场景
  desert: `${baseUrl}data/images/night_2.jpg`,
  desert_night: `${baseUrl}data/images/night_1.jpg`,

  // 其他场景
  school_entrance: `${baseUrl}data/images/city_1.jpg`,
  meeting_hall: `${baseUrl}data/images/city_1.jpg`,
  school_office: `${baseUrl}data/images/city_1.jpg`,
  classroom: `${baseUrl}data/images/city_1.jpg`,
}

// 背景色（作为备用）
const bgColors: Record<string, string> = {
  // 城市场景
  office: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
  home_night: 'linear-gradient(180deg, #2d3436 0%, #1e272e 100%)',
  chongqing_night: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 50%, #2d2d6b 100%)',
  chongqing_station: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
  station: 'linear-gradient(135deg, #636e72 0%, #2d3436 100%)',
  metro_station: 'linear-gradient(135deg, #636e72 0%, #b2bec3 100%)',

  // 咖啡店/餐厅场景
  cafe_interior: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%)',
  cafe: 'linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%)',
  restaurant: 'linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%)',
  hotpot_restaurant: 'linear-gradient(135deg, #d63031 0%, #e17055 50%, #fab1a0 100%)',

  // 夜市/夜景场景
  night_market: 'linear-gradient(180deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)',
  night_street: 'linear-gradient(180deg, #1a1a2e 0%, #e74c3c 50%, #f39c12 100%)',

  // 山野场景
  jinyun_mountain_trail: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #dfe6e9 100%)',
  jinyun_summit: 'linear-gradient(180deg, #74b9ff 0%, #fdcb6e 100%)',
  mountain_trail: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #81ecec 100%)',
  mountain_path: 'linear-gradient(135deg, #00b894 0%, #55efc4 50%, #81ecec 100%)',
  mountain_viewpoint: 'linear-gradient(180deg, #74b9ff 0%, #a29bfe 50%, #81ecec 100%)',
  mountain_night: 'linear-gradient(180deg, #0a1628 0%, #1a2a4a 50%, #2d4a6a 100%)',
  mountain_rain: 'linear-gradient(180deg, #0a1628 0%, #1a2a4a 50%, #2d4a6a 100%)',

  // 湖边/野餐场景
  dai_lake_picnic: 'linear-gradient(135deg, #a8e6cf 0%, #88d8b0 50%, #56c596 100%)',
  minsu: 'linear-gradient(135deg, #fab1a0 0%, #ffeaa7 100%)',

  // 浪漫场景
  romantic: 'linear-gradient(180deg, #2d3436 0%, #6c5ce7 50%, #a29bfe 100%)',

  // 沙漠场景
  desert: 'linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)',
  desert_night: 'linear-gradient(180deg, #0c0c1e 0%, #1a1a3e 50%, #2d2d6b 100%)',

  // 其他场景
  school_entrance: 'linear-gradient(135deg, #00b894 0%, #81ecec 100%)',
  meeting_hall: 'linear-gradient(135deg, #636e72 0%, #b2bec3 100%)',
  school_office: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
  classroom: 'linear-gradient(135deg, #dfe6e9 0%, #b2bec3 100%)',
}

const defaultBg = 'linear-gradient(180deg, #1e1e2e 0%, #2d2d44 100%)'

function getBackgroundStyle(id: string) {
  // 优先使用图片背景
  if (bgImages[id]) {
    return `url(${bgImages[id]}) center/cover no-repeat, ${bgColors[id] || defaultBg}`
  }
  // 备用渐变背景
  return bgColors[id] || defaultBg
}
</script>

<style scoped>
.story-screen {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

/* 背景 */
.bg-layer {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
}

/* 背景切换动画 */
.bg-fade-enter-active,
.bg-fade-leave-active {
  transition: opacity 0.8s ease;
}

.bg-fade-enter-from,
.bg-fade-leave-to {
  opacity: 0;
}

/* 角色 */
.characters {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
}

.character-slot {
  position: absolute;
  bottom: 40%;
}

.pos-left { left: 5%; }
.pos-center { left: 50%; transform: translateX(-50%); }
.pos-right { right: 5%; }

.enter-0 { animation: char-enter 0.4s ease-out; }
.enter-1 { animation: char-enter 0.5s ease-out; }

@keyframes char-enter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.pos-center.enter-1 { animation-name: char-enter-c; }
@keyframes char-enter-c {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 对话框动画 */
.dialogue-slide-enter-active,
.dialogue-slide-leave-active {
  transition: all 0.3s ease;
}

.dialogue-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.dialogue-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.char-frame {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  animation: char-idle 3s ease-in-out infinite;
}

@keyframes char-idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.pos-left .char-frame { animation-name: char-idle-left; }
@keyframes char-idle-left {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.pos-right .char-frame { animation-name: char-idle-right; }
@keyframes char-idle-right {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.char-avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.char-avatar-emoji {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: white;
}

.theme-tangxin { background: linear-gradient(135deg, #0984e3, #74b9ff); }
.theme-suqingyan { background: linear-gradient(135deg, #fd79a8, #e84393); }
.theme-linwanxing { background: linear-gradient(135deg, #00b894, #55efc4); }
.theme-xuzhinan { background: linear-gradient(135deg, #636e72, #2d3436); }
.theme-tangxin .char-avatar-img,
.theme-tangxin .char-avatar-emoji { border: 2px solid #0984e3; }
.theme-suqingyan .char-avatar-img,
.theme-suqingyan .char-avatar-emoji { border: 2px solid #fd79a8; }
.theme-linwanxing .char-avatar-img,
.theme-linwanxing .char-avatar-emoji { border: 2px solid #00b894; }
.theme-xuzhinan .char-avatar-img,
.theme-xuzhinan .char-avatar-emoji { border: 2px solid #636e72; }

.char-label {
  color: white;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 10px;
  background: rgba(0,0,0,0.5);
  border-radius: 10px;
  backdrop-filter: blur(4px);
}

.theme-tangxin .char-label { background: rgba(9, 132, 227, 0.7); }
.theme-suqingyan .char-label { background: rgba(253, 121, 168, 0.7); }
.theme-linwanxing .char-label { background: rgba(0, 184, 148, 0.7); }
.theme-xuzhinan .char-label { background: rgba(99, 110, 114, 0.7); }

/* 顶部栏 */
.top-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  z-index: 50;
  gap: 16px;
}

.bar-btn {
  width: 40px; height: 40px;
  min-width: 40px;
  border-radius: 50%;
  background: rgba(0,0,0,0.5);
  color: white;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
  flex-shrink: 0;
}
.bar-btn:hover { background: rgba(124,111,205,0.7); }
.bar-btn.on { background: var(--color-primary); }

.bar-title {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.85);
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
  text-align: center;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 加载/错误 */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.75);
  z-index: 100;
}

.loader {
  display: flex;
  gap: 8px;
}

.dot {
  width: 12px; height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: dot-bounce 0.6s ease-in-out infinite;
}
.dot:nth-child(2) { animation-delay: 0.1s; }
.dot:nth-child(3) { animation-delay: 0.2s; }

@keyframes dot-bounce {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

.loading span {
  margin-top: 16px;
  color: rgba(255,255,255,0.7);
  font-size: 0.9rem;
}

.err-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 32px 48px;
  background: rgba(30,30,46,0.95);
  border-radius: 16px;
  border: 1px solid rgba(255,100,100,0.3);
}

.err-icon {
  width: 48px; height: 48px;
  border-radius: 50%;
  background: rgba(255,100,100,0.2);
  color: #ff6b6b;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.err-box p { color: white; margin: 0; }

/* 章节结束 */
.chapter-end { background: rgba(10,10,20,0.9); backdrop-filter: blur(10px); }

.end-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 60px;
  background: linear-gradient(135deg, rgba(124,111,205,0.15) 0%, rgba(20,20,35,0.95) 100%);
  border-radius: 24px;
  border: 1px solid rgba(124,111,205,0.3);
}

.end-badge {
  font-size: 0.7rem;
  letter-spacing: 4px;
  color: var(--color-primary);
  background: rgba(124,111,205,0.2);
  padding: 4px 16px;
  border-radius: 20px;
}

.end-box h2 {
  color: white;
  font-size: 1.4rem;
  font-weight: normal;
  margin: 0;
}

.end-btns {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  padding: 12px 28px;
  border-radius: 20px;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: all 0.25s;
}

.btn.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5a4fb8 100%);
  color: white;
}
.btn.primary:hover { transform: scale(1.05); box-shadow: 0 4px 20px rgba(124,111,205,0.5); }

.btn.ghost {
  background: rgba(255,255,255,0.08);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.15);
}
.btn.ghost:hover { background: rgba(255,255,255,0.15); }

/* 对话区域 */
.dialogue-area {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 16px 20px;
  pointer-events: none;
  z-index: 10;
}

.dialogue-area > * {
  pointer-events: auto;
}

/* 对话框 */
.dialogue-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.dialogue-box {
  width: 100%;
  max-width: 720px;
  min-height: 180px;
  max-height: 45vh;
  background: linear-gradient(135deg, rgba(10,10,25,0.95) 0%, rgba(20,15,40,0.92) 100%);
  border-radius: 20px;
  padding: 24px 28px 22px;
  border: 1px solid rgba(180,160,255,0.25);
  backdrop-filter: blur(20px);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.6),
    0 0 0 1px rgba(255,255,255,0.08) inset,
    0 2px 12px rgba(124,111,205,0.2) inset;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}

.dialogue-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(180,160,255,0.4) 50%, transparent 100%);
}

.dialogue-box.typing {
  border-color: rgba(180,160,255,0.35);
  box-shadow:
    0 8px 32px rgba(0,0,0,0.5),
    0 0 0 1px rgba(255,255,255,0.08) inset,
    0 2px 12px rgba(124,111,205,0.2) inset;
}

.dialogue-box::-webkit-scrollbar {
  width: 4px;
}

.dialogue-box::-webkit-scrollbar-track {
  background: transparent;
}

.dialogue-box::-webkit-scrollbar-thumb {
  background: rgba(180,160,255,0.3);
  border-radius: 2px;
}

.dialogue-box::-webkit-scrollbar-thumb:hover {
  background: rgba(180,160,255,0.5);
}

.speaker {
  display: inline-block;
  margin-bottom: 12px;
  padding: 5px 16px;
  background: linear-gradient(135deg, rgba(124,111,205,0.9) 0%, rgba(155,89,182,0.8) 100%);
  border-radius: 0 14px 14px 0;
  margin-left: -28px;
  padding-left: 32px;
  position: relative;
  box-shadow: 0 2px 8px rgba(124,111,205,0.3);
}

.speaker::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 12px;
  right: 4px;
  height: 4px;
  background: linear-gradient(90deg, rgba(124,111,205,0.3) 0%, transparent 100%);
  border-radius: 0 0 4px 4px;
}

.speaker-txt {
  color: white;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.speaker.narrator {
  background: rgba(255,255,255,0.1);
  box-shadow: none;
}

.speaker.narrator::after {
  display: none;
}

.text-body {
  color: rgba(255,255,255,1);
  font-size: 1.15rem;
  line-height: 2;
  padding-left: 4px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  font-weight: 500;
}

.blinker {
  color: var(--color-primary);
  animation: blink 0.7s step-end infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* BGM 控制条 */
.bgm-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 20px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 6px;
  pointer-events: auto;
}
.bgm-icon {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}
.bgm-icon.playing {
  color: #8b5cf6;
  animation: bounce 1s ease-in-out infinite;
}
.bgm-name {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bgm-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  transition: all 0.2s;
  color: white;
}
.bgm-btn:hover {
  background: rgba(139, 92, 246, 0.5);
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.tap-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: rgba(255,255,255,0.35);
  font-size: 0.75rem;
  animation: fade-hint 2s ease-in-out infinite;
}

@keyframes fade-hint {
  0%, 100% { opacity: 0.35; }
  50% { opacity: 0.65; }
}

.tap-icon {
  animation: bounce-icon 1s ease-in-out infinite;
}

@keyframes bounce-icon {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

/* 选项 */
.choice-wrap {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(25,20,45,0.92) 100%);
  padding: 20px 16px;
  border-radius: 20px 20px 0 0;
  border: 1px solid rgba(180,160,255,0.15);
  border-bottom: none;
  backdrop-filter: blur(16px);
  box-shadow: 0 -4px 24px rgba(0,0,0,0.3);
}

.choice-label {
  text-align: center;
  color: rgba(180,160,255,0.5);
  font-size: 0.8rem;
  letter-spacing: 4px;
  margin-bottom: 6px;
}

.choice-item {
  padding: 14px 20px;
  background: linear-gradient(135deg, rgba(124,111,205,0.1) 0%, rgba(155,89,182,0.08) 100%);
  border: 1px solid rgba(124,111,205,0.25);
  border-radius: 14px;
  color: rgba(255,255,255,0.9);
  font-size: 0.95rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.choice-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s ease;
}

.choice-item:hover {
  background: linear-gradient(135deg, rgba(124,111,205,0.4) 0%, rgba(155,89,182,0.3) 100%);
  border-color: rgba(180,160,255,0.5);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(124,111,205,0.3);
}

.choice-item:hover::before {
  left: 100%;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .top-bar {
    padding: 10px 12px;
  }

  .bar-btn {
    width: 36px;
    height: 36px;
    min-width: 36px;
    font-size: 0.9rem;
  }

  .bar-title {
    font-size: 0.8rem;
  }

  .dialogue-area {
    padding: 0 12px 16px;
  }

  .dialogue-box {
    padding: 18px 20px;
    border-radius: 16px;
    min-height: 160px;
    max-height: 42vh;
  }

  .speaker {
    margin-bottom: 10px;
    padding: 4px 14px;
    margin-left: -20px;
    padding-left: 24px;
  }

  .speaker-txt {
    font-size: 0.9rem;
  }

  .text-body {
    font-size: 1.1rem;
    line-height: 1.9;
  }

  .char-avatar-img {
    width: 64px;
    height: 64px;
  }

  .char-avatar-emoji {
    width: 52px;
    height: 52px;
    font-size: 1.5rem;
  }

  .char-label {
    font-size: 0.7rem;
    padding: 2px 8px;
  }

  .choice-wrap {
    padding: 16px 12px;
  }

  .choice-item {
    padding: 12px 16px;
    font-size: 0.9rem;
  }

  .end-box {
    padding: 30px 40px;
  }

  .end-box h2 {
    font-size: 1.2rem;
  }

  .btn {
    padding: 10px 24px;
    font-size: 0.9rem;
  }
}

/* 小屏手机适配 */
@media (max-width: 375px) {
  .dialogue-box {
    padding: 16px 18px;
    min-height: 140px;
  }

  .text-body {
    font-size: 1rem;
    line-height: 1.8;
  }

  .char-avatar-img {
    width: 56px;
    height: 56px;
  }

  .char-avatar-emoji {
    width: 46px;
    height: 46px;
    font-size: 1.3rem;
  }

  .choice-item {
    padding: 10px 14px;
    font-size: 0.85rem;
  }
}

/* 安全区域适配（刘海屏、底部导航栏） */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .dialogue-area {
    padding-bottom: calc(20px + env(safe-area-inset-bottom));
  }

  .top-bar {
    padding-top: calc(12px + env(safe-area-inset-top));
  }
}
</style>