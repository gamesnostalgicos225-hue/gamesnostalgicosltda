import { supabase } from './supabase';

// Sincronização genérica (legado, mas mantendo por compatibilidade temporária)
export const syncToCloud = async (key: string, data: any) => {
  try {
    await supabase.from('app_state').upsert({ key, value: data });
  } catch (err) {
    console.error('Falha ao sincronizar com nuvem:', err);
  }
};

export const loadFromCloud = async (key: string) => {
  try {
    const { data } = await supabase.from('app_state').select('value').eq('key', key).single();
    if (data) {
      return data.value;
    }
    return null;
  } catch (err) {
    console.error('Falha ao ler nuvem:', err);
    return null;
  }
};

// --- NOVAS FUNÇÕES PARA TABELAS ESPECÍFICAS (Sincronização Real) ---

export const getGames = async () => {
  const { data, error } = await supabase.from('games').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const getConsoles = async () => {
  const { data, error } = await supabase.from('consoles').select('*').order('name');
  if (error) throw error;
  return data;
};

export const getPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select(`
      *,
      items:pedido_items(*),
      messages:pedido_messages(*)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((d: any) => ({
    ...d,
    orderNumber: d.order_number,
    clientEmail: d.client_email,
    clientInfo: d.client_info,
    hasUnreadCliente: d.has_unread_cliente,
    hasUnreadAdmin: d.has_unread_admin
  }));
};

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*').order('id');
  if (error) throw error;
  return data;
};

export const getSolicitacoes = async () => {
  const { data, error } = await supabase.from('solicitacoes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};
