// 日志系统 - 页面加载最早执行，确保能捕获所有错误
// 用 IIFE 包裹确保在模块加载前就初始化
(function () {
  'use strict'

  const LOG_KEY = 'echo_app_logs'
  const MAX_LOGS = 1000

  // 浏览器信息
  const envInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    colorDepth: window.screen.colorDepth,
    devicePixelRatio: window.devicePixelRatio,
    language: navigator.language,
    languages: navigator.languages,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    timestamp: new Date().toISOString()
  }

  // 存储日志的数组
  let logs: any[] = []

  // 日志ID计数器
  let logIdCounter = 0

  // 是否已记录初始化完成
  let initialized = false

  // 保存原始的 console 方法
  const originalConsole = {
    log: console.log.bind(console),
    warn: console.warn.bind(console),
    error: console.error.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console)
  }

  // 从 localStorage 加载日志
  function loadLogs(): void {
    try {
      const stored = localStorage.getItem(LOG_KEY)
      if (stored) {
        logs = JSON.parse(stored)
        // 更新计数器起点
        if (logs.length > 0) {
          const lastLog = logs[logs.length - 1]
          logIdCounter = (lastLog.id || 0) + 1
        }
      }
    } catch (e) {
      logs = []
    }
  }

  // 保存日志到 localStorage
  function saveLogs(): void {
    try {
      // 限制最大条数
      if (logs.length > MAX_LOGS) {
        logs = logs.slice(-MAX_LOGS)
      }
      localStorage.setItem(LOG_KEY, JSON.stringify(logs))
    } catch (e) {
      // storage 可能满了，尝试清理后重试
      try {
        logs = logs.slice(-Math.floor(MAX_LOGS / 2))
        localStorage.setItem(LOG_KEY, JSON.stringify(logs))
      } catch (e2) {
        originalConsole.error('[Logger] Failed to save logs:', e2)
      }
    }
  }

  // 添加日志
  function addLog(type: string, level: string, data: any): void {
    const entry = {
      id: logIdCounter++,
      type,
      level,
      data,
      timestamp: new Date().toISOString()
    }
    logs.push(entry)
    saveLogs()
  }

  // 导出日志
  function exportLogs(): void {
    const exportData = {
      envInfo,
      logs,
      exportTime: new Date().toISOString(),
      totalCount: logs.length
    }
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `echo-logs-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 清理日志
  function clearLogs(): void {
    logs = []
    localStorage.removeItem(LOG_KEY)
  }

  // 记录环境信息
  function initLogger(): void {
    if (initialized) return
    initialized = true

    loadLogs()

    addLog('system', 'info', {
      message: '=== Logger Initialized ===',
      env: envInfo
    })

    // 监听 beforeunload 确保保存
    window.addEventListener('beforeunload', () => {
      saveLogs()
    })

    // 覆盖原生的 console 方法
    overrideConsole()

    // 设置快捷键导出
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      // Ctrl+Shift+L 导出日志
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault()
        originalConsole.log('[Logger] Exporting logs...')
        exportLogs()
        addLog('system', 'info', { message: 'Logs exported via keyboard shortcut' })
      }
      // Ctrl+Shift+K 清理日志
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        clearLogs()
        addLog('system', 'info', { message: 'Logs cleared via keyboard shortcut' })
        originalConsole.log('[Logger] Logs cleared')
      }
    })

    originalConsole.log('[Logger] System initialized')
  }

  // 覆盖 console 方法
  function overrideConsole(): void {
    const consoleTypes = ['log', 'warn', 'error', 'info', 'debug', 'table']

    consoleTypes.forEach(type => {
      const original = (console as any)[type].bind(console)
      ;(console as any)[type] = function (...args: any[]) {
        // 仍然调用原方法，保持控制台正常工作
        original(...args)
        // 同时记录日志
        addLog('console', type, {
          args: args.map(a => {
            if (a instanceof Error) {
              return { type: 'error', message: a.message, stack: a.stack }
            }
            if (typeof a === 'object') {
              try {
                return JSON.parse(JSON.stringify(a))
              } catch {
                return String(a)
              }
            }
            return a
          })
        })
      }
    })
  }

  // 1. 捕获全局 JS 运行错误
  window.addEventListener('error', (event: ErrorEvent) => {
    addLog('error', 'error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      type: 'uncaught error'
    })
    originalConsole.error('[JS Error]', event.message, event.filename + ':' + event.lineno)
  })

  // 2. 捕获未处理的 Promise 异常
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const error = event.reason
    addLog('error', 'error', {
      message: error?.message || String(error),
      stack: error?.stack || null,
      type: 'unhandled promise rejection'
    })
    originalConsole.error('[Promise Error]', error)
  })

  // 3. 捕获资源加载错误
  window.addEventListener('load', () => {
    // 使用 MutationObserver 监听新增的资源元素
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof Element) {
            // 检查图片
            if (node.tagName === 'IMG') {
              const img = node as HTMLImageElement
              img.addEventListener('error', () => {
                addLog('error', 'error', {
                  type: 'resource load error',
                  resourceType: 'image',
                  url: img.src,
                  element: node.outerHTML.slice(0, 100)
                })
              })
            }
          }
        })
      })
    })
    observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true
    })

    // 同时监听已有的图片
    document.querySelectorAll('img').forEach(img => {
      if (!img.complete || img.naturalWidth === 0) {
        img.addEventListener('error', () => {
          addLog('error', 'error', {
            type: 'resource load error',
            resourceType: 'image',
            url: img.src
          })
        })
      }
    })

    addLog('system', 'info', { message: 'Resource error observer initialized' })
  })

  // 4. 网络请求监听 - fetch
  const originalFetch = window.fetch.bind(window)
  window.fetch = async function (...args: any[]): Promise<Response> {
    const startTime = Date.now()
    const requestInfo = {
      url: typeof args[0] === 'string' ? args[0] : (args[0] as Request).url,
      method: (args[1] as RequestInit)?.method || 'GET',
      headers: (args[1] as RequestInit)?.headers || null,
      body: (args[1] as RequestInit)?.body || null
    }

    try {
      const response = await originalFetch(...args)
      const duration = Date.now() - startTime
      const clonedResponse = response.clone()

      let responseBody: any = null
      try {
        const contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          responseBody = await clonedResponse.json()
        } else {
          responseBody = await clonedResponse.text()
          if (responseBody.length > 500) responseBody = responseBody.slice(0, 500) + '...'
        }
      } catch {
        responseBody = '[binary or unreadable]'
      }

      addLog('network', response.ok ? 'info' : 'warn', {
        type: 'fetch',
        ...requestInfo,
        status: response.status,
        statusText: response.statusText,
        duration,
        response: responseBody,
        success: response.ok
      })

      return response
    } catch (error: any) {
      const duration = Date.now() - startTime
      addLog('network', 'error', {
        type: 'fetch',
        ...requestInfo,
        error: error?.message || String(error),
        duration,
        success: false
      })
      throw error
    }
  }

  // 5. 网络请求监听 - XMLHttpRequest
  const originalXHROpen = XMLHttpRequest.prototype.open
  const originalXHRSend = XMLHttpRequest.prototype.send
  const originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader

  XMLHttpRequest.prototype.open = function (
    method: string,
    url: string,
    ...rest: any[]
  ): void {
    ;(this as any)._xhrLog = {
      method,
      url,
      startTime: 0,
      headers: {}
    }
    return originalXHROpen.apply(this, [method, url, ...rest])
  }

  XMLHttpRequest.prototype.setRequestHeader = function (
    name: string,
    value: string
  ): void {
    if ((this as any)._xhrLog?.headers) {
      (this as any)._xhrLog.headers[name] = value
    }
    return originalXHRSetRequestHeader.apply(this, [name, value])
  }

  XMLHttpRequest.prototype.send = function (...args: any[]): void {
    const xhr = this as any
    xhr._xhrLog.startTime = Date.now()

    xhr.addEventListener('load', () => {
      const duration = Date.now() - xhr._xhrLog.startTime
      let response = xhr.responseText
      if (response?.length > 500) response = response.slice(0, 500) + '...'

      addLog('network', xhr.status >= 200 && xhr.status < 400 ? 'info' : 'warn', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        headers: xhr._xhrLog.headers,
        body: args[0] || null,
        status: xhr.status,
        statusText: xhr.statusText,
        duration,
        response,
        success: xhr.status >= 200 && xhr.status < 400
      })
    })

    xhr.addEventListener('error', () => {
      const duration = Date.now() - xhr._xhrLog.startTime
      addLog('network', 'error', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        error: 'Network error',
        duration,
        success: false
      })
    })

    xhr.addEventListener('timeout', () => {
      const duration = Date.now() - xhr._xhrLog.startTime
      addLog('network', 'error', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        error: 'Request timeout',
        duration,
        success: false
      })
    })

    return originalXHRSend.apply(this, args)
  }

  // 6. 用户操作记录
  let lastClickTime = 0
  let lastKeyTime = 0
  let lastScrollTime = 0

  document.addEventListener('click', (e: MouseEvent) => {
    // 节流：同元素100ms内不重复记录
    const now = Date.now()
    if (now - lastClickTime < 100) return
    lastClickTime = now

    const target = e.target as HTMLElement
    addLog('user_action', 'info', {
      action: 'click',
      target: target.tagName,
      id: target.id || null,
      className: target.className || null,
      text: target.innerText?.slice(0, 50) || null,
      href: (target as HTMLAnchorElement).href || null,
      x: e.clientX,
      y: e.clientY
    })
  })

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // 只记录有实际内容的按键
    if (e.key.length === 1 || ['Enter', 'Backspace', 'Delete'].includes(e.key)) {
      const now = Date.now()
      if (now - lastKeyTime < 500) return
      lastKeyTime = now

      const target = e.target as HTMLElement
      addLog('user_action', 'info', {
        action: 'keydown',
        key: e.key,
        target: target.tagName,
        id: target.id || null,
        inputType: (target as HTMLInputElement).type || null,
        valueLength: (target as HTMLInputElement).value?.length || null
      })
    }
  })

  document.addEventListener('scroll', () => {
    const now = Date.now()
    if (now - lastScrollTime < 2000) return
    lastScrollTime = now

    addLog('user_action', 'info', {
      action: 'scroll',
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      pageWidth: document.documentElement.scrollWidth,
      pageHeight: document.documentElement.scrollHeight
    })
  })

  // 7. Vue 路由变化记录
  window.addEventListener('popstate', () => {
    addLog('user_action', 'info', {
      action: 'route_change',
      path: window.location.pathname,
      href: window.location.href
    })
  })

  // 初始化
  initLogger()

  // 暴露给全局
  ;(window as any).__echoLogger = {
    exportLogs,
    clearLogs,
    getLogs: () => logs,
    getEnvInfo: () => envInfo,
    getLogCount: () => logs.length
  }

  originalConsole.log('[Logger] All systems initialized, logs will persist to localStorage')
})()