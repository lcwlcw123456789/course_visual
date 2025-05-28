<!-- src/views/Feature1.vue -->
<!-- <template>
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
</script> -->

<template>
  <div class="container">
    <h2>功能三页面 - 食物类型与进口结构</h2>
    <div class="controls">
      <label for="yearSelect">选择年份：</label>
      <select id="yearSelect" v-model="selectedYear" @change="updateChart">
        <option v-for="year in years" :key="year" :value="year">
          {{ year }}
        </option>
      </select>
    </div>

    <div ref="vegaContainer" class="vega-chart"></div>

    <button class="home-btn" @click="goHome">返回主页面</button>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import vegaEmbed from "vega-embed";

const router = useRouter();
const goHome = () => {
  router.push({ name: "Home" });
};

// 年份范围
const years = Array.from({ length: 2024 - 1999 + 1 }, (_, i) =>
  String(1999 + i)
);
years.push("*"); // 添加“所有年份”选项

const selectedYear = ref("*");
const vegaContainer = ref(null);

// 加载 Vega 图表
const updateChart = () => {
  const specUrl = `../../public/vega_charts_2/vega_pie_${selectedYear.value}.json`; // 按需设置你实际的路径
  vegaEmbed(vegaContainer.value, specUrl, { actions: false }).catch(
    console.error
  );
};

onMounted(() => {
  updateChart(); // 初始加载
});
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
}

.controls {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

label {
  margin-right: 10px;
  font-weight: bold;
}

select {
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.vega-chart {
  margin-top: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.home-btn {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 16px;
  background-color: #2c7be5;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.home-btn:hover {
  background-color: #1a5bb8;
}
</style>
