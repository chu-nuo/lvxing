import { useState } from 'react';
import { ArrowLeft, Sparkles, Lock, Unlock, MapPin, Wallet, Calendar, ChevronRight, Gift, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { blindboxRecommend } from '@/services/travelApi';

interface BlindBoxPageProps {
  onPageChange: (page: string) => void;
}

const themes = [
  { id: 'seaside', name: '海边', icon: '🌊', desc: '碧海蓝天，沙滩阳光' },
  { id: 'mountain', name: '山城', icon: '⛰️', desc: '云雾缭绕，山城风情' },
  { id: 'ancient', name: '古镇', icon: '🏮', desc: '青石板路，古韵悠长' },
  { id: 'city', name: '都市', icon: '🌃', desc: '繁华都市，现代魅力' },
];

const sampleClues = [
  { clue: '你即将去一个以猫闻名的海滨城市', answer: '厦门' },
  { clue: '那里有中国最美的梯田，还有酸汤鱼', answer: '贵州从江' },
  { clue: '一座不用空调的城市，夏天平均22°C', answer: '昆明' },
];

export function BlindBoxPage({ onPageChange }: BlindBoxPageProps) {
  const [step, setStep] = useState<'theme' | 'budget' | 'clues' | 'revealed'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [budget, setBudget] = useState(3000);
  const [days, setDays] = useState(3);
  const [currentClue, setCurrentClue] = useState(0);
  const [clues, setClues] = useState<string[]>([]);
  const [cluesLoading, setCluesLoading] = useState(false);
  const [revealLoading, setRevealLoading] = useState(false);
  const [revealedDestination, setRevealedDestination] = useState<string | null>(null);
  const [revealedItinerary, setRevealedItinerary] = useState<any>(null);
  const clueTexts = (clues.length ? clues : sampleClues.map((c) => c.clue)).slice(0, 3);
  const selectedThemeObj = selectedTheme
    ? themes.find((t) => t.id === selectedTheme) ?? null
    : null;

  const renderStep = () => {
    switch (step) {
      case 'theme':
        return (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-[hsl(160,25%,15%)] mb-2">选择主题</h2>
            <p className="text-[hsl(160,15%,45%)] mb-6">你想体验什么样的旅行？</p>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    setSelectedTheme(theme.id);
                    setStep('budget');
                  }}
                  className={`p-6 rounded-2xl text-left transition-all ${
                    selectedTheme === theme.id
                      ? 'bg-[hsl(160,45%,28%)] text-white'
                      : 'bg-white shadow-soft hover:shadow-float'
                  }`}
                >
                  <span className="text-3xl mb-3 block">{theme.icon}</span>
                  <h3 className={`font-semibold mb-1 ${selectedTheme === theme.id ? 'text-white' : 'text-[hsl(160,25%,15%)]'}`}>
                    {theme.name}
                  </h3>
                  <p className={`text-sm ${selectedTheme === theme.id ? 'text-white/80' : 'text-[hsl(160,15%,45%)]'}`}>
                    {theme.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );

      case 'budget':
        return (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-[hsl(160,25%,15%)] mb-2">设置预算和天数</h2>
            <p className="text-[hsl(160,15%,45%)] mb-6">告诉我们你的旅行计划</p>
            
            <div className="space-y-6 mb-8">
              <div className="p-6 rounded-2xl bg-white shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="w-5 h-5 text-[hsl(160,45%,28%)]" />
                  <span className="font-medium text-[hsl(160,25%,15%)]">人均预算</span>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[budget]}
                    onValueChange={([v]) => setBudget(v)}
                    min={1000}
                    max={10000}
                    step={500}
                    className="flex-1"
                  />
                  <span className="w-24 text-right font-semibold text-[hsl(160,45%,28%)]">
                    ¥{budget.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-[hsl(160,45%,28%)]" />
                  <span className="font-medium text-[hsl(160,25%,15%)]">出行天数</span>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[days]}
                    onValueChange={([v]) => setDays(v)}
                    min={1}
                    max={7}
                    step={1}
                    className="flex-1"
                  />
                  <span className="w-16 text-right font-semibold text-[hsl(160,45%,28%)]">
                    {days}天
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('theme')}
                className="btn-secondary flex-1"
              >
                上一步
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedTheme) return;
                  setCluesLoading(true);
                  setCurrentClue(0);
                  setClues([]);
                  setStep('clues');
                  try {
                    const data = await blindboxRecommend({
                      theme: selectedTheme,
                      budget,
                      days,
                      reveal: false,
                      preferences: [],
                    });
                    setClues(data?.clues ?? []);
                  } catch {
                    setClues([]);
                  } finally {
                    setCluesLoading(false);
                  }
                }}
                className="btn-primary flex-1"
                disabled={cluesLoading}
              >
                支付定金
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        );

      case 'clues':
        return (
          <div className="animate-slide-up">
            <h2 className="text-xl font-semibold text-[hsl(160,25%,15%)] mb-2">接收线索</h2>
            <p className="text-[hsl(160,15%,45%)] mb-6">根据线索猜测你的目的地</p>
            
            <div className="p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">
                  线索 {currentClue + 1}/{clueTexts.length}
                </span>
              </div>
              <p className="text-lg text-amber-900 mb-6">
                "{clueTexts[currentClue] ?? ''}"
              </p>
              <div className="flex items-center gap-2 text-amber-700">
                <Lock className="w-4 h-4" />
                <span className="text-sm">出发当天揭晓答案</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              {clueTexts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentClue(i)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                    currentClue === i
                      ? 'bg-[hsl(160,45%,28%)] text-white'
                      : 'bg-white text-[hsl(160,15%,45%)]'
                  }`}
                >
                  线索 {i + 1}
                </button>
              ))}
            </div>

            <Button
              onClick={async () => {
                if (!selectedTheme) return;
                setRevealLoading(true);
                try {
                  const data = await blindboxRecommend({
                    theme: selectedTheme,
                    budget,
                    days,
                    reveal: true,
                    preferences: [],
                  });
                  setRevealedDestination(data?.destination ?? null);
                  setRevealedItinerary(data?.itinerary ?? null);
                  setStep('revealed');
                } catch {
                  setRevealedDestination(null);
                  setRevealedItinerary(null);
                  setStep('revealed');
                } finally {
                  setRevealLoading(false);
                }
              }}
              className="w-full btn-primary"
              disabled={revealLoading}
            >
              <Unlock className="w-5 h-5 mr-2" />
              {revealLoading ? '正在揭晓...' : '提前揭晓'}
            </Button>
          </div>
        );

      case 'revealed':
        return (
          <div className="animate-slide-up text-center">
            <div className="mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[hsl(160,25%,15%)] mb-2">
                你的盲盒目的地是...
              </h2>
            </div>

            <div className="p-8 rounded-3xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white mb-8">
              <MapPin className="w-8 h-8 mx-auto mb-4 opacity-80" />
              <h3 className="text-4xl font-bold mb-2">
                {revealedDestination ?? '未知目的地'}
              </h3>
              <p className="text-white/80">基于你的主题与预算生成的惊喜行程</p>
            </div>

            {revealedItinerary && (
              <div className="mb-6 text-sm text-[hsl(160,15%,45%)]">
                已为你生成盲盒行程（将跳转到行程规划页继续查看）。
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white shadow-soft">
                <div className="text-2xl font-bold text-[hsl(160,45%,28%)]">¥{budget.toLocaleString()}</div>
                <div className="text-sm text-[hsl(160,15%,45%)]">预算</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-soft">
                <div className="text-2xl font-bold text-[hsl(160,45%,28%)]">{days}天</div>
                <div className="text-sm text-[hsl(160,15%,45%)]">天数</div>
              </div>
              <div className="p-4 rounded-xl bg-white shadow-soft">
                <div className="text-2xl font-bold text-[hsl(160,45%,28%)]">
                  {selectedThemeObj?.name ?? '海边'}
                </div>
                <div className="text-sm text-[hsl(160,15%,45%)]">主题</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => {
                  if (revealedDestination) {
                    sessionStorage.setItem(
                      'travelai_planner_destination',
                      revealedDestination,
                    );
                  }
                  onPageChange('planner');
                }}
                className="btn-primary flex-1"
              >
                生成行程
              </Button>
              <Button
                variant="outline"
                className="btn-secondary"
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>

            {/* 解锁奖励 */}
            <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="font-semibold text-amber-800">解锁奖励</span>
              </div>
              <p className="text-amber-700">
                获得「盲盒旅行者」徽章 + 专属折扣码
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onPageChange('games')}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[hsl(160,25%,15%)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">盲盒旅行</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">未知目的地，惊喜冒险</p>
          </div>
        </div>

        {/* 进度指示器 */}
        {step !== 'revealed' && (
          <div className="flex items-center gap-2 mb-8">
            {['theme', 'budget', 'clues'].map((s, i) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full transition-all ${
                  ['theme', 'budget', 'clues'].indexOf(step) >= i
                    ? 'bg-[hsl(160,45%,28%)]'
                    : 'bg-[hsl(150,20%,94%)]'
                }`}
              />
            ))}
          </div>
        )}

        {/* 内容区域 */}
        <div className="p-6 rounded-3xl bg-white/60 backdrop-blur-sm">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
