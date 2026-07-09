<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, VideoPause, RefreshRight, Delete } from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores'
import MetricCard from '@/components/MetricCard.vue'
import DonutChart from '@/components/DonutChart.vue'

const router = useRouter()
const taskStore = useTaskStore()

const selectedIds = ref([])
const filterStatus = ref('')
const filterType = ref('')
const filterRisk = ref('')
const keyword = ref('')

const overviewCards = [
  { label: '排队中', value: 12, accent: 'slate' },
  { label: '生成中', value: 38, accent: 'cyan' },
  { label: '部分失败', value: 7, accent: 'amber', color: '#f59e0b' },
  { label: '今日完成', value: 64, accent: 'emerald', color: '#22c55e' },
]

const statusOptions = [
  { label: '全部状态', value: '' },
  { label: '排队中', value: 'queued' },
  { label: '运行中', value: 'running' },
  { label: '已暂停', value: 'paused' },
  { label: '已完成', value: 'completed' },
  { label: '部分失败', value: 'partial_fail' },
]

const typeOptions = [
  { label: '全部类型', value: '' },
  { label: '宣传片', value: '宣传片' },
  { label: '宣传视频', value: '宣传视频' },
  { label: '科普视频', value: '科普视频' },
  { label: '数字人讲解', value: '数字人讲解' },
  { label: '企业新闻播报', value: '企业新闻播报' },
]

const riskOptions = [
  { label: '全部风险', value: '' },
  { label: '高风险', value: 'high' },
  { label: '中风险', value: 'medium' },
  { label: '低风险', value: 'low' },
]

const statusMap = {
  queued: { label: '排队中', type: 'info' },
  running: { label: '生成中', type: 'primary' },
  paused: { label: '已暂停', type: 'warning' },
  completed: { label: '已完成', type: 'success' },
  partial_fail: { label: '部分失败', type: 'danger' },
}

const riskMap = {
  high: { label: '高', class: 'risk-high' },
  medium: { label: '中', class: 'risk-medium' },
  low: { label: '低', class: 'risk-low' },
}

const failureData = [
  { name: '视频合成失败', value: 86, percent: '40.2%' },
  { name: '素材加载失败', value: 64, percent: '29.9%' },
  { name: '音频合成失败', value: 32, percent: '15.0%' },
  { name: '字幕生成失败', value: 18, percent: '8.4%' },
  { name: '其他', value: 14, percent: '6.5%' },
]

const filteredTasks = computed(() =>
  taskStore.tasks.filter((t) => {
    if (filterStatus.value && t.status !== filterStatus.value) return false
    if (filterType.value && t.videoType !== filterType.value) return false
    if (filterRisk.value && t.risk !== filterRisk.value) return false
    if (keyword.value && !t.name.includes(keyword.value) && !t.id.includes(keyword.value)) return false
    return true
  })
)

function handleSelectionChange(rows) {
  selectedIds.value = rows.map((r) => r.id)
}

function batchPause() {
  if (!selectedIds.value.length) return ElMessage.warning('请先选择任务')
  selectedIds.value.forEach((id) => taskStore.pauseTask(id))
  ElMessage.success(`已暂停 ${selectedIds.value.length} 个任务`)
}

function batchRetry() {
  if (!selectedIds.value.length) return ElMessage.warning('请先选择任务')
  selectedIds.value.forEach((id) => taskStore.retryFailed(id))
  ElMessage.success(`已重试 ${selectedIds.value.length} 个任务`)
}

async function batchDelete() {
  if (!selectedIds.value.length) return ElMessage.warning('请先选择任务')
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 个任务？`, '批量删除', {
    type: 'warning',
  })
  taskStore.deleteTasks(selectedIds.value)
  selectedIds.value = []
  ElMessage.success('删除成功')
}

function viewTask(row) {
  router.push(`/task/${row.id}`)
}
</script>

<template>
  <div class="page-shell batch-tasks">
    <div class="page-toolbar">
      <span />
      <el-button type="primary" size="small" :icon="Plus" @click="router.push('/create-task')">创建任务</el-button>
    </div>

    <div class="metric-grid compact kpi-4">
      <MetricCard
        v-for="card in overviewCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :color="card.color"
        :accent="card.accent"
      />
    </div>

    <div class="page-split">
      <div class="page-split-main">
        <div class="page-card fill-card">
          <div class="filter-bar-compact">
            <el-input
              v-model="keyword"
              placeholder="搜索任务名称 / ID"
              :prefix-icon="Search"
              clearable
              style="width: 220px"
            />
            <el-select v-model="filterStatus" placeholder="状态" clearable style="width: 130px">
              <el-option v-for="o in statusOptions" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <el-select v-model="filterType" placeholder="视频类型" clearable style="width: 140px">
              <el-option v-for="o in typeOptions" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <el-select v-model="filterRisk" placeholder="风险等级" clearable style="width: 120px">
              <el-option v-for="o in riskOptions" :key="o.value" :label="o.label" :value="o.value" />
            </el-select>
            <div class="batch-actions">
              <el-button :icon="VideoPause" :disabled="!selectedIds.length" @click="batchPause">暂停</el-button>
              <el-button :icon="RefreshRight" :disabled="!selectedIds.length" @click="batchRetry">重试</el-button>
              <el-button :icon="Delete" type="danger" plain :disabled="!selectedIds.length" @click="batchDelete">删除</el-button>
            </div>
          </div>

          <div class="table-flex">
          <el-table
            :data="filteredTasks"
            stripe
            size="small"
            @selection-change="handleSelectionChange"
            @row-click="viewTask"
          >
            <el-table-column type="selection" width="45" @click.stop />
            <el-table-column prop="id" label="任务 ID" width="160" />
            <el-table-column prop="name" label="任务名称" min-width="160" show-overflow-tooltip />
            <el-table-column prop="videoType" label="视频类型" width="120" />
            <el-table-column label="总量" width="90" align="right">
              <template #default="{ row }">{{ row.total.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="完成率" width="140">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.completionRate"
                  :status="row.status === 'partial_fail' ? 'exception' : row.status === 'completed' ? 'success' : ''"
                  :stroke-width="6"
                />
              </template>
            </el-table-column>
            <el-table-column label="风险" width="80">
              <template #default="{ row }">
                <span class="risk-tag" :class="riskMap[row.risk]?.class">{{ riskMap[row.risk]?.label }}</span>
              </template>
            </el-table-column>
            <el-table-column label="成本(¥)" width="100" align="right">
              <template #default="{ row }">{{ row.cost.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="statusMap[row.status]?.type" size="small">
                  {{ statusMap[row.status]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="160" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" size="small" @click.stop="viewTask(row)">详情</el-button>
                <el-button
                  v-if="row.status === 'running'"
                  link
                  type="warning"
                  size="small"
                  @click.stop="taskStore.pauseTask(row.id)"
                >暂停</el-button>
                <el-button
                  v-if="row.status === 'partial_fail'"
                  link
                  type="success"
                  size="small"
                  @click.stop="taskStore.retryFailed(row.id)"
                >重试</el-button>
              </template>
            </el-table-column>
          </el-table>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card side-block">
          <h3>队列健康度</h3>
          <div class="health-metrics">
            <div class="health-item">
              <span class="health-label">当前并发</span>
              <span class="health-value">142 / 256</span>
            </div>
            <div class="health-item">
              <span class="health-label">队列利用率</span>
              <el-progress :percentage="68" :stroke-width="8" />
            </div>
            <div class="health-item">
              <span class="health-label">平均等待</span>
              <span class="health-value">3m 24s</span>
            </div>
            <div class="health-item">
              <span class="health-label">GPU 占用</span>
              <el-progress :percentage="82" color="#f59e0b" :stroke-width="8" />
            </div>
          </div>
        </div>

        <div class="page-card side-block">
          <DonutChart title="失败原因" :data="failureData" height="120px" />
        </div>

        <div class="page-card side-block cost-warning">
          <h3>成本预警</h3>
          <div class="warning-content">
            <div class="warning-amount">¥ 28,426.50</div>
            <div class="warning-desc">本月累计成本已超预算 85%</div>
            <el-progress :percentage="85" color="#ef4444" :stroke-width="8" />
            <div class="warning-tip">建议优化并发配置或启用成本熔断策略</div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.side-block {
  padding: 10px 12px;
  flex-shrink: 0;
}

.side-block h3 {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 8px;
}

.health-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.health-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.health-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.health-value {
  font-size: 14px;
  font-weight: 600;
}

.risk-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  border: 1px solid;
  font-weight: 500;
}

.cost-warning {
  border-color: #fecaca;
  background: linear-gradient(180deg, var(--bg-card-solid) 0%, #fef2f2 100%);
}

.warning-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
  margin-bottom: 2px;
}

.warning-desc {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.warning-tip {
  font-size: 10px;
  color: #f59e0b;
  margin-top: 6px;
}

@media (max-width: 1200px) {
  .batch-actions {
    margin-left: 0;
    width: 100%;
  }
}
</style>
