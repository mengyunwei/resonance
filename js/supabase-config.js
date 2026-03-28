/* =========================================
   RESONANCE — Supabase Configuration
   Replace the two values below with your
   project URL and anon key from:
   Supabase Dashboard > Settings > API
   ========================================= */

const SUPABASE_URL  = 'https://oflaknarszsvlpceprrm.supabase.co';
const SUPABASE_ANON = 'sb_publishable_RmZCZqzeZfJO1XbfN8o2Lw_-aoE6nWl';

const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON);
