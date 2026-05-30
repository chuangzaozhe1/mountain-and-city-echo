<template>
  <div class="home-screen">
    <!-- 动态背景 -->
    <div class="background-container">
      <div class="bg-layer layer-1"></div>
      <div class="bg-layer layer-2"></div>
      <div class="bg-layer layer-3"></div>
      <div class="particles">
        <div v-for="i in 15" :key="i" class="particle" :style="getParticleStyle(i)"></div>
      </div>
    </div>

    <!-- 主内容 -->
    <main class="content">
      <header class="header">
        <!-- Logo 装饰 -->
        <div class="logo-decoration">
          <div class="deco-ring ring-1"></div>
          <div class="deco-ring ring-2"></div>
          <div class="deco-ring ring-3"></div>
        </div>

        <h1 class="logo">
          <span class="logo-main">山与城的回响</span>
          <span class="logo-sub">ECHO OF MOUNTAIN AND CITY</span>
        </h1>

        <p class="quote">
          <span class="quote-mark">"</span>
          我们不是彼此的替代品，而是四季不同的花
          <span class="quote-mark">"</span>
        </p>

        <!-- 角色羁绊显示 -->
        <div class="bond-display">
          <div class="bond-item" v-for="char in characters" :key="char.id">
            <div class="bond-icon" :class="`bond-${char.id}`">{{ char.icon }}</div>
            <div class="bond-info">
              <span class="bond-name">{{ char.name }}</span>
              <div class="bond-bar">
                <div class="bond-fill" :style="{ width: `${Math.min(gameStore.state.bondPoints[char.id] * 10, 100)}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav class="menu">
        <button class="menu-btn primary" @click="handleContinue">
          <span class="btn-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon v-if="!gameStore.hasAutoSave" points="5 3 19 12 5 21 5 3"></polygon>
              <polygon v-else points="3 12 21 12 12 3" fill="currentColor"></polygon>
            </svg>
          </span>
          {{ gameStore.hasAutoSave ? '继续游戏' : '新的开始' }}
        </button>

        <button class="menu-btn secondary" @click="router.push('/chapters')">
          <span class="btn-icon">📖</span>
          章节选择
        </button>

        <button class="menu-btn secondary" @click="router.push('/characters')">
          <span class="btn-icon">💜</span>
          角色介绍
        </button>

        <button class="menu-btn secondary" @click="router.push('/album')">
          <span class="btn-icon">📷</span>
          回忆相册
        </button>

        <div class="menu-row">
          <button class="menu-btn tertiary" @click="router.push('/settings')">
            <span class="btn-icon">⚙️</span>
          </button>
          <button class="menu-btn tertiary" @click="router.push('/hiking')">
            <span class="btn-icon">🗺️</span>
          </button>
        </div>
      </nav>
    </main>

    <footer class="footer">
      <span class="version">v1.0</span>
      <span class="separator">·</span>
      <span>个人娱乐版 · 非商用</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/game'

const router = useRouter()
const gameStore = useGameStore()

const characters = [
  { id: 'tangxin', name: '唐鑫', icon: '♂' },
  { id: 'suqingyan', name: '苏清颜', icon: '♀' },
  { id: 'linwanxing', name: '林晚星', icon: '✿' },
  { id: 'xuzhinan', name: '许知楠', icon: '◆' }
]

function handleContinue() {
  const chapterId = gameStore.state.currentChapterId || 'chapter_01'
  router.push(`/story/${chapterId}`)
}

function getParticleStyle(index: number) {
  const size = 3 + (index % 3)
  const left = (index * 9) % 100
  const delay = (index * 0.4) % 4
  const duration = 4 + (index % 4)
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
.home-screen {
  width: 100%;
  height: 100%;
  position: relative;
  background: var(--color-background);
  overflow: hidden;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 背景层 */
.background-container {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.bg-layer {
  position: absolute;
  inset: 0;
  transition: opacity 1s ease;
}

.layer-1 {
  background: linear-gradient(180deg,
    rgba(124, 111, 205, 0.15) 0%,
    rgba(26, 26, 46, 0.8) 40%,
    var(--color-background) 100%
  );
}

.layer-2 {
  background: radial-gradient(ellipse at 20% 80%, rgba(124, 111, 205, 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(52, 152, 219, 0.15) 0%, transparent 40%);
  animation: bg-shift 15s ease-in-out infinite;
}

.layer-3 {
  background: radial-gradient(ellipse at 50% 100%, rgba(46, 204, 113, 0.1) 0%, transparent 30%);
}

@keyframes bg-shift {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
}

/* 粒子 */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  top: -20px;
  background: radial-gradient(ellipse, rgba(124, 111, 205, 0.8) 0%, rgba(124, 111, 205, 0.2) 100%);
  border-radius: 50%;
  animation: float-up linear infinite;
}

@keyframes float-up {
  0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.8; }
  90% { opacity: 0.8; }
  100% { transform: translateY(100vh) translateX(50px) rotate(360deg); opacity: 0; }
}

/* 主内容 */
.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  z-index: 10;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

/* Logo 装饰 */
.logo-decoration {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(124, 111, 205, 0.3);
  animation: rotate-slow 20s linear infinite;
}

.ring-1 {
  width: 180px;
  height: 180px;
  border-style: dashed;
}

.ring-2 {
  width: 140px;
  height: 140px;
  animation-direction: reverse;
  animation-duration: 15s;
}

.ring-3 {
  width: 100px;
  height: 100px;
  border-width: 2px;
  border-color: rgba(124, 111, 205, 0.5);
  animation-duration: 10s;
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
}

.logo-main {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: 0 0 30px rgba(124, 111, 205, 0.5);
  letter-spacing: 4px;
  animation: glow 3s ease-in-out infinite;
}

@keyframes glow {
  0%, 100% { text-shadow: 0 0 30px rgba(124, 111, 205, 0.5); }
  50% { text-shadow: 0 0 50px rgba(124, 111, 205, 0.8), 0 0 80px rgba(124, 111, 205, 0.4); }
}

.logo-sub {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 6px;
  font-weight: normal;
}

.quote {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 300px;
  line-height: 1.6;
  margin: 0;
  padding: 15px 25px;
  background: rgba(124, 111, 205, 0.1);
  border-radius: 20px;
  border: 1px solid rgba(124, 111, 205, 0.2);
}

.quote-mark {
  color: var(--color-primary);
  font-size: 1.2rem;
}

/* 羁绊显示 */
.bond-display {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.bond-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.bond-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
}

.bond-tangxin {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  box-shadow: 0 3px 15px rgba(52, 152, 219, 0.5);
}

.bond-suqingyan {
  background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  box-shadow: 0 3px 15px rgba(253, 121, 168, 0.5);
}

.bond-linwanxing {
  background: linear-gradient(135deg, #00b894 0%, #55efc4 100%);
  box-shadow: 0 3px 15px rgba(46, 204, 113, 0.5);
}

.bond-xuzhinan {
  background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
  box-shadow: 0 3px 15px rgba(99, 110, 114, 0.5);
}

.bond-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.bond-name {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
}

.bond-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.bond-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, #9b59b6 100%);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* 菜单 */
.menu {
  width: 100%;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-btn {
  width: 100%;
  height: 56px;
  border-radius: 16px;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}

.menu-btn.primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, #5a4fb8 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(124, 111, 205, 0.4);
  animation: pulse-btn 2s ease-in-out infinite;
}

@keyframes pulse-btn {
  0%, 100% { box-shadow: 0 4px 20px rgba(124, 111, 205, 0.4); }
  50% { box-shadow: 0 4px 30px rgba(124, 111, 205, 0.6); }
}

.menu-btn.primary:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 30px rgba(124, 111, 205, 0.6);
}

.menu-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-on-background);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-btn.secondary:hover {
  background: rgba(124, 111, 205, 0.2);
  border-color: rgba(124, 111, 205, 0.4);
  transform: translateX(5px);
}

.menu-btn.tertiary {
  flex: 1;
  height: 48px;
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.menu-btn.tertiary:hover {
  background: rgba(124, 111, 205, 0.2);
  transform: scale(1.05);
}

.menu-row {
  display: flex;
  gap: 12px;
  margin-top: 5px;
}

.btn-icon {
  font-size: 1.1rem;
  display: flex;
  align-items: center;
}

/* Footer */
.footer {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.3);
  z-index: 5;
}

.version {
  background: rgba(124, 111, 205, 0.2);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.65rem;
}

.separator {
  color: rgba(255, 255, 255, 0.2);
}
</style>