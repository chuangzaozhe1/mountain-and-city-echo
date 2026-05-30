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
  let logs = []

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
  function loadLogs() {
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
  function saveLogs() {
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
  function addLog(type, level, data) {
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
  function exportLogs() {
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
    a.download = 'echo-logs-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 清理日志
  function clearLogs() {
    logs = []
    localStorage.removeItem(LOG_KEY)
  }

  // 记录环境信息
  function initLogger() {
    if (initialized) return
    initialized = true

    loadLogs()

    addLog('system', 'info', {
      message: '=== Logger Initialized ===',
      env: envInfo
    })

    // 监听 beforeunload 确保保存
    window.addEventListener('beforeunload', function () {
      saveLogs()
    })

    // 覆盖原生的 console 方法
    overrideConsole()

    // 设置快捷键导出
    document.addEventListener('keydown', function (e) {
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
  function overrideConsole() {
    var consoleTypes = ['log', 'warn', 'error', 'info', 'debug', 'table']

    consoleTypes.forEach(function (type) {
      var original = console[type].bind(console)
      console[type] = function () {
        var args = Array.prototype.slice.call(arguments)
        // 仍然调用原方法，保持控制台正常工作
        original.apply(console, args)
        // 同时记录日志
        addLog('console', type, {
          args: args.map(function (a) {
            if (a instanceof Error) {
              return { type: 'error', message: a.message, stack: a.stack }
            }
            if (typeof a === 'object') {
              try {
                return JSON.parse(JSON.stringify(a))
              } catch (e) {
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
  window.addEventListener('error', function (event) {
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
  window.addEventListener('unhandledrejection', function (event) {
    var error = event.reason
    addLog('error', 'error', {
      message: error && error.message ? error.message : String(error),
      stack: error && error.stack ? error.stack : null,
      type: 'unhandled promise rejection'
    })
    originalConsole.error('[Promise Error]', error)
  })

  // 3. 捕获资源加载错误
  window.addEventListener('load', function () {
    // 使用 MutationObserver 监听新增的资源元素
    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (node) {
          if (node instanceof Element) {
            // 检查图片
            if (node.tagName === 'IMG') {
              var img = node
              img.addEventListener('error', function () {
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
    document.querySelectorAll('img').forEach(function (img) {
      if (!img.complete || img.naturalWidth === 0) {
        img.addEventListener('error', function () {
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
  var originalFetch = window.fetch.bind(window)
  window.fetch = function () {
    var args = Array.prototype.slice.call(arguments)
    var startTime = Date.now()
    var requestInfo = {
      url: typeof args[0] === 'string' ? args[0] : args[0].url,
      method: (args[1] && args[1].method) || 'GET',
      headers: (args[1] && args[1].headers) || null,
      body: (args[1] && args[1].body) || null
    }

    return originalFetch.apply(window, args).then(function (response) {
      var duration = Date.now() - startTime
      var clonedResponse = response.clone()

      var responseBody = null
      try {
        var contentType = response.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          return clonedResponse.json().then(function (json) {
            responseBody = json
            addLog('network', response.ok ? 'info' : 'warn', {
              type: 'fetch',
              url: requestInfo.url,
              method: requestInfo.method,
              headers: requestInfo.headers,
              body: requestInfo.body,
              status: response.status,
              statusText: response.statusText,
              duration: duration,
              response: responseBody,
              success: response.ok
            })
            return response
          })
        } else {
          return clonedResponse.text().then(function (text) {
            responseBody = text.length > 500 ? text.slice(0, 500) + '...' : text
            addLog('network', response.ok ? 'info' : 'warn', {
              type: 'fetch',
              url: requestInfo.url,
              method: requestInfo.method,
              headers: requestInfo.headers,
              body: requestInfo.body,
              status: response.status,
              statusText: response.statusText,
              duration: duration,
              response: responseBody,
              success: response.ok
            })
            return response
          })
        }
      } catch (e) {
        responseBody = '[binary or unreadable]'
        addLog('network', response.ok ? 'info' : 'warn', {
          type: 'fetch',
          url: requestInfo.url,
          method: requestInfo.method,
          headers: requestInfo.headers,
          body: requestInfo.body,
          status: response.status,
          statusText: response.statusText,
          duration: duration,
          response: responseBody,
          success: response.ok
        })
        return response
      }
    }).catch(function (error) {
      var duration = Date.now() - startTime
      addLog('network', 'error', {
        type: 'fetch',
        url: requestInfo.url,
        method: requestInfo.method,
        error: error.message || String(error),
        duration: duration,
        success: false
      })
      throw error
    })
  }

  // 5. 网络请求监听 - XMLHttpRequest
  var originalXHROpen = XMLHttpRequest.prototype.open
  var originalXHRSend = XMLHttpRequest.prototype.send
  var originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader

  XMLHttpRequest.prototype.open = function (method, url) {
    var rest = Array.prototype.slice.call(arguments, 2)
    this._xhrLog = {
      method: method,
      url: url,
      startTime: 0,
      headers: {}
    }
    return originalXHROpen.apply(this, [method, url].concat(rest))
  }

  XMLHttpRequest.prototype.setRequestHeader = function (name, value) {
    if (this._xhrLog && this._xhrLog.headers) {
      this._xhrLog.headers[name] = value
    }
    return originalXHRSetRequestHeader.apply(this, [name, value])
  }

  XMLHttpRequest.prototype.send = function () {
    var args = Array.prototype.slice.call(arguments)
    var xhr = this
    xhr._xhrLog.startTime = Date.now()

    xhr.addEventListener('load', function () {
      var duration = Date.now() - xhr._xhrLog.startTime
      var response = xhr.responseText
      if (response && response.length > 500) response = response.slice(0, 500) + '...'

      addLog('network', xhr.status >= 200 && xhr.status < 400 ? 'info' : 'warn', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        headers: xhr._xhrLog.headers,
        body: args[0] || null,
        status: xhr.status,
        statusText: xhr.statusText,
        duration: duration,
        response: response,
        success: xhr.status >= 200 && xhr.status < 400
      })
    })

    xhr.addEventListener('error', function () {
      var duration = Date.now() - xhr._xhrLog.startTime
      addLog('network', 'error', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        error: 'Network error',
        duration: duration,
        success: false
      })
    })

    xhr.addEventListener('timeout', function () {
      var duration = Date.now() - xhr._xhrLog.startTime
      addLog('network', 'error', {
        type: 'xhr',
        method: xhr._xhrLog.method,
        url: xhr._xhrLog.url,
        error: 'Request timeout',
        duration: duration,
        success: false
      })
    })

    return originalXHRSend.apply(this, args)
  }

  // 6. 用户操作记录
  var lastClickTime = 0
  var lastKeyTime = 0
  var lastScrollTime = 0

  document.addEventListener('click', function (e) {
    // 节流：同元素100ms内不重复记录
    var now = Date.now()
    if (now - lastClickTime < 100) return
    lastClickTime = now

    var target = e.target
    addLog('user_action', 'info', {
      action: 'click',
      target: target.tagName,
      id: target.id || null,
      className: target.className || null,
      text: target.innerText ? target.innerText.slice(0, 50) : null,
      href: target.href || null,
      x: e.clientX,
      y: e.clientY
    })
  })

  document.addEventListener('keydown', function (e) {
    // 只记录有实际内容的按键
    if (e.key.length === 1 || ['Enter', 'Backspace', 'Delete'].indexOf(e.key) !== -1) {
      var now = Date.now()
      if (now - lastKeyTime < 500) return
      lastKeyTime = now

      var target = e.target
      addLog('user_action', 'info', {
        action: 'keydown',
        key: e.key,
        target: target.tagName,
        id: target.id || null,
        inputType: target.type || null,
        valueLength: target.value ? target.value.length : null
      })
    }
  })

  document.addEventListener('scroll', function () {
    var now = Date.now()
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
  window.addEventListener('popstate', function () {
    addLog('user_action', 'info', {
      action: 'route_change',
      path: window.location.pathname,
      href: window.location.href
    })
  })

  // 初始化
  initLogger()

  // 暴露给全局
  window.__echoLogger = {
    exportLogs: exportLogs,
    clearLogs: clearLogs,
    getLogs: function () { return logs },
    getEnvInfo: function () { return envInfo },
    getLogCount: function () { return logs.length }
  }

  originalConsole.log('[Logger] All systems initialized, logs will persist to localStorage')
})()
