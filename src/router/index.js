import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/publish',
    name: 'publish',
    component: () => import('@/views/PublishArticleView.vue'),
    meta: { title: '图文发布' }
  },
  {
    path: '/inspiration',
    name: 'inspiration',
    component: () => import('@/views/InspirationCreateView.vue'),
    meta: { title: '借鉴创作' }
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
