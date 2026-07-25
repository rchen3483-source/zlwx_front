<script setup>
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { trendRecommendations } from '@/api/mockData.js'
import { searchViralPosts } from '@/api/publish.js'

const router = useRouter()

const xiaohongshu = ref(false)
const douyin = ref(false)
const wechat = ref(false)
const bilibili = ref(false)
const materialText = ref('')
const isDragOver = ref(false)
const selectedImages = ref([])
const trendVisible = ref(false)
const trendCardsVisible = ref(false)
const fileInput = ref(null)

// 搜索相关状态
const searchLoading = ref(false)
const searchError = ref('')
const searchKeywords = ref([])
const viralPosts = ref([])

const appendFiles = (files) => {
  const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'))

  if (!imageFiles.length) {
    return
  }

  const nextImages = imageFiles.map((file, index) => ({
    id: `${file.name}-${file.lastModified}-${index}`,
    name: file.name,
    url: URL.createObjectURL(file)
  }))

  selectedImages.value = [...selectedImages.value, ...nextImages]
}

const openFilePicker = () => {
  fileInput.value?.click()
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

  if (target) {
    URL.revokeObjectURL(target.url)
  }

  selectedImages.value = selectedImages.value.filter((item) => item.id !== imageId)
}

const showTrends = async () => {
  const topic = materialText.value.trim()

  if (!topic) {
    searchError.value = '请输入文本资料'
    return
  }

  searchLoading.value = true
  searchError.value = ''

  try {
    const response = await searchViralPosts({
      scenario_code: 'xiaohongshu',
      topic
    })

    searchKeywords.value = response.keywords || []
    viralPosts.value = response.items || []

    // 后端暂未实现真实搜索，降级使用 mock 数据
    if (!viralPosts.value.length) {
      searchKeywords.value = [topic, '旅行攻略', '小红书种草', '打卡推荐']
      viralPosts.value = trendRecommendations.map((item) => ({
        ...item,
        content: item.copy,
        likes: 1200,
        comments: 86
      }))
    }

    // 触发原有的展开动画
    if (!trendVisible.value) {
      trendVisible.value = true
      await nextTick()
      requestAnimationFrame(() => {
        trendCardsVisible.value = true
      })
      return
    }

    trendCardsVisible.value = false
    await nextTick()
    requestAnimationFrame(() => {
      trendCardsVisible.value = true
    })
  } catch (error) {
    searchError.value = error?.message || '检索失败，请重试'
    console.error('[searchViralPosts] failed:', error)
  } finally {
    searchLoading.value = false
  }
}

const goToInspiration = (item) => {
  router.push({
    name: 'inspiration',
    query: {
      topic: materialText.value.trim()
    },
    state: {
      reference: {
        title: item.title,
        content: item.content || item.copy || item.title,
        likes: item.likes ?? 1200,
        comments: item.comments ?? 86
      },
      keywords: searchKeywords.value.length
        ? searchKeywords.value
        : [materialText.value.trim()],
      topic: materialText.value.trim()
    }
  })
}

onBeforeUnmount(() => {
  selectedImages.value.forEach((item) => {
    URL.revokeObjectURL(item.url)
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

      <div class="channel-grid">
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/xiaohongshu.png" alt="小红书图标" />
            <strong>小红书</strong>
          </div>
          <input type="checkbox" v-model="xiaohongshu" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/douyin.png" alt="抖音图标" />
            <strong>抖音</strong>
          </div>
          <input type="checkbox" v-model="douyin" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/wechat.png" alt="微信公众号图标" />
            <strong>微信公众号</strong>
          </div>
          <input type="checkbox" v-model="wechat" />
        </label>
        <label class="channel-card">
          <div class="channel-meta">
            <img class="channel-logo-image" src="/assets/bilibili.png" alt="bilibili图标" />
            <strong>bilibili</strong>
          </div>
          <input type="checkbox" v-model="bilibili" />
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
            v-model="materialText"
            class="search-textarea"
            placeholder="开始输入文本资料"
          ></textarea>
        </div>

        <input
          ref="fileInput"
          class="sr-only-input"
          type="file"
          accept="image/*"
          multiple
          @change="handleFileChange"
        />

        <div v-if="selectedImages.length" class="search-upload-list">
          <div v-for="image in selectedImages" :key="image.id" class="search-upload-item">
            <img class="search-upload-thumb" :src="image.url" :alt="image.name" />
            <button class="search-upload-remove" type="button" @click="removeImage(image.id)">×</button>
          </div>
        </div>

        <p class="search-drop-hint">支持直接拖拽图片到这里，或点击“添加图片”选择本地文件</p>

        <div class="search-footer">
          <button class="upload-photo-btn" type="button" @click="openFilePicker">
            <img class="upload-photo-icon-image" src="/assets/upload-photo-icon.png" alt="" aria-hidden="true" />
            <span>添加图片</span>
          </button>

          <div class="search-actions">
            <button
              class="primary-btn"
              type="button"
              @click="showTrends"
              :disabled="searchLoading || !materialText.trim()"
            >
              {{ searchLoading ? '检索中...' : '开始检索' }}
            </button>
          </div>
        </div>

        <p v-if="searchError" class="search-error" style="color: #e74c3c; margin-top: 12px; font-size: 14px;">
          {{ searchError }}
        </p>
      </section>

      <div class="keyword-row" v-if="searchKeywords.length">
        <span class="keyword-label">推荐关键词：</span>
        <span
          v-for="keyword in searchKeywords"
          :key="keyword"
          class="keyword-chip"
        >{{ keyword }}</span>
      </div>

      <div class="section-head trend-head trend-module" :class="{ 'is-visible': trendVisible }">
        <h2>热榜推荐</h2>
        <a href="#">查看更多</a>
      </div>

      <div class="trend-grid trend-module" :class="{ 'is-visible': trendVisible }">
        <article
          v-for="item in (viralPosts.length ? viralPosts : trendRecommendations)"
          :key="item.id"
          class="trend-card card"
          :class="{ 'is-visible': trendCardsVisible }"
        >
          <div class="trend-top">
            <span>{{ item.tag }}</span>
            <strong>{{ item.top }}</strong>
          </div>

          <div class="trend-media">
            <div class="play-badge">▶</div>
            <div class="trend-summary">
              <h3>{{ item.title }}</h3>
              <p>{{ item.meta }}</p>
            </div>
          </div>

          <p class="trend-copy">
            {{ item.copy }}
          </p>

          <img class="trend-photo" :src="item.image" alt="参考图" />

          <div class="trend-actions">
            <button class="secondary-btn" type="button">查看详情</button>
            <button
              class="primary-btn small"
              type="button"
              @click="goToInspiration(item)"
            >
              发布同款
            </button>
          </div>
        </article>
      </div>
    </section>
  </AppLayout>
</template>
