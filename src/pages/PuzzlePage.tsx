import { useState } from 'react';
import { ArrowLeft, MapPin, Trophy, Share2, Lock, Unlock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PuzzlePageProps {
  onPageChange: (page: string) => void;
}

const regions = [
  {
    id: 'jiangnan',
    name: '江南水乡',
    cities: ['苏州', '杭州', '乌镇', '周庄'],
    unlocked: true,
    progress: 3,
    total: 4,
    color: 'from-blue-400 to-cyan-500',
  },
  {
    id: 'southwest',
    name: '西南秘境',
    cities: ['丽江', '大理', '香格里拉', '西双版纳'],
    unlocked: true,
    progress: 2,
    total: 4,
    color: 'from-emerald-400 to-teal-500',
  },
  {
    id: 'northwest',
    name: '西北风光',
    cities: ['敦煌', '张掖', '青海湖', '嘉峪关'],
    unlocked: false,
    progress: 0,
    total: 4,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'northeast',
    name: '东北雪原',
    cities: ['哈尔滨', '长白山', '雪乡', '大连'],
    unlocked: false,
    progress: 0,
    total: 4,
    color: 'from-indigo-400 to-purple-500',
  },
  {
    id: 'central',
    name: '中原古韵',
    cities: ['西安', '洛阳', '开封', '郑州'],
    unlocked: true,
    progress: 1,
    total: 4,
    color: 'from-rose-400 to-pink-500',
  },
  {
    id: 'coastal',
    name: '沿海风情',
    cities: ['厦门', '青岛', '三亚', '大连'],
    unlocked: false,
    progress: 0,
    total: 4,
    color: 'from-sky-400 to-blue-500',
  },
];

const badges = [
  { id: 'explorer', name: '初探者', desc: '解锁第一个区域', unlocked: true },
  { id: 'wanderer', name: '漫游者', desc: '解锁3个区域', unlocked: true },
  { id: 'adventurer', name: '冒险家', desc: '解锁5个区域', unlocked: false },
  { id: 'master', name: '中国通', desc: '解锁所有区域', unlocked: false },
];

export function PuzzlePage({ onPageChange }: PuzzlePageProps) {
  const [selectedRegion, setSelectedRegion] = useState<typeof regions[0] | null>(null);

  const totalProgress = regions.reduce((acc, r) => acc + r.progress, 0);
  const totalCities = regions.reduce((acc, r) => acc + r.total, 0);

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
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">足迹拼图</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">解锁中国地图，收集区域徽章</p>
          </div>
        </div>

        {/* 总进度 */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">探索进度</h2>
              <p className="text-white/80 text-sm">
                已解锁 {totalProgress}/{totalCities} 个城市
              </p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round((totalProgress / totalCities) * 100)}%</div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{ width: `${(totalProgress / totalCities) * 100}%` }}
            />
          </div>
        </div>

        {/* 区域网格 */}
        {!selectedRegion ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => region.unlocked && setSelectedRegion(region)}
                className={`p-5 rounded-2xl bg-white shadow-soft transition-all ${
                  region.unlocked
                    ? 'hover:shadow-float cursor-pointer'
                    : 'opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  {region.unlocked ? (
                    <Unlock className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Lock className="w-5 h-5 text-[hsl(160,15%,45%)]" />
                  )}
                </div>
                
                <h3 className="font-semibold text-[hsl(160,25%,15%)] mb-2">{region.name}</h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-[hsl(150,20%,94%)] overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${region.color}`}
                      style={{ width: `${(region.progress / region.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-[hsl(160,15%,45%)]">
                    {region.progress}/{region.total}
                  </span>
                </div>
                
                <p className="text-xs text-[hsl(160,15%,45%)]">
                  {region.cities.join('、')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-2xl bg-white shadow-soft animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setSelectedRegion(null)}
                className="p-2 rounded-xl hover:bg-[hsl(150,20%,94%)] transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-[hsl(160,25%,15%)]" />
              </button>
              <h2 className="text-xl font-bold text-[hsl(160,25%,15%)]">{selectedRegion.name}</h2>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {selectedRegion.cities.map((city, index) => (
                <div
                  key={city}
                  className={`p-4 rounded-xl text-center ${
                    index < selectedRegion.progress
                      ? 'bg-gradient-to-br ' + selectedRegion.color + ' text-white'
                      : 'bg-[hsl(150,20%,97%)] text-[hsl(160,15%,45%)]'
                  }`}
                >
                  {index < selectedRegion.progress ? (
                    <Star className="w-5 h-5 mx-auto mb-2" />
                  ) : (
                    <Lock className="w-5 h-5 mx-auto mb-2" />
                  )}
                  <span className="font-medium">{city}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 徽章墙 */}
        <div className="p-6 rounded-2xl bg-white shadow-soft">
          <div className="flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-[hsl(160,45%,28%)]" />
            <h3 className="font-semibold text-[hsl(160,25%,15%)]">徽章墙</h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl text-center ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-100 to-yellow-100 border border-amber-200'
                    : 'bg-[hsl(150,20%,97%)]'
                }`}
              >
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-amber-400 to-yellow-500'
                    : 'bg-[hsl(150,20%,90%)]'
                }`}>
                  <Trophy className={`w-6 h-6 ${badge.unlocked ? 'text-white' : 'text-[hsl(160,15%,45%)]'}`} />
                </div>
                <h4 className={`font-semibold mb-1 ${badge.unlocked ? 'text-amber-800' : 'text-[hsl(160,15%,45%)]'}`}>
                  {badge.name}
                </h4>
                <p className="text-xs text-[hsl(160,15%,45%)]">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 分享按钮 */}
        <div className="mt-8 text-center">
          <Button variant="outline" className="btn-secondary">
            <Share2 className="w-5 h-5 mr-2" />
            分享我的足迹
          </Button>
        </div>
      </div>
    </div>
  );
}
