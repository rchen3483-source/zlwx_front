<template>
  <section class="auth-page">
    <div class="auth-aurora auth-aurora-one"></div>
    <div class="auth-aurora auth-aurora-two"></div>
    <div class="auth-aurora auth-aurora-three"></div>
    <div class="auth-grid"></div>

    <div class="auth-shell">
      <section class="auth-hero">
        <div class="auth-brand">
          <img class="auth-brand-logo" src="/assets/brand-logo.png" alt="智旅文宣" />
          <span>智旅文宣</span>
        </div>

        <div class="auth-copy">
          <span class="auth-kicker">AI Tourism Studio</span>
          <h1>登录后进入 AI 文宣助手主界面</h1>
          <p>面向景区、场馆与文旅运营团队的内容生产工作台，统一完成图文创作、热点借鉴、数据跟踪与发布协同。</p>
        </div>

        <div class="auth-feature-list">
          <div class="auth-feature-card">
            <strong>智能创作</strong>
            <p>图文笔记、热点借鉴与发布流程统一串联。</p>
          </div>
          <div class="auth-feature-card">
            <strong>平台协同</strong>
            <p>覆盖小红书、抖音、公众号与 bilibili 的运营入口。</p>
          </div>
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
import { reactive, ref } from 'vue'
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
