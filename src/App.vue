<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

onMounted(() => {
  document.documentElement.setAttribute('data-theme', appStore.colorMode)
})
</script>

<template>
  <AppLayout>
    <router-view />
  </AppLayout>
</template>
