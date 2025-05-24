// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Feature1 from '../views/Feature1.vue'
import Feature2 from '../views/Feature2.vue'
import Feature3 from '../views/Feature3.vue'
import Feature4 from '../views/Feature4.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/feature1', name: 'Feature1', component: Feature1 },
  { path: '/feature2', name: 'Feature2', component: Feature2 },
  { path: '/feature3', name: 'Feature3', component: Feature3 },
  { path: '/feature4', name: 'Feature4', component: Feature4 },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
