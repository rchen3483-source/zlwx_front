import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const AUTH_TOKEN_KEY = 'token'
export const AUTH_SESSION_KEY = 'zlwx-authenticated'

export const useUserStore = defineStore('user', () => {
  const username = ref('Slash X')
  const avatar = ref('')
  const token = ref(localStorage.getItem(AUTH_TOKEN_KEY) || '')
  const hasSession = ref(sessionStorage.getItem(AUTH_SESSION_KEY) === '1')

  const isLoggedIn = computed(() => !!token.value && hasSession.value)

  const setUser = (user) => {
    username.value = user.username
    avatar.value = user.avatar
  }

  const setToken = (newToken) => {
    token.value = newToken
    hasSession.value = true
    localStorage.setItem(AUTH_TOKEN_KEY, newToken)
    sessionStorage.setItem(AUTH_SESSION_KEY, '1')
  }

  const logout = () => {
    token.value = ''
    username.value = ''
    avatar.value = ''
    hasSession.value = false
    localStorage.removeItem(AUTH_TOKEN_KEY)
    sessionStorage.removeItem(AUTH_SESSION_KEY)
  }

  return { username, avatar, token, isLoggedIn, setUser, setToken, logout }
})
