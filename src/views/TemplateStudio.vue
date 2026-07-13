<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  DocumentCopy, Clock, Monitor, Plus, ArrowRight, VideoPlay,
} from '@element-plus/icons-vue'
import { useAssetStore } from '@/stores'
import { templateRecords } from '@/mock'
import { coverFor } from '@/mock/media'

const router = useRouter()
const assetStore = useAssetStore()

const activeType = ref('全部')
const selectedTemplate = ref(null)
const detailTab = ref('info')

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
  已发布: '#217a4b',
  高复用: '#635bff',
  草稿: '#8792a2',
  待优化: '#b3861a',
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

if (assetStore.templateList.length && !selectedTemplate.value) {
  selectedTemplate.value = assetStore.templateList[0]
}
</script>

<template>
  <div class="page-shell template-studio">
    <div class="page-toolbar with-actions">
      <el-tabs v-model="activeType" class="compact-tabs">
        <el-tab-pane v-for="tab in typeTabs" :key="tab" :label="tab" :name="tab" />
      </el-tabs>
      <el-button type="primary" size="small" :icon="Plus">新建模板</el-button>
    </div>

    <div class="page-split wide-side">
      <div class="page-split-main">
        <div class="template-grid compact">
          <div
            v-for="tpl in filteredTemplates"
            :key="tpl.id"
            class="template-card"
            :class="{ selected: selectedTemplate?.id === tpl.id }"
            @click="selectTemplate(tpl)"
          >
            <div class="tpl-preview">
              <img :src="coverFor(tpl.id)" class="tpl-cover" alt="" />
              <div class="tpl-overlay">
                <span class="tpl-type">{{ tpl.type }}</span>
                <span class="tpl-spec">{{ tpl.duration }} · {{ tpl.resolution }}</span>
              </div>
              <div class="tpl-play">
                <el-icon :size="16"><VideoPlay /></el-icon>
              </div>
              <span class="tpl-badge" :style="{ background: badgeColors[tpl.badge] || '#64748b' }">{{ tpl.badge }}</span>
            </div>
            <div class="tpl-body">
              <h4>{{ tpl.name }}</h4>
              <div class="tpl-stats">
                <span>{{ tpl.uses.toLocaleString() }} 次</span>
                <span>{{ tpl.completion }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-card fill-card records-card">
          <div class="card-header">
            <h3>生成记录</h3>
          </div>
          <div class="table-flex">
            <el-table :data="templateRecords" stripe size="small">
              <el-table-column prop="taskId" label="任务 ID" width="140" show-overflow-tooltip />
              <el-table-column prop="template" label="模板" min-width="140" show-overflow-tooltip />
              <el-table-column label="生成量" width="80" align="right">
                <template #default="{ row }">{{ row.count.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column label="成功" width="80" align="right">
                <template #default="{ row }">{{ row.success.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column label="完成率" width="75">
                <template #default="{ row }">{{ row.completion }}%</template>
              </el-table-column>
              <el-table-column label="状态" width="90">
                <template #default="{ row }">
                  <el-tag :type="recordStatusMap[row.status]?.type" size="small">{{ recordStatusMap[row.status]?.label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="time" label="时间" width="140" />
            </el-table>
          </div>
        </div>
      </div>

      <aside v-if="selectedTemplate" class="page-split-side">
        <div class="page-card fill-card detail-panel">
          <div class="detail-header">
            <h3>{{ selectedTemplate.name }}</h3>
            <el-tag :type="statusMap[selectedTemplate.status]?.type" size="small">{{ statusMap[selectedTemplate.status]?.label }}</el-tag>
          </div>
          <el-button type="primary" size="small" class="create-btn" @click="createFromTemplate">
            从模板生成 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>

          <el-tabs v-model="detailTab" class="compact-tabs side-tabs">
            <el-tab-pane label="信息" name="info">
              <div class="meta-row"><span>ID</span><span>{{ selectedTemplate.id }}</span></div>
              <div class="meta-row"><span>类型</span><span>{{ selectedTemplate.type }}</span></div>
              <div class="meta-row"><span>时长</span><span>{{ selectedTemplate.duration }}</span></div>
              <div class="meta-row"><span>分辨率</span><span>{{ selectedTemplate.resolution }}</span></div>
              <div class="meta-row"><span>更新</span><span>{{ selectedTemplate.updated }}</span></div>
            </el-tab-pane>
            <el-tab-pane label="变量" name="vars">
              <div v-for="v in templateVariables" :key="v.name" class="variable-item">
                <code>{{ v.name }}</code>
                <span class="var-desc">{{ v.desc }} · {{ v.example }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="输出" name="output">
              <div v-for="pkg in outputPackage" :key="pkg.name" class="output-item">
                <span>{{ pkg.name }}</span>
                <span>{{ pkg.resolution }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-toolbar.with-actions .compact-tabs {
  flex: 1;
}

.page-toolbar.with-actions :deep(.el-tabs__header) {
  margin-bottom: 0;
}

.page-split-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-panel {
  padding: 10px 12px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 8px;
}

.detail-header h3 {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.create-btn {
  width: 100%;
  margin-bottom: 8px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 4px 0;
  border-bottom: 1px solid var(--border);
}

.meta-row span:first-child { color: var(--text-secondary); }

.variable-item {
  padding: 6px;
  background: rgba(148, 155, 175, 0.05);
  border-radius: 4px;
  margin-bottom: 6px;
}

.variable-item code {
  font-size: 11px;
  color: var(--primary);
}

.var-desc {
  font-size: 10px;
  color: var(--text-secondary);
}

.output-item {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  padding: 5px 0;
  border-bottom: 1px solid var(--border);
}
</style>
