<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  VideoCamera, DocumentCopy, Connection, Warning, TrendCharts,
  Plus, Upload, Checked, Promotion, DataAnalysis, Setting,
} from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores'
import { riskQueue, channelEffects } from '@/mock'
import MetricCard from '@/components/MetricCard.vue'

const router = useRouter()
const taskStore = useTaskStore()

const activeTab = ref('all')

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
  {
    title: '批量任务生产线',
    desc: '大规模视频批产，支持万级并发调度与分批执行',
    path: '/create-task',
    icon: VideoCamera,
    color: '#0ea5e9',
    bg: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%)',
  },
  {
    title: '模板式创作台',
    desc: '基于模板快速复用，变量驱动批量生成',
    path: '/templates',
    icon: DocumentCopy,
    color: '#8b5cf6',
    bg: 'linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)',
  },
  {
    title: '智能体编排平台',
    desc: '多智能体协作编排，自动化脚本与素材处理',
    path: '/agent-flow',
    icon: Connection,
    color: '#22c55e',
    bg: 'linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)',
  },
]

const quickActions = [
  { label: '创建任务', icon: Plus, path: '/create-task', color: '#0ea5e9' },
  { label: '上传素材', icon: Upload, path: '/assets', color: '#8b5cf6' },
  { label: '审核队列', icon: Checked, path: '/audit', color: '#f59e0b' },
  { label: '发布管理', icon: Promotion, path: '/publish', color: '#22c55e' },
  { label: '数据看板', icon: DataAnalysis, path: '/data', color: '#3b82f6' },
  { label: '系统配置', icon: Setting, path: '/settings', color: '#64748b' },
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

function goTo(path) {
  router.push(path)
}

function viewTask(row) {
  router.push(`/task/${row.id}`)
}
</script>

<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1>工作台</h1>
        <p>视频批量生产运营总览 · 实时监控任务进度与风险队列</p>
      </div>
      <el-button type="primary" :icon="Plus" @click="goTo('/create-task')">创建批量任务</el-button>
    </div>

    <div class="metric-grid">
      <MetricCard
        label="今日生成视频"
        :value="taskStore.overview.todayGenerated"
        :trend="taskStore.overview.todayGeneratedTrend"
      />
      <MetricCard
        label="待审核视频"
        :value="taskStore.overview.pendingAudit"
        :trend="taskStore.overview.pendingAuditTrend"
        color="var(--warning)"
      />
      <MetricCard
        label="发布成功率"
        :value="taskStore.overview.publishSuccessRate"
        suffix="%"
        :trend="taskStore.overview.publishSuccessRateTrend"
        color="var(--success)"
      />
      <MetricCard
        label="失败待重试"
        :value="taskStore.overview.failedRetry"
        :trend="taskStore.overview.failedRetryTrend"
        color="var(--danger)"
      />
    </div>

    <div class="mode-grid">
      <div
        v-for="mode in modeEntries"
        :key="mode.path"
        class="mode-card page-card"
        :style="{ background: mode.bg }"
        @click="goTo(mode.path)"
      >
        <div class="mode-icon" :style="{ color: mode.color }">
          <el-icon :size="28"><component :is="mode.icon" /></el-icon>
        </div>
        <div class="mode-info">
          <h3>{{ mode.title }}</h3>
          <p>{{ mode.desc }}</p>
        </div>
        <el-icon class="mode-arrow" :style="{ color: mode.color }"><TrendCharts /></el-icon>
      </div>
    </div>

    <div class="main-layout">
      <div class="main-content">
        <div class="page-card table-card">
          <div class="card-header">
            <h3>任务监控</h3>
            <el-button text type="primary" @click="goTo('/batch-tasks')">查看全部 →</el-button>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="全部" name="all" />
            <el-tab-pane label="运行中" name="running" />
            <el-tab-pane label="已完成" name="completed" />
            <el-tab-pane label="部分失败" name="partial_fail" />
            <el-tab-pane label="已取消" name="cancelled" />
          </el-tabs>
          <el-table :data="filteredTasks" stripe style="width: 100%" @row-click="viewTask">
            <el-table-column prop="name" label="任务名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="110" />
            <el-table-column prop="count" label="数量" width="90" align="right">
              <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="进度" width="140">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :stroke-width="6" />
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusMap[row.status]?.type" size="small">
                  {{ statusMap[row.status]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="风险" width="90">
              <template #default="{ row }">
                <span class="risk-tag" :class="riskMap[row.risk]?.class">
                  {{ riskMap[row.risk]?.label }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="80" />
            <el-table-column prop="startTime" label="开始时间" width="150" />
            <el-table-column label="操作" width="80" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click.stop="viewTask(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <aside class="sidebar">
        <div class="page-card sidebar-card">
          <div class="card-header">
            <h3><el-icon><Warning /></el-icon> 风险队列</h3>
            <el-badge :value="riskQueue.length" type="danger" />
          </div>
          <div class="risk-list">
            <div v-for="item in riskQueue" :key="item.id" class="risk-item">
              <div class="risk-item-top">
                <span class="risk-tag" :class="riskMap[item.riskLevel]?.class">{{ item.risk }}</span>
                <span class="risk-time">{{ item.time }}</span>
              </div>
              <div class="risk-title">{{ item.title }}</div>
              <div class="risk-id">{{ item.id }}</div>
            </div>
          </div>
          <el-button class="full-btn" @click="goTo('/audit')">进入审核台</el-button>
        </div>

        <div class="page-card sidebar-card">
          <div class="card-header">
            <h3>渠道效果</h3>
          </div>
          <div class="channel-list">
            <div v-for="ch in channelEffects" :key="ch.name" class="channel-item">
              <div class="channel-name">{{ ch.name }}</div>
              <div class="channel-stats">
                <span>发布 <b>{{ ch.published }}</b></span>
                <span>播放 <b>{{ ch.views }}</b></span>
                <span class="status-success">成功率 {{ ch.successRate }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-card sidebar-card">
          <div class="card-header">
            <h3>快捷操作</h3>
          </div>
          <div class="quick-grid">
            <div
              v-for="action in quickActions"
              :key="action.path"
              class="quick-item"
              @click="goTo(action.path)"
            >
              <el-icon :size="20" :style="{ color: action.color }">
                <component :is="action.icon" />
              </el-icon>
              <span>{{ action.label }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: 1600px;
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.mode-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  border: 1px solid transparent;
}

.mode-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
}

.mode-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.mode-info h3 {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
}

.mode-info p {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.4;
}

.mode-arrow {
  margin-left: auto;
  opacity: 0.5;
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
}

.table-card {
  padding: 16px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.card-header h3 {
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-card {
  padding: 14px;
}

.risk-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.risk-item {
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid var(--border);
}

.risk-item-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.risk-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid;
  font-weight: 500;
}

.risk-time {
  font-size: 11px;
  color: var(--text-secondary);
}

.risk-title {
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 2px;
}

.risk-id {
  font-size: 11px;
  color: var(--text-secondary);
}

.full-btn {
  width: 100%;
}

.channel-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.channel-item {
  padding: 10px;
  background: #f8fafc;
  border-radius: 6px;
}

.channel-name {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}

.channel-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.channel-stats b {
  color: var(--text-primary);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 11px;
  color: var(--text-secondary);
  transition: background 0.15s;
}

.quick-item:hover {
  background: #f1f5f9;
}

@media (max-width: 1200px) {
  .main-layout {
    grid-template-columns: 1fr;
  }

  .mode-grid {
    grid-template-columns: 1fr;
  }

  .metric-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
