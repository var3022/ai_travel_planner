import { FC, useState, FormEvent } from 'react';
import { 
  Sparkles, Calendar, Clock, MapPin, DollarSign, Navigation, 
  Share2, Printer, Heart, RefreshCw, Send, CheckCircle2, 
  Info, Compass, Car, Footprints, ChevronRight, ChevronLeft,
  SlidersHorizontal, Coffee, Sunset, Sun, Moon, UtensilsCrossed,
  ShieldCheck, AlertCircle, ArrowRight, Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Itinerary, ActivityItem, DayPlan } from '../types';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onRefine: (refinementType: string, customPrompt?: string) => Promise<void>;
  isRefining: boolean;
  onNewTrip: () => void;
  onSwapActivity?: (dayNumber: number, activityId: string) => void;
}

const QUICK_REFINEMENTS = [
  '🏖️ Add more beaches',
  '🧗 Make it more adventurous',
  '💰 Make it cheaper',
  '🍜 Add more food experiences',
  '💖 Make it more romantic',
  '🌿 Add more hidden gems',
  '🧘 Make it more relaxed',
  '🚫 Remove crowded places',
  '🚗 Reduce travel time',
  '✨ Surprise me with an off-beat day',
];

export const ItineraryView: FC<ItineraryViewProps> = ({
  itinerary,
  onRefine,
  isRefining,
  onNewTrip,
  onSwapActivity,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [customRefineInput, setCustomRefineInput] = useState('');
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showTips, setShowTips] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const activeDay: DayPlan | undefined = itinerary.days[selectedDayIdx] || itinerary.days[0];

  const toggleFavorite = (actId: string) => {
    setFavorites((prev) => ({ ...prev, [actId]: !prev[actId] }));
  };

  const handleQuickRefine = async (refinement: string) => {
    if (isRefining) return;
    await onRefine(refinement);
  };

  const handleCustomRefineSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customRefineInput.trim() || isRefining) return;
    const prompt = customRefineInput.trim();
    setCustomRefineInput('');
    await onRefine('custom_prompt', prompt);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  const getTimeIcon = (slot: string) => {
    switch (slot) {
      case 'Morning':
        return <Sun className="w-4 h-4 text-amber-500" />;
      case 'Afternoon':
        return <Compass className="w-4 h-4 text-orange-500" />;
      case 'Evening':
        return <Sunset className="w-4 h-4 text-rose-500" />;
      case 'Dinner':
      case 'Night':
        return <Moon className="w-4 h-4 text-indigo-500" />;
      default:
        return <Clock className="w-4 h-4 text-stone-500" />;
    }
  };

  const getTransportIcon = (type: string) => {
    if (type.includes('Walk')) return <Footprints className="w-3.5 h-3.5" />;
    return <Car className="w-3.5 h-3.5" />;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-24 selection:bg-amber-200">
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-2xl bg-stone-900 text-white text-xs font-semibold shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Itinerary link copied to clipboard!</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative bg-stone-900 text-white overflow-hidden border-b border-stone-800">
        <div className="absolute inset-0 z-0">
          <img
            src={itinerary.heroImageUrl}
            alt={itinerary.destination}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500 text-stone-950 font-bold text-xs">
                  {itinerary.durationDays} Days Itinerary
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                  {itinerary.datesDescription}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium">
                  {itinerary.travelerSummary}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">
                {itinerary.tripTitle}
              </h1>

              <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-2xl font-normal">
                {itinerary.overview}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 pt-2">
                {itinerary.travelStyles.map((style, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-stone-800/80 border border-stone-700 text-amber-300 text-xs font-medium"
                  >
                    #{style}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                id="itinerary-share-btn"
                onClick={handleShare}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-stone-400" />
                <span>Share</span>
              </button>

              <button
                id="itinerary-print-btn"
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-white text-xs font-semibold border border-stone-700 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-stone-400" />
                <span>Print / PDF</span>
              </button>

              <button
                id="itinerary-tips-btn"
                onClick={() => setShowTips(!showTips)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2 cursor-pointer ${
                  showTips ? 'bg-amber-400 text-stone-950' : 'bg-amber-500 hover:bg-amber-400 text-stone-950'
                }`}
              >
                <Info className="w-4 h-4" />
                <span>Trip Essentials</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* Why We Chose This Personalized Banner */}
        <div className="rounded-3xl bg-white border border-stone-200 shadow-md p-6 sm:p-7 mb-8 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-stone-900">Why We Chose This Plan For You</h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  AI Personalized
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {itinerary.whyWeChoseThis}
              </p>
            </div>
          </div>

          {/* Matched preferences pill list */}
          {itinerary.matchedPreferences && itinerary.matchedPreferences.length > 0 && (
            <div className="pt-2 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {itinerary.matchedPreferences.map((pref, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="line-clamp-2">{pref}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trip Essentials Drawer (Optional Accordion) */}
        {showTips && itinerary.essentialTips && (
          <div className="rounded-3xl bg-stone-900 text-white p-6 sm:p-8 mb-8 shadow-xl border border-stone-800 space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-serif font-bold">Trip Essentials & Local Knowledge</h3>
              </div>
              <button
                onClick={() => setShowTips(false)}
                className="text-xs text-stone-400 hover:text-white underline cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Transport</span>
                <p className="text-xs text-stone-300 leading-relaxed">{itinerary.essentialTips.bestTransport}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Etiquette & Customs</span>
                <p className="text-xs text-stone-300 leading-relaxed">{itinerary.essentialTips.localEtiquette}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Currency & Tipping</span>
                <p className="text-xs text-stone-300 leading-relaxed">{itinerary.essentialTips.currencyAndTipping}</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">Packing Highlights</span>
                <ul className="text-xs text-stone-300 space-y-1 list-disc list-inside">
                  {itinerary.essentialTips.packingMustHaves?.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Main Day Timeline & Controls */}
        <div className="space-y-6">
          {/* Day Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {itinerary.days.map((day, idx) => {
              const isSelected = selectedDayIdx === idx;
              return (
                <button
                  key={day.dayNumber}
                  id={`day-tab-${day.dayNumber}`}
                  onClick={() => setSelectedDayIdx(idx)}
                  className={`px-4 py-3 rounded-2xl border text-left whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-102 font-bold'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                    Day {day.dayNumber}
                  </div>
                  <div className="text-xs font-serif font-bold truncate max-w-[140px]">
                    {day.area}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Day Overview Card */}
          {activeDay && (
            <div className="rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                      Day {activeDay.dayNumber} of {itinerary.durationDays}
                    </span>
                    <span className="text-xs text-stone-400">•</span>
                    <span className="text-xs text-stone-500 font-medium">{activeDay.area}</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-stone-900">
                    {activeDay.dayTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-3xl">
                    {activeDay.summary}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[11px] text-stone-400 block">Stay Area</span>
                    <span className="text-xs font-bold text-stone-800">{activeDay.stayAreaRecommendation}</span>
                  </div>
                </div>
              </div>

              {/* Activities Timeline */}
              <div className="space-y-4 pt-2">
                {activeDay.activities.map((act, actIdx) => {
                  const isFav = !!favorites[act.id];
                  return (
                    <div
                      key={act.id || actIdx}
                      id={`activity-card-${act.id}`}
                      className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-amber-300 transition-all space-y-3 relative group"
                    >
                      {/* Top Activity Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-800 shadow-2xs">
                            {getTimeIcon(act.timeSlot)}
                            <span>{act.timeSlot}: {act.timeRange}</span>
                          </div>

                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-semibold">
                            {act.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          <button
                            id={`fav-btn-${act.id}`}
                            onClick={() => toggleFavorite(act.id)}
                            className={`p-2 rounded-xl border transition-all cursor-pointer ${
                              isFav
                                ? 'bg-rose-50 border-rose-300 text-rose-600'
                                : 'bg-white border-stone-200 text-stone-400 hover:text-rose-500'
                            }`}
                            title="Save to favorites"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-500' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Main Title & Description */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-serif font-bold text-stone-900">
                            {act.title}
                          </h4>
                          <span className="text-xs text-stone-400">•</span>
                          <span className="text-xs text-stone-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {act.location}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                          {act.description}
                        </p>
                      </div>

                      {/* Details & Why Chosen */}
                      <div className="pt-2 border-t border-stone-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-stone-600">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                          <span><strong>Cost:</strong> {act.costEstimate}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-600">
                          {getTransportIcon(act.transport.type)}
                          <span><strong>Transit:</strong> {act.transport.type} ({act.transport.duration})</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-stone-600">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span><strong>Duration:</strong> {act.duration}</span>
                        </div>
                      </div>

                      {/* Why this activity was selected */}
                      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 flex items-start gap-2 text-xs text-amber-900">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Why this was selected:</strong> {act.whySelected}
                          {act.insiderTip && (
                            <p className="text-amber-800 text-[11px] mt-0.5">
                              💡 <em>Insider Tip: {act.insiderTip}</em>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Day Pagination Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  id="itinerary-prev-day-btn"
                  disabled={selectedDayIdx === 0}
                  onClick={() => setSelectedDayIdx((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-30 text-xs font-semibold text-stone-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Day</span>
                </button>

                <span className="text-xs text-stone-400 font-medium">
                  Day {selectedDayIdx + 1} of {itinerary.days.length}
                </span>

                <button
                  id="itinerary-next-day-btn"
                  disabled={selectedDayIdx === itinerary.days.length - 1}
                  onClick={() => setSelectedDayIdx((prev) => Math.min(itinerary.days.length - 1, prev + 1))}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 disabled:opacity-30 text-xs font-semibold text-stone-700 transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next Day</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Itinerary Refinement Section */}
        <div className="mt-12 rounded-3xl bg-white border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-amber-500" />
              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                Refine Your Itinerary with AI
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-500">
              Want to adjust pacing, change preferences, or swap activities? Click any quick action or type in plain language.
            </p>
          </div>

          {/* Quick Refinement Chips */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">1-Click Quick Adjustments:</span>
            <div className="flex flex-wrap gap-2">
              {QUICK_REFINEMENTS.map((ref, idx) => (
                <button
                  key={idx}
                  id={`quick-refine-btn-${idx}`}
                  disabled={isRefining}
                  onClick={() => handleQuickRefine(ref)}
                  className="px-3.5 py-2 rounded-xl bg-stone-50 hover:bg-amber-50 hover:border-amber-300 border border-stone-200/80 text-xs font-medium text-stone-800 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {ref}
                </button>
              ))}
            </div>
          </div>

          {/* Natural Language Refinement Input Form */}
          <form onSubmit={handleCustomRefineSubmit} className="space-y-3 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Custom Request:</span>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                id="custom-refine-input"
                type="text"
                value={customRefineInput}
                onChange={(e) => setCustomRefineInput(e.target.value)}
                placeholder="Tell me what you'd like to change... (e.g. 'Replace Day 2 with surfing lessons', 'Make all dinners seafood')"
                disabled={isRefining}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 border border-stone-200 focus:bg-white focus:border-amber-500 focus:ring-4 focus:ring-amber-500/15 outline-none text-xs sm:text-sm text-stone-900 transition-all"
              />

              <button
                id="custom-refine-submit-btn"
                type="submit"
                disabled={!customRefineInput.trim() || isRefining}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isRefining ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Updating Itinerary...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Update Itinerary</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Start Another Trip Button */}
        <div className="mt-12 text-center">
          <button
            id="itinerary-new-trip-cta"
            onClick={onNewTrip}
            className="px-6 py-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold text-xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4 text-amber-600" />
            <span>Plan Another Destination</span>
          </button>
        </div>
      </div>
    </div>
  );
};
