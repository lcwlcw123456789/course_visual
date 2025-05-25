<template>
  <div class="container">
    <!-- 返回主页按钮 -->
    <div class="back-home" @click="goHome" title="返回主页">
      <span class="icon">🏠</span>
    </div>

    <div class="content-box">
      <!-- 左：年份按钮组 -->
      <div class="year-selector">
        <h2>选择年份</h2>
        <div class="year-scroll">
          <button
            v-for="year in years"
            :key="year"
            :class="['year-button', { active: year === selectedYear }]"
            @click="changeYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- 右：图像 -->
      <div class="chart-box">
        <h2>{{ selectedYear }} 年食物进口情况</h2>
        <transition name="fade-slide">
          <div v-show="chartVisible" ref="chart" class="chart" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import * as vegaEmbed from 'vega-embed'
import { useRouter } from 'vue-router'

const router = useRouter()
const goHome = () => {
  router.push('/')
}

const chart = ref(null)
const selectedYear = ref(2023)
const chartVisible = ref(true)
const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i)

const getChartSpec = async (year) => {
  try {
    const res = await fetch(`/vega_charts_1/${year}_vega.json`)
    return await res.json()
  } catch (err) {
    console.error(`加载 ${year} 年的图表失败：`, err)
    return null
  }
}

const renderChart = async () => {
  await nextTick()
  const spec = await getChartSpec(selectedYear.value)
  if (chart.value && spec) {
    vegaEmbed.default(chart.value, spec, { actions: false })
  }
}

const changeYear = async (year) => {
  if (year === selectedYear.value) return
  chartVisible.value = false
  selectedYear.value = year
  setTimeout(async () => {
    chartVisible.value = true
    await renderChart()
  }, 300)
}

onMounted(renderChart)
</script>

<style scoped>
.container {
  min-height: 120vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 40px;
  background: linear-gradient(to right, #eef2f3, #8e9eab);
  font-family: 'Segoe UI', sans-serif;
  box-sizing: border-box;
  position: relative;
}

.back-home {
  position: absolute;
  top: 20px;
  right: 30px;
  font-size: 14px;
  background: linear-gradient(to right, #4facfe, #00f2fe);
  color: white;
  padding: 8px 16px;
  border-radius: 30px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.back-home:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.25);
  background: linear-gradient(to right, #43e97b, #38f9d7);
}

.content-box {
  display: flex;
  flex-direction: row;
  background: white;
  padding: 60px 80px;
  border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  align-items: flex-start;
  gap: 50px;
  max-width: 95vw;
  margin: 0 auto;
  overflow-x: auto;
  box-sizing: border-box;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.content-box:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

.year-selector {
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 180px;
}

.year-selector h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #333;
}

.year-scroll {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 10px;
}

.year-button {
  padding: 10px 16px;
  font-size: 14px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-button:hover {
  background-color: #d0e6ff;
}

.year-button.active {
  background-color: #007bff;
  color: white;
  font-weight: bold;
}

.chart-box {
  flex: 1 1 auto;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-box h2 {
  text-align: center;
  font-size: 20px;
  color: #444;
  margin-bottom: 20px;
}

.chart {
  width: 100%;
  max-width: 100%;
  height: 450px;
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
