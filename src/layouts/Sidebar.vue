<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import {
  LayoutDashboard, Layers, FilePen, Workflow, Clapperboard, FolderOpen,
  ShieldCheck, Send, ChartColumn, Settings, FileText,
  PanelLeftClose, PanelLeftOpen, Play,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const menuGroups = [
  {
    title: '',
    items: [{ path: '/dashboard', title: '工作台', icon: LayoutDashboard }],
  },
  {
    title: '生产',
    items: [
      { path: '/batch-tasks', title: '批量任务', icon: Layers },
      { path: '/templates', title: '模板创作', icon: FilePen },
      { path: '/agent-flow', title: '智能体编排', icon: Workflow },
      { path: '/create-task', title: '创建任务', icon: FileText, hidden: true },
      { path: '/videos', title: '视频结果', icon: Clapperboard },
      { path: '/assets', title: '素材管理', icon: FolderOpen },
    ],
  },
  {
    title: '运营',
    items: [
      { path: '/audit', title: '质检审核', icon: ShieldCheck, badge: appStore.pendingAuditCount },
      { path: '/publish', title: '发布管理', icon: Send },
      { path: '/data', title: '数据看板', icon: ChartColumn },
    ],
  },
  {
    title: '管理',
    items: [
      { path: '/settings', title: '系统配置', icon: Settings },
    ],
  },
]

const activePath = computed(() => route.path)

function isActive(item) {
  return activePath.value === item.path || activePath.value.startsWith(item.path + '/')
}

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="logo">
      <div class="logo-icon">
        <Play :size="13" :stroke-width="2.5" fill="currentColor" />
      </div>
      <div v-if="!appStore.sidebarCollapsed" class="logo-text-wrap">
        <span class="logo-text">视频批量生产平台</span>
      </div>
    </div>
    <nav class="nav">
      <div v-for="group in menuGroups" :key="group.title" class="nav-group">
        <div v-if="group.title && !appStore.sidebarCollapsed" class="group-title">
          {{ group.title }}
        </div>
        <div
          v-for="item in group.items.filter((i) => !i.hidden)"
          :key="item.path"
          class="nav-item"
          :class="{ active: isActive(item) }"
          @click="navigate(item.path)"
        >
          <component :is="item.icon" :size="15" :stroke-width="1.8" class="nav-icon" />
          <span v-if="!appStore.sidebarCollapsed" class="nav-label">{{ item.title }}</span>
          <span v-if="item.badge && !appStore.sidebarCollapsed" class="nav-count">{{ item.badge }}</span>
        </div>
      </div>
    </nav>
    <div class="collapse-btn" @click="appStore.toggleSidebar">
      <PanelLeftClose v-if="!appStore.sidebarCollapsed" :size="15" :stroke-width="1.8" />
      <PanelLeftOpen v-else :size="15" :stroke-width="1.8" />
      <span v-if="!appStore.sidebarCollapsed">收起菜单</span>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 216px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid var(--sidebar-border);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 17px 16px 13px;
  flex-shrink: 0;
}

.logo-icon {
  width: 26px;
  height: 26px;
  border-radius: 6px;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.logo-text-wrap {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.logo-text {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 2px 8px 8px;
}

.nav-group {
  margin-bottom: 2px;
}

.group-title {
  font-size: 11px;
  padding: 14px 10px 4px;
  color: var(--text-tertiary);
  font-weight: 500;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 10px;
  margin: 1px 0;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.15s, color 0.15s;
  border-radius: 6px;
  color: var(--sidebar-text);
}

.nav-icon {
  flex-shrink: 0;
  color: var(--text-tertiary);
  transition: color 0.15s;
}

.nav-item:hover {
  background: var(--sidebar-hover);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--sidebar-active);
  color: var(--sidebar-text-active);
  font-weight: 500;
}

.nav-item.active .nav-icon {
  color: var(--sidebar-text-active);
}

.nav-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.nav-count {
  margin-left: auto;
  font-size: 11.5px;
  color: var(--text-tertiary);
  font-variant-numeric: tabular-nums;
}

.collapse-btn {
  padding: 13px 18px;
  border-top: 1px solid var(--sidebar-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-tertiary);
  font-size: 12px;
  transition: color 0.15s;
  flex-shrink: 0;
}

.collapse-btn:hover {
  color: var(--text-secondary);
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 8px;
}

.sidebar.collapsed .collapse-btn {
  justify-content: center;
  padding: 13px 8px;
}

.sidebar.collapsed .logo {
  justify-content: center;
  padding: 17px 8px 13px;
}
</style>
