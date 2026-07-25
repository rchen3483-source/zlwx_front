import request from './request'

/**
 * 搜索小红书爆款帖子（借鉴创作页 loading 阶段可用于拉取参考）
 * POST /api/v1/viral-posts/search
 *
 * @param {Object} payload
 * @param {'xiaohongshu'} payload.scenario_code
 * @param {string} payload.topic
 * @returns {Promise<{keywords: string[], items: ViralPostReference[]}>}
 *
 * @typedef {Object} ViralPostReference
 * @property {string} title
 * @property {string} content
 * @property {number} likes    非负整数
 * @property {number} comments 非负整数
 */
export const searchViralPosts = (payload) => {
  return request.post('/v1/viral-posts/search', payload)
}

/**
 * 基于参考帖子生成小红书文案
 * POST /api/v1/style-transform
 *
 * @param {Object} payload
 * @param {ViralPostReference} payload.reference
 * @param {string[]} payload.keywords 至少 1 个，去重
 * @param {string} payload.topic
 * @returns {Promise<{content: string}>} content 为完整生成的文案（含标题/正文/tag）
 */
export const generateContent = (payload) => {
  return request.post('/v1/style-transform', payload)
}

/**
 * 流式生成小红书文案。
 * 服务端按 NDJSON 依次返回 delta、done 或 error 事件。
 *
 * @param {Object} payload
 * @param {Object} options
 * @param {(chunk: string) => void} [options.onDelta]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<{content: string}>}
 */
export const generateContentStream = async (payload, options = {}) => {
  const { onDelta = () => {}, signal } = options
  const headers = {
    Accept: 'application/x-ndjson',
    'Content-Type': 'application/json'
  }
  const token = localStorage.getItem('token')

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch('/api/v1/style-transform/stream', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
    signal
  })

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null)
    throw new Error(errorBody?.error?.message || `生成请求失败（${response.status}）`)
  }

  if (!response.body) {
    throw new Error('当前浏览器不支持流式生成')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let content = ''
  let completed = false

  const consumeLine = (line) => {
    if (!line.trim()) return

    let event
    try {
      event = JSON.parse(line)
    } catch {
      throw new Error('生成服务返回了无效的流式数据')
    }

    if (event.type === 'delta' && typeof event.content === 'string') {
      content += event.content
      onDelta(event.content)
      return
    }

    if (event.type === 'done') {
      completed = true
      return
    }

    if (event.type === 'error') {
      throw new Error(event.message || 'AI 生成失败，请稍后重试')
    }

    throw new Error('生成服务返回了未知事件')
  }

  const consumeBufferedLines = () => {
    let newlineIndex = buffer.indexOf('\n')
    while (newlineIndex >= 0) {
      consumeLine(buffer.slice(0, newlineIndex).replace(/\r$/, ''))
      buffer = buffer.slice(newlineIndex + 1)
      newlineIndex = buffer.indexOf('\n')
    }
  }

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      consumeBufferedLines()
    }

    buffer += decoder.decode()
    consumeBufferedLines()
    if (buffer.trim()) {
      consumeLine(buffer)
    }
  } catch (error) {
    await reader.cancel().catch(() => {})
    throw error
  } finally {
    reader.releaseLock()
  }

  if (!completed) {
    throw new Error('生成连接意外中断，请重新生成')
  }

  return { content }
}

/**
 * 发布已生成文案到小红书
 * POST /api/v1/xiaohongshu/publish
 *
 * @param {{content: string}} payload
 * @returns {Promise<{result: {platform_post_id: string, published_at: string} | null}>}
 */
export const publishToXiaohongshu = (payload) => {
  return request.post('/v1/xiaohongshu/publish', payload)
}

// ==== 以下为占位接口，后端未实现时保留 ====

export const saveDraft = (data) => {
  return request.post('/articles/draft', data)
}

export const uploadImage = (formData) => {
  return request.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
