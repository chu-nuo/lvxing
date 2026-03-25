import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 用户类型
export type User = {
  id: string;
  email: string;
  created_at: string;
};

// 收藏行程类型
export type FavoriteTrip = {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  content: any;
  created_at: string;
};

// 登录/注册
export async function signUpWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 收藏行程相关操作
export async function getFavorites() {
  const { data, error } = await supabase
    .from('favorites')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function addFavorite(trip: Omit<FavoriteTrip, 'id' | 'user_id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('favorites')
    .insert([trip])
    .select()
    .single();
  return { data, error };
}

export async function removeFavorite(id: string) {
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', id);
  return { error };
}