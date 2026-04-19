import { supabase } from './supabase';

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
