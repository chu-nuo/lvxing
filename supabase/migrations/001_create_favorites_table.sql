-- 创建 favorites 表（用户收藏行程）
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 创建索引以提升查询性能
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 启用行级安全策略 (RLS)
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 允许认证用户查看自己的收藏
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT
  USING (auth.uid() = user_id);

-- 允许认证用户插入自己的收藏
CREATE POLICY "Users can insert their own favorites" ON favorites
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 允许认证用户删除自己的收藏
CREATE POLICY "Users can delete their own favorites" ON favorites
  FOR DELETE
  USING (auth.uid() = user_id);

-- 授权
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE favorites TO authenticated;
GRANT SELECT ON TABLE favorites TO anon;
