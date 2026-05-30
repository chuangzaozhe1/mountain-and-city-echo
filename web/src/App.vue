<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useBgmStore } from '@/stores/bgm'
import { useGameStore } from '@/stores/game'

const bgmStore = useBgmStore()
const gameStore = useGameStore()

onMounted(() => {
  // 初始化游戏数据
  gameStore.loadFromStorage()
  // 初始化 BGM
  bgmStore.init()
})
</script>

<style>
* {
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
html, body {
  -webkit-user-select: none;
  user-select: none;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>