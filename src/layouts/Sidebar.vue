<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import {
  Odometer, List, DocumentCopy, Connection, Document, VideoCamera,
  FolderOpened, Setting, Checked, Promotion,
  DataAnalysis, Fold, Expand,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

const menuGroups = [
  {
    title: '工作台',
    items: [{ path: '/dashboard', title: '工作台', icon: Odometer }],
  },
  {
    title: '生产中心',
    items: [
      { path: '/batch-tasks', title: '批量任务', icon: List },
      { path: '/templates', title: '模板创作', icon: DocumentCopy },
      { path: '/agent-flow', title: '智能体编排', icon: Connection },
      { path: '/create-task', title: '创建任务', icon: Document, hidden: true },
      { path: '/videos', title: '视频结果', icon: VideoCamera },
      { path: '/assets', title: '素材管理', icon: FolderOpened },
    ],
  },
  {
    title: '审核中心',
    items: [
      { path: '/audit', title: '质检审核', icon: Checked, badge: appStore.pendingAuditCount },
    ],
  },
  {
    title: '发布中心',
    items: [
      { path: '/publish', title: '发布管理', icon: Promotion },
    ],
  },
  {
    title: '数据中心',
    items: [
      { path: '/data', title: '数据看板', icon: DataAnalysis },
    ],
  },
  {
    title: '系统管理',
    items: [
      { path: '/settings', title: '系统配置', icon: Setting },
    ],
  },
]

const activePath = computed(() => route.path)

function navigate(path) {
  router.push(path)
}
</script>

<template>
  <aside class="sidebar" :class="{ collapsed: appStore.sidebarCollapsed }">
    <div class="sidebar-glow" />
    <div class="logo">
      <div class="logo-icon">
        <el-icon :size="20"><VideoCamera /></el-icon>
      </div>
      <div v-if="!appStore.sidebarCollapsed" class="logo-text-wrap">
        <span class="logo-text">视频批量生产</span>
        <span class="logo-sub">AI Production Platform</span>
      </div>
    </div>
    <nav class="nav">
      <div v-for="group in menuGroups" :key="group.title" class="nav-group">
        <div v-if="!appStore.sidebarCollapsed" class="group-title">
          <span class="group-dot" />
          {{ group.title }}
        </div>
        <div
          v-for="item in group.items.filter((i) => !i.hidden)"
          :key="item.path"
          class="nav-item"
          :class="{ active: activePath === item.path || activePath.startsWith(item.path + '/') }"
          @click="navigate(item.path)"
        >
          <div class="nav-icon-wrap">
            <el-icon><component :is="item.icon" /></el-icon>
          </div>
          <span v-if="!appStore.sidebarCollapsed" class="nav-label">{{ item.title }}</span>
          <el-badge
            v-if="item.badge && !appStore.sidebarCollapsed"
            :value="item.badge"
            class="badge"
          />
          <div v-if="activePath === item.path || activePath.startsWith(item.path + '/')" class="active-indicator" />
        </div>
      </div>
    </nav>
    <div class="collapse-btn" @click="appStore.toggleSidebar">
      <el-icon><Fold v-if="!appStore.sidebarCollapsed" /><Expand v-else /></el-icon>
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
  width: 232px;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border-right: 1px solid var(--sidebar-border);
  overflow: hidden;
}

.sidebar-glow {
  position: absolute;
  top: -60px;
  left: -40px;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, rgba(110, 121, 247, 0.14) 0%, transparent 70%);
  pointer-events: none;
}

.sidebar.collapsed {
  width: 72px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 16px;
  border-bottom: 1px solid var(--sidebar-border);
  position: relative;
  z-index: 1;
}

.logo-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6e79f7 0%, #22d3ee 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(110, 121, 247, 0.4);
}

.logo-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.logo-text {
  font-size: 14px;
  font-weight: 700;
  color: #f2f4f8;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.logo-sub {
  font-size: 9px;
  color: rgba(34, 211, 238, 0.65);
  letter-spacing: 1px;
  text-transform: uppercase;
  white-space: nowrap;
}

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 12px 10px;
  position: relative;
  z-index: 1;
}

.nav-group {
  margin-bottom: 6px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 10px;
  padding: 10px 12px 6px;
  color: #4b515e;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  font-weight: 600;
}

.group-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6e79f7, #22d3ee);
  flex-shrink: 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  margin: 2px 0;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  position: relative;
  border-radius: 8px;
  color: #8a8f9d;
}

.nav-icon-wrap {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.045);
  color: #d5d9e2;
}

.nav-item:hover .nav-icon-wrap {
  background: rgba(255, 255, 255, 0.06);
  color: #aab1ff;
}

.nav-item.active {
  background: rgba(110, 121, 247, 0.14);
  color: #f2f4f8;
}

.nav-item.active .nav-icon-wrap {
  background: linear-gradient(135deg, rgba(110, 121, 247, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%);
  color: #aab1ff;
  box-shadow: 0 0 12px rgba(110, 121, 247, 0.25);
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: linear-gradient(180deg, #6e79f7, #22d3ee);
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px rgba(110, 121, 247, 0.55);
}

.badge {
  margin-left: auto;
}

.collapse-btn {
  padding: 14px 16px;
  border-top: 1px solid var(--sidebar-border);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #5d6472;
  font-size: 12px;
  transition: color 0.2s;
  position: relative;
  z-index: 1;
}

.collapse-btn:hover {
  color: #9aa2b5;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 10px;
}

.sidebar.collapsed .nav-icon-wrap {
  margin: 0;
}
</style>
