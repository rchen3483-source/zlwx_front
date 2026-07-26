<template>
  <AppLayout mainClass="inspiration-page">
    <AppTopbar title="图文发布" :showCommandBtn="false" flat />

    <section v-if="isAnalyzing" class="inspiration-loading-shell">
      <div class="analysis-wave analysis-wave-left"></div>
      <div class="analysis-wave analysis-wave-right"></div>

      <div class="analysis-board">
        <div class="analysis-card">
          <div class="analysis-card-top">
            <div class="analysis-card-label">
              <span class="analysis-card-bolt">✦</span>
              <span>Generating...</span>
            </div>
            <div class="analysis-card-time">
              <span class="analysis-card-clock">◔</span>
              <span>{{ analysisRemainingText }}</span>
            </div>
          </div>

          <div class="analysis-card-main">
            <div class="analysis-percent-readout">
              <span class="analysis-percent-value">{{ displayAnalysisProgress }}</span>
              <span class="analysis-percent-unit">%</span>
            </div>

            <div class="analysis-heading">
              <h1>发布同款内容生成中</h1>
              <p>系统正在整理参考内容、生成排版结构与发布草稿，请稍候片刻。</p>
            </div>
          </div>

          <div class="analysis-scale">
            <span v-for="mark in analysisScaleMarks" :key="mark">{{ mark }}</span>
          </div>

          <div class="analysis-progress-shell">
            <div class="analysis-progress-fill-card" :style="{ width: `${Math.max(displayAnalysisProgress, 8)}%` }"></div>
            <span
              v-for="mark in analysisScaleMarks.slice(1, -1)"
              :key="`line-${mark}`"
              class="analysis-progress-divider"
            ></span>
          </div>

          <div class="analysis-step-pills">
            <span
              v-for="(step, index) in analysisSteps"
              :key="step"
              class="analysis-step-pill"
              :class="analysisStepClass(index)"
            >
              {{ step }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="inspiration-shell" :class="{ 'is-publishing': isPublishing }">
      <div class="inspiration-heading">
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageSubtitle }}</p>
      </div>

      <div class="inspiration-main">
        <section class="phone-preview" aria-label="小红书旅游封面预览">
          <img class="phone-reference" src="/assets/dali-phone-preview.png" alt="云南大理四天三晚漫游攻略封面" />
        </section>

        <section class="inspiration-detail card">
          <div class="detail-title-row">
            <div class="detail-status-wrap">
              <h2>{{ detailTitle }}</h2>
              <p v-if="isPublishing" class="detail-status-copy">正在将笔记发布至绑定的小红书账号 @travel_dali</p>
              <div v-if="isPublishing" class="detail-progress">
                <span class="detail-progress-fill" :style="{ width: `${publishProgress}%` }"></span>
              </div>
            </div>
            <div class="detail-actions-inline">
              <button class="detail-icon-btn detail-icon-note" aria-label="备注"></button>
              <button class="detail-icon-btn detail-icon-search" aria-label="搜索"></button>
            </div>
          </div>

          <p class="detail-paragraph">
            从洱海到苍山，从古城到喜洲，这条路线适合第一次来大理的人。白天看海，傍晚追日落，晚上逛古城小吃街，节奏轻松说不无聊。推荐安排洱海骑行、喜洲麦田、苍山索道、双廊咖啡和古城夜游，拍照点点，美食也很集中。
          </p>

          <div class="thumb-strip">
            <img src="/assets/dali-thumb-1.png" alt="洱海风景 1" />
            <img src="/assets/dali-thumb-2.png" alt="洱海风景 2" />
            <img src="/assets/dali-thumb-3.png" alt="洱海风景 3" />
            <img src="/assets/dali-thumb-4.png" alt="大理建筑 1" />
            <img src="/assets/dali-thumb-5.png" alt="大理建筑 2" />
            <img src="/assets/dali-thumb-6.png" alt="大理建筑 3" />
            <img src="/assets/dali-thumb-7.png" alt="大理建筑 4" />
          </div>

          <div class="topic-chip-row">
            <span class="topic-chip topic-chip-active">大理旅行</span>
            <span class="topic-chip topic-chip-soft">旅途</span>
            <span class="topic-chip">云南旅游</span>
            <span class="topic-chip">四天三晚</span>
            <span class="topic-chip">洱海攻略</span>
            <span class="topic-chip">周末出游</span>
          </div>
        </section>
      </div>

      <section class="prompt-panel card">
        <div class="prompt-heading">确认笔记</div>

        <div class="prompt-row">
          <div class="prompt-buttons">
            <button class="ghost-action" :disabled="isPublishing" type="button">保存草稿箱</button>
            <button class="ghost-action" :disabled="isPublishing" type="button">再次生成</button>
            <button class="confirm-action" :disabled="isPublishing" type="button" @click="startPublishing">
              <template v-if="isPublishing">
                发布中 <span class="publishing-spinner" aria-hidden="true"></span>
              </template>
              <template v-else>
                确认发布 <span>›</span>
              </template>
            </button>
          </div>
        </div>
      </section>
    </section>

    <div v-if="showSuccessToast" class="publish-success-toast">
      <button class="publish-success-close" type="button" aria-label="关闭弹窗" @click="closeSuccessToast">×</button>
      <div class="publish-success-main">
        <div class="publish-success-check">✓</div>
        <div class="publish-success-text">笔记发布成功，已同步至小红书</div>
      </div>
      <div class="publish-success-actions">
        <button class="publish-success-btn" type="button">查看小红书笔记</button>
        <button class="publish-success-btn" type="button" @click="copyPublishLink">复制链接</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

const defaultState = {
  pageTitle: '借鉴创作·发布同款',
  pageSubtitle: '基于参考内容生成完整小红书旅游图文方案',
  detailTitle: '云南大理四天三晚漫游攻略'
}

const analysisDuration = 3000
const publishDuration = 3000
const publishLink = 'https://www.xiaohongshu.com/user/profile/travel_dali'
const analysisSteps = ['素材识别完成', '路线解析中', '排版生成中', '封面优化中', '即将完成']

const analysisProgress = ref(0)
const publishProgress = ref(0)
const isAnalyzing = ref(true)
const publishState = ref('idle')
const analysisFrameId = ref(0)
const publishFrameId = ref(0)
const analysisStartTime = ref(0)
const publishStartTime = ref(0)

const isPublishing = computed(() => publishState.value === 'publishing')
const showSuccessToast = computed(() => publishState.value === 'published')
const displayAnalysisProgress = computed(() => Math.round(analysisProgress.value))
const analysisScaleMarks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const pageTitle = computed(() => defaultState.pageTitle)
const pageSubtitle = computed(() => (isPublishing.value ? '正在发布到绑定账号' : defaultState.pageSubtitle))
const detailTitle = computed(() => (isPublishing.value ? '正在发布到绑定账号' : defaultState.detailTitle))
const analysisRemainingSeconds = computed(() => Math.max(1, Math.ceil(((100 - analysisProgress.value) / 100) * (analysisDuration / 1000))))
const analysisRemainingText = computed(() => `${analysisRemainingSeconds.value}s left`)
const activeAnalysisStepIndex = computed(() => {
  if (analysisProgress.value < 18) {
    return 0
  }
  if (analysisProgress.value < 82) {
    return 1
  }
  if (analysisProgress.value < 90) {
    return 2
  }
  if (analysisProgress.value < 97) {
    return 3
  }
  return 4
})

const analysisStepClass = (index) => {
  if (index < activeAnalysisStepIndex.value) {
    return 'is-complete'
  }
  if (index === activeAnalysisStepIndex.value) {
    return 'is-active'
  }
  return 'is-pending'
}

const stopAnalysisAnimation = () => {
  if (analysisFrameId.value) {
    cancelAnimationFrame(analysisFrameId.value)
    analysisFrameId.value = 0
  }
}

const stopPublishAnimation = () => {
  if (publishFrameId.value) {
    cancelAnimationFrame(publishFrameId.value)
    publishFrameId.value = 0
  }
}

const finishAnalysis = () => {
  stopAnalysisAnimation()
  analysisProgress.value = 100
  isAnalyzing.value = false
}

const finishPublishing = () => {
  stopPublishAnimation()
  publishProgress.value = 100
  publishState.value = 'published'
}

const stepAnalysis = (timestamp) => {
  if (!analysisStartTime.value) {
    analysisStartTime.value = timestamp
  }

  const nextProgress = Math.min(((timestamp - analysisStartTime.value) / analysisDuration) * 100, 100)
  analysisProgress.value = nextProgress

  if (nextProgress >= 100) {
    finishAnalysis()
    return
  }

  analysisFrameId.value = requestAnimationFrame(stepAnalysis)
}

const stepPublishing = (timestamp) => {
  if (!publishStartTime.value) {
    publishStartTime.value = timestamp
  }

  const nextProgress = Math.min(((timestamp - publishStartTime.value) / publishDuration) * 100, 100)
  publishProgress.value = nextProgress

  if (nextProgress >= 100) {
    finishPublishing()
    return
  }

  publishFrameId.value = requestAnimationFrame(stepPublishing)
}

const startPublishing = () => {
  if (isPublishing.value) {
    return
  }

  stopPublishAnimation()
  publishState.value = 'publishing'
  publishStartTime.value = 0
  publishProgress.value = 0
  publishFrameId.value = requestAnimationFrame(stepPublishing)
}

const copyPublishLink = async () => {
  if (!navigator.clipboard?.writeText) {
    return
  }

  try {
    await navigator.clipboard.writeText(publishLink)
  } catch (error) {
    console.error(error)
  }
}

const closeSuccessToast = () => {
  publishState.value = 'idle'
}

onMounted(() => {
  analysisFrameId.value = requestAnimationFrame(stepAnalysis)
})

onBeforeUnmount(() => {
  stopAnalysisAnimation()
  stopPublishAnimation()
})
</script>
