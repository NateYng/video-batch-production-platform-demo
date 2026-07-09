<script setup>
import { onMounted } from 'vue'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAppStore } from '@/stores'

const appStore = useAppStore()

onMounted(() => {
  appStore.setColorMode(appStore.colorMode)
})
</script>

<template>
  <AppLayout>
    <div class="page-viewport">
      <router-view />
    </div>
  </AppLayout>
</template>
