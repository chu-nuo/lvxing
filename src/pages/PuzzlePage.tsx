import { useState } from 'react';
import { ArrowLeft, MapPin, Share2, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChinaMap } from '@/components/ChinaMap';

interface PuzzlePageProps {
  onPageChange: (page: string) => void;
}

const regions = [
  { id: 'jiangnan', name: '江南水乡', cities: ['苏州', '杭州', '乌镇', '周庄'], unlocked: true, progress: 3, total: 4, color: 'from-blue-400 to-cyan-500', provinces: ['zhejiang', 'shanghai', 'jiangsu', 'anhui'] },
  { id: 'southwest', name: '西南秘境', cities: ['丽江', '大理', '香格里拉', '西双版纳'], unlocked: true, progress: 2, total: 4, color: 'from-emerald-400 to-teal-500', provinces: ['yunnan', 'guizhou', 'sichuan', 'xizang'] },
  { id: 'northwest', name: '西北风光', cities: ['敦煌', '张掖', '青海湖', '嘉峪关'], unlocked: false, progress: 0, total: 4, color: 'from-amber-400 to-orange-500', provinces: ['gansu', 'qinghai', 'xinjiang', 'ningxia'] },
  { id: 'northeast', name: '东北雪原', cities: ['哈尔滨', '长白山', '雪乡', '大连'], unlocked: false, progress: 0, total: 4, color: 'from-indigo-400 to-purple-500', provinces: ['heilongjiang', 'jilin', 'liaoning'] },
  { id: 'central', name: '中原古韵', cities: ['西安', '洛阳', '开封', '郑州'], unlocked: true, progress: 1, total: 4, color: 'from-rose-400 to-pink-500', provinces: ['shaanxi', 'shanxi', 'henan', 'hubei'] },
  { id: 'coastal', name: '沿海风情', cities: ['厦门', '青岛', '三亚', '大连'], unlocked: false, progress: 0, total: 4, color: 'from-sky-400 to-blue-500', provinces: ['fujian', 'shandong', 'guangdong', 'hainan'] },
];

// 省份ID到中文名称的映射
const PROVINCE_NAME_MAP: Record<string, string> = {
  zhejiang: '浙江', shanghai: '上海', jiangsu: '江苏', anhui: '安徽',
  yunnan: '云南', guizhou: '贵州', sichuan: '四川', xizang: '西藏',
  gansu: '甘肃', qinghai: '青海', xinjiang: '新疆', ningxia: '宁夏',
  heilongjiang: '黑龙江', jilin: '吉林', liaoning: '辽宁',
  shaanxi: '陕西', shanxi: '山西', henan: '河南', hubei: '湖北',
  fujian: '福建', shandong: '山东', guangdong: '广东', hainan: '海南',
  hunan: '湖南', guangxi: '广西', chongqing: '重庆', beijing: '北京',
  tianjin: '天津', hebei: '河北', jiangxi: '江西', neimenggu: '内蒙古',
  xianggang: '香港', aomen: '澳门', taiwan: '台湾'
};

// 所有省份集合（初始全部锁定）
const ALL_PROVINCES = regions.flatMap(r => r.provinces);
const initialUnlocked = new Set<string>();
ALL_PROVINCES.forEach(p => initialUnlocked.add(p));
// 演示：默认解锁部分省份
const demoUnlocked = new Set(['zhejiang', 'shanghai', 'jiangsu', 'anhui', 'yunnan', 'guizhou', 'sichuan', 'xizang', 'shaanxi', 'shanxi', 'henan', 'hubei']);

export function PuzzlePage({ onPageChange }: PuzzlePageProps) {
  const [selectedRegion, setSelectedRegion] = useState<typeof regions[0] | null>(null);
  const [unlockedProvinces, setUnlockedProvinces] = useState<Set<string>>(demoUnlocked);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);


  const handleProvinceClick = (provinceId: string) => {
    setSelectedProvince(prev => prev === provinceId ? null : provinceId);
    // 切换省份点亮状态（演示用）
    setUnlockedProvinces(prev => {
      const next = new Set(prev);
      if (next.has(provinceId)) {
        next.delete(provinceId);
      } else {
        next.add(provinceId);
      }
      return next;
    });
    // 双根据联动：点击省份自动选中对应区域
    const region = regions.find(r => r.provinces.includes(provinceId));
    if (region) {
      setSelectedRegion(region);
    }
  };

  const handleRegionClick = (region: typeof regions[0]) => {
    setSelectedRegion(region);
    // 双向联动：点击区域高亮其所有省份
    setSelectedProvince(region.provinces[0] ?? null);
  };

  return (
    <div className="min-h-screen bg-gradient-nature pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => onPageChange('games')} className="p-2 rounded-xl hover:bg-white/50 transition-colors">
            <ArrowLeft className="w-6 h-6 text-[hsl(160,25%,15%)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">足迹拼图</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">点亮中国地图，记录你的旅行足迹</p>
          </div>
        </div>

        {/* 总进度 */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-1">探索进度</h2>
              <p className="text-white/80 text-sm">已解锁 {unlockedProvinces.size}/{ALL_PROVINCES.length} 个省份</p>
            </div>
            <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round((unlockedProvinces.size / ALL_PROVINCES.length) * 100)}%</div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-white/20 overflow-hidden">
            <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${(unlockedProvinces.size / ALL_PROVINCES.length) * 100}%` }} />
          </div>
        </div>

        {/* 中国地图区域 */}
        <div className="mb-8 p-6 rounded-2xl bg-white shadow-soft">
          <h3 className="text-lg font-semibold text-[hsl(160,25%,15%)] mb-4 text-center">点击省份点亮</h3>
          <ChinaMap unlockedProvinces={unlockedProvinces} onProvinceClick={handleProvinceClick} selectedProvince={selectedProvince} />
        </div>

        {/* 区域网格 */}
        {!selectedRegion ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {regions.map((region) => (
              <div
                key={region.id}
                onClick={() => handleRegionClick(region)}
                className={`p-5 rounded-2xl bg-white shadow-soft transition-all ${region.unlocked ? 'hover:shadow-float cursor-pointer' : 'opacity-60'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${region.color} flex items-center justify-center`}>
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  {region.unlocked ? <Unlock className="w-5 h-5 text-emerald-500" /> : <Lock className="w-5 h-5 text-[hsl(160,15%,45%)]" />}
                </div>
                <h3 className="font-semibold text-[hsl(160,25%,15%)] mb-2">{region.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-2 rounded-full bg-[hsl(150,20%,94%)] overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${region.color}`} style={{ width: `${(region.progress / region.total) * 100}%` }} />
                  </div>
                  <span className="text-sm text-[hsl(160,15%,45%)]">{region.progress}/{region.total}</span>
                </div>
                <p className="text-xs text-[hsl(160,15%,45%)]">{region.cities.join('、')}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mb-8 p-6 rounded-2xl bg-white shadow-soft animate-slide-up">
            <div className="flex items-center gap-4 mb-6">
              <button onClick={() => setSelectedRegion(null)} className="p-2 rounded-xl hover:bg-[hsl(150,20%,94%)] transition-colors">
                <ArrowLeft className="w-5 h-5 text-[hsl(160,25%,15%)]" />
              </button>
              <div>
                <h2 className="text-xl font-bold text-[hsl(160,25%,15%)]">{selectedRegion.name}</h2>
                <p className="text-sm text-[hsl(160,15%,45%)]">点击省份切换点亮状态</p>
              </div>
            </div>
            {/* 省份列表 - 可点击切换点亮 */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {selectedRegion.provinces.map((provinceId) => {
                const isUnlocked = unlockedProvinces.has(provinceId);
                // 从映射表获取中文省份名称
                const provinceName = PROVINCE_NAME_MAP[provinceId] || provinceId;
                return (
                  <button
                    key={provinceId}
                    onClick={() => handleProvinceClick(provinceId)}
                    className={`p-4 rounded-xl text-center transition-all duration-200 ${
                      isUnlocked 
                        ? `bg-gradient-to-br ${selectedRegion.color} text-white shadow-md` 
                        : 'bg-[hsl(150,20%,97%)] text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,94%)]'
                    }`}
                  >
                    {isUnlocked ? <Unlock className="w-5 h-5 mx-auto mb-2" /> : <Lock className="w-5 h-5 mx-auto mb-2" />}
                    <span className="font-medium text-sm">{provinceName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
