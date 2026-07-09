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
        <span class="bc-module">视频中台</span>
        <span class="bc-sep">/</span>
        <h2 class="page-title">{{ route.meta.title }}</h2>
        <span class="live-status"><span class="live-dot" />运行中</span>
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
          <el-avatar :size="28" class="user-avatar">MO</el-avatar>
          <span class="user-name">市场运营</span>
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
  padding: 8px 14px;
  background: var(--topbar-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--topbar-border);
  gap: 12px;
  flex-shrink: 0;
  z-index: 50;
}

.left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
}

.bc-module {
  font-size: 10px;
  color: var(--text-tertiary);
  letter-spacing: 0.3px;
}

.bc-sep {
  color: var(--text-tertiary);
  font-size: 11px;
}

.page-title {
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
}

.live-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: var(--success);
  margin-left: 8px;
  padding: 2px 8px;
  background: rgba(16, 185, 129, 0.08);
  border-radius: 10px;
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
  max-width: 360px;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input__wrapper) {
  background: rgba(148, 155, 175, 0.06);
  border-radius: 20px !important;
}

.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.create-btn {
  font-size: 12px;
  padding: 6px 12px;
  height: 30px;
}

.icon-circle {
  background: rgba(148, 155, 175, 0.07) !important;
  border: 1px solid var(--border) !important;
  color: var(--text-secondary) !important;
}

.theme-toggle:hover {
  border-color: rgba(110, 121, 247, 0.45) !important;
  color: var(--primary-light) !important;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 2px 8px 2px 2px;
  border-radius: 20px;
  transition: background 0.2s;
}

.user-info:hover {
  background: rgba(148, 155, 175, 0.08);
}

.user-avatar {
  background: linear-gradient(135deg, #6e79f7, #22d3ee) !important;
  font-size: 12px;
  font-weight: 700;
}

.user-name {
  font-size: 12px;
  font-weight: 600;
}

.icon-btn {
  margin: 0;
}
</style>
