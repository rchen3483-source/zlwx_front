<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">
        <img class="brand-logo" src="/assets/brand-logo.png" alt="智旅文宣" />
      </div>
      <div class="brand-copy">
        <strong>智旅文宣</strong>
      </div>
    </div>

    <nav class="nav">
      <RouterLink to="/" class="nav-item" :class="{ active: isAssistantRoute }">
        <span class="nav-icon">
          <img class="nav-menu-icon" src="/assets/nav-ai-assistant.png" alt="AI文宣助手图标" />
        </span>
        <span>Ai文宣助手</span>
      </RouterLink>
      <RouterLink to="/note-tracking" class="nav-item" :class="{ active: currentRoute === '/note-tracking' }">
        <span class="nav-icon">
          <img class="nav-menu-icon" src="/assets/nav-note-tracking.png" alt="笔记数据跟踪图标" />
        </span>
        <span>笔记数据跟踪</span>
        <span class="chevron">⌄</span>
      </RouterLink>
      <RouterLink to="/account-settings" class="nav-item" :class="{ active: currentRoute === '/account-settings' }">
        <span class="nav-icon">
          <img class="nav-menu-icon" src="/assets/nav-account-settings.png" alt="账号设置图标" />
        </span>
        <span>账号设置</span>
        <span class="chevron">⌄</span>
      </RouterLink>
    </nav>

    <div class="sidebar-bottom">
      <span class="nav-icon">↩</span>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const currentRoute = computed(() => route.path)
const assistantRoutes = ['/', '/publish', '/publish-article', '/inspiration', '/inspiration-create']
const isAssistantRoute = computed(() => assistantRoutes.includes(route.path))
</script>
