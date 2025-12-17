import React, { useState, useRef } from 'react';
import { Page, CocktailData, ManualDraft } from '../types';
import { interpretManualCraft } from '../services/geminiService';
import { X, Check, Droplet, Snowflake, Leaf, Sparkles, RefreshCw } from 'lucide-react';

interface ManualWorkbenchProps {
  setPage: (page: Page) => void;
  setGeneratedCocktail: (data: CocktailData) => void;
}

const BASES = [
  { name: 'Deep Blue', color: '#1e3a8a', mood: 'Calm' },
  { name: 'Fiery Red', color: '#b91c1c', mood: 'Release' },
  { name: 'Soft Pink', color: '#fbcfe8', mood: 'Soothe' },
  { name: 'Forest Green', color: '#14532d', mood: 'Growth' },
  { name: 'Midnight Violet', color: '#581c87', mood: 'Mystery' },
];

const GARNISHES = [
  { name: 'Sharp Ice', icon: Snowflake },
  { name: 'Rosemary', icon: Leaf },
  { name: 'Gold Leaf', icon: Sparkles },
  { name: 'Bitters', icon: Droplet },
];

export const ManualWorkbench: React.FC<ManualWorkbenchProps> = ({ setPage, setGeneratedCocktail }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [draft, setDraft] = useState<ManualDraft>({
    baseColor: '',
    baseName: '',
    garnishes: [],
    stirLevel: 0,
  });
  const [isPouring, setIsPouring] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBaseSelect = (base: typeof BASES[0]) => {
    setIsPouring(true);
    setTimeout(() => {
        setDraft({ ...draft, baseColor: base.color, baseName: base.name });
        setIsPouring(false);
        setStep(2);
    }, 1500); // Pour animation duration
  };

  const toggleGarnish = (name: string) => {
    setDraft(prev => {
      if (prev.garnishes.includes(name)) {
        return { ...prev, garnishes: prev.garnishes.filter(g => g !== name) };
      }
      return { ...prev, garnishes: [...prev.garnishes, name] };
    });
  };

  const handleStir = () => {
    // Increase stir level on click/hover
    if (draft.stirLevel < 100) {
      setDraft(prev => ({ ...prev, stirLevel: prev.stirLevel + 5 }));
    }
  };

  const finish = async () => {
    setIsProcessing(true);
    try {
      const result = await interpretManualCraft(draft.baseName, draft.baseColor, draft.garnishes);
      
      const newCocktail: CocktailData = {
        id: Date.now().toString(),
        name: result.cocktailName,
        description: result.analysis,
        color: result.hexColor,
        ingredients: result.ingredients,
        baseMood: draft.baseName,
        timestamp: Date.now(),
        mode: 'MANUAL',
        garnish: draft.garnishes,
        isConsumed: false,
        positivityScore: result.positivityScore
      };

      setGeneratedCocktail(newCocktail);
      setPage(Page.MOOD_ELIXIR);

    } catch (e) {
      console.error(e);
      setIsProcessing(false);
      alert("Failed to analyze your craft. Try again.");
    }
  };

  return (
    <div className="relative h-full w-full flex flex-col bg-soul-dark overflow-hidden">
        
      {/* Top Bar */}
      <div className="flex justify-between items-center p-6 z-20">
        <button onClick={() => setPage(Page.HOME)} className="text-white/50 hover:text-white">
          <X size={24} />
        </button>
        <h2 className="font-serif text-soul-gold text-lg tracking-widest">
           {step === 1 && "CHOOSE YOUR BASE"}
           {step === 2 && "ADD ACCENTS"}
           {step === 3 && "STIR TO FUSE"}
        </h2>
        <div className="w-6" />
      </div>

      {/* Main Workbench Area */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left: The Glass Visual */}
        <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-transparent to-black/30">
          <div className="relative w-48 h-64 border-2 border-white/20 border-t-0 rounded-b-3xl backdrop-blur-sm overflow-hidden transform transition-all duration-500">
             {/* Liquid */}
             <div 
               className={`absolute bottom-0 left-0 right-0 bg-white transition-all duration-[1500ms] ease-out
                ${isPouring ? 'animate-liquid opacity-80' : 'opacity-90'}
               `}
               style={{ 
                 height: draft.baseColor ? '80%' : '0%',
                 backgroundColor: draft.baseColor || 'transparent',
                 filter: step === 3 ? `blur(${draft.stirLevel / 20}px) hue-rotate(${draft.stirLevel}deg)` : 'none'
               }}
             >
                {/* Floating Garnishes */}
                {draft.garnishes.map((g, i) => (
                    <div key={g} className="absolute text-white animate-float" style={{ 
                        left: `${20 + i * 20}%`, 
                        top: `${30 + (i % 2) * 20}%`,
                        animationDelay: `${i * 0.5}s`
                    }}>
                       <div className="w-2 h-2 rounded-full bg-white/50 shadow-lg"></div>
                    </div>
                ))}
             </div>
             
             {/* Glass Shine */}
             <div className="absolute top-0 right-4 w-4 h-full bg-gradient-to-l from-white/10 to-transparent pointer-events-none"></div>
          </div>
        </div>

        {/* Right: Controls Panel */}
        <div className="flex-1 bg-white/5 backdrop-blur-lg border-t md:border-t-0 md:border-l border-white/10 p-8 flex flex-col justify-center">
            
            {step === 1 && (
                <div className="grid grid-cols-1 gap-4">
                    {BASES.map(base => (
                        <button 
                            key={base.name}
                            onClick={() => handleBaseSelect(base)}
                            className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full shadow-inner" style={{ backgroundColor: base.color }}></div>
                                <span className="font-serif text-lg text-white">{base.name}</span>
                            </div>
                            <span className="text-xs uppercase tracking-widest text-white/40 group-hover:text-soul-gold">{base.mood}</span>
                        </button>
                    ))}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8">
                     <div className="grid grid-cols-2 gap-4">
                        {GARNISHES.map(g => {
                            const Icon = g.icon;
                            const isSelected = draft.garnishes.includes(g.name);
                            return (
                                <button
                                    key={g.name}
                                    onClick={() => toggleGarnish(g.name)}
                                    className={`p-6 rounded-xl border flex flex-col items-center gap-3 transition-all
                                        ${isSelected ? 'border-soul-gold bg-soul-gold/10 text-soul-gold' : 'border-white/10 text-white/60 hover:border-white/30'}
                                    `}
                                >
                                    <Icon size={24} />
                                    <span className="font-sans text-sm">{g.name}</span>
                                </button>
                            )
                        })}
                     </div>
                     <button 
                        onClick={() => setStep(3)}
                        className="w-full py-4 bg-soul-gold text-soul-dark font-serif text-lg rounded-full hover:bg-soul-paper transition-colors"
                     >
                        Prepare to Stir
                     </button>
                </div>
            )}

            {step === 3 && (
                <div className="flex flex-col items-center gap-8">
                    <p className="text-white/60 font-sans text-center">
                        Hold the button below to stir and blend your creation.
                    </p>
                    
                    <button
                        onMouseDown={handleStir}
                        onClick={handleStir} // For simple clicks
                        className={`w-32 h-32 rounded-full border-2 border-white/20 flex items-center justify-center transition-all duration-300
                            ${draft.stirLevel > 0 ? 'animate-spin border-dashed border-soul-gold' : ''}
                        `}
                        style={{ animationDuration: `${3000 - (draft.stirLevel * 20)}ms` }}
                    >
                        <RefreshCw className="text-white/50" size={40} />
                    </button>
                    
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-soul-gold transition-all duration-200" style={{ width: `${draft.stirLevel}%`}}></div>
                    </div>

                    <button 
                        onClick={finish}
                        disabled={isProcessing}
                        className={`w-full py-4 mt-4 bg-white/10 border border-white/20 text-white font-serif text-lg rounded-full hover:bg-white/20 transition-all ${draft.stirLevel === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isProcessing ? "Analyzing..." : "Serve Drink"}
                    </button>
                </div>
            )}

        </div>
      </div>
    </div>
  );
};