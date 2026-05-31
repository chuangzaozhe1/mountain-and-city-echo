<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in">
      <suspense>
        <template #default>
          <component :is="Component" :key="route.path" />
        </template>
        <template #fallback>
          <LoadingScreen />
        </template>
      </suspense>
    </transition>
  </router-view>
  <ErrorNotification />
</template>

<script setup lang="ts">
import { onMounted, onErrorCaptured } from 'vue'
import { useBgmStore } from '@/stores/bgm'
import { useGameStore } from '@/stores/game'
import { useError } from '@/composables/useError'
import ErrorNotification from '@/components/ErrorNotification.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

const bgmStore = useBgmStore()
const gameStore = useGameStore()
const { addError, clearOldErrors } = useError()

onMounted(() => {
  // 初始化游戏数据
  gameStore.loadFromStorage()
  // 初始化 BGM
  bgmStore.init()

  // 清理旧错误
  clearOldErrors()

  // 全局未捕获错误
  window.addEventListener('unhandledrejection', (event) => {
    addError('未处理的 Promise 错误', 'error', event.reason)
  })

  // 全局错误
  window.onerror = (message, _source, _lineno, _colno, error) => {
    addError(String(message), 'error', error?.stack)
  }
})

// Vue 错误捕获
onErrorCaptured((error, _instance, _info) => {
  addError('组件错误', 'error', error.stack)
  return false // 阻止错误继续传播
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