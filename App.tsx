import React, { useState } from 'react';
import { Page, CocktailData } from './types';
import { Home } from './components/Home';
import { AiWhisper } from './components/AiWhisper';
import { ManualWorkbench } from './components/ManualWorkbench';
import { MoodElixir } from './components/MoodElixir';
import { Cellar } from './components/Cellar';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.HOME);
  const [currentCocktail, setCurrentCocktail] = useState<CocktailData | null>(null);
  const [history, setHistory] = useState<CocktailData[]>([]);

  const handleSetGeneratedCocktail = (cocktail: CocktailData) => {
    setCurrentCocktail(cocktail);
    setHistory(prev => [...prev, cocktail]);
  };

  const markConsumed = (id: string) => {
    setHistory(prev => prev.map(c => c.id === id ? { ...c, isConsumed: true } : c));
    if (currentCocktail && currentCocktail.id === id) {
        setCurrentCocktail({ ...currentCocktail, isConsumed: true });
    }
  };

  const loadFromCellar = (cocktail: CocktailData) => {
    setCurrentCocktail(cocktail);
    setCurrentPage(Page.MOOD_ELIXIR);
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.HOME:
        return <Home setPage={setCurrentPage} />;
      case Page.AI_WHISPER:
        return <AiWhisper setPage={setCurrentPage} setGeneratedCocktail={handleSetGeneratedCocktail} />;
      case Page.MANUAL_WORKBENCH:
        return <ManualWorkbench setPage={setCurrentPage} setGeneratedCocktail={handleSetGeneratedCocktail} />;
      case Page.MOOD_ELIXIR:
        return currentCocktail ? (
            <MoodElixir 
                data={currentCocktail} 
                setPage={setCurrentPage} 
                markConsumed={markConsumed}
            />
        ) : <Home setPage={setCurrentPage} />;
      case Page.CELLAR:
        return (
            <Cellar 
                history={history} 
                setPage={setCurrentPage} 
                loadCocktail={loadFromCellar} 
            />
        );
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-soul-dark text-soul-paper font-sans overflow-hidden selection:bg-soul-gold selection:text-soul-dark">
      {/* Global Grain Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/noise.png')]"></div>
      
      {/* Page Content with Fade Transition key */}
      <div key={currentPage} className="w-full h-full animate-fade-in">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;