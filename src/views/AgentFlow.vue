<script setup>
import { ref, computed } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'
import { ElMessage } from 'element-plus'

const { onConnect, addEdges } = useVueFlow()

const nodeDefs = [
  { id: 'start', label: '开始', type: 'input', x: 40, y: 200 },
  { id: 'script', label: '脚本生成', x: 180, y: 200 },
  { id: 'storyboard', label: '分镜生成', x: 340, y: 200 },
  { id: 'asset', label: '素材匹配', x: 500, y: 200 },
  { id: 'voice', label: '配音', x: 660, y: 120 },
  { id: 'avatar', label: '数字人', x: 660, y: 280 },
  { id: 'subtitle', label: '字幕封面', x: 820, y: 200 },
  { id: 'qc', label: '机器质检', x: 980, y: 200 },
  { id: 'qc-result', label: '质检结果', x: 1140, y: 200, decision: true },
  { id: 'fix', label: '问题处理', x: 1300, y: 80 },
  { id: 'manual', label: '人工审核', x: 1300, y: 200 },
  { id: 'publish', label: '发布打包', x: 1460, y: 200 },
  { id: 'end', label: '结束', type: 'output', x: 1620, y: 200 },
]

const defaultConfigs = {
  start: { model: '-', retry: 0, riskHigh: 0, riskMedium: 0, manualAudit: false },
  script: { model: 'GPT-4o', retry: 2, riskHigh: 80, riskMedium: 60, manualAudit: false },
  storyboard: { model: 'Claude-3.5', retry: 2, riskHigh: 75, riskMedium: 55, manualAudit: false },
  asset: { model: '素材检索 v2', retry: 3, riskHigh: 70, riskMedium: 50, manualAudit: false },
  voice: { model: 'TTS-Pro', retry: 2, riskHigh: 65, riskMedium: 45, manualAudit: false },
  avatar: { model: '数字人-小妍', retry: 2, riskHigh: 70, riskMedium: 50, manualAudit: true },
  subtitle: { model: '字幕引擎 v3', retry: 1, riskHigh: 60, riskMedium: 40, manualAudit: false },
  qc: { model: '质检模型 v2', retry: 1, riskHigh: 85, riskMedium: 65, manualAudit: false },
  'qc-result': { model: '规则引擎', retry: 0, riskHigh: 90, riskMedium: 70, manualAudit: true },
  fix: { model: '修复 Agent', retry: 3, riskHigh: 80, riskMedium: 60, manualAudit: false },
  manual: { model: '-', retry: 0, riskHigh: 100, riskMedium: 80, manualAudit: true },
  publish: { model: '发布编排', retry: 2, riskHigh: 70, riskMedium: 50, manualAudit: false },
  end: { model: '-', retry: 0, riskHigh: 0, riskMedium: 0, manualAudit: false },
}

const nodeConfigs = ref(
  Object.fromEntries(
    nodeDefs.map((n) => [n.id, { ...defaultConfigs[n.id] }])
  )
)

const nodes = ref(
  nodeDefs.map((n) => ({
    id: n.id,
    type: 'default',
    position: { x: n.x, y: n.y },
    data: { label: n.label, decision: n.decision },
    class: n.decision ? 'decision-node' : n.type === 'input' ? 'start-node' : n.type === 'output' ? 'end-node' : '',
  }))
)

const edges = ref([
  { id: 'e1', source: 'start', target: 'script', animated: false },
  { id: 'e2', source: 'script', target: 'storyboard' },
  { id: 'e3', source: 'storyboard', target: 'asset' },
  { id: 'e4', source: 'asset', target: 'voice' },
  { id: 'e5', source: 'asset', target: 'avatar' },
  { id: 'e6', source: 'voice', target: 'subtitle' },
  { id: 'e7', source: 'avatar', target: 'subtitle' },
  { id: 'e8', source: 'subtitle', target: 'qc' },
  { id: 'e9', source: 'qc', target: 'qc-result' },
  { id: 'e10', source: 'qc-result', target: 'fix', label: '不通过' },
  { id: 'e11', source: 'qc-result', target: 'manual', label: '待审' },
  { id: 'e12', source: 'fix', target: 'qc' },
  { id: 'e13', source: 'manual', target: 'publish' },
  { id: 'e14', source: 'publish', target: 'end' },
])

const selectedNodeId = ref('script')
const isRunning = ref(false)
const showLog = ref(true)

const runStatuses = ref(
  Object.fromEntries(nodeDefs.map((n) => [n.id, { status: 'idle', duration: '-', success: 0, fail: 0 }]))
)

const runLogs = ref([])

const selectedLabel = computed(
  () => nodeDefs.find((n) => n.id === selectedNodeId.value)?.label || ''
)

const runOverviewRows = computed(() =>
  nodeDefs
    .filter((n) => !['start', 'end'].includes(n.id))
    .map((n) => ({
      id: n.id,
      name: n.label,
      model: nodeConfigs.value[n.id]?.model || '-',
      ...runStatuses.value[n.id],
    }))
)

onConnect((params) => {
  addEdges([{ ...params, id: `e-${Date.now()}`, animated: false }])
})

function onNodeClick({ node }) {
  selectedNodeId.value = node.id
}

function addLog(level, message) {
  runLogs.value.unshift({
    time: new Date().toLocaleTimeString('zh-CN'),
    level,
    message,
  })
}

function saveTemplate() {
  ElMessage.success('流程已保存为模板「科普短视频标准编排 v2」')
  addLog('info', '保存为模板成功')
}

function publishFlow() {
  ElMessage.success('流程已发布，可在创建任务时选用')
  addLog('info', '发布流程成功')
}

const runOrder = [
  'start', 'script', 'storyboard', 'asset', 'voice', 'avatar',
  'subtitle', 'qc', 'qc-result', 'manual', 'publish', 'end',
]

function resetRunStatuses() {
  nodeDefs.forEach((n) => {
    runStatuses.value[n.id] = { status: 'idle', duration: '-', success: 0, fail: 0 }
  })
}

async function runFlow() {
  if (isRunning.value) return
  isRunning.value = true
  resetRunStatuses()
  runLogs.value = []
  addLog('info', '开始运行流程模拟…')

  for (const nodeId of runOrder) {
    const label = nodeDefs.find((n) => n.id === nodeId)?.label
    runStatuses.value[nodeId].status = 'running'
    addLog('info', `节点「${label}」开始执行`)
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400))

    const fail = nodeId === 'asset' ? Math.floor(Math.random() * 3) : 0
    runStatuses.value[nodeId] = {
      status: 'success',
      duration: `${(0.5 + Math.random() * 2).toFixed(1)}s`,
      success: 100 - fail,
      fail,
    }
    addLog('success', `节点「${label}」执行完成，成功 ${100 - fail}，失败 ${fail}`)
  }

  isRunning.value = false
  addLog('success', '流程运行完成')
  ElMessage.success('流程模拟运行完成')
}
</script>

<template>
  <div class="page-shell agent-flow-page">
    <div class="page-toolbar with-actions">
      <span />
      <div class="page-toolbar-actions">
        <el-button size="small" @click="saveTemplate">保存模板</el-button>
        <el-button size="small" type="primary" plain @click="publishFlow">发布</el-button>
        <el-button size="small" type="primary" :loading="isRunning" @click="runFlow">运行流程</el-button>
      </div>
    </div>

    <div class="flow-layout">
      <div class="canvas-wrap page-card">
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :default-viewport="{ zoom: 0.75, x: 0, y: 0 }"
          :min-zoom="0.3"
          :max-zoom="1.5"
          fit-view-on-init
          @node-click="onNodeClick"
        >
          <Background pattern-color="#e2e8f0" :gap="16" />
          <Controls />
          <MiniMap pannable zoomable />
        </VueFlow>
      </div>

      <aside class="config-panel page-card">
        <h3>节点配置</h3>
        <p class="panel-sub">{{ selectedLabel }}</p>
        <el-form label-position="top" size="small">
          <el-form-item label="模型 / 引擎">
            <el-select v-model="nodeConfigs[selectedNodeId].model" style="width: 100%">
              <el-option label="GPT-4o" value="GPT-4o" />
              <el-option label="Claude-3.5" value="Claude-3.5" />
              <el-option label="素材检索 v2" value="素材检索 v2" />
              <el-option label="TTS-Pro" value="TTS-Pro" />
              <el-option label="数字人-小妍" value="数字人-小妍" />
              <el-option label="质检模型 v2" value="质检模型 v2" />
              <el-option label="规则引擎" value="规则引擎" />
              <el-option label="-" value="-" />
            </el-select>
          </el-form-item>
          <el-form-item label="失败重试次数">
            <el-input-number v-model="nodeConfigs[selectedNodeId].retry" :min="0" :max="5" style="width: 100%" />
          </el-form-item>
          <el-form-item label="高风险阈值">
            <el-slider v-model="nodeConfigs[selectedNodeId].riskHigh" :min="0" :max="100" show-input />
          </el-form-item>
          <el-form-item label="中风险阈值">
            <el-slider v-model="nodeConfigs[selectedNodeId].riskMedium" :min="0" :max="100" show-input />
          </el-form-item>
          <el-form-item label="强制人工审核">
            <el-switch v-model="nodeConfigs[selectedNodeId].manualAudit" />
          </el-form-item>
        </el-form>
      </aside>
    </div>

    <div class="bottom-panels">
      <div class="run-table page-card">
        <div class="section-head">
          <h3>运行概览</h3>
          <el-tag v-if="isRunning" type="primary" effect="plain" size="small">运行中</el-tag>
          <el-tag v-else type="info" effect="plain" size="small">空闲</el-tag>
        </div>
        <el-table :data="runOverviewRows" size="small" height="120" stripe>
          <el-table-column prop="name" label="节点" width="100" />
          <el-table-column prop="model" label="模型" width="120" />
          <el-table-column label="状态" width="90">
            <template #default="{ row }">
              <el-tag
                :type="row.status === 'success' ? 'success' : row.status === 'running' ? 'primary' : 'info'"
                size="small"
              >
                {{ row.status === 'idle' ? '待运行' : row.status === 'running' ? '运行中' : '已完成' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="耗时" width="80" />
          <el-table-column prop="success" label="成功数" width="70" />
          <el-table-column prop="fail" label="失败数" width="70" />
        </el-table>
      </div>

      <div v-show="showLog" class="run-log page-card">
        <div class="section-head">
          <h3>运行日志</h3>
          <el-button link type="primary" size="small" @click="showLog = !showLog">收起</el-button>
        </div>
        <div class="log-list">
          <div v-for="(log, i) in runLogs" :key="i" class="log-item" :class="log.level">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-msg">{{ log.message }}</span>
          </div>
          <div v-if="!runLogs.length" class="log-empty">暂无日志，点击「运行流程」开始模拟</div>
        </div>
      </div>
      <el-button v-if="!showLog" class="log-toggle" size="small" @click="showLog = true">展开日志</el-button>
    </div>
  </div>
</template>

<style scoped>
.agent-flow-page {
  gap: 8px;
}

.flow-layout {
  display: grid;
  grid-template-columns: 1fr 260px;
  gap: 10px;
  flex: 1;
  min-height: 0;
}

.canvas-wrap {
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.config-panel {
  padding: 10px 12px;
  overflow-y: auto;
  min-height: 0;
}

.config-panel h3,
.section-head h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.panel-sub {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.bottom-panels {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 8px;
  flex-shrink: 0;
  position: relative;
  max-height: 150px;
}

.run-table,
.run-log {
  padding: 8px 12px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.log-list {
  max-height: 100px;
  overflow-y: auto;
  font-size: 11px;
}

.log-item {
  padding: 4px 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 8px;
}

.log-time {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.log-item.success .log-msg {
  color: #22c55e;
}

.log-item.info .log-msg {
  color: var(--text-primary);
}

.log-empty {
  color: var(--text-secondary);
  padding: 20px 0;
  text-align: center;
}

.log-toggle {
  position: absolute;
  right: 0;
  bottom: 0;
}

:deep(.vue-flow__node) {
  border-radius: 10px;
  font-size: 12px;
  padding: 10px 16px;
  border: 1px solid rgba(99, 102, 241, 0.2);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
  font-weight: 500;
}

:deep(.vue-flow__node.selected) {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px rgba(0, 180, 216, 0.25), 0 4px 16px rgba(0, 180, 216, 0.15);
}

:deep(.decision-node) {
  border-color: rgba(245, 158, 11, 0.4);
  background: rgba(245, 158, 11, 0.08);
  transform: rotate(0deg);
  border-radius: 6px;
}

:deep(.start-node) {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.08);
}

:deep(.end-node) {
  border-color: rgba(99, 102, 241, 0.3);
  background: rgba(99, 102, 241, 0.06);
}

:deep(.vue-flow__edge-path) {
  stroke: rgba(0, 180, 216, 0.5);
  stroke-width: 2;
}

:deep(.vue-flow__background) {
  background: rgba(99, 102, 241, 0.02);
}
</style>
