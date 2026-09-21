import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let cliente: SupabaseClient | null = null

/**
 * Cliente con la clave pública (anon). Respeta las reglas de RLS,
 * así que solo devuelve datos si hay una sesión iniciada.
 */
export function useSupabase() {
  const config = useRuntimeConfig()

  if (!cliente) {
    cliente = createClient(
      config.public.supabaseUrl as string,
      config.public.supabaseAnonKey as string
    )
  }

  return cliente
}
