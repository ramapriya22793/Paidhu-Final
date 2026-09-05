import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ljrwcciuacjbwocsxiqc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqcndjY2l1YWNqYndvY3N4aXFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1ODM3NTksImV4cCI6MjEwNDE1OTc1OX0.uPYZRyuqH-QDIQsGI8kB1M5U27fjV4ngPF2qZmZFLt0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

