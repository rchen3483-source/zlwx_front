<template>
  <div class="app-shell">
    <AppSidebar />
    <main class="main-panel" :class="mainClass">
      <slot />
    </main>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'

defineProps({
  mainClass: {
    type: String,
    default: ''
  }
})
</script>
