<template>
  <AppLayout mainClass="inspiration-page">
    <AppTopbar title="图文发布" :showCommandBtn="false" flat />

    <section v-if="!runId" class="workflow-empty-state card">
      <h1>缺少工作流信息</h1>
      <p>当前页面没有 runId，无法恢复生成结果。请返回图文发布页重新开始。</p>
      <button class="primary-btn" type="button" @click="returnToPublish">返回图文发布</button>
    </section>

    <section v-else-if="errorMessage && !generatedPost" class="workflow-empty-state card is-error">
      <h1>工作流未能完成</h1>
      <p>{{ errorMessage }}</p>
      <button class="primary-btn" type="button" @click="returnToPublish">返回图文发布</button>
    </section>

    <section v-else-if="isAnalyzing" class="inspiration-loading-shell">
      <div class="inspiration-loading-top">
        <div class="analysis-percent-pill">
          <div class="analysis-percent-readout">
            <span class="analysis-percent-value">{{ displayAnalysisProgress }}</span>
            <span class="analysis-percent-unit">%</span>
          </div>
        </div>
        <div class="analysis-heading">
          <h1>{{ loadingTitle }}</h1>
          <p>{{ loadingDescription }}</p>
        </div>
      </div>

      <div class="analysis-board">
        <div class="analysis-status-card">
          <div class="analysis-progress-track">
            <span class="analysis-progress-line"></span>
            <span
              class="analysis-progress-fill"
              :style="{ width: `${displayAnalysisProgress}%` }"
            ></span>
            <span class="analysis-progress-node analysis-progress-node-start"></span>
            <span
              class="analysis-progress-node analysis-progress-node-active"
              :style="{ left: `calc(${analysisNodePosition}% - 23px)` }"
            ></span>
          </div>

          <div class="analysis-steps">
            <div
              v-for="(step, index) in analysisSteps"
              :key="step"
              class="analysis-step-row"
              :class="analysisStepClass(index)"
            >
              <span class="analysis-step-dot"></span>
              <span class="analysis-step-text">{{ step }}</span>
            </div>
          </div>
        </div>

        <div class="analysis-preview-card">
          <div class="analysis-preview-phone">
            <div class="analysis-preview-sky"></div>
            <div class="analysis-preview-hills"></div>
            <div class="analysis-preview-water"></div>
          </div>
          <div class="analysis-preview-layout">
            <div class="analysis-preview-grid">
              <span class="analysis-preview-block analysis-preview-block-tall"></span>
              <span class="analysis-preview-block"></span>
              <span class="analysis-preview-block"></span>
              <span class="analysis-preview-block"></span>
              <span class="analysis-preview-block analysis-preview-block-thin"></span>
              <span class="analysis-preview-block"></span>
              <span class="analysis-preview-block"></span>
            </div>
            <p class="analysis-api-status">{{ workflowStatusText }}</p>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="inspiration-shell" :class="{ 'is-publishing': isPublishing }">
      <div class="inspiration-heading">
        <h1>借鉴创作·发布同款</h1>
        <p>基于已选热点和官方讲解词生成的小红书图文方案</p>
      </div>

      <div v-if="errorMessage" class="workflow-inline-error" aria-live="polite">
        {{ errorMessage }}
      </div>

      <div class="inspiration-main">
        <section class="phone-preview" aria-label="生成图片预览">
          <img
            v-if="images.length"
            class="phone-reference generated-phone-reference"
            :src="images[0]"
            :alt="generatedPost?.title || '生成图片'"
          />
          <div v-else class="generated-image-empty">
            <strong>当前没有图片</strong>
            <span>仍可查看生成文案；发布图文前需生成图片或返回补充图片。</span>
          </div>
        </section>

        <section class="inspiration-detail card">
          <div class="detail-title-row">
            <div class="detail-status-wrap">
              <h2>{{ generatedPost?.title || '生成内容已就绪' }}</h2>
              <p v-if="isPublishing" class="detail-status-copy">
                正在预览并发布至已确认的小红书账号
              </p>
              <div v-if="isPublishing" class="detail-progress">
                <span class="detail-progress-fill" :style="{ width: `${publishProgress}%` }"></span>
              </div>
            </div>
          </div>

          <p class="detail-paragraph generated-post-body">
            {{ generatedPost?.body || '生成正文为空，请返回重新创建工作流。' }}
          </p>

          <div v-if="images.length" class="thumb-strip generated-thumb-strip">
            <img
              v-for="(image, index) in images"
              :key="`${image}-${index}`"
              :src="image"
              :alt="`发布图片 ${index + 1}`"
            />
          </div>

          <div v-if="hashtags.length" class="topic-chip-row">
            <span v-for="tag in hashtags" :key="tag" class="topic-chip topic-chip-active">
              {{ tag }}
            </span>
          </div>

          <div class="generation-meta-grid generation-meta-grid-single">
            <section class="generation-meta-card">
              <h3>账号预检</h3>
              <p v-if="publisherAccount">当前账号：@{{ publisherAccount.nickname }}</p>
              <p v-if="publisherAccount && publisherSessionSource === 'edge'">
                登录方式：Microsoft Edge（发布完成前请保持窗口打开）
              </p>
              <p v-if="!publisherAccount && preflightPending">正在检查当前登录账号…</p>
              <p v-else-if="!publisherAccount" class="generation-warning">
                {{ preflightMessage || '尚未完成账号预检' }}
              </p>
              <button
                class="edge-login-action"
                type="button"
                :disabled="edgeLoginPending || isPublishing"
                @click="startEdgeLogin"
              >
                {{
                  edgeLoginPending
                    ? '等待 Edge 登录…'
                    : publisherAccount
                      ? '使用 Edge 切换账号'
                      : '使用 Microsoft Edge 登录'
                }}
              </button>
              <p v-if="edgeLoginMessage" class="edge-login-message">
                {{ edgeLoginMessage }}
              </p>
            </section>
          </div>
        </section>
      </div>

      <section class="prompt-panel card">
        <div class="prompt-heading">确认笔记</div>
        <p v-if="localNotice" class="local-draft-notice">{{ localNotice }}</p>

        <div class="prompt-row">
          <div class="prompt-buttons">
            <button
              class="ghost-action"
              :disabled="isPublishing"
              type="button"
              @click="saveLocalDraft"
            >
              保存草稿箱
            </button>
            <button
              class="ghost-action"
              :disabled="isPublishing"
              type="button"
              @click="returnToPublish"
            >
              再次生成
            </button>
            <button
              class="confirm-action"
              :disabled="!canPublish"
              type="button"
              @click="openPublishConfirmation"
            >
              <template v-if="isPublishing">
                发布中 <span class="publishing-spinner" aria-hidden="true"></span>
              </template>
              <template v-else>
                一键发布 <span>›</span>
              </template>
            </button>
          </div>
        </div>
      </section>
    </section>

    <div
      v-if="showPublishConfirm"
      class="publish-confirm-overlay"
      role="presentation"
      @click.self="closePublishConfirmation"
    >
      <section
        class="publish-confirm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="publish-confirm-title"
      >
        <div class="publish-confirm-heading">
          <div>
            <span>真实平台发布</span>
            <h2 id="publish-confirm-title">确认发布到小红书</h2>
          </div>
          <button type="button" aria-label="关闭" @click="closePublishConfirmation">×</button>
        </div>

        <dl class="publish-confirm-summary">
          <div><dt>账号</dt><dd>@{{ publisherAccount?.nickname }}</dd></div>
          <div><dt>标题</dt><dd>{{ generatedPost?.title }}</dd></div>
          <div><dt>图片</dt><dd>{{ images.length }} 张</dd></div>
        </dl>

        <fieldset class="publish-visibility-options">
          <legend>可见范围</legend>
          <label>
            <input v-model="publishVisibility" type="radio" value="private" />
            <span><strong>仅自己可见</strong><small>发布后仅当前账号可见</small></span>
          </label>
          <label>
            <input v-model="publishVisibility" type="radio" value="public" />
            <span><strong>公开发布</strong><small>发布后将直接对平台用户可见</small></span>
          </label>
        </fieldset>

        <p class="publish-confirm-warning">
          点击“确认并发布”后会调用真实小红书发布接口。若出现验证码、风控或手机绑定要求，系统会立即停止。
        </p>

        <div class="publish-confirm-actions">
          <button type="button" class="ghost-action" @click="closePublishConfirmation">
            取消
          </button>
          <button type="button" class="confirm-action" @click="startPublishing">
            确认并发布
          </button>
        </div>
      </section>
    </div>

    <div v-if="showSuccessToast" class="publish-success-toast">
      <div class="publish-success-main">
        <div class="publish-success-check">✓</div>
        <div class="publish-success-text">笔记发布成功，已同步至小红书</div>
      </div>
      <div class="publish-success-actions">
        <button class="publish-success-btn" type="button" @click="openPublishedNote">
          查看小红书笔记
        </button>
        <button class="publish-success-btn" type="button" @click="copyPublishLink">
          复制链接
        </button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import {
  getEdgePublisherLoginStatus,
  getWorkflow,
  pollWorkflow,
  preflightPublisher,
  publishWorkflow,
  startEdgePublisherLogin
} from '@/api/workflow'

const route = useRoute()
const router = useRouter()
const analysisSteps = ['任务已创建', '素材与事实解析', '热点风格分析', '图文内容生成', '发布准备']
const terminalStatuses = new Set([
  'READY_TO_PUBLISH',
  'NEEDS_REVIEW',
  'PUBLISHED',
  'FAILED'
])
const statusDescriptions = {
  QUEUED: '任务正在等待后端处理',
  PARSING: '正在解析素材与官方讲解词',
  COLLECTING_HOTSPOTS: '正在整理已选择的热点参考',
  WAITING_USER_SELECTION: '工作流仍在等待热点选择',
  GENERATING: '正在分析参考内容并生成图文',
  READY_TO_PUBLISH: '生成完成，可以预览并确认发布',
  NEEDS_REVIEW: '生成完成，可以直接发布',
  PUBLISHED: '笔记已经发布',
  FAILED: '工作流执行失败'
}

const runId = computed(() =>
  typeof route.query.runId === 'string' ? route.query.runId.trim() : ''
)
const workflow = ref(null)
const errorMessage = ref('')
const preflightMessage = ref('')
const preflightPending = ref(false)
const publisherAccount = ref(null)
const publisherSessionSource = ref('')
const edgeLoginPending = ref(false)
const edgeLoginMessage = ref('')
const publishReceipt = ref(null)
const publishState = ref('idle')
const publishProgress = ref(0)
const publishVisibility = ref('private')
const showPublishConfirm = ref(false)
const localNotice = ref('')
let workflowController = null
let edgeLoginTimer = null
let edgeLoginAttempts = 0

const generatedPost = computed(() => workflow.value?.generated_post || null)
const hashtags = computed(() =>
  Array.isArray(generatedPost.value?.hashtags) ? generatedPost.value.hashtags : []
)
const images = computed(() =>
  Array.isArray(workflow.value?.images)
    ? workflow.value.images
        .map((item) => item?.preview_url || item?.url)
        .filter((item) => typeof item === 'string' && item)
    : []
)
const workflowProgress = computed(() => {
  const value = Number(workflow.value?.progress)
  return Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0
})
const displayAnalysisProgress = computed(() => Math.round(workflowProgress.value))
const analysisNodePosition = computed(() => Math.max(14, Math.min(workflowProgress.value, 96)))
const isAnalyzing = computed(
  () => Boolean(runId.value) && !errorMessage.value && !terminalStatuses.has(workflow.value?.status)
)
const isPublishing = computed(() => publishState.value === 'publishing')
const showSuccessToast = computed(() => Boolean(publishReceipt.value?.note_id))
const canPublish = computed(
  () =>
    ['READY_TO_PUBLISH', 'NEEDS_REVIEW'].includes(workflow.value?.status) &&
    images.value.length > 0 &&
    Boolean(publisherAccount.value?.nickname) &&
    !isPublishing.value
)
const loadingTitle = computed(() =>
  workflow.value?.status === 'GENERATING' ? '模型正在生成中…' : '正在恢复工作流…'
)
const loadingDescription = computed(
  () => statusDescriptions[workflow.value?.status] || '正在读取真实工作流状态，请稍候。'
)
const workflowStatusText = computed(
  () => statusDescriptions[workflow.value?.status] || workflow.value?.status || '读取中'
)
const activeAnalysisStepIndex = computed(() => {
  if (workflowProgress.value < 10) return 0
  if (workflowProgress.value < 35) return 1
  if (workflowProgress.value < 60) return 2
  if (workflowProgress.value < 95) return 3
  return 4
})

const analysisStepClass = (index) => {
  if (index < activeAnalysisStepIndex.value) return 'is-complete'
  if (index === activeAnalysisStepIndex.value) return 'is-active'
  return 'is-pending'
}

const applyWorkflow = (state) => {
  workflow.value = state
  if (state.status === 'FAILED') {
    errorMessage.value = state.error?.message || '工作流执行失败'
  }
  if (state.status === 'PUBLISHED' && state.published?.note_id) {
    publishReceipt.value = state.published
  }
}

const runPreflight = async () => {
  if (!['READY_TO_PUBLISH', 'NEEDS_REVIEW'].includes(workflow.value?.status)) return
  preflightPending.value = true
  preflightMessage.value = ''
  publisherAccount.value = null
  try {
    const result = await preflightPublisher({ signal: workflowController?.signal })
    publisherAccount.value = result.account || null
    publisherSessionSource.value = result.session_source || ''
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      preflightMessage.value = error?.message || '请先登录小红书账号'
    }
  } finally {
    preflightPending.value = false
  }
}

const clearEdgeLoginTimer = () => {
  if (!edgeLoginTimer) return
  window.clearTimeout(edgeLoginTimer)
  edgeLoginTimer = null
}

const checkEdgeLoginStatus = async () => {
  clearEdgeLoginTimer()
  if (!edgeLoginPending.value) return
  try {
    const result = await getEdgePublisherLoginStatus({
      signal: workflowController?.signal
    })
    publisherAccount.value = result.account || null
    publisherSessionSource.value = result.session_source || 'edge'
    edgeLoginMessage.value = publisherAccount.value
      ? `Edge 登录成功：@${publisherAccount.value.nickname}`
      : '正在读取 Edge 登录状态…'
    edgeLoginPending.value = false
    preflightMessage.value = ''
  } catch (error) {
    if (error?.name === 'AbortError' || error?.code === 'ERR_CANCELED') return
    edgeLoginAttempts += 1
    if (edgeLoginAttempts >= 120) {
      edgeLoginPending.value = false
      edgeLoginMessage.value = '等待登录超时，可点击按钮重新打开 Edge。'
      return
    }
    edgeLoginMessage.value = '请在 Edge 中完成小红书登录，页面会自动检测。'
    edgeLoginTimer = window.setTimeout(checkEdgeLoginStatus, 2000)
  }
}

const startEdgeLogin = async () => {
  if (edgeLoginPending.value || isPublishing.value) return
  errorMessage.value = ''
  edgeLoginMessage.value = '正在打开 Microsoft Edge…'
  edgeLoginPending.value = true
  edgeLoginAttempts = 0
  try {
    const result = await startEdgePublisherLogin({
      signal: workflowController?.signal
    })
    edgeLoginMessage.value =
      result.message || '已打开 Edge，请登录小红书后返回本页面。'
    edgeLoginTimer = window.setTimeout(checkEdgeLoginStatus, 1200)
  } catch (error) {
    edgeLoginPending.value = false
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      edgeLoginMessage.value = error?.message || '无法打开 Microsoft Edge'
    }
  }
}

const restoreWorkflow = async () => {
  if (!runId.value) return
  errorMessage.value = ''
  workflowController?.abort()
  workflowController = new AbortController()

  try {
    const initial = await getWorkflow(runId.value, { signal: workflowController.signal })
    applyWorkflow(initial)
    if (initial.status === 'WAITING_USER_SELECTION') {
      errorMessage.value = '该工作流尚未选择热点，请返回图文发布页重新开始。'
      return
    }
    if (!terminalStatuses.has(initial.status)) {
      const completed = await pollWorkflow(runId.value, {
        until: ['READY_TO_PUBLISH', 'NEEDS_REVIEW', 'PUBLISHED'],
        signal: workflowController.signal,
        onUpdate: applyWorkflow
      })
      applyWorkflow(completed)
    }
    await runPreflight()
  } catch (error) {
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      if (error?.workflow) applyWorkflow(error.workflow)
      errorMessage.value = error?.message || '恢复工作流失败'
    }
  }
}

const openPublishConfirmation = () => {
  if (!canPublish.value) return
  showPublishConfirm.value = true
}

const closePublishConfirmation = () => {
  if (isPublishing.value) return
  showPublishConfirm.value = false
}

const startPublishing = async () => {
  if (!canPublish.value) return
  showPublishConfirm.value = false
  publishState.value = 'publishing'
  publishProgress.value = 20
  errorMessage.value = ''
  const idempotencyKey = `${runId.value}-generated`
  const commonPayload = {
    visibility: publishVisibility.value,
    session_source: publisherSessionSource.value || 'configured',
    confirmed_account: publisherAccount.value?.nickname || '',
    idempotency_key: idempotencyKey
  }

  try {
    await publishWorkflow(
      runId.value,
      {
        ...commonPayload,
        execute: false,
        account_confirmed: false
      },
      { signal: workflowController?.signal }
    )
    publishProgress.value = 55
    const result = await publishWorkflow(
      runId.value,
      {
        ...commonPayload,
        execute: true,
        account_confirmed: true
      },
      { signal: workflowController?.signal }
    )
    if (!result?.note_id) {
      throw new Error('发布器未返回 note_id，未确认发布成功')
    }
    publishProgress.value = 100
    publishReceipt.value = result
    publishState.value = 'published'
    workflow.value = {
      ...workflow.value,
      status: 'PUBLISHED',
      published: result
    }
  } catch (error) {
    publishProgress.value = 0
    publishState.value = 'idle'
    if (error?.name !== 'AbortError' && error?.code !== 'ERR_CANCELED') {
      errorMessage.value = error?.message || '发布失败，请确认登录状态后重试'
    }
  }
}

const saveLocalDraft = () => {
  localNotice.value = '当前内容已由工作流保留；未调用远程草稿接口。'
}

const returnToPublish = () => {
  router.push({
    name: 'publish',
    query: runId.value ? { runId: runId.value } : {}
  })
}

const safeNoteUrl = () => {
  try {
    const target = new URL(publishReceipt.value?.note_url)
    return target.protocol === 'https:' || target.protocol === 'http:' ? target.href : ''
  } catch {
    return ''
  }
}

const openPublishedNote = () => {
  const noteUrl = safeNoteUrl()
  if (!noteUrl) return
  const opened = window.open(noteUrl, '_blank', 'noopener,noreferrer')
  if (opened) opened.opener = null
}

const copyPublishLink = async () => {
  const noteUrl = safeNoteUrl()
  if (!noteUrl || !navigator.clipboard?.writeText) return
  try {
    await navigator.clipboard.writeText(noteUrl)
  } catch {
    errorMessage.value = '复制链接失败，请手动打开笔记'
  }
}

onMounted(restoreWorkflow)

onBeforeUnmount(() => {
  workflowController?.abort()
  clearEdgeLoginTimer()
})
</script>
