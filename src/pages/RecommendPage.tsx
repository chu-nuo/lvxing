import { useState } from 'react';
import { Compass, MapPin, Users, Wallet, Calendar, Train, Heart, Sparkles, ArrowRight, Check, Sun, Cloud, CloudRain, TrendingUp, TrendingDown, Minus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import type { Destination } from '@/types';
import { recommend as recommendApi } from '@/services/travelApi';

interface RecommendPageProps {
  onPageChange: (page: string) => void;
}

// 模拟目的地数据
const mockDestinations: Destination[] = [
  {
    id: '1',
    name: '大理',
    image: 'https://images.unsplash.com/photo-1527684651001-731c474bbb5a?w=800&q=80',
    tagline: '在洱海边等一场不需要滤镜的日落',
    budget: 3500,
    days: 4,
    weather: { temp: 22, condition: 'sunny' },
    crowdLevel: 'moderate',
    matchScore: 95,
    highlights: ['洱海骑行', '古城漫步', '苍山索道'],
  },
  {
    id: '2',
    name: '丽江',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    tagline: '雪山下的慢时光，让心灵找到归属',
    budget: 4200,
    days: 5,
    weather: { temp: 18, condition: 'cloudy' },
    crowdLevel: 'hot',
    matchScore: 88,
    highlights: ['玉龙雪山', '束河古镇', '纳西文化'],
  },
  {
    id: '3',
    name: '西双版纳',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    tagline: '热带雨林里的异域风情',
    budget: 2800,
    days: 4,
    weather: { temp: 28, condition: 'sunny' },
    crowdLevel: 'cold',
    matchScore: 82,
    highlights: ['傣族园', '野象谷', '热带植物园'],
  },
];

const transportOptions = ['飞机', '高铁', '自驾', '公共交通', '混合'];
const preferenceOptions = ['打卡', '美食', '人文', '风景', '购物', '探险', '休闲'];
const moodOptions = [
  { value: 'relax', label: '想放松', icon: '😌' },
  { value: 'adventure', label: '想冒险', icon: '🏔️' },
  { value: 'romantic', label: '想浪漫', icon: '💕' },
  { value: 'learn', label: '想学习', icon: '📚' },
  { value: 'heal', label: '想治愈', icon: '🌿' },
];

export function RecommendPage({ onPageChange }: RecommendPageProps) {
  const [step, setStep] = useState<'input' | 'loading' | 'results'>('input');
  const [formData, setFormData] = useState({
    location: '',
    travelers: 2,
    budget: 5000,
    days: 5,
    transport: ['高铁'],
    preferences: ['风景', '美食'],
    mood: 'relax',
    specialNeeds: '',
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);

  const getDestKey = (d: Destination) => d.id ?? d.name;
  const renderDestinations = destinations.length ? destinations : mockDestinations;

  const handleSubmit = async () => {
    setStep('loading');
    try {
      const res = await recommendApi({
        origin: formData.location,
        travelers: formData.travelers,
        budget: formData.budget,
        days: formData.days,
        transport: formData.transport,
        preferences: formData.preferences,
        mood: formData.mood,
        specialNeeds: formData.specialNeeds,
      });

      setDestinations(res?.destinations ?? []);
      setCompareMode(false);
      setSelectedDestinations([]);
      setStep('results');
    } catch {
      // 回退到内置示例（用于演示/离线时）
      setDestinations([]);
      setCompareMode(false);
      setSelectedDestinations([]);
      setStep('results');
    }
  };

  const toggleDestination = (key: string) => {
    setSelectedDestinations((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key],
    );
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-5 h-5 text-amber-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <CloudRain className="w-5 h-5 text-blue-500" />;
      default: return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  const getCrowdIcon = (level: string) => {
    switch (level) {
      case 'cold': return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      case 'moderate': return <Minus className="w-4 h-4 text-amber-500" />;
      case 'hot': return <TrendingUp className="w-4 h-4 text-rose-500" />;
      default: return <Minus className="w-4 h-4" />;
    }
  };

  const getCrowdLabel = (level: string) => {
    switch (level) {
      case 'cold': return '冷门';
      case 'moderate': return '适中';
      case 'hot': return '热门';
      default: return '适中';
    }
  };

  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-nature flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(160,40%,85%)]" />
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(160,45%,28%)] border-t-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-[hsl(160,45%,28%)]" />
          </div>
          <h2 className="text-2xl font-bold text-[hsl(160,25%,15%)] mb-2">
            AI正在为你寻找完美目的地
          </h2>
          <p className="text-[hsl(160,15%,45%)]">
            分析你的偏好，匹配最佳路线...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    return (
      <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(160,25%,15%)] mb-2">
                为你推荐的目的地
              </h1>
              <p className="text-[hsl(160,15%,45%)]">
                基于你的偏好，AI为你精选了以下目的地
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('input')}
                className="btn-secondary"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                重新输入
              </Button>
              {selectedDestinations.length >= 2 && (
                <Button
                  onClick={() => setCompareMode(!compareMode)}
                  className={compareMode ? 'btn-primary' : 'btn-secondary'}
                >
                  {compareMode ? '退出对比' : '对比选择'}
                </Button>
              )}
            </div>
          </div>

          {/* 对比模式 */}
          {compareMode && selectedDestinations.length >= 2 && (
            <div className="mb-8 p-6 rounded-2xl bg-white shadow-soft animate-slide-up">
              <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-4">
                目的地对比
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[hsl(150,15%,88%)]">
                      <th className="text-left py-3 px-4 text-[hsl(160,15%,45%)] font-medium">对比维度</th>
                      {selectedDestinations.map((key) => {
                        const dest = renderDestinations.find(
                          (d) => getDestKey(d) === key,
                        );
                        return dest && (
                          <th key={key} className="text-left py-3 px-4 text-[hsl(160,25%,15%)] font-semibold">
                            {dest.name}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[hsl(150,15%,88%)]">
                      <td className="py-3 px-4 text-[hsl(160,15%,45%)]">预估总预算</td>
                      {selectedDestinations.map((key) => {
                        const dest = renderDestinations.find(
                          (d) => getDestKey(d) === key,
                        );
                        return dest && (
                          <td key={key} className="py-3 px-4 font-medium text-[hsl(160,45%,28%)]">
                            ¥{dest.budget.toLocaleString()}
                          </td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-[hsl(150,15%,88%)]">
                      <td className="py-3 px-4 text-[hsl(160,15%,45%)]">推荐天数</td>
                      {selectedDestinations.map((key) => {
                        const dest = renderDestinations.find(
                          (d) => getDestKey(d) === key,
                        );
                        return dest && (
                          <td key={key} className="py-3 px-4">{dest.days}天</td>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-[hsl(150,15%,88%)]">
                      <td className="py-3 px-4 text-[hsl(160,15%,45%)]">当地天气</td>
                      {selectedDestinations.map((key) => {
                        const dest = renderDestinations.find(
                          (d) => getDestKey(d) === key,
                        );
                        return dest && (
                          <td key={key} className="py-3 px-4 flex items-center gap-2">
                            {getWeatherIcon(dest.weather.condition)}
                            {dest.weather.temp}°C
                          </td>
                        );
                      })}
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-[hsl(160,15%,45%)]">人流热度</td>
                      {selectedDestinations.map((key) => {
                        const dest = renderDestinations.find(
                          (d) => getDestKey(d) === key,
                        );
                        return dest && (
                          <td key={key} className="py-3 px-4 flex items-center gap-2">
                            {getCrowdIcon(dest.crowdLevel)}
                            {getCrowdLabel(dest.crowdLevel)}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 目的地卡片 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderDestinations.map((dest, index) => (
              <div
                key={getDestKey(dest)}
                className={`group relative rounded-2xl overflow-hidden bg-white shadow-soft hover:shadow-float transition-all duration-500 hover-lift ${
                  selectedDestinations.includes(getDestKey(dest))
                    ? 'ring-2 ring-[hsl(160,45%,28%)]'
                    : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* 图片 */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  
                  {/* 匹配度 */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-[hsl(160,45%,28%)]">
                      {dest.matchScore}% 匹配
                    </span>
                  </div>

                  {/* 选择按钮 */}
                  <button
                    onClick={() => toggleDestination(getDestKey(dest))}
                    className={`absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      selectedDestinations.includes(getDestKey(dest))
                        ? 'bg-[hsl(160,45%,28%)] text-white'
                        : 'bg-white/90 text-[hsl(160,15%,45%)] hover:bg-white'
                    }`}
                  >
                    {selectedDestinations.includes(getDestKey(dest)) ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-lg">+</span>
                    )}
                  </button>

                  {/* 名称和标语 */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{dest.name}</h3>
                    <p className="text-sm text-white/80 line-clamp-1">{dest.tagline}</p>
                  </div>
                </div>

                {/* 信息 */}
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-1 text-[hsl(160,15%,45%)]">
                      <Wallet className="w-4 h-4" />
                      <span>¥{dest.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[hsl(160,15%,45%)]">
                      <Calendar className="w-4 h-4" />
                      <span>{dest.days}天</span>
                    </div>
                    <div className="flex items-center gap-1 text-[hsl(160,15%,45%)]">
                      {getWeatherIcon(dest.weather.condition)}
                      <span>{dest.weather.temp}°C</span>
                    </div>
                  </div>

                  {/* 亮点 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {dest.highlights.map(highlight => (
                      <Badge key={highlight} variant="secondary" className="bg-[hsl(150,20%,94%)] text-[hsl(160,25%,15%)]">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  {/* 按钮 */}
                  <Button
                    onClick={() => {
                      sessionStorage.setItem(
                        'travelai_planner_destination',
                        dest.name,
                      );
                      onPageChange('planner');
                    }}
                    className="w-full btn-primary"
                  >
                    生成详细路线
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(160,40%,85%)] mb-4">
            <Sparkles className="w-4 h-4 text-[hsl(160,45%,28%)]" />
            <span className="text-sm font-medium text-[hsl(160,45%,28%)]">AI智能推荐</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(160,25%,15%)] mb-3">
            告诉我你的旅行需求
          </h1>
          <p className="text-lg text-[hsl(160,15%,45%)]">
            AI将为你推荐最适合的目的地
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* 当前所在地 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <MapPin className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              当前所在地
            </label>
            <input
              type="text"
              placeholder="请输入出发城市"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[hsl(150,15%,88%)] focus:border-[hsl(160,45%,28%)] focus:ring-2 focus:ring-[hsl(160,45%,28%)]/20 outline-none transition-all"
            />
          </div>

          {/* 出行人数 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Users className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              出行人数
            </label>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.travelers]}
                onValueChange={([v]) => setFormData({ ...formData, travelers: v })}
                min={1}
                max={20}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-center font-semibold text-[hsl(160,45%,28%)]">
                {formData.travelers}人
              </span>
            </div>
          </div>

          {/* 预算范围 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Wallet className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              人均预算
            </label>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.budget]}
                onValueChange={([v]) => setFormData({ ...formData, budget: v })}
                min={500}
                max={50000}
                step={500}
                className="flex-1"
              />
              <span className="w-24 text-center font-semibold text-[hsl(160,45%,28%)]">
                ¥{formData.budget.toLocaleString()}
              </span>
            </div>
          </div>

          {/* 出行天数 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Calendar className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              出行天数
            </label>
            <div className="flex items-center gap-4">
              <Slider
                value={[formData.days]}
                onValueChange={([v]) => setFormData({ ...formData, days: v })}
                min={1}
                max={30}
                step={1}
                className="flex-1"
              />
              <span className="w-16 text-center font-semibold text-[hsl(160,45%,28%)]">
                {formData.days}天
              </span>
            </div>
          </div>

          {/* 交通偏好 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Train className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              交通偏好
            </label>
            <div className="flex flex-wrap gap-2">
              {transportOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      transport: prev.transport.includes(option)
                        ? prev.transport.filter(t => t !== option)
                        : [...prev.transport, option]
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.transport.includes(option)
                      ? 'bg-[hsl(160,45%,28%)] text-white'
                      : 'bg-[hsl(150,20%,94%)] text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,90%)]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 旅行偏好 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Heart className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              旅行偏好
            </label>
            <div className="flex flex-wrap gap-2">
              {preferenceOptions.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      preferences: prev.preferences.includes(option)
                        ? prev.preferences.filter(p => p !== option)
                        : [...prev.preferences, option]
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    formData.preferences.includes(option)
                      ? 'bg-[hsl(160,45%,28%)] text-white'
                      : 'bg-[hsl(150,20%,94%)] text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,90%)]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* 情绪标签 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Sparkles className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              这次旅行，你想...
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  onClick={() => setFormData({ ...formData, mood: mood.value })}
                  className={`p-4 rounded-xl text-center transition-all ${
                    formData.mood === mood.value
                      ? 'bg-[hsl(160,45%,28%)] text-white'
                      : 'bg-[hsl(150,20%,94%)] text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,90%)]'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{mood.icon}</span>
                  <span className="text-sm font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 特殊需求 */}
          <div className="p-6 rounded-2xl bg-white shadow-soft">
            <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)] mb-3">
              <Compass className="w-4 h-4 text-[hsl(160,45%,28%)]" />
              特殊需求（选填）
            </label>
            <textarea
              placeholder="例如：无障碍设施、带宠物、亲子友好等"
              value={formData.specialNeeds}
              onChange={(e) => setFormData({ ...formData, specialNeeds: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-[hsl(150,15%,88%)] focus:border-[hsl(160,45%,28%)] focus:ring-2 focus:ring-[hsl(160,45%,28%)]/20 outline-none transition-all resize-none h-24"
            />
          </div>

          {/* 提交按钮 */}
          <Button
            onClick={handleSubmit}
            className="w-full btn-primary py-4 text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            AI为我推荐目的地
          </Button>
        </div>
      </div>
    </div>
  );
}
