<script setup lang="ts">
type Estado = 'inactivo' | 'enviando' | 'listo' | 'error'

const meses = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]
const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

const hoy = new Date()
hoy.setHours(0, 0, 0, 0)

const mesVisible = ref(hoy.getMonth())
const anioVisible = ref(hoy.getFullYear())

// Fechas ya tomadas, consultadas a la base de datos
const { data: disponibilidad } = await useFetch<{ fechas: string[] }>('/api/fechas-ocupadas')
const ocupadas = computed(() => new Set(disponibilidad.value?.fechas ?? []))

function iso(dia: number) {
  const mm = String(mesVisible.value + 1).padStart(2, '0')
  const dd = String(dia).padStart(2, '0')
  return `${anioVisible.value}-${mm}-${dd}`
}

const celdas = computed(() => {
  const primerDia = new Date(anioVisible.value, mesVisible.value, 1).getDay()
  const total = new Date(anioVisible.value, mesVisible.value + 1, 0).getDate()
  const lista: (number | null)[] = Array(primerDia).fill(null)
  for (let d = 1; d <= total; d++) lista.push(d)
  return lista
})

function esPasado(dia: number) {
  return new Date(anioVisible.value, mesVisible.value, dia) < hoy
}

function esOcupado(dia: number) {
  return ocupadas.value.has(iso(dia))
}

function cambiarMes(paso: number) {
  const nuevo = new Date(anioVisible.value, mesVisible.value + paso, 1)
  mesVisible.value = nuevo.getMonth()
  anioVisible.value = nuevo.getFullYear()
}

// ------------------------------------------------------------- formulario

const form = reactive({
  fecha: '',
  tipoEvento: '',
  invitados: '',
  nombre: '',
  email: '',
  telefono: '',
  comentarios: '',
  sitioWeb: ''
})

const errores = reactive<Record<string, string>>({})
const estado = ref<Estado>('inactivo')
const mensajeServidor = ref('')

function seleccionarDia(dia: number) {
  if (esPasado(dia) || esOcupado(dia)) return
  form.fecha = iso(dia)
  delete errores.fecha
}

const fechaLegible = computed(() => {
  if (!form.fecha) return 'Ninguna fecha seleccionada'
  const [a, m, d] = form.fecha.split('-').map(Number)
  return `${d} de ${meses[m - 1]} de ${a}`
})

const diaSeleccionado = computed(() => {
  if (!form.fecha) return null
  const [a, m, d] = form.fecha.split('-').map(Number)
  return a === anioVisible.value && m - 1 === mesVisible.value ? d : null
})

function validar() {
  Object.keys(errores).forEach((k) => delete errores[k])
  if (!form.fecha) errores.fecha = 'Elige una fecha disponible en el calendario.'
  if (!form.tipoEvento) errores.tipoEvento = 'Indica el tipo de evento.'
  if (!form.invitados || Number(form.invitados) < 1)
    errores.invitados = 'Escribe el número aproximado de invitados.'
  if (!form.nombre.trim()) errores.nombre = 'Escribe tu nombre.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errores.email = 'Revisa el correo, no tiene un formato válido.'
  if (form.telefono.replace(/\D/g, '').length < 8)
    errores.telefono = 'Escribe un teléfono de al menos 8 dígitos.'
  return Object.keys(errores).length === 0
}

async function enviar() {
  if (!validar()) {
    estado.value = 'error'
    mensajeServidor.value = 'Faltan datos por completar. Revisa los campos marcados.'
    return
  }

  estado.value = 'enviando'
  mensajeServidor.value = ''

  try {
    const respuesta = await $fetch<{ ok: boolean; mensaje: string }>('/api/reservacion', {
      method: 'POST',
      body: { ...form },
      timeout: 15000
    })
    estado.value = 'listo'
    mensajeServidor.value = respuesta.mensaje
    await nextTick()
    document.getElementById('reservaciones')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  } catch (e: any) {
    estado.value = 'error'
    mensajeServidor.value =
      e?.data?.data?.mensaje ??
      e?.data?.mensaje ??
      'No se pudo enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.'
  }
}

function nuevaSolicitud() {
  Object.assign(form, {
    fecha: '', tipoEvento: '', invitados: '', nombre: '',
    email: '', telefono: '', comentarios: '', sitioWeb: ''
  })
  estado.value = 'inactivo'
  mensajeServidor.value = ''
}
</script>

<template>
  <section id="reservaciones" class="seccion seccion--clara">
    <div class="contenedor">
      <h2 class="seccion__titulo revelar">Haz tu reservación</h2>
      <hr class="filete revelar" />
      <p class="intro revelar">
        Selecciona la fecha y cuéntanos del evento. Respondemos con la cotización
        y la disponibilidad confirmada en menos de 24 horas.
      </p>

      <!-- Confirmación (sin clase revelar: aparece después de la carga) -->
      <div v-if="estado === 'listo'" class="resultado resultado--ok">
        <AppIcon name="cheque" :size="34" />
        <h3>Solicitud enviada</h3>
        <p>{{ mensajeServidor }}</p>
        <button class="btn btn--principal" @click="nuevaSolicitud">
          Enviar otra solicitud
        </button>
      </div>

      <div v-else class="reserva">
        <!-- Calendario -->
        <div class="calendario revelar">
          <div class="calendario__barra">
            <button type="button" aria-label="Mes anterior" @click="cambiarMes(-1)">
              <AppIcon name="flechaDer" :size="18" class="girar" />
            </button>
            <p class="calendario__mes">{{ meses[mesVisible] }} {{ anioVisible }}</p>
            <button type="button" aria-label="Mes siguiente" @click="cambiarMes(1)">
              <AppIcon name="flechaDer" :size="18" />
            </button>
          </div>

          <div class="calendario__semana">
            <span v-for="(d, i) in diasSemana" :key="i">{{ d }}</span>
          </div>

          <div class="calendario__dias">
            <template v-for="(c, i) in celdas" :key="i">
              <span v-if="c === null" class="dia dia--vacio"></span>
              <button
                v-else
                type="button"
                class="dia"
                :class="{
                  'dia--activo': diaSeleccionado === c,
                  'dia--pasado': esPasado(c),
                  'dia--ocupado': esOcupado(c) && !esPasado(c)
                }"
                :disabled="esPasado(c) || esOcupado(c)"
                :title="esOcupado(c) ? 'Fecha no disponible' : ''"
                @click="seleccionarDia(c)"
              >
                {{ c }}
              </button>
            </template>
          </div>

          <p class="leyenda">
            <span class="muestra muestra--ocupado"></span> Fecha no disponible
          </p>

          <p class="calendario__pie">
            <AppIcon name="calendario" :size="17" />
            {{ fechaLegible }}
          </p>
          <p v-if="errores.fecha" class="campo__error">{{ errores.fecha }}</p>
        </div>

        <!-- Formulario -->
        <form class="formulario revelar" novalidate @submit.prevent="enviar">
          <div class="formulario__par">
            <div class="campo" :class="{ 'campo--error': errores.tipoEvento }">
              <label for="tipoEvento">Tipo de evento</label>
              <select id="tipoEvento" v-model="form.tipoEvento">
                <option value="">Selecciona una opción</option>
                <option>Boda</option>
                <option>Quinceaños</option>
                <option>Evento corporativo</option>
                <option>Cumpleaños</option>
                <option>Graduación</option>
                <option>Otro</option>
              </select>
              <span v-if="errores.tipoEvento" class="campo__error">{{ errores.tipoEvento }}</span>
            </div>

            <div class="campo" :class="{ 'campo--error': errores.invitados }">
              <label for="invitados">Invitados aproximados</label>
              <input id="invitados" v-model="form.invitados" type="number" min="1" max="1000" />
              <span v-if="errores.invitados" class="campo__error">{{ errores.invitados }}</span>
            </div>
          </div>

          <div class="campo" :class="{ 'campo--error': errores.nombre }">
            <label for="nombre">Nombre completo</label>
            <input id="nombre" v-model="form.nombre" type="text" autocomplete="name" />
            <span v-if="errores.nombre" class="campo__error">{{ errores.nombre }}</span>
          </div>

          <div class="formulario__par">
            <div class="campo" :class="{ 'campo--error': errores.email }">
              <label for="email">Correo electrónico</label>
              <input id="email" v-model="form.email" type="email" autocomplete="email" />
              <span v-if="errores.email" class="campo__error">{{ errores.email }}</span>
            </div>

            <div class="campo" :class="{ 'campo--error': errores.telefono }">
              <label for="telefono">Teléfono</label>
              <input id="telefono" v-model="form.telefono" type="tel" autocomplete="tel" />
              <span v-if="errores.telefono" class="campo__error">{{ errores.telefono }}</span>
            </div>
          </div>

          <div class="campo">
            <label for="comentarios">Comentarios</label>
            <textarea
              id="comentarios"
              v-model="form.comentarios"
              placeholder="Horario previsto, servicios que necesitas, dudas sobre el lugar."
            ></textarea>
          </div>

          <input
            v-model="form.sitioWeb"
            type="text"
            name="sitioWeb"
            class="trampa"
            tabindex="-1"
            autocomplete="off"
            aria-hidden="true"
          />

          <button class="btn btn--principal formulario__enviar" :disabled="estado === 'enviando'">
            {{ estado === 'enviando' ? 'Enviando solicitud' : 'Enviar solicitud' }}
          </button>

          <p v-if="estado === 'error'" class="resultado__error">
            <AppIcon name="aviso" :size="18" />
            {{ mensajeServidor }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reserva {
  display: grid;
  gap: 34px;
  margin-top: 44px;
  align-items: start;
}

.calendario {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 22px;
  box-shadow: var(--sombra);
}

.calendario__barra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.calendario__barra button {
  background: none;
  border: 1px solid rgba(49, 91, 44, 0.18);
  border-radius: var(--radio);
  color: var(--verde-bosque);
  cursor: pointer;
  padding: 7px 10px;
  display: grid;
  place-items: center;
  transition: background-color 0.25s var(--ease), color 0.25s var(--ease);
}
.calendario__barra button:hover {
  background: var(--verde-bosque);
  color: var(--marfil);
}

.girar {
  transform: rotate(180deg);
}

.calendario__mes {
  font-family: var(--serif);
  font-size: 1.2rem;
  color: var(--verde-bosque);
  margin: 0;
}

.calendario__semana,
.calendario__dias {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendario__semana span {
  text-align: center;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--verde-oliva);
  padding-bottom: 8px;
}

.dia {
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  background: none;
  border: 1px solid transparent;
  border-radius: var(--radio);
  font-family: var(--sans);
  font-size: 0.9rem;
  color: var(--carbon);
  cursor: pointer;
  transition: background-color 0.2s var(--ease), color 0.2s var(--ease);
}
.dia:hover:not(:disabled) {
  background: var(--verde-claro);
}
.dia--activo {
  background: var(--verde-bosque);
  color: var(--marfil);
}
.dia--activo:hover {
  background: var(--verde-bosque);
}
.dia--pasado {
  color: #b9b9b9;
  cursor: not-allowed;
}
.dia--ocupado {
  background: var(--beige);
  color: #9a8768;
  cursor: not-allowed;
  text-decoration: line-through;
}
.dia--vacio {
  cursor: default;
}

.leyenda {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  font-size: 0.8rem;
  color: #6a6a6a;
}

.muestra {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  display: inline-block;
}
.muestra--ocupado {
  background: var(--beige);
}

.calendario__pie {
  display: flex;
  align-items: center;
  gap: 9px;
  margin: 14px 0 0;
  padding-top: 16px;
  border-top: var(--borde);
  font-size: 0.9rem;
  color: var(--verde-bosque);
  font-weight: 500;
}

.formulario {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 30px 28px;
  box-shadow: var(--sombra);
}

.formulario__par {
  display: grid;
  gap: 0 18px;
}

.formulario__enviar {
  width: 100%;
  margin-top: 8px;
}

.trampa {
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
}

.resultado {
  text-align: center;
  max-width: 560px;
  margin: 50px auto 0;
  padding: 46px 32px;
  background: var(--marfil);
  border: 1px solid var(--dorado);
  border-radius: var(--radio);
}

.resultado--ok svg {
  color: var(--verde-bosque);
  margin: 0 auto 14px;
}

.resultado p {
  margin-inline: auto;
}

.resultado__error {
  display: flex;
  gap: 9px;
  align-items: center;
  margin: 16px 0 0;
  font-size: 0.9rem;
  color: #a83232;
}

@media (min-width: 620px) {
  .formulario__par {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 980px) {
  .reserva {
    grid-template-columns: 0.85fr 1.15fr;
    gap: 30px;
  }
}
</style>
