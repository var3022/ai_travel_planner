import { FC, useState } from 'react';
import { Sparkles, Calendar, Clock, Users, Heart, Bed, Gauge, ArrowRight, ArrowLeft, Check, HelpCircle, Compass, ShieldCheck } from 'lucide-react';
import { TripProfile, MonthRecommendation, DurationRecommendation, TravelerType, BudgetLevel, TravelPace, AccommodationType } from '../types';
import { TRAVEL_STYLES } from '../data/destinations';

interface AdaptivePlanningViewProps {
  tripProfile: TripProfile;
  aiGreeting: string;
  aiInsight: string;
  recommendedMonths?: MonthRecommendation[];
  recommendedDurations?: DurationRecommendation[];
  onUpdateProfile: (updated: Partial<TripProfile>) => void;
  onProceedToReview: () => void;
  onBack: () => void;
}

export const AdaptivePlanningView: FC<AdaptivePlanningViewProps> = ({
  tripProfile,
  aiGreeting,
  aiInsight,
  recommendedMonths = [],
  recommendedDurations = [],
  onUpdateProfile,
  onProceedToReview,
  onBack,
}) => {
  // Current active interactive card tab: 0: Timing, 1: Duration, 2: Travelers, 3: Style, 4: Vibe & Stay
  const [activeStep, setActiveStep] = useState(0);

  const destinationName = tripProfile.destination?.value || 'your destination';

  // Helper setters that record source properly
  const handleSelectMonth = (month: string, isFlexible: boolean = false) => {
    onUpdateProfile({
      dates: {
        value: {
          startMonth: month,
          isFlexible,
        },
        source: 'user_provided',
      },
    });
  };

  const handleLetAIDecideMonth = () => {
    const bestMonth = recommendedMonths[0]?.month || 'May';
    onUpdateProfile({
      dates: {
        value: {
          startMonth: bestMonth,
          isFlexible: true,
        },
        source: 'ai_recommended',
      },
    });
  };

  const handleSelectDuration = (days: number) => {
    onUpdateProfile({
      durationDays: {
        value: days,
        source: 'user_provided',
      },
    });
  };

  const handleLetAIDecideDuration = () => {
    const recDays = recommendedDurations.find((d) => d.isRecommended)?.days || 7;
    onUpdateProfile({
      durationDays: {
        value: recDays,
        source: 'ai_recommended',
      },
    });
  };

  const handleSelectTravelerType = (type: TravelerType, count: number = 2) => {
    onUpdateProfile({
      travelerType: {
        value: type,
        source: 'user_provided',
      },
      travelerCount: {
        value: count,
        source: 'user_provided',
      },
    });
  };

  const handleToggleStyle = (styleName: string) => {
    const currentStyles = tripProfile.travelStyles.value || [];
    let updated: string[];

    if (styleName === 'Surprise Me') {
      updated = ['Surprise Me', 'Hidden Gems', 'Nature & Landscapes', 'Food & Local Life'];
    } else {
      // Remove surprise me if custom style is selected
      const filtered = currentStyles.filter((s) => s !== 'Surprise Me');
      if (filtered.includes(styleName)) {
        updated = filtered.filter((s) => s !== styleName);
      } else {
        updated = [...filtered, styleName];
      }
    }

    onUpdateProfile({
      travelStyles: {
        value: updated.length > 0 ? updated : ['Hidden Gems', 'Nature & Landscapes'],
        source: 'user_provided',
      },
    });
  };

  const handleSelectPace = (pace: TravelPace) => {
    onUpdateProfile({
      pace: {
        value: pace,
        source: 'user_provided',
      },
    });
  };

  const handleSelectBudget = (budget: BudgetLevel) => {
    onUpdateProfile({
      budget: {
        value: budget,
        source: 'user_provided',
      },
    });
  };

  const handleSelectAccommodation = (stay: AccommodationType) => {
    onUpdateProfile({
      accommodation: {
        value: stay,
        source: 'user_provided',
      },
    });
  };

  // Steps definitions
  const steps = [
    { title: 'When to Go', icon: Calendar },
    { title: 'Trip Duration', icon: Clock },
    { title: 'Travelers', icon: Users },
    { title: 'Travel Style', icon: Heart },
    { title: 'Pace & Stay', icon: Bed },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation & Progress bar */}
        <div className="flex items-center justify-between">
          <button
            id="adaptive-back-btn"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          {/* Quick jump to review */}
          <button
            id="adaptive-skip-to-review-btn"
            onClick={onProceedToReview}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-medium text-stone-700 shadow-2xs transition-all active:scale-95 cursor-pointer"
          >
            <span>Skip to Summary</span>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* AI Insight Dialogue Header */}
        <div className="rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-900 text-white p-6 sm:p-8 shadow-xl border border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shrink-0 shadow-md">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-400">AI Concierge</span>
                <span className="text-stone-500">•</span>
                <span className="text-xs text-stone-400">Destination: {destinationName}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                {aiGreeting || `${destinationName} sounds like a fantastic trip!`}
              </h2>
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                {aiInsight || `I've prepared a few adaptive recommendations. Accept what you like, tweak anything, or let me decide.`}
              </p>
            </div>
          </div>

          {/* Step Selector Chips */}
          <div className="mt-6 pt-4 border-t border-stone-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  id={`step-tab-${idx}`}
                  onClick={() => setActiveStep(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 shadow-sm font-bold scale-102'
                      : 'bg-stone-800/80 hover:bg-stone-800 text-stone-300 border border-stone-700/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-stone-950' : 'text-stone-400'}`} />
                  <span>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Step Content Cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 space-y-6">
          {/* STEP 0: TIMING / DATES */}
          {activeStep === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    When are you planning to visit {destinationName}?
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                    {tripProfile.dates.source === 'user_provided' ? 'Selected' : 'AI Recommendation'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500">
                  Select a recommended window, stay flexible, or let AI pick the prime weather season.
                </p>
              </div>

              {/* Recommendation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {recommendedMonths.map((m, idx) => {
                  const isSelected = tripProfile.dates.value?.startMonth === m.month;
                  return (
                    <div
                      key={idx}
                      id={`month-card-${idx}`}
                      onClick={() => handleSelectMonth(m.month, false)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative text-left ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      {m.badge && (
                        <span className="absolute top-4 right-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                          {m.badge}
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-serif font-bold text-stone-900">{m.month}</h4>
                          {isSelected && <Check className="w-4 h-4 text-amber-600 font-bold" />}
                        </div>

                        <div className="space-y-1 text-xs text-stone-600">
                          <p><strong className="text-stone-700">Weather:</strong> {m.weather}</p>
                          <p><strong className="text-stone-700">Crowds:</strong> {m.crowds}</p>
                          <p><strong className="text-stone-700">Value:</strong> {m.priceLevel}</p>
                        </div>

                        <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-200/60 leading-relaxed">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Flexible / You Decide Options */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="timing-flexible-btn"
                  onClick={() => handleSelectMonth('Flexible (Best Season)', true)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                    tripProfile.dates.value?.isFlexible
                      ? 'border-amber-500 bg-amber-100 text-amber-950 font-bold'
                      : 'border-stone-200 hover:bg-stone-100 text-stone-700 bg-white'
                  }`}
                >
                  ✨ I&apos;m Flexible (Pick the Best Time)
                </button>

                <button
                  id="timing-ai-decide-btn"
                  onClick={handleLetAIDecideMonth}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 bg-white text-xs font-medium transition-all cursor-pointer"
                >
                  🤖 You Decide
                </button>

                <button
                  id="timing-skip-btn"
                  onClick={() => setActiveStep(1)}
                  className="ml-auto text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                >
                  Skip this step →
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: DURATION */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    How many days would you like to spend?
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium">
                    Current: {tripProfile.durationDays.value} Days
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500">
                  Instead of guessing, here are the optimal durations based on {destinationName}&apos;s geography:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedDurations.map((d, idx) => {
                  const isSelected = tripProfile.durationDays.value === d.days;
                  return (
                    <div
                      key={idx}
                      id={`duration-card-${idx}`}
                      onClick={() => handleSelectDuration(d.days)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer relative text-left ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      {d.isRecommended && (
                        <span className="absolute top-4 right-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                          Recommended
                        </span>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-lg font-serif font-bold text-stone-900">{d.label}</h4>
                          {isSelected && <Check className="w-4 h-4 text-amber-600 font-bold" />}
                        </div>

                        <p className="text-xs font-semibold text-amber-800">{d.highlight}</p>
                        <p className="text-xs text-stone-600 leading-relaxed">{d.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick duration buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-xs font-medium text-stone-500 mr-2">Or custom:</span>
                {[3, 4, 5, 6, 7, 8, 10, 12, 14].map((n) => (
                  <button
                    key={n}
                    id={`custom-day-${n}`}
                    onClick={() => handleSelectDuration(n)}
                    className={`w-9 h-9 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      tripProfile.durationDays.value === n
                        ? 'border-amber-500 bg-stone-900 text-white shadow-sm'
                        : 'border-stone-200 hover:bg-stone-100 text-stone-700 bg-white'
                    }`}
                  >
                    {n}d
                  </button>
                ))}

                <button
                  id="duration-ai-decide-btn"
                  onClick={handleLetAIDecideDuration}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 bg-white text-xs font-medium transition-all cursor-pointer ml-2"
                >
                  🤖 You Decide
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TRAVELERS */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    Who is traveling with you?
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 font-medium capitalize">
                    {tripProfile.travelerType.value} ({tripProfile.travelerCount.value} people)
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500">
                  This helps AI tailor romantic spots, group dining, or kid-friendly trails.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { type: 'solo' as TravelerType, label: 'Solo', count: 1, desc: 'Freedom & mindfulness' },
                  { type: 'couple' as TravelerType, label: 'Couple', count: 2, desc: 'Romantic & intimate' },
                  { type: 'friends' as TravelerType, label: 'Friends', count: 3, desc: 'Social & energetic' },
                  { type: 'family' as TravelerType, label: 'Family', count: 4, desc: 'Comfortable & fun' },
                  { type: 'group' as TravelerType, label: 'Group', count: 6, desc: 'Shared experiences' },
                  { type: 'not_sure' as TravelerType, label: 'Not Sure Yet', count: 2, desc: 'Keep it versatile' },
                ].map((t, idx) => {
                  const isSelected = tripProfile.travelerType.value === t.type;
                  return (
                    <div
                      key={idx}
                      id={`traveler-card-${t.type}`}
                      onClick={() => handleSelectTravelerType(t.type, t.count)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-bold text-stone-900">{t.label}</h4>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                      </div>
                      <p className="text-[11px] text-stone-500">{t.desc}</p>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  id="travelers-skip-btn"
                  onClick={() => setActiveStep(3)}
                  className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 bg-white text-xs font-medium transition-all cursor-pointer"
                >
                  Skip / Decide Later
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: TRAVEL STYLE */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                    What travel styles or vibes inspire you?
                  </h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-bold">
                    {tripProfile.travelStyles.value?.length || 0} Selected
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-stone-500">
                  Select as many as you like. Hit <strong>&quot;Surprise Me&quot;</strong> if you want AI to balance the best mix.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {TRAVEL_STYLES.map((style) => {
                  const isSelected = tripProfile.travelStyles.value?.includes(style.name);
                  const isSurprise = style.name === 'Surprise Me';
                  return (
                    <button
                      key={style.id}
                      id={`style-btn-${style.id}`}
                      onClick={() => handleToggleStyle(style.name)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSurprise
                          ? isSelected
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-500/20'
                            : 'border-purple-200 bg-purple-50/40 hover:bg-purple-50'
                          : isSelected
                          ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5 w-full">
                        <span className="text-xs font-bold text-stone-900">{style.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 font-bold" />}
                      </div>
                      <p className="text-[10px] text-stone-500 leading-snug">{style.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  id="style-surprise-btn"
                  onClick={() => handleToggleStyle('Surprise Me')}
                  className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Surprise Me with the Best Blend</span>
                </button>

                <button
                  id="style-skip-btn"
                  onClick={() => setActiveStep(4)}
                  className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
                >
                  Next: Pace & Stay →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: PACE & ACCOMMODATION */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                  Fine-tune your Pace & Accommodation
                </h3>
                <p className="text-xs sm:text-sm text-stone-500">
                  Optional preferences. If unsure, we set a comfortable balanced tempo.
                </p>
              </div>

              {/* Pace Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Travel Pace:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'relaxed' as TravelPace, label: 'Relaxed & Unhurried', desc: '1-2 slow highlights/day, leisurely dining & spa' },
                    { id: 'balanced' as TravelPace, label: 'Balanced (Recommended)', desc: '2-3 key spots/day with time to savor and explore' },
                    { id: 'fast_paced' as TravelPace, label: 'Active & Packed', desc: 'Maximizing every hour to see everything' },
                  ].map((p) => {
                    const isSelected = tripProfile.pace.value === p.id;
                    return (
                      <div
                        key={p.id}
                        id={`pace-${p.id}`}
                        onClick={() => handleSelectPace(p.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-stone-900">{p.label}</h5>
                        <p className="text-[11px] text-stone-500 mt-1">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Budget Selection */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Budget Standard:</label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'budget' as BudgetLevel, label: 'Budget Friendly', desc: 'High-value local stays & transit' },
                    { id: 'moderate' as BudgetLevel, label: 'Moderate (Standard)', desc: 'Boutique hotels & great dining' },
                    { id: 'luxury' as BudgetLevel, label: 'Luxury & Premium', desc: '5-star villas & exclusive private tours' },
                    { id: 'you_decide' as BudgetLevel, label: 'You Decide', desc: 'AI balances quality & value' },
                  ].map((b) => {
                    const isSelected = tripProfile.budget.value === b.id;
                    return (
                      <div
                        key={b.id}
                        id={`budget-${b.id}`}
                        onClick={() => handleSelectBudget(b.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                            : 'border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <h5 className="text-xs font-bold text-stone-900">{b.label}</h5>
                        <p className="text-[11px] text-stone-500 mt-1">{b.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accommodation Preference */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-600">Preferred Stay Type:</label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {[
                    { id: 'boutique' as AccommodationType, label: 'Boutique Stay' },
                    { id: 'resort' as AccommodationType, label: 'Resort & Spa' },
                    { id: 'hotel' as AccommodationType, label: 'Modern Hotel' },
                    { id: 'hostel' as AccommodationType, label: 'Hostel / Social' },
                    { id: 'no_preference' as AccommodationType, label: 'No Preference' },
                    { id: 'you_decide' as AccommodationType, label: '🤖 You Decide' },
                  ].map((s) => {
                    const isSelected = tripProfile.accommodation.value === s.id;
                    return (
                      <button
                        key={s.id}
                        id={`stay-${s.id}`}
                        onClick={() => handleSelectAccommodation(s.id)}
                        className={`p-2.5 rounded-xl border text-center text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'border-amber-500 bg-amber-100 text-amber-950 font-bold'
                            : 'border-stone-200 hover:bg-stone-100 text-stone-700 bg-white'
                        }`}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Action Footer Navigation */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {activeStep > 0 && (
                <button
                  id="adaptive-prev-step-btn"
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-all cursor-pointer"
                >
                  ← Previous
                </button>
              )}

              {activeStep < steps.length - 1 && (
                <button
                  id="adaptive-next-step-btn"
                  onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                >
                  Next Step →
                </button>
              )}
            </div>

            {/* Primary Proceed to Review */}
            <button
              id="adaptive-finish-review-btn"
              onClick={onProceedToReview}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Review Trip Profile & Assumptions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
