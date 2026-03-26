import { useState, useEffect } from 'react';
import { MapPin, Compass, Palette, ArrowLeftRight, Menu, X, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { useAuth } from '@/hooks/useAuth';

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Navbar({ currentPage, onPageChange }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: '首页', icon: MapPin },
    { id: 'recommend', label: 'AI推荐', icon: Compass },
    { id: 'planner', label: '行程规划', icon: MapPin },
    { id: 'games', label: '玩乐旅行', icon: Palette },
    { id: 'reverse', label: '反向旅行', icon: ArrowLeftRight },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'glass shadow-soft py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[hsl(160,45%,28%)] to-[hsl(180,40%,45%)] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[hsl(160,25%,15%)]">
              Travel<span className="text-gradient">AI</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id || 
                (item.id === 'games' && ['color-walk', 'blind-box', 'dice', 'photo-challenge', 'puzzle'].includes(currentPage));
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-[hsl(160,45%,28%)] text-white shadow-lg'
                      : 'text-[hsl(160,15%,45%)] hover:text-[hsl(160,25%,15%)] hover:bg-[hsl(150,20%,94%)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* CTA Button & Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => onPageChange('favorites')}
              >
                <Heart className="w-5 h-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsAuthOpen(true)}
            >
              <User className="w-5 h-5" />
            </Button>
            
            <Button
              onClick={() => onPageChange('recommend')}
              className="btn-primary"
            >
              开始探索
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-[hsl(150,20%,94%)] transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[hsl(160,25%,15%)]" />
            ) : (
              <Menu className="w-6 h-6 text-[hsl(160,25%,15%)]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-[hsl(150,15%,88%)] animate-slide-up">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                      isActive
                        ? 'bg-[hsl(160,45%,28%)] text-white'
                        : 'text-[hsl(160,15%,45%)] hover:bg-[hsl(150,20%,94%)]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                );
              })}
              <Button
                onClick={() => {
                  onPageChange('recommend');
                  setIsMobileMenuOpen(false);
                }}
                className="btn-primary mt-2"
              >
                开始探索
              </Button>
              
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[hsl(150,15%,88%)]">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    setIsAuthOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  {user ? '用户中心' : '登录'}
                </Button>
                {user && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      onPageChange('favorites');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    收藏
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onAuthChange={() => window.location.reload()}
      />
    </nav>
  );
}
