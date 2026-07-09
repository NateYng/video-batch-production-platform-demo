<script setup>
import { ref, computed } from 'vue'
import { useAuditStore } from '@/stores'
import { auditRules } from '@/mock'
import { ElMessage } from 'element-plus'
import { videoMedia } from '@/mock/media'

const auditStore = useAuditStore()

const activeRiskTab = ref('high')
const selectedItem = ref(auditStore.items[0] || null)

const riskTabs = [
  { key: 'high', label: '高风险', count: 42 },
  { key: 'medium', label: '中风险', count: 318 },
  { key: 'low', label: '低风险', count: 6920 },
]

const filteredItems = computed(() => {
  if (activeRiskTab.value === 'high') return auditStore.items.filter((i) => i.riskLevel === 'high')
  if (activeRiskTab.value === 'medium') return auditStore.items.filter((i) => i.riskLevel === 'medium')
  return auditStore.items.filter((i) => i.score >= 85)
})

const scoreColor = (score) => {
  if (score < 70) return '#fb7185'
  if (score < 85) return '#fbbf24'
  return '#34d399'
}

function selectItem(row) {
  selectedItem.value = row
}

const riskDetails = computed(() => {
  if (!selectedItem.value) return []
  return selectedItem.value.rules.map((r, i) => ({
    rule: r,
    risk: selectedItem.value.risks[i] || selectedItem.value.risks[0],
    score: selectedItem.value.score - i * 5,
    action: selectedItem.value.suggest,
  }))
})

const auditHistory = [
  { time: '2025-05-20 14:30', action: '机器质检', result: '高风险', operator: '系统' },
  { time: '2025-05-20 14:25', action: '规则命中', result: 'R-01 违禁词', operator: '系统' },
  { time: '2025-05-20 14:20', action: '分配审核员', result: '张晓明', operator: '系统' },
]

function approve() {
  if (!selectedItem.value) return
  const id = selectedItem.value.id
  auditStore.approve(id)
  selectedItem.value = auditStore.items[0] || null
  ElMessage.success('已通过审核')
}

function reject() {
  if (!selectedItem.value) return
  auditStore.reject(selectedItem.value.id)
  ElMessage.warning('已驳回')
}

function returnForEdit() {
  if (!selectedItem.value) return
  selectedItem.value.suggest = '打回修改'
  ElMessage.info('已打回修改')
}

function partialRegen() {
  ElMessage.success('已触发局部重生成（字幕+封面）')
}
</script>

<template>
  <div class="page-shell audit-page">
    <div class="count-cards compact">
      <div class="count-card page-card high"><span class="count">42</span><span class="label">高风险</span></div>
      <div class="count-card page-card medium"><span class="count">318</span><span class="label">中风险</span></div>
      <div class="count-card page-card low"><span class="count">6920</span><span class="label">低风险</span></div>
      <div class="count-card page-card passed"><span class="count">1286</span><span class="label">今日通过</span></div>
    </div>

    <div class="page-split wide-side">
      <div class="page-split-main">
        <div class="page-card fill-card table-section">
          <el-tabs v-model="activeRiskTab" class="compact-tabs">
            <el-tab-pane v-for="tab in riskTabs" :key="tab.key" :name="tab.key">
              <template #label>
                {{ tab.label }}
                <el-badge :value="tab.count" :max="9999" class="tab-badge" />
              </template>
            </el-tab-pane>
          </el-tabs>

          <div class="table-flex">
          <el-table
            :data="filteredItems"
            stripe
            highlight-current-row
            size="small"
            @row-click="selectItem"
          >
            <el-table-column prop="id" label="视频 ID" width="150" />
            <el-table-column prop="title" label="标题" min-width="140" show-overflow-tooltip />
            <el-table-column prop="type" label="类型" width="90" />
            <el-table-column label="AI 评分" width="90">
              <template #default="{ row }">
                <span :style="{ color: scoreColor(row.score), fontWeight: 600 }">{{ row.score }}</span>
              </template>
            </el-table-column>
            <el-table-column label="命中规则" min-width="160">
              <template #default="{ row }">
                <el-tag v-for="r in row.rules" :key="r" size="small" effect="plain" style="margin-right: 4px">
                  {{ r.split(' ')[0] }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="suggest" label="建议操作" width="100" />
            <el-table-column prop="deadline" label="时限" width="100" />
          </el-table>
          </div>
        </div>
      </div>

      <aside v-if="selectedItem" class="page-split-side audit-sidebar">
        <div class="page-card fill-card sidebar-block">
          <video
            :key="selectedItem.id"
            class="audit-player"
            :src="videoMedia(selectedItem.id, selectedItem.title).src"
            :poster="videoMedia(selectedItem.id, selectedItem.title).poster"
            controls
            preload="metadata"
            muted
          />
          <h3 class="side-title">{{ selectedItem.title }}</h3>
          <p class="item-meta">{{ selectedItem.id }} · {{ selectedItem.type }}</p>
          <div class="score-badge" :style="{ borderColor: scoreColor(selectedItem.score) }">
            AI <strong :style="{ color: scoreColor(selectedItem.score) }">{{ selectedItem.score }}</strong>
          </div>
          <el-table :data="riskDetails" size="small" class="mini-table">
            <el-table-column prop="rule" label="规则" show-overflow-tooltip />
            <el-table-column prop="action" label="建议" width="64" />
          </el-table>
          <div class="action-bar">
            <el-button type="success" size="small" @click="approve">通过</el-button>
            <el-button type="danger" size="small" @click="reject">驳回</el-button>
            <el-button type="warning" plain size="small" @click="returnForEdit">打回</el-button>
            <el-button plain size="small" @click="partialRegen">重生成</el-button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.tab-badge { margin-left: 4px; }

.sidebar-block {
  overflow-y: auto;
}

.side-title {
  font-size: 13px;
  margin: 8px 0 4px;
}

.audit-player {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  background: #000;
  border: 1px solid var(--border);
  display: block;
  object-fit: cover;
}

.preview-box {
  aspect-ratio: 16/9;
  max-height: 100px;
  background: rgba(148, 155, 175, 0.07);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-tertiary);
  font-size: 11px;
  border: 1px solid var(--border);
}

.item-meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.score-badge {
  padding: 6px 10px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 11px;
  text-align: center;
  margin-bottom: 8px;
}

.mini-table {
  margin-bottom: 8px;
}

.action-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.action-bar .el-button {
  margin: 0;
}
</style>
