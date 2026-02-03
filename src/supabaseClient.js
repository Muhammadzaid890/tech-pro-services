import { createClient } from '@supabase/supabase-js'

// Ye variables .env file se automatic data uthayenge
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Agar .env sahi setup nahi hogi to ye error throw karega
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Key is missing! Check your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)