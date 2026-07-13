<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { Search, Bell, CircleHelp, Sun, Moon, Plus } from 'lucide-vue-next'

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
      <h2 class="page-title">{{ route.meta.title }}</h2>
    </div>
    <div class="right">
      <div class="search-box">
        <Search :size="14" :stroke-width="1.8" class="search-ic" />
        <input class="search-input" placeholder="搜索任务、素材、模板…" />
        <span class="search-kbd">⌘K</span>
      </div>
      <button class="icon-btn" title="通知">
        <Bell :size="15" :stroke-width="1.8" />
        <span class="badge-dot" />
      </button>
      <button class="icon-btn" title="帮助">
        <CircleHelp :size="15" :stroke-width="1.8" />
      </button>
      <button
        class="icon-btn"
        :title="appStore.isDark ? '切换浅色模式' : '切换深色模式'"
        @click="appStore.toggleColorMode()"
      >
        <Sun v-if="appStore.isDark" :size="15" :stroke-width="1.8" />
        <Moon v-else :size="15" :stroke-width="1.8" />
      </button>
      <button class="btn-primary" @click="goCreate">
        <Plus :size="14" :stroke-width="2" />
        创建批量任务
      </button>
      <el-dropdown>
        <div class="user-info">
          <span class="user-avatar">MO</span>
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
  height: 52px;
  padding: 0 20px;
  background: var(--topbar-bg);
  border-bottom: 1px solid var(--topbar-border);
  gap: 12px;
  flex-shrink: 0;
  z-index: 50;
}

.left {
  display: flex;
  align-items: center;
  min-width: 0;
}

.page-title {
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;
  color: var(--text-primary);
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 7px;
  width: 260px;
  height: 30px;
  padding: 0 10px;
  background: var(--bg-fill);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-tertiary);
  transition: border-color 0.15s;
}

.search-box:focus-within {
  border-color: var(--primary);
}

.search-ic {
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 12.5px;
  color: var(--text-primary);
  font-family: inherit;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.search-kbd {
  font-size: 11px;
  color: var(--text-tertiary);
  flex-shrink: 0;
}

.icon-btn {
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.icon-btn:hover {
  background: var(--bg-fill);
  color: var(--text-primary);
}

.badge-dot {
  position: absolute;
  top: 6px;
  right: 7px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--danger);
  border: 1.5px solid var(--topbar-bg);
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 5px;
  height: 30px;
  padding: 0 12px;
  border-radius: 6px;
  border: none;
  background: var(--primary);
  color: #fff;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  white-space: nowrap;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 7px;
  cursor: pointer;
  padding: 3px 8px 3px 3px;
  border-radius: 6px;
  transition: background 0.15s;
}

.user-info:hover {
  background: var(--bg-fill);
}

.user-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--sidebar-active);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10.5px;
  font-weight: 600;
}

.user-name {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text-secondary);
}
</style>
