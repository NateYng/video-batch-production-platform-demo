<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useAssetStore } from '@/stores'
import { assetRankings } from '@/mock'
import MetricCard from '@/components/MetricCard.vue'
import {
  Picture, VideoCamera, User, Reading, Link, Checked,
  Upload, DocumentChecked,
} from '@element-plus/icons-vue'

const assetStore = useAssetStore()

const activeTab = ref('全部')
const sideTab = ref('hot')

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
  <div class="page-shell asset-center">
    <div class="page-toolbar with-actions">
      <div class="category-strip">
        <div
          class="category-chip page-card"
          :class="{ active: activeTab === '全部' }"
          @click="selectCategory('全部')"
        >
          <span>全部</span>
          <span class="cat-count">32k+</span>
        </div>
        <div
          v-for="cat in categoryCards"
          :key="cat.name"
          class="category-chip page-card"
          :class="{ active: activeTab === cat.name }"
          @click="selectCategory(cat.name)"
        >
          <el-icon :size="14" :style="{ color: cat.color }"><component :is="cat.icon" /></el-icon>
          <span>{{ cat.name }}</span>
          <span class="cat-count">{{ cat.count > 999 ? (cat.count / 1000).toFixed(1) + 'k' : cat.count }}</span>
        </div>
      </div>
      <div class="page-toolbar-actions">
        <el-button type="primary" size="small" :icon="Upload" @click="handleUpload">上传</el-button>
        <el-button size="small" :icon="DocumentChecked" @click="handleBatchAudit">审核</el-button>
      </div>
    </div>

    <div class="metric-grid compact kpi-4">
      <MetricCard
        v-for="card in statCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :trend="card.trend"
        :color="card.color"
      />
    </div>

    <div class="page-split">
      <div class="page-split-main">
        <div class="page-card fill-card">
          <div class="filter-bar-compact">
            <span class="filter-label">资产列表 · {{ activeTab }}</span>
            <el-input placeholder="搜索" style="width: 140px" size="small" clearable />
          </div>
          <div class="table-flex">
            <el-table :data="filteredAssets" stripe size="small">
              <el-table-column type="selection" width="36" />
              <el-table-column prop="id" label="ID" width="130" show-overflow-tooltip />
              <el-table-column prop="name" label="名称" min-width="130" show-overflow-tooltip />
              <el-table-column prop="type" label="类型" width="100">
                <template #default="{ row }">
                  <el-tag size="small" effect="dark">{{ row.type }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="标签" min-width="120">
                <template #default="{ row }">
                  <el-tag v-for="tag in row.tags.slice(0, 2)" :key="tag" size="small" class="tag-item">{{ tag }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="审核" width="80">
                <template #default="{ row }">
                  <el-tag :type="auditTag(row.audit).type" size="small">{{ auditTag(row.audit).label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="引用" width="70" align="right">
                <template #default="{ row }">{{ row.refs.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column prop="updated" label="更新" width="90" />
              <el-table-column label="操作" width="100" fixed="right">
                <template #default>
                  <el-button link type="primary" size="small">详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card fill-card">
          <el-tabs v-model="sideTab" class="side-tabs compact-tabs">
            <el-tab-pane label="热门素材" name="hot">
              <div v-for="(item, i) in assetRankings.hotAssets" :key="item.name" class="rank-item">
                <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-refs">{{ item.refs }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="高复用模板" name="template">
              <div v-for="(item, i) in assetRankings.topTemplates" :key="item.name" class="rank-item">
                <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-refs">{{ item.refs }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="数字人" name="dh">
              <div v-for="(item, i) in assetRankings.topDigitalHumans" :key="item.name" class="rank-item">
                <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-refs">{{ item.refs }}</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="知识库" name="kb">
              <div v-for="(item, i) in knowledgeRankings" :key="item.name" class="rank-item">
                <span class="rank-no" :class="'top' + (i + 1)">{{ i + 1 }}</span>
                <span class="rank-name">{{ item.name }}</span>
                <span class="rank-refs">{{ item.refs }}</span>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.page-toolbar.with-actions .category-strip {
  flex: 1;
  margin-right: 8px;
}

.category-chip {
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}

.filter-label {
  font-size: 12px;
  font-weight: 600;
}

.tag-item {
  margin-right: 4px;
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 0;
  font-size: 11px;
  border-bottom: 1px solid var(--border);
}

.rank-item:last-child { border-bottom: none; }

.rank-no {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: rgba(99, 102, 241, 0.08);
  color: var(--text-secondary);
  font-size: 10px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.rank-no.top1 { background: rgba(245, 158, 11, 0.15); color: #f59e0b; }
.rank-no.top2 { background: rgba(148, 163, 184, 0.15); color: #94a3b8; }
.rank-no.top3 { background: rgba(180, 83, 9, 0.15); color: #d97706; }

.rank-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rank-refs {
  color: var(--text-tertiary);
  flex-shrink: 0;
  font-size: 10px;
}
</style>
