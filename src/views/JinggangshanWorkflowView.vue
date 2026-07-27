<template>
  <AppLayout mainClass="workflow-demo-page">
    <AppTopbar title="井冈山全流程演示" :showCommandBtn="false" flat />

    <div class="workflow-content">
      <section class="workflow-hero">
        <div class="workflow-hero-copy">
          <div class="workflow-eyebrow">
            <span class="workflow-platform-mark">小红书</span>
            <span class="workflow-status-dot"></span>
            <span>全流程已完成</span>
          </div>
          <h1>从官方讲解词，到可发布的爆款图文</h1>
          <p>
            使用「{{ workflow.request.scenicSpot }}」全流程产物，完整演示热点检索、风格提炼、文案生成、配图生成与质量校验。
          </p>
          <div class="workflow-hero-meta">
            <span>运行：{{ workflow.run.id }}</span>
            <span>{{ workflow.run.sourceLabel }}</span>
            <span>更新于 {{ workflow.run.updatedAt }}</span>
          </div>
        </div>
        <div class="workflow-hero-progress">
          <div class="workflow-progress-ring"><strong>100%</strong><span>生成完成</span></div>
          <div>
            <strong>6 / 6</strong>
            <span>生产环节通过</span>
          </div>
        </div>
      </section>

      <section class="workflow-overview" aria-label="流程数据概览">
        <article v-for="item in workflow.overview" :key="item.label" class="workflow-stat-card">
          <span class="workflow-stat-icon" :class="`is-${item.tone}`"></span>
          <div>
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}<small>{{ item.suffix }}</small></strong>
          </div>
        </article>
      </section>

      <nav class="workflow-stepper" aria-label="内容生产流程">
        <button
          v-for="(stage, index) in workflow.stages"
          :key="stage.id"
          class="workflow-step"
          :class="{ active: activeStage === stage.id, demo: stage.status === 'demo' }"
          type="button"
          @click="goToStage(stage.id)"
        >
          <span class="workflow-step-index">{{ stage.status === 'completed' ? '✓' : index + 1 }}</span>
          <span class="workflow-step-copy"><strong>{{ stage.label }}</strong><small>{{ stage.status === 'demo' ? '仅演示' : '已完成' }}</small></span>
        </button>
      </nav>

      <section id="workflow-input" class="workflow-section" data-stage="input">
        <div class="workflow-section-head">
          <div><span>01 · 输入解析</span><h2>官方讲解词已转为结构化事实包</h2></div>
          <span class="workflow-complete-badge">✓ 无需补充信息</span>
        </div>

        <div class="workflow-input-grid">
          <article class="workflow-card workflow-source-card">
            <div class="workflow-card-title">
              <div><span class="workflow-card-kicker">原始材料</span><h3>{{ workflow.request.scenicSpot }}</h3></div>
              <span class="workflow-file-badge">TXT</span>
            </div>
            <p class="workflow-summary">{{ workflow.request.summary }}</p>
            <dl class="workflow-meta-list">
              <div><dt>目标平台</dt><dd>{{ workflow.run.platform }}</dd></div>
              <div><dt>主题分类</dt><dd>{{ workflow.run.topic }}</dd></div>
              <div><dt>目标受众</dt><dd>{{ workflow.request.audience }}</dd></div>
              <div><dt>建议时长</dt><dd>{{ workflow.request.suggestedDuration }}</dd></div>
            </dl>
            <button class="workflow-text-button" type="button" @click="showGuide = !showGuide">
              {{ showGuide ? '收起讲解词节选' : '查看讲解词节选' }} <span>{{ showGuide ? '↑' : '↓' }}</span>
            </button>
            <p v-if="showGuide" class="workflow-guide-excerpt">{{ workflow.request.guideExcerpt }}</p>
          </article>

          <article class="workflow-card workflow-fact-card">
            <div class="workflow-card-title">
              <div><span class="workflow-card-kicker">Fact Pack</span><h3>26 条可引用事实</h3></div>
              <span class="workflow-safe-badge">事实锁定</span>
            </div>
            <ul class="workflow-fact-list">
              <li v-for="(fact, index) in workflow.request.facts" :key="fact">
                <span>F{{ String(index + 1).padStart(3, '0') }}</span>{{ fact }}
              </li>
            </ul>
            <div class="workflow-guardrail">
              <strong>不可改写边界</strong>
              <p v-for="rule in workflow.request.guardrails" :key="rule">{{ rule }}</p>
            </div>
          </article>
        </div>
      </section>

      <section id="workflow-hotspots" class="workflow-section" data-stage="hotspots">
        <div class="workflow-section-head">
          <div><span>02 · 热点检索与选择</span><h2>近 7 天主题热点榜单</h2></div>
          <span class="workflow-source-note">展示 5 / 23 条本地样本</span>
        </div>

        <div class="workflow-hotspot-layout">
          <article class="workflow-card workflow-ranking-card">
            <div class="workflow-ranking-head">
              <span>排名</span><span>笔记内容</span><span>点赞</span><span>热度</span>
            </div>
            <button
              v-for="item in workflow.hotspots"
              :key="item.rank"
              class="workflow-ranking-row"
              :class="{ selected: previewHotspotRank === item.rank }"
              type="button"
              @click="previewHotspotRank = item.rank"
            >
              <strong class="workflow-rank">{{ String(item.rank).padStart(2, '0') }}</strong>
              <span class="workflow-ranking-title"><strong>{{ item.title }}</strong><small>{{ item.age }} · {{ item.label }}</small></span>
              <span class="workflow-like">♥ {{ formatNumber(item.likes) }}</span>
              <span class="workflow-score">{{ item.score }}</span>
            </button>
          </article>

          <article class="workflow-card workflow-selected-card">
            <div class="workflow-selected-top">
              <span>最终选中爆款</span>
              <strong>{{ workflow.selectedHotspot.score }}</strong>
            </div>
            <div class="workflow-selected-preview">
              <div class="workflow-note-cover">
                <img :src="workflow.images[0].src" alt="井冈山热点笔记示意封面" />
                <span>TOP 1</span>
              </div>
              <div>
                <h3>{{ workflow.selectedHotspot.title }}</h3>
                <p>{{ workflow.selectedHotspot.description }}</p>
                <div class="workflow-note-metrics"><span>@{{ workflow.selectedHotspot.author }}</span><span>♥ {{ formatNumber(workflow.selectedHotspot.likes) }}</span></div>
              </div>
            </div>
            <p class="workflow-selection-reason">{{ workflow.selectedHotspot.reason }}</p>
            <div class="workflow-data-warning">样本数据已脱敏固化；本页面不会访问小红书或刷新实时数据。</div>
          </article>
        </div>
      </section>

      <section id="workflow-style" class="workflow-section" data-stage="style">
        <div class="workflow-section-head">
          <div><span>03 · 爆款特征</span><h2>从选中样本提炼可复用风格</h2></div>
          <span class="workflow-complete-badge">已落入 Markdown</span>
        </div>

        <div class="workflow-style-grid">
          <article class="workflow-card workflow-hook-card">
            <span class="workflow-card-kicker">首屏钩子</span>
            <blockquote>{{ workflow.style.hook }}</blockquote>
            <span class="workflow-estimated-badge">{{ workflow.style.hookSource }}</span>
            <div class="workflow-keywords">
              <span v-for="keyword in workflow.style.keywords" :key="keyword"># {{ keyword }}</span>
            </div>
            <p class="workflow-limitation">{{ workflow.style.limitation }}</p>
          </article>

          <article class="workflow-card workflow-traits-card">
            <div v-for="(trait, index) in workflow.style.traits" :key="trait.label" class="workflow-trait">
              <span>{{ String(index + 1).padStart(2, '0') }}</span>
              <div><strong>{{ trait.label }}</strong><p>{{ trait.value }}</p></div>
            </div>
          </article>

          <article class="workflow-card workflow-plan-card">
            <span class="workflow-card-kicker">内容策略</span>
            <h3>{{ workflow.contentPlan.hook }}</h3>
            <p>{{ workflow.contentPlan.angle }}</p>
            <ol>
              <li v-for="step in workflow.contentPlan.structure" :key="step">{{ step }}</li>
            </ol>
            <div class="workflow-plan-tags"><span>{{ workflow.contentPlan.hookType }}</span><span>{{ workflow.contentPlan.tone }}</span></div>
          </article>
        </div>
      </section>

      <section id="workflow-generation" class="workflow-section" data-stage="generation">
        <div class="workflow-section-head">
          <div><span>04 · 内容生成</span><h2>3 个候选方案，自动择优</h2></div>
          <span class="workflow-complete-badge">C01 已选中</span>
        </div>

        <div class="workflow-candidate-grid">
          <article v-for="candidate in workflow.candidates" :key="candidate.id" class="workflow-card workflow-candidate" :class="{ selected: candidate.selected }">
            <div class="workflow-candidate-top"><span>{{ candidate.id }}</span><strong>{{ candidate.score }}<small>分</small></strong></div>
            <h3>{{ candidate.title }}</h3>
            <p>{{ candidate.reason }}</p>
            <span v-if="candidate.selected" class="workflow-selected-label">✓ 最终采用</span>
          </article>
        </div>

        <div class="workflow-output-grid">
          <article class="workflow-card workflow-phone-card">
            <div class="workflow-phone">
              <div class="workflow-phone-bar"><span>9:41</span><strong>小红书</strong><span>•••</span></div>
              <div class="workflow-phone-image">
                <img :src="activeImage.src" :alt="activeImage.scene" />
                <span>{{ activeImage.label }}</span>
              </div>
              <div class="workflow-phone-body">
                <div class="workflow-phone-author"><span class="workflow-phone-avatar">井</span><strong>井冈山文旅</strong><button type="button">关注</button></div>
                <h3>{{ workflow.finalPost.title }}</h3>
                <p>{{ phoneExcerpt }}</p>
                <div class="workflow-phone-tags">{{ workflow.finalPost.hashtags.join(' ') }}</div>
                <div class="workflow-phone-actions"><span>♡ 赞</span><span>☆ 收藏</span><span>◇ 评论</span></div>
              </div>
            </div>
          </article>

          <article class="workflow-card workflow-final-card">
            <div class="workflow-card-title">
              <div><span class="workflow-card-kicker">最终文案</span><h3>{{ workflow.finalPost.title }}</h3></div>
              <button class="workflow-copy-button" type="button" @click="copyPost">{{ copyLabel }}</button>
            </div>
            <div class="workflow-final-body">{{ workflow.finalPost.body }}</div>
            <div class="workflow-final-tags"><span v-for="tag in workflow.finalPost.hashtags" :key="tag">{{ tag }}</span></div>
            <div class="workflow-generator-meta"><span>文本模型：{{ workflow.finalPost.provider }}</span><span>引用 {{ workflow.finalPost.factIds }} 条事实</span></div>
          </article>
        </div>

        <article class="workflow-card workflow-gallery-card">
          <div class="workflow-card-title">
            <div><span class="workflow-card-kicker">AI 配图</span><h3>3 张竖版场景图已生成</h3></div>
            <span class="workflow-ai-badge">768 × 1024</span>
          </div>
          <div class="workflow-gallery">
            <button v-for="(item, index) in workflow.images" :key="item.id" type="button" :class="{ active: activeImageIndex === index }" @click="activeImageIndex = index">
              <img :src="item.src" :alt="item.scene" />
              <span><strong>{{ item.label }}</strong><small>{{ item.scene }}</small></span>
            </button>
            <div class="workflow-prompt-preview"><span>当前图片提示词</span><p>{{ activeImage.prompt }}</p><small>配图为 AI 生成的景区主题示意图</small></div>
          </div>
        </article>
      </section>

      <section id="workflow-validation" class="workflow-section" data-stage="validation">
        <div class="workflow-section-head">
          <div><span>05 · 质量校验</span><h2>事实、平台规则与原创性校验通过</h2></div>
          <span class="workflow-pass-badge">✓ VALID</span>
        </div>

        <article class="workflow-card workflow-validation-card">
          <div class="workflow-validation-score"><strong>92</strong><span>综合质量分</span><small>推荐发布</small></div>
          <div class="workflow-validation-metrics">
            <div><span>标题字数</span><strong>{{ workflow.validation.titleChars }}</strong><small>平台限制内</small></div>
            <div><span>正文字数</span><strong>{{ workflow.validation.bodyChars }}</strong><small>阅读长度适中</small></div>
            <div><span>话题标签</span><strong>{{ workflow.validation.hashtagCount }}</strong><small>主题高度相关</small></div>
            <div><span>事实覆盖</span><strong>{{ workflow.validation.factCoverage }}%</strong><small>18 条事实已引用</small></div>
          </div>
          <div class="workflow-quality-actions">
            <strong>自动修订记录</strong>
            <p v-for="action in workflow.validation.actions" :key="action"><span>✓</span>{{ action }}</p>
          </div>
        </article>
      </section>

      <section id="workflow-publish" class="workflow-section workflow-publish-section" data-stage="publish">
        <div class="workflow-publish-copy">
          <span class="workflow-demo-label">演示模式</span>
          <h2>内容已准备好，可以进入发布环节</h2>
          <p>本 Demo 不调用真实接口、不使用账号登录态。点击按钮只演示前端状态流转，不会向小红书发送任何内容。</p>
          <div class="workflow-publish-checks"><span>✓ 文案校验通过</span><span>✓ 3 张图片就绪</span><span>✓ 发布授权关闭</span></div>
        </div>
        <div class="workflow-publish-action">
          <button type="button" :disabled="publishState === 'publishing'" @click="startDemoPublish">
            <template v-if="publishState === 'idle'">模拟一键发布 <span>→</span></template>
            <template v-else-if="publishState === 'publishing'">正在演示 {{ Math.round(publishProgress) }}%</template>
            <template v-else>演示完成 <span>✓</span></template>
          </button>
          <div class="workflow-publish-progress"><span :style="{ width: `${publishProgress}%` }"></span></div>
          <small>publishing_authorized: false</small>
        </div>
      </section>
    </div>

    <div v-if="publishState === 'published'" class="workflow-toast" role="status">
      <span>✓</span>
      <div><strong>模拟发布完成</strong><p>仅完成前端演示，未调用真实平台接口。</p></div>
      <button type="button" @click="resetDemoPublish">关闭</button>
    </div>
  </AppLayout>
</template>

<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import workflow from '@/data/jinggangshanWorkflow'

const activeStage = ref('input')
const activeImageIndex = ref(0)
const previewHotspotRank = ref(1)
const showGuide = ref(false)
const copyLabel = ref('复制文案')
const publishState = ref('idle')
const publishProgress = ref(0)
let publishTimer = null

const activeImage = computed(() => workflow.images[activeImageIndex.value])
const phoneExcerpt = computed(() => `${workflow.finalPost.body.slice(0, 128)}…`)

const formatNumber = (value) => new Intl.NumberFormat('zh-CN').format(value)

const goToStage = (stageId) => {
  activeStage.value = stageId
  document.getElementById(`workflow-${stageId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const copyPost = async () => {
  const content = `${workflow.finalPost.title}\n\n${workflow.finalPost.body}\n\n${workflow.finalPost.hashtags.join(' ')}`

  try {
    await navigator.clipboard.writeText(content)
    copyLabel.value = '已复制'
  } catch (_error) {
    copyLabel.value = '复制失败'
  }

  window.setTimeout(() => {
    copyLabel.value = '复制文案'
  }, 1600)
}

const clearPublishTimer = () => {
  if (publishTimer) {
    window.clearInterval(publishTimer)
    publishTimer = null
  }
}

const startDemoPublish = () => {
  if (publishState.value === 'publishing') return
  if (publishState.value === 'published') {
    resetDemoPublish()
    return
  }

  publishState.value = 'publishing'
  publishProgress.value = 8
  clearPublishTimer()
  publishTimer = window.setInterval(() => {
    publishProgress.value = Math.min(publishProgress.value + 8, 100)
    if (publishProgress.value >= 100) {
      clearPublishTimer()
      publishState.value = 'published'
    }
  }, 130)
}

const resetDemoPublish = () => {
  clearPublishTimer()
  publishState.value = 'idle'
  publishProgress.value = 0
}

onBeforeUnmount(clearPublishTimer)
</script>

<style scoped>
.workflow-content {
  --workflow-primary: #5b4df6;
  --workflow-primary-dark: #3326c9;
  --workflow-ink: #182039;
  --workflow-muted: #7b849b;
  --workflow-line: #e8ebf4;
  display: grid;
  gap: 22px;
  width: min(1460px, 100%);
  margin: 0 auto;
  padding-bottom: 48px;
}

.workflow-hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 248px;
  overflow: hidden;
  padding: 42px 48px;
  border-radius: 26px;
  color: #fff;
  background:
    radial-gradient(circle at 85% 20%, rgba(111, 220, 255, 0.42), transparent 28%),
    radial-gradient(circle at 54% 120%, rgba(123, 91, 255, 0.75), transparent 45%),
    linear-gradient(120deg, #161142 0%, #3422b6 48%, #2369dc 100%);
  box-shadow: 0 26px 58px rgba(48, 54, 153, 0.25);
}

.workflow-hero::after {
  position: absolute;
  right: 11%;
  bottom: -112px;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  box-shadow: 0 0 0 42px rgba(255, 255, 255, 0.04), 0 0 0 92px rgba(255, 255, 255, 0.025);
  content: '';
}

.workflow-hero-copy {
  position: relative;
  z-index: 1;
  max-width: 820px;
}

.workflow-eyebrow,
.workflow-hero-meta,
.workflow-publish-checks,
.workflow-generator-meta,
.workflow-note-metrics,
.workflow-plan-tags,
.workflow-keywords,
.workflow-final-tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.workflow-eyebrow {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.82);
}

.workflow-platform-mark {
  padding: 6px 10px;
  border-radius: 8px;
  color: #fff;
  background: #ff2442;
  font-weight: 700;
}

.workflow-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #57f2a4;
  box-shadow: 0 0 0 5px rgba(87, 242, 164, 0.16);
}

.workflow-hero h1 {
  margin: 18px 0 12px;
  font-size: clamp(28px, 3vw, 42px);
  line-height: 1.2;
  letter-spacing: -0.04em;
}

.workflow-hero-copy > p {
  max-width: 760px;
  margin: 0;
  color: rgba(255, 255, 255, 0.74);
  font-size: 16px;
  line-height: 1.8;
}

.workflow-hero-meta {
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.58);
  font-size: 12px;
}

.workflow-hero-meta span + span::before {
  margin-right: 10px;
  content: '·';
}

.workflow-hero-progress {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 18px;
  min-width: 285px;
  padding-left: 30px;
}

.workflow-hero-progress > div:last-child {
  display: grid;
  gap: 4px;
}

.workflow-hero-progress > div:last-child strong {
  font-size: 24px;
}

.workflow-hero-progress > div:last-child span {
  color: rgba(255, 255, 255, 0.62);
  font-size: 12px;
}

.workflow-progress-ring {
  display: grid;
  place-content: center;
  width: 116px;
  height: 116px;
  border: 8px solid rgba(255, 255, 255, 0.16);
  border-top-color: #64efbb;
  border-right-color: #64efbb;
  border-radius: 50%;
  text-align: center;
  transform: rotate(2deg);
}

.workflow-progress-ring strong,
.workflow-progress-ring span {
  transform: rotate(-2deg);
}

.workflow-progress-ring strong {
  font-size: 25px;
}

.workflow-progress-ring span {
  margin-top: 4px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 11px;
}

.workflow-overview {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.workflow-stat-card,
.workflow-card {
  border: 1px solid rgba(224, 229, 242, 0.92);
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 16px 42px rgba(57, 76, 137, 0.08);
  backdrop-filter: blur(14px);
}

.workflow-stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 104px;
  padding: 20px 22px;
  border-radius: 18px;
}

.workflow-stat-icon {
  width: 12px;
  height: 48px;
  border-radius: 99px;
  background: #4f86ff;
  box-shadow: 0 6px 18px rgba(79, 134, 255, 0.24);
}

.workflow-stat-icon.is-purple { background: #7d5cff; box-shadow: 0 6px 18px rgba(125, 92, 255, 0.24); }
.workflow-stat-icon.is-orange { background: #ff9d43; box-shadow: 0 6px 18px rgba(255, 157, 67, 0.24); }
.workflow-stat-icon.is-green { background: #35c98b; box-shadow: 0 6px 18px rgba(53, 201, 139, 0.24); }

.workflow-stat-card > div {
  display: grid;
  gap: 3px;
}

.workflow-stat-card div > span {
  color: var(--workflow-muted);
  font-size: 13px;
}

.workflow-stat-card strong {
  color: var(--workflow-ink);
  font-size: 28px;
}

.workflow-stat-card small {
  margin-left: 4px;
  color: #9aa2b5;
  font-size: 12px;
  font-weight: 500;
}

.workflow-stepper {
  position: sticky;
  top: 12px;
  z-index: 9;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  overflow: hidden;
  padding: 8px;
  border: 1px solid rgba(225, 229, 240, 0.96);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 14px 36px rgba(45, 59, 110, 0.1);
  backdrop-filter: blur(16px);
}

.workflow-step {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  min-height: 58px;
  padding: 8px;
  border: 0;
  border-radius: 12px;
  color: #7c8497;
  background: transparent;
  cursor: pointer;
}

.workflow-step:not(:last-child)::after {
  position: absolute;
  right: -3px;
  width: 6px;
  height: 6px;
  border-top: 1px solid #cfd4e1;
  border-right: 1px solid #cfd4e1;
  content: '';
  transform: rotate(45deg);
}

.workflow-step.active {
  color: #fff;
  background: linear-gradient(135deg, #6e55ff, #495df6);
  box-shadow: 0 9px 20px rgba(88, 79, 245, 0.25);
}

.workflow-step.demo:not(.active) {
  color: #c17a16;
  background: #fff8e8;
}

.workflow-step-index {
  display: grid;
  place-content: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  color: #4d7dff;
  background: #eef3ff;
  font-size: 12px;
  font-weight: 800;
}

.workflow-step.active .workflow-step-index {
  color: #5549ef;
  background: #fff;
}

.workflow-step-copy {
  display: grid;
  gap: 2px;
  text-align: left;
}

.workflow-step-copy strong { font-size: 12px; }
.workflow-step-copy small { opacity: 0.65; font-size: 10px; }

.workflow-section {
  scroll-margin-top: 92px;
  padding-top: 14px;
}

.workflow-section-head,
.workflow-card-title,
.workflow-selected-top,
.workflow-candidate-top,
.workflow-phone-author,
.workflow-phone-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.workflow-section-head {
  margin-bottom: 16px;
}

.workflow-section-head > div > span,
.workflow-card-kicker {
  color: #7267ed;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.workflow-section-head h2 {
  margin: 5px 0 0;
  color: var(--workflow-ink);
  font-size: 23px;
  letter-spacing: -0.025em;
}

.workflow-complete-badge,
.workflow-pass-badge,
.workflow-source-note,
.workflow-safe-badge,
.workflow-ai-badge,
.workflow-file-badge,
.workflow-estimated-badge,
.workflow-selected-label,
.workflow-demo-label {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 7px 11px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}

.workflow-complete-badge,
.workflow-pass-badge,
.workflow-safe-badge,
.workflow-selected-label {
  color: #16855b;
  background: #e9fbf3;
}

.workflow-source-note {
  color: #667085;
  background: #edf0f5;
}

.workflow-card {
  border-radius: 20px;
}

.workflow-input-grid,
.workflow-hotspot-layout,
.workflow-output-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(360px, 0.84fr);
  gap: 18px;
}

.workflow-source-card,
.workflow-fact-card,
.workflow-ranking-card,
.workflow-selected-card,
.workflow-hook-card,
.workflow-traits-card,
.workflow-plan-card,
.workflow-candidate,
.workflow-final-card,
.workflow-gallery-card {
  padding: 24px;
}

.workflow-card-title h3 {
  margin: 5px 0 0;
  color: var(--workflow-ink);
  font-size: 18px;
}

.workflow-file-badge {
  color: #5c51ef;
  background: #eeebff;
}

.workflow-summary {
  margin: 20px 0;
  color: #596277;
  font-size: 14px;
  line-height: 1.75;
}

.workflow-meta-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.workflow-meta-list > div {
  padding: 13px 14px;
  border-radius: 12px;
  background: #f7f8fc;
}

.workflow-meta-list dt {
  margin-bottom: 5px;
  color: #9aa2b3;
  font-size: 11px;
}

.workflow-meta-list dd {
  margin: 0;
  color: #343c50;
  font-size: 13px;
  font-weight: 600;
}

.workflow-text-button,
.workflow-copy-button {
  padding: 0;
  border: 0;
  color: #5b51eb;
  background: transparent;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.workflow-text-button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid var(--workflow-line);
}

.workflow-guide-excerpt {
  margin: 14px 0 0;
  padding: 15px;
  border-left: 3px solid #7867ef;
  border-radius: 0 10px 10px 0;
  color: #5d6576;
  background: #f7f6ff;
  font-size: 13px;
  line-height: 1.8;
}

.workflow-fact-list {
  display: grid;
  gap: 10px;
  margin: 18px 0;
  padding: 0;
  list-style: none;
}

.workflow-fact-list li {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 8px;
  color: #4f586d;
  font-size: 12px;
  line-height: 1.45;
}

.workflow-fact-list li span {
  color: #7d72ed;
  font-size: 10px;
  font-weight: 800;
}

.workflow-guardrail {
  padding: 14px 16px;
  border: 1px solid #ffe8c8;
  border-radius: 13px;
  background: #fffaf1;
}

.workflow-guardrail strong {
  color: #a55c00;
  font-size: 12px;
}

.workflow-guardrail p {
  margin: 7px 0 0;
  color: #8b6b43;
  font-size: 11px;
  line-height: 1.5;
}

.workflow-ranking-card {
  padding: 8px 12px;
}

.workflow-ranking-head,
.workflow-ranking-row {
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr) 98px 64px;
  align-items: center;
  gap: 10px;
}

.workflow-ranking-head {
  padding: 12px 14px;
  color: #9da4b4;
  font-size: 10px;
}

.workflow-ranking-row {
  width: 100%;
  min-height: 66px;
  padding: 10px 14px;
  border: 0;
  border-top: 1px solid #eef0f5;
  border-radius: 11px;
  color: #596176;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.workflow-ranking-row:hover,
.workflow-ranking-row.selected {
  background: #f5f3ff;
}

.workflow-ranking-row.selected {
  box-shadow: inset 3px 0 #6659ee;
}

.workflow-rank {
  color: #9fa6b6;
  font-size: 15px;
}

.workflow-ranking-row:first-of-type .workflow-rank { color: #ff6e38; }

.workflow-ranking-title {
  display: grid;
  gap: 5px;
  min-width: 0;
}

.workflow-ranking-title strong {
  overflow: hidden;
  color: #30384d;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workflow-ranking-title small { color: #a0a7b6; font-size: 10px; }
.workflow-like { font-size: 11px; color: #8f96a7; }
.workflow-score { color: #5649e7; font-size: 15px; font-weight: 800; }

.workflow-selected-card {
  display: grid;
  align-content: start;
  gap: 18px;
  color: #fff;
  background:
    radial-gradient(circle at 90% 10%, rgba(96, 214, 255, 0.35), transparent 30%),
    linear-gradient(145deg, #291f77, #3f45ca 68%, #2378cf);
}

.workflow-selected-top > span { color: rgba(255, 255, 255, 0.72); font-size: 12px; }
.workflow-selected-top > strong { font-size: 34px; }
.workflow-selected-top > strong::after { content: ' 分'; font-size: 11px; font-weight: 500; }

.workflow-selected-preview {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr);
  align-items: center;
  gap: 16px;
}

.workflow-note-cover {
  position: relative;
  overflow: hidden;
  height: 142px;
  border-radius: 13px;
  background: #dfe5ee;
}

.workflow-note-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.workflow-note-cover span {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 6px;
  border-radius: 6px;
  background: #ff3350;
  font-size: 9px;
  font-weight: 800;
}

.workflow-selected-preview h3 { margin: 0 0 9px; font-size: 17px; line-height: 1.5; }
.workflow-selected-preview p { margin: 0 0 14px; color: rgba(255,255,255,.65); font-size: 11px; }
.workflow-note-metrics { color: rgba(255,255,255,.75); font-size: 10px; }
.workflow-selection-reason { margin: 0; color: rgba(255,255,255,.76); font-size: 12px; line-height: 1.7; }
.workflow-data-warning { padding: 11px 13px; border: 1px solid rgba(255,255,255,.14); border-radius: 10px; color: rgba(255,255,255,.58); background: rgba(255,255,255,.06); font-size: 10px; }

.workflow-style-grid {
  display: grid;
  grid-template-columns: 0.9fr 1fr 1.1fr;
  gap: 18px;
}

.workflow-hook-card blockquote {
  margin: 18px 0 12px;
  color: #252d43;
  font-size: 21px;
  font-weight: 800;
  line-height: 1.55;
}

.workflow-estimated-badge { color: #82754f; background: #fff6d9; }
.workflow-keywords { margin-top: 22px; }
.workflow-keywords span,
.workflow-final-tags span,
.workflow-plan-tags span {
  padding: 7px 10px;
  border-radius: 8px;
  color: #6258dd;
  background: #efedff;
  font-size: 11px;
  font-weight: 700;
}

.workflow-limitation {
  margin: 18px 0 0;
  padding-top: 15px;
  border-top: 1px solid var(--workflow-line);
  color: #979eae;
  font-size: 10px;
  line-height: 1.6;
}

.workflow-traits-card {
  display: grid;
  gap: 15px;
}

.workflow-trait {
  display: grid;
  grid-template-columns: 34px 1fr;
  gap: 11px;
}

.workflow-trait > span {
  display: grid;
  place-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  color: #6559ec;
  background: #f0eeff;
  font-size: 10px;
  font-weight: 800;
}

.workflow-trait strong { color: #31394e; font-size: 12px; }
.workflow-trait p { margin: 4px 0 0; color: #858da0; font-size: 11px; line-height: 1.5; }

.workflow-plan-card {
  color: #fff;
  background: linear-gradient(145deg, #523fd8, #755cf2);
}

.workflow-plan-card .workflow-card-kicker { color: rgba(255,255,255,.62); }
.workflow-plan-card h3 { margin: 16px 0 10px; font-size: 19px; line-height: 1.5; }
.workflow-plan-card > p { margin: 0; color: rgba(255,255,255,.72); font-size: 11px; line-height: 1.65; }
.workflow-plan-card ol { display: grid; gap: 8px; margin: 18px 0; padding-left: 20px; color: rgba(255,255,255,.82); font-size: 11px; line-height: 1.5; }
.workflow-plan-tags span { color: #fff; background: rgba(255,255,255,.14); }

.workflow-candidate-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 18px;
}

.workflow-candidate {
  position: relative;
  min-height: 182px;
  overflow: hidden;
}

.workflow-candidate.selected {
  border-color: #7770ef;
  box-shadow: 0 16px 38px rgba(91, 78, 227, 0.16);
}

.workflow-candidate.selected::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #6b5ef4, #4f90f8);
  content: '';
}

.workflow-candidate-top > span { color: #7d72ea; font-size: 11px; font-weight: 800; }
.workflow-candidate-top strong { color: #5b4ceb; font-size: 25px; }
.workflow-candidate-top small { margin-left: 2px; color: #9ba2b1; font-size: 9px; }
.workflow-candidate h3 { margin: 15px 0 9px; color: #2e364b; font-size: 15px; line-height: 1.5; }
.workflow-candidate p { margin: 0; color: #858d9e; font-size: 11px; line-height: 1.6; }
.workflow-selected-label { margin-top: 14px; }

.workflow-output-grid {
  grid-template-columns: 390px minmax(0, 1fr);
  align-items: stretch;
}

.workflow-phone-card {
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(145deg, #eceeff, #f8f8ff);
}

.workflow-phone {
  width: 326px;
  overflow: hidden;
  border: 8px solid #16182a;
  border-radius: 34px;
  background: #fff;
  box-shadow: 0 24px 46px rgba(40, 45, 88, 0.23);
}

.workflow-phone-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 44px;
  padding: 0 16px;
  color: #272b37;
  font-size: 9px;
}

.workflow-phone-bar strong { font-size: 12px; }

.workflow-phone-image {
  position: relative;
  height: 386px;
  overflow: hidden;
  background: #e8ebef;
}

.workflow-phone-image img { width: 100%; height: 100%; object-fit: cover; }
.workflow-phone-image > span { position: absolute; right: 10px; bottom: 10px; padding: 5px 8px; border-radius: 8px; color: #fff; background: rgba(24,26,37,.58); font-size: 9px; backdrop-filter: blur(7px); }

.workflow-phone-body { padding: 14px 15px 16px; }
.workflow-phone-author { justify-content: flex-start; gap: 8px; }
.workflow-phone-avatar { display: grid; place-content: center; width: 25px; height: 25px; border-radius: 50%; color: #fff; background: #e33d44; font-size: 10px; }
.workflow-phone-author strong { font-size: 10px; }
.workflow-phone-author button { margin-left: auto; padding: 4px 9px; border: 1px solid #ff3150; border-radius: 7px; color: #ff3150; background: #fff; font-size: 9px; }
.workflow-phone-body h3 { margin: 12px 0 7px; color: #242833; font-size: 13px; }
.workflow-phone-body > p { display: -webkit-box; overflow: hidden; margin: 0; color: #555b69; font-size: 9px; line-height: 1.65; -webkit-box-orient: vertical; -webkit-line-clamp: 4; }
.workflow-phone-tags { margin-top: 7px; color: #315692; font-size: 8px; line-height: 1.5; }
.workflow-phone-actions { margin-top: 11px; padding-top: 9px; border-top: 1px solid #f0f1f4; color: #737987; font-size: 9px; }

.workflow-final-card { min-height: 100%; }
.workflow-copy-button { padding: 8px 12px; border-radius: 9px; background: #f0eeff; }
.workflow-final-body { overflow: auto; max-height: 540px; margin-top: 20px; padding: 18px; border-radius: 14px; color: #4c5569; background: #f8f9fc; font-size: 13px; line-height: 1.85; white-space: pre-line; }
.workflow-final-tags { margin-top: 17px; }
.workflow-generator-meta { justify-content: space-between; margin-top: 18px; padding-top: 14px; border-top: 1px solid var(--workflow-line); color: #9ba2b0; font-size: 10px; }

.workflow-gallery-card { margin-top: 18px; }
.workflow-ai-badge { color: #3b74be; background: #e9f4ff; }
.workflow-gallery { display: grid; grid-template-columns: repeat(3, 170px) minmax(240px, 1fr); gap: 14px; margin-top: 18px; }
.workflow-gallery > button { overflow: hidden; padding: 0; border: 2px solid transparent; border-radius: 14px; background: #f3f4f8; text-align: left; cursor: pointer; }
.workflow-gallery > button.active { border-color: #6d60f1; box-shadow: 0 8px 24px rgba(103,89,237,.18); }
.workflow-gallery img { display: block; width: 100%; height: 172px; object-fit: cover; }
.workflow-gallery button > span { display: grid; gap: 3px; padding: 10px; }
.workflow-gallery button strong { color: #343b4d; font-size: 11px; }
.workflow-gallery button small { color: #9299a8; font-size: 9px; }
.workflow-prompt-preview { padding: 20px; border-radius: 14px; background: #f7f6ff; }
.workflow-prompt-preview > span { color: #7468ed; font-size: 10px; font-weight: 800; }
.workflow-prompt-preview p { margin: 13px 0; color: #5f6778; font-size: 12px; line-height: 1.7; }
.workflow-prompt-preview small { color: #9c92be; font-size: 9px; }

.workflow-validation-card {
  display: grid;
  grid-template-columns: 190px minmax(420px, 1fr) minmax(300px, .8fr);
  align-items: stretch;
  overflow: hidden;
}

.workflow-validation-score {
  display: grid;
  place-content: center;
  min-height: 190px;
  color: #fff;
  background: linear-gradient(145deg, #2a9c73, #39c790);
  text-align: center;
}

.workflow-validation-score strong { font-size: 52px; line-height: 1; }
.workflow-validation-score span { margin-top: 8px; font-size: 11px; }
.workflow-validation-score small { width: fit-content; margin: 9px auto 0; padding: 4px 8px; border-radius: 99px; background: rgba(255,255,255,.16); font-size: 9px; }

.workflow-validation-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1px;
  padding: 20px;
  background: var(--workflow-line);
}

.workflow-validation-metrics > div { display: grid; align-content: center; gap: 4px; padding: 15px; background: #fff; }
.workflow-validation-metrics span { color: #9097a8; font-size: 10px; }
.workflow-validation-metrics strong { color: #30384d; font-size: 20px; }
.workflow-validation-metrics small { color: #9ba3b1; font-size: 9px; }

.workflow-quality-actions { display: grid; align-content: center; gap: 10px; padding: 22px; }
.workflow-quality-actions > strong { color: #374055; font-size: 12px; }
.workflow-quality-actions p { display: grid; grid-template-columns: 18px 1fr; gap: 6px; margin: 0; color: #7e8697; font-size: 10px; line-height: 1.5; }
.workflow-quality-actions p span { color: #26b57c; font-weight: 800; }

.workflow-publish-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  align-items: center;
  gap: 36px;
  overflow: hidden;
  padding: 34px 38px;
  border: 1px solid #e7e1ff;
  border-radius: 24px;
  background:
    radial-gradient(circle at 90% 120%, rgba(113, 92, 246, .16), transparent 35%),
    linear-gradient(135deg, #fff 0%, #f8f6ff 100%);
  box-shadow: 0 18px 44px rgba(79, 68, 172, .09);
}

.workflow-demo-label { color: #a5630c; background: #fff1d6; }
.workflow-publish-copy h2 { margin: 13px 0 9px; color: #292f43; font-size: 24px; }
.workflow-publish-copy > p { max-width: 720px; margin: 0; color: #7d8495; font-size: 12px; line-height: 1.7; }
.workflow-publish-checks { margin-top: 18px; color: #4f776a; font-size: 10px; }

.workflow-publish-action { display: grid; gap: 9px; }
.workflow-publish-action > button { display: flex; align-items: center; justify-content: space-between; min-height: 54px; padding: 0 20px; border: 0; border-radius: 14px; color: #fff; background: linear-gradient(105deg, #6452ef, #3d79ef); box-shadow: 0 12px 25px rgba(77, 84, 226, .25); font-size: 13px; font-weight: 800; cursor: pointer; }
.workflow-publish-action > button:disabled { cursor: wait; opacity: .8; }
.workflow-publish-progress { overflow: hidden; height: 4px; border-radius: 99px; background: #e6e4f4; }
.workflow-publish-progress span { display: block; height: 100%; border-radius: inherit; background: #6656ef; transition: width .12s linear; }
.workflow-publish-action small { color: #a39db8; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 9px; text-align: center; }

.workflow-toast {
  position: fixed;
  z-index: 40;
  right: 30px;
  bottom: 28px;
  display: grid;
  grid-template-columns: 38px 1fr auto;
  align-items: center;
  gap: 12px;
  min-width: 390px;
  padding: 16px;
  border: 1px solid #dbe5e0;
  border-radius: 16px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 20px 50px rgba(38, 57, 75, .2);
  backdrop-filter: blur(14px);
}

.workflow-toast > span { display: grid; place-content: center; width: 36px; height: 36px; border-radius: 50%; color: #fff; background: #31ba82; font-weight: 800; }
.workflow-toast strong { color: #30384a; font-size: 12px; }
.workflow-toast p { margin: 4px 0 0; color: #939aa9; font-size: 10px; }
.workflow-toast button { border: 0; color: #7569eb; background: transparent; font-size: 11px; font-weight: 700; cursor: pointer; }

@media (max-width: 1280px) {
  .workflow-hero-progress { min-width: 240px; }
  .workflow-style-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workflow-plan-card { grid-column: 1 / -1; }
  .workflow-gallery { grid-template-columns: repeat(3, minmax(120px, 1fr)); }
  .workflow-prompt-preview { grid-column: 1 / -1; }
  .workflow-validation-card { grid-template-columns: 170px 1fr; }
  .workflow-quality-actions { grid-column: 1 / -1; border-top: 1px solid var(--workflow-line); }
  .workflow-step-copy small { display: none; }
}

@media (max-width: 1050px) {
  .workflow-hero { align-items: flex-start; padding: 34px; }
  .workflow-hero-progress { display: none; }
  .workflow-overview { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .workflow-input-grid,
  .workflow-hotspot-layout,
  .workflow-output-grid { grid-template-columns: 1fr; }
  .workflow-candidate-grid { grid-template-columns: 1fr; }
  .workflow-candidate { min-height: auto; }
  .workflow-step-copy { display: none; }
  .workflow-phone-card { padding: 32px; }
  .workflow-publish-section { grid-template-columns: 1fr; }
}

@media (max-width: 760px) {
  .workflow-content { gap: 16px; }
  .workflow-hero { min-height: auto; padding: 28px 22px; border-radius: 20px; }
  .workflow-hero h1 { font-size: 28px; }
  .workflow-hero-copy > p { font-size: 13px; }
  .workflow-hero-meta span { width: 100%; }
  .workflow-hero-meta span + span::before { display: none; }
  .workflow-overview { grid-template-columns: 1fr 1fr; }
  .workflow-stat-card { min-height: 90px; padding: 15px; }
  .workflow-stat-card strong { font-size: 23px; }
  .workflow-stepper { overflow-x: auto; grid-template-columns: repeat(7, 50px); justify-content: start; }
  .workflow-step { min-height: 48px; }
  .workflow-step-index { width: 24px; height: 24px; }
  .workflow-section-head { align-items: flex-start; flex-direction: column; }
  .workflow-section-head h2 { font-size: 20px; }
  .workflow-source-card,
  .workflow-fact-card,
  .workflow-selected-card,
  .workflow-hook-card,
  .workflow-traits-card,
  .workflow-plan-card,
  .workflow-candidate,
  .workflow-final-card,
  .workflow-gallery-card { padding: 18px; }
  .workflow-meta-list { grid-template-columns: 1fr; }
  .workflow-ranking-card { overflow-x: auto; }
  .workflow-ranking-head,
  .workflow-ranking-row { min-width: 620px; }
  .workflow-selected-preview { grid-template-columns: 86px 1fr; }
  .workflow-note-cover { height: 112px; }
  .workflow-style-grid { grid-template-columns: 1fr; }
  .workflow-plan-card { grid-column: auto; }
  .workflow-phone { width: min(326px, 100%); }
  .workflow-phone-image { height: 340px; }
  .workflow-gallery { grid-template-columns: 1fr 1fr; }
  .workflow-gallery > button:last-of-type { grid-column: 1 / -1; }
  .workflow-prompt-preview { grid-column: 1 / -1; }
  .workflow-validation-card { grid-template-columns: 1fr; }
  .workflow-validation-metrics { grid-template-columns: 1fr 1fr; }
  .workflow-publish-section { padding: 25px 20px; }
  .workflow-toast { right: 14px; bottom: 14px; left: 14px; min-width: 0; }
}
</style>
