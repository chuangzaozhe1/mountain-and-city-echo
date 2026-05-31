import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  base: '/mountain-and-city-echo/',  // GitHub Pages 子目录部署
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3000,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 代码分割
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'game': [
            './src/stores/story.ts',
            './src/stores/game.ts',
            './src/stores/achievement.ts',
            './src/stores/cg.ts',
            './src/stores/endings.ts'
          ]
        }
      }
    },
    // 压缩选项
    minify: 'esbuild',
    // 分块大小警告
    chunkSizeWarningLimit: 1000
  },
  // CSS 优化
  css: {
    devSourcemap: true
  }
})