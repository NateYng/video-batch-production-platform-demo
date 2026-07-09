<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  VideoCamera, DocumentCopy, Connection, Warning,
  Plus, Upload, Checked, Promotion, DataAnalysis, Setting,
} from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores'
import { riskQueue, channelEffects } from '@/mock'
import MetricCard from '@/components/MetricCard.vue'

const router = useRouter()
const taskStore = useTaskStore()

const activeTab = ref('all')
const sideTab = ref('risk')

const tabFilters = {
  all: () => true,
  running: (t) => t.status === 'running',
  completed: (t) => t.status === 'completed',
  partial_fail: (t) => t.status === 'partial_fail',
  cancelled: (t) => t.status === 'cancelled',
}

const filteredTasks = computed(() =>
  taskStore.dashboardTaskList.filter(tabFilters[activeTab.value] || tabFilters.all)
)

const modeEntries = [
  { title: '批量任务生产线', desc: '万级并发调度', path: '/create-task', icon: VideoCamera, accent: 'cyan' },
  { title: '模板式创作台', desc: '变量驱动复用', path: '/templates', icon: DocumentCopy, accent: 'indigo' },
  { title: '智能体编排', desc: '自定义流程策略', path: '/agent-flow', icon: Connection, accent: 'emerald' },
]

const quickActions = [
  { label: '创建', icon: Plus, path: '/create-task', accent: 'cyan' },
  { label: '素材', icon: Upload, path: '/assets', accent: 'indigo' },
  { label: '审核', icon: Checked, path: '/audit', accent: 'amber' },
  { label: '发布', icon: Promotion, path: '/publish', accent: 'emerald' },
  { label: '数据', icon: DataAnalysis, path: '/data', accent: 'blue' },
  { label: '配置', icon: Setting, path: '/settings', accent: 'slate' },
]

const statusMap = {
  running: { label: '运行中', type: 'primary' },
  completed: { label: '已完成', type: 'success' },
  partial_fail: { label: '部分失败', type: 'warning' },
  cancelled: { label: '已取消', type: 'info' },
}

const riskMap = {
  high: { label: '高风险', class: 'risk-high' },
  medium: { label: '中风险', class: 'risk-medium' },
  low: { label: '低风险', class: 'risk-low' },
}

const accentIconBg = {
  cyan: 'rgba(0,180,216,0.1)',
  indigo: 'rgba(99,102,241,0.1)',
  amber: 'rgba(245,158,11,0.1)',
  emerald: 'rgba(16,185,129,0.1)',
  blue: 'rgba(59,130,246,0.1)',
  slate: 'rgba(100,116,139,0.1)',
}

function goTo(path) {
  router.push(path)
}

function viewTask(row) {
  router.push(`/task/${row.id}`)
}
</script>

<template>
  <div class="page-shell dashboard">
    <div class="metric-grid compact kpi-4">
      <MetricCard label="今日生成" :value="taskStore.overview.todayGenerated" :trend="taskStore.overview.todayGeneratedTrend" accent="cyan" />
      <MetricCard label="待审核" :value="taskStore.overview.pendingAudit" :trend="taskStore.overview.pendingAuditTrend" accent="amber" color="var(--warning)" />
      <MetricCard label="发布成功率" :value="taskStore.overview.publishSuccessRate" suffix="%" :trend="taskStore.overview.publishSuccessRateTrend" accent="emerald" color="var(--success)" />
      <MetricCard label="失败待重试" :value="taskStore.overview.failedRetry" :trend="taskStore.overview.failedRetryTrend" accent="rose" color="var(--danger)" />
    </div>

    <div class="mode-strip">
      <div
        v-for="mode in modeEntries"
        :key="mode.path"
        class="mode-strip-item page-card"
        :class="`accent-${mode.accent}`"
        @click="goTo(mode.path)"
      >
        <div class="mode-strip-icon">
          <el-icon :size="18"><component :is="mode.icon" /></el-icon>
        </div>
        <div class="mode-strip-text">
          <h4>{{ mode.title }}</h4>
          <p>{{ mode.desc }}</p>
        </div>
      </div>
    </div>

    <div class="page-split dash-main">
      <div class="page-split-main">
        <div class="page-card fill-card">
          <div class="card-header">
            <h3>任务监控</h3>
            <el-button text type="primary" size="small" @click="goTo('/batch-tasks')">全部 →</el-button>
          </div>
          <el-tabs v-model="activeTab" class="compact-tabs">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="运行中" name="running" />
            <el-tab-pane label="已完成" name="completed" />
            <el-tab-pane label="部分失败" name="partial_fail" />
            <el-tab-pane label="已取消" name="cancelled" />
          </el-tabs>
          <div class="table-flex">
            <el-table :data="filteredTasks" stripe size="small" style="width: 100%" @row-click="viewTask">
              <el-table-column prop="name" label="任务名称" min-width="140" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" width="90" />
              <el-table-column prop="count" label="数量" width="72" align="right">
                <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column label="进度" width="110">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :stroke-width="5" />
                </template>
              </el-table-column>
              <el-table-column label="状态" width="80">
                <template #default="{ row }">
                  <el-tag :type="statusMap[row.status]?.type" size="small">{{ statusMap[row.status]?.label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="风险" width="72">
                <template #default="{ row }">
                  <span class="risk-tag" :class="riskMap[row.risk]?.class">{{ riskMap[row.risk]?.label }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="startTime" label="开始时间" width="130" />
              <el-table-column label="操作" width="56" fixed="right">
                <template #default="{ row }">
                  <el-button link type="primary" size="small" @click.stop="viewTask(row)">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card fill-card">
          <el-tabs v-model="sideTab" class="side-tabs compact-tabs">
            <el-tab-pane name="risk">
              <template #label>
                <span><el-icon style="vertical-align:-2px"><Warning /></el-icon> 风险</span>
              </template>
              <div class="side-list">
                <div v-for="item in riskQueue" :key="item.id" class="side-list-item">
                  <div class="side-row">
                    <span class="risk-tag" :class="riskMap[item.riskLevel]?.class">{{ item.risk }}</span>
                    <span class="side-time">{{ item.time }}</span>
                  </div>
                  <div class="side-title">{{ item.title }}</div>
                </div>
              </div>
              <el-button size="small" class="side-btn" @click="goTo('/audit')">进入审核台</el-button>
            </el-tab-pane>
            <el-tab-pane label="渠道" name="channel">
              <div class="side-list">
                <div v-for="ch in channelEffects" :key="ch.name" class="side-list-item">
                  <div class="side-title">{{ ch.name }}</div>
                  <div class="side-meta">
                    发布 <b>{{ ch.published }}</b> · 播放 <b>{{ ch.views }}</b> ·
                    <span class="status-success">{{ ch.successRate }}%</span>
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="快捷" name="quick">
              <div class="quick-chips">
                <div
                  v-for="action in quickActions"
                  :key="action.path"
                  class="quick-chip"
                  @click="goTo(action.path)"
                >
                  <div class="quick-chip-icon" :style="{ background: accentIconBg[action.accent] }">
                    <el-icon :size="14"><component :is="action.icon" /></el-icon>
                  </div>
                  <span>{{ action.label }}</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.risk-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid;
  font-weight: 500;
}

.side-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.side-time {
  font-size: 10px;
  color: var(--text-tertiary);
}

.side-title {
  font-size: 12px;
  font-weight: 500;
  line-height: 1.35;
}

.side-meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 4px;
}

.side-meta b {
  color: var(--text-primary);
}

.side-btn {
  width: 100%;
  margin-top: 8px;
}
</style>
