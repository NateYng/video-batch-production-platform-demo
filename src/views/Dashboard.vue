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
    accent: 'cyan',
  },
  {
    title: '模板式创作台',
    desc: '基于模板快速复用，变量驱动批量生成',
    path: '/templates',
    icon: DocumentCopy,
    accent: 'indigo',
  },
  {
    title: '智能体编排平台',
    desc: '多智能体协作编排，自动化脚本与素材处理',
    path: '/agent-flow',
    icon: Connection,
    accent: 'emerald',
  },
]

const quickActions = [
  { label: '创建任务', icon: Plus, path: '/create-task', accent: 'cyan' },
  { label: '上传素材', icon: Upload, path: '/assets', accent: 'indigo' },
  { label: '审核队列', icon: Checked, path: '/audit', accent: 'amber' },
  { label: '发布管理', icon: Promotion, path: '/publish', accent: 'emerald' },
  { label: '数据看板', icon: DataAnalysis, path: '/data', accent: 'blue' },
  { label: '系统配置', icon: Setting, path: '/settings', accent: 'slate' },
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
        :class="`accent-${mode.accent}`"
        @click="goTo(mode.path)"
      >
        <div class="mode-glow" />
        <div class="mode-icon">
          <el-icon :size="26"><component :is="mode.icon" /></el-icon>
        </div>
        <div class="mode-info">
          <h3>{{ mode.title }}</h3>
          <p>{{ mode.desc }}</p>
        </div>
        <el-icon class="mode-arrow"><TrendCharts /></el-icon>
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
              :class="`accent-${action.accent}`"
              @click="goTo(action.path)"
            >
              <div class="quick-icon">
                <el-icon :size="18"><component :is="action.icon" /></el-icon>
              </div>
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
  padding: 20px 22px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  position: relative;
  overflow: hidden;
}

.mode-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

.mode-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  opacity: 0.5;
  pointer-events: none;
  transition: opacity 0.2s;
}

.mode-card:hover .mode-glow {
  opacity: 0.8;
}

.mode-card.accent-cyan .mode-glow { background: radial-gradient(circle, rgba(0, 180, 216, 0.2) 0%, transparent 70%); }
.mode-card.accent-indigo .mode-glow { background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 70%); }
.mode-card.accent-emerald .mode-glow { background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); }

.mode-card.accent-cyan { border-color: rgba(0, 180, 216, 0.15); }
.mode-card.accent-indigo { border-color: rgba(99, 102, 241, 0.15); }
.mode-card.accent-emerald { border-color: rgba(16, 185, 129, 0.15); }

.mode-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.mode-card.accent-cyan .mode-icon {
  background: linear-gradient(135deg, rgba(0, 180, 216, 0.15), rgba(0, 180, 216, 0.05));
  color: #00b4d8;
  box-shadow: 0 0 16px rgba(0, 180, 216, 0.15);
}

.mode-card.accent-indigo .mode-icon {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
  color: #6366f1;
  box-shadow: 0 0 16px rgba(99, 102, 241, 0.15);
}

.mode-card.accent-emerald .mode-icon {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  color: #10b981;
  box-shadow: 0 0 16px rgba(16, 185, 129, 0.15);
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
  opacity: 0.4;
  position: relative;
  z-index: 1;
  transition: opacity 0.2s, transform 0.2s;
}

.mode-card:hover .mode-arrow {
  opacity: 1;
  transform: translateX(2px);
}

.mode-card.accent-cyan .mode-arrow { color: #00b4d8; }
.mode-card.accent-indigo .mode-arrow { color: #6366f1; }
.mode-card.accent-emerald .mode-arrow { color: #10b981; }

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
  padding: 10px 12px;
  background: rgba(99, 102, 241, 0.04);
  border-radius: 8px;
  border: 1px solid var(--border);
  transition: border-color 0.2s;
}

.risk-item:hover {
  border-color: var(--border-strong);
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
  padding: 10px 12px;
  background: rgba(99, 102, 241, 0.04);
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.2s;
}

.channel-item:hover {
  border-color: var(--border);
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
  gap: 8px;
  padding: 14px 8px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 11px;
  color: var(--text-secondary);
  transition: all 0.2s;
  border: 1px solid transparent;
}

.quick-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quick-item.accent-cyan .quick-icon { background: rgba(0, 180, 216, 0.1); color: #00b4d8; }
.quick-item.accent-indigo .quick-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
.quick-item.accent-amber .quick-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
.quick-item.accent-emerald .quick-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
.quick-item.accent-blue .quick-icon { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
.quick-item.accent-slate .quick-icon { background: rgba(100, 116, 139, 0.1); color: #64748b; }

.quick-item:hover {
  background: rgba(99, 102, 241, 0.04);
  border-color: var(--border);
}

.quick-item:hover .quick-icon {
  transform: scale(1.05);
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
