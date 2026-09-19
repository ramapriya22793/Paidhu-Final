const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const DEFAULT_SUPABASE_URL = 'https://xittsoabiuzuzrzdjktb.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_SuDUNZP6gbn0BuyMcTbrNA_k75HNFAj';

let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseUrl.includes('xittsoabiuzuzrzdjktb')) {
  supabaseUrl = DEFAULT_SUPABASE_URL;
  supabaseKey = DEFAULT_SUPABASE_ANON_KEY;
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

module.exports = supabase;
