import { useEffect, useState } from 'react';
import { MapPin, Search, Clock, Utensils, Bed, AlertCircle, PieChart, Sparkles, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { planner as plannerApi } from '@/services/travelApi';

interface PlannerPageProps {
  onPageChange: (page: string) => void;
}

// 模拟路线数据
const mockItinerary = {
  destination: '大理',
  totalBudget: 3500,
  budgetBreakdown: {
    transport: { amount: 1200, percentage: 35 },
    accommodation: { amount: 1000, percentage: 28 },
    food: { amount: 700, percentage: 20 },
    activities: { amount: 600, percentage: 17 },
  },
  days: [
    {
      day: 1,
      activities: [
        { time: '09:00', title: '抵达大理', description: '从机场/高铁站前往古城', type: 'transport' },
        { time: '11:00', title: '入住客栈', description: '大理古城内特色民宿', type: 'rest' },
        { time: '14:00', title: '古城漫步', description: '探索大理古城的历史街巷', type: 'sightseeing' },
        { time: '18:00', title: '白族晚餐', description: '品尝酸辣鱼和乳扇', type: 'food' },
      ],
    },
    {
      day: 2,
      activities: [
        { time: '08:00', title: '环洱海骑行', description: '从才村码头出发，骑行至喜洲', type: 'sightseeing' },
        { time: '12:00', title: '喜洲午餐', description: '喜洲粑粑和凉鸡米线', type: 'food' },
        { time: '15:00', title: '双廊古镇', description: '欣赏洱海日落最佳地点', type: 'sightseeing' },
        { time: '19:00', title: '海景晚餐', description: '海边餐厅，人均150元', type: 'food' },
      ],
    },
    {
      day: 3,
      activities: [
        { time: '09:00', title: '苍山索道', description: '乘坐洗马潭索道，俯瞰洱海', type: 'sightseeing' },
        { time: '13:00', title: '寂照庵素斋', description: '最美尼姑庵的精致素斋', type: 'food' },
        { time: '16:00', title: '三月街', description: '体验白族传统集市', type: 'sightseeing' },
        { time: '20:00', title: '酒吧街', description: '感受大理夜生活', type: 'food' },
      ],
    },
  ],
  accommodation: '大理古城内特色民宿，靠近人民路，交通便利',
  tips: [
    '大理紫外线较强，请做好防晒',
    '古城内禁止机动车通行，建议穿舒适的鞋子',
    '最佳旅游季节是3-5月和9-11月',
    '可以尝试白族扎染体验',
  ],
};

type MockItinerary = typeof mockItinerary;

const localTips = [
  '只有本地人才知道的早餐摊：北门菜市场的稀豆粉',
  '傍晚去龙龛码头看日落，比才村码头人少',
  '周城村的扎染比古城里的更正宗更便宜',
  '周四下午三月街有本地人集市，可以买到最新鲜的水果',
];

export function PlannerPage({ }: PlannerPageProps) {
  const [destination, setDestination] = useState('');
  const [hasResult, setHasResult] = useState(false);
  const [itinerary, setItinerary] = useState<MockItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [localMode, setLocalMode] = useState(false);
  const [budgetMode, setBudgetMode] = useState<'comfort' | 'save'>('comfort');

  const displayedItinerary: MockItinerary = itinerary ?? mockItinerary;
  const budgetBreakdownEntries = Object.entries(
    displayedItinerary.budgetBreakdown,
  ) as Array<
    [
      keyof MockItinerary["budgetBreakdown"],
      MockItinerary["budgetBreakdown"][keyof MockItinerary["budgetBreakdown"]],
    ]
  >;

  useEffect(() => {
    const prefill = sessionStorage.getItem('travelai_planner_destination');
    if (prefill) setDestination(prefill);
  }, []);

  const handleSearch = async () => {
    if (!destination) return;
    setIsLoading(true);
    try {
      const res = await plannerApi({
        destination,
        localMode,
        pace: 'medium',
      });
      setItinerary(res);
      setHasResult(true);
    } catch {
      setItinerary(null);
      setHasResult(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'transport': return <MapPin className="w-4 h-4" />;
      case 'food': return <Utensils className="w-4 h-4" />;
      case 'rest': return <Bed className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'transport': return 'bg-blue-100 text-blue-600';
      case 'food': return 'bg-orange-100 text-orange-600';
      case 'rest': return 'bg-purple-100 text-purple-600';
      default: return 'bg-emerald-100 text-emerald-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-nature flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(160,40%,85%)]" />
            <div className="absolute inset-0 rounded-full border-4 border-[hsl(160,45%,28%)] border-t-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-[hsl(160,45%,28%)]" />
          </div>
          <p className="text-[hsl(160,15%,45%)]">正在生成专属路线...</p>
        </div>
      </div>
    );
  }

  if (hasResult) {
    return (
      <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[hsl(160,25%,15%)] mb-2">
                {displayedItinerary.destination}行程规划
              </h1>
              <p className="text-[hsl(160,15%,45%)]">
                {displayedItinerary.days.length}天 · 预估总花费 ¥{displayedItinerary.totalBudget.toLocaleString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setHasResult(false);
                  setItinerary(null);
                }}
                className="btn-secondary"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                重新规划
              </Button>
            </div>
          </div>

          {/* 模式切换 */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setLocalMode(false)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                !localMode
                  ? 'bg-[hsl(160,45%,28%)] text-white'
                  : 'bg-white text-[hsl(160,15%,45%)]'
              }`}
            >
              标准模式
            </button>
            <button
              onClick={() => setLocalMode(true)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                localMode
                  ? 'bg-[hsl(160,45%,28%)] text-white'
                  : 'bg-white text-[hsl(160,15%,45%)]'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              当地人视角
            </button>
          </div>

          {/* 当地人视角提示 */}
          {localMode && (
            <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-amber-800 mb-4">
                <Sparkles className="w-5 h-5" />
                本地人才知道的小秘密
              </h3>
              <ul className="space-y-3">
                {localTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3 text-amber-700">
                    <span className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0 text-sm font-medium">
                      {index + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Tabs defaultValue="itinerary" className="space-y-6">
            <TabsList className="bg-white p-1 rounded-xl">
              <TabsTrigger value="itinerary" className="rounded-lg data-[state=active]:bg-[hsl(160,45%,28%)] data-[state=active]:text-white">
                详细行程
              </TabsTrigger>
              <TabsTrigger value="budget" className="rounded-lg data-[state=active]:bg-[hsl(160,45%,28%)] data-[state=active]:text-white">
                预算分配
              </TabsTrigger>
              <TabsTrigger value="tips" className="rounded-lg data-[state=active]:bg-[hsl(160,45%,28%)] data-[state=active]:text-white">
                注意事项
              </TabsTrigger>
            </TabsList>

            <TabsContent value="itinerary" className="space-y-6">
              {displayedItinerary.days.map((day) => (
                <div key={day.day} className="p-6 rounded-2xl bg-white shadow-soft">
                  <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-[hsl(160,45%,28%)] text-white flex items-center justify-center text-sm">
                      D{day.day}
                    </span>
                    第{day.day}天
                  </h3>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-xl ${getActivityColor(activity.type)} flex items-center justify-center flex-shrink-0`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[hsl(160,15%,45%)]">{activity.time}</span>
                            <span className="font-medium text-[hsl(160,25%,15%)]">{activity.title}</span>
                          </div>
                          <p className="text-sm text-[hsl(160,15%,45%)]">{activity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="budget">
              <div className="p-6 rounded-2xl bg-white shadow-soft">
                {/* 预算模式切换 */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)]">预算分配</h3>
                  <div className="flex items-center gap-2 p-1 bg-[hsl(150,20%,94%)] rounded-lg">
                    <button
                      onClick={() => setBudgetMode('save')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        budgetMode === 'save'
                          ? 'bg-white text-[hsl(160,45%,28%)] shadow-sm'
                          : 'text-[hsl(160,15%,45%)]'
                      }`}
                    >
                      省钱模式
                    </button>
                    <button
                      onClick={() => setBudgetMode('comfort')}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        budgetMode === 'comfort'
                          ? 'bg-white text-[hsl(160,45%,28%)] shadow-sm'
                          : 'text-[hsl(160,15%,45%)]'
                      }`}
                    >
                      舒适模式
                    </button>
                  </div>
                </div>

                {/* 饼图可视化 */}
                <div className="grid sm:grid-cols-2 gap-8 mb-6">
                  <div className="relative w-48 h-48 mx-auto">
                    <svg viewBox="0 0 100 100" className="transform -rotate-90">
                      {budgetBreakdownEntries.map(
                        ([key, value], index, arr) => {
                          const prevOffset = arr
                            .slice(0, index)
                            .reduce((sum, [, v]) => sum + v.percentage, 0);
                          const colors = ['#2D5A4A', '#3D7A6A', '#4D9A8A', '#5DBAAA'];
                          return (
                            <circle
                              key={key}
                              cx="50"
                              cy="50"
                              r="40"
                              fill="none"
                              stroke={colors[index]}
                              strokeWidth="20"
                              strokeDasharray={`${value.percentage * 2.51} ${251 - value.percentage * 2.51}`}
                              strokeDashoffset={-prevOffset * 2.51}
                              className="hover:opacity-80 transition-opacity cursor-pointer"
                            />
                          );
                        }
                      )}
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-[hsl(160,45%,28%)]">
                          ¥{displayedItinerary.totalBudget.toLocaleString()}
                        </div>
                        <div className="text-xs text-[hsl(160,15%,45%)]">总预算</div>
                      </div>
                    </div>
                  </div>

                  {/* 图例 */}
                  <div className="space-y-4">
                    {budgetBreakdownEntries.map(([key, value], index) => {
                      const labels: Record<string, string> = {
                        transport: '交通',
                        accommodation: '住宿',
                        food: '餐饮',
                        activities: '门票/活动',
                      };
                      const colors = ['bg-[#2D5A4A]', 'bg-[#3D7A6A]', 'bg-[#4D9A8A]', 'bg-[#5DBAAA]'];
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[hsl(150,20%,97%)]">
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full ${colors[index]}`} />
                            <span className="text-sm font-medium text-[hsl(160,25%,15%)]">{labels[key]}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-[hsl(160,25%,15%)]">
                              ¥{value.amount.toLocaleString()}
                            </div>
                            <div className="text-xs text-[hsl(160,15%,45%)]">{value.percentage}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="tips">
              <div className="p-6 rounded-2xl bg-white shadow-soft">
                <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[hsl(160,45%,28%)]" />
                  旅行小贴士
                </h3>
                <ul className="space-y-3">
                  {displayedItinerary.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-[hsl(160,25%,15%)]">{tip}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 p-4 rounded-xl bg-[hsl(150,20%,97%)]">
                  <h4 className="font-medium text-[hsl(160,25%,15%)] mb-2">住宿建议</h4>
                  <p className="text-sm text-[hsl(160,15%,45%)]">{displayedItinerary.accommodation}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-nature pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(180,40%,90%)] mb-4">
            <MapPin className="w-4 h-4 text-[hsl(180,40%,45%)]" />
            <span className="text-sm font-medium text-[hsl(180,40%,45%)]">行程规划</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[hsl(160,25%,15%)] mb-3">
            想去哪里旅行？
          </h1>
          <p className="text-lg text-[hsl(160,15%,45%)]">
            输入目的地，AI为你生成详细行程
          </p>
        </div>

        {/* 搜索框 */}
        <div className="relative mb-8">
          <div className="flex items-center gap-4 p-2 rounded-2xl bg-white shadow-soft">
            <div className="flex-1 flex items-center gap-3 px-4">
              <MapPin className="w-5 h-5 text-[hsl(160,15%,45%)]" />
              <input
                type="text"
                placeholder="输入目的地，如：大理、丽江、三亚..."
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 py-3 outline-none text-[hsl(160,25%,15%)] placeholder:text-[hsl(160,15%,45%)]"
              />
            </div>
            <Button
              onClick={handleSearch}
              className="btn-primary px-6"
            >
              <Search className="w-5 h-5 mr-2" />
              生成路线
            </Button>
          </div>
        </div>

        {/* 热门目的地 */}
        <div>
          <p className="text-sm text-[hsl(160,15%,45%)] mb-4">热门目的地</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['大理', '丽江', '三亚', '西双版纳', '厦门', '成都', '西安', '重庆'].map((city) => (
              <button
                key={city}
                onClick={() => setDestination(city)}
                className="px-4 py-2 rounded-xl bg-white text-[hsl(160,25%,15%)] shadow-sm hover:shadow-md transition-shadow"
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        {/* 特色功能 */}
        <div className="mt-16 grid sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-[hsl(160,25%,15%)] mb-2">当地人视角</h3>
            <p className="text-sm text-[hsl(160,15%,45%)]">发现游客不知道的小众玩法</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-[hsl(160,25%,15%)] mb-2">时间魔法</h3>
            <p className="text-sm text-[hsl(160,15%,45%)]">3小时也能玩出精华</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/60 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
              <PieChart className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="font-semibold text-[hsl(160,25%,15%)] mb-2">预算可视化</h3>
            <p className="text-sm text-[hsl(160,15%,45%)]">清晰了解每一笔花费</p>
          </div>
        </div>
      </div>
    </div>
  );
}
