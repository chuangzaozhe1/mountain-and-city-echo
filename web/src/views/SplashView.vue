<template>
  <div class="splash-screen">
    <div class="splash-content">
      <h1 class="title">山与城的回响</h1>
      <p class="subtitle">We are not each other's substitutes, but flowers of different seasons.</p>
      <div class="loading">
        <div class="loading-bar"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    router.replace('/home')
  }, 2000)
})
</script>

<style scoped>
.splash-screen {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1A1A2E 0%, #16213E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-content {
  text-align: center;
  animation: fadeIn 1s ease;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 0.9rem;
  color: rgba(232, 232, 232, 0.6);
  font-style: italic;
  margin-bottom: 3rem;
}

.loading {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 0 auto;
  overflow: hidden;
}

.loading-bar {
  width: 30%;
  height: 100%;
  background: var(--color-primary);
  border-radius: 2px;
  animation: loadingMove 1s ease-in-out infinite;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes loadingMove {
  0% { margin-left: 0; }
  50% { margin-left: 70%; }
  100% { margin-left: 0; }
}
</style>