/* =========================================
   RESONANCE — Supabase Configuration
   Replace the two values below with your
   project URL and anon key from:
   Supabase Dashboard > Settings > API
   ========================================= */

const SUPABASE_URL  = 'YOUR_SUPABASE_URL';   // e.g. https://abcdefgh.supabase.co
const SUPABASE_ANON = 'YOUR_SUPABASE_ANON_KEY';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
