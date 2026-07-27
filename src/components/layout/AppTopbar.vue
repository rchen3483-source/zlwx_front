<template>
  <header class="topbar" :class="{ 'topbar-flat': flat }">
    <div class="topbar-title">{{ title }}</div>

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
const username = computed(() => userStore.username || 'Slash X')
</script>
