/**
 * Devuelve solo las fechas ocupadas, sin ningún dato personal.
 * El calendario del sitio las usa para deshabilitar esos días.
 */
export default defineEventHandler(async () => {
  const db = supabaseServidor()

  const hoy = new Date().toISOString().slice(0, 10)

  const { data, error } = await db
    .from('fechas_ocupadas')
    .select('fecha')
    .gte('fecha', hoy)

  if (error) {
    console.error('[fechas-ocupadas] error:', error)
    return { fechas: [] }
  }

  return { fechas: (data ?? []).map((f: { fecha: string }) => f.fecha) }
})
