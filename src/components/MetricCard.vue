<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: Number,
  suffix: { type: String, default: '' },
  prefix: { type: String, default: '' },
  color: { type: String, default: '' },
  accent: { type: String, default: '' },
})
</script>

<template>
  <div class="metric-card" :style="color ? { '--value-color': color } : {}">
    <div class="label">{{ label }}</div>
    <div class="value" :class="{ 'has-color': !!color }">
      {{ prefix }}{{ typeof value === 'number' ? value.toLocaleString() : value }}{{ suffix }}
    </div>
    <div v-if="trend !== undefined" class="trend">
      <b :class="trend >= 0 ? 'up' : 'down'">{{ trend >= 0 ? '+' : '' }}{{ trend }}%</b>
      <small>vs 上周同期</small>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.metric-card {
  min-height: 92px;
  padding: 15px 18px;
  background: var(--bg-card);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  min-width: 0;
}

.label {
  font-size: 12.5px;
  color: var(--text-tertiary);
}

.value {
  font-size: 24px;
  font-weight: 600;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.4px;
  color: var(--text-primary);
}

.value.has-color {
  color: var(--value-color);
}

.trend {
  font-size: 12px;
  display: flex;
  align-items: baseline;
  gap: 5px;
}

.trend b {
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.trend .up {
  color: var(--success);
}

.trend .down {
  color: var(--danger);
}

.trend small {
  color: var(--text-tertiary);
  font-size: 11.5px;
  font-weight: 400;
}
</style>
