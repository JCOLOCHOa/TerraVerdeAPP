<script setup lang="ts">
/**
 * Set de iconos SVG de trazo. Todos comparten grid de 24px.
 * Uso: <AppIcon name="telefono" :size="20" />
 */
const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    stroke?: number
  }>(),
  { size: 24, stroke: 1.6 }
)

// Iconos de trazo (usan currentColor y el grosor definido)
const trazo: Record<string, string> = {
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
  calendario:
    '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  ubicacion:
    '<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>',
  telefono:
    '<path d="M6.2 3.5h3l1.6 4-2 1.4a12.5 12.5 0 0 0 6.3 6.3l1.4-2 4 1.6v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.2 5.7a2 2 0 0 1 2-2.2z"/>',
  correo:
    '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  personas:
    '<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20a6.2 6.2 0 0 1 12.4 0"/><path d="M16.5 5.4a3.2 3.2 0 0 1 0 5.2M18 14.4A6.2 6.2 0 0 1 21.2 20"/>',
  hoja: '<path d="M20 4c0 9-5.4 14-12 14H5c0-8 5-14 12-14z"/><path d="M5 20c1.5-5 4.6-8.5 9-11"/>',
  anillos:
    '<circle cx="9" cy="15" r="5.2"/><circle cx="16" cy="15" r="5.2"/><path d="M12.5 6.2 14 3.5h-4l1.5 2.7z"/>',
  maletin:
    '<rect x="2.6" y="7.5" width="18.8" height="12.5" rx="2"/><path d="M8.6 7.5V6a2 2 0 0 1 2-2h2.8a2 2 0 0 1 2 2v1.5M2.6 12.5h18.8"/>',
  copa: '<path d="M7 3h10l-1 5.2a4 4 0 0 1-8 0L7 3z"/><path d="M12 12.5V21M8.5 21h7"/>',
  camara:
    '<path d="M3 8h3.4l1.5-2.4h8.2L17.6 8H21a1 1 0 0 1 1 1v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.4" r="3.6"/>',
  reloj: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.4l3.4 2"/>',
  cheque: '<path d="M4.5 12.6 9.5 17.5 19.5 6.8"/>',
  aviso:
    '<circle cx="12" cy="12" r="9"/><path d="M12 7.6v5M12 16.2h.01"/>',
  flechaAbajo: '<path d="M12 4.5v14M6.5 13l5.5 5.5L17.5 13"/>',
  flechaDer: '<path d="M4.5 12h14M13 6l6 6-6 6"/>',
  whatsapp:
    '<path d="M3.5 20.5 5 16.4A8.2 8.2 0 1 1 8.2 19.4l-4.7 1.1z"/><path d="M9 9.2c.3 2.4 2.4 4.5 4.8 4.8.6.1 1.2-.4 1.2-1v-.7l-1.7-.6-.8.8a6 6 0 0 1-2-2l.8-.8L10.7 8H10c-.6 0-1.1.6-1 1.2z"/>'
}

// Iconos de relleno (marcas), no usan grosor de trazo
const relleno: Record<string, string> = {
  instagram:
    '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/>',
  facebook:
    '<path fill="currentColor" d="M13.5 21v-7.4h2.5l.4-2.9h-2.9V8.8c0-.85.24-1.42 1.45-1.42h1.55V4.79A20 20 0 0 0 14.24 4.6c-2.24 0-3.77 1.37-3.77 3.87v2.23H8v2.9h2.47V21z"/>',
  tiktok:
    '<path fill="currentColor" d="M16.2 3h-2.6v11.4a2.35 2.35 0 1 1-2-2.32V9.4a5.25 5.25 0 1 0 4.6 5.2V9.2a6.1 6.1 0 0 0 3.4 1.05V7.6a3.6 3.6 0 0 1-3.4-3.5z"/>'
}

const esRelleno = computed(() => props.name in relleno)
const contenido = computed(() => relleno[props.name] ?? trazo[props.name] ?? '')
</script>

<template>
  <svg
    class="icono"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    :fill="esRelleno ? 'currentColor' : 'none'"
    :stroke="esRelleno ? 'none' : 'currentColor'"
    :stroke-width="esRelleno ? 0 : stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="contenido"
  />
</template>

<style scoped>
.icono {
  flex-shrink: 0;
  display: block;
}
</style>
