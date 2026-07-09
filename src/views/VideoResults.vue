<script setup>
import { ref, computed } from 'vue'
import { useVideoStore } from '@/stores'
import { ElMessage } from 'element-plus'
import { videoMedia, makePoster } from '@/mock/media'

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

const selectedMedia = computed(() =>
  selectedVideo.value ? videoMedia(selectedVideo.value.id, selectedVideo.value.title) : null
)

const rowThumb = (row) => makePoster(row.title, { seed: row.id, width: 128, height: 72, play: false, subtitle: '' })

const coverOptions = computed(() => {
  if (!selectedVideo.value) return []
  return [1, 2, 3, 4].map((n) =>
    makePoster(selectedVideo.value.title, { seed: `${selectedVideo.value.id}-c${n}`, subtitle: `封面方案 ${n}` })
  )
})
</script>

<template>
  <div class="page-shell video-results">
    <div class="page-toolbar">
      <span class="filter-count">共 {{ filteredList.length }} 条</span>
      <el-button type="primary" size="small" @click="batchSubmitAudit">批量提交审核</el-button>
    </div>

    <div class="page-split wide-side">
      <div class="page-split-main">
        <div class="page-card fill-card">
          <div class="filter-bar-compact">
            <el-input v-model="keyword" placeholder="搜索" clearable size="small" style="width: 140px" />
            <el-select v-model="filterRisk" placeholder="风险" clearable size="small" style="width: 100px">
              <el-option label="高风险" value="high" />
              <el-option label="中风险" value="medium" />
              <el-option label="低风险" value="low" />
            </el-select>
            <el-select v-model="filterAudit" placeholder="审核" clearable size="small" style="width: 100px">
              <el-option label="待审核" value="pending" />
              <el-option label="审核中" value="auditing" />
              <el-option label="已通过" value="passed" />
              <el-option label="已驳回" value="rejected" />
            </el-select>
            <el-select v-model="filterPublish" placeholder="发布" clearable size="small" style="width: 100px">
              <el-option label="待发布" value="pending" />
              <el-option label="已发布" value="published" />
              <el-option label="失败" value="failed" />
            </el-select>
          </div>
          <div class="table-flex">
            <el-table
              :data="filteredList"
              stripe
              size="small"
              highlight-current-row
              @selection-change="onSelect"
              @row-click="selectRow"
            >
          <el-table-column type="selection" width="40" />
          <el-table-column label="预览" width="76">
            <template #default="{ row }">
              <img :src="rowThumb(row)" class="row-thumb" alt="" />
            </template>
          </el-table-column>
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
        </div>
      </div>

      <aside class="page-split-side">
      <div v-if="selectedVideo" class="page-card fill-card preview-panel">
        <video
          :key="selectedVideo.id"
          class="video-player"
          :src="selectedMedia.src"
          :poster="selectedMedia.poster"
          controls
          preload="metadata"
          muted
        />
        <h3 class="pv-title">{{ selectedVideo.title }}</h3>
        <p class="meta">{{ selectedVideo.id }}</p>

        <div class="quick-actions">
          <el-button size="small" @click="openTitleDialog">改标题</el-button>
          <el-button size="small" @click="changeCover">换封面</el-button>
        </div>

        <el-tabs v-model="previewTab" class="compact-tabs preview-tabs">
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
              <img :src="selectedMedia.poster" class="cover-thumb-img" alt="封面预览" />
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
      </div>
      <div v-else class="page-card fill-card preview-panel empty-preview">
        <el-empty description="选择视频预览" :image-size="60" />
      </div>
      </aside>
    </div>

    <el-dialog v-model="titleDialogVisible" title="修改标题" width="400px">
      <el-input v-model="editTitle" placeholder="输入新标题" />
      <template #footer>
        <el-button @click="titleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTitle">保存</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="coverDialogVisible" title="更换封面" width="440px">
      <div class="cover-options">
        <img
          v-for="(cover, i) in coverOptions"
          :key="i"
          :src="cover"
          class="cover-option"
          :class="{ active: i === 0 }"
          alt=""
        />
      </div>
      <template #footer>
        <el-button @click="coverDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmCover">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.filter-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.preview-panel {
  overflow-y: auto;
}

.video-player {
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 8px;
  background: #000;
  margin-bottom: 8px;
  border: 1px solid var(--border);
  display: block;
  object-fit: cover;
}

.row-thumb {
  width: 60px;
  height: 34px;
  border-radius: 4px;
  object-fit: cover;
  display: block;
  border: 1px solid var(--border);
}

.pv-title {
  font-size: 13px;
  margin-bottom: 4px;
  line-height: 1.35;
}

.meta {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.quick-actions {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.preview-tabs :deep(.el-tabs__content) {
  max-height: 160px;
  overflow-y: auto;
}

.subtitle-preview p {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.cover-thumb-img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 6px;
  margin-bottom: 6px;
  border: 1px solid var(--border);
  display: block;
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
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  display: block;
  transition: border-color 0.15s;
}

.cover-option:hover {
  border-color: var(--border-strong);
}

.cover-option.active {
  border-color: var(--primary);
}
</style>
