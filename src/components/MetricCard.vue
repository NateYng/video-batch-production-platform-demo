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
  --metric-accent: #22d3ee;
  --metric-glow: rgba(34, 211, 238, 0.12);
  position: relative;
  min-height: 100px;
  padding: 18px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--bg-card);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), var(--shadow);
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
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: var(--metric-accent);
  box-shadow: 0 0 10px var(--metric-glow);
}

.metric-card::after {
  content: '';
  position: absolute;
  right: -24px;
  top: -32px;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--metric-glow) 0%, transparent 72%);
  pointer-events: none;
}

.metric-card:hover {
  transform: translateY(-2px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), var(--shadow-hover);
  border-color: color-mix(in srgb, var(--metric-accent) 40%, var(--border));
}

.accent-cyan { --metric-accent: #22d3ee; --metric-glow: rgba(34, 211, 238, 0.16); }
.accent-indigo { --metric-accent: #6e79f7; --metric-glow: rgba(110, 121, 247, 0.18); }
.accent-emerald { --metric-accent: #34d399; --metric-glow: rgba(52, 211, 153, 0.16); }
.accent-amber { --metric-accent: #fbbf24; --metric-glow: rgba(251, 191, 36, 0.14); }
.accent-rose { --metric-accent: #fb7185; --metric-glow: rgba(251, 113, 133, 0.16); }
.accent-slate { --metric-accent: #94a3b8; --metric-glow: rgba(148, 163, 184, 0.12); }
.accent-blue { --metric-accent: #60a5fa; --metric-glow: rgba(96, 165, 250, 0.16); }
.accent-violet { --metric-accent: #8b5cf6; --metric-glow: rgba(139, 92, 246, 0.16); }

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
  color: #34d399;
  background: rgba(52, 211, 153, 0.12);
  border: 1px solid rgba(52, 211, 153, 0.2);
}

.trend-badge.down {
  color: #fb7185;
  background: rgba(251, 113, 133, 0.1);
  border: 1px solid rgba(251, 113, 133, 0.2);
}

[data-theme='light'] .trend-badge.up {
  color: #047857;
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.22);
}

[data-theme='light'] .trend-badge.down {
  color: #be123c;
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.22);
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

[data-theme='light'] .metric-card {
  box-shadow: var(--shadow);
}
</style>
