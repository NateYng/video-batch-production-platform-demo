<script setup>
import { ref, computed } from 'vue'
import { useAuditStore } from '@/stores'
import { auditRules } from '@/mock'
import { ElMessage } from 'element-plus'

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
  if (score < 70) return '#ef4444'
  if (score < 85) return '#f59e0b'
  return '#22c55e'
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
  <div class="audit-page dark-page">
    <div class="page-header">
      <div>
        <h1>质检与审核台</h1>
        <p>机器质检 + 人工复核，管理高风险内容与审核规则</p>
      </div>
    </div>

    <div class="count-cards">
      <div class="count-card dark-card high">
        <span class="count">42</span>
        <span class="label">高风险待审</span>
      </div>
      <div class="count-card dark-card medium">
        <span class="count">318</span>
        <span class="label">中风险待审</span>
      </div>
      <div class="count-card dark-card low">
        <span class="count">6920</span>
        <span class="label">低风险</span>
      </div>
      <div class="count-card dark-card passed">
        <span class="count">1286</span>
        <span class="label">今日通过</span>
      </div>
    </div>

    <div class="main-layout">
      <div class="audit-main">
        <div class="dark-card table-section">
          <el-tabs v-model="activeRiskTab">
            <el-tab-pane v-for="tab in riskTabs" :key="tab.key" :name="tab.key">
              <template #label>
                {{ tab.label }}
                <el-badge :value="tab.count" :max="9999" class="tab-badge" />
              </template>
            </el-tab-pane>
          </el-tabs>

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

        <div class="rule-cards">
          <h3>审核规则配置</h3>
          <div class="rule-grid">
            <div v-for="rule in auditRules" :key="rule.name" class="rule-card dark-card">
              <div class="rule-name">{{ rule.name }}</div>
              <div class="rule-scope">{{ rule.scope }}</div>
              <div class="rule-meta">
                <el-tag size="small" type="primary" effect="plain">{{ rule.rule }}</el-tag>
                <span>{{ rule.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <aside v-if="selectedItem" class="audit-sidebar">
        <div class="dark-card sidebar-block">
          <div class="preview-box">
            <el-icon :size="40"><VideoPlay /></el-icon>
            <span>审核预览</span>
          </div>
          <h3>{{ selectedItem.title }}</h3>
          <p class="item-meta">{{ selectedItem.id }} · {{ selectedItem.type }}</p>
          <div class="score-badge" :style="{ borderColor: scoreColor(selectedItem.score) }">
            AI 评分 <strong :style="{ color: scoreColor(selectedItem.score) }">{{ selectedItem.score }}</strong>
          </div>
        </div>

        <div class="dark-card sidebar-block">
          <h4>风险明细</h4>
          <el-table :data="riskDetails" size="small">
            <el-table-column prop="rule" label="规则" show-overflow-tooltip />
            <el-table-column prop="risk" label="风险点" width="100" />
            <el-table-column prop="score" label="分项" width="50" />
            <el-table-column prop="action" label="建议" width="80" />
          </el-table>
        </div>

        <div class="dark-card sidebar-block">
          <h4>审核历史</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(h, i) in auditHistory"
              :key="i"
              :timestamp="h.time"
              placement="top"
            >
              {{ h.action }} — {{ h.result }}（{{ h.operator }}）
            </el-timeline-item>
          </el-timeline>
        </div>

        <div class="action-bar dark-card">
          <el-button type="success" @click="approve">通过</el-button>
          <el-button type="danger" @click="reject">驳回</el-button>
          <el-button type="warning" plain @click="returnForEdit">打回修改</el-button>
          <el-button plain @click="partialRegen">局部重生成</el-button>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.dark-page {
  color: #e2e8f0;
}

.dark-card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 8px;
}

.count-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.count-card {
  padding: 16px 20px;
  text-align: center;
}

.count-card .count {
  display: block;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
}

.count-card .label {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}

.count-card.high .count { color: #ef4444; }
.count-card.medium .count { color: #f59e0b; }
.count-card.low .count { color: #22c55e; }
.count-card.passed .count { color: #0ea5e9; }

.main-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 12px;
}

.table-section {
  padding: 12px 16px;
  margin-bottom: 12px;
}

.tab-badge {
  margin-left: 6px;
}

.rule-cards h3 {
  font-size: 14px;
  margin-bottom: 10px;
}

.rule-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.rule-card {
  padding: 12px 14px;
}

.rule-name {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 4px;
}

.rule-scope {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 8px;
}

.rule-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
}

.audit-sidebar {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-block {
  padding: 14px 16px;
}

.sidebar-block h3 {
  font-size: 14px;
  margin: 8px 0 4px;
}

.sidebar-block h4 {
  font-size: 13px;
  margin-bottom: 10px;
}

.preview-box {
  aspect-ratio: 16/9;
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
}

.item-meta {
  font-size: 11px;
  color: #94a3b8;
  margin-bottom: 10px;
}

.score-badge {
  padding: 8px 12px;
  border: 1px solid;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
}

.action-bar {
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.action-bar .el-button {
  margin: 0;
}
</style>
