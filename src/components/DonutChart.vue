<script setup>
import { computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent, TitleComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useAppStore } from '@/stores'

use([PieChart, TooltipComponent, LegendComponent, TitleComponent, CanvasRenderer])

const appStore = useAppStore()

const props = defineProps({
  data: { type: Array, default: () => [] },
  title: String,
  height: { type: String, default: '180px' },
  centerLabel: { type: String, default: '合计' },
  colors: {
    type: Array,
    default: () => ['#635bff', '#8f88ff', '#b8b3ff', '#d5d2ff', '#8792a2', '#d5dbe1'],
  },
})

const total = computed(() => props.data.reduce((s, d) => s + (Number(d.value) || 0), 0))

const option = computed(() => {
  const dark = appStore.colorMode === 'dark'
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
      ...(dark
        ? {
            backgroundColor: '#161927',
            borderColor: 'rgba(255,255,255,0.12)',
            textStyle: { color: '#e7eaf2', fontSize: 12 },
          }
        : { textStyle: { fontSize: 12 } }),
    },
    legend: { show: false },
    title: {
      text: total.value.toLocaleString(),
      subtext: props.centerLabel,
      left: '49%',
      top: '36%',
      textAlign: 'center',
      textStyle: { fontSize: 18, fontWeight: 600, color: dark ? '#ededf0' : '#1a1f36', fontFamily: 'inherit' },
      subtextStyle: { fontSize: 10, color: '#8792a2' },
      itemGap: 2,
    },
    series: [
      {
        type: 'pie',
        radius: ['62%', '85%'],
        center: ['50%', '50%'],
        data: props.data,
        label: { show: false },
        emphasis: { scaleSize: 3 },
        itemStyle: { borderColor: dark ? '#15161a' : '#ffffff', borderWidth: 2 },
        color: props.colors,
      },
    ],
  }
})
</script>

<template>
  <div class="donut-wrap">
    <div v-if="title" class="donut-title">{{ title }}</div>
    <VChart :option="option" :style="{ height }" autoresize />
    <div class="legend-list">
      <div v-for="item in data" :key="item.name" class="legend-item">
        <span class="dot" :style="{ background: colors[data.indexOf(item) % colors.length] }" />
        <span>{{ item.name }}</span>
        <span class="pct">{{ item.percent ? item.percent + '%' : item.value }}</span>
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
  border-radius: 2px;
  flex-shrink: 0;
}

.pct {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
  font-weight: 600;
}
</style>
