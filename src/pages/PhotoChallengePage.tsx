import { useState } from 'react';
import { Camera, ArrowLeft, Upload, Lightbulb, Download, Share2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PhotoChallengePageProps {
  onPageChange: (page: string) => void;
}

const challenges = [
  {
    location: '西湖',
    task: '拍出"断桥残雪"的意境',
    difficulty: 'medium' as const,
    example: '利用晨雾营造朦胧感',
  },
  {
    location: '重庆洪崖洞',
    task: '拍出赛博朋克风格的夜景',
    difficulty: 'hard' as const,
    example: '蓝紫色调，霓虹灯光',
  },
  {
    location: '大理古城',
    task: '捕捉"岁月静好"的瞬间',
    difficulty: 'easy' as const,
    example: '老人在门前晒太阳',
  },
  {
    location: '上海外滩',
    task: '用倒影拍出对称构图',
    difficulty: 'medium' as const,
    example: '雨后地面的建筑倒影',
  },
];

const getDifficultyLabel = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return '简单';
    case 'medium': return '中等';
    case 'hard': return '困难';
    default: return '中等';
  }
};

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'easy': return 'bg-emerald-100 text-emerald-600';
    case 'medium': return 'bg-amber-100 text-amber-600';
    case 'hard': return 'bg-rose-100 text-rose-600';
    default: return 'bg-amber-100 text-amber-600';
  }
};

export function PhotoChallengePage({ onPageChange }: PhotoChallengePageProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<typeof challenges[0] | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [challengePlan, setChallengePlan] = useState<{
    missions: Array<{
      title: string;
      task: string;
      example: string;
      whenToShoot: string;
      routeSuggestion: string;
    }>;
    route?: {
      order?: string;
      places: string[];
    };
    weatherUsed?: string;
    crowdUsed?: string;
  } | null>(null);

  const handleUpload = () => {
    // 模拟上传（目前摄影页只用于“交互演示”，不参与后端 AI 打分）
    setUploadedPhoto('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80');
  };

  const handleSubmit = async () => {
    if (!selectedChallenge) return;
    setPlanLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
      const resp = await fetch(`${baseUrl}/api/photochallenge/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationChoice: selectedChallenge.location,
          challengeTask: selectedChallenge.task,
          // 上传图片不再参与后端 AI 评分，因此不传 uploadedPhoto
          travelDate: new Date().toISOString().slice(0, 10),
        }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      setChallengePlan(json?.data?.challengePlan ?? null);
    } catch {
      setChallengePlan(null);
    } finally {
      setPlanLoading(false);
    }
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
            <h1 className="text-2xl font-bold text-[hsl(160,25%,15%)]">摄影挑战</h1>
            <p className="text-sm text-[hsl(160,15%,45%)]">AI生成你的拍摄任务与路线建议</p>
          </div>
        </div>

        {!selectedChallenge ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.location}
                onClick={() => setSelectedChallenge(challenge)}
                className="p-5 rounded-2xl bg-white shadow-soft hover:shadow-float transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[hsl(160,25%,15%)]">{challenge.location}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(challenge.difficulty)}`}>
                    {getDifficultyLabel(challenge.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-[hsl(160,15%,45%)] mb-3">{challenge.task}</p>
                <div className="flex items-center gap-2 text-xs text-cyan-600">
                  <Lightbulb className="w-4 h-4" />
                  <span>提示：{challenge.example}</span>
                </div>
              </div>
            ))}
          </div>
        ) : !challengePlan ? (
          <div className="space-y-6 animate-slide-up">
            {/* 挑战信息 */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5 text-cyan-600" />
                <span className="font-semibold text-cyan-800">当前挑战</span>
              </div>
              <h2 className="text-xl font-bold text-cyan-900 mb-2">{selectedChallenge.location}</h2>
              <p className="text-cyan-700">{selectedChallenge.task}</p>
            </div>

            {/* 上传区域 */}
            <div className="p-8 rounded-2xl bg-white shadow-soft">
              {!uploadedPhoto ? (
                <div
                  onClick={handleUpload}
                  className="border-2 border-dashed border-[hsl(150,15%,88%)] rounded-xl p-12 text-center cursor-pointer hover:border-[hsl(160,45%,28%)] transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-4 text-[hsl(160,15%,45%)]" />
                  <p className="text-[hsl(160,25%,15%)] font-medium mb-2">点击上传照片</p>
                  <p className="text-sm text-[hsl(160,15%,45%)]">支持 JPG、PNG 格式</p>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={uploadedPhoto}
                    alt="Uploaded"
                    className="w-full rounded-xl"
                  />
                  <button
                    onClick={() => setUploadedPhoto(null)}
                    className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 text-white text-sm"
                  >
                    重新上传
                  </button>
                </div>
              )}
            </div>

            {/* 提交按钮 */}
            <Button
              onClick={handleSubmit}
              disabled={planLoading}
              className="w-full btn-primary py-4 text-lg disabled:opacity-60"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              生成拍摄任务
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* 任务结果 */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,35%)] text-white">
              <h2 className="text-2xl font-bold mb-2">AI 拍摄任务</h2>
              <div className="text-white/80 mb-6">
                为你生成 missions（不包含任何 AI 图像评分/打分）
              </div>

              {challengePlan?.weatherUsed || challengePlan?.crowdUsed ? (
                <div className="text-sm text-white/80 mb-4">
                  {challengePlan.weatherUsed ? `天气：${challengePlan.weatherUsed}` : null}
                  {challengePlan.weatherUsed && challengePlan.crowdUsed ? " · " : null}
                  {challengePlan.crowdUsed ? `人流策略：${challengePlan.crowdUsed}` : null}
                </div>
              ) : null}

              <div className="space-y-3 text-left mt-4">
                {challengePlan?.missions.map((m, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/10">
                    <div className="font-semibold mb-1">
                      {idx + 1}. {m.title}
                    </div>
                    <div className="text-white/80 text-sm mb-2">{m.task}</div>
                    <div className="text-xs text-white/80">
                      <span className="font-medium">时机：</span>
                      {m.whenToShoot}
                    </div>
                    <div className="text-xs text-white/80">
                      <span className="font-medium">路线建议：</span>
                      {m.routeSuggestion}
                    </div>
                    <div className="text-xs text-white/80 mt-1">
                      <span className="font-medium">示例：</span>
                      {m.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 路线建议 */}
            {challengePlan?.route?.places?.length ? (
              <div className="p-6 rounded-2xl bg-white shadow-soft">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-[hsl(160,45%,28%)]" />
                  <h3 className="font-semibold text-[hsl(160,25%,15%)]">路线建议</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {challengePlan.route.places.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[hsl(150,20%,97%)] text-[hsl(160,25%,15%)]"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setSelectedChallenge(null);
                  setUploadedPhoto(null);
                  setChallengePlan(null);
                }}
                className="btn-primary flex-1"
              >
                继续挑战
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Download className="w-5 h-5 mr-2" />
                保存
              </Button>
              <Button variant="outline" className="btn-secondary">
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
