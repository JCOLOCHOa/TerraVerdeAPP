<script setup lang="ts">
const mapa = 'https://maps.google.com/maps?q=14.6101825,-90.8009254&z=16&output=embed'
</script>

<template>
  <section id="contacto" class="seccion">
    <div class="contenedor ubicacion">
      <div class="ubicacion__texto revelar">
        <h2>Nuestra ubicación</h2>
        <hr class="filete filete--izq" />
        <p>
          Estamos en Parramos, Chimaltenango, en un entorno natural de fácil acceso
          y con parqueo dentro del terreno. Agenda una visita para conocer el lugar
          antes de reservar.
        </p>

        <ul class="datos">
          <li>
            <AppIcon name="ubicacion" :size="20" />
            <span>Jardín Terra Verde<br />Parramos, Chimaltenango, Guatemala</span>
          </li>
          <li>
            <AppIcon name="telefono" :size="20" />
            <a href="tel:+50241897550">+502 4189-7550</a>
          </li>
          <li>
            <AppIcon name="correo" :size="20" />
            <a href="mailto:terra.verde@outlook.es">terra.verde@outlook.es</a>
          </li>
          <li>
            <AppIcon name="reloj" :size="20" />
            <span>Visitas al lugar: lunes a sábado, 9:00 a 17:00</span>
          </li>
        </ul>

        <a
          class="btn btn--principal"
          href="https://wa.me/50241897550"
          target="_blank"
          rel="noopener"
        >
          <AppIcon name="whatsapp" :size="19" />
          Escribir por WhatsApp
        </a>
      </div>

      <div class="ubicacion__mapa revelar">
        <iframe
          :src="mapa"
          title="Mapa de Jardín Terra Verde en Parramos"
          width="600"
          height="450"
          style="border: 0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ubicacion {
  display: grid;
  gap: 46px;
  align-items: center;
}

.datos {
  list-style: none;
  margin: 30px 0;
  padding: 0;
  display: grid;
  gap: 18px;
}

.datos li {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  font-size: 0.96rem;
  color: #4a4a4a;
}

.datos svg {
  color: var(--dorado-oscuro);
  margin-top: 3px;
}

.ubicacion__mapa {
  border: var(--borde);
  border-radius: var(--radio);
  overflow: hidden;
  box-shadow: var(--sombra);
  line-height: 0;
}

.ubicacion__mapa iframe {
  width: 100%;
  height: 430px;
}

@media (min-width: 900px) {
  .ubicacion {
    grid-template-columns: 1fr 1.15fr;
    gap: 64px;
  }
}
</style>
