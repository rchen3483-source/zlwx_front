<template>
  <AppLayout>
    <AppTopbar title="首页" />
    <section class="hero-card card">
      <div class="section-head"><h1>新的创作 👋</h1></div>
      <div class="quick-grid">
        <RouterLink to="/publish-article" class="quick-link">
          <article class="quick-item">
            <div class="quick-badge">
              <img class="quick-badge-image" src="/assets/quick-publish-article.png" alt="发布图文图标" />
            </div>
            <div><h3>发布图文</h3><p>生成图文笔记</p></div>
          </article>
        </RouterLink>
        <article class="quick-item">
          <div class="quick-badge">
            <img class="quick-badge-image" src="/assets/quick-publish-video.png" alt="发布视频图标" />
          </div>
          <div><h3>发布视频</h3><p>发布AI一键视频</p></div>
        </article>
      </div>
    </section>
    <section class="stats-layout">
      <article class="card stats-card">
        <div class="section-head metrics-head">
          <div><h2>笔记数据总览 <span class="muted">ⓘ</span></h2><div class="tab-line"></div></div>
          <a href="#">查看详情 ›</a>
        </div>
        <div class="platform-selector" role="radiogroup">
          <span class="platform-selector-label">选择平台</span>
          <label v-for="p in platforms" :key="p.value" class="platform-option" :title="p.label">
            <input type="radio" name="data-platform" :value="p.value" v-model="selectedPlatform" />
            <img :src="p.icon" :alt="p.label" />
            <span class="platform-check">✓</span>
          </label>
        </div>
        <div class="metrics-toolbar">
          <span>{{ currentData.period }}</span>
          <div class="pill-group">
            <button class="pill active">近7日</button><button class="pill">近30日</button>
          </div>
        </div>
        <div class="metric-grid">
          <div
            v-for="(metric, key) in currentData.metrics"
            :key="key"
            class="metric"
            :data-metric-key="key"
          >
            <span class="metric-name">{{ metricNames[key] }}</span>
            <strong v-html="renderValue(metric)"></strong>
            <small v-html="renderChange(metric.change)"></small>
          </div>
        </div>
      </article>

      <article class="card pie-card">
        <div class="section-head">
          <h2>Xxx数据</h2>
          <button class="ghost-btn" aria-label="更多">···</button>
        </div>

        <div class="ring-wrap">
          <div
            class="ring-chart"
            :style="{ '--ring-progress': currentData.summary.score }"
          >
            <div class="ring-inner">
              <strong>{{ currentData.summary.score }}</strong>
              <small>互动指数</small>
            </div>
          </div>
        </div>

        <div class="summary-list">
          <div class="summary-item">
            <span class="summary-label">浏览量</span>
            <strong class="summary-value">{{ currentData.summary.views }}</strong>
          </div>
          <div class="summary-item">
            <span class="summary-label">收藏量</span>
            <strong class="summary-value">{{ currentData.summary.favorites }}</strong>
          </div>
          <div class="summary-item">
            <span class="summary-label">评论数</span>
            <strong class="summary-value">{{ currentData.summary.comments }}</strong>
          </div>
        </div>
      </article>
    </section>

    <section class="recommend-grid">
      <article class="card recommend-card">
        <div class="section-head">
          <h2>热门笔记推荐</h2>
          <a href="#">See More</a>
        </div>

        <div class="list">
          <div class="list-row" v-for="item in hotNotes" :key="item.name">
            <div class="list-meta">
              <div class="thumb" :class="item.thumbClass"></div>
              <span>{{ item.name }}</span>
            </div>
            <span><b class="blue">{{ item.count }}</b> Times/week</span>
          </div>
        </div>
      </article>

      <article class="card recommend-card">
        <div class="section-head">
          <h2>热门视频推荐</h2>
          <a href="#">See More</a>
        </div>

        <div class="list">
          <div class="list-row" v-for="item in hotVideos" :key="item.ip">
            <div class="list-meta">
              <div class="device"></div>
              <span>{{ item.ip }}</span>
            </div>
            <span><b class="green">{{ item.count }}</b> Times/week</span>
          </div>
        </div>
      </article>
    </section>
  </AppLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { platformData } from '@/api/mockData.js'

const platforms = [
  { value: 'xiaohongshu', label: '小红书', icon: '/assets/xiaohongshu.png' },
  { value: 'douyin', label: '抖音', icon: '/assets/douyin.png' },
  { value: 'wechat', label: '微信公众号', icon: '/assets/wechat.png' },
  { value: 'bilibili', label: 'bilibili', icon: '/assets/bilibili.png' }
]

const metricNames = {
  exposure: '曝光数',
  views: '观看数',
  likes: '点赞数',
  comments: '评论数',
  netFollowers: '净涨粉',
  newFollowers: '新增关注',
  coverCtr: '封面点击率',
  completion: '视频完播率',
  favorites: '收藏数',
  shares: '分享数',
  unfollows: '取消关注',
  profileVisitors: '主页访客'
}

const hotNotes = [
  { name: 'Admin', count: 211, thumbClass: 'thumb-1' },
  { name: 'Worker', count: 79, thumbClass: 'thumb-2' },
  { name: 'Auditor', count: 65, thumbClass: 'thumb-3' },
  { name: 'Director', count: 23, thumbClass: 'thumb-4' }
]

const hotVideos = [
  { ip: '236.22.124.62', count: 454 },
  { ip: '31.23.122.14', count: 232 },
  { ip: '73.155.238.124', count: 121 },
  { ip: '230.80.117.8', count: 89 }
]

const selectedPlatform = ref('xiaohongshu')
const currentData = computed(() => platformData[selectedPlatform.value])

const renderValue = (metric) => {
  if (metric.suffix) {
    return `${metric.value} <em>${metric.suffix}</em>`
  }
  return metric.value
}

const renderChange = (change) => {
  if (!change || change === '-') {
    return '环比 -'
  }
  const tone = change.startsWith('+') ? 'red' : 'green'
  return `环比 <b class="${tone}">${change}</b>`
}
</script>
