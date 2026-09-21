<script setup lang="ts">
const eventos = [
  {
    icono: 'anillos',
    titulo: 'Bodas',
    texto:
      'Ceremonia al aire libre y recepción en el jardín, con espacio para montaje de mesas, pista y área de fotografía.'
  },
  {
    icono: 'copa',
    titulo: 'Quinceaños',
    texto:
      'Un escenario natural para la celebración, con áreas verdes amplias y iluminación cálida al caer la tarde.'
  },
  {
    icono: 'maletin',
    titulo: 'Eventos corporativos',
    texto:
      'Convivios, cierres de año y actividades de empresa fuera de la oficina, a corta distancia de la ciudad.'
  }
]
</script>

<template>
  <section id="sobre-nosotros" class="seccion">
    <div class="contenedor">
      <h2 class="seccion__titulo revelar">Bienvenidos a Terra Verde</h2>
      <hr class="filete revelar" />

      <p class="intro revelar">
        Terra Verde es un jardín de eventos en Parramos. Trabajamos con un número
        limitado de celebraciones al mes para poder acompañar cada montaje de
        cerca, desde la visita al lugar hasta el día del evento.
      </p>

      <div class="filosofia">
        <article class="filosofia__bloque revelar">
          <AppIcon name="hoja" :size="26" class="filosofia__icono" />
          <h3>Misión</h3>
          <p>
            Ofrecer un espacio natural y elegante para eventos inolvidables,
            garantizando un servicio de excelencia.
          </p>
        </article>

        <article class="filosofia__bloque revelar">
          <AppIcon name="ubicacion" :size="26" class="filosofia__icono" />
          <h3>Visión</h3>
          <p>
            Ser el jardín de eventos líder en la región de Parramos, destacando
            por su belleza e innovación.
          </p>
        </article>
      </div>

      <div class="tarjetas">
        <article v-for="e in eventos" :key="e.titulo" class="tarjeta revelar">
          <span class="tarjeta__icono"><AppIcon :name="e.icono" :size="24" /></span>
          <h3>{{ e.titulo }}</h3>
          <p>{{ e.texto }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.filosofia {
  display: grid;
  gap: 40px;
  margin: 56px 0 70px;
}

.filosofia__bloque {
  border-left: 2px solid var(--dorado);
  padding-left: 24px;
}

.filosofia__icono {
  color: var(--verde-oliva);
  margin-bottom: 12px;
}

.filosofia__bloque p {
  margin-bottom: 0;
  color: #4a4a4a;
}

.tarjetas {
  display: grid;
  gap: 26px;
}

.tarjeta {
  background: var(--verde-claro);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 34px 30px;
  transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease);
}

.tarjeta:hover {
  transform: translateY(-4px);
  box-shadow: var(--sombra);
}

.tarjeta__icono {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--dorado);
  border-radius: 50%;
  color: var(--verde-bosque);
  margin-bottom: 18px;
}

.tarjeta p {
  margin-bottom: 0;
  font-size: 0.96rem;
  color: #4a4a4a;
}

@media (min-width: 760px) {
  .filosofia {
    grid-template-columns: 1fr 1fr;
  }
  .tarjetas {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
