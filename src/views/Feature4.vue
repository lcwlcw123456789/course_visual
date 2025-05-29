<template>
  <div class="viz-container">
    <h2>功能四页面：对比主要国家的进口特征</h2>
    <p>使用雷达图或平行坐标图展示不同国家在不同维度的进口特征。</p>

    <div class="slider-wrapper">
      <label for="yearSlider">选择年份：</label>

      <div class="slider-container">
        <input
          id="yearSlider"
          type="range"
          :min="0"
          :max="yearOptions.length - 1"
          :step="1"
          v-model="selectedIndex"
          @input="updateTooltip"
          ref="sliderRef"
        />

        <!-- 年份浮动提示 -->
        <div class="tooltip" :style="{ left: tooltipLeft + 'px' }">
          {{ yearOptions[selectedIndex] }}
        </div>

        <!-- 标签对齐每个滑动节点 -->
        <div class="tick-labels-absolute">
          <span
            v-for="(year, index) in yearOptions"
            :key="year"
            :style="{ left: (index / (yearOptions.length - 1)) * 100 + '%' }"
            :class="{ active: index === selectedIndex }"
          >
            {{ year }}
          </span>
        </div>
      </div>
    </div>

    <div ref="vegaContainer" class="vega-chart">
      <p v-if="loading">图表加载中...</p>
      <p v-if="error">{{ error }}</p>
    </div>

    <button class="home-button" @click="goHome">返回主页面</button>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import vegaEmbed from "vega-embed";

// 构造年份列表
const yearOptions = Array.from({ length: 2024 - 1999 + 1 }, (_, i) =>
  (1999 + i).toString()
).concat("*");
const selectedIndex = ref(yearOptions.length - 1);
const resolveYearToFile = (year) => (year === "*" ? "summary" : year);

const router = useRouter();
const goHome = () => router.push({ name: "Home" });

const vegaContainer = ref(null);
const sliderRef = ref(null);
const tooltipLeft = ref(0);
const loading = ref(false);
const error = ref("");

const updateTooltip = () => {
  nextTick(() => {
    const slider = sliderRef.value;
    const percent = selectedIndex.value / (yearOptions.length - 1);
    const sliderWidth = slider.offsetWidth;
    tooltipLeft.value = percent * sliderWidth - 20;
  });
};

const renderVega = async () => {
  const year = yearOptions[selectedIndex.value];
  const url = `../../public/vega_charts_4/radarchart_${resolveYearToFile(
    year
  )}.json`;

  loading.value = true;
  error.value = "";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`未找到 ${year} 年的数据文件`);
    const spec = await res.json();
    await vegaEmbed(vegaContainer.value, spec, { actions: false });
  } catch (err) {
    error.value = err.message || "加载失败";
    vegaContainer.value.innerHTML = "";
  } finally {
    loading.value = false;
  }
};

watch(selectedIndex, () => {
  updateTooltip();
  renderVega();
});
onMounted(() => {
  updateTooltip();
  renderVega();
});
</script>

<style scoped>
.viz-container {
  max-width: 960px;
  margin: auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.slider-wrapper {
  margin: 2rem 0;
}

.slider-container {
  position: relative;
  width: 100%;
  padding-bottom: 2rem; /* 为下方标签腾出空间 */
}

input[type="range"] {
  width: 100%;
  appearance: none;
  height: 6px;
  background: #ddd;
  border-radius: 3px;
  margin: 0;
  padding: 0;
}

input[type="range"]::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  background: #1976d2;
  border-radius: 50%;
  cursor: pointer;
  margin-top: -5px;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  background: #1976d2;
  border: none;
  border-radius: 50%;
  cursor: pointer;
}

.tooltip {
  position: absolute;
  top: -30px;
  background: #1976d2;
  color: white;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
  transition: left 0.1s ease;
}

.tick-labels-absolute {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 1rem;
}

.tick-labels-absolute span {
  position: absolute;
  transform: translateX(-50%);
  font-size: 0.65rem;
  color: #666;
  white-space: nowrap;
  text-align: center;
}

.tick-labels-absolute span.active {
  color: #1976d2;
  font-weight: bold;
}

.vega-chart {
  min-height: 400px;
  margin: 2rem 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 1rem;
  background: #f9f9f9;
}

.home-button {
  padding: 0.6rem 1.2rem;
  border: none;
  background-color: #4caf50;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.home-button:hover {
  background-color: #45a049;
}
</style>
