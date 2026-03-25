import { useState } from 'react';
import { Dices, ArrowLeft, RefreshCw, Camera, Share2, MapPin, Utensils, Bus, Clock, Wallet, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { diceVlogScript } from '@/services/travelApi';

interface DicePageProps {
  onPageChange: (page: string) => void;
}

const diceCategories = [
  { id: 'food', name: '吃什么', icon: Utensils, options: ['当地小吃', '网红餐厅', '路边摊', '自己做饭'] },
  { id: 'where', name: '去哪', icon: MapPin, options: ['热门景点', '小众去处', '随机漫步', '当地人推荐'] },
  { id: 'transport', name: '交通', icon: Bus, options: ['步行', '公交', '打车', '骑行'] },
  { id: 'time', name: '停留', icon: Clock, options: ['30分钟', '1小时', '半天', '全天'] },
  { id: 'budget', name: '消费', icon: Wallet, options: ['¥50以内', '¥100以内', '¥200以内', '不限'] },
  { id: 'task', name: '任务', icon: Users, options: ['和陌生人合影', '学一句方言', '买一件纪念品', '拍一张创意照'] },
];

const photoTasks = [
  '拍一张看起来像《白蛇传》电影海报的照片',
  '拍出赛博朋克风格的夜景',
  '捕捉"岁月静好"的瞬间',
  '用倒影拍出对称构图',
];

export function DicePage({ onPageChange }: DicePageProps) {
  const [results, setResults] = useState<Record<string, string>>({});
  const [isRolling, setIsRolling] = useState<Record<string, boolean>>({});
  const [photoTask, setPhotoTask] = useState<string | null>(null);
  const [vlogLoading, setVlogLoading] = useState(false);
  const [vlogScript, setVlogScript] = useState<{
    hook: string;
    shots: Array<{
      scene: string;
      visualDescription: string;
      voiceover: string;
      subtitle: string;
    }>;
    cta: string;
  } | null>(null);

  const rollDice = (categoryId: string, options: string[]) => {
    setIsRolling(prev => ({ ...prev, [categoryId]: true }));
    
    let count = 0;
    const interval = setInterval(() => {
      setResults(prev => ({
        ...prev,
        [categoryId]: options[Math.floor(Math.random() * options.length)]
      }));
      count++;
      if (count > 10) {
        clearInterval(interval);
        setIsRolling(prev => ({ ...prev, [categoryId]: false }));
      }
    }, 80);
  };

  const rollAll = () => {
    diceCategories.forEach(cat => {
      rollDice(cat.id, cat.options);
    });
    setPhotoTask(photoTasks[Math.floor(Math.random() * photoTasks.length)]);
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
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">骰子旅行</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">让骰子决定你的行程</p>
          </div>
        </div>

        {/* 全部投掷按钮 */}
        <div className="mb-8 text-center">
          <Button
            onClick={rollAll}
            className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <Dices className="w-6 h-6 mr-3" />
            投掷所有骰子
          </Button>
        </div>

        {/* 骰子网格 */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {diceCategories.map((category) => {
            const Icon = category.icon;
            const result = results[category.id];
            const rolling = isRolling[category.id];
            
            return (
              <div
                key={category.id}
                onClick={() => rollDice(category.id, category.options)}
                className={`p-5 rounded-2xl bg-white shadow-soft cursor-pointer transition-all ${
                  rolling ? 'scale-95' : 'hover:shadow-float hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <span className="font-medium text-[hsl(160,25%,15%)]">{category.name}</span>
                </div>
                
                <div className={`text-lg font-semibold ${result ? 'text-violet-600' : 'text-[hsl(160,15%,45%)]'}`}>
                  {result || '点击投掷'}
                </div>
                
                {rolling && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-violet-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    投掷中...
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 拍摄任务 */}
        {photoTask && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 animate-slide-up">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-5 h-5 text-cyan-600" />
              <span className="font-semibold text-cyan-800">今日拍摄任务</span>
            </div>
            <p className="text-cyan-900">{photoTask}</p>
          </div>
        )}

        {/* Vlog脚本生成 */}
        {Object.keys(results).length === 6 && (
          <div className="p-6 rounded-2xl bg-white shadow-soft animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-[hsl(160,45%,28%)]" />
              <h3 className="font-semibold text-[hsl(160,25%,15%)]">生成Vlog脚本</h3>
            </div>
            <p className="text-[hsl(160,15%,45%)] mb-4">
              根据今天的骰子结果，为你生成专属Vlog拍摄脚本
            </p>
            <div className="flex gap-3">
              <Button
                className="btn-primary flex-1"
                disabled={vlogLoading}
                onClick={async () => {
                  setVlogLoading(true);
                  try {
                    const data = await diceVlogScript({
                      city: '未知目的地',
                      persona: '旅行博主',
                      dice: results,
                      travelDate: new Date().toISOString().slice(0, 10),
                    });
                    setVlogScript(data?.script ?? null);
                  } catch {
                    setVlogScript(null);
                  } finally {
                    setVlogLoading(false);
                  }
                }}
              >
                <Camera className="w-5 h-5 mr-2" />
                {vlogLoading ? '生成中...' : '生成脚本'}
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Share2 className="w-5 h-5 mr-2" />
                分享
              </Button>
            </div>
          </div>
        )}

        {vlogScript && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
            <h3 className="text-lg font-semibold text-violet-900 mb-2">Vlog 脚本</h3>
            <p className="text-sm text-violet-800 mb-4">{vlogScript.hook}</p>

            <div className="space-y-3">
              {vlogScript.shots.map((s, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-white/70">
                  <div className="font-medium text-violet-900 mb-1">
                    镜头 {idx + 1}：{s.scene}
                  </div>
                  <div className="text-sm text-violet-800">
                    画面：{s.visualDescription}
                  </div>
                  <div className="text-sm text-violet-800">
                    旁白：{s.voiceover}
                  </div>
                  <div className="text-sm text-violet-800">
                    字幕：{s.subtitle}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-violet-900 font-medium">
              结尾：{vlogScript.cta}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
