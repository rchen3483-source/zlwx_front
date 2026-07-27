import request from './request'

const workflowError = (error, fallbackMessage = '请求失败') => {
  if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') {
    return error
  }

  const backendError = error?.response?.data?.error
  const message =
    backendError?.message ||
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage
  const normalized = new Error(message)
  normalized.code = backendError?.code
  normalized.stage = backendError?.stage
  normalized.runId = backendError?.run_id
  normalized.cause = error
  return normalized
}

const withWorkflowError = async (operation, fallbackMessage) => {
  try {
    return await operation()
  } catch (error) {
    throw workflowError(error, fallbackMessage)
  }
}

export const health = () =>
  withWorkflowError(() => request.get('/v1/health'), '本地工作流服务不可用')

export const uploadImage = (file, { signal } = {}) =>
  withWorkflowError(
    () =>
      request.post('/v1/uploads', file, {
        signal,
        headers: {
          'Content-Type': file.type,
          'X-Filename': encodeURIComponent(file.name)
        },
        transformRequest: [(data) => data]
      }),
    `图片 ${file.name} 上传失败`
  )

export const createWorkflow = (payload, { signal } = {}) =>
  withWorkflowError(
    () => request.post('/v1/workflows', payload, { signal }),
    '创建内容工作流失败'
  )

export const getWorkflow = (runId, { signal } = {}) =>
  withWorkflowError(
    () => request.get(`/v1/workflows/${encodeURIComponent(runId)}`, { signal }),
    '查询工作流失败'
  )

export const generateWorkflow = (runId, payload, { signal } = {}) =>
  withWorkflowError(
    () =>
      request.post(`/v1/workflows/${encodeURIComponent(runId)}/select`, payload, {
        signal
      }),
    '启动内容生成失败'
  )

export const preflightPublisher = ({ signal } = {}) =>
  withWorkflowError(
    () => request.get('/v1/publish/preflight', { signal }),
    '小红书账号预检失败'
  )

export const startEdgePublisherLogin = ({ signal } = {}) =>
  withWorkflowError(
    () => request.post('/v1/publish/login/edge', {}, { signal }),
    '无法打开 Microsoft Edge 登录窗口'
  )

export const getEdgePublisherLoginStatus = ({ signal } = {}) =>
  withWorkflowError(
    () => request.get('/v1/publish/login/edge/status', { signal }),
    '尚未检测到 Edge 中的小红书登录状态'
  )

export const publishWorkflow = (runId, payload, { signal } = {}) =>
  withWorkflowError(
    () =>
      request.post(`/v1/workflows/${encodeURIComponent(runId)}/publish`, payload, {
        signal
      }),
    payload?.execute ? '小红书发布失败' : '发布预览失败'
  )

const wait = (delay, signal) =>
  new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('操作已取消', 'AbortError'))
      return
    }

    const onAbort = () => {
      window.clearTimeout(timer)
      reject(new DOMException('操作已取消', 'AbortError'))
    }
    const timer = window.setTimeout(() => {
      signal?.removeEventListener('abort', onAbort)
      resolve()
    }, delay)
    signal?.addEventListener('abort', onAbort, { once: true })
  })

const hasReachedTarget = (state, until) => {
  if (typeof until === 'function') return Boolean(until(state))
  if (Array.isArray(until)) return until.includes(state.status)
  return state.status === until
}

export const pollWorkflow = async (
  runId,
  { until, onUpdate, signal, intervalMs = 1500 } = {}
) => {
  if (!until) {
    throw new Error('pollWorkflow 需要 until 条件')
  }

  while (true) {
    if (signal?.aborted) {
      throw new DOMException('操作已取消', 'AbortError')
    }

    const state = await getWorkflow(runId, { signal })
    onUpdate?.(state)

    if (state.status === 'FAILED') {
      const error = new Error(state.error?.message || '工作流执行失败')
      error.code = state.error?.code
      error.stage = state.error?.stage || state.stage
      error.runId = state.run_id || runId
      error.workflow = state
      throw error
    }
    if (hasReachedTarget(state, until)) {
      return state
    }

    await wait(Math.max(300, intervalMs), signal)
  }
}
