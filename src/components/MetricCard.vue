<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: Number,
  suffix: { type: String, default: '' },
  prefix: { type: String, default: '' },
  color: { type: String, default: '' },
})
</script>

<template>
  <div class="metric-card page-card">
    <div class="label">{{ label }}</div>
    <div class="value" :style="color ? { color } : {}">
      {{ prefix }}{{ typeof value === 'number' ? value.toLocaleString() : value }}{{ suffix }}
    </div>
    <div v-if="trend !== undefined" class="trend" :class="trend >= 0 ? 'up' : 'down'">
      {{ trend >= 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}% 较昨日
    </div>
    <slot />
  </div>
</template>

<style scoped>
.metric-card {
  padding: 14px 16px;
}

.label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.trend {
  font-size: 11px;
  margin-top: 4px;
}

.trend.up {
  color: #22c55e;
}

.trend.down {
  color: #ef4444;
}
</style>
