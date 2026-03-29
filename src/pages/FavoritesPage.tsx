import { useState, useEffect } from 'react';
import { Heart, Trash2, MapPin, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { getFavorites, removeFavorite, type FavoriteTrip } from '@/lib/supabase';
import { toast } from 'sonner';

interface FavoritesPageProps {
  onPageChange: (page: string) => void;
}

export function FavoritesPage({ onPageChange }: FavoritesPageProps) {
  const { user, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // 加载收藏列表
  const loadFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await getFavorites();
    if (error) {
      toast.error('加载收藏失败：' + error.message);
    } else {
      setFavorites(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) {
      loadFavorites();
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  // 删除收藏
  const handleRemove = async (id: string) => {
    setDeletingId(id);
    const { error } = await removeFavorite(id);
    setDeletingId(null);
    if (error) {
      toast.error('删除失败：' + error.message);
    } else {
      toast.success('已删除');
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    }
  };

  // 未登录状态
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center py-20">
          <div className="w-20 h-20 rounded-full bg-[hsl(160,40%,85%)] flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-[hsl(160,45%,28%)]" />
          </div>
          <h1 className="text-3xl font-bold text-[hsl(160,25%,15%)] mb-3">我的收藏</h1>
          <p className="text-[hsl(160,15%,45%)] mb-8">
            登录后查看你收藏的行程规划
          </p>
          <Button
            onClick={() => onPageChange('home')}
            className="btn-primary"
          >
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,45%)] flex items-center justify-center shadow-lg">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[hsl(160,25%,15%)]">我的收藏</h1>
            <p className="text-[hsl(160,15%,45%)]">
              {favorites.length > 0 ? `共 ${favorites.length} 条收藏行程` : '暂无收藏'}
            </p>
          </div>
        </div>

        {/* 加载中 */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[hsl(160,45%,28%)]" />
          </div>
        )}

        {/* 空状态 */}
        {!loading && favorites.length === 0 && (
          <div className="text-center py-20 rounded-2xl bg-white shadow-soft">
            <div className="w-16 h-16 rounded-full bg-[hsl(160,40%,85%)] flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-[hsl(160,45%,28%)]" />
            </div>
            <h2 className="text-xl font-semibold text-[hsl(160,25%,15%)] mb-2">还没有收藏</h2>
            <p className="text-[hsl(160,15%,45%)] mb-6">
              去 AI 推荐或行程规划中探索有趣的目的地吧
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => onPageChange('recommend')}
                className="btn-secondary"
              >
                AI 推荐
              </Button>
              <Button
                onClick={() => onPageChange('planner')}
                className="btn-primary"
              >
                行程规划
              </Button>
            </div>
          </div>
        )}

        {/* 收藏列表 */}
        {!loading && favorites.length > 0 && (
          <div className="space-y-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl bg-white shadow-soft p-6 hover:shadow-float transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* 目的地标签 */}
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-[hsl(160,45%,28%)]" />
                      <span className="text-sm font-medium text-[hsl(160,45%,28%)]">
                        {item.destination}
                      </span>
                    </div>
                    {/* 标题 */}
                    <h3 className="text-xl font-semibold text-[hsl(160,25%,15%)] mb-2">
                      {item.title}
                    </h3>
                    {/* 时间 */}
                    <div className="flex items-center gap-1 text-sm text-[hsl(160,15%,45%)]">
                      <Calendar className="w-4 h-4" />
                      <span>收藏于 {new Date(item.created_at).toLocaleDateString('zh-CN')}</span>
                    </div>
                    {/* 行程摘要 */}
                    {item.content && (
                      <div className="mt-3 p-3 rounded-xl bg-[hsl(150,20%,96%)] text-sm text-[hsl(160,15%,45%)]">
                        {typeof item.content === 'string'
                          ? item.content.slice(0, 100) + (item.content.length > 100 ? '...' : '')
                          : JSON.stringify(item.content).slice(0, 100) + '...'}
                      </div>
                    )}
                  </div>
                  {/* 操作按钮 */}
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      onClick={() => onPageChange('planner')}
                      className="btn-primary"
                    >
                      查看详情
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemove(item.id)}
                      disabled={deletingId === item.id}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 配置警告 */}
        {!loading && user && favorites.length === 0 && (
          <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-700">
              <strong>提示：</strong>如果收藏列表为空，可能是 Supabase 数据库表未创建或 RLS 策略未配置。
              请参考 <code className="bg-amber-100 px-1 rounded">对接文档_登录收藏AI接入.md</code> 中的说明。
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
