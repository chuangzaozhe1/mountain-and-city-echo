import { ref } from 'vue'

export interface AppError {
  id: string
  message: string
  type: 'error' | 'warning' | 'info'
  timestamp: number
  details?: string
}

const errors = ref<AppError[]>([])
const MAX_ERRORS = 50

export function useError() {
  function addError(message: string, type: AppError['type'] = 'error', details?: string) {
    const error: AppError = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      message,
      type,
      timestamp: Date.now(),
      details
    }

    errors.value.unshift(error)

    // 限制错误数量
    if (errors.value.length > MAX_ERRORS) {
      errors.value = errors.value.slice(0, MAX_ERRORS)
    }

    // 控制台输出
    const logMethod = type === 'error' ? console.error : type === 'warning' ? console.warn : console.log
    logMethod(`[${type.toUpperCase()}] ${message}`, details || '')

    return error
  }

  function addWarning(message: string, details?: string) {
    return addError(message, 'warning', details)
  }

  function addInfo(message: string, details?: string) {
    return addError(message, 'info', details)
  }

  function removeError(id: string) {
    errors.value = errors.value.filter(e => e.id !== id)
  }

  function clearErrors() {
    errors.value = []
  }

  function clearOldErrors(maxAge: number = 3600000) {
    const now = Date.now()
    errors.value = errors.value.filter(e => now - e.timestamp < maxAge)
  }

  // 包装异步函数，自动捕获错误
  function withErrorHandling<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    errorMessage: string
  ): T {
    return (async (...args: any[]) => {
      try {
        return await fn(...args)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        addError(`${errorMessage}: ${message}`, 'error', error instanceof Error ? error.stack : undefined)
        throw error
      }
    }) as T
  }

  // 包装同步函数，自动捕获错误
  function withSyncErrorHandling<T extends (...args: any[]) => any>(
    fn: T,
    errorMessage: string
  ): T {
    return ((...args: any[]) => {
      try {
        return fn(...args)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        addError(`${errorMessage}: ${message}`, 'error', error instanceof Error ? error.stack : undefined)
        throw error
      }
    }) as T
  }

  return {
    errors,
    addError,
    addWarning,
    addInfo,
    removeError,
    clearErrors,
    clearOldErrors,
    withErrorHandling,
    withSyncErrorHandling
  }
}
