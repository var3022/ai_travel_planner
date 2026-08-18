import { FC } from 'react';
import { Compass, Sparkles, PlusCircle } from 'lucide-react';

interface NavbarProps {
  currentStep: 'landing' | 'input' | 'adaptive' | 'review' | 'generating' | 'itinerary';
  onNewTrip: () => void;
  onGoHome: () => void;
  tripDestination?: string;
}

export const Navbar: FC<NavbarProps> = ({
  currentStep,
  onNewTrip,
  onGoHome,
  tripDestination,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          id="nav-brand-btn"
          onClick={onGoHome}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg text-stone-900 tracking-tight">
                AI Travel Planner
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Ask Less • Help More
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Intelligent zero-effort itinerary builder
            </p>
          </div>
        </div>

        {/* Current status or Actions */}
        <div className="flex items-center gap-3">
          {tripDestination && currentStep !== 'landing' && currentStep !== 'input' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Planning: <strong>{tripDestination}</strong></span>
            </div>
          )}

          {currentStep !== 'landing' && (
            <button
              id="nav-new-trip-btn"
              onClick={onNewTrip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium shadow-sm transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>New Trip</span>
            </button>
          )}

          {currentStep === 'landing' && (
            <button
              id="nav-cta-btn"
              onClick={onNewTrip}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan My Trip</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
