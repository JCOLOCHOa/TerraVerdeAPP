<script setup lang="ts">
const listo = ref(false)
onMounted(() => {
  
  requestAnimationFrame(() => setTimeout(() => (listo.value = true), 80))
})
</script>

<template>
  <section id="inicio" class="hero" :class="{ 'hero--listo': listo }">
    <div class="hero__fondo" aria-hidden="true"></div>
    <div class="hero__velo" aria-hidden="true"></div>

    <div class="contenedor hero__contenido">
      <p class="hero__eyebrow">Parramos, Chimaltenango</p>
      <h1 class="hero__titulo">Terra Verde</h1>
      <p class="hero__script">Momentos que florecen</p>
      <p class="hero__bajada">
        Un jardín para bodas, quinceaños y eventos corporativos, rodeado de montaña
        y con espacio para celebrar sin prisa.
      </p>

      <div class="hero__acciones">
        <a href="#reservaciones" class="btn btn--principal">Reservar una fecha</a>
        <a href="#galeria" class="btn btn--contorno">Ver el lugar</a>
      </div>
    </div>

    <a href="#sobre-nosotros" class="hero__bajar" aria-label="Ir a la siguiente sección">
      <AppIcon name="flechaAbajo" :size="22" />
    </a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: grid;
  align-items: center;
  overflow: hidden;
  isolation: isolate;
}

.hero__fondo {
  position: absolute;
  inset: -3%;
  z-index: -2;
  background: url('/images/Volcan.jpg') center / cover no-repeat;
  transform: scale(1.08);
  transition: transform 2.4s var(--ease);
}
.hero--listo .hero__fondo {
  transform: scale(1);
}

.hero__velo {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(
    to bottom,
    rgba(20, 34, 18, 0.62) 0%,
    rgba(20, 34, 18, 0.38) 45%,
    rgba(20, 34, 18, 0.72) 100%
  );
}

.hero__contenido {
  color: var(--marfil);
  text-align: center;
  padding-block: 140px 110px;
}

.hero__contenido > * {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.9s var(--ease), transform 0.9s var(--ease);
}
.hero--listo .hero__contenido > * {
  opacity: 1;
  transform: none;
}
.hero--listo .hero__eyebrow {
  transition-delay: 0.15s;
}
.hero--listo .hero__titulo {
  transition-delay: 0.3s;
}
.hero--listo .hero__script {
  transition-delay: 0.5s;
}
.hero--listo .hero__bajada {
  transition-delay: 0.65s;
}
.hero--listo .hero__acciones {
  transition-delay: 0.8s;
}

.hero__eyebrow {
  font-size: 0.8rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--beige);
  margin-bottom: 18px;
}

.hero__titulo {
  font-size: clamp(3.2rem, 10vw, 6.5rem);
  color: var(--marfil);
  font-weight: 500;
  letter-spacing: 0.01em;
  margin-bottom: 4px;
}

.hero__script {
  font-family: var(--script);
  font-size: clamp(1.9rem, 4.5vw, 2.9rem);
  color: var(--dorado);
  margin-bottom: 26px;
}

.hero__bajada {
  max-width: 54ch;
  margin-inline: auto;
  font-size: 1.05rem;
  color: rgba(250, 248, 241, 0.92);
}

.hero__acciones {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
  margin-top: 34px;
}

.hero__bajar {
  position: absolute;
  bottom: 26px;
  left: 50%;
  translate: -50% 0;
  color: var(--marfil);
  opacity: 0.75;
  animation: flotar 2.6s var(--ease) infinite;
}
.hero__bajar:hover {
  color: var(--dorado);
}

@keyframes flotar {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__bajar {
    animation: none;
  }
  .hero__contenido > * {
    opacity: 1;
    transform: none;
  }
}
</style>
