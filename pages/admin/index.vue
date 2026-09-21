<script setup lang="ts">
useHead({ title: 'Panel de reservaciones | Terra Verde' })

interface Reservacion {
  id: number
  fecha_evento: string
  tipo_evento: string
  invitados: number
  nombre: string
  email: string
  telefono: string
  comentarios: string | null
  estado: string
  correo_enviado: boolean
  notas_internas: string | null
  creada_en: string
}

interface FechaBloqueada {
  id: number
  fecha: string
  motivo: string | null
}

const ESTADOS = ['pendiente', 'cotizada', 'confirmada', 'cancelada']
const MESES = [
  'ene', 'feb', 'mar', 'abr', 'may', 'jun',
  'jul', 'ago', 'sep', 'oct', 'nov', 'dic'
]

const supabase = useSupabase()

const reservaciones = ref<Reservacion[]>([])
const bloqueadas = ref<FechaBloqueada[]>([])
const cargando = ref(true)
const filtro = ref('todas')
const busqueda = ref('')
const detalle = ref<Reservacion | null>(null)
const nota = ref('')
const guardandoNota = ref(false)

// Alta de fecha bloqueada
const nuevaFecha = ref('')
const nuevoMotivo = ref('')

function formatear(iso: string) {
  const [a, m, d] = iso.split('-').map(Number)
  return `${d} ${MESES[m - 1]} ${a}`
}

function formatearHora(iso: string) {
  const f = new Date(iso)
  return `${f.getDate()} ${MESES[f.getMonth()]} ${f.getFullYear()}, ${String(
    f.getHours()
  ).padStart(2, '0')}:${String(f.getMinutes()).padStart(2, '0')}`
}

function soloDigitos(tel: string) {
  const n = tel.replace(/\D/g, '')
  return n.startsWith('502') ? n : `502${n}`
}

const visibles = computed(() => {
  let lista = reservaciones.value

  if (filtro.value !== 'todas') {
    lista = lista.filter((r) => r.estado === filtro.value)
  }

  const q = busqueda.value.trim().toLowerCase()
  if (q) {
    lista = lista.filter(
      (r) =>
        r.nombre.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.telefono.includes(q) ||
        r.tipo_evento.toLowerCase().includes(q)
    )
  }

  return lista
})

const conteo = computed(() => {
  const hoy = new Date().toISOString().slice(0, 10)
  return {
    pendiente: reservaciones.value.filter((r) => r.estado === 'pendiente').length,
    confirmada: reservaciones.value.filter((r) => r.estado === 'confirmada').length,
    proximos: reservaciones.value.filter(
      (r) => r.estado === 'confirmada' && r.fecha_evento >= hoy
    ).length,
    total: reservaciones.value.length
  }
})

async function cargar() {
  cargando.value = true

  const [res, fec] = await Promise.all([
    supabase.from('reservaciones').select('*').order('fecha_evento', { ascending: true }),
    supabase.from('fechas_bloqueadas').select('*').order('fecha', { ascending: true })
  ])

  if (res.error) console.error(res.error)
  else reservaciones.value = res.data as Reservacion[]

  if (fec.error) console.error(fec.error)
  else bloqueadas.value = fec.data as FechaBloqueada[]

  cargando.value = false
}

async function cambiarEstado(r: Reservacion, nuevo: string) {
  const anterior = r.estado
  r.estado = nuevo

  const { error } = await supabase.from('reservaciones').update({ estado: nuevo }).eq('id', r.id)

  if (error) {
    r.estado = anterior
    alert('No se pudo guardar el cambio.')
  }
}

function abrirDetalle(r: Reservacion) {
  detalle.value = r
  nota.value = r.notas_internas ?? ''
}

async function guardarNota() {
  if (!detalle.value) return
  guardandoNota.value = true

  const { error } = await supabase
    .from('reservaciones')
    .update({ notas_internas: nota.value })
    .eq('id', detalle.value.id)

  guardandoNota.value = false

  if (error) {
    alert('No se pudo guardar la nota.')
    return
  }

  detalle.value.notas_internas = nota.value
  detalle.value = null
}

async function bloquearFecha() {
  if (!nuevaFecha.value) return

  const { error } = await supabase
    .from('fechas_bloqueadas')
    .insert({ fecha: nuevaFecha.value, motivo: nuevoMotivo.value || null })

  if (error) {
    alert('Esa fecha ya está bloqueada o hubo un error.')
    return
  }

  nuevaFecha.value = ''
  nuevoMotivo.value = ''
  await cargar()
}

async function liberarFecha(id: number) {
  const { error } = await supabase.from('fechas_bloqueadas').delete().eq('id', id)
  if (error) {
    alert('No se pudo liberar la fecha.')
    return
  }
  bloqueadas.value = bloqueadas.value.filter((f) => f.id !== id)
}

function exportarCsv() {
  const encabezado = [
    'id', 'fecha_evento', 'tipo_evento', 'invitados', 'nombre',
    'email', 'telefono', 'estado', 'comentarios', 'creada_en'
  ]

  const filas = visibles.value.map((r) =>
    [
      r.id, r.fecha_evento, r.tipo_evento, r.invitados, r.nombre,
      r.email, r.telefono, r.estado, (r.comentarios ?? '').replace(/\n/g, ' '), r.creada_en
    ]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(',')
  )

  const csv = [encabezado.join(','), ...filas].join('\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = `reservaciones-terra-verde.csv`
  a.click()
  URL.revokeObjectURL(url)
}

async function salir() {
  await supabase.auth.signOut()
  navigateTo('/admin/login')
}

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  if (!data.session) {
    navigateTo('/admin/login')
    return
  }
  await cargar()
})
</script>

<template>
  <div class="panel">
    <header class="panel__cabecera">
      <div>
        <p class="panel__marca">Terra Verde</p>
        <p class="panel__sub">Panel de reservaciones</p>
      </div>
      <div class="panel__acciones">
        <button class="boton boton--claro" @click="cargar">Actualizar</button>
        <button class="boton boton--claro" @click="salir">Cerrar sesión</button>
      </div>
    </header>

    <main class="panel__cuerpo">
      <!-- Resumen -->
      <section class="resumen">
        <div class="resumen__dato">
          <p class="resumen__numero">{{ conteo.pendiente }}</p>
          <p class="resumen__texto">Pendientes de responder</p>
        </div>
        <div class="resumen__dato">
          <p class="resumen__numero">{{ conteo.proximos }}</p>
          <p class="resumen__texto">Eventos confirmados próximos</p>
        </div>
        <div class="resumen__dato">
          <p class="resumen__numero">{{ conteo.confirmada }}</p>
          <p class="resumen__texto">Confirmados en total</p>
        </div>
        <div class="resumen__dato">
          <p class="resumen__numero">{{ conteo.total }}</p>
          <p class="resumen__texto">Solicitudes recibidas</p>
        </div>
      </section>

      <!-- Controles -->
      <section class="controles">
        <div class="filtros">
          <button
            class="filtro"
            :class="{ 'filtro--activo': filtro === 'todas' }"
            @click="filtro = 'todas'"
          >
            Todas
          </button>
          <button
            v-for="e in ESTADOS"
            :key="e"
            class="filtro"
            :class="{ 'filtro--activo': filtro === e }"
            @click="filtro = e"
          >
            {{ e }}
          </button>
        </div>

        <div class="controles__derecha">
          <input v-model="busqueda" type="search" placeholder="Buscar por nombre o correo" />
          <button class="boton boton--verde" @click="exportarCsv">Descargar CSV</button>
        </div>
      </section>

      <!-- Tabla -->
      <p v-if="cargando" class="aviso">Cargando reservaciones...</p>

      <p v-else-if="!visibles.length" class="aviso">
        No hay reservaciones en esta vista. Cuando llegue una solicitud del sitio, aparecerá aquí.
      </p>

      <div v-else class="tabla-caja">
        <table class="tabla">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha del evento</th>
              <th>Tipo</th>
              <th class="centrado">Invitados</th>
              <th>Cliente</th>
              <th>Contacto</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in visibles" :key="r.id" :class="`fila--${r.estado}`">
              <td class="tenue">{{ r.id }}</td>
              <td class="negrita">{{ formatear(r.fecha_evento) }}</td>
              <td>{{ r.tipo_evento }}</td>
              <td class="centrado">{{ r.invitados }}</td>
              <td>
                {{ r.nombre }}
                <span v-if="!r.correo_enviado" class="alerta" title="El correo no salió">
                  correo pendiente
                </span>
              </td>
              <td class="contacto">
                <a :href="`mailto:${r.email}`">{{ r.email }}</a>
                <a :href="`https://wa.me/${soloDigitos(r.telefono)}`" target="_blank">
                  {{ r.telefono }}
                </a>
              </td>
              <td>
                <select
                  class="estado"
                  :class="`estado--${r.estado}`"
                  :value="r.estado"
                  @change="cambiarEstado(r, ($event.target as HTMLSelectElement).value)"
                >
                  <option v-for="e in ESTADOS" :key="e" :value="e">{{ e }}</option>
                </select>
              </td>
              <td>
                <button class="boton boton--mini" @click="abrirDetalle(r)">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Fechas bloqueadas -->
      <section class="bloqueo">
        <h2>Fechas bloqueadas</h2>
        <p class="bloqueo__nota">
          Los días que agregues aquí aparecen como no disponibles en el calendario del
          sitio, igual que los eventos confirmados.
        </p>

        <div class="bloqueo__alta">
          <input v-model="nuevaFecha" type="date" />
          <input v-model="nuevoMotivo" type="text" placeholder="Motivo (opcional)" />
          <button class="boton boton--verde" @click="bloquearFecha">Bloquear</button>
        </div>

        <p v-if="!bloqueadas.length" class="bloqueo__vacio">No hay fechas bloqueadas.</p>

        <ul v-else class="bloqueo__lista">
          <li v-for="f in bloqueadas" :key="f.id">
            <span class="negrita">{{ formatear(f.fecha) }}</span>
            <span class="tenue">{{ f.motivo || 'Sin motivo indicado' }}</span>
            <button class="boton boton--mini" @click="liberarFecha(f.id)">Liberar</button>
          </li>
        </ul>
      </section>
    </main>

    <!-- Detalle -->
    <Transition name="modal">
      <div v-if="detalle" class="modal" @click.self="detalle = null">
        <div class="modal__caja">
          <div class="modal__cabecera">
            <div>
              <p class="modal__fecha">{{ formatear(detalle.fecha_evento) }}</p>
              <p class="modal__tipo">
                {{ detalle.tipo_evento }} · {{ detalle.invitados }} invitados
              </p>
            </div>
            <button class="modal__cerrar" aria-label="Cerrar" @click="detalle = null">
              <AppIcon name="cerrar" :size="24" />
            </button>
          </div>

          <dl class="modal__datos">
            <div>
              <dt>Cliente</dt>
              <dd>{{ detalle.nombre }}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd><a :href="`mailto:${detalle.email}`">{{ detalle.email }}</a></dd>
            </div>
            <div>
              <dt>Teléfono</dt>
              <dd>
                <a :href="`https://wa.me/${soloDigitos(detalle.telefono)}`" target="_blank">
                  {{ detalle.telefono }}
                </a>
              </dd>
            </div>
            <div>
              <dt>Solicitud recibida</dt>
              <dd>{{ formatearHora(detalle.creada_en) }}</dd>
            </div>
          </dl>

          <div v-if="detalle.comentarios" class="modal__comentario">
            <p class="modal__etiqueta">Comentarios del cliente</p>
            <p>{{ detalle.comentarios }}</p>
          </div>

          <div class="campo">
            <label for="nota">Notas internas</label>
            <textarea
              id="nota"
              v-model="nota"
              rows="4"
              placeholder="Precio cotizado, acuerdos, anticipo recibido."
            ></textarea>
          </div>

          <button class="boton boton--verde ancho" :disabled="guardandoNota" @click="guardarNota">
            {{ guardandoNota ? 'Guardando' : 'Guardar nota' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.panel {
  min-height: 100vh;
  background: var(--verde-claro);
}

/* ------------------------------------------------------------ cabecera */

.panel__cabecera {
  background: var(--verde-bosque);
  color: var(--marfil);
  padding: 18px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
}

.panel__marca {
  font-family: var(--script);
  font-size: 1.9rem;
  margin: 0;
  line-height: 1.1;
}

.panel__sub {
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--beige);
  margin: 0;
}

.panel__acciones {
  display: flex;
  gap: 10px;
}

.panel__cuerpo {
  max-width: 1240px;
  margin: 0 auto;
  padding: 30px 24px 70px;
}

/* ------------------------------------------------------------ botones */

.boton {
  font-family: var(--sans);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 9px 18px;
  border: 1px solid transparent;
  border-radius: var(--radio);
  cursor: pointer;
  transition: background-color 0.25s var(--ease), color 0.25s var(--ease);
}

.boton--claro {
  background: transparent;
  border-color: var(--dorado);
  color: var(--marfil);
}
.boton--claro:hover {
  background: var(--dorado);
  color: var(--carbon);
}

.boton--verde {
  background: var(--verde-bosque);
  color: var(--marfil);
}
.boton--verde:hover {
  background: var(--dorado-oscuro);
}

.boton--mini {
  background: transparent;
  border-color: rgba(49, 91, 44, 0.3);
  color: var(--verde-bosque);
  padding: 6px 13px;
  font-size: 0.8rem;
}
.boton--mini:hover {
  background: var(--verde-bosque);
  color: var(--marfil);
}

.ancho {
  width: 100%;
}

/* ------------------------------------------------------------ resumen */

.resumen {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-bottom: 28px;
}

.resumen__dato {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 20px 22px;
}

.resumen__numero {
  font-family: var(--serif);
  font-size: 2.3rem;
  color: var(--verde-bosque);
  margin: 0;
  line-height: 1;
}

.resumen__texto {
  margin: 6px 0 0;
  font-size: 0.83rem;
  color: #5a5a5a;
}

/* ------------------------------------------------------------ controles */

.controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 20px;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filtro {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 8px 16px;
  font-family: var(--sans);
  font-size: 0.83rem;
  color: var(--verde-bosque);
  cursor: pointer;
  text-transform: capitalize;
  transition: background-color 0.25s var(--ease), color 0.25s var(--ease);
}

.filtro--activo {
  background: var(--verde-bosque);
  color: var(--marfil);
}

.controles__derecha {
  display: flex;
  gap: 10px;
  align-items: center;
}

.controles__derecha input {
  font-family: var(--sans);
  font-size: 0.88rem;
  padding: 9px 14px;
  min-width: 240px;
  border: var(--borde);
  border-radius: var(--radio);
  background: var(--marfil);
}

/* ------------------------------------------------------------ tabla */

.tabla-caja {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  overflow-x: auto;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.88rem;
  min-width: 940px;
}

.tabla th {
  text-align: left;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--verde-oliva);
  padding: 14px 16px;
  border-bottom: 1px solid rgba(49, 91, 44, 0.18);
  white-space: nowrap;
}

.tabla td {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(49, 91, 44, 0.09);
  vertical-align: middle;
}

.tabla tbody tr:last-child td {
  border-bottom: 0;
}

.tabla tbody tr:hover {
  background: rgba(232, 238, 219, 0.5);
}

.fila--cancelada {
  opacity: 0.55;
}

.negrita {
  font-weight: 600;
  color: var(--verde-bosque);
  white-space: nowrap;
}

.tenue {
  color: #8a8a8a;
  font-size: 0.82rem;
}

.centrado {
  text-align: center;
}

.contacto {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 0.82rem;
}

.alerta {
  display: block;
  font-size: 0.72rem;
  color: #a83232;
  font-weight: 600;
}

.estado {
  font-family: var(--sans);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: var(--radio);
  border: 1px solid;
  text-transform: capitalize;
  cursor: pointer;
  background: var(--marfil);
}

.estado--pendiente {
  border-color: var(--dorado);
  color: var(--dorado-oscuro);
}
.estado--cotizada {
  border-color: var(--verde-oliva);
  color: var(--verde-oliva);
}
.estado--confirmada {
  border-color: var(--verde-bosque);
  background: var(--verde-bosque);
  color: var(--marfil);
}
.estado--cancelada {
  border-color: #b96a6a;
  color: #a83232;
}

.aviso {
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 44px 28px;
  text-align: center;
  color: #5a5a5a;
  margin: 0;
}

/* ------------------------------------------------------------ bloqueo */

.bloqueo {
  margin-top: 40px;
  background: var(--marfil);
  border: var(--borde);
  border-radius: var(--radio);
  padding: 26px 28px;
}

.bloqueo h2 {
  font-size: 1.4rem;
  margin-bottom: 6px;
}

.bloqueo__nota {
  font-size: 0.87rem;
  color: #5a5a5a;
  margin-bottom: 20px;
}

.bloqueo__alta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 22px;
}

.bloqueo__alta input {
  font-family: var(--sans);
  font-size: 0.88rem;
  padding: 9px 14px;
  border: var(--borde);
  border-radius: var(--radio);
  background: var(--marfil);
}

.bloqueo__alta input[type='text'] {
  flex: 1;
  min-width: 200px;
}

.bloqueo__vacio {
  font-size: 0.87rem;
  color: #8a8a8a;
  margin: 0;
}

.bloqueo__lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
}

.bloqueo__lista li {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 16px;
  background: var(--verde-claro);
  border-radius: var(--radio);
  font-size: 0.88rem;
}

.bloqueo__lista li .tenue {
  flex: 1;
}

/* ------------------------------------------------------------ modal */

.modal {
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(20, 30, 18, 0.55);
  display: grid;
  place-items: center;
  padding: 24px;
  overflow-y: auto;
}

.modal__caja {
  background: var(--marfil);
  border-radius: var(--radio);
  padding: 30px 32px;
  width: 100%;
  max-width: 560px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}

.modal__cabecera {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding-bottom: 18px;
  border-bottom: var(--borde);
}

.modal__fecha {
  font-family: var(--serif);
  font-size: 1.5rem;
  color: var(--verde-bosque);
  margin: 0;
}

.modal__tipo {
  margin: 3px 0 0;
  font-size: 0.88rem;
  color: var(--verde-oliva);
}

.modal__cerrar {
  background: none;
  border: 0;
  color: var(--verde-bosque);
  cursor: pointer;
  padding: 2px;
}

.modal__datos {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
}

.modal__datos dt {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--verde-oliva);
}

.modal__datos dd {
  margin: 3px 0 0;
  font-size: 0.93rem;
}

.modal__comentario {
  background: var(--verde-claro);
  border-radius: var(--radio);
  padding: 15px 17px;
  margin-bottom: 20px;
}

.modal__comentario p:last-child {
  margin: 0;
  font-size: 0.9rem;
}

.modal__etiqueta {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--verde-oliva);
  margin: 0 0 6px;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s var(--ease);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 620px) {
  .modal__datos {
    grid-template-columns: 1fr;
  }
  .controles__derecha {
    width: 100%;
  }
  .controles__derecha input {
    flex: 1;
    min-width: 0;
  }
}
</style>
