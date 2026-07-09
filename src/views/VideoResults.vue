<script setup>
import { ref, computed } from 'vue'
import { useVideoStore } from '@/stores'
import { ElMessage } from 'element-plus'

const videoStore = useVideoStore()

const filterRisk = ref('')
const filterAudit = ref('')
const filterPublish = ref('')
const keyword = ref('')
const selectedVideo = ref(null)
const previewTab = ref('detail')
const titleDialogVisible = ref(false)
const editTitle = ref('')
const coverDialogVisible = ref(false)

const riskLabel = { high: '高风险', medium: '中风险', low: '低风险' }
const riskType = { high: 'danger', medium: 'warning', low: 'success' }
const auditLabel = { pending: '待审核', auditing: '审核中', passed: '已通过', rejected: '已驳回' }
const auditType = { pending: 'warning', auditing: 'primary', passed: 'success', rejected: 'danger' }
const publishLabel = { pending: '待发布', published: '已发布', failed: '发布失败' }
const publishType = { pending: 'info', published: 'success', failed: 'danger' }

const filteredList = computed(() =>
  videoStore.list.filter((v) => {
    if (filterRisk.value && v.risk !== filterRisk.value) return false
    if (filterAudit.value && v.auditStatus !== filterAudit.value) return false
    if (filterPublish.value && v.publishStatus !== filterPublish.value) return false
    if (keyword.value && !v.title.includes(keyword.value) && !v.id.includes(keyword.value)) return false
    return true
  })
)

function onSelect(rows) {
  videoStore.selectedIds = rows.map((r) => r.id)
}

function selectRow(row) {
  selectedVideo.value = row
}

function openTitleDialog() {
  if (!selectedVideo.value) return
  editTitle.value = selectedVideo.value.title
  titleDialogVisible.value = true
}

function saveTitle() {
  videoStore.updateTitle(selectedVideo.value.id, editTitle.value)
  selectedVideo.value.title = editTitle.value
  titleDialogVisible.value = false
  ElMessage.success('标题已更新')
}

function changeCover() {
  coverDialogVisible.value = true
}

function confirmCover() {
  coverDialogVisible.value = false
  ElMessage.success('封面已更换')
}

function batchSubmitAudit() {
  const ids = videoStore.selectedIds.length ? videoStore.selectedIds : filteredList.value.map((v) => v.id)
  videoStore.submitAudit(ids)
  ElMessage.success(`已提交 ${ids.length} 条视频至审核队列`)
}
</script>

<template>
  <div class="video-results">
    <div class="page-header">
      <div>
        <h1>视频结果列表</h1>
        <p>查看批量任务产出视频，支持筛选、预览与快速编辑</p>
      </div>
      <el-button type="primary" @click="batchSubmitAudit">批量提交审核</el-button>
    </div>

    <div class="filter-bar page-card">
      <el-input v-model="keyword" placeholder="搜索标题 / ID" clearable style="width: 200px" />
      <el-select v-model="filterRisk" placeholder="风险等级" clearable style="width: 120px">
        <el-option label="高风险" value="high" />
        <el-option label="中风险" value="medium" />
        <el-option label="低风险" value="low" />
      </el-select>
      <el-select v-model="filterAudit" placeholder="审核状态" clearable style="width: 120px">
        <el-option label="待审核" value="pending" />
        <el-option label="审核中" value="auditing" />
        <el-option label="已通过" value="passed" />
        <el-option label="已驳回" value="rejected" />
      </el-select>
      <el-select v-model="filterPublish" placeholder="发布状态" clearable style="width: 120px">
        <el-option label="待发布" value="pending" />
        <el-option label="已发布" value="published" />
        <el-option label="发布失败" value="failed" />
      </el-select>
      <span class="filter-count">共 {{ filteredList.length }} 条</span>
    </div>

    <div class="content-layout">
      <div class="table-wrap page-card">
        <el-table
          :data="filteredList"
          stripe
          highlight-current-row
          @selection-change="onSelect"
          @row-click="selectRow"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column prop="id" label="视频 ID" width="160" />
          <el-table-column prop="title" label="标题" min-width="180" show-overflow-tooltip />
          <el-table-column prop="template" label="模板" width="130" />
          <el-table-column label="风险" width="90">
            <template #default="{ row }">
              <el-tag :type="riskType[row.risk]" size="small" effect="dark">{{ riskLabel[row.risk] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="审核" width="90">
            <template #default="{ row }">
              <el-tag :type="auditType[row.auditStatus]" size="small" effect="plain">{{ auditLabel[row.auditStatus] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="发布" width="90">
            <template #default="{ row }">
              <el-tag :type="publishType[row.publishStatus]" size="small" effect="plain">{{ publishLabel[row.publishStatus] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="时长" width="70" />
          <el-table-column prop="version" label="版本" width="60" />
          <el-table-column prop="time" label="生成时间" width="150" />
        </el-table>
      </div>

      <aside v-if="selectedVideo" class="preview-panel page-card">
        <div class="video-placeholder">
          <el-icon :size="48"><VideoPlay /></el-icon>
          <span>{{ selectedVideo.duration }}</span>
        </div>
        <h3>{{ selectedVideo.title }}</h3>
        <p class="meta">{{ selectedVideo.id }} · {{ selectedVideo.batch }}</p>

        <div class="quick-actions">
          <el-button size="small" @click="openTitleDialog">改标题</el-button>
          <el-button size="small" @click="changeCover">换封面</el-button>
        </div>

        <el-tabs v-model="previewTab" class="preview-tabs">
          <el-tab-pane label="详情" name="detail">
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="模板">{{ selectedVideo.template }}</el-descriptions-item>
              <el-descriptions-item label="风险">
                <el-tag :type="riskType[selectedVideo.risk]" size="small">{{ riskLabel[selectedVideo.risk] }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="版本">{{ selectedVideo.version }}</el-descriptions-item>
              <el-descriptions-item label="生成时间">{{ selectedVideo.time }}</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
          <el-tab-pane label="字幕" name="subtitle">
            <div class="subtitle-preview">
              <p>[00:00] 欢迎来到科技前沿</p>
              <p>[00:05] 今天我们将探索智能未来的无限可能</p>
              <p>[00:12] 让我们一起开启这段旅程</p>
            </div>
          </el-tab-pane>
          <el-tab-pane label="封面" name="cover">
            <div class="cover-preview">
              <div class="cover-thumb">封面预览</div>
              <el-button size="small" type="primary" plain @click="changeCover">重新生成封面</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="发布" name="publish">
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="发布状态">{{ publishLabel[selectedVideo.publishStatus] }}</el-descriptions-item>
              <el-descriptions-item label="目标渠道">抖音 · 视频号</el-descriptions-item>
              <el-descriptions-item label="计划时间">2025-05-21 10:00</el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>
        </el-tabs>
      </aside>
      <aside v-else class="preview-panel page-card empty-preview">
        <el-empty description="点击表格行预览视频" />
      </aside>
    </div>

    <el-dialog v-model="titleDialogVisible" title="修改标题" width="400px">
      <el-input v-model="editTitle" placeholder="输入新标题" />
      <template #footer>
        <el-button @click="titleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTitle">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="coverDialogVisible" title="更换封面" width="400px">
      <div class="cover-options">
        <div v-for="n in 4" :key="n" class="cover-option" :class="{ active: n === 1 }">封面 {{ n }}</div>
      </div>
      <template #footer>
        <el-button @click="coverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCover">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 12px;
}

.filter-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-secondary);
}

.content-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 12px;
  min-height: 500px;
}

.table-wrap {
  padding: 0;
  overflow: hidden;
}

.preview-panel {
  padding: 16px;
}

.video-placeholder {
  aspect-ratio: 9/16;
  max-height: 280px;
  background: rgba(99, 102, 241, 0.06);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--text-tertiary);
  margin-bottom: 12px;
  border: 1px solid var(--border);
}

.preview-panel h3 {
  font-size: 14px;
  margin-bottom: 4px;
}

.meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.quick-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.subtitle-preview p {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 6px;
}

.cover-thumb {
  aspect-ratio: 16/9;
  background: rgba(99, 102, 241, 0.06);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
  margin-bottom: 8px;
  font-size: 12px;
  border: 1px solid var(--border);
}

.empty-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.cover-option {
  aspect-ratio: 16/9;
  background: rgba(99, 102, 241, 0.06);
  border: 2px solid var(--border);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.cover-option.active {
  border-color: var(--primary);
}
</style>
