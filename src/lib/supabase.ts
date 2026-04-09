import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  (import.meta as any).env.VITE_SUPABASE_URL;

const supabaseAnonKey = 
  (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey
);

export const setSupabaseAdminKey = (
  hash: string | null
) => {
  const headers = 
    (supabase as any).rest.headers;
  
  if (hash) {
    if (typeof headers.set === 'function') {
      headers.set(
        'x-admin-code', 
        hash
      );
    } else {
      headers['x-admin-code'] = hash;
    }
  } else {
    if (typeof headers.delete === 'function') {
      headers.delete('x-admin-code');
    } else {
      delete headers['x-admin-code'];
    }
  }
};
