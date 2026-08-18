import { FC, useState, FormEvent } from 'react';
import { Sparkles, ArrowRight, Compass, MapPin, Lightbulb } from 'lucide-react';
import { POPULAR_DESTINATIONS, QUICK_PROMPTS } from '../data/destinations';

interface InitialInputViewProps {
  initialValue?: string;
  onSubmit: (userInput: string) => void;
  isLoading: boolean;
}

export const InitialInputView: FC<InitialInputViewProps> = ({
  initialValue = '',
  onSubmit,
  isLoading,
}) => {
  const [input, setInput] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSubmit(input.trim());
  };

  const handleSelectPrompt = (promptText: string) => {
    setInput(promptText);
    onSubmit(promptText);
  };

  const handleSelectDestination = (destName: string) => {
    const text = `I want to go to ${destName}`;
    setInput(text);
    onSubmit(text);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Title and Philosophy */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Step 1: Tell Us What You Know</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight">
            Where do you want to go?
          </h2>

          <p className="text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
            You don&apos;t need exact dates, group sizes, or an itinerary. Just tell us your destination or general idea in plain words.
          </p>
        </div>

        {/* The Large Natural Language Input Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-stone-200/90 relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                id="natural-trip-input"
                rows={3}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tell me where you want to go... (e.g. 'Bali', or '7 days in Japan with my girlfriend', or 'A romantic beach trip in Europe on a budget')"
                className="w-full resize-none p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none text-base sm:text-lg text-stone-900 placeholder:text-stone-400 leading-relaxed transition-all"
                autoFocus
                disabled={isLoading}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-stone-500">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tip: You can include duration, companions, or vibe if you know them.</span>
              </div>

              <button
                id="submit-trip-input-btn"
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing Request...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Continue with AI</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="space-y-6">
          {/* Quick Destination Chips */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center sm:text-left">
              Popular Destinations:
            </p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {Object.values(POPULAR_DESTINATIONS).map((dest) => (
                <button
                  key={dest.id}
                  id={`dest-chip-${dest.id}`}
                  onClick={() => handleSelectDestination(dest.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200 text-xs font-medium text-stone-700 hover:text-amber-900 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-amber-500" />
                  <span>{dest.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Prompts */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500 text-center sm:text-left">
              Or Try a Complete Natural Language Example:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {QUICK_PROMPTS.slice(0, 4).map((p, idx) => (
                <button
                  key={idx}
                  id={`quick-box-${idx}`}
                  onClick={() => handleSelectPrompt(p.text)}
                  className="p-3 rounded-2xl bg-white hover:bg-amber-50/70 border border-stone-200/80 hover:border-amber-300 text-left transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800 group-hover:text-amber-900 mb-1">
                    <span>{p.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    &quot;{p.text}&quot;
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
