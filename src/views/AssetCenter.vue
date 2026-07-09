<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAssetStore } from '@/stores'
import { assetRankings } from '@/mock'
import MetricCard from '@/components/MetricCard.vue'
import {
  Picture, VideoCamera, User, Reading, Link, Checked,
  Upload, PriceTag, DocumentChecked,
} from '@element-plus/icons-vue'

const assetStore = useAssetStore()

const activeTab = ref('全部')
const categoryTabs = ['全部', '品牌资产', '媒体素材', '数字人资产', '知识库', '账号与渠道', '素材审核']

const statCards = [
  { label: '资产总数', value: 32846, trend: 6.2 },
  { label: '本周新增', value: 1428, trend: 18.4 },
  { label: '引用次数', value: 48672, trend: 12.8 },
  { label: '待审核', value: 236, trend: -4.2, color: '#f59e0b' },
]

const categoryCards = [
  { name: '品牌资产', count: 1286, icon: Picture, color: '#0ea5e9', desc: 'LOGO/片头/品牌规范' },
  { name: '媒体素材', count: 18420, icon: VideoCamera, color: '#22c55e', desc: '视频/B-roll/音效' },
  { name: '数字人资产', count: 86, icon: User, color: '#8b5cf6', desc: '数字人形象与音色' },
  { name: '知识库', count: 3420, icon: Reading, color: '#f59e0b', desc: '文档/白皮书/FAQ' },
  { name: '账号与渠道', count: 48, icon: Link, color: '#ec4899', desc: '渠道授权与账号' },
  { name: '素材审核', count: 236, icon: Checked, color: '#ef4444', desc: '待审/驳回/已通过' },
]

const knowledgeRankings = [
  { name: '产品技术白皮书', refs: 428 },
  { name: '品牌宣传手册', refs: 356 },
  { name: 'FAQ 知识库', refs: 289 },
]

const filteredAssets = computed(() => {
  if (activeTab.value === '全部') return assetStore.list
  if (activeTab.value === '素材审核') {
    return assetStore.list.filter((a) => a.audit === 'pending')
  }
  return assetStore.list.filter((a) => a.type === activeTab.value)
})

const auditTag = (status) => {
  const map = { passed: { label: '已通过', type: 'success' }, pending: { label: '待审核', type: 'warning' }, rejected: { label: '已驳回', type: 'danger' } }
  return map[status] || { label: status, type: 'info' }
}

function handleUpload() {
  ElMessage.success('打开上传资产向导')
}

function handleBatchTag() {
  ElMessage.info('批量标注已选择资产')
}

function handleBatchAudit() {
  ElMessage.success('已提交批量审核')
}

function selectCategory(name) {
  activeTab.value = name
}
</script>

<template>
  <div class="asset-center dark-page">
    <div class="page-header">
      <div>
        <h1>资产中心</h1>
        <p>统一管理品牌资产、媒体素材、数字人与知识库，支撑批量生产复用</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Upload" @click="handleUpload">上传资产</el-button>
        <el-button :icon="PriceTag" @click="handleBatchTag">批量标注</el-button>
        <el-button type="warning" plain :icon="DocumentChecked" @click="handleBatchAudit">批量审核</el-button>
      </div>
    </div>

    <el-tabs v-model="activeTab" class="category-tabs">
      <el-tab-pane v-for="tab in categoryTabs" :key="tab" :label="tab" :name="tab" />
    </el-tabs>

    <div class="page-body">
      <div class="main-col">
        <div class="metric-grid">
          <MetricCard
            v-for="card in statCards"
            :key="card.label"
            :label="card.label"
            :value="card.value"
            :trend="card.trend"
            :color="card.color"
          />
        </div>

        <div class="category-grid">
          <div
            v-for="cat in categoryCards"
            :key="cat.name"
            class="category-card page-card"
            :class="{ active: activeTab === cat.name }"
            @click="selectCategory(cat.name)"
          >
            <div class="cat-icon" :style="{ background: cat.color + '22', color: cat.color }">
              <el-icon :size="22"><component :is="cat.icon" /></el-icon>
            </div>
            <div class="cat-info">
              <div class="cat-name">{{ cat.name }}</div>
              <div class="cat-count">{{ cat.count.toLocaleString() }}</div>
              <div class="cat-desc">{{ cat.desc }}</div>
            </div>
          </div>
        </div>

        <div class="page-card table-section">
          <div class="section-head">
            <h3>资产列表</h3>
            <el-input placeholder="搜索资产名称/标签" style="width: 220px" size="small" clearable />
          </div>
          <el-table :data="filteredAssets" stripe>
            <el-table-column type="selection" width="42" />
            <el-table-column prop="id" label="资产ID" width="160" />
            <el-table-column prop="name" label="资产名称" min-width="160" />
            <el-table-column prop="type" label="类型" width="110">
              <template #default="{ row }">
                <el-tag size="small" effect="dark">{{ row.type }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="标签" min-width="140">
              <template #default="{ row }">
                <el-tag v-for="tag in row.tags" :key="tag" size="small" class="tag-item">{{ tag }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="copyright" label="版权" width="100" />
            <el-table-column label="审核" width="90">
              <template #default="{ row }">
                <el-tag :type="auditTag(row.audit).type" size="small">
                  {{ auditTag(row.audit).label }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="引用" width="80" align="right">
              <template #default="{ row }">{{ row.refs.toLocaleString() }}</template>
            </el-table-column>
            <el-table-column prop="updated" label="更新时间" width="110" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default>
                <el-button link type="primary" size="small">详情</el-button>
                <el-button link size="small">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

      <aside class="side-col">
        <div class="page-card rank-block">
          <h3>热门素材 TOP3</h3>
          <div v-for="(item, i) in assetRankings.hotAssets" :key="item.name" class="rank-item">
            <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-refs">{{ item.refs }} 次</span>
          </div>
        </div>

        <div class="page-card rank-block">
          <h3>高复用模板 TOP3</h3>
          <div v-for="(item, i) in assetRankings.topTemplates" :key="item.name" class="rank-item">
            <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-refs">{{ item.refs }} 次</span>
          </div>
        </div>

        <div class="page-card rank-block">
          <h3>数字人 TOP3</h3>
          <div v-for="(item, i) in assetRankings.topDigitalHumans" :key="item.name" class="rank-item">
            <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-refs">{{ item.refs }} 次</span>
          </div>
        </div>

        <div class="page-card rank-block">
          <h3>知识库 TOP3</h3>
          <div v-for="(item, i) in knowledgeRankings" :key="item.name" class="rank-item">
            <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <span class="rank-refs">{{ item.refs }} 次</span>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.asset-center.dark-page {
  --bg-card: #111827;
  --border: #1f2937;
  color: #e2e8f0;
}

.asset-center :deep(.page-header h1) {
  color: #f1f5f9;
}

.asset-center :deep(.page-header p) {
  color: #94a3b8;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.category-tabs {
  margin-bottom: 16px;
}

.page-body {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 16px;
  align-items: start;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.category-card {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  cursor: pointer;
  transition: border-color 0.15s, transform 0.15s;
  background: #111827;
  border-color: #1f2937;
}

.category-card:hover {
  border-color: #0ea5e9;
  transform: translateY(-1px);
}

.category-card.active {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 1px #0ea5e9;
}

.cat-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.cat-name {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
}

.cat-count {
  font-size: 20px;
  font-weight: 700;
  color: #38bdf8;
  margin: 2px 0;
}

.cat-desc {
  font-size: 11px;
  color: #64748b;
}

.table-section {
  padding: 16px;
  background: #111827;
  border-color: #1f2937;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-head h3 {
  font-size: 15px;
  font-weight: 600;
  color: #f1f5f9;
}

.tag-item {
  margin-right: 4px;
}

.side-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: sticky;
  top: 0;
}

.rank-block {
  padding: 14px 16px;
  background: #111827;
  border-color: #1f2937;
}

.rank-block h3 {
  font-size: 13px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 10px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 12px;
  border-bottom: 1px solid #1f2937;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-no {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  background: #1f2937;
  color: #94a3b8;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-no.top1 {
  background: #f59e0b33;
  color: #fbbf24;
}

.rank-no.top2 {
  background: #94a3b833;
  color: #cbd5e1;
}

.rank-no.top3 {
  background: #b4530933;
  color: #d97706;
}

.rank-name {
  flex: 1;
  color: #e2e8f0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-refs {
  color: #64748b;
  flex-shrink: 0;
}
</style>
