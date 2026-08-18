import { FC, useState, useEffect } from 'react';
import { Sparkles, Compass, MapPin, Route, Clock, Heart, Coffee } from 'lucide-react';

interface GenerationLoadingViewProps {
  destination: string;
}

const GENERATION_STAGES = [
  { text: 'Understanding your travel style & preferences...', icon: Heart },
  { text: 'Finding the best localized experiences & viewpoints...', icon: Compass },
  { text: 'Balancing transit routes & minimizing travel fatigue...', icon: Route },
  { text: 'Uncovering quiet secret gems & local eateries...', icon: Coffee },
  { text: 'Building your detailed day-by-day morning to night plan...', icon: Clock },
  { text: 'Adding thoughtful personalized touches & insider tips...', icon: Sparkles },
];

export const GenerationLoadingView: FC<GenerationLoadingViewProps> = ({ destination }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => (prev + 1) % GENERATION_STAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const StageIcon = GENERATION_STAGES[currentStageIdx].icon;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Animated Icon Ring */}
        <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-amber-400/40 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute inset-2 rounded-full border border-amber-500/20" />
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/20 animate-bounce" style={{ animationDuration: '2s' }}>
            <StageIcon className="w-8 h-8 transition-all duration-300" />
          </div>
        </div>

        {/* Status Text */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Concierge at Work</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Crafting your bespoke {destination} trip
          </h2>

          <div className="h-8 flex items-center justify-center">
            <p className="text-stone-300 text-sm sm:text-base transition-opacity duration-300 animate-fadeIn font-medium">
              {GENERATION_STAGES[currentStageIdx].text}
            </p>
          </div>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-2 pt-4">
          {GENERATION_STAGES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentStageIdx
                  ? 'w-8 bg-amber-400'
                  : idx < currentStageIdx
                  ? 'w-2 bg-amber-600/50'
                  : 'w-2 bg-stone-700'
              }`}
            />
          ))}
        </div>

        <p className="text-xs text-stone-500 pt-2">
          Personalizing route clusters, dining gems, and seasonal timing...
        </p>
      </div>
    </div>
  );
};
