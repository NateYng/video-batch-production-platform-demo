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

const typeColors = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']

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
  <div class="create-task">
    <div class="page-header">
      <div>
        <h1>创建批量任务</h1>
        <p>五步向导完成视频批产配置，支持万级规模生产调度</p>
      </div>
    </div>

    <div class="wizard-layout">
      <div class="wizard-main">
        <div class="page-card steps-card">
          <el-steps :active="currentStep" finish-status="success" align-center>
            <el-step v-for="(step, i) in steps" :key="i" :title="step" />
          </el-steps>
        </div>

        <div class="page-card step-content">
          <!-- Step 1: Video Type -->
          <div v-show="currentStep === 0">
            <h3 class="step-title">选择视频类型</h3>
            <p class="step-desc">选择本次批量生产的视频内容类型，不同类型将匹配不同的生产模板</p>
            <div class="type-grid">
              <div
                v-for="(type, i) in videoTypes"
                :key="type"
                class="type-card"
                :class="{ active: selectedType === type }"
                :style="{ '--accent': typeColors[i % typeColors.length] }"
                @click="selectedType = type"
              >
                <el-icon :size="32" :style="{ color: typeColors[i % typeColors.length] }">
                  <component :is="typeIcons[type] || VideoCamera" />
                </el-icon>
                <span>{{ type }}</span>
                <el-icon v-if="selectedType === type" class="check-icon"><Check /></el-icon>
              </div>
            </div>
            <el-form label-width="100px" style="margin-top: 20px">
              <el-form-item label="任务名称">
                <el-input v-model="taskName" placeholder="输入任务名称" style="max-width: 400px" />
              </el-form-item>
            </el-form>
          </div>

          <!-- Step 2: Upload -->
          <div v-show="currentStep === 1">
            <h3 class="step-title">上传素材文件</h3>
            <p class="step-desc">上传脚本/数据文件，系统将自动解析并生成视频内容</p>
            <div class="upload-zone page-card">
              <el-icon :size="40" color="#94a3b8"><Upload /></el-icon>
              <p>拖拽文件到此处，或 <el-button link type="primary">点击上传</el-button></p>
              <span class="upload-hint">支持 .xlsx / .csv / .json，单文件最大 50MB</span>
            </div>
            <el-table :data="uploadFiles" stripe style="margin-top: 16px">
              <el-table-column prop="name" label="文件名" />
              <el-table-column prop="size" label="大小" width="100" />
              <el-table-column prop="rows" label="数据行数" width="100" align="right">
                <template #default="{ row }">{{ row.rows.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default>
                  <el-tag type="success" size="small">已就绪</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="80">
                <template #default>
                  <el-button link type="danger" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- Step 3: Production Config -->
          <div v-show="currentStep === 2">
            <h3 class="step-title">生产配置</h3>
            <p class="step-desc">配置模板、数字人、语音、字幕与封面等生产参数</p>
            <el-form label-width="120px" class="config-form">
              <el-form-item label="生产模板">
                <el-select v-model="config.template" style="width: 280px">
                  <el-option label="科普短视频标准版" value="TPL-003" />
                  <el-option label="企业新闻播报模板 v3" value="TPL-001" />
                  <el-option label="数字人讲解" value="TPL-002" />
                </el-select>
              </el-form-item>
              <el-form-item label="数字人">
                <el-select v-model="config.digitalHuman" style="width: 280px">
                  <el-option v-for="dh in digitalHumans" :key="dh.id" :label="dh.name" :value="dh.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="语音风格">
                <el-radio-group v-model="config.voice">
                  <el-radio value="知性女声">知性女声</el-radio>
                  <el-radio value="科技男声">科技男声</el-radio>
                  <el-radio value="亲和女声">亲和女声</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="字幕">
                <el-switch v-model="config.subtitle" />
                <el-select v-if="config.subtitle" v-model="config.subtitleStyle" style="width: 160px; margin-left: 12px">
                  <el-option label="标准样式" value="standard" />
                  <el-option label="品牌样式" value="brand" />
                  <el-option label="简约样式" value="minimal" />
                </el-select>
              </el-form-item>
              <el-form-item label="封面">
                <el-switch v-model="config.cover" />
                <el-select v-if="config.cover" v-model="config.coverTemplate" style="width: 160px; margin-left: 12px">
                  <el-option label="自动生成" value="auto" />
                  <el-option label="模板封面" value="template" />
                  <el-option label="首帧截取" value="frame" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>

          <!-- Step 4: Audit Strategy -->
          <div v-show="currentStep === 3">
            <h3 class="step-title">审核策略</h3>
            <p class="step-desc">配置机器质检与人工审核策略，保障内容合规</p>
            <el-form label-width="120px" class="config-form">
              <el-form-item label="审核模式">
                <el-radio-group v-model="config.auditStrategy">
                  <el-radio value="machine_first">机器优先（推荐）</el-radio>
                  <el-radio value="human_first">人工优先</el-radio>
                  <el-radio value="machine_only">仅机器审核</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="人工抽检率">
                <el-slider v-model="config.sampleRate" :min="0" :max="100" show-input style="max-width: 400px" />
              </el-form-item>
              <el-form-item label="风险阈值">
                <el-radio-group v-model="config.riskLevel">
                  <el-radio value="low">宽松（低风险拦截）</el-radio>
                  <el-radio value="medium">标准（中风险拦截）</el-radio>
                  <el-radio value="high">严格（高风险拦截）</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
            <div class="audit-rules page-card">
              <h4>适用审核规则</h4>
              <div class="rule-list">
                <el-tag>R-01 违禁词检测</el-tag>
                <el-tag>R-03 医疗功效</el-tag>
                <el-tag>R-07 版权检测</el-tag>
                <el-tag>R-08 夸大宣传</el-tag>
                <el-tag>R-12 字幕纠错</el-tag>
              </div>
            </div>
          </div>

          <!-- Step 5: Publish Config -->
          <div v-show="currentStep === 4">
            <h3 class="step-title">发布配置</h3>
            <p class="step-desc">配置发布渠道与生产规模参数</p>
            <el-form label-width="120px" class="config-form">
              <el-form-item label="发布渠道">
                <el-checkbox-group v-model="config.channels">
                  <el-checkbox label="抖音" value="抖音" />
                  <el-checkbox label="视频号" value="视频号" />
                  <el-checkbox label="官网" value="官网" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="发布方式">
                <el-radio-group v-model="config.publishMode">
                  <el-radio value="immediate">审核通过后立即发布</el-radio>
                  <el-radio value="scheduled">定时发布</el-radio>
                </el-radio-group>
                <el-time-select
                  v-if="config.publishMode === 'scheduled'"
                  v-model="config.publishTime"
                  start="08:00"
                  step="01:00"
                  end="22:00"
                  style="width: 120px; margin-left: 12px"
                />
              </el-form-item>
              <el-divider />
              <el-form-item label="生产总量">
                <el-input-number v-model="config.totalCount" :min="100" :max="100000" :step="1000" />
                <span class="form-hint">条视频</span>
              </el-form-item>
              <el-form-item label="分批数量">
                <el-input-number v-model="config.batchCount" :min="1" :max="100" />
                <span class="form-hint">批（每批约 {{ Math.ceil(config.totalCount / config.batchCount).toLocaleString() }} 条）</span>
              </el-form-item>
              <el-form-item label="并发数">
                <el-input-number v-model="config.concurrency" :min="1" :max="256" />
                <span class="form-hint">路并发（当前队列可用 142 路）</span>
              </el-form-item>
            </el-form>
          </div>

          <div class="step-actions">
            <el-button v-if="currentStep > 0" :icon="ArrowLeft" @click="prevStep">上一步</el-button>
            <el-button v-if="currentStep < 4" type="primary" @click="nextStep">
              下一步 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
            <el-button v-if="currentStep === 4" type="primary" :icon="Check" @click="submitTask">
              提交任务
            </el-button>
          </div>
        </div>
      </div>

      <aside class="summary-panel">
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
          <div class="cost-breakdown">
            <div class="cost-row">
              <span>视频合成</span>
              <span>¥ {{ Math.round(estimatedCost * 0.45).toLocaleString() }}</span>
            </div>
            <div class="cost-row">
              <span>数字人播报</span>
              <span>¥ {{ Math.round(estimatedCost * 0.27).toLocaleString() }}</span>
            </div>
            <div class="cost-row">
              <span>语音合成</span>
              <span>¥ {{ Math.round(estimatedCost * 0.18).toLocaleString() }}</span>
            </div>
            <div class="cost-row">
              <span>素材处理</span>
              <span>¥ {{ Math.round(estimatedCost * 0.1).toLocaleString() }}</span>
            </div>
          </div>
          <div class="cost-tip">基于 {{ config.totalCount.toLocaleString() }} 条 × ¥1.86/条估算</div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.create-task {
  max-width: 1400px;
}

.wizard-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
}

.steps-card {
  padding: 20px 24px;
  margin-bottom: 16px;
}

.step-content {
  padding: 24px;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
}

.step-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-bottom: 20px;
}

.type-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.type-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 12px;
  border: 2px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
  position: relative;
  font-size: 13px;
  font-weight: 500;
}

.type-card:hover {
  border-color: var(--accent);
  background: #f8fafc;
}

.type-card.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, white);
}

.check-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  color: var(--accent);
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px;
  border: 2px dashed var(--border);
  background: #f8fafc;
}

.upload-hint {
  font-size: 12px;
  color: var(--text-secondary);
}

.config-form {
  max-width: 600px;
}

.form-hint {
  margin-left: 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

.audit-rules {
  padding: 16px;
  margin-top: 16px;
  background: #f8fafc;
}

.audit-rules h4 {
  font-size: 13px;
  margin-bottom: 10px;
}

.rule-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.step-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.summary-card,
.cost-card {
  padding: 16px;
}

.summary-card h3,
.cost-card h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 14px;
}

.summary-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.summary-label {
  color: var(--text-secondary);
}

.summary-value {
  font-weight: 500;
  text-align: right;
  max-width: 160px;
}

.cost-card {
  margin-top: 12px;
  background: linear-gradient(180deg, #fff 0%, #f0f9ff 100%);
}

.cost-amount {
  font-size: 28px;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 14px;
}

.cost-breakdown {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.cost-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.cost-tip {
  font-size: 11px;
  color: var(--text-secondary);
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

@media (max-width: 1100px) {
  .wizard-layout {
    grid-template-columns: 1fr;
  }

  .type-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .type-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
