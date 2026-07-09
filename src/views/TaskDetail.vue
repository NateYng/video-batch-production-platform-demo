<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores'
import MetricCard from '@/components/MetricCard.vue'
import DonutChart from '@/components/DonutChart.vue'
import { operationLogs } from '@/mock'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const task = computed(() => taskStore.currentTask)
const taskId = computed(() => route.params.id || task.value.id)

const activeTab = ref('batches')

const batchStatusLabel = {
  completed: '已完成',
  running: '运行中',
  pending_audit: '待审核',
  pending_publish: '待发布',
}

const batchStatusType = {
  completed: 'success',
  running: 'primary',
  pending_audit: 'warning',
  pending_publish: 'info',
}

function pauseTask() {
  taskStore.pauseTask(taskId.value)
  task.value.status = 'paused'
  ElMessage.warning('任务已暂停')
}

function retryFailed() {
  taskStore.retryFailed(taskId.value)
  ElMessage.success('已重试失败批次')
}

function submitAudit() {
  ElMessage.success('已提交 526 条待审核视频')
}

function downloadPackage() {
  ElMessage.info('正在打包下载结果…')
}

const failureDonut = computed(() =>
  task.value.failureReasons.map((r) => ({ name: r.name, value: r.value, percent: `${r.percent}%` }))
)

const recentLogs = [
  { time: '14:35', msg: 'Batch-003 视频合成进度 65%' },
  { time: '14:20', msg: '机器质检完成 Batch-002' },
  { time: '14:05', msg: '素材加载失败 86 条已重试' },
  { time: '13:50', msg: 'Batch-001 全部完成' },
]
</script>

<template>
  <div class="task-detail-page">
    <div class="page-header">
      <div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="router.push('/batch-tasks')">批量任务中心</el-breadcrumb-item>
          <el-breadcrumb-item>任务详情</el-breadcrumb-item>
        </el-breadcrumb>
        <h1>{{ task.name }}</h1>
        <p>
          任务 ID：{{ taskId }} · 创建人 {{ task.creator }} · {{ task.createdAt }}
          <el-tag :type="task.status === 'running' ? 'primary' : 'info'" size="small" style="margin-left: 8px">
            {{ task.status === 'running' ? '运行中' : task.status }}
          </el-tag>
        </p>
      </div>
      <div class="header-actions">
        <el-button @click="pauseTask">暂停任务</el-button>
        <el-button type="warning" plain @click="retryFailed">重试失败</el-button>
        <el-button type="primary" plain @click="submitAudit">提交审核</el-button>
        <el-button type="primary" @click="downloadPackage">下载结果包</el-button>
      </div>
    </div>

    <div class="metric-grid cols-6">
      <MetricCard label="总量" :value="task.total" />
      <MetricCard label="已完成" :value="task.completed" color="#22c55e" />
      <MetricCard label="失败" :value="task.failed" color="#ef4444" />
      <MetricCard label="待审核" :value="task.pendingAudit" color="#f59e0b" />
      <MetricCard label="待发布" :value="task.pendingPublish" color="#0ea5e9" />
      <MetricCard label="完成率" :value="task.progress" suffix="%" />
    </div>

    <div class="stage-card page-card">
      <h3>阶段进度</h3>
      <el-steps :active="task.stages.findIndex((s) => s.status === 'active')" finish-status="success" align-center>
        <el-step
          v-for="(stage, i) in task.stages"
          :key="i"
          :title="stage.name"
          :description="`${stage.time} · ${stage.duration}`"
          :status="stage.status === 'done' ? 'success' : stage.status === 'active' ? 'process' : 'wait'"
        />
      </el-steps>
      <div class="time-info">
        <span>已运行 {{ task.elapsed }}</span>
        <span>预计剩余 {{ task.remaining }}</span>
        <span>总预计 {{ task.estimated }}</span>
      </div>
    </div>

    <div class="main-layout">
      <div class="main-content page-card">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="批次列表" name="batches">
            <el-table :data="task.batches" stripe size="small">
              <el-table-column prop="id" label="批次 ID" width="110" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="batchStatusType[row.status]" size="small">{{ batchStatusLabel[row.status] }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="数量" width="80" />
              <el-table-column label="进度" width="140">
                <template #default="{ row }">
                  <el-progress :percentage="row.progress" :stroke-width="6" />
                </template>
              </el-table-column>
              <el-table-column prop="duration" label="耗时" width="80" />
              <el-table-column prop="failed" label="失败" width="60" />
              <el-table-column prop="reason" label="失败原因" />
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="输出预览" name="preview">
            <div class="preview-grid">
              <div v-for="n in 6" :key="n" class="preview-item">
                <div class="preview-thumb">
                  <el-icon :size="32"><VideoPlay /></el-icon>
                </div>
                <span>视频预览 #{{ n }}</span>
              </div>
            </div>
          </el-tab-pane>

          <el-tab-pane label="生成物明细" name="artifacts">
            <el-table :data="task.batches" size="small">
              <el-table-column prop="id" label="批次" />
              <el-table-column label="脚本" width="80"><template #default>2000</template></el-table-column>
              <el-table-column label="分镜" width="80"><template #default>2000</template></el-table-column>
              <el-table-column label="视频" width="80"><template #default>{{ 2000 - 12 }}</template></el-table-column>
              <el-table-column label="字幕" width="80"><template #default>1988</template></el-table-column>
            </el-table>
          </el-tab-pane>

          <el-tab-pane label="配置详情" name="config">
            <el-descriptions :column="2" border size="small">
              <el-descriptions-item label="视频类型">科普视频</el-descriptions-item>
              <el-descriptions-item label="模板">科普短视频标准版</el-descriptions-item>
              <el-descriptions-item label="分辨率">1080×1920</el-descriptions-item>
              <el-descriptions-item label="数字人">小妍（知性女声）</el-descriptions-item>
              <el-descriptions-item label="并发数">128</el-descriptions-item>
              <el-descriptions-item label="质检策略">机器质检 + 人工抽检 20%</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="操作日志" name="logs">
            <el-table :data="operationLogs" size="small" stripe>
              <el-table-column prop="time" label="时间" width="160" />
              <el-table-column prop="operator" label="操作人" width="100" />
              <el-table-column prop="type" label="操作类型" width="120" />
              <el-table-column prop="target" label="对象" />
              <el-table-column prop="result" label="结果" width="80">
                <template #default="{ row }">
                  <el-tag :type="row.result === '成功' ? 'success' : 'danger'" size="small">{{ row.result }}</el-tag>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>

      <aside class="sidebar">
        <div class="page-card sidebar-block">
          <DonutChart :data="failureDonut" title="失败原因分布" height="140px" />
        </div>
        <div class="page-card sidebar-block">
          <h3>成本拆解</h3>
          <div v-for="c in task.costs" :key="c.name" class="cost-row">
            <span>{{ c.name }}</span>
            <span>¥{{ c.value.toLocaleString() }}</span>
          </div>
          <div class="cost-total">
            <span>合计</span>
            <span>¥{{ task.totalCost.toLocaleString() }}</span>
          </div>
        </div>
        <div class="page-card sidebar-block">
          <h3>并发情况</h3>
          <div class="concurrency-grid">
            <div><span class="num">{{ task.concurrency.current }}</span><span>当前</span></div>
            <div><span class="num">{{ task.concurrency.avg }}</span><span>平均</span></div>
            <div><span class="num">{{ task.concurrency.peak }}</span><span>峰值</span></div>
            <div><span class="num">{{ task.concurrency.utilization }}%</span><span>利用率</span></div>
          </div>
          <el-progress :percentage="task.concurrency.utilization" :stroke-width="8" style="margin-top: 12px" />
        </div>
        <div class="page-card sidebar-block">
          <h3>最近动态</h3>
          <el-timeline>
            <el-timeline-item v-for="(log, i) in recentLogs" :key="i" :timestamp="log.time" placement="top">
              {{ log.msg }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.task-detail-page .page-header h1 {
  margin-top: 8px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stage-card {
  padding: 16px 20px;
  margin-bottom: 16px;
}

.stage-card h3 {
  font-size: 14px;
  margin-bottom: 16px;
}

.time-info {
  display: flex;
  gap: 24px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-secondary);
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 12px;
}

.main-content {
  padding: 12px 16px;
  min-height: 400px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-block {
  padding: 12px 16px;
}

.sidebar-block h3 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 4px 0;
  color: var(--text-secondary);
}

.cost-total {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
}

.concurrency-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  text-align: center;
}

.concurrency-grid .num {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: var(--primary);
}

.concurrency-grid span:last-child {
  font-size: 11px;
  color: var(--text-secondary);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.preview-item {
  text-align: center;
  font-size: 12px;
}

.preview-thumb {
  aspect-ratio: 9/16;
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 6px;
}
</style>
