<script setup lang="ts">
/**
 * Sustituye los archivos de /public/images/galeria por las fotos reales
 * del jardín, conservando los mismos nombres o actualizando esta lista.
 */
const fotos = [
  { src: '/images/galeria/jardin-01.jpg', alt: 'Área verde principal del jardín' },
  { src: '/images/galeria/jardin-02.jpg', alt: 'Montaje de mesas para recepción' },
  { src: '/images/galeria/jardin-03.jpg', alt: 'Camino de ingreso al jardín' },
  { src: '/images/galeria/jardin-04.jpg', alt: 'Área de ceremonia al aire libre' },
  { src: '/images/galeria/jardin-05.jpg', alt: 'Iluminación del jardín al atardecer' },
  { src: '/images/galeria/jardin-06.jpg', alt: 'Vista general del terreno' }
]

const activa = ref<number | null>(null)

function abrir(i: number) {
  activa.value = i
}
function cerrar() {
  activa.value = null
}
function alTeclado(e: KeyboardEvent) {
  if (activa.value === null) return
  if (e.key === 'Escape') cerrar()
  if (e.key === 'ArrowRight') activa.value = (activa.value + 1) % fotos.length
  if (e.key === 'ArrowLeft') activa.value = (activa.value - 1 + fotos.length) % fotos.length
}

onMounted(() => window.addEventListener('keydown', alTeclado))
onBeforeUnmount(() => window.removeEventListener('keydown', alTeclado))
</script>

<template>
  <section id="galeria" class="seccion seccion--clara">
    <div class="contenedor">
      <h2 class="seccion__titulo revelar">Galería</h2>
      <hr class="filete revelar" />
      <p class="intro revelar">
        Así se ve el lugar en un día normal y en día de evento.
      </p>

      <div class="rejilla">
        <button
          v-for="(f, i) in fotos"
          :key="f.src"
          class="rejilla__item revelar"
          @click="abrir(i)"
        >
          <img :src="f.src" :alt="f.alt" loading="lazy" />
          <span class="rejilla__lupa"><AppIcon name="camara" :size="22" /></span>
        </button>
      </div>
    </div>

    <Transition name="visor">
      <div
        v-if="activa !== null"
        class="visor"
        role="dialog"
        aria-modal="true"
        aria-label="Imagen ampliada"
        @click.self="cerrar"
      >
        <button class="visor__cerrar" aria-label="Cerrar imagen" @click="cerrar">
          <AppIcon name="cerrar" :size="26" />
        </button>
        <img :src="fotos[activa].src" :alt="fotos[activa].alt" />
        <p class="visor__pie">{{ fotos[activa].alt }}</p>
      </div>
    </Transition>
  </section>
</template>

<style scoped>
.rejilla {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 44px;
}

.rejilla__item {
  position: relative;
  padding: 0;
  border: 0;
  cursor: pointer;
  overflow: hidden;
  border-radius: var(--radio);
  aspect-ratio: 4 / 3;
  background: var(--beige);
}

.rejilla__item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s var(--ease);
}
.rejilla__item:hover img {
  transform: scale(1.06);
}

.rejilla__lupa {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--marfil);
  background: rgba(37, 55, 34, 0.42);
  opacity: 0;
  transition: opacity 0.35s var(--ease);
}
.rejilla__item:hover .rejilla__lupa,
.rejilla__item:focus-visible .rejilla__lupa {
  opacity: 1;
}

.visor {
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(18, 26, 16, 0.92);
  display: grid;
  place-items: center;
  padding: 32px;
}

.visor img {
  max-width: min(1000px, 92vw);
  max-height: 78vh;
  object-fit: contain;
  border-radius: var(--radio);
}

.visor__pie {
  color: var(--beige);
  text-align: center;
  font-size: 0.9rem;
  margin: 14px 0 0;
}

.visor__cerrar {
  position: absolute;
  top: 22px;
  right: 22px;
  background: none;
  border: 0;
  color: var(--marfil);
  cursor: pointer;
}

.visor-enter-active,
.visor-leave-active {
  transition: opacity 0.3s var(--ease);
}
.visor-enter-from,
.visor-leave-to {
  opacity: 0;
}
</style>
