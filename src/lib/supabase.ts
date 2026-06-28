import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://edemqizthxbzixkfamvt.supabase.co';
const supabaseAnonKey = 'sb_publishable_nd7Q7Qs3JtOrz7xfTif37A_alrkDkwZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
