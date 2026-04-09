
interface ChinaMapProps {
  unlockedProvinces: Set<string>;
  onProvinceClick: (province: string) => void;
  selectedProvince: string | null;
}

const provinces: { id: string; name: string; path: string }[] = [
  // 东北
  { id: 'heilongjiang', name: '黑龙江', path: 'M580,80 L620,60 L680,80 L700,120 L720,180 L680,200 L620,190 L580,160 Z' },
  { id: 'jilin', name: '吉林', path: 'M620,190 L680,200 L700,220 L680,260 L620,250 L600,220 Z' },
  { id: 'liaoning', name: '辽宁', path: 'M600,260 L680,260 L700,280 L720,320 L660,340 L600,300 Z' },
  // 华北
  { id: 'neimenggu', name: '内蒙古', path: 'M420,100 L580,80 L580,160 L620,190 L600,220 L520,200 L420,220 L340,180 L320,140 Z' },
  { id: 'hebei', name: '河北', path: 'M520,200 L600,220 L620,250 L600,300 L560,320 L520,300 L500,260 Z' },
  { id: 'beijing', name: '北京', path: 'M560,265 L580,260 L585,275 L575,280 Z' },
  { id: 'tianjin', name: '天津', path: 'M580,275 L600,270 L605,285 L590,290 Z' },
  { id: 'shanxi', name: '山西', path: 'M460,220 L520,200 L540,260 L520,300 L480,290 L460,260 Z' },
  { id: 'shandong', name: '山东', path: 'M560,300 L600,300 L620,340 L600,380 L560,370 L540,340 Z' },
  // 西北
  { id: 'shaanxi', name: '陕西', path: 'M420,220 L460,200 L480,260 L460,300 L420,290 L400,260 Z' },
  { id: 'gansu', name: '甘肃', path: 'M240,160 L340,140 L420,220 L400,260 L340,260 L280,240 L220,200 Z' },
  { id: 'qinghai', name: '青海', path: 'M200,220 L280,200 L340,260 L320,320 L240,320 L180,280 Z' },
  { id: 'ningxia', name: '宁夏', path: 'M400,260 L420,255 L425,270 L410,280 L395,270 Z' },
  { id: 'xinjiang', name: '新疆', path: 'M60,80 L220,40 L280,120 L260,200 L180,220 L100,180 L40,120 Z' },
  // 华东
  { id: 'jiangsu', name: '江苏', path: 'M560,340 L600,330 L610,360 L580,380 L550,370 Z' },
  { id: 'anhui', name: '安徽', path: 'M520,340 L560,330 L560,370 L530,380 L510,360 Z' },
  { id: 'zhejiang', name: '浙江', path: 'M560,370 L590,365 L600,400 L570,420 L545,400 Z' },
  { id: 'jiangxi', name: '江西', path: 'M480,400 L530,380 L540,420 L500,440 L470,420 Z' },
  { id: 'fujian', name: '福建', path: 'M530,400 L570,395 L580,450 L540,460 L520,430 Z' },
  { id: 'shanghai', name: '上海', path: 'M580,375 L600,370 L605,385 L590,390 Z' },
  // 华中
  { id: 'henan', name: '河南', path: 'M480,280 L520,260 L540,300 L530,340 L490,340 L470,310 Z' },
  { id: 'hubei', name: '湖北', path: 'M420,300 L480,290 L490,340 L460,380 L410,370 L400,330 Z' },
  { id: 'hunan', name: '湖南', path: 'M400,370 L460,350 L470,400 L440,430 L390,420 L380,390 Z' },
  // 华南
  { id: 'guangdong', name: '广东', path: 'M420,430 L470,420 L500,460 L480,500 L420,500 L400,470 Z' },
  { id: 'guangxi', name: '广西', path: 'M340,430 L400,420 L420,480 L380,520 L320,500 L300,460 Z' },
  { id: 'hainan', name: '海南', path: 'M400,520 L430,515 L440,545 L415,555 L390,540 Z' },
  // 西南
  { id: 'sichuan', name: '四川', path: 'M240,260 L340,240 L380,320 L360,380 L280,380 L220,340 L200,300 Z' },
  { id: 'yunnan', name: '云南', path: 'M280,400 L340,380 L380,440 L340,500 L280,490 L240,450 Z' },
  { id: 'guizhou', name: '贵州', path: 'M340,400 L390,385 L400,430 L360,450 L320,440 Z' },
  { id: 'xizang', name: '西藏', path: 'M80,200 L180,180 L200,280 L180,360 L100,360 L40,300 L20,240 Z' },
  { id: 'chongqing', name: '重庆', path: 'M380,330 L420,315 L430,355 L405,370 L375,355 Z' },
  // 港澳台
  { id: 'xianggang', name: '香港', path: 'M490,475 L500,472 L505,482 L495,487 Z' },
  { id: 'aomen', name: '澳门', path: 'M450,480 L458,477 L462,485 L454,488 Z' },
  { id: 'taiwan', name: '台湾', path: 'M580,420 L620,410 L630,470 L600,490 L570,470 Z' },
];

export function ChinaMap({ unlockedProvinces, onProvinceClick, selectedProvince }: ChinaMapProps) {
  return (
    <div className="w-full">
      <svg viewBox="0 0 800 600" className="w-full h-auto" style={{ maxHeight: '400px' }}>
        {provinces.map(prov => {
          const isUnlocked = unlockedProvinces.has(prov.id);
          const isSelected = selectedProvince === prov.id;
          return (
            <g key={prov.id} onClick={() => onProvinceClick(prov.id)} className="cursor-pointer">
              <path
                d={prov.path}
                fill={isUnlocked ? '#10b981' : isSelected ? '#6ee7b7' : '#d1d5db'}
                stroke={isSelected ? '#059669' : '#fff'}
                strokeWidth={isSelected ? 2 : 1}
                opacity={isUnlocked ? 1 : 0.4}
                className="transition-all duration-300 hover:opacity-80"
              />
            </g>
          );
        })}
      </svg>
      {/* 图例 */}
      <div className="flex items-center gap-4 mt-2 text-xs text-[hsl(160,15%,45%)]">
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 rounded" style={{ background: '#10b981' }} />
          <span>已点亮</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-3 rounded bg-gray-300" />
          <span>未解锁</span>
        </div>
      </div>
    </div>
  );
}
