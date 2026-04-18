import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl = 'https://caqjnfyqbvjqnuktgsnr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhcWpuZnlxYnZqcW51a3Rnc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4ODU0OTUsImV4cCI6MjA5MTQ2MTQ5NX0.i2SBHkzSTRO6c-MQZrXe9vhpCob2dm24RsrHkvYNGUg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})