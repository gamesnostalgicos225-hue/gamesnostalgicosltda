import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://udkiroesyeqnlxhayzit.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVka2lyb2VzeWVxbmx4aGF5eml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjA2NDIsImV4cCI6MjA5MjEzNjY0Mn0.Fidqh0HReohcyTYJXQVAQqJpMximelLL9B16H-s5J5s';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
