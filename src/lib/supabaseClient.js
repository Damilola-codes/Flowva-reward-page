import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const hasSupabaseConfig = Boolean(
  supabaseUrl && supabaseAnonKey && /^https?:\/\//.test(supabaseUrl)
)

// In dev, avoid crashing if env is missing; warn instead. In prod, throw.
if (!hasSupabaseConfig && import.meta.env.MODE === 'production') {
  throw new Error(
    'Missing or invalid Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  )
}

if (!hasSupabaseConfig && import.meta.env.MODE !== 'production') {
  // eslint-disable-next-line no-console
  console.warn(
    '[Supabase] Env not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.'
  )
}

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null
