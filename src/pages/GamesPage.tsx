import { Palette, Box, Dices, Camera, Puzzle, ArrowRight, Sparkles, Trophy } from 'lucide-react';

interface GamesPageProps {
  onPageChange: (page: string) => void;
}

const games = [
  {
    id: 'color-walk',
    title: '色彩漫步',
    description: '用颜色记录旅行，生成专属色彩相册',
    icon: Palette,
    color: 'from-rose-400 to-pink-500',
    bgColor: 'bg-rose-50',
    features: ['随机色彩挑战', '渐变色挑战', '互补色对决'],
  },
  {
    id: 'blind-box',
    title: '盲盒旅行',
    description: '未知目的地，开启惊喜冒险',
    icon: Box,
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50',
    features: ['主题选择', '线索解谜', '出发揭晓'],
  },
  {
    id: 'dice',
    title: '骰子旅行',
    description: '让骰子决定你的行程',
    icon: Dices,
    color: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50',
    features: ['六大维度', '随机任务', 'Vlog脚本'],
  },
  {
    id: 'photo-challenge',
    title: '摄影挑战',
    description: 'AI评分你的旅行摄影作品',
    icon: Camera,
    color: 'from-cyan-400 to-blue-500',
    bgColor: 'bg-cyan-50',
    features: ['景点任务', 'AI评分', '作品集'],
  },
  {
    id: 'puzzle',
    title: '足迹拼图',
    description: '解锁中国地图，收集区域徽章',
    icon: Puzzle,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50',
    features: ['区域解锁', '好友排行', '终极徽章'],
  },
];

export function GamesPage({ onPageChange }: GamesPageProps) {
  return (
    <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(160,40%,85%)] mb-4">
            <Sparkles className="w-4 h-4 text-[hsl(160,45%,28%)]" />
            <span className="text-sm font-medium text-[hsl(160,45%,28%)]">玩乐旅行</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(160,25%,15%)] mb-4">
            让旅行更有趣
          </h1>
          <p className="text-lg text-[hsl(160,15%,45%)] max-w-2xl mx-auto">
            不只是走马观花，用游戏的方式探索世界，创造独特的旅行记忆
          </p>
        </div>

        {/* 游戏卡片 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => onPageChange(game.id)}
                className="group relative p-6 rounded-3xl bg-white shadow-soft hover:shadow-float transition-all duration-500 cursor-pointer hover-lift overflow-hidden"
              >
                {/* 背景渐变 */}
                <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* 图标 */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>

                {/* 内容 */}
                <h3 className="text-xl font-bold text-[hsl(160,25%,15%)] mb-2">
                  {game.title}
                </h3>
                <p className="text-[hsl(160,15%,45%)] mb-4">
                  {game.description}
                </p>

                {/* 功能标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {game.features.map((feature) => (
                    <span
                      key={feature}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${game.bgColor} text-[hsl(160,25%,15%)]`}
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* 按钮 */}
                <div className="flex items-center gap-2 text-[hsl(160,45%,28%)] font-medium group-hover:gap-3 transition-all">
                  <span>开始游戏</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 成就展示 */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">收集徽章，成为旅行大师</h2>
              <p className="text-white/80">
                完成游戏挑战，解锁专属徽章，展示你的旅行成就
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-sm text-white/70">已解锁徽章</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
