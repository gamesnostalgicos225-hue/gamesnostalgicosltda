import { createClient } from '@supabase/supabase-js';

const oldUrl = 'https://udkiroesyeqnlxhayzit.supabase.co';
const oldKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVka2lyb2VzeWVxbmx4aGF5eml0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1NjA2NDIsImV4cCI6MjA5MjEzNjY0Mn0.Fidqh0HReohcyTYJXQVAQqJpMximelLL9B16H-s5J5s';
const oldSupabase = createClient(oldUrl, oldKey);

const newUrl = 'https://edemqizthxbzixkfamvt.supabase.co';
const newKey = 'sb_publishable_nd7Q7Qs3JtOrz7xfTif37A_alrkDkwZ';
const newSupabase = createClient(newUrl, newKey);

async function migrateTable(tableName) {
  console.log(`Migrando tabela: ${tableName}...`);
  const { data, error } = await oldSupabase.from(tableName).select('*');
  if (error) {
    console.error(`Erro ao ler tabela ${tableName}:`, error.message);
    return;
  }
  
  if (data && data.length > 0) {
    const { error: insertError } = await newSupabase.from(tableName).upsert(data);
    if (insertError) {
      console.error(`Erro ao inserir na tabela ${tableName}:`, insertError.message);
    } else {
      console.log(`✅ ${data.length} registros migrados para ${tableName}.`);
    }
  } else {
    console.log(`⚠️ Nenhum registro encontrado na tabela ${tableName}.`);
  }
}

async function startMigration() {
  console.log('Iniciando migração dos dados...');
  await migrateTable('app_state');
  await migrateTable('consoles');
  await migrateTable('games');
  await migrateTable('users');
  await migrateTable('pedidos');
  await migrateTable('pedido_items');
  await migrateTable('pedido_messages');
  await migrateTable('solicitacoes');
  console.log('Migração concluída!');
}

startMigration();
