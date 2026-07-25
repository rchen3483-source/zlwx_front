import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('Slash X')
  const avatar = ref('')
  const token = ref(localStorage.getItem('token') || '')

  const isLoggedIn = computed(() => !!token.value)

  const setUser = (user) => {
    username.value = user.username
    avatar.value = user.avatar
  }

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    avatar.value = ''
    localStorage.removeItem('token')
  }

  return { username, avatar, token, isLoggedIn, setUser, setToken, logout }
})
