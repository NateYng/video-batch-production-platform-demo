import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  overviewMetrics,
  dashboardTasks,
  batchTasks,
  taskDetail,
  templates,
  videos,
  auditItems,
  publishChannels,
  assets,
} from '@/mock'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const pendingAuditCount = ref(316)
  const colorMode = ref(localStorage.getItem('vbpp-color-mode') || 'light')

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setColorMode(mode) {
    colorMode.value = mode
    localStorage.setItem('vbpp-color-mode', mode)
    document.documentElement.setAttribute('data-theme', mode)
  }

  function toggleColorMode() {
    setColorMode(colorMode.value === 'light' ? 'dark' : 'light')
  }

  const isDark = computed(() => colorMode.value === 'dark')

  return {
    sidebarCollapsed,
    pendingAuditCount,
    colorMode,
    isDark,
    toggleSidebar,
    setColorMode,
    toggleColorMode,
  }
})

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([...batchTasks])
  const currentTask = ref({ ...taskDetail })
  const overview = ref({ ...overviewMetrics })
  const dashboardTaskList = ref([...dashboardTasks])

  function pauseTask(id) {
    const t = tasks.value.find((x) => x.id === id)
    if (t && t.status === 'running') t.status = 'paused'
  }

  function retryFailed(id) {
    const t = tasks.value.find((x) => x.id === id)
    if (t && t.status === 'partial_fail') {
      t.status = 'running'
      t.completionRate = Math.min(100, t.completionRate + 5)
    }
    if (currentTask.value.id === id) {
      currentTask.value.failed = Math.max(0, currentTask.value.failed - 20)
      currentTask.value.completed += 20
    }
  }

  function deleteTasks(ids) {
    tasks.value = tasks.value.filter((t) => !ids.includes(t.id))
  }

  function addTask(task) {
    tasks.value.unshift(task)
    dashboardTaskList.value.unshift({
      id: task.id,
      name: task.name,
      type: '批量任务',
      count: task.total,
      progress: 0,
      status: 'running',
      risk: 'medium',
      priority: '中',
      startTime: new Date().toLocaleString('zh-CN'),
      cost: task.cost || 0,
    })
  }

  return { tasks, currentTask, overview, dashboardTaskList, pauseTask, retryFailed, deleteTasks, addTask }
})

export const useVideoStore = defineStore('videos', () => {
  const list = ref([...videos])
  const selectedIds = ref([])

  function updateTitle(id, title) {
    const v = list.value.find((x) => x.id === id)
    if (v) {
      v.title = title
      v.version = `v${parseInt(v.version.replace('v', '')) + 1}`
    }
  }

  function submitAudit(ids) {
    list.value.forEach((v) => {
      if (ids.includes(v.id)) v.auditStatus = 'pending'
    })
  }

  return { list, selectedIds, updateTitle, submitAudit }
})

export const useAuditStore = defineStore('audit', () => {
  const items = ref([...auditItems])
  const counts = computed(() => ({
    high: items.value.filter((i) => i.riskLevel === 'high').length,
    medium: items.value.filter((i) => i.riskLevel === 'medium').length,
    low: items.value.filter((i) => i.score >= 85).length,
    rejected: 86,
    passed: 1286,
  }))

  function approve(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) {
      items.value = items.value.filter((i) => i.id !== id)
    }
  }

  function reject(id) {
    const item = items.value.find((i) => i.id === id)
    if (item) item.suggest = '已驳回'
  }

  return { items, counts, approve, reject }
})

export const usePublishStore = defineStore('publish', () => {
  const channels = ref([...publishChannels])

  function publish(channel) {
    const ch = channels.value.find((c) => c.account === channel)
    if (ch) {
      ch.status = 'publishing'
      ch.pending = Math.max(0, ch.pending - 100)
    }
  }

  function retryFail(account) {
    const ch = channels.value.find((c) => c.account === account)
    if (ch) {
      ch.status = 'ready'
      ch.failReason = ''
    }
  }

  return { channels, publish, retryFail }
})

export const useAssetStore = defineStore('assets', () => {
  const list = ref([...assets])
  const templateList = ref([...templates])

  return { list, templateList }
})
