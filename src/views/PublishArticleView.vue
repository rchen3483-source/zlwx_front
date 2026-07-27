<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import {
  createWorkflow,
  generateWorkflow,
  getWorkflow,
  pollWorkflow,
  uploadImage
} from '@/api/workflow'

const route = useRoute()
const router = useRouter()
const MAX_IMAGE_BYTES = 20 * 1024 * 1024
const MAX_IMAGES = 8
const LAST_WORKFLOW_KEY = 'scenic:last-publish-workflow'
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const ALLOWED_IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp'])
const DATE_LABEL_PATTERN = /^(?:20\d{2}[-/.年])?\d{1,2}[-/.月]\d{1,2}(?:日)?$/
const statusLabels = {
  QUEUED: '任务已创建，等待处理',
  PARSING: '正在解析讲解词并生成事实包',
  COLLECTING_HOTSPOTS: '正在采集和整理热点',
  WAITING_USER_SELECTION: '热点检索完成，请选择参考内容',
  GENERATING: '正在根据所选模板生成图文',
  READY_TO_PUBLISH: '已恢复上次检索结果，可选择其他模板',
  NEEDS_REVIEW: '已恢复上次检索结果，可选择其他模板',
  PUBLISHED: '内容已发布，仍可查看上次检索结果',
  FAILED: '工作流执行失败'
}

// 热点笔记推荐：前 4 条渲染成卡片（一行四个），其余在下方以排行列表列出
const TREND_CARD_LIMIT = 4

// supported 为 false 的平台后端尚未接入，可切换但仅作视觉反馈，不参与实际发布
const channels = [
  { key: 'xiaohongshu', label: '小红书', icon: '/assets/xiaohongshu.png', supported: true },
  { key: 'douyin', label: '抖音', icon: '/assets/douyin.png', supported: false },
  { key: 'wechat', label: '微信公众号', icon: '/assets/wechat.png', supported: false },
  { key: 'bilibili', label: 'bilibili', icon: '/assets/bilibili.png', supported: false }
]
const selectedChannel = ref('xiaohongshu')
const materialText = ref('')
const isDragOver = ref(false)
const selectedImages = ref([])
// 保存后端返回的全部热点；卡片区与排行区都由它派生
const allHotspots = ref([])
const trendRecommendations = computed(() => allHotspots.value.slice(0, TREND_CARD_LIMIT))
// 第 5 条及以后进入「其他热点排行」列表
const restHotspots = computed(() => allHotspots.value.slice(TREND_CARD_LIMIT))
const trendVisible = ref(false)
const trendCardsVisible = ref(false)
const fileInput = ref(null)
const isProcessing = ref(false)
const workflowStatus = ref('')
const workflowProgress = ref(0)
const errorMessage = ref('')
const runId = ref('')
const searchedGuideText = ref('')
const selectedContentId = ref('')
const workflowBackendStatus = ref('')
const generatingContentId = ref('')
let workflowController = null
const isListening = ref(false)
const speechSupported = ref(true)
let speechRecognition = null
const interimSpeechText = ref('')
let shouldProcessSpeech = false

const displayText = computed(() => {
  const confirmed = materialText.value.trimEnd()
  const interim = interimSpeechText.value.trim()

  if (!interim) return materialText.value

  return confirmed ? `${confirmed} ${interim}` : interim
})

const readCachedWorkflow = () => {
  try {
    const value = JSON.parse(sessionStorage.getItem(LAST_WORKFLOW_KEY) || 'null')
    return value && typeof value === 'object' ? value : null
  } catch {
    return null
  }
}

const cacheableInputImages = () =>
  selectedImages.value
    .filter((item) => item.uploadedId)
    .map((item) => ({
      upload_id: item.uploadedId,
      filename: item.name,
      preview_url: item.url
    }))

const writeCachedWorkflow = (state = {}) => {
  const cachedRunId = state.run_id || runId.value
  // 缓存全量热点，保证刷新后卡片区和排行区都能复原
  const cachedHotspots = Array.isArray(state.hotspots)
    ? state.hotspots
    : allHotspots.value
  if (!cachedRunId || !cachedHotspots.length) return
  const inputImages = Array.isArray(state.input_images)
    ? state.input_images
    : cacheableInputImages()
  sessionStorage.setItem(
    LAST_WORKFLOW_KEY,
    JSON.stringify({
      run_id: cachedRunId,
      guide_text:
        state.guide_text ||
        searchedGuideText.value ||
        materialText.value.trim(),
      hotspots: cachedHotspots,
      input_images: inputImages,
      selected_content_id: state.selected_content_id || selectedContentId.value,
      status: state.status || workflowBackendStatus.value
    })
  )
}

const restoreInputImages = (items) => {
  if (!Array.isArray(items)) return
  selectedImages.value = items
    .filter((item) => item?.upload_id && item?.preview_url)
    .slice(0, MAX_IMAGES)
    .map((item) => ({
      id: item.upload_id,
      name: item.filename || '上次上传的图片',
      file: null,
      uploadedId: item.upload_id,
      url: item.preview_url,
      objectUrl: false
    }))
}

const appendFiles = (files) => {
  errorMessage.value = ''
  const availableSlots = MAX_IMAGES - selectedImages.value.length
  if (availableSlots <= 0) {
    errorMessage.value = '一次最多选择 8 张图片'
    return
  }

  const accepted = []
  const rejected = []
  for (const file of Array.from(files)) {
    const extension = file.name.split('.').pop()?.toLowerCase() || ''
    if (!ALLOWED_IMAGE_TYPES.has(file.type) || !ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
      rejected.push(`${file.name}：仅支持 JPG、PNG、WEBP`)
      continue
    }
    if (file.size > MAX_IMAGE_BYTES) {
      rejected.push(`${file.name}：不能超过 20 MiB`)
      continue
    }
    if (accepted.length >= availableSlots) {
      rejected.push('一次最多选择 8 张图片')
      break
    }
    accepted.push({
      id: `${file.name}-${file.lastModified}-${selectedImages.value.length}-${accepted.length}`,
      name: file.name,
      file,
      uploadedId: '',
      url: URL.createObjectURL(file),
      objectUrl: true
    })
  }

  selectedImages.value = [...selectedImages.value, ...accepted]
  if (rejected.length) {
    errorMessage.value = [...new Set(rejected)].join('；')
  }
}

const openFilePicker = () => {
  fileInput.value?.click()
}

const getSpeechRecognitionConstructor = () => {
  if (typeof window === 'undefined') return null
  return window.SpeechRecognition || window.webkitSpeechRecognition || null
}

const appendSpeechText = (value) => {
  const text = String(value || '').trim()
  if (!text) return
  const current = materialText.value.trimEnd()
  materialText.value = current ? `${current}\n${text}` : text
}

const stopVoiceInput = () => {
  shouldProcessSpeech = false
  if (speechRecognition) {
    speechRecognition.stop()
  }
  isListening.value = false
  interimSpeechText.value = ''
}

const startVoiceInput = () => {
  errorMessage.value = ''
  const SpeechRecognition = getSpeechRecognitionConstructor()
  if (!SpeechRecognition) {
    speechSupported.value = false
    errorMessage.value = '当前浏览器不支持语音输入，请使用 Chrome 或 Edge'
    return
  }

  speechSupported.value = true
  const recognition = new SpeechRecognition()
  speechRecognition = recognition
  recognition.lang = 'zh-CN'
  recognition.continuous = true
  recognition.interimResults = true
  shouldProcessSpeech = true

  recognition.onstart = () => {
    isListening.value = true
  }

  recognition.onresult = (event) => {
    if (!shouldProcessSpeech) return

    let interim = ''
    let final = ''

    // 遍历所有结果，区分临时和最终
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript
      if (event.results[i].isFinal) {
        final += transcript
      } else {
        interim += transcript
      }
    }

    // 最终结果追加到 materialText
    if (final) {
      appendSpeechText(final)
    }

    // 临时结果更新到 interimSpeechText
    interimSpeechText.value = interim
  }

  recognition.onerror = (event) => {
    isListening.value = false
    interimSpeechText.value = ''
    const reason = event?.error === 'not-allowed'
      ? '麦克风权限被拒绝，请在浏览器中允许麦克风后重试'
      : '语音输入失败，请重试或改用键盘输入'
    errorMessage.value = reason
  }

  recognition.onend = () => {
    isListening.value = false
    interimSpeechText.value = ''
  }

  try {
    recognition.start()
  } catch {
    isListening.value = false
    errorMessage.value = '语音输入启动失败，请稍后重试'
  }
}

const toggleVoiceInput = () => {
  if (isListening.value) {
    stopVoiceInput()
    return
  }
  startVoiceInput()
}

const handleTextareaInput = (event) => {
  const newValue = event.target.value

  // 如果正在语音识别且用户编辑了内容
  if (isListening.value) {
    const confirmed = materialText.value.trimEnd()
    const interim = interimSpeechText.value.trim()
    const displayLength = displayText.value.length

    // 检测是否修改了临时文本区域
    let userEditedInterim = false

    if (newValue.length < displayLength) {
      // 用户删除了内容
      userEditedInterim = true
    } else if (newValue.length > displayLength) {
      // 用户在末尾追加了内容
      userEditedInterim = true
    } else if (interim) {
      // 长度相同但有临时文本，检查确认部分是否被修改
      // displayText 格式: "confirmed interim" (中间有空格)
      const expectedPrefix = confirmed ? `${confirmed} ` : ''
      if (newValue.slice(0, expectedPrefix.length) !== expectedPrefix) {
        userEditedInterim = true
      }
    } else {
      // 长度相同且无临时文本，检查内容是否改变
      if (newValue !== materialText.value) {
        userEditedInterim = true
      }
    }

    if (userEditedInterim) {
      // 用户修改了临时区域，停止识别并确认当前内容
      stopVoiceInput()
      materialText.value = newValue
      interimSpeechText.value = ''
      return
    }
  }

  // 正常更新 materialText
  materialText.value = newValue
}

const handleFileChange = (event) => {
  const { files } = event.target

  if (!files?.length) {
    return
  }

  appendFiles(files)
  event.target.value = ''
}

const handleDragEnter = () => {
  isDragOver.value = true
}

const handleDragLeave = (event) => {
  if (event.currentTarget.contains(event.relatedTarget)) {
    return
  }

  isDragOver.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragOver.value = false

  if (event.dataTransfer?.files?.length) {
    appendFiles(event.dataTransfer.files)
  }
}

const removeImage = (imageId) => {
  const target = selectedImages.value.find((item) => item.id === imageId)

  if (target?.objectUrl) {
    URL.revokeObjectURL(target.url)
  }

  selectedImages.value = selectedImages.value.filter((item) => item.id !== imageId)
}

const validateBeforeSearch = () => {
  if (selectedChannel.value !== 'xiaohongshu') {
    throw new Error('当前仅支持小红书发布，请切换到小红书')
  }
  if (!materialText.value.trim()) {
    throw new Error('请输入景区或场所讲解词')
  }
}

const revealTrendCards = async () => {
  trendVisible.value = true
  trendCardsVisible.value = false
  await nextTick()
  requestAnimationFrame(() => {
    trendCardsVisible.value = true
  })
}

const normalizeHotspot = (value) => {
  const item = value && typeof value === 'object' ? { ...value } : {}
  const summary = String(item.summary || '').trim()
  if (summary && DATE_LABEL_PATTERN.test(summary)) {
    const hadPublishLabel = Boolean(item.publish_label)
    item.publish_label = item.publish_label || summary
    if (!hadPublishLabel) item.publish_time = ''
    item.summary = ''
  }
  if (item.cover_url === '/assets/reference-photo.png') {
    item.cover_url = ''
  }
  return item
}

const applyRestoredWorkflow = async (state) => {
  runId.value = state.run_id || runId.value
  workflowBackendStatus.value = state.status || ''
  selectedContentId.value = state.selected_content_id || ''
  const restoredGuideText = String(state.guide_text || '').trim()
  if (restoredGuideText) {
    materialText.value = restoredGuideText
    searchedGuideText.value = restoredGuideText
  }
  if (Array.isArray(state.input_images)) {
    restoreInputImages(state.input_images)
  }
  if (Array.isArray(state.hotspots) && state.hotspots.length) {
    allHotspots.value = state.hotspots.map(normalizeHotspot)
    workflowProgress.value = Number(state.progress) || 45
    workflowStatus.value =
      state.status === 'WAITING_USER_SELECTION'
        ? statusLabels.WAITING_USER_SELECTION
        : statusLabels[state.status] || '已恢复上次检索结果'
    await revealTrendCards()
  }
  writeCachedWorkflow(state)
}

const restoreLastSearch = async () => {
  const cached = readCachedWorkflow()
  const queryRunId =
    typeof route.query.runId === 'string' ? route.query.runId.trim() : ''
  const targetRunId = queryRunId || String(cached?.run_id || '')
  if (!targetRunId) return

  workflowController?.abort()
  workflowController = new AbortController()
  isProcessing.value = true
  errorMessage.value = ''
  workflowStatus.value = '正在恢复上次检索结果'

  try {
    const state = await getWorkflow(targetRunId, {
      signal: workflowController.signal
    })
    await applyRestoredWorkflow(state)
  } catch (error) {
    if (
      error?.name !== 'AbortError' &&
      error?.code !== 'ERR_CANCELED' &&
      cached?.run_id === targetRunId &&
      Array.isArray(cached.hotspots) &&
      cached.hotspots.length
    ) {
      await applyRestoredWorkflow(cached)
      workflowStatus.value = '已从本地恢复上次检索结果'
    } else if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      errorMessage.value = error?.message || '恢复上次检索结果失败'
      workflowStatus.value = '恢复未完成'
    }
  } finally {
    isProcessing.value = false
  }
}

const showTrends = async () => {
  if (isProcessing.value) return

  errorMessage.value = ''
  allHotspots.value = []
  trendVisible.value = true
  trendCardsVisible.value = false
  workflowProgress.value = 0
  workflowStatus.value = ''
  workflowBackendStatus.value = ''
  searchedGuideText.value = ''
  selectedContentId.value = ''
  runId.value = ''
  workflowController?.abort()
  workflowController = new AbortController()

  try {
    validateBeforeSearch()
    isProcessing.value = true
    workflowStatus.value = selectedImages.value.length
      ? '正在上传图片'
      : '正在创建工作流'
    workflowProgress.value = 5
    const uploads = await Promise.all(
      selectedImages.value.map((item) =>
        item.uploadedId
          ? Promise.resolve({ upload_id: item.uploadedId })
          : uploadImage(item.file, { signal: workflowController.signal })
      )
    )
    selectedImages.value = selectedImages.value.map((item, index) => ({
      ...item,
      uploadedId: uploads[index].upload_id
    }))
    workflowProgress.value = 15
    const created = await createWorkflow(
      {
        platform: 'xhs',
        guide_text: materialText.value.trim(),
        upload_ids: uploads.map((item) => item.upload_id),
        hotspot_mode: 'live'
      },
      { signal: workflowController.signal }
    )
    runId.value = created.run_id
    searchedGuideText.value = materialText.value.trim()
    workflowBackendStatus.value = created.status
    workflowStatus.value = statusLabels[created.status] || created.status

    const state = await pollWorkflow(created.run_id, {
      until: 'WAITING_USER_SELECTION',
      signal: workflowController.signal,
      onUpdate: (current) => {
        workflowBackendStatus.value = current.status
        workflowProgress.value = Number(current.progress) || 0
        workflowStatus.value = statusLabels[current.status] || current.status
      }
    })
    allHotspots.value = Array.isArray(state.hotspots)
      ? state.hotspots.map(normalizeHotspot)
      : []
    workflowProgress.value = Number(state.progress) || 45
    workflowBackendStatus.value = state.status
    workflowStatus.value = statusLabels.WAITING_USER_SELECTION
    writeCachedWorkflow({
      ...state,
      guide_text: searchedGuideText.value,
      input_images: cacheableInputImages()
    })
    await revealTrendCards()
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      workflowController?.abort()
      errorMessage.value = error?.message || '检索失败，请稍后重试'
      workflowStatus.value = '检索未完成'
    }
  } finally {
    isProcessing.value = false
  }
}

const formatMetric = (value) => {
  if (value === null || value === undefined || value === '') return '暂无'
  const numericValue = Number(value)
  return Number.isFinite(numericValue)
    ? new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(numericValue)
    : String(value)
}

const formatHotScore = (value) => {
  const numericValue = Number(value)
  if (!Number.isFinite(numericValue)) return '—'
  if (Number.isInteger(numericValue)) return String(numericValue)
  return numericValue.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')
}

// 打分框配色：TOP1 红色渐变，TOP2 起橙色渐变，第 3 名之后每名递减 10% 不透明度
const RANK_RED_GRADIENT = 'linear-gradient(145deg, #F94242, #A41717)'
const RANK_ORANGE_GRADIENT = 'linear-gradient(145deg, #E18445, #DA600E)'

const scoreBoxClass = (rank) => {
  const value = Number(rank)
  if (!Number.isFinite(value) || value < 1) return 'is-rank-muted'
  return value === 1 ? 'is-rank-top1' : 'is-rank-orange'
}

const scoreBoxStyle = (rank) => {
  const value = Number(rank)
  if (!Number.isFinite(value) || value < 1) return {}
  if (value === 1) return { backgroundImage: RANK_RED_GRADIENT, opacity: 1 }
  // rank 2 满不透明，rank 3 起每名 -10%，最低保留 0.35 以保证文字可读
  const opacity = value === 2 ? 1 : Math.max(0.35, 1 - (value - 2) * 0.1)
  return { backgroundImage: RANK_ORANGE_GRADIENT, opacity: Number(opacity.toFixed(2)) }
}

const formatPublishDate = (value, label) => {
  if (label) {
    return String(label)
      .trim()
      .replace(/[/.]/g, '-')
      .replace('年', '-')
      .replace('月', '-')
      .replace('日', '')
  }
  if (!value) return '近期公开数据'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '近期公开数据'
  const parts = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]))
  return `${values.year}-${values.month}-${values.day}`
}

const handleCoverError = (item) => {
  item.cover_url = ''
}

const hasSafeContentUrl = (value) => {
  try {
    const target = new URL(value)
    return target.protocol === 'https:' || target.protocol === 'http:'
  } catch {
    return false
  }
}

const openTrendDetail = (item) => {
  if (!hasSafeContentUrl(item.content_url)) return
  const opened = window.open(item.content_url, '_blank', 'noopener,noreferrer')
  if (opened) opened.opener = null
}

const generateFromTrend = async (item) => {
  if (!runId.value || generatingContentId.value) return

  errorMessage.value = ''
  if (
    searchedGuideText.value &&
    materialText.value.trim() !== searchedGuideText.value
  ) {
    errorMessage.value = '输入内容已修改，请先点击“开始检索”创建新的模板结果'
    return
  }
  selectedContentId.value = item.content_id
  generatingContentId.value = item.content_id
  writeCachedWorkflow()
  try {
    await generateWorkflow(
      runId.value,
      { content_id: item.content_id },
      { signal: workflowController?.signal }
    )
    workflowBackendStatus.value = 'GENERATING'
    await router.push({
      name: 'inspiration',
      query: { runId: runId.value }
    })
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      errorMessage.value = error?.message || '启动生成失败，请稍后重试'
    }
  } finally {
    generatingContentId.value = ''
  }
}

onMounted(restoreLastSearch)

onBeforeUnmount(() => {
  stopVoiceInput()
  writeCachedWorkflow()
  workflowController?.abort()
  selectedImages.value.forEach((item) => {
    if (item.objectUrl) URL.revokeObjectURL(item.url)
  })
})
</script>

<template>
  <AppLayout mainClass="publish-page">
    <AppTopbar title="图文发布" :showCommandBtn="false" />

    <section class="composer-panel">
      <div class="block-head">
        <h2>平台选择</h2>
      </div>

      <div class="channel-grid" role="radiogroup" aria-label="平台选择">
        <label
          v-for="channel in channels"
          :key="channel.key"
          class="channel-card"
          :class="{
            'is-selected': selectedChannel === channel.key,
            'is-unavailable': !channel.supported
          }"
          :title="channel.label"
        >
          <div class="channel-meta">
            <img class="channel-logo-image" :src="channel.icon" :alt="`${channel.label}图标`" />
            <strong>{{ channel.label }}</strong>
          </div>
          <input
            type="radio"
            name="publish-channel"
            :value="channel.key"
            v-model="selectedChannel"
            :disabled="isProcessing"
          />
        </label>
      </div>

      <div class="block-head block-head-spaced">
        <h2>输入景区/场所图文资料</h2>
      </div>

      <section
        class="search-panel card"
        :class="{ 'search-panel-dragover': isDragOver }"
        @dragenter.prevent="handleDragEnter"
        @dragover.prevent="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <div class="search-input">
          <span class="search-icon">⌕</span>
          <textarea
            class="search-textarea"
            :value="displayText"
            @input="handleTextareaInput"
            placeholder="开始输入文本资料"
            :disabled="isProcessing"
          ></textarea>
          <button
            class="voice-input-btn"
            type="button"
            :class="{ 'is-listening': isListening, 'is-unsupported': !speechSupported }"
            :aria-pressed="isListening"
            :aria-label="isListening ? '停止语音输入' : '开始语音输入'"
            @click="toggleVoiceInput"
          >
            <span class="voice-dot" aria-hidden="true"></span>
            <span>{{ isListening ? '正在听写' : '语音输入' }}</span>
          </button>
        </div>

        <input
          ref="fileInput"
          class="sr-only-input"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          multiple
          :disabled="isProcessing"
          @change="handleFileChange"
        />

        <div v-if="selectedImages.length" class="search-upload-list">
          <div v-for="image in selectedImages" :key="image.id" class="search-upload-item">
            <img class="search-upload-thumb" :src="image.url" :alt="image.name" />
            <button
              class="search-upload-remove"
              type="button"
              :disabled="isProcessing"
              @click="removeImage(image.id)"
            >
              ×
            </button>
          </div>
        </div>

        <p class="search-drop-hint">
          图片为可选项；可直接拖拽图片到这里，或点击“添加图片”选择本地文件
        </p>

        <div class="search-footer">
          <button
            class="upload-photo-btn"
            type="button"
            :disabled="isProcessing || selectedImages.length >= 8"
            @click="openFilePicker"
          >
            <img class="upload-photo-icon-image" src="/assets/upload-photo-icon.png" alt="" aria-hidden="true" />
            <span>添加图片</span>
          </button>

          <div class="search-actions">
            <button class="primary-btn" type="button" :disabled="isProcessing" @click="showTrends">
              {{ isProcessing ? '处理中…' : '开始检索' }}
            </button>
          </div>
        </div>
      </section>

      <section
        v-if="workflowStatus || errorMessage"
        class="workflow-feedback"
        :class="{ 'is-error': Boolean(errorMessage) }"
        aria-live="polite"
      >
        <div class="workflow-feedback-row">
          <strong>{{ errorMessage ? '处理失败' : workflowStatus }}</strong>
          <span v-if="isProcessing">{{ Math.round(workflowProgress) }}%</span>
        </div>
        <div v-if="isProcessing" class="workflow-progress-track">
          <span :style="{ width: `${Math.max(0, Math.min(100, workflowProgress))}%` }"></span>
        </div>
        <p v-if="errorMessage">{{ errorMessage }}</p>
      </section>

      <div class="keyword-row">
        <span class="keyword-label">推荐关键词：</span>
        <span class="keyword-chip">故宫博物院</span>
        <span class="keyword-chip">西湖断桥</span>
        <span class="keyword-chip">丽江古城</span>
        <span class="keyword-chip">黄山云海</span>
        <span class="keyword-chip">稻城亚丁</span>
      </div>

      <div class="section-head trend-head trend-module" :class="{ 'is-visible': trendVisible }">
        <h2>热点笔记推荐</h2>
        <a href="#">查看更多</a>
      </div>

      <div class="trend-grid trend-module" :class="{ 'is-visible': trendVisible }">
        <article
          v-for="item in trendRecommendations"
          :key="item.content_id"
          class="trend-card card"
          :class="{
            'is-visible': trendCardsVisible,
            'is-selected': selectedContentId === item.content_id
          }"
        >
          <div class="trend-card-heading">
            <div
              class="trend-score-box"
              :class="scoreBoxClass(item.rank)"
              :style="scoreBoxStyle(item.rank)"
              :aria-label="`综合热度 ${formatHotScore(item.hot_score)}`"
            >
              {{ formatHotScore(item.hot_score) }}
            </div>
            <div class="trend-title-group">
              <h3>{{ item.title || '未命名热点' }}</h3>
              <p>{{ item.hot_label || '热点参考' }}</p>
            </div>
            <span class="trend-rank">TOP {{ item.rank }}</span>
          </div>

          <time class="trend-date" :datetime="item.publish_time || undefined">
            {{ formatPublishDate(item.publish_time, item.publish_label) }}
          </time>

          <p v-if="item.summary" class="trend-copy">
            {{ item.summary }}
          </p>
          <p v-if="item.ranking_reason" class="trend-ranking-reason">
            推荐理由：{{ item.ranking_reason }}
          </p>

          <img
            v-if="item.cover_url"
            class="trend-photo"
            :src="item.cover_url"
            :alt="`${item.title || '热点'}参考图`"
            loading="lazy"
            referrerpolicy="no-referrer"
            @error="handleCoverError(item)"
          />
          <div v-else class="trend-photo trend-photo-fallback">
            <span>{{ item.tag || item.keyword || '小红书热点' }}</span>
            <strong>{{ item.title || '热门内容参考' }}</strong>
          </div>

          <dl class="trend-metrics">
            <div><dt>浏览</dt><dd>{{ formatMetric(item.views) }}</dd></div>
            <div><dt>点赞</dt><dd>{{ formatMetric(item.likes) }}</dd></div>
            <div><dt>评论</dt><dd>{{ formatMetric(item.comments) }}</dd></div>
            <div><dt>收藏</dt><dd>{{ formatMetric(item.favorites) }}</dd></div>
            <div><dt>分享</dt><dd>{{ formatMetric(item.shares) }}</dd></div>
          </dl>

          <div class="trend-actions">
            <button
              class="trend-detail-btn"
              type="button"
              :disabled="!hasSafeContentUrl(item.content_url)"
              @click="openTrendDetail(item)"
            >
              查看详情
            </button>
            <button
              class="trend-generate-btn"
              type="button"
              :disabled="
                Boolean(generatingContentId) ||
                workflowBackendStatus === 'GENERATING' ||
                workflowBackendStatus === 'PUBLISHED'
              "
              @click="generateFromTrend(item)"
            >
              {{
                generatingContentId === item.content_id
                  ? '启动中…'
                  : selectedContentId === item.content_id
                    ? '重新生成同款'
                    : '生成同款'
              }}
            </button>
          </div>
        </article>
      </div>

      <div
        v-if="restHotspots.length"
        class="trend-rank-block trend-module"
        :class="{ 'is-visible': trendVisible }"
      >
        <div class="section-head trend-rank-head">
          <h3>其他热点排行</h3>
          <span class="trend-rank-count">共 {{ restHotspots.length }} 条，下滑查看</span>
        </div>

        <ul class="trend-rank-list">
          <li
            v-for="item in restHotspots"
            :key="item.content_id"
            class="trend-rank-item"
            :class="{ 'is-selected': selectedContentId === item.content_id }"
          >
            <span class="trend-rank-index" :style="scoreBoxStyle(item.rank)">
              {{ item.rank }}
            </span>

            <div class="trend-rank-main">
              <p class="trend-rank-title">{{ item.title }}</p>
              <div class="trend-rank-metrics">
                <span>热度 {{ formatMetric(item.hot_score) }}</span>
                <span>浏览 {{ formatMetric(item.views) }}</span>
                <span>点赞 {{ formatMetric(item.likes) }}</span>
                <span>评论 {{ formatMetric(item.comments) }}</span>
              </div>
            </div>

            <div class="trend-rank-actions">
              <button
                class="trend-rank-btn"
                type="button"
                :disabled="!hasSafeContentUrl(item.content_url)"
                @click="openTrendDetail(item)"
              >
                查看详情
              </button>
              <button
                class="trend-rank-btn is-primary"
                type="button"
                :disabled="
                  Boolean(generatingContentId) ||
                  workflowBackendStatus === 'GENERATING' ||
                  workflowBackendStatus === 'PUBLISHED'
                "
                @click="generateFromTrend(item)"
              >
                {{
                  generatingContentId === item.content_id
                    ? '启动中…'
                    : selectedContentId === item.content_id
                      ? '重新生成'
                      : '生成同款'
                }}
              </button>
            </div>
          </li>
        </ul>
      </div>
    </section>
  </AppLayout>
</template>
