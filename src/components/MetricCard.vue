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
  <div
    class="metric-card"
    :class="`accent-${accent}`"
    :style="color ? { '--value-color': color } : {}"
  >
    <div class="metric-top">
      <span class="label">{{ label }}</span>
      <span
        v-if="trend !== undefined"
        class="trend-badge"
        :class="trend >= 0 ? 'up' : 'down'"
      >
        {{ trend >= 0 ? '↑' : '↓' }}{{ Math.abs(trend) }}%
      </span>
    </div>
    <div class="value" :class="{ 'has-color': !!color }">
      {{ prefix }}{{ typeof value === 'number' ? value.toLocaleString() : value }}{{ suffix }}
    </div>
    <slot />
  </div>
</template>

<style scoped>
.metric-card {
  --metric-accent: #00b4d8;
  --metric-glow: rgba(0, 180, 216, 0.1);
  position: relative;
  min-height: 100px;
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: linear-gradient(145deg, var(--bg-card-solid) 0%, color-mix(in srgb, var(--bg-card-solid) 92%, var(--metric-accent)) 100%);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.metric-card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 12px;
  bottom: 12px;
  width: 4px;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(180deg, var(--metric-accent), color-mix(in srgb, var(--metric-accent) 60%, white));
}

.metric-card::after {
  content: '';
  position: absolute;
  right: -24px;
  top: -32px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--metric-glow) 0%, transparent 72%);
  pointer-events: none;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  border-color: color-mix(in srgb, var(--metric-accent) 35%, var(--border));
}

.accent-cyan { --metric-accent: #00b4d8; --metric-glow: rgba(0, 180, 216, 0.14); }
.accent-indigo { --metric-accent: #6366f1; --metric-glow: rgba(99, 102, 241, 0.14); }
.accent-emerald { --metric-accent: #10b981; --metric-glow: rgba(16, 185, 129, 0.14); }
.accent-amber { --metric-accent: #f59e0b; --metric-glow: rgba(245, 158, 11, 0.14); }
.accent-rose { --metric-accent: #f43f5e; --metric-glow: rgba(244, 63, 94, 0.14); }
.accent-slate { --metric-accent: #64748b; --metric-glow: rgba(100, 116, 139, 0.12); }
.accent-blue { --metric-accent: #3b82f6; --metric-glow: rgba(59, 130, 246, 0.14); }
.accent-violet { --metric-accent: #8b5cf6; --metric-glow: rgba(139, 92, 246, 0.14); }

.metric-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.label {
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 500;
}

.trend-badge {
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 20px;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
}

.trend-badge.up {
  color: #047857;
  background: rgba(16, 185, 129, 0.14);
}

.trend-badge.down {
  color: #b91c1c;
  background: rgba(244, 63, 94, 0.12);
}

.value {
  position: relative;
  z-index: 1;
  font-size: 30px;
  font-weight: 800;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  color: var(--text-primary);
}

.value.has-color {
  color: var(--value-color);
}

[data-theme='dark'] .metric-card {
  background: linear-gradient(145deg, var(--bg-card) 0%, color-mix(in srgb, var(--bg-card) 88%, var(--metric-accent)) 100%);
}

[data-theme='dark'] .trend-badge.up {
  color: #34d399;
  background: rgba(16, 185, 129, 0.2);
}

[data-theme='dark'] .trend-badge.down {
  color: #fb7185;
  background: rgba(244, 63, 94, 0.2);
}
</style>
