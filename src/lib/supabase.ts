import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Validate that the URL is not a placeholder
if (supabaseUrl === 'your_supabase_project_url' || supabaseUrl.includes('your_supabase')) {
  throw new Error('Please replace the placeholder Supabase URL in your .env file with your actual Supabase project URL.');
}

// Validate that the anon key is not a placeholder
if (supabaseAnonKey === 'your_supabase_anon_key' || supabaseAnonKey.includes('your_supabase')) {
  throw new Error('Please replace the placeholder Supabase anon key in your .env file with your actual Supabase anon key.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);