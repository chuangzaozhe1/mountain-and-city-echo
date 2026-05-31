import { ref, onMounted, onUnmounted } from 'vue'

interface SwipeOptions {
  threshold?: number // 滑动阈值（像素）
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipe(options: SwipeOptions = {}) {
  const {
    threshold = 50,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  } = options

  const startX = ref(0)
  const startY = ref(0)
  const endX = ref(0)
  const endY = ref(0)
  const isSwiping = ref(false)

  function handleTouchStart(e: TouchEvent) {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
    isSwiping.value = true
  }

  function handleTouchMove(e: TouchEvent) {
    if (!isSwiping.value) return
    endX.value = e.touches[0].clientX
    endY.value = e.touches[0].clientY
  }

  function handleTouchEnd() {
    if (!isSwiping.value) return
    isSwiping.value = false

    const deltaX = endX.value - startX.value
    const deltaY = endY.value - startY.value
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 判断是水平滑动还是垂直滑动
    if (absDeltaX > absDeltaY) {
      // 水平滑动
      if (absDeltaX > threshold) {
        if (deltaX > 0) {
          onSwipeRight?.()
        } else {
          onSwipeLeft?.()
        }
      }
    } else {
      // 垂直滑动
      if (absDeltaY > threshold) {
        if (deltaY > 0) {
          onSwipeDown?.()
        } else {
          onSwipeUp?.()
        }
      }
    }
  }

  onMounted(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: true })
    document.addEventListener('touchend', handleTouchEnd)
  })

  onUnmounted(() => {
    document.removeEventListener('touchstart', handleTouchStart)
    document.removeEventListener('touchmove', handleTouchMove)
    document.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    isSwiping
  }
}
