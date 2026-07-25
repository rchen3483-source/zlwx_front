<template>
  <AppLayout mainClass="note-tracking-page">
    <AppTopbar title="笔记数据跟踪" flat />

    <section class="note-tracking-shell">
      <div class="block-head">
        <h2>平台选择</h2>
      </div>

      <div class="note-platform-grid" role="radiogroup" aria-label="选择查看平台">
        <label v-for="platform in platforms" :key="platform.value" class="note-platform-card">
          <input v-model="selectedPlatform" type="radio" name="note-platform" :value="platform.value" />
          <div class="note-platform-meta">
            <img class="note-platform-logo" :src="platform.icon" :alt="`${platform.label}图标`" />
            <strong>{{ platform.label }}</strong>
          </div>
          <span class="note-platform-check" aria-hidden="true"></span>
        </label>
      </div>

      <div class="block-head block-head-spaced">
        <h2>笔记查看</h2>
      </div>

      <div class="note-card-grid">
        <article v-for="item in currentNotes" :key="item.id" class="note-card card">
          <div class="note-card-head">
            <div class="note-card-thumb"></div>
            <div class="note-card-copy">
              <h3>{{ item.title }}</h3>
              <p class="note-card-meta">{{ item.meta }}</p>
              <p class="note-card-date">{{ item.date }}</p>
            </div>
          </div>
          <p class="note-card-desc">
            {{ item.desc }}
          </p>
          <div class="note-card-stats">
            <span v-for="stat in item.stats" :key="stat">{{ stat }}</span>
          </div>
          <button class="note-card-action" type="button">查看详情数据</button>
        </article>
      </div>
    </section>
  </AppLayout>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { noteTrackingData } from '@/api/mockData.js'

const platforms = [
  { value: 'xiaohongshu', label: '小红书', icon: '/assets/xiaohongshu.png' },
  { value: 'douyin', label: '抖音', icon: '/assets/douyin.png' },
  { value: 'wechat', label: '微信公众号', icon: '/assets/wechat.png' },
  { value: 'bilibili', label: 'bilibili', icon: '/assets/bilibili.png' }
]

const selectedPlatform = ref('xiaohongshu')
const currentNotes = computed(() => noteTrackingData[selectedPlatform.value] ?? [])
</script>
