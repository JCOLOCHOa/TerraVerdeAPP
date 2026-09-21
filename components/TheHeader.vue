<script setup lang="ts">
const enlaces = [
  { texto: 'Inicio', href: '#inicio' },
  { texto: 'Sobre nosotros', href: '#sobre-nosotros' },
  { texto: 'Galería', href: '#galeria' },
  { texto: 'Reservaciones', href: '#reservaciones' },
  { texto: 'Contacto', href: '#contacto' }
]

const abierto = ref(false)
const compacto = ref(false)

function alScroll() {
  compacto.value = window.scrollY > 60
}

onMounted(() => {
  alScroll()
  window.addEventListener('scroll', alScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', alScroll))
</script>

<template>
  <header class="cabecera" :class="{ 'cabecera--compacta': compacto }">
    <div class="contenedor cabecera__fila">
      <a href="#inicio" class="marca" @click="abierto = false">
        <span class="marca__nombre">Terra Verde</span>
        <span class="marca__sub">Jardín &amp; Eventos</span>
      </a>

      <nav class="nav" aria-label="Navegación principal">
        <a v-for="e in enlaces" :key="e.href" :href="e.href" class="nav__link">
          {{ e.texto }}
        </a>
      </nav>

      <button
        class="hamburguesa"
        :aria-expanded="abierto"
        aria-controls="menu-movil"
        :aria-label="abierto ? 'Cerrar menú' : 'Abrir menú'"
        @click="abierto = !abierto"
      >
        <AppIcon :name="abierto ? 'cerrar' : 'menu'" :size="26" />
      </button>
    </div>

    <Transition name="desplegar">
      <nav v-show="abierto" id="menu-movil" class="menu-movil" aria-label="Navegación móvil">
        <a
          v-for="e in enlaces"
          :key="e.href"
          :href="e.href"
          class="menu-movil__link"
          @click="abierto = false"
        >
          {{ e.texto }}
        </a>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
.cabecera {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 60;
  background: rgba(250, 248, 241, 0);
  transition: background-color 0.4s var(--ease), box-shadow 0.4s var(--ease),
    padding 0.4s var(--ease);
  padding-block: 18px;
}

.cabecera--compacta {
  background: rgba(250, 248, 241, 0.96);
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 0 rgba(49, 91, 44, 0.12);
  padding-block: 10px;
}

.cabecera__fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.marca {
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  color: var(--marfil);
  transition: color 0.4s var(--ease);
}
.cabecera--compacta .marca {
  color: var(--verde-bosque);
}

.marca__nombre {
  font-family: var(--script);
  font-size: 2rem;
}

.marca__sub {
  font-size: 0.66rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  opacity: 0.85;
  padding-left: 3px;
}

.nav {
  display: none;
  gap: 30px;
}

.nav__link {
  position: relative;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--marfil);
  padding-block: 4px;
}
.cabecera--compacta .nav__link {
  color: var(--verde-bosque);
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px;
  background: var(--dorado);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.35s var(--ease);
}
.nav__link:hover::after {
  transform: scaleX(1);
}

.hamburguesa {
  background: none;
  border: 0;
  cursor: pointer;
  color: var(--marfil);
  padding: 6px;
  display: grid;
  place-items: center;
}
.cabecera--compacta .hamburguesa {
  color: var(--verde-bosque);
}

.menu-movil {
  background: var(--marfil);
  border-top: var(--borde);
  display: flex;
  flex-direction: column;
  margin-top: 14px;
  overflow: hidden;
}

.menu-movil__link {
  padding: 15px 24px;
  border-bottom: var(--borde);
  font-size: 0.95rem;
  font-weight: 500;
}

.desplegar-enter-active,
.desplegar-leave-active {
  transition: max-height 0.4s var(--ease), opacity 0.3s var(--ease);
  max-height: 340px;
}
.desplegar-enter-from,
.desplegar-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (min-width: 900px) {
  .nav {
    display: flex;
  }
  .hamburguesa,
  .menu-movil {
    display: none;
  }
}
</style>
