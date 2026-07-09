<script setup>
import { useAppStore } from '@/stores'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'

const appStore = useAppStore()
</script>

<template>
  <div class="app-layout" :class="{ dark: appStore.isDark }">
    <Sidebar />
    <div class="main-area" :class="{ collapsed: appStore.sidebarCollapsed }">
      <Topbar />
      <main class="page-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  margin-left: 232px;
  transition: margin-left 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-area.collapsed {
  margin-left: 72px;
}

.page-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 10px 14px;
  display: flex;
  flex-direction: column;
}
</style>
