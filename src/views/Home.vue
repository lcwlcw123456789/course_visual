<!-- src/views/Home.vue -->
<template>
  <div>
    <h1>欢迎来到主页面</h1>
    <button @click="goTo('feature1')">功能一</button>
    <button @click="goTo('feature2')">功能二</button>
    <button @click="goTo('feature3')">功能三</button>
    <button @click="goTo('feature4')">功能四</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goTo = (feature) => {
  router.push({ name: 'Feature' + feature.slice(-1) })
}
</script>
