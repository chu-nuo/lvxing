import { useState } from 'react';
import { Palette, RefreshCw, Share2, Camera, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ColorWalkPageProps {
  onPageChange: (page: string) => void;
}

const colors = [
  { name: '红色', value: '#EF4444', class: 'bg-red-500' },
  { name: '橙色', value: '#F97316', class: 'bg-orange-500' },
  { name: '黄色', value: '#EAB308', class: 'bg-yellow-500' },
  { name: '绿色', value: '#22C55E', class: 'bg-green-500' },
  { name: '蓝色', value: '#3B82F6', class: 'bg-blue-500' },
  { name: '紫色', value: '#A855F7', class: 'bg-purple-500' },
  { name: '粉色', value: '#EC4899', class: 'bg-pink-500' },
  { name: '黑色', value: '#1F2937', class: 'bg-gray-800' },
  { name: '白色', value: '#F9FAFB', class: 'bg-gray-100' },
];

const challenges = [
  { title: '渐变色挑战', desc: 'Day1红色系 → Day2橙色系 → Day3黄色系，拼成一道彩虹' },
  { title: '互补色对决', desc: '两人组队，分别获得互补色，拍摄各自颜色的照片' },
  { title: '城市色谱', desc: '收集整个城市的颜色，生成专属城市色卡' },
];

export function ColorWalkPage({ onPageChange }: ColorWalkPageProps) {
  const [currentColor, setCurrentColor] = useState<typeof colors[0] | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [photos] = useState<string[]>([]);

  const spinColor = () => {
    setIsSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentColor(colors[Math.floor(Math.random() * colors.length)]);
      count++;
      if (count > 15) {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onPageChange('games')}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[hsl(160,25%,15%)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">色彩漫步</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">用颜色记录你的旅行</p>
          </div>
        </div>

        {/* 色彩转盘 */}
        <div className="mb-8 p-8 rounded-3xl bg-white shadow-soft text-center">
          <h2 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-6">
            点击转盘，获取今日色彩
          </h2>
          
          <div className="relative w-64 h-64 mx-auto mb-8">
            {/* 转盘 */}
            <div className={`absolute inset-0 rounded-full border-8 border-dashed border-[hsl(160,40%,85%)] ${isSpinning ? 'animate-spin' : ''}`} style={{ animationDuration: '0.5s' }} />
            
            {/* 中心颜色显示 */}
            <div 
              className={`absolute inset-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentColor ? currentColor.class : 'bg-[hsl(160,40%,85%)]'
              }`}
            >
              {currentColor ? (
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  {currentColor.name}
                </span>
              ) : (
                <Palette className="w-12 h-12 text-[hsl(160,45%,28%)]" />
              )}
            </div>
          </div>

          <Button
            onClick={spinColor}
            disabled={isSpinning}
            className="btn-primary"
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isSpinning ? 'animate-spin' : ''}`} />
            {currentColor ? '重新抽取' : '开始抽取'}
          </Button>

          {currentColor && (
            <div className="mt-6 p-4 rounded-xl bg-[hsl(150,20%,97%)]">
              <p className="text-[hsl(160,25%,15%)]">
                今天的任务是拍摄<span className="font-semibold" style={{ color: currentColor.value }}>{currentColor.name}</span>的物品或景色
              </p>
            </div>
          )}
        </div>

        {/* 挑战模式 */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-4">进阶挑战</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {challenges.map((challenge, index) => (
              <div key={index} className="p-5 rounded-2xl bg-white shadow-soft hover:shadow-float transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-semibold text-[hsl(160,25%,15%)] mb-2">{challenge.title}</h4>
                <p className="text-sm text-[hsl(160,15%,45%)]">{challenge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 我的色彩相册 */}
        <div className="p-6 rounded-3xl bg-white shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)]">我的色彩相册</h3>
            <Button variant="outline" size="sm" className="btn-secondary">
              <Share2 className="w-4 h-4 mr-2" />
              分享
            </Button>
          </div>
          
          {photos.length === 0 ? (
            <div className="text-center py-12 text-[hsl(160,15%,45%)]">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>还没有照片，开始你的色彩挑战吧！</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {photos.map((_photo, index) => (
                <div key={index} className="aspect-square rounded-xl bg-[hsl(150,20%,94%)]" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
