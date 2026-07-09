<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores'
import MetricCard from '@/components/MetricCard.vue'
import DonutChart from '@/components/DonutChart.vue'
import { operationLogs } from '@/mock'
import { ElMessage } from 'element-plus'
import { VideoPlay } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()

const task = computed(() => taskStore.currentTask)
const taskId = computed(() => route.params.id || task.value.id)

const activeTab = ref('batches')
const sideTab = ref('stage')

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
  <div class="page-shell task-detail-page">
    <div class="page-toolbar with-actions">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="router.push('/batch-tasks')">批量任务中心</el-breadcrumb-item>
        <el-breadcrumb-item>{{ task.name }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="page-toolbar-actions">
        <el-tag :type="task.status === 'running' ? 'primary' : 'info'" size="small">{{ task.status === 'running' ? '运行中' : task.status }}</el-tag>
        <el-button size="small" @click="pauseTask">暂停</el-button>
        <el-button size="small" type="warning" plain @click="retryFailed">重试失败</el-button>
        <el-button size="small" type="primary" plain @click="submitAudit">提交审核</el-button>
        <el-button size="small" type="primary" @click="downloadPackage">下载</el-button>
      </div>
    </div>

    <div class="metric-grid compact kpi-6">
      <MetricCard label="总量" :value="task.total" />
      <MetricCard label="已完成" :value="task.completed" color="#22c55e" />
      <MetricCard label="失败" :value="task.failed" color="#ef4444" />
      <MetricCard label="待审核" :value="task.pendingAudit" color="#f59e0b" />
      <MetricCard label="待发布" :value="task.pendingPublish" color="#0ea5e9" />
      <MetricCard label="完成率" :value="task.progress" suffix="%" />
    </div>

    <div class="page-split">
      <div class="page-split-main">
        <div class="page-card fill-card">
          <el-tabs v-model="activeTab" class="compact-tabs fill-tabs">
            <el-tab-pane label="批次列表" name="batches">
              <div class="table-flex">
                <el-table :data="task.batches" stripe size="small">
                  <el-table-column prop="id" label="批次 ID" width="100" />
                  <el-table-column label="状态" width="90">
                    <template #default="{ row }">
                      <el-tag :type="batchStatusType[row.status]" size="small">{{ batchStatusLabel[row.status] }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="count" label="数量" width="70" />
                  <el-table-column label="进度" width="120">
                    <template #default="{ row }">
                      <el-progress :percentage="row.progress" :stroke-width="5" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="duration" label="耗时" width="70" />
                  <el-table-column prop="failed" label="失败" width="55" />
                  <el-table-column prop="reason" label="失败原因" show-overflow-tooltip />
                </el-table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="输出预览" name="preview">
              <div class="preview-grid">
                <div v-for="n in 6" :key="n" class="preview-item">
                  <div class="preview-thumb">
                    <el-icon :size="24"><VideoPlay /></el-icon>
                  </div>
                  <span>#{{ n }}</span>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="生成物" name="artifacts">
              <div class="table-flex">
                <el-table :data="task.batches" size="small">
                  <el-table-column prop="id" label="批次" width="100" />
                  <el-table-column label="脚本" width="70"><template #default>2000</template></el-table-column>
                  <el-table-column label="分镜" width="70"><template #default>2000</template></el-table-column>
                  <el-table-column label="视频" width="70"><template #default>{{ 2000 - 12 }}</template></el-table-column>
                  <el-table-column label="字幕" width="70"><template #default>1988</template></el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <el-tab-pane label="配置" name="config">
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="视频类型">科普视频</el-descriptions-item>
                <el-descriptions-item label="模板">科普短视频标准版</el-descriptions-item>
                <el-descriptions-item label="分辨率">1080×1920</el-descriptions-item>
                <el-descriptions-item label="数字人">小妍（知性女声）</el-descriptions-item>
                <el-descriptions-item label="并发数">128</el-descriptions-item>
                <el-descriptions-item label="质检策略">机器质检 + 人工抽检 20%</el-descriptions-item>
              </el-descriptions>
            </el-tab-pane>

            <el-tab-pane label="日志" name="logs">
              <div class="table-flex">
                <el-table :data="operationLogs" size="small" stripe>
                  <el-table-column prop="time" label="时间" width="140" />
                  <el-table-column prop="operator" label="操作人" width="80" />
                  <el-table-column prop="type" label="类型" width="100" />
                  <el-table-column prop="target" label="对象" show-overflow-tooltip />
                  <el-table-column prop="result" label="结果" width="70">
                    <template #default="{ row }">
                      <el-tag :type="row.result === '成功' ? 'success' : 'danger'" size="small">{{ row.result }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card fill-card">
          <el-tabs v-model="sideTab" class="side-tabs compact-tabs">
            <el-tab-pane label="阶段" name="stage">
              <el-steps :active="task.stages.findIndex((s) => s.status === 'active')" finish-status="success" direction="vertical" simple>
                <el-step
                  v-for="(stage, i) in task.stages"
                  :key="i"
                  :title="stage.name"
                  :description="stage.time"
                  :status="stage.status === 'done' ? 'success' : stage.status === 'active' ? 'process' : 'wait'"
                />
              </el-steps>
              <div class="time-info compact">
                <span>已运行 {{ task.elapsed }}</span>
                <span>剩余 {{ task.remaining }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="失败分析" name="failure">
              <DonutChart :data="failureDonut" title="" height="120px" />
            </el-tab-pane>
            <el-tab-pane label="成本" name="cost">
              <div v-for="c in task.costs" :key="c.name" class="cost-row">
                <span>{{ c.name }}</span>
                <span>¥{{ c.value.toLocaleString() }}</span>
              </div>
              <div class="cost-total">
                <span>合计</span>
                <span>¥{{ task.totalCost.toLocaleString() }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="并发" name="concurrency">
              <div class="concurrency-grid">
                <div><span class="num">{{ task.concurrency.current }}</span><span>当前</span></div>
                <div><span class="num">{{ task.concurrency.avg }}</span><span>平均</span></div>
                <div><span class="num">{{ task.concurrency.peak }}</span><span>峰值</span></div>
                <div><span class="num">{{ task.concurrency.utilization }}%</span><span>利用率</span></div>
              </div>
              <el-progress :percentage="task.concurrency.utilization" :stroke-width="6" style="margin-top: 8px" />
            </el-tab-pane>
            <el-tab-pane label="动态" name="logs">
              <el-timeline>
                <el-timeline-item v-for="(log, i) in recentLogs" :key="i" :timestamp="log.time" placement="top">
                  {{ log.msg }}
                </el-timeline-item>
              </el-timeline>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.fill-tabs :deep(.el-tabs__content) {
  min-height: 200px;
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
  font-size: 12px;
}

.concurrency-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  text-align: center;
}

.concurrency-grid .num {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: var(--primary);
}

.concurrency-grid span:last-child {
  font-size: 10px;
  color: var(--text-secondary);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(72px, 1fr));
  gap: 8px;
  padding: 4px 0;
}

.preview-item {
  text-align: center;
  font-size: 11px;
}

.preview-thumb {
  aspect-ratio: 9/16;
  max-height: 80px;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: 4px;
  border: 1px solid var(--border);
}
</style>
