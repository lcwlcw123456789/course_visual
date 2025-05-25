<template>
  <div class="container">
    <!-- 返回主页按钮 -->
    <router-link to="/" class="back-home" title="返回主页">
      <span class="icon">🏠</span>
    </router-link>

    <div class="content-box" @mouseover="hovered = true" @mouseleave="hovered = false">
      <!-- 左侧：年份选择器 + 折线图按钮 -->
      <div class="year-selector">
        <h2>选择年份</h2>
        <div class="year-scroll">
          <button
            class="linechart-button"
            :class="{ active: showLineChart }"
            @click="showLine"
          >
            查看折线图
          </button>
          <button
            v-for="year in years"
            :key="year"
            :class="['year-button', { active: year === selectedYear && !showLineChart }]"
            @click="changeYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>

      <!-- 右侧：图表展示区 -->
      <div class="chart-box">
        <h2>{{ chartTitle }}</h2>
        <transition name="fade-slide">
          <div v-show="chartVisible" ref="chart" class="chart" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted, computed, } from 'vue'
import * as vegaEmbed from 'vega-embed'

const chart = ref(null)
const chartVisible = ref(true)
const selectedYear = ref(null)
const showLineChart = ref(true)
const hovered = ref(false)

const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) => 1999 + i)

const chartTitle = computed(() =>
  showLineChart.value
    ? '年度变化折线图'
    : `${selectedYear.value} 年不同食品类别占比展示`
)

const loadChart = async (url) => {
  await nextTick()
  if (chart.value) {
    vegaEmbed.default(chart.value, url, { actions: false })
  }
}

const renderChart = async () => {
  const url = showLineChart.value
    ? '/vega_charts_2/vega_line.json'
    : `/vega_charts_2/vega_pie_${selectedYear.value}.json`

  await loadChart(url)
}

const showLine = async () => {
  showLineChart.value = true
  chartVisible.value = false
  setTimeout(async () => {
    chartVisible.value = true
    await renderChart()
  }, 300)
}

const changeYear = async (year) => {
  if (year === selectedYear.value && !showLineChart.value) return
  showLineChart.value = false
  selectedYear.value = year
  chartVisible.value = false
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
  padding: 70px 80px;
  border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  align-items: flex-start;
  gap: 50px;
  max-width: 95vw;
  margin: 0 auto;
  overflow-x: auto;
  box-sizing: border-box;
  transition: transform 0.3s ease;
}
.content-box:hover {
  transform: translateY(-5px);
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

/* 年份按钮样式 */
.year-button, .linechart-button {
  padding: 10px 16px;
  font-size: 14px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.year-button:hover, .linechart-button:hover {
  background-color: #d0e6ff;
}

.year-button.active, .linechart-button.active {
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

/* 动画效果 */
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
