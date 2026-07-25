import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/publish-article',
    name: 'publish',
    component: () => import('@/views/PublishArticleView.vue'),
    alias: ['/publish'],
    meta: { title: '图文发布' }
  },
  {
    path: '/inspiration-create',
    name: 'inspiration',
    component: () => import('@/views/InspirationCreateView.vue'),
    alias: ['/inspiration'],
    meta: { title: '借鉴创作' }
  },
  {
    path: '/note-tracking',
    name: 'note-tracking',
    component: () => import('@/views/NoteTrackingView.vue'),
    meta: { title: '笔记数据跟踪' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 智旅文宣`
  }
  next()
})

export default router
