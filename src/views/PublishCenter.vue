<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { CircleCheck, CircleClose } from '@element-plus/icons-vue'
import { usePublishStore } from '@/stores'
import { publishSchedule } from '@/mock'

const publishStore = usePublishStore()

const channelTab = ref('all')
const calendarView = ref('day')
const selectedDate = ref('2025-07-09')
const sideTab = ref('check')

const channelOverview = [
  { name: '抖音', pending: 3600, todayPublished: 1260, trend: 12, successRate: 96.2, color: '#0ea5e9' },
  { name: '视频号', pending: 1860, todayPublished: 642, trend: 8.4, successRate: 97.1, color: '#22c55e' },
  { name: '官网', pending: 120, todayPublished: 28, trend: -2.1, successRate: 100, color: '#8b5cf6' },
  { name: '发布成功率', pending: null, todayPublished: null, trend: 2.1, successRate: 96.8, color: '#f59e0b', isSummary: true },
]

const timeSlots = ['10:00', '14:00', '18:00']
const calendarChannels = ['抖音', '视频号', '官网']

const scheduleGrid = computed(() => {
  const grid = {}
  calendarChannels.forEach((ch) => {
    grid[ch] = {}
    timeSlots.forEach((t) => {
      grid[ch][t] = publishSchedule.find((s) => s.channel === ch && s.time === t) || null
    })
  })
  return grid
})

const filteredChannels = computed(() => {
  if (channelTab.value === 'all') return publishStore.channels
  return publishStore.channels.filter((c) => c.channel === channelTab.value)
})

const checklist = [
  { label: '标题长度', value: '20/30 符合', ok: true },
  { label: '封面比例', value: '9:16 符合', ok: true },
  { label: '字幕文件', value: '已生成', ok: true },
  { label: '账号权限', value: '正常', ok: true },
  { label: '发布时间', value: '已设置', ok: true },
  { label: '渠道标签', value: '已匹配', ok: true },
  { label: '审核状态', value: '待审核 5 条', ok: false },
]

const effectMetrics = [
  { label: '播放量', value: '256.8w', trend: 18.6 },
  { label: '完播率', value: '42.3%', trend: 3.2 },
  { label: '点赞', value: '9.6w', trend: 12.4 },
  { label: '评论', value: '1.2w', trend: 5.8 },
  { label: '转发', value: '8,320', trend: -1.2 },
  { label: '播赞', value: '3,560', trend: 8.6 },
]

const quickActions = [
  '新建发布计划',
  '批量设置排期',
  '发布模板管理',
  '账号管理',
  '素材去重',
  '发布记录',
]

const statusMap = {
  queuing: { label: '排队中', type: 'warning' },
  publishing: { label: '发布中', type: 'primary' },
  ready: { label: '已就绪', type: 'success' },
  partial_fail: { label: '部分失败', type: 'danger' },
}

const scheduleStatusMap = {
  ready: { label: '已就绪', class: 'ready' },
  queuing: { label: '排队中', class: 'queuing' },
  published: { label: '已发布', class: 'published' },
}

function handlePublish() {
  ElMessage.success('已提交一键发布任务，共 1,980 条视频')
}

function handleSchedule() {
  ElMessage.info('打开排期发布向导')
}

function handleRetryAll() {
  publishStore.channels.forEach((ch) => {
    if (ch.status === 'partial_fail') publishStore.retryFail(ch.account)
  })
  ElMessage.success('已重试所有失败发布')
}

function handleViewRecords() {
  ElMessage.info('查看发布记录')
}

function getScheduleClass(ch, slot) {
  const item = scheduleGrid.value[ch]?.[slot]
  return item ? scheduleStatusMap[item.status]?.class : ''
}

function getScheduleLabel(ch, slot) {
  const item = scheduleGrid.value[ch]?.[slot]
  return item ? scheduleStatusMap[item.status]?.label : ''
}

function handleChannelAction(row, action) {
  if (action === 'retry') publishStore.retryFail(row.account)
  else if (action === 'publish') publishStore.publish(row.account)
  ElMessage.success(`已对 ${row.account} 执行${action === 'retry' ? '重试' : '发布'}`)
}
</script>

<template>
  <div class="page-shell publish-center">
    <div class="top-row">
      <div class="overview-grid compact">
        <div v-for="item in channelOverview" :key="item.name" class="overview-card page-card compact">
          <div class="ov-header">
            <span class="ov-dot" :style="{ background: item.color }" />
            <span class="ov-name">{{ item.name }}</span>
          </div>
          <template v-if="!item.isSummary">
            <div class="ov-pending">待发布 <strong>{{ item.pending.toLocaleString() }}</strong></div>
            <div class="ov-sub">今日 {{ item.todayPublished.toLocaleString() }}
              <span :class="item.trend >= 0 ? 'up' : 'down'">{{ item.trend >= 0 ? '↑' : '↓' }}{{ Math.abs(item.trend) }}%</span>
            </div>
          </template>
          <template v-else>
            <div class="ov-pending summary-val">{{ item.successRate }}%</div>
            <div class="ov-sub"><span class="up">↑ {{ item.trend }}%</span> 综合成功率</div>
          </template>
        </div>
      </div>
      <div class="page-toolbar-actions top-actions">
        <el-button type="primary" size="small" @click="handlePublish">一键发布</el-button>
        <el-button size="small" @click="handleSchedule">排期</el-button>
        <el-button size="small" type="warning" plain @click="handleRetryAll">重试</el-button>
      </div>
    </div>

    <div class="page-split wide-side">
      <div class="page-split-main">
        <div class="page-card fill-card calendar-section">
          <div class="section-head">
            <h3>发布排期 · {{ selectedDate }}</h3>
            <el-radio-group v-model="calendarView" size="small">
              <el-radio-button value="day">日</el-radio-button>
              <el-radio-button value="week">周</el-radio-button>
            </el-radio-group>
          </div>
          <div class="calendar-grid">
            <div class="grid-header">
              <div class="channel-col">渠道</div>
              <div v-for="slot in timeSlots" :key="slot" class="time-col">{{ slot }}</div>
            </div>
            <div v-for="ch in calendarChannels" :key="ch" class="grid-row">
              <div class="channel-col">{{ ch }}</div>
              <div v-for="slot in timeSlots" :key="slot" class="time-col">
                <div v-if="scheduleGrid[ch][slot]" class="schedule-card" :class="getScheduleClass(ch, slot)">
                  <div class="sc-title">{{ scheduleGrid[ch][slot].title }}</div>
                  <div class="sc-meta">{{ scheduleGrid[ch][slot].count }} 条 · {{ getScheduleLabel(ch, slot) }}</div>
                </div>
                <div v-else class="schedule-empty">—</div>
              </div>
            </div>
          </div>
        </div>

        <div class="page-card fill-card channel-section">
          <div class="section-head">
            <el-radio-group v-model="channelTab" size="small">
              <el-radio-button value="all">全部</el-radio-button>
              <el-radio-button value="抖音">抖音</el-radio-button>
              <el-radio-button value="视频号">视频号</el-radio-button>
              <el-radio-button value="官网">官网</el-radio-button>
            </el-radio-group>
          </div>
          <div class="table-flex">
            <el-table :data="filteredChannels" stripe size="small">
              <el-table-column label="渠道" width="80">
                <template #default="{ row }"><el-tag size="small" effect="plain">{{ row.channel }}</el-tag></template>
              </el-table-column>
              <el-table-column prop="account" label="账号" min-width="120" show-overflow-tooltip />
              <el-table-column label="待发布" width="80" align="right">
                <template #default="{ row }">{{ row.pending.toLocaleString() }}</template>
              </el-table-column>
              <el-table-column label="成功率" width="75" align="right">
                <template #default="{ row }">{{ row.successRate }}%</template>
              </el-table-column>
              <el-table-column label="状态" width="90">
                <template #default="{ row }">
                  <el-tag :type="statusMap[row.status]?.type" size="small">{{ statusMap[row.status]?.label }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="failReason" label="失败原因" min-width="100" show-overflow-tooltip>
                <template #default="{ row }">
                  <span :class="{ 'status-fail': row.failReason }">{{ row.failReason || '—' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120" fixed="right">
                <template #default="{ row }">
                  <el-button v-if="row.status === 'partial_fail'" link type="warning" size="small" @click="handleChannelAction(row, 'retry')">重试</el-button>
                  <el-button v-else link type="success" size="small" @click="handleChannelAction(row, 'publish')">发布</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <aside class="page-split-side">
        <div class="page-card fill-card">
          <el-tabs v-model="sideTab" class="side-tabs compact-tabs">
            <el-tab-pane label="校验" name="check">
              <ul class="checklist">
                <li v-for="item in checklist" :key="item.label" :class="{ fail: !item.ok }">
                  <el-icon v-if="item.ok" color="#22c55e"><CircleCheck /></el-icon>
                  <el-icon v-else color="#ef4444"><CircleClose /></el-icon>
                  <span class="ck-label">{{ item.label }}</span>
                  <span class="ck-value">{{ item.value }}</span>
                </li>
              </ul>
            </el-tab-pane>
            <el-tab-pane label="效果" name="effect">
              <div class="effect-grid">
                <div v-for="m in effectMetrics" :key="m.label" class="effect-item">
                  <div class="ef-label">{{ m.label }}</div>
                  <div class="ef-value">{{ m.value }}</div>
                  <div class="ef-trend" :class="m.trend >= 0 ? 'up' : 'down'">{{ m.trend >= 0 ? '↑' : '↓' }}{{ Math.abs(m.trend) }}%</div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="快捷" name="quick">
              <div class="quick-grid">
                <el-button v-for="action in quickActions" :key="action" size="small" plain class="quick-btn">{{ action }}</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.top-row {
  display: flex;
  align-items: stretch;
  gap: 10px;
  flex-shrink: 0;
}

.top-row .overview-grid.compact {
  flex: 1;
}

.top-actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
}

.ov-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.ov-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.ov-name {
  font-size: 11px;
  color: var(--text-secondary);
}

.ov-pending {
  font-size: 11px;
}

.ov-pending strong,
.summary-val {
  font-size: 16px;
  font-weight: 700;
}

.ov-sub {
  font-size: 10px;
  color: var(--text-secondary);
}

.up { color: #22c55e; }
.down { color: #ef4444; }

.page-split-main {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.calendar-section {
  flex: 0 0 auto;
  max-height: 42%;
}

.channel-section {
  flex: 1;
  min-height: 0;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.section-head h3 {
  font-size: 13px;
  font-weight: 600;
}

.calendar-grid {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.grid-header,
.grid-row {
  display: grid;
  grid-template-columns: 72px repeat(3, 1fr);
}

.grid-header {
  background: rgba(99, 102, 241, 0.04);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-secondary);
}

.channel-col,
.time-col {
  padding: 6px 8px;
  border-right: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  font-size: 11px;
}

.grid-row:last-child .channel-col,
.grid-row:last-child .time-col {
  border-bottom: none;
}

.channel-col {
  display: flex;
  align-items: center;
  font-weight: 500;
}

.schedule-card {
  padding: 4px 6px;
  border-radius: 4px;
  font-size: 10px;
  min-height: 36px;
}

.schedule-card.ready { background: #f0fdf4; border: 1px solid #bbf7d0; }
.schedule-card.queuing { background: #fffbeb; border: 1px solid #fde68a; }
.schedule-card.published { background: #f0f9ff; border: 1px solid #bae6fd; }

.sc-title {
  font-weight: 500;
  margin-bottom: 2px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sc-meta {
  color: var(--text-secondary);
  font-size: 10px;
}

.schedule-empty {
  color: var(--text-secondary);
  font-size: 11px;
  text-align: center;
  padding: 8px 0;
}

.checklist {
  list-style: none;
}

.checklist li {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 0;
  font-size: 11px;
  border-bottom: 1px solid var(--border);
}

.checklist li.fail .ck-value { color: #ef4444; }

.ck-label { flex: 1; }
.ck-value { color: var(--text-secondary); font-size: 10px; }

.effect-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.effect-item {
  padding: 6px;
  background: rgba(99, 102, 241, 0.04);
  border-radius: 6px;
}

.ef-label { font-size: 10px; color: var(--text-secondary); }
.ef-value { font-size: 14px; font-weight: 600; }
.ef-trend { font-size: 10px; }

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.quick-btn {
  width: 100%;
  margin: 0;
  font-size: 11px;
}
</style>
