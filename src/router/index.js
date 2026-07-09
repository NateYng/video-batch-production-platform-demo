import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue'), meta: { title: '工作台' } },
  { path: '/batch-tasks', name: 'BatchTasks', component: () => import('@/views/BatchTasks.vue'), meta: { title: '批量任务中心' } },
  { path: '/create-task', name: 'CreateTask', component: () => import('@/views/CreateTask.vue'), meta: { title: '创建批量任务' } },
  { path: '/templates', name: 'Templates', component: () => import('@/views/TemplateStudio.vue'), meta: { title: '模板创作台' } },
  { path: '/agent-flow', name: 'AgentFlow', component: () => import('@/views/AgentFlow.vue'), meta: { title: '智能体编排' } },
  { path: '/task/:id', name: 'TaskDetail', component: () => import('@/views/TaskDetail.vue'), meta: { title: '任务详情' } },
  { path: '/videos', name: 'Videos', component: () => import('@/views/VideoResults.vue'), meta: { title: '视频结果列表' } },
  { path: '/audit', name: 'Audit', component: () => import('@/views/QualityAudit.vue'), meta: { title: '质检与审核台' } },
  { path: '/publish', name: 'Publish', component: () => import('@/views/PublishCenter.vue'), meta: { title: '发布中心' } },
  { path: '/assets', name: 'Assets', component: () => import('@/views/AssetCenter.vue'), meta: { title: '资产中心' } },
  { path: '/data', name: 'Data', component: () => import('@/views/DataDashboard.vue'), meta: { title: '数据看板' } },
  { path: '/settings', name: 'Settings', component: () => import('@/views/SystemConfig.vue'), meta: { title: '系统配置' } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.afterEach((to) => {
  document.title = `${to.meta.title || '视频批量生产平台'} - 视频批量生产平台`
})

export default router
