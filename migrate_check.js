import { createClient } from '@supabase/supabase-js';

const oldUrl = 'https://udkiroesyeqnlxhayzit.supabase.co';
const oldKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVka2lyb2VzeWVxbmx4aGF5eml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjA2NDIsImV4cCI6MjA5MjEzNjY0Mn0.Fidqh0HReohcyTYJXQVAQqJpMximelLL9B16H-s5J5s';
const oldSupabase = createClient(oldUrl, oldKey);

const newUrl = 'https://edemqizthxbzixkfamvt.supabase.co';
const newKey = 'sb_publishable_nd7Q7Qs3JtOrz7xfTif37A_alrkDkwZ';
const newSupabase = createClient(newUrl, newKey);

async function check() {
  console.log('Checking old DB...');
  const { data: oldData, error: oldError } = await oldSupabase.from('app_state').select('*');
  console.log('Old app_state count:', oldData?.length, 'Error:', oldError?.message);

  console.log('Checking new DB...');
  const { data: newData, error: newError } = await newSupabase.from('app_state').select('*');
  console.log('New app_state count:', newData?.length, 'Error:', newError?.message);
}

check();
