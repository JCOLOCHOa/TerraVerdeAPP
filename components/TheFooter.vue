<script setup lang="ts">
const anio = new Date().getFullYear()

const redes = [
  { icono: 'instagram', texto: '@_terra_verde', url: 'https://instagram.com/_terra_verde' },
  { icono: 'tiktok', texto: '@_terra_verde', url: 'https://tiktok.com/@_terra_verde' },
  { icono: 'facebook', texto: 'Terra Verde', url: 'https://facebook.com/' },
  { icono: 'whatsapp', texto: '4189-7550', url: 'https://wa.me/50241897550' }
]
</script>

<template>
  <footer class="pie">
    <div class="contenedor pie__rejilla">
      <div>
        <p class="pie__marca">Terra Verde</p>
        <p class="pie__sub">Jardín &amp; Eventos</p>
        <p class="pie__nota">
          Un espacio natural y elegante para celebrar en Parramos, Chimaltenango.
        </p>
      </div>

      <div>
        <h3 class="pie__titulo">Contacto</h3>
        <ul class="pie__lista">
          <li>
            <AppIcon name="ubicacion" :size="18" />
            <span>Parramos, Chimaltenango, Guatemala</span>
          </li>
          <li>
            <AppIcon name="telefono" :size="18" />
            <a href="tel:+50241897550">+502 4189-7550</a>
          </li>
          <li>
            <AppIcon name="correo" :size="18" />
            <a href="mailto:terra.verde@outlook.es">terra.verde@outlook.es</a>
          </li>
        </ul>
      </div>

      <div>
        <h3 class="pie__titulo">Redes</h3>
        <ul class="pie__lista">
          <li v-for="r in redes" :key="r.texto + r.icono">
            <AppIcon :name="r.icono" :size="18" />
            <a :href="r.url" target="_blank" rel="noopener">{{ r.texto }}</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="contenedor pie__legal">
      <p>Terra Verde Jardín &amp; Eventos · {{ anio }}</p>
    </div>
  </footer>
</template>

<style scoped>
.pie {
  background: var(--verde-bosque);
  color: var(--marfil);
  padding-top: 72px;
}

.pie__rejilla {
  display: grid;
  gap: 42px;
  padding-bottom: 48px;
}

.pie__marca {
  font-family: var(--script);
  font-size: 2.3rem;
  margin: 0;
  color: var(--marfil);
}

.pie__sub {
  font-size: 0.7rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--beige);
  margin: 0 0 18px;
}

.pie__nota {
  font-size: 0.92rem;
  color: rgba(250, 248, 241, 0.78);
  margin: 0;
}

.pie__titulo {
  font-family: var(--sans);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--dorado);
  margin-bottom: 18px;
}

.pie__lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 13px;
}

.pie__lista li {
  display: flex;
  gap: 11px;
  align-items: center;
  font-size: 0.92rem;
  color: rgba(250, 248, 241, 0.85);
}

.pie__lista svg {
  color: var(--dorado);
}

.pie__lista a {
  color: rgba(250, 248, 241, 0.85);
}
.pie__lista a:hover {
  color: var(--dorado);
}

.pie__legal {
  border-top: 1px solid rgba(250, 248, 241, 0.16);
  padding-block: 22px;
}

.pie__legal p {
  margin: 0;
  font-size: 0.82rem;
  color: rgba(250, 248, 241, 0.6);
}

@media (min-width: 800px) {
  .pie__rejilla {
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 56px;
  }
}
</style>
