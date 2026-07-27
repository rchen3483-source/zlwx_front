<template>
  <section class="auth-page">
    <video
      ref="bgVideo"
      class="auth-bg-video"
      src="/assets/login-bg.mp4"
      autoplay
      loop
      muted
      playsinline
      preload="auto"
      tabindex="-1"
      aria-hidden="true"
    ></video>

    <button
      class="auth-sound-toggle"
      type="button"
      :aria-pressed="!isMuted"
      :title="isMuted ? '开启背景音' : '关闭背景音'"
      @click="toggleSound"
    >
      <span class="auth-sound-icon" aria-hidden="true">{{ isMuted ? '🔇' : '🔊' }}</span>
      <span>{{ isMuted ? '声音已关闭' : '声音已开启' }}</span>
    </button>

    <div class="auth-shell">
      <section class="auth-hero">
        <img class="auth-hero-logo" src="/assets/login-white-logo.png" alt="智旅云宣标志" />

        <div class="auth-copy">
          <span class="auth-kicker">AI Tourism Studio</span>
          <h1>
            <span class="auth-title-line">智旅云宣</span>
            <span class="auth-title-line">景区多平台运营智能助手</span>
          </h1>
          <p>面向景区、场馆与文旅运营团队的内容生产工作台，统一完成图文创作、热点借鉴、数据跟踪与发布协同。</p>
        </div>
      </section>

      <section class="auth-panel">
        <div class="auth-panel-top">
          <span class="auth-panel-tag">Welcome Back</span>
          <h2>账号登录</h2>
          <p>完成登录后进入 AI 文宣助手首页。</p>
        </div>

        <form class="auth-form" @submit.prevent="handleLogin">
          <label class="auth-field">
            <span>账号</span>
            <input
              v-model.trim="form.username"
              type="text"
              name="username"
              autocomplete="username"
              placeholder="请输入账号"
            />
          </label>

          <label class="auth-field">
            <span>密码</span>
            <input
              v-model.trim="form.password"
              type="password"
              name="password"
              autocomplete="current-password"
              placeholder="请输入密码"
            />
          </label>

          <div class="auth-row">
            <label class="auth-checkbox">
              <input v-model="rememberMe" type="checkbox" />
              <span>记住当前账号</span>
            </label>
            <button class="auth-link-btn" type="button">忘记密码</button>
          </div>

          <p v-if="errorMessage" class="auth-error">{{ errorMessage }}</p>

          <button class="auth-submit" type="submit" :disabled="isSubmitting">
            <span>{{ isSubmitting ? '登录中...' : '登录并进入首页' }}</span>
          </button>
        </form>
      </section>
    </div>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const form = reactive({
  username: '',
  password: ''
})

const rememberMe = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

const bgVideo = ref(null)
// 默认关闭声音：静音也是浏览器允许自动播放的前提
const isMuted = ref(true)

onMounted(() => {
  const video = bgVideo.value
  if (!video) return
  video.muted = true
  // 部分浏览器会拒绝自动播放的 Promise，忽略即可，海报层仍可见
  video.play?.().catch(() => {})
})

const toggleSound = () => {
  const video = bgVideo.value
  if (!video) return

  const nextMuted = !isMuted.value
  video.muted = nextMuted
  isMuted.value = nextMuted

  // 开启声音时若视频被暂停（自动播放被拦截），借用户这次点击手势恢复播放
  if (!nextMuted && video.paused) {
    video.play?.().catch(() => {})
  }
}

const resolveRedirect = () => {
  if (typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')) {
    return route.query.redirect
  }

  return '/'
}

const handleLogin = async () => {
  if (!form.username || !form.password) {
    errorMessage.value = '请输入账号和密码后再继续登录'
    return
  }

  errorMessage.value = ''
  isSubmitting.value = true

  await new Promise((resolve) => window.setTimeout(resolve, 900))

  userStore.setUser({
    username: form.username,
    avatar: ''
  })
  userStore.setToken(`mock-token-${Date.now()}`)

  await router.replace(resolveRedirect())
  isSubmitting.value = false
}
</script>
