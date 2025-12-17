import React from 'react';
import { Page, CocktailData } from '../types';
import { ArrowLeft, Plus } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface CellarProps {
  history: CocktailData[];
  setPage: (page: Page) => void;
  loadCocktail: (cocktail: CocktailData) => void;
}

export const Cellar: React.FC<CellarProps> = ({ history, setPage, loadCocktail }) => {
  
  // Format data for Recharts
  const chartData = history.map((h, i) => ({
    name: new Date(h.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    score: h.positivityScore,
    color: h.color,
    cocktailName: h.name
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-stone-900 border border-white/20 p-3 rounded-lg shadow-xl">
          <p className="font-serif text-soul-gold text-sm mb-1">{label}</p>
          <p className="font-sans text-white text-xs">{payload[0].payload.cocktailName}</p>
          <p className="font-mono text-white/50 text-[10px] mt-1">Lift: {payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full bg-[#1c1917] flex flex-col overflow-hidden">
      
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-white/5 bg-[#1c1917] z-20">
        <h1 className="font-serif text-2xl text-soul-gold">The Cellar</h1>
        <button 
          onClick={() => setPage(Page.HOME)}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-white/70 transition"
        >
          <Plus size={16} /> <span className="text-sm font-sans">NEW MIX</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* Viz Section */}
        {history.length > 1 && (
          <div className="w-full h-64 mb-12 bg-white/5 rounded-2xl p-6 border border-white/5">
            <h3 className="font-mono text-xs text-white/40 uppercase mb-4 tracking-widest">Emotional Trajectory</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#555" tick={{fontSize: 10}} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={50} stroke="#333" strokeDasharray="3 3" />
                <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#c5a059" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorScore)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {history.length === 0 ? (
            <div className="col-span-full text-center py-20 text-white/30 font-serif italic">
                Your cellar is empty. Visit the bar to start your collection.
            </div>
          ) : (
             history.slice().reverse().map((bottle) => (
                <div 
                    key={bottle.id}
                    onClick={() => loadCocktail(bottle)}
                    className="group flex flex-col items-center cursor-pointer"
                >
                    {/* Bottle Visual (Abstract) */}
                    <div className="relative w-16 h-40 bg-stone-800 rounded-t-3xl rounded-b-md border border-white/10 group-hover:border-soul-gold/50 transition-all overflow-hidden shadow-lg">
                        <div 
                            className="absolute bottom-0 w-full opacity-80 transition-all duration-500"
                            style={{ 
                                height: bottle.isConsumed ? '10%' : '70%', 
                                backgroundColor: bottle.color 
                            }}
                        ></div>
                        {/* Tag */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-12 bg-[#e3d5c6] shadow-md flex items-center justify-center">
                            <span className="font-mono text-[8px] text-black -rotate-90 whitespace-nowrap">
                                {new Date(bottle.timestamp).toLocaleDateString(undefined, {month:'numeric', day:'numeric'})}
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <h4 className="font-serif text-white text-sm group-hover:text-soul-gold transition">{bottle.name}</h4>
                        <p className="font-sans text-[10px] text-white/40 uppercase tracking-wide">{bottle.mode}</p>
                    </div>
                </div>
             ))
          )}
        </div>
      </div>
    </div>
  );
};