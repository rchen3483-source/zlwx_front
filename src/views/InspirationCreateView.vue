<template>
  <AppLayout mainClass="inspiration-page">
    <AppTopbar title="图文发布" :showCommandBtn="false" flat />

    <section class="inspiration-shell" :class="{ 'is-publishing': isPublishing }">
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
                <span class="detail-progress-fill" :style="{ width: `${progress}%` }"></span>
              </div>
            </div>
            <div class="detail-actions-inline">
              <button class="detail-icon-btn detail-icon-note" aria-label="备注"></button>
              <button class="detail-icon-btn detail-icon-search" aria-label="搜索"></button>
            </div>
          </div>

          <div class="detail-chip-row">
            <span class="outline-chip">旅行灵感</span>
            <span class="outline-chip">大理必打卡</span>
            <span class="outline-chip">轻松出行</span>
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
        <div class="prompt-heading">修改指令</div>

        <div class="prompt-row">
          <textarea
            v-model="promptValue"
            class="prompt-box"
            :placeholder="promptPlaceholder"
            :disabled="isPublishing"
          ></textarea>

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
import { computed, onBeforeUnmount, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { generateContent } from '@/api/publish'

const defaultState = {
  pageTitle: '借鉴创作',
  pageSubtitle: '基于参考内容生成完整小红书旅游图文方案',
  detailTitle: '云南大理四天三晚漫游攻略',
  promptPlaceholder: '补充目的地、出行天数、风格调性或重点景点'
}

const referencePost = {
  title: '云南大理四天三晚漫游攻略',
  content:
    '从洱海到苍山，从古城到喜洲，这条路线适合第一次来大理的人。白天看海，傍晚追日落，晚上逛古城小吃街，节奏轻松说不无聊。推荐安排洱海骑行、喜洲麦田、苍山索道、双廊咖啡和古城夜游，拍照点点，美食也很集中。',
  likes: 0,
  comments: 0
}

const guideText =
  '大理位于云南省西北部，是国家历史文化名城，被誉为“风花雪月”之地。主要景点包括洱海、苍山、大理古城、喜洲古镇、双廊等。夏季平均气温 20-25 度，是理想的避暑与摄影目的地。'

const defaultKeywords = ['大理旅行', '洱海攻略', '四天三晚', '云南旅游']
const publishLink = 'https://www.xiaohongshu.com/user/profile/travel_dali'
const softMinDuration = 1200

const promptValue = ref('')
const progress = ref(0)
const publishState = ref('idle')
const frameId = ref(0)
const publishStartTime = ref(0)
const generatedPost = ref(null)
const errorMessage = ref('')

const isPublishing = computed(() => publishState.value === 'publishing')
const showSuccessToast = computed(() => publishState.value === 'published')
const pageTitle = computed(() => defaultState.pageTitle)
const pageSubtitle = computed(() =>
  isPublishing.value ? '正在生成文案，请稍候…' : defaultState.pageSubtitle
)
const detailTitle = computed(() => {
  if (isPublishing.value) return '正在生成文案…'
  if (generatedPost.value?.title) return generatedPost.value.title
  return defaultState.detailTitle
})
const promptPlaceholder = computed(() =>
  isPublishing.value ? '生成过程中暂不可修改' : defaultState.promptPlaceholder
)

const buildRequestPayload = () => {
  const extraTopic = promptValue.value.trim()
  const topic = extraTopic ? `${defaultState.detailTitle}｜${extraTopic}` : defaultState.detailTitle

  return {
    platform: 'xhs',
    topic,
    keywords: defaultKeywords,
    guide_text: guideText,
    reference: referencePost
  }
}

const stopAnimation = () => {
  if (frameId.value) {
    cancelAnimationFrame(frameId.value)
    frameId.value = 0
  }
}

const stepProgress = (timestamp) => {
  if (!publishStartTime.value) {
    publishStartTime.value = timestamp
  }

  // 请求未返回前，进度条最多爬到 90%，避免用户以为已完成
  const elapsed = timestamp - publishStartTime.value
  const ratio = Math.min(elapsed / softMinDuration, 1)
  progress.value = Math.min(90 * ratio, 90)

  if (publishState.value === 'publishing') {
    frameId.value = requestAnimationFrame(stepProgress)
  }
}

const startPublishing = async () => {
  if (isPublishing.value) return

  stopAnimation()
  errorMessage.value = ''
  generatedPost.value = null
  publishState.value = 'publishing'
  publishStartTime.value = 0
  progress.value = 0
  frameId.value = requestAnimationFrame(stepProgress)

  try {
    const post = await generateContent(buildRequestPayload())
    generatedPost.value = post
    stopAnimation()
    progress.value = 100
    publishState.value = 'published'
    promptValue.value = ''
  } catch (error) {
    stopAnimation()
    progress.value = 0
    publishState.value = 'idle'
    errorMessage.value = error?.message || '生成失败，请稍后重试'
    console.error('[generateContent] failed:', error)
  }
}

const copyPublishLink = async () => {
  if (!navigator.clipboard?.writeText) return

  try {
    await navigator.clipboard.writeText(publishLink)
  } catch (error) {
    console.error(error)
  }
}

onBeforeUnmount(() => {
  stopAnimation()
})
</script>
