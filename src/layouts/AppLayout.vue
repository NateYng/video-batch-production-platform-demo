<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Topbar from './Topbar.vue'
import { useAppStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()
const isDark = computed(() => route.meta.theme === 'dark')
</script>

<template>
  <div class="app-layout" :class="{ dark: isDark }">
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
  margin-left: 220px;
  transition: margin-left 0.2s;
}

.main-area.collapsed {
  margin-left: 64px;
}

.page-content {
  flex: 1;
  overflow: auto;
  padding: 16px 20px;
  background: var(--bg-page);
}

.app-layout.dark .page-content {
  background: #0b1220;
}
</style>
