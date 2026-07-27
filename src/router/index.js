import { createRouter, createWebHistory } from 'vue-router'
import { AUTH_SESSION_KEY, AUTH_TOKEN_KEY } from '@/stores/user.js'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', requiresAuth: false, guestOnly: true }
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页', requiresAuth: true }
  },
  {
    path: '/publish-article',
    name: 'publish',
    component: () => import('@/views/PublishArticleView.vue'),
    alias: ['/publish'],
    meta: { title: '图文发布', requiresAuth: true }
  },
  {
    path: '/inspiration-create',
    name: 'inspiration',
    component: () => import('@/views/InspirationCreateView.vue'),
    alias: ['/inspiration'],
    meta: { title: '借鉴创作', requiresAuth: true }
  },
  {
    path: '/note-tracking',
    name: 'note-tracking',
    component: () => import('@/views/NoteTrackingView.vue'),
    meta: { title: '笔记数据跟踪', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 智旅云宣`
  }

  const hasToken = !!localStorage.getItem(AUTH_TOKEN_KEY)
  const hasSession = sessionStorage.getItem(AUTH_SESSION_KEY) === '1'
  const isAuthenticated = hasToken && hasSession

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: to.fullPath === '/' ? {} : { redirect: to.fullPath }
    })
    return
  }

  if (to.meta.guestOnly && isAuthenticated) {
    const redirectTarget =
      typeof to.query.redirect === 'string' && to.query.redirect.startsWith('/')
        ? to.query.redirect
        : '/'

    next(redirectTarget)
    return
  }

  next()
})

export default router
