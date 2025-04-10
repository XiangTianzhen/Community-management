import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomePage.vue')
  },
  {
    path: '/query',
    name: 'query',
    component: () => import('../views/QueryPage.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('../views/AdminPage.vue')
  },
  {
    path: '/batch-upload',
    name: 'batchUpload',
    component: () => import('../views/BatchUploadPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory('/'),
  routes
})

export default router 