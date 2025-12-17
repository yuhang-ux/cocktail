import React, { useState, useEffect, useRef } from 'react';
import { Page, CocktailData } from '../types';
import { analyzeEmotionalVent } from '../services/geminiService';
import { Mic, Send, X } from 'lucide-react';

interface AiWhisperProps {
  setPage: (page: Page) => void;
  setGeneratedCocktail: (data: CocktailData) => void;
}

export const AiWhisper: React.FC<AiWhisperProps> = ({ setPage, setGeneratedCocktail }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [visualState, setVisualState] = useState<'IDLE' | 'TYPING' | 'MIXING'>('IDLE');
  
  // Fake microphone handler
  const handleMic = () => {
    alert("In this demo, please type your feelings to allow the AI to read deeply.");
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setVisualState('MIXING');
    setIsProcessing(true);

    try {
      const result = await analyzeEmotionalVent(input);
      
      const newCocktail: CocktailData = {
        id: Date.now().toString(),
        name: result.cocktailName,
        description: result.analysis,
        color: result.hexColor,
        ingredients: result.ingredients,
        baseMood: 'Complex', // Derived in real app, simplified here
        timestamp: Date.now(),
        mode: 'AI',
        isConsumed: false,
        positivityScore: result.positivityScore
      };

      // Fake delay for "Mixing" animation
      setTimeout(() => {
        setGeneratedCocktail(newCocktail);
        setPage(Page.MOOD_ELIXIR);
      }, 3000);
    } catch (error) {
      console.error(error);
      setIsProcessing(false);
      setVisualState('IDLE');
      alert("The bartender couldn't quite hear you. Please try again.");
    }
  };

  // Determine emotional color based on simple keyword heuristics for visual feedback only
  const getTypingColor = () => {
    const text = input.toLowerCase();
    if (text.includes('angry') || text.includes('hate') || text.includes('fire')) return '#ef4444'; // Red
    if (text.includes('sad') || text.includes('cry') || text.includes('blue')) return '#3b82f6'; // Blue
    if (text.includes('happy') || text.includes('joy') || text.includes('love')) return '#f59e0b'; // Orange
    return '#a8a29e'; // Grey default
  };

  const typingColor = getTypingColor();

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-6 bg-soul-dark overflow-hidden">
      
      {/* Liquid Visualizer Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
        <div 
          className={`w-[600px] h-[600px] rounded-full blur-[100px] transition-all duration-1000 ease-in-out
            ${visualState === 'IDLE' ? 'bg-neutral-800 scale-50' : ''}
            ${visualState === 'TYPING' ? 'scale-100 opacity-60' : ''}
            ${visualState === 'MIXING' ? 'scale-150 animate-pulse' : ''}
          `}
          style={{ backgroundColor: visualState === 'IDLE' ? '#262626' : typingColor }}
        />
        {visualState === 'MIXING' && (
          <div className="absolute w-[400px] h-[400px] bg-white rounded-full blur-[80px] animate-ping opacity-20"></div>
        )}
      </div>

      {/* Header */}
      <div className="absolute top-8 left-0 right-0 flex justify-between px-8 z-20">
        <button onClick={() => setPage(Page.HOME)} className="text-white/50 hover:text-soul-gold transition">
          <X size={24} />
        </button>
        <span className="font-serif text-soul-gold/60 tracking-widest text-sm">THE WHISPER</span>
        <div className="w-6" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="z-10 w-full max-w-lg flex flex-col items-center">
        
        <div className={`transition-all duration-700 ${visualState === 'MIXING' ? 'opacity-0 scale-90' : 'opacity-100'}`}>
          <h2 className="font-serif text-3xl md:text-4xl text-soul-paper text-center mb-8 leading-tight">
            What weighs on your soul <br/> tonight?
          </h2>

          <div className="relative group w-full">
            <textarea
              className="w-full h-48 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-lg text-white placeholder-white/30 resize-none focus:outline-none focus:border-soul-gold/50 transition-all font-serif italic"
              placeholder="I feel..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setVisualState(e.target.value.length > 0 ? 'TYPING' : 'IDLE');
              }}
              disabled={isProcessing}
            />
            
            <div className="absolute bottom-4 right-4 flex gap-3">
               <button 
                onClick={handleMic}
                className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-white/70 transition-colors"
              >
                <Mic size={20} />
              </button>
              <button 
                onClick={handleSubmit}
                disabled={!input || isProcessing}
                className={`p-3 rounded-full bg-soul-gold text-soul-dark hover:bg-soul-paper transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
          
          <p className="text-center text-white/30 text-xs mt-6 font-sans tracking-widest">
            YOUR WORDS WILL BE DISSOLVED INTO COLOR
          </p>
        </div>

        {/* Loading State */}
        {visualState === 'MIXING' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-center animate-pulse">
              <h3 className="font-serif text-2xl text-soul-gold mb-2">Distilling Emotions...</h3>
              <p className="font-sans text-white/50 text-sm">Mixing meaning into matter</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};