import { useState, useEffect } from 'react';
import { Settings, Eye, EyeOff, Key, ExternalLink, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';

const STORAGE_KEY = 'deepseek-api-key';

export function getStoredApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}

export function setStoredApiKey(apiKey: string): void {
  localStorage.setItem(STORAGE_KEY, apiKey);
}

export function removeStoredApiKey(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function hasApiKey(): boolean {
  const key = getStoredApiKey();
  return !!key && key.trim().length > 0;
}

interface SettingsPanelProps {
  trigger?: React.ReactNode;
}

export function SettingsPanel({ trigger }: SettingsPanelProps) {
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredApiKey();
    if (stored) {
      setApiKey(stored);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      setStoredApiKey(apiKey.trim());
      toast.success('API Key 已保存', {
        description: '您的 DeepSeek API Key 已成功保存到本地浏览器',
        icon: <Check className="w-4 h-4" />,
      });
      setOpen(false);
    } else {
      removeStoredApiKey();
      toast.success('API Key 已清除', {
        description: '已移除本地保存的 API Key',
      });
    }
  };

  const handleClear = () => {
    setApiKey('');
    removeStoredApiKey();
    toast.success('API Key 已清除', {
      description: '已移除本地保存的 API Key',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="icon" className="relative">
            <Settings className="w-5 h-5" />
            {!hasApiKey() && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
            )}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[hsl(160,45%,28%)]" />
            设置
          </DialogTitle>
          <DialogDescription>
            配置您的 AI 服务设置
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* API Key 设置 */}
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-amber-800">
                  为什么需要 API Key？
                </p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  AI 旅行功能需要调用 DeepSeek 的大语言模型服务。API Key 仅保存在您的浏览器本地，用于向 DeepSeek 发送请求。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[hsl(160,25%,15%)]">
                <Key className="w-4 h-4 text-[hsl(160,45%,28%)]" />
                DeepSeek API Key
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                您的 API Key 仅保存在本地浏览器中，不会发送到任何第三方服务器。
              </p>
            </div>

            <div className="flex items-center justify-between">
              <a
                href="https://platform.deepseek.com/api_keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[hsl(160,45%,28%)] hover:underline"
              >
                获取 API Key
                <ExternalLink className="w-3 h-3" />
              </a>
              {apiKey && (
                <Button variant="ghost" size="sm" onClick={handleClear} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  清除
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button onClick={handleSave} className="btn-primary">
            保存设置
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsPanel;
