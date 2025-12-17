import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import { Mic2, Palette } from 'lucide-react';

interface HomeProps {
  setPage: (page: Page) => void;
}

export const Home: React.FC<HomeProps> = ({ setPage }) => {
  const [holding, setHolding] = useState<string | null>(null);
  const [volume, setVolume] = useState(0);

  // Simulate holding effect
  useEffect(() => {
    let interval: any;
    if (holding) {
      interval = setInterval(() => {
        setVolume((v) => Math.min(v + 0.05, 1));
      }, 100);
    } else {
      setVolume(0);
    }
    return () => clearInterval(interval);
  }, [holding]);

  // Trigger page transition if held long enough
  useEffect(() => {
    if (volume >= 1 && holding) {
      if (holding === 'vent') setPage(Page.AI_WHISPER);
      if (holding === 'craft') setPage(Page.MANUAL_WORKBENCH);
    }
  }, [volume, holding, setPage]);

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-800 via-soul-dark to-black opacity-80 z-0" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 z-0"></div>

      <div className="z-10 text-center mb-12 animate-fade-in-up">
        <h1 className="font-serif text-5xl text-soul-paper mb-2 tracking-wider">Soul Bar</h1>
        <p className="font-sans text-soul-gold/60 text-sm uppercase tracking-[0.2em]">Open for the weary</p>
      </div>

      <div className="z-10 flex flex-col md:flex-row gap-8 md:gap-16 w-full max-w-4xl justify-center items-center">
        
        {/* Left Card: Vent */}
        <div 
          className={`relative group w-64 h-80 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm 
            cursor-pointer transition-all duration-700 ease-out transform
            ${holding === 'vent' ? 'scale-105 border-soul-gold/50 shadow-[0_0_30px_rgba(197,160,89,0.2)]' : 'hover:border-white/20 hover:bg-white/10'}
          `}
          onMouseDown={() => setHolding('vent')}
          onMouseUp={() => setHolding(null)}
          onMouseLeave={() => setHolding(null)}
          onTouchStart={() => setHolding('vent')}
          onTouchEnd={() => setHolding(null)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Mic2 className={`w-12 h-12 mb-6 text-soul-paper transition-all duration-500 ${holding === 'vent' ? 'scale-110 text-soul-gold' : 'opacity-70'}`} />
            <h2 className="font-serif text-2xl text-soul-paper mb-2">The Whisper</h2>
            <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
              Entrust your emotions to me. <br/> Speak to dissolve.
            </p>
            {holding === 'vent' && (
              <div className="absolute bottom-6 w-1/2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-soul-gold transition-all duration-100 ease-linear" style={{ width: `${volume * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Craft */}
        <div 
          className={`relative group w-64 h-80 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm 
            cursor-pointer transition-all duration-700 ease-out transform
            ${holding === 'craft' ? 'scale-105 border-blue-400/50 shadow-[0_0_30px_rgba(96,165,250,0.2)]' : 'hover:border-white/20 hover:bg-white/10'}
          `}
          onMouseDown={() => setHolding('craft')}
          onMouseUp={() => setHolding(null)}
          onMouseLeave={() => setHolding(null)}
          onTouchStart={() => setHolding('craft')}
          onTouchEnd={() => setHolding(null)}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <Palette className={`w-12 h-12 mb-6 text-soul-paper transition-all duration-500 ${holding === 'craft' ? 'scale-110 text-blue-300' : 'opacity-70'}`} />
            <h2 className="font-serif text-2xl text-soul-paper mb-2">The Workbench</h2>
            <p className="font-sans text-sm text-gray-400 font-light leading-relaxed">
              Mix your current self. <br/> Craft to clarity.
            </p>
            {holding === 'craft' && (
              <div className="absolute bottom-6 w-1/2 h-1 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 transition-all duration-100 ease-linear" style={{ width: `${volume * 100}%` }}></div>
              </div>
            )}
          </div>
        </div>

      </div>

      <div className="absolute bottom-8 text-center z-10 opacity-40">
        <p className="text-xs font-sans tracking-widest text-white">HOLD CARD TO ENTER</p>
      </div>
    </div>
  );
};