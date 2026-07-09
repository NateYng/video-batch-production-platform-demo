<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAppStore } from '@/stores'

const route = useRoute()
const appStore = useAppStore()

watch(
  () => route.meta.theme,
  (theme) => {
    appStore.setDarkPage(theme === 'dark')
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark-page' : 'light')
  },
  { immediate: true }
)
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>
