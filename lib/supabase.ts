import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pkaijflgerfyspupyoex.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrYWlqZmxnZXJmeXNwdXB5b2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MTQwOTgsImV4cCI6MjA2OTQ5MDA5OH0.WuxgIsfJ4Fffkv7NaMRV4do7G_uy7S5m46632ploB58'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
}) 