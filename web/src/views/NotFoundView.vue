<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>页面走丢了...</p>
      <button @click="$router.push('/home')">返回首页</button>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.not-found {
  width: 100%; height: 100vh;
  display: flex; align-items: center; justify-content: center;
  background: #0a0a14;
  color: #e8e0f0;
  font-family: 'Noto Serif SC', serif;
}
.content { text-align: center; }
h1 {
  font-size: 6rem;
  background: linear-gradient(135deg, #b4a0ff 0%, #7c6bdd 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  margin-bottom: 16px;
}
p { font-size: 1.2rem; margin-bottom: 32px; opacity: 0.8; }
button {
  padding: 12px 32px;
  background: linear-gradient(135deg, #7c6bdd 0%, #5a4db5 100%);
  color: white; border: none; border-radius: 12px;
  font-size: 1rem; cursor: pointer;
  transition: transform 0.2s;
}
button:hover { transform: scale(1.05); }
</style>
