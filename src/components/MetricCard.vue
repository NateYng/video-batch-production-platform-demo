<script setup>
defineProps({
  label: String,
  value: [String, Number],
  trend: Number,
  suffix: { type: String, default: '' },
  prefix: { type: String, default: '' },
  color: { type: String, default: '' },
  accent: { type: String, default: 'cyan' },
})
</script>

<template>
  <div class="metric-card page-card" :class="`accent-${accent}`">
    <div class="card-accent" />
    <div class="card-inner" :class="{ 'has-trend': trend !== undefined }">
      <div class="label">{{ label }}</div>
      <div class="value" :class="{ 'has-color': !!color }" :style="color ? { color, WebkitTextFillColor: color } : {}">
        {{ prefix }}{{ typeof value === 'number' ? value.toLocaleString() : value }}{{ suffix }}
      </div>
      <div v-if="trend !== undefined" class="trend" :class="trend >= 0 ? 'up' : 'down'">
        <span class="trend-icon">{{ trend >= 0 ? '▲' : '▼' }}</span>
        {{ Math.abs(trend) }}% 较昨日
      </div>
      <slot />
    </div>
  </div>
</template>

<style scoped>
.metric-card {
  position: relative;
  overflow: hidden;
  padding: 0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
}

.card-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: var(--gradient-primary);
}

.accent-cyan .card-accent {
  background: linear-gradient(90deg, #00b4d8, #48cae4);
}

.accent-indigo .card-accent {
  background: linear-gradient(90deg, #6366f1, #818cf8);
}

.accent-emerald .card-accent {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.accent-rose .card-accent {
  background: linear-gradient(90deg, #f43f5e, #fb7185);
}

.card-inner {
  padding: 16px 18px;
}

.label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 8px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

.value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  margin-top: 8px;
  font-weight: 500;
}

.trend-icon {
  font-size: 8px;
}

.value.has-color {
  background: none;
  -webkit-text-fill-color: unset;
}

.trend.up {
  color: var(--success);
}

.trend.down {
  color: var(--danger);
}
</style>
