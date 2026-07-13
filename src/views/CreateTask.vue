<script setup>
import { ref, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Upload, Document, VideoCamera, Microphone, ChatLineSquare, Picture,
  Check, ArrowLeft, ArrowRight,
} from '@element-plus/icons-vue'
import { useTaskStore } from '@/stores'
import { videoTypes, digitalHumans } from '@/mock'

const router = useRouter()
const taskStore = useTaskStore()

const currentStep = ref(0)
const selectedType = ref('')
const taskName = ref('7月科普短视频批产')

const uploadFiles = ref([
  { name: '科普脚本_001.xlsx', size: '2.4 MB', rows: 2000, status: 'ready' },
  { name: '科普脚本_002.xlsx', size: '2.1 MB', rows: 2000, status: 'ready' },
  { name: '科普脚本_003.xlsx', size: '1.8 MB', rows: 2000, status: 'ready' },
  { name: '科普脚本_004.xlsx', size: '2.0 MB', rows: 2000, status: 'ready' },
  { name: '科普脚本_005.xlsx', size: '1.9 MB', rows: 2000, status: 'ready' },
])

const config = reactive({
  template: 'TPL-003',
  digitalHuman: 'dh1',
  voice: '知性女声',
  subtitle: true,
  subtitleStyle: 'standard',
  cover: true,
  coverTemplate: 'auto',
  auditStrategy: 'machine_first',
  sampleRate: 20,
  riskLevel: 'medium',
  channels: ['抖音', '视频号'],
  publishMode: 'scheduled',
  publishTime: '14:00',
  totalCount: 10000,
  batchCount: 20,
  concurrency: 80,
})

const typeIcons = {
  宣传片: VideoCamera,
  宣传视频: Picture,
  科普视频: Document,
  数字人讲解: ChatLineSquare,
  企业新闻播报: Microphone,
}

const typeColors = ['#635bff', '#7b61c9', '#217a4b', '#b3861a', '#c0123c']

const steps = ['选择类型', '上传素材', '生产配置', '审核策略', '发布配置']

const estimatedCost = computed(() => {
  const base = config.totalCount * 1.86
  return Math.round(base)
})

const summaryItems = computed(() => [
  { label: '视频类型', value: selectedType.value || '未选择' },
  { label: '任务名称', value: taskName.value },
  { label: '素材文件', value: `${uploadFiles.value.length} 个文件` },
  { label: '生产总量', value: `${config.totalCount.toLocaleString()} 条` },
  { label: '分批数量', value: `${config.batchCount} 批` },
  { label: '并发数', value: `${config.concurrency}` },
  { label: '发布渠道', value: config.channels.join('、') || '未选择' },
])

function nextStep() {
  if (currentStep.value === 0 && !selectedType.value) {
    return ElMessage.warning('请选择视频类型')
  }
  if (currentStep.value < 4) currentStep.value++
}

function prevStep() {
  if (currentStep.value > 0) currentStep.value--
}

function submitTask() {
  const id = `TASK-${new Date().toISOString().slice(0, 7).replace('-', '')}-${String(Math.floor(Math.random() * 9000) + 1000)}`
  taskStore.addTask({
    id,
    name: taskName.value,
    videoType: selectedType.value,
    total: config.totalCount,
    completionRate: 0,
    risk: config.riskLevel,
    cost: estimatedCost.value,
    status: 'queued',
  })
  ElMessage.success('任务创建成功，已加入生产队列')
  router.push('/batch-tasks')
}
</script>

<template>
  <div class="page-shell create-task">
    <div class="page-split wide-side">
      <div class="page-split-main">
        <div class="page-card wizard-steps compact">
          <el-steps :active="currentStep" finish-status="success" align-center simple>
            <el-step v-for="(step, i) in steps" :key="i" :title="step" />
          </el-steps>
        </div>

        <div class="page-card fill-card step-content">
          <div class="step-scroll">
            <div v-show="currentStep === 0">
              <h3 class="step-title">选择视频类型</h3>
              <div class="type-grid">
                <div
                  v-for="(type, i) in videoTypes"
                  :key="type"
                  class="type-card"
                  :class="{ active: selectedType === type }"
                  :style="{ '--accent': typeColors[i % typeColors.length] }"
                  @click="selectedType = type"
                >
                  <el-icon :size="24" :style="{ color: typeColors[i % typeColors.length] }">
                    <component :is="typeIcons[type] || VideoCamera" />
                  </el-icon>
                  <span>{{ type }}</span>
                  <el-icon v-if="selectedType === type" class="check-icon"><Check /></el-icon>
                </div>
              </div>
              <el-form label-width="80px" size="small" style="margin-top: 12px">
                <el-form-item label="任务名称">
                  <el-input v-model="taskName" placeholder="输入任务名称" style="max-width: 320px" />
                </el-form-item>
              </el-form>
            </div>

            <div v-show="currentStep === 1">
              <h3 class="step-title">上传素材文件</h3>
              <div class="upload-zone">
                <el-icon :size="32" color="#94a3b8"><Upload /></el-icon>
                <p>拖拽或 <el-button link type="primary">点击上传</el-button></p>
                <span class="upload-hint">支持 .xlsx / .csv / .json</span>
              </div>
              <el-table :data="uploadFiles" stripe size="small" style="margin-top: 10px">
                <el-table-column prop="name" label="文件名" show-overflow-tooltip />
                <el-table-column prop="size" label="大小" width="80" />
                <el-table-column prop="rows" label="行数" width="70" align="right" />
                <el-table-column label="状态" width="80">
                  <template #default><el-tag type="success" size="small">就绪</el-tag></template>
                </el-table-column>
              </el-table>
            </div>

            <div v-show="currentStep === 2">
              <h3 class="step-title">生产配置</h3>
              <el-form label-width="90px" size="small" class="config-form">
                <el-form-item label="生产模板">
                  <el-select v-model="config.template" style="width: 240px">
                    <el-option label="科普短视频标准版" value="TPL-003" />
                    <el-option label="企业新闻播报模板 v3" value="TPL-001" />
                    <el-option label="数字人讲解" value="TPL-002" />
                  </el-select>
                </el-form-item>
                <el-form-item label="数字人">
                  <el-select v-model="config.digitalHuman" style="width: 240px">
                    <el-option v-for="dh in digitalHumans" :key="dh.id" :label="dh.name" :value="dh.id" />
                  </el-select>
                </el-form-item>
                <el-form-item label="语音风格">
                  <el-radio-group v-model="config.voice">
                    <el-radio value="知性女声">知性女声</el-radio>
                    <el-radio value="科技男声">科技男声</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="字幕">
                  <el-switch v-model="config.subtitle" />
                </el-form-item>
                <el-form-item label="封面">
                  <el-switch v-model="config.cover" />
                </el-form-item>
              </el-form>
            </div>

            <div v-show="currentStep === 3">
              <h3 class="step-title">审核策略</h3>
              <el-form label-width="90px" size="small" class="config-form">
                <el-form-item label="审核模式">
                  <el-radio-group v-model="config.auditStrategy">
                    <el-radio value="machine_first">机器优先</el-radio>
                    <el-radio value="human_first">人工优先</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="抽检率">
                  <el-slider v-model="config.sampleRate" :min="0" :max="100" style="max-width: 280px" />
                </el-form-item>
                <el-form-item label="风险阈值">
                  <el-radio-group v-model="config.riskLevel">
                    <el-radio value="low">宽松</el-radio>
                    <el-radio value="medium">标准</el-radio>
                    <el-radio value="high">严格</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>

            <div v-show="currentStep === 4">
              <h3 class="step-title">发布配置</h3>
              <el-form label-width="90px" size="small" class="config-form">
                <el-form-item label="发布渠道">
                  <el-checkbox-group v-model="config.channels">
                    <el-checkbox label="抖音" value="抖音" />
                    <el-checkbox label="视频号" value="视频号" />
                    <el-checkbox label="官网" value="官网" />
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="生产总量">
                  <el-input-number v-model="config.totalCount" :min="100" :max="100000" :step="1000" size="small" />
                  <span class="form-hint">条</span>
                </el-form-item>
                <el-form-item label="分批数量">
                  <el-input-number v-model="config.batchCount" :min="1" :max="100" size="small" />
                </el-form-item>
                <el-form-item label="并发数">
                  <el-input-number v-model="config.concurrency" :min="1" :max="256" size="small" />
                </el-form-item>
              </el-form>
            </div>
          </div>

          <div class="step-actions">
            <el-button v-if="currentStep > 0" size="small" :icon="ArrowLeft" @click="prevStep">上一步</el-button>
            <el-button v-if="currentStep < 4" size="small" type="primary" @click="nextStep">
              下一步 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
            <el-button v-if="currentStep === 4" size="small" type="primary" :icon="Check" @click="submitTask">提交任务</el-button>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card summary-card">
          <h3>任务摘要</h3>
          <div class="summary-list">
            <div v-for="item in summaryItems" :key="item.label" class="summary-item">
              <span class="summary-label">{{ item.label }}</span>
              <span class="summary-value">{{ item.value }}</span>
            </div>
          </div>
        </div>
        <div class="page-card cost-card">
          <h3>成本预估</h3>
          <div class="cost-amount">¥ {{ estimatedCost.toLocaleString() }}</div>
          <div class="cost-tip">{{ config.totalCount.toLocaleString() }} 条 × ¥1.86/条</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-split-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.step-content {
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}

.check-icon {
  position: absolute;
  top: 4px;
  right: 4px;
  color: var(--accent);
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 20px;
  border: 2px dashed var(--border);
  background: rgba(148, 155, 175, 0.04);
  border-radius: var(--radius);
}

.upload-hint {
  font-size: 11px;
  color: var(--text-secondary);
}

.config-form :deep(.el-form-item) {
  margin-bottom: 10px;
}

.form-hint {
  margin-left: 8px;
  font-size: 11px;
  color: var(--text-secondary);
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--border);
  flex-shrink: 0;
}

.summary-card,
.cost-card {
  padding: 10px 12px;
}

.summary-card h3,
.cost-card h3 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 10px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
}

.summary-label {
  color: var(--text-secondary);
}

.summary-value {
  font-weight: 500;
  text-align: right;
  max-width: 140px;
}

.cost-card {
  margin-top: 8px;
}

.cost-amount {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 6px;
}

.cost-tip {
  font-size: 10px;
  color: var(--text-secondary);
}
</style>
