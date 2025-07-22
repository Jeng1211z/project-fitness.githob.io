import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ibtvipouiddtvsdsccfc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlidHZpcG91aWRkdHZzZHNjY2ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMTg2MjUsImV4cCI6MjA2ODY5NDYyNX0.vTAJAsP-UXPLpaHoiU5SW8OTdouqvLJ2RhM8l5yzi6g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
