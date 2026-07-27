<template>
  <header class="topbar" :class="{ 'topbar-flat': flat }">
    <div class="topbar-main">
      <button v-if="showBackButton" class="topbar-back" type="button" aria-label="返回上一级" @click="goBack">
        <span>‹</span>
      </button>
      <div class="topbar-title">{{ title }}</div>
    </div>

    <div class="topbar-actions">
      <button class="icon-btn" aria-label="消息">
        <span>✉</span>
        <i></i>
      </button>
      <button v-if="showCommandBtn" class="icon-btn" aria-label="命令">
        <span>⌲</span>
      </button>
      <span class="divider"></span>
      <div class="profile">
        <div class="avatar"></div>
        <span>{{ username }}</span>
        <span class="profile-arrow">⌄</span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'

defineProps({
  title: {
    type: String,
    default: '首页'
  },
  showCommandBtn: {
    type: Boolean,
    default: true
  },
  flat: {
    type: Boolean,
    default: false
  }
})

const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const username = computed(() => userStore.username || 'Slash X')
const showBackButton = computed(() => route.path !== '/' && route.path !== '/login')

const goBack = async () => {
  if (window.history.length > 1) {
    await router.back()
    return
  }

  await router.push('/')
}
</script>
