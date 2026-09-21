<script setup lang="ts">
const route = useRoute()
// El panel de Jaime no lleva el encabezado ni el pie del sitio público
const esPanel = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <div>
    <TheHeader v-if="!esPanel" />
    <main>
      <NuxtPage />
    </main>
    <TheFooter v-if="!esPanel" />
  </div>
</template>
