import { useState, useEffect, useCallback } from 'react';
import { 
  getFavorites, 
  addFavorite, 
  removeFavorite, 
  type FavoriteTrip 
} from '@/lib/supabase';
import { useAuth } from './useAuth';

interface UseFavoritesReturn {
  favorites: FavoriteTrip[];
  loading: boolean;
  error: string | null;
  addToFavorites: (trip: Omit<FavoriteTrip, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>;
  removeFromFavorites: (id: string) => Promise<boolean>;
  refreshFavorites: () => Promise<void>;
  isFavorite: (destination: string) => boolean;
}

export function useFavorites(): UseFavoritesReturn {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteTrip[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 加载收藏列表
  const loadFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await getFavorites();
      
      if (fetchError) {
        throw new Error(fetchError.message);
      }

      setFavorites(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载收藏失败';
      setError(message);
      console.error('[useFavorites] 加载失败:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 初始加载
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // 添加到收藏
  const addToFavorites = useCallback(async (
    trip: Omit<FavoriteTrip, 'id' | 'user_id' | 'created_at'>
  ): Promise<boolean> => {
    if (!user) {
      setError('请先登录');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: addError } = await addFavorite(trip);

      if (addError) {
        throw new Error(addError.message);
      }

      if (data) {
        setFavorites(prev => [data, ...prev]);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '添加收藏失败';
      setError(message);
      console.error('[useFavorites] 添加失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // 从收藏中移除
  const removeFromFavorites = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: removeError } = await removeFavorite(id);

      if (removeError) {
        throw new Error(removeError.message);
      }

      setFavorites(prev => prev.filter(f => f.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : '删除收藏失败';
      setError(message);
      console.error('[useFavorites] 删除失败:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // 刷新收藏列表
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  // 检查某个目的地是否已收藏
  const isFavorite = useCallback((destination: string): boolean => {
    return favorites.some(f => 
      f.destination.toLowerCase() === destination.toLowerCase()
    );
  }, [favorites]);

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    refreshFavorites,
    isFavorite,
  };
}
