<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer])

const props = defineProps({
  data: { type: Array, default: () => [] },
  title: String,
  height: { type: String, default: '180px' },
  colors: {
    type: Array,
    default: () => ['#0ea5e9', '#f59e0b', '#ef4444', '#22c55e', '#8b5cf6', '#64748b'],
  },
})

const option = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { show: false },
  series: [
    {
      type: 'pie',
      radius: ['50%', '75%'],
      center: ['50%', '50%'],
      data: props.data,
      label: { show: false },
      itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
      color: props.colors,
    },
  ],
}))
</script>

<template>
  <div class="donut-wrap">
    <div v-if="title" class="donut-title">{{ title }}</div>
    <VChart :option="option" :style="{ height }" autoresize />
    <div class="legend-list">
      <div v-for="item in data" :key="item.name" class="legend-item">
        <span class="dot" :style="{ background: colors[data.indexOf(item) % colors.length] }" />
        <span>{{ item.name }}</span>
        <span class="pct">{{ item.percent || '' }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut-wrap {
  padding: 12px;
}

.donut-title {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
}

.legend-list {
  margin-top: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.pct {
  margin-left: auto;
}
</style>
