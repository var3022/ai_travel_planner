import { FC, useState } from 'react';
import { Sparkles, Calendar, Clock, Users, Heart, Bed, Gauge, Check, Edit3, ArrowRight, ArrowLeft, ShieldCheck, MapPin } from 'lucide-react';
import { TripProfile, ValueSource } from '../types';

interface AssumptionsReviewViewProps {
  tripProfile: TripProfile;
  assumptions: {
    field: string;
    value: string;
    reason: string;
    source: ValueSource;
  }[];
  onBuildTrip: () => void;
  onEditField: (fieldKey: string) => void;
  onBackToPlanning: () => void;
}

export const AssumptionsReviewView: FC<AssumptionsReviewViewProps> = ({
  tripProfile,
  assumptions,
  onBuildTrip,
  onEditField,
  onBackToPlanning,
}) => {
  const destName = tripProfile.destination?.value || 'Bali';
  const country = tripProfile.destinationDetails?.country || 'Indonesia';
  const heroImage = tripProfile.destinationDetails?.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80';

  const getSourceBadge = (source: ValueSource) => {
    switch (source) {
      case 'user_provided':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">You Specified</span>;
      case 'ai_inferred':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">AI Inferred</span>;
      case 'ai_recommended':
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">AI Recommended</span>;
      default:
        return <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">Default Baseline</span>;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <button
            id="review-back-btn"
            onClick={onBackToPlanning}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Adjustments</span>
          </button>

          <span className="text-xs text-stone-400 font-mono">Step 2 of 3 • Review Assumptions</span>
        </div>

        {/* Hero Summary Card */}
        <div className="rounded-3xl overflow-hidden bg-white border border-stone-200/90 shadow-xl">
          {/* Destination Header Banner */}
          <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-stone-900">
            <img
              src={heroImage}
              alt={destName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{country}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
                  Your {destName} Trip Profile
                </h1>
                <p className="text-xs sm:text-sm text-stone-300">
                  {tripProfile.destinationDetails?.tagline || 'Customized travel plan ready to be generated'}
                </p>
              </div>

              <div className="shrink-0">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs shadow-md">
                  {tripProfile.durationDays.value} Days • {tripProfile.travelerType.value.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Structured Attributes Grid */}
          <div className="p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Dates */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 relative group">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-amber-500" /> Timing</span>
                  {getSourceBadge(tripProfile.dates.source)}
                </div>
                <h4 className="text-sm font-bold text-stone-900 pt-1">
                  {tripProfile.dates.value?.startMonth || 'Flexible Season'}
                </h4>
              </div>

              {/* Duration */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 relative group">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-500" /> Duration</span>
                  {getSourceBadge(tripProfile.durationDays.source)}
                </div>
                <h4 className="text-sm font-bold text-stone-900 pt-1">
                  {tripProfile.durationDays.value} Days
                </h4>
              </div>

              {/* Travelers */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 relative group">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-amber-500" /> Travelers</span>
                  {getSourceBadge(tripProfile.travelerType.source)}
                </div>
                <h4 className="text-sm font-bold text-stone-900 pt-1 capitalize">
                  {tripProfile.travelerType.value} ({tripProfile.travelerCount.value}x)
                </h4>
              </div>

              {/* Pace & Budget */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-1 relative group">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1"><Gauge className="w-3.5 h-3.5 text-amber-500" /> Pace / Budget</span>
                  {getSourceBadge(tripProfile.pace.source)}
                </div>
                <h4 className="text-sm font-bold text-stone-900 pt-1 capitalize">
                  {tripProfile.pace.value} • {tripProfile.budget.value}
                </h4>
              </div>
            </div>

            {/* Travel Styles Tag Cloud */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Selected Travel Styles & Vibes:</span>
                {getSourceBadge(tripProfile.travelStyles.source)}
              </div>
              <div className="flex flex-wrap gap-2">
                {tripProfile.travelStyles.value?.map((style, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-950 border border-amber-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>{style}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* AI Assumptions Explanation Section */}
            <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-stone-900">
                    I filled in a few details for you
                  </h3>
                  <p className="text-xs text-amber-900/80">
                    Here is what our AI inferred and recommended so you didn&apos;t have to answer 15 questions:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {assumptions.length > 0 ? (
                  assumptions.map((a, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">{a.field}: {a.value}</span>
                        {getSourceBadge(a.source)}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">{a.reason}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">7 Days Duration</span>
                        {getSourceBadge('ai_recommended')}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Recommended for a balanced first-time trip covering cultural center & scenic coasts.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">Moderate Budget</span>
                        {getSourceBadge('ai_inferred')}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Estimated because no specific luxury or backpacker limit was entered.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">Balanced Pace</span>
                        {getSourceBadge('default')}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        2-3 key highlights per day leaving generous room for scenic relaxation.
                      </p>
                    </div>
                    <div className="p-3.5 rounded-xl bg-white/90 border border-amber-200/60 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">Curated Vibes</span>
                        {getSourceBadge('ai_recommended')}
                      </div>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Nature & Hidden Gems prioritized to avoid crowded tourist bottlenecks.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Clear Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100">
              <button
                id="review-change-btn"
                onClick={onBackToPlanning}
                className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-stone-500" />
                <span>Change Something</span>
              </button>

              <button
                id="review-build-trip-btn"
                onClick={onBuildTrip}
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-base shadow-xl shadow-stone-900/15 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group active:scale-95 cursor-pointer ring-4 ring-amber-400/30"
              >
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Build My Trip</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
