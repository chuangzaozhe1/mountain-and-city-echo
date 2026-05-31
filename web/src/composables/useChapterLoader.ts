import { ref } from 'vue'
import type { ChapterData } from '@/types/story'

// 预加载缓存
const preloadCache = new Map<string, ChapterData>()

export function useChapterLoader() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadChapter(chapterId: string): Promise<ChapterData | null> {
    // 检查预加载缓存
    if (preloadCache.has(chapterId)) {
      console.log(`Loading chapter ${chapterId} from preload cache`)
      const cached = preloadCache.get(chapterId)!
      preloadCache.delete(chapterId)
      return cached
    }

    isLoading.value = true
    error.value = null

    const maxRetries = 3
    const retryDelay = 1000

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)

        const response = await fetch(`${import.meta.env.BASE_URL}data/chapters/${chapterId}.json`, {
          signal: controller.signal
        })
        clearTimeout(timeoutId)

        if (response.ok) {
          const data = await response.json()
          isLoading.value = false
          return data
        } else {
          console.warn(`Failed to load chapter ${chapterId}: HTTP ${response.status} (attempt ${attempt}/${maxRetries})`)
        }
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.warn(`Timeout loading chapter ${chapterId} (attempt ${attempt}/${maxRetries})`)
        } else {
          console.warn(`Failed to load chapter ${chapterId} (attempt ${attempt}/${maxRetries}):`, e)
        }
      }

      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
      }
    }

    isLoading.value = false
    error.value = `加载章节 ${chapterId} 失败`
    return null
  }

  async function preloadChapter(chapterId: string): Promise<void> {
    if (preloadCache.has(chapterId)) {
      return
    }

    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/chapters/${chapterId}.json`)
      if (response.ok) {
        const data = await response.json()
        preloadCache.set(chapterId, data)
        console.log(`Chapter ${chapterId} preloaded successfully`)
      }
    } catch (e) {
      console.warn(`Failed to preload chapter ${chapterId}:`, e)
    }
  }

  function clearCache() {
    preloadCache.clear()
  }

  return {
    isLoading,
    error,
    loadChapter,
    preloadChapter,
    clearCache
  }
}
