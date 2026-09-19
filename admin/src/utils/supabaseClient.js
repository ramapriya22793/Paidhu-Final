import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

let supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
let supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.includes('xittsoabiuzuzrzdjktb')) {
  supabaseUrl = DEFAULT_SUPABASE_URL;
  supabaseAnonKey = DEFAULT_SUPABASE_ANON_KEY;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
