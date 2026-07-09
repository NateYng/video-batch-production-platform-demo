<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAppStore } from '@/stores'
import { Bell, QuestionFilled, Search } from '@element-plus/icons-vue'

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
    <div class="center">
      <el-input
        placeholder="搜索任务、素材、模板、知识库..."
        :prefix-icon="Search"
        class="search-input"
        clearable
      />
    </div>
    <div class="right">
      <el-button type="primary" @click="goCreate">+ 创建批量任务</el-button>
      <el-badge :value="12" class="icon-btn">
        <el-button :icon="Bell" circle />
      </el-badge>
      <el-button :icon="QuestionFilled" circle />
      <el-dropdown>
        <div class="user-info">
          <el-avatar :size="32" style="background:#0ea5e9">MO</el-avatar>
          <span>市场运营团队</span>
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
  padding: 12px 20px;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border);
  gap: 16px;
}

.page-title {
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.center {
  flex: 1;
  max-width: 480px;
}

.search-input {
  width: 100%;
}

.right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 13px;
}

.icon-btn {
  margin: 0 4px;
}
</style>
