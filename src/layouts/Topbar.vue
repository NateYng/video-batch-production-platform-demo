<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { Bell, QuestionFilled, Search, Sunny, Moon } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()

function goCreate() {
  router.push('/create-task')
}
</script>

<template>
  <header class="topbar">
    <div class="left">
      <div class="breadcrumb">
        <span class="bc-module">视频生产中台</span>
        <span class="bc-sep">/</span>
        <h2 class="page-title">{{ route.meta.title }}</h2>
      </div>
      <div class="live-status">
        <span class="live-dot" />
        <span>系统运行中</span>
      </div>
    </div>
    <div class="center">
      <el-input
        placeholder="搜索任务、素材、模板、知识库..."
        :prefix-icon="Search"
        class="search-input"
        clearable
      />
    </div>
    <div class="right">
      <el-button type="primary" class="create-btn" @click="goCreate">
        <span class="btn-glow" />
        + 创建批量任务
      </el-button>
      <el-badge :value="12" class="icon-btn">
        <el-button :icon="Bell" circle class="icon-circle" />
      </el-badge>
      <el-button :icon="QuestionFilled" circle class="icon-circle" />
      <el-tooltip :content="appStore.isDark ? '切换浅色模式' : '切换深色模式'" placement="bottom">
        <el-button
          circle
          class="icon-circle theme-toggle"
          :icon="appStore.isDark ? Sunny : Moon"
          @click="appStore.toggleColorMode()"
        />
      </el-tooltip>
      <el-dropdown>
        <div class="user-info">
          <el-avatar :size="34" class="user-avatar">MO</el-avatar>
          <div class="user-meta">
            <span class="user-name">市场运营团队</span>
            <span class="user-role">管理员</span>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人设置</el-dropdown-item>
            <el-dropdown-item divided>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(99, 102, 241, 0.08);
  gap: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
}

.bc-module {
  font-size: 11px;
  color: var(--text-tertiary);
  letter-spacing: 0.5px;
}

.bc-sep {
  color: var(--text-tertiary);
  font-size: 12px;
}

.page-title {
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  letter-spacing: -0.2px;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--success);
}

.live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--success);
  box-shadow: 0 0 6px var(--success);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.center {
  flex: 1;
  max-width: 420px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(99, 102, 241, 0.04);
  border-radius: 20px !important;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.create-btn {
  position: relative;
  overflow: hidden;
  border-radius: 8px !important;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.icon-circle {
  background: rgba(99, 102, 241, 0.06) !important;
  border: 1px solid rgba(99, 102, 241, 0.1) !important;
}

.theme-toggle:hover {
  border-color: rgba(0, 180, 216, 0.35) !important;
  color: var(--primary) !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px 4px 4px;
  border-radius: 24px;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(99, 102, 241, 0.06);
}

.user-avatar {
  background: linear-gradient(135deg, #00b4d8, #6366f1) !important;
  font-size: 12px;
  font-weight: 700;
}

.user-meta {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.user-name {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
}

.user-role {
  font-size: 10px;
  color: var(--text-tertiary);
}

.icon-btn {
  margin: 0;
}
</style>
