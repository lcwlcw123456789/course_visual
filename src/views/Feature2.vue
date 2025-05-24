<!-- src/views/Feature1.vue -->
<template>
  <div>
    <h2>功能一页面</h2>
    <p>这里是功能一的内容</p>
    <button @click="goHome">返回主页面</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goHome = () => {
  router.push({ name: 'Home' })
}
</script>
