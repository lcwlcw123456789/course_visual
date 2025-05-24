<template>
  <div class="container">
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
        <h2>{{ selectedYear }} 年图表展示</h2>
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

const chart = ref(null)
const selectedYear = ref(2023)
const chartVisible = ref(true)
const years = Array.from({ length: 2025 - 1997 + 1 }, (_, i) => 1997 + i)

const chartSpecsByYear = {
  2023: {
  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
  "width": 800,
  "height": 400,
  "projection": {"type": "equalEarth"},
  "layer": [
    // 1. 地图图层
    {
      "data": {
        "url": "https://raw.githubusercontent.com/vega/vega-datasets/master/data/world-110m.json",
        "format": {"type": "topojson", "feature": "countries"}
      },
      "mark": {"type": "geoshape", "fill": "#eee", "stroke": "#aaa"}
    },
    // 2. 线条图层：从出口国连到美国
    {
      "data": {
        "values": [
          {
            "country": "China",
            "latitude": 35.8617,
            "longitude": 104.1954,
            "us_latitude": 37.0902,
            "us_longitude": -95.7129,
            "food_value": 1200
          },
          {
            "country": "Brazil",
            "latitude": -14.2350,
            "longitude": -51.9253,
            "us_latitude": 37.0902,
            "us_longitude": -95.7129,
            "food_value": 800
          }
        ]
      },
      "mark": {
        "type": "rule",
        "stroke": "#e63946",
        "strokeOpacity": 0.6
      },
      "encoding": {
        "longitude": {"field": "longitude", "type": "quantitative"},
        "latitude": {"field": "latitude", "type": "quantitative"},
        "longitude2": {"field": "us_longitude"},
        "latitude2": {"field": "us_latitude"},
        "strokeWidth": {
          "field": "food_value",
          "type": "quantitative",
          "scale": {"type": "sqrt", "range": [0.5, 8]}
        },
        "tooltip": [
          {"field": "country"},
          {"field": "food_value"}
        ]
      }
    },
    // 3. 出口国家圆点（可选）
    {
      "data": {
        "values": [
          {"latitude": 35.8617, "longitude": 104.1954, "country": "China"},
          {"latitude": -14.2350, "longitude": -51.9253, "country": "Brazil"}
        ]
      },
      "mark": {"type": "circle", "color": "#1d3557", "size": 40},
      "encoding": {
        "longitude": {"field": "longitude", "type": "quantitative"},
        "latitude": {"field": "latitude", "type": "quantitative"},
        "tooltip": {"field": "country"}
      }
    }
  ]
}
,
  2024: {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    data: {
      values: [
        { year: 1, sales: 100 },
        { year: 2, sales: 200 },
        { year: 3, sales: 150 }
      ]
    },
    mark: 'line',
    encoding: {
      x: { field: 'year', type: 'quantitative' },
      y: { field: 'sales', type: 'quantitative' }
    }
  }
}

const getChartSpec = (year) => chartSpecsByYear[year] || chartSpecsByYear[2023]

const renderChart = async () => {
  await nextTick()
  if (chart.value) {
    vegaEmbed.default(chart.value, getChartSpec(selectedYear.value), { actions: false })
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
  align-items: flex-start; /* 从center改为flex-start，内容靠上 */
  padding-top: 40px;       /* 控制距离顶部的间距 */
  background: linear-gradient(to right, #eef2f3, #8e9eab);
  font-family: 'Segoe UI', sans-serif;
  box-sizing: border-box;
}


.content-box {
  display: flex;
  flex-direction: row;
  background: white;
  padding: 60px 80px; /* 上下和左右内边距都加大 */
  border-radius: 100px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  align-items: flex-start;
  gap: 50px;
  max-width: 95vw;
  margin: 0 auto;
  overflow-x: auto;
  box-sizing: border-box;
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
  /* 允许图表区域随内容宽度增长，最大不超过90vw */
  flex: 1 1 auto;
  max-width: 90vw;
  display: flex;
  flex-direction: column;
  align-items: center; /* 图表标题和图表整体居中 */
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
  height: 450px; /* 高度从400改为600，纵向拉长图表 */
  background: #f9f9f9;
  border-radius: 12px;
  border: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  overflow-x: auto;
}

/* 更丝滑的进入动画 */
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
