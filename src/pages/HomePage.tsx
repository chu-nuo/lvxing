import { useEffect, useRef } from 'react';
import { Compass, MapPin, Sparkles, ArrowRight, Palette, Box, Dices, Camera, Puzzle, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HomePageProps {
  onPageChange: (page: string) => void;
}

export function HomePage({ onPageChange }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        heroRef.current.style.setProperty('--mouse-x', `${x}`);
        heroRef.current.style.setProperty('--mouse-y', `${y}`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Compass,
      title: 'AI智能推荐',
      description: '基于你的偏好，AI为你发现完美目的地',
      color: 'from-emerald-500 to-teal-600',
      action: () => onPageChange('recommend'),
    },
    {
      icon: MapPin,
      title: '直接规划',
      description: '已有目的地？一键生成详细行程',
      color: 'from-sky-500 to-blue-600',
      action: () => onPageChange('planner'),
    },
  ];

  const games = [
    { icon: Palette, title: '色彩漫步', desc: '用颜色记录旅行', color: 'bg-rose-100 text-rose-600' },
    { icon: Box, title: '盲盒旅行', desc: '未知目的地冒险', color: 'bg-amber-100 text-amber-600' },
    { icon: Dices, title: '骰子旅行', desc: '随机决定行程', color: 'bg-violet-100 text-violet-600' },
    { icon: Camera, title: '摄影挑战', desc: 'AI评分你的作品', color: 'bg-cyan-100 text-cyan-600' },
    { icon: Puzzle, title: '足迹拼图', desc: '解锁中国地图', color: 'bg-emerald-100 text-emerald-600' },
    { icon: ArrowLeftRight, title: '反向旅行', desc: '避开人潮小众游', color: 'bg-indigo-100 text-indigo-600' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
        style={{
          background: `radial-gradient(ellipse at ${parseFloat(heroRef.current?.style.getPropertyValue('--mouse-x') || '0.5') * 100}% ${parseFloat(heroRef.current?.style.getPropertyValue('--mouse-y') || '0.5') * 100}%, hsl(150 40% 92%), hsl(160 30% 96%), hsl(45 30% 97%))`,
        }}
      >
        {/* 装饰元素 */}
        <div className="absolute inset-0 leaf-pattern opacity-50" />
        
        {/* 浮动装饰 */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-[hsl(160,40%,85%)] opacity-40 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-[hsl(180,40%,80%)] opacity-30 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 rounded-full bg-[hsl(150,30%,88%)] opacity-40 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-12 h-12 rounded-full bg-[hsl(195,60%,85%)] opacity-30 animate-float" style={{ animationDelay: '1.5s' }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 标签 */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[hsl(160,45%,28%)]/10 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-[hsl(160,45%,28%)]" />
            <span className="text-sm font-medium text-[hsl(160,25%,15%)]">AI 驱动的智能旅行规划</span>
          </div>

          {/* 主标题 */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[hsl(160,25%,15%)] mb-6 leading-tight animate-slide-up">
            不只是规划旅行
            <br />
            <span className="text-gradient">而是创造旅行故事</span>
          </h1>

          {/* 副标题 */}
          <p className="text-lg sm:text-xl text-[hsl(160,15%,45%)] max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            输入你的旅行需求，让AI为你发现完美目的地，生成个性化路线，开启独一无二的旅程
          </p>

          {/* 双入口按钮 */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button
              onClick={() => onPageChange('recommend')}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Compass className="w-5 h-5" />
                AI智能推荐
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[hsl(180,40%,35%)] to-[hsl(160,45%,28%)] opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => onPageChange('planner')}
              className="group w-full sm:w-auto px-8 py-4 bg-white/80 backdrop-blur-sm text-[hsl(160,45%,28%)] rounded-2xl font-semibold text-lg border border-[hsl(160,45%,28%)]/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                <MapPin className="w-5 h-5" />
                直接规划行程
              </span>
            </button>
          </div>


        </div>

        {/* 底部渐变 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[hsl(150,20%,97%)] to-transparent" />
      </section>

      {/* 核心功能入口 */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(150,20%,97%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(160,25%,15%)] mb-4">
              选择你的旅行方式
            </h2>
            <p className="text-lg text-[hsl(160,15%,45%)]">
              无论是探索未知还是规划已知，我们都能满足你的需求
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  onClick={feature.action}
                  className="group relative p-8 rounded-3xl bg-white shadow-soft hover:shadow-float transition-all duration-500 cursor-pointer hover-lift overflow-hidden"
                >
                  {/* 背景渐变 */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-[hsl(160,25%,15%)] mb-3">
                      {feature.title}
                    </h3>
                    
                    <p className="text-[hsl(160,15%,45%)] mb-6">
                      {feature.description}
                    </p>
                    
                    <div className="flex items-center gap-2 text-[hsl(160,45%,28%)] font-medium">
                      <span>立即体验</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 玩乐旅行模块 */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[hsl(150,20%,97%)] to-[hsl(150,15%,98%)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 rounded-full bg-[hsl(160,40%,85%)] text-[hsl(160,45%,28%)] text-sm font-medium mb-4">
              趣味玩法
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(160,25%,15%)] mb-4">
              让旅行更有趣
            </h2>
            <p className="text-lg text-[hsl(160,15%,45%)]">
              不只是走马观花，用游戏的方式探索世界
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <button
                  key={game.title}
                  onClick={() => {
                    if (game.title === '反向旅行') onPageChange('reverse');
                    else if (game.title === '色彩漫步') onPageChange('color-walk');
                    else if (game.title === '盲盒旅行') onPageChange('blind-box');
                    else if (game.title === '骰子旅行') onPageChange('dice');
                    else if (game.title === '摄影挑战') onPageChange('photo-challenge');
                    else if (game.title === '足迹拼图') onPageChange('puzzle');
                    else onPageChange('games');
                  }}
                  className="group p-6 rounded-2xl bg-white shadow-soft hover:shadow-float transition-all duration-300 hover:-translate-y-1 text-left"
                >
                  <div className={`w-12 h-12 rounded-xl ${game.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-1">
                    {game.title}
                  </h3>
                  <p className="text-sm text-[hsl(160,15%,45%)]">
                    {game.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[hsl(150,20%,97%)]">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] overflow-hidden">
            {/* 装饰 */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                准备好开始你的旅程了吗？
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                让AI为你发现下一个目的地，创造属于你的旅行故事
              </p>
              <Button
                onClick={() => onPageChange('recommend')}
                className="px-8 py-4 bg-white text-[hsl(160,45%,28%)] rounded-xl font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                开始探索
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-[hsl(160,25%,12%)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,45%)] flex items-center justify-center">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">
                Travel<span className="text-[hsl(160,40%,65%)]">AI</span>
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-white/60">
              <span>© 2026 TravelAI</span>
              <span>·</span>
              <span>智能旅行规划</span>
              <span>·</span>
              <span>创造旅行故事</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
