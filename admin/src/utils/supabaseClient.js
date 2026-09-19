import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

