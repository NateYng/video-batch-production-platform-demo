<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import {
  Odometer, List, DocumentCopy, Connection, Document, VideoCamera,
  FolderOpened, Collection, DataAnalysis, Setting, Checked, Promotion,
  Fold, Expand,
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
    <div class="logo">
      <el-icon :size="22" color="#38bdf8"><VideoCamera /></el-icon>
      <span v-if="!appStore.sidebarCollapsed" class="logo-text">视频批量生产平台</span>
    </div>
    <nav class="nav">
      <div v-for="group in menuGroups" :key="group.title" class="nav-group">
        <div v-if="!appStore.sidebarCollapsed" class="group-title">{{ group.title }}</div>
        <div
          v-for="item in group.items.filter((i) => !i.hidden)"
          :key="item.path"
          class="nav-item"
          :class="{ active: activePath === item.path || activePath.startsWith(item.path + '/') }"
          @click="navigate(item.path)"
        >
          <el-icon><component :is="item.icon" /></el-icon>
          <span v-if="!appStore.sidebarCollapsed">{{ item.title }}</span>
          <el-badge
            v-if="item.badge && !appStore.sidebarCollapsed"
            :value="item.badge"
            class="badge"
          />
        </div>
      </div>
    </nav>
    <div class="collapse-btn" @click="appStore.toggleSidebar">
      <el-icon><Fold v-if="!appStore.sidebarCollapsed" /><Expand v-else /></el-icon>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 220px;
  background: #0f172a;
  color: #94a3b8;
  display: flex;
  flex-direction: column;
  z-index: 100;
  transition: width 0.2s;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px;
  border-bottom: 1px solid #1e293b;
}

.logo-text {
  font-size: 14px;
  font-weight: 600;
  color: #f1f5f9;
  white-space: nowrap;
}

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 8px 0;
}

.nav-group {
  margin-bottom: 8px;
}

.group-title {
  font-size: 11px;
  text-transform: uppercase;
  padding: 8px 16px 4px;
  color: #475569;
  letter-spacing: 0.5px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
  position: relative;
}

.nav-item:hover {
  background: #1e293b;
  color: #e2e8f0;
}

.nav-item.active {
  background: rgba(14, 165, 233, 0.15);
  color: #38bdf8;
  border-right: 3px solid #38bdf8;
}

.badge {
  margin-left: auto;
}

.collapse-btn {
  padding: 12px 16px;
  border-top: 1px solid #1e293b;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #64748b;
}

.collapse-btn:hover {
  color: #94a3b8;
}
</style>
