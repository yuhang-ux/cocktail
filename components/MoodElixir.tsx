import React, { useState } from 'react';
import { Page, CocktailData } from '../types';
import { Share2, ArrowLeft, Heart, Save } from 'lucide-react';
import html2canvas from 'html2canvas';

interface MoodElixirProps {
  data: CocktailData;
  setPage: (page: Page) => void;
  markConsumed: (id: string) => void;
}

export const MoodElixir: React.FC<MoodElixirProps> = ({ data, setPage, markConsumed }) => {
  const [liquidLevel, setLiquidLevel] = useState(100);
  const [showQuote, setShowQuote] = useState(false);

  const handleDrink = () => {
    if (liquidLevel > 0) {
      setLiquidLevel(prev => Math.max(0, prev - 20));
      if (liquidLevel <= 20 && !showQuote) {
        setShowQuote(true);
        markConsumed(data.id);
      }
    }
  };

  const handleSave = async () => {
    const element = document.getElementById('receipt-card');
    if (element) {
      const canvas = await html2canvas(element, { backgroundColor: '#1c1917' });
      const link = document.createElement('a');
      link.download = `SoulBar-${data.name}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="h-full w-full bg-stone-900 flex flex-col md:flex-row overflow-hidden relative">
      
      {/* Navigation */}
      <div className="absolute top-6 left-6 z-30">
        <button onClick={() => setPage(Page.CELLAR)} className="flex items-center gap-2 text-soul-gold/70 hover:text-soul-gold transition">
          <ArrowLeft size={20} /> <span className="text-sm tracking-widest">TO CELLAR</span>
        </button>
      </div>

      {/* Left: The Drink (Interactive) */}
      <div className="flex-1 flex flex-col items-center justify-center relative p-8 cursor-pointer" onClick={handleDrink}>
        <h3 className="absolute top-24 text-white/30 text-xs tracking-[0.3em] font-sans">TAP TO DRINK</h3>
        
        {/* Cocktail Visual */}
        <div className="relative w-48 h-64 md:w-64 md:h-80 perspective-1000">
             {/* Glass Shadow */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-40 h-10 bg-black/50 blur-xl rounded-full"></div>
            
            <div className="relative w-full h-full border-2 border-white/20 border-t-0 rounded-b-[3rem] backdrop-blur-[2px] overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.05)]">
                 {/* The Liquid */}
                 <div 
                    className="absolute bottom-0 w-full transition-all duration-1000 ease-out"
                    style={{ 
                        height: `${liquidLevel}%`,
                        backgroundColor: data.color,
                        boxShadow: `0 0 40px ${data.color}80 inset`
                    }}
                 >
                    {/* Bubbles */}
                    <div className="absolute inset-0 w-full h-full opacity-50 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                 </div>
                 
                 {/* Ice / Garnish Overlay (Abstract) */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
            </div>
            
            {/* Rim */}
            <div className="absolute top-0 w-full h-4 border border-white/20 rounded-full bg-white/5"></div>
        </div>

        {/* Hidden Quote */}
        <div className={`mt-12 text-center transition-all duration-1000 ${showQuote ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <p className="font-serif text-xl italic text-soul-gold">"The soul heals what it reveals."</p>
        </div>
      </div>

      {/* Right: The Receipt (Analysis) */}
      <div className="flex-1 bg-stone-950 border-l border-white/5 p-8 md:p-12 overflow-y-auto custom-scrollbar flex items-center justify-center">
        <div id="receipt-card" className="bg-[#e3d5c6] text-stone-900 p-8 rounded-sm shadow-2xl max-w-sm w-full transform rotate-1 transition-transform hover:rotate-0">
            
            {/* Receipt Header */}
            <div className="border-b-2 border-stone-900 pb-4 mb-6 text-center">
                <h1 className="font-serif text-3xl font-bold uppercase tracking-wide mb-1">Soul Bar</h1>
                <p className="font-mono text-xs uppercase">Mood Prescription Receipt</p>
                <p className="font-mono text-xs text-stone-600">{new Date(data.timestamp).toLocaleDateString()} — {new Date(data.timestamp).toLocaleTimeString()}</p>
            </div>

            {/* Cocktail Name */}
            <div className="mb-6 text-center">
                <h2 className="font-serif text-2xl font-bold text-stone-800">{data.name}</h2>
                <div className="flex justify-center gap-2 mt-2">
                    {data.ingredients.map((ing, i) => (
                        <span key={i} className="text-[10px] font-mono border border-stone-800 px-2 py-0.5 rounded-full">{ing}</span>
                    ))}
                </div>
            </div>

            {/* Analysis Body */}
            <div className="font-serif text-lg leading-relaxed text-stone-800 mb-8 italic">
                "{data.description}"
            </div>

            {/* Footer Stats */}
            <div className="border-t-2 border-stone-900 pt-4 flex justify-between items-end font-mono text-xs">
                <div>
                    <p>MODE: {data.mode}</p>
                    <p>COLOR: {data.color}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold">{data.positivityScore}%</p>
                    <p>SPIRIT LIFT</p>
                </div>
            </div>

            {/* Barcode Mock */}
            <div className="mt-8 h-8 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/UPC-A-036000291452.svg/1200px-UPC-A-036000291452.svg.png')] bg-cover opacity-80 mix-blend-multiply"></div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-8 right-8 flex gap-4">
            <button onClick={handleSave} className="p-4 bg-stone-800 text-soul-gold rounded-full hover:bg-stone-700 transition shadow-lg">
                <Save size={24} />
            </button>
        </div>

      </div>

    </div>
  );
};