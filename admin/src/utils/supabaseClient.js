import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fvtgukindzmoiwqqkwcl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2dGd1a2luZHptb2l3cXFrd2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5ODI5MDgsImV4cCI6MjEwMTU1ODkwOH0.4t6dRq9uPXLUU0JxgC1siN2jtuc3801NR5hikHtUR40';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

