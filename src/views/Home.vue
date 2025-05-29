<!-- src/views/Home.vue -->
<template>
  <div class="home-container">
    <div class="home-card">
      <h1 class="home-title">欢迎来到主页面</h1>
      <div class="button-group">
        <button class="nav-button" @click="goTo('feature1')">功能一</button>
        <button class="nav-button" @click="goTo('feature2')">功能二</button>
        <button class="nav-button" @click="goTo('feature3')">功能三</button>
        <button class="nav-button" @click="goTo('feature4')">功能四</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goTo = (feature) => {
  router.push({ name: 'Feature' + feature.slice(-1) })
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #dfe9f3, #ffffff);
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-card {
  background: white;
  padding: 60px 80px;
  border-radius: 30px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  text-align: center;
  transition: transform 0.3s ease;
}

.home-card:hover {
  transform: translateY(-5px);
}

.home-title {
  font-size: 36px;
  margin-bottom: 40px;
  color: #333;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.nav-button {
  padding: 14px 30px;
  font-size: 18px;
  border: none;
  border-radius: 50px;
  background-color: #4b9cdb;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background-color: #367bb5;
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
</style>
