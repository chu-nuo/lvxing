import { useState } from 'react';
import { ArrowLeftRight, ArrowLeft, Users, Sparkles, Search, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { reverse as reverseApi } from '@/services/travelApi';

interface ReversePageProps {
  onPageChange: (page: string) => void;
}

const reverseDestinations = [
  {
    popular: '三亚',
    alternative: '万宁',
    reason: '同样碧海蓝天，人少一半',
    reverseIndex: 92,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    highlights: ['石梅湾', '日月湾', '兴隆热带植物园'],
  },
  {
    popular: '丽江',
    alternative: '沙溪古镇',
    reason: '同样的纳西风情，更原生态',
    reverseIndex: 88,
    image: 'https://images.unsplash.com/photo-1527684651001-731c474bbb5a?w=800&q=80',
    highlights: ['寺登街', '古戏台', '玉津桥'],
  },
  {
    popular: '西安',
    alternative: '洛阳',
    reason: '同样的古都底蕴，不挤',
    reverseIndex: 85,
    image: 'https://images.unsplash.com/photo-1564596823821-79b0dead95f3?w=800&q=80',
    highlights: ['龙门石窟', '白马寺', '洛邑古城'],
  },
  {
    popular: '厦门',
    alternative: '泉州',
    reason: '同样的闽南文化，更地道',
    reverseIndex: 90,
    image: 'https://images.unsplash.com/photo-1598890777032-bde83547de50?w=800&q=80',
    highlights: ['开元寺', '西街', '清源山'],
  },
];

const getReverseIndexColor = (index: number) => {
  if (index >= 90) return 'bg-emerald-500';
  if (index >= 70) return 'bg-amber-500';
  if (index >= 50) return 'bg-orange-500';
  return 'bg-rose-500';
};

const getReverseIndexLabel = (index: number) => {
  if (index >= 90) return '极度冷门';
  if (index >= 70) return '小众宝藏';
  if (index >= 50) return '相对舒适';
  return '与热门地无异';
};

type ReverseDestinationUI = (typeof reverseDestinations)[number];

export function ReversePage({ onPageChange }: ReversePageProps) {
  const [preferences, setPreferences] = useState<string[]>([]);
  const [crowdTolerance, setCrowdTolerance] = useState(50);
  const [showResults, setShowResults] = useState(false);
  const [alternatives, setAlternatives] = useState<ReverseDestinationUI[]>([]);

  const preferenceOptions = ['自然风光', '历史文化', '美食探索', '休闲度假', '户外探险', '城市漫步'];

  const togglePreference = (pref: string) => {
    setPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  const handleSearch = async () => {
    try {
      const data = await reverseApi({
        preferences,
        crowdTolerance,
        peopleCount: 2,
        travelDate: new Date().toISOString().slice(0, 10),
      });
      setAlternatives(data?.alternatives ?? []);
      setShowResults(true);
    } catch {
      setAlternatives([]);
      setShowResults(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => onPageChange('home')}
            className="p-2 rounded-xl hover:bg-white/50 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[hsl(160,25%,15%)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">反向旅行</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">别人挤破头，你独享风景</p>
          </div>
        </div>

        {!showResults ? (
          <div className="space-y-6 animate-slide-up">
            {/* 标语 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white text-center">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h2 className="text-2xl font-bold mb-2">避开人潮，发现小众宝藏</h2>
              <p className="text-white/80">
                AI分析实时热度数据，为你推荐相似体验但人流较少的替代目的地
              </p>
            </div>

            {/* 偏好选择 */}
            <div className="p-6 rounded-2xl bg-white shadow-soft">
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-4">
                <Sparkles className="w-4 h-4 text-[hsl(160,45%,28%)]" />
                你的旅行偏好
              </label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map(option => (
                  <button
                    key={option}
                    onClick={() => togglePreference(option)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      preferences.includes(option)
                        ? 'bg-[hsl(160,45%,28%)] text-white'
                        : 'bg-[hsl(150,20%,94%)] text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,90%)]'
                    }`}
                  >
                    {preferences.includes(option) && <Check className="w-4 h-4 inline mr-1" />}
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 人流容忍度 */}
            <div className="p-6 rounded-2xl bg-white shadow-soft">
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-4">
                <Users className="w-4 h-4 text-[hsl(160,45%,28%)]" />
                人流容忍度
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[crowdTolerance]}
                  onValueChange={([v]) => setCrowdTolerance(v)}
                  min={0}
                  max={100}
                  step={10}
                  className="flex-1"
                />
                <span className="w-20 text-right font-semibold text-[hsl(160,45%,28%)]">
                  {crowdTolerance}%
                </span>
              </div>
              <div className="flex justify-between mt-2 text-xs text-[hsl(160,15%,45%)]">
                <span>极度冷门</span>
                <span>小众宝藏</span>
                <span>相对舒适</span>
              </div>
            </div>

            {/* 搜索按钮 */}
            <Button
              onClick={handleSearch}
              className="w-full btn-primary py-4 text-lg"
            >
              <Search className="w-5 h-5 mr-2" />
              寻找反向目的地
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* 结果标题 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[hsl(160,25%,15%)]">
                为你找到的反向目的地
              </h2>
              <Button
                variant="outline"
                onClick={() => {
                  setShowResults(false);
                  setAlternatives([]);
                }}
                className="btn-secondary"
              >
                重新选择
              </Button>
            </div>

            {/* 目的地卡片 */}
            <div className="space-y-4">
              {(alternatives.length ? alternatives : reverseDestinations).map(
                (dest) => (
                <div
                  key={dest.popular}
                  className="p-5 rounded-2xl bg-white shadow-soft hover:shadow-float transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* 图片 */}
                    <div className="sm:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={dest.image}
                        alt={dest.alternative}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* 内容 */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-[hsl(160,15%,45%)]">想去</span>
                            <span className="font-semibold text-[hsl(160,25%,15%)]">{dest.popular}</span>
                            <ArrowLeftRight className="w-4 h-4 text-[hsl(160,15%,45%)]" />
                            <span className="font-semibold text-[hsl(160,45%,28%)]">{dest.alternative}</span>
                          </div>
                          <p className="text-sm text-[hsl(160,15%,45%)]">{dest.reason}</p>
                        </div>
                        
                        {/* 反向指数 */}
                        <div className="text-center">
                          <div className={`w-12 h-12 rounded-full ${getReverseIndexColor(dest.reverseIndex)} flex items-center justify-center text-white font-bold`}>
                            {dest.reverseIndex}
                          </div>
                          <span className="text-xs text-[hsl(160,15%,45%)] mt-1 block">
                            {getReverseIndexLabel(dest.reverseIndex)}
                          </span>
                        </div>
                      </div>

                      {/* 亮点 */}
                      <div className="flex flex-wrap gap-2">
                        {dest.highlights.map(highlight => (
                          <span
                            key={highlight}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(150,20%,94%)] text-[hsl(160,25%,15%)]"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                ),
              )}
            </div>

            {/* 数据来源说明 */}
            <div className="p-4 rounded-xl bg-[hsl(150,20%,97%)] text-center">
              <p className="text-sm text-[hsl(160,15%,45%)]">
                数据来源：小红书实时热度、机票价格波动、酒店库存、景点预约情况
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
