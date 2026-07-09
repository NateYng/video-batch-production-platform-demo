<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentCopy, Clock, Monitor, Plus, ArrowRight,
} from '@element-plus/icons-vue'
import { useAssetStore } from '@/stores'
import { templateRecords } from '@/mock'

const router = useRouter()
const assetStore = useAssetStore()

const activeType = ref('全部')
const selectedTemplate = ref(null)

const typeTabs = ['全部', '企业新闻播报', '数字人讲解', '科普视频', '宣传片', '宣传视频']

const filteredTemplates = computed(() => {
  if (activeType.value === '全部') return assetStore.templateList
  return assetStore.templateList.filter((t) => t.type === activeType.value)
})

const statusMap = {
  published: { label: '已发布', type: 'success' },
  draft: { label: '草稿', type: 'info' },
  optimize: { label: '待优化', type: 'warning' },
}

const recordStatusMap = {
  completed: { label: '已完成', type: 'success' },
  partial_fail: { label: '部分失败', type: 'warning' },
  running: { label: '运行中', type: 'primary' },
}

const badgeColors = {
  已发布: '#22c55e',
  高复用: '#0ea5e9',
  草稿: '#94a3b8',
  待优化: '#f59e0b',
}

const templateVariables = [
  { name: '{{title}}', desc: '视频标题', example: '科技新品宣传' },
  { name: '{{subtitle}}', desc: '副标题', example: '智能未来已来' },
  { name: '{{content}}', desc: '正文脚本', example: '本期为您介绍...' },
  { name: '{{cta}}', desc: '行动号召', example: '立即了解更多' },
]

const outputPackage = [
  { name: '竖屏 9:16', resolution: '1080×1920', format: 'MP4 H.264' },
  { name: '横屏 16:9', resolution: '1920×1080', format: 'MP4 H.264' },
  { name: '封面图', resolution: '1080×1920', format: 'JPG' },
  { name: '字幕文件', resolution: '-', format: 'SRT' },
]

function selectTemplate(tpl) {
  selectedTemplate.value = tpl
}

function createFromTemplate() {
  router.push('/create-task')
}

// Auto-select first template
if (assetStore.templateList.length && !selectedTemplate.value) {
  selectedTemplate.value = assetStore.templateList[0]
}
</script>

<template>
  <div class="template-studio">
    <div class="page-header">
      <div>
        <h1>模板创作台</h1>
        <p>管理和复用视频生产模板，支持变量驱动批量生成</p>
      </div>
      <el-button type="primary" :icon="Plus">新建模板</el-button>
    </div>

    <div class="studio-layout">
      <div class="main-area">
        <div class="page-card tabs-card">
          <el-tabs v-model="activeType">
            <el-tab-pane v-for="tab in typeTabs" :key="tab" :label="tab" :name="tab" />
          </el-tabs>
        </div>

        <div class="template-grid">
          <div
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            class="template-card page-card"
            :class="{ selected: selectedTemplate?.id === tpl.id }"
            @click="selectTemplate(tpl)"
          >
            <div class="tpl-preview">
              <el-icon :size="36" color="#94a3b8"><DocumentCopy /></el-icon>
              <span
                class="tpl-badge"
                :style="{ background: badgeColors[tpl.badge] || '#64748b' }"
              >{{ tpl.badge }}</span>
            </div>
            <div class="tpl-body">
              <h4>{{ tpl.name }}</h4>
              <div class="tpl-tags">
                <el-tag v-for="tag in tpl.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
              </div>
              <div class="tpl-meta">
                <span><el-icon><Clock /></el-icon> {{ tpl.duration }}</span>
                <span><el-icon><Monitor /></el-icon> {{ tpl.resolution }}</span>
              </div>
              <div class="tpl-stats">
                <span>使用 <b>{{ tpl.uses.toLocaleString() }}</b> 次</span>
                <span>完成率 <b>{{ tpl.completion }}%</b></span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-card records-card">
          <div class="card-header">
            <h3>生成记录</h3>
            <el-button text type="primary">查看全部 →</el-button>
          </div>
          <el-table :data="templateRecords" stripe>
            <el-table-column prop="taskId" label="任务 ID" width="160" />
            <el-table-column prop="template" label="使用模板" min-width="180" />
            <el-table-column label="生成量" width="100" align="right">
              <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="成功数" width="100" align="right">
              <template #default="{ row }">{{ row.success.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column label="完成率" width="100">
              <template #default="{ row }">{{ row.completion }}%</template>
            </el-table-column>
            <el-table-column label="趋势" width="80">
              <template #default="{ row }">
                <span :class="row.trend >= 0 ? 'trend-up' : 'trend-down'">
                  {{ row.trend >= 0 ? '↑' : '↓' }} {{ Math.abs(row.trend) }}%
                </span>
              </template>
            </el-table-column>
            <el-table-column label="渠道" width="140">
              <template #default="{ row }">
                <el-tag v-for="ch in row.channels" :key="ch" size="small" style="margin-right: 4px">{{ ch }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="recordStatusMap[row.status]?.type" size="small">
                  {{ recordStatusMap[row.status]?.label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="完成时间" width="160" />
          </el-table>
        </div>
      </div>

      <aside v-if="selectedTemplate" class="detail-panel">
        <div class="page-card detail-card">
          <div class="detail-header">
            <h3>{{ selectedTemplate.name }}</h3>
            <el-tag :type="statusMap[selectedTemplate.status]?.type" size="small">
              {{ statusMap[selectedTemplate.status]?.label }}
            </el-tag>
          </div>
          <div class="detail-meta">
            <div class="meta-row">
              <span>模板 ID</span>
              <span>{{ selectedTemplate.id }}</span>
            </div>
            <div class="meta-row">
              <span>视频类型</span>
              <span>{{ selectedTemplate.type }}</span>
            </div>
            <div class="meta-row">
              <span>时长范围</span>
              <span>{{ selectedTemplate.duration }}</span>
            </div>
            <div class="meta-row">
              <span>分辨率</span>
              <span>{{ selectedTemplate.resolution }}</span>
            </div>
            <div class="meta-row">
              <span>最近更新</span>
              <span>{{ selectedTemplate.updated }}</span>
            </div>
          </div>

          <el-button type="primary" class="create-btn" @click="createFromTemplate">
            从模板生成 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="page-card detail-card">
          <h4>模板变量</h4>
          <div class="variable-list">
            <div v-for="v in templateVariables" :key="v.name" class="variable-item">
              <code>{{ v.name }}</code>
              <span class="var-desc">{{ v.desc }}</span>
              <span class="var-example">{{ v.example }}</span>
            </div>
          </div>
        </div>

        <div class="page-card detail-card">
          <h4>适用渠道</h4>
          <div class="channel-tags">
            <el-tag type="primary">抖音</el-tag>
            <el-tag type="success">视频号</el-tag>
            <el-tag>官网</el-tag>
          </div>
        </div>

        <div class="page-card detail-card">
          <h4>输出规格</h4>
          <div class="output-list">
            <div v-for="pkg in outputPackage" :key="pkg.name" class="output-item">
              <span class="output-name">{{ pkg.name }}</span>
              <span class="output-spec">{{ pkg.resolution }} · {{ pkg.format }}</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.template-studio {
  max-width: 1600px;
}

.studio-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 16px;
  align-items: start;
}

.tabs-card {
  padding: 0 16px;
  margin-bottom: 16px;
}

.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-bottom: 16px;
}

.template-card {
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s, box-shadow 0.15s, border-color 0.15s;
  border: 2px solid transparent;
}

.template-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.1);
}

.template-card.selected {
  border-color: var(--primary);
}

.tpl-preview {
  height: 120px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.tpl-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 11px;
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.tpl-body {
  padding: 14px;
}

.tpl-body h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tpl-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 10px;
}

.tpl-meta {
  display: flex;
  gap: 12px;
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.tpl-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.tpl-stats {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.tpl-stats b {
  color: var(--text-primary);
}

.records-card {
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
}

.trend-up {
  color: #22c55e;
  font-size: 12px;
}

.trend-down {
  color: #ef4444;
  font-size: 12px;
}

.detail-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;
}

.detail-card {
  padding: 16px;
}

.detail-card h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 12px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.detail-header h3 {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.3;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.meta-row span:first-child {
  color: var(--text-secondary);
}

.create-btn {
  width: 100%;
}

.variable-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.variable-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.variable-item code {
  font-size: 12px;
  color: var(--primary);
  font-weight: 600;
}

.var-desc {
  font-size: 11px;
  color: var(--text-secondary);
}

.var-example {
  font-size: 11px;
  color: var(--text-primary);
  font-style: italic;
}

.channel-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.output-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.output-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 6px;
}

.output-name {
  font-weight: 500;
}

.output-spec {
  color: var(--text-secondary);
}

@media (max-width: 1200px) {
  .studio-layout {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    position: static;
  }
}
</style>
