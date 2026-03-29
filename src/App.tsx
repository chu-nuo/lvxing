import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { HomePage } from '@/pages/HomePage';
import { RecommendPage } from '@/pages/RecommendPage';
import { PlannerPage } from '@/pages/PlannerPage';
import { GamesPage } from '@/pages/GamesPage';
import { ColorWalkPage } from '@/pages/ColorWalkPage';
import { BlindBoxPage } from '@/pages/BlindBoxPage';
import { DicePage } from '@/pages/DicePage';
import { PhotoChallengePage } from '@/pages/PhotoChallengePage';
import { PuzzlePage } from '@/pages/PuzzlePage';
import { ReversePage } from '@/pages/ReversePage';
import { FavoritesPage } from '@/pages/FavoritesPage';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'recommend':
        return <RecommendPage onPageChange={setCurrentPage} />;
      case 'planner':
        return <PlannerPage onPageChange={setCurrentPage} />;
      case 'games':
        return <GamesPage onPageChange={setCurrentPage} />;
      case 'color-walk':
        return <ColorWalkPage onPageChange={setCurrentPage} />;
      case 'blind-box':
        return <BlindBoxPage onPageChange={setCurrentPage} />;
      case 'dice':
        return <DicePage onPageChange={setCurrentPage} />;
      case 'photo-challenge':
        return <PhotoChallengePage onPageChange={setCurrentPage} />;
      case 'puzzle':
        return <PuzzlePage onPageChange={setCurrentPage} />;
      case 'reverse':
        return <ReversePage onPageChange={setCurrentPage} />;
      case 'favorites':
        return <FavoritesPage onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(150,20%,97%)]">
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="pt-0">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  );
}
