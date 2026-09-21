import { createClient } from '@supabase/supabase-js'


export function supabaseServidor() {
  const config = useRuntimeConfig()

  if (!config.supabaseUrl || !config.supabaseServiceKey) {
    throw createError({
      statusCode: 500,
      data: { ok: false, mensaje: 'La base de datos no está configurada.' }
    })
  }

  return createClient(config.supabaseUrl, config.supabaseServiceKey, {
    auth: { persistSession: false }
  })
}
