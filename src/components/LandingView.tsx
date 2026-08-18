import { FC } from 'react';
import { Sparkles, ArrowRight, Compass, ShieldCheck, Zap, Sliders, MapPin, Calendar, Clock, Heart, Umbrella, Trees } from 'lucide-react';
import { TRAVEL_STYLES, POPULAR_DESTINATIONS, QUICK_PROMPTS } from '../data/destinations';

interface LandingViewProps {
  onStartPlanning: (initialText?: string) => void;
}

export const LandingView: FC<LandingViewProps> = ({ onStartPlanning }) => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-amber-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Subtle decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-amber-100/60 via-stone-100/40 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-medium text-stone-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>The Zero-Survey AI Travel Assistant</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15]">
              Tell us where you want to go.{' '}
              <span className="text-stone-500 font-normal italic">We&apos;ll figure out the rest.</span>
            </h1>

            {/* Supporting text */}
            <p className="text-lg sm:text-xl text-stone-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Don&apos;t know when to go, how many days you need, or what to do? Tell us whatever you know and we&apos;ll help you plan the rest.
            </p>

            {/* CTA Button */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-plan-btn"
                onClick={() => onStartPlanning()}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-base shadow-lg shadow-stone-900/10 hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-3 group active:scale-98 cursor-pointer"
              >
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform" />
                <span>Plan My Trip</span>
                <ArrowRight className="w-4 h-4 text-stone-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-demo-bali-btn"
                onClick={() => onStartPlanning('I want to go to Bali for 7 days with my girlfriend. We love nature, hidden gems, and romantic sunsets.')}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 font-medium text-sm transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Try: &quot;Bali 7-Day Couple Trip&quot;</span>
              </button>
            </div>

            {/* Quick Prompts Carousel / Pills */}
            <div className="pt-8">
              <p className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
                Or jump in with popular trip ideas:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
                {QUICK_PROMPTS.map((prompt, idx) => (
                  <button
                    key={idx}
                    id={`quick-prompt-${idx}`}
                    onClick={() => onStartPlanning(prompt.text)}
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-50 hover:border-amber-300 border border-stone-200/80 text-xs text-stone-700 hover:text-amber-900 transition-all text-left shadow-2xs hover:scale-102 cursor-pointer"
                  >
                    <span className="font-medium">{prompt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="mt-16 relative max-w-5xl mx-auto">
            <div className="rounded-3xl overflow-hidden border border-stone-200/80 bg-white shadow-2xl">
              {/* Header bar */}
              <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-stone-400 ml-2">Sample Itinerary • Bali, Indonesia</span>
                </div>
                <span className="text-xs text-amber-400 font-medium px-2.5 py-0.5 rounded-full bg-stone-800 border border-stone-700">
                  AI Generated in 2 seconds
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Destination Hero snippet */}
                <div className="lg:col-span-1 space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <img
                      src={POPULAR_DESTINATIONS.bali.heroImage}
                      alt="Bali scenery"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <p className="text-xs font-medium text-amber-300 uppercase tracking-wider">7 Days • Couple</p>
                      <h3 className="text-lg font-serif font-bold">Bali Romantic Sanctuary</h3>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-100 space-y-2">
                    <div className="flex items-center gap-2 text-amber-900 text-xs font-semibold">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>Why We Chose This Plan:</span>
                    </div>
                    <p className="text-xs text-amber-800/90 leading-relaxed">
                      &quot;Since you requested hidden gems and a relaxed pace, we skipped overcrowded tourist traps and routed you through the peaceful Sidemen Valley and quiet sunset cliffs.&quot;
                    </p>
                  </div>
                </div>

                {/* Day sample timeline */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Day 2: Central Highlands & Secret Waterfalls</span>
                    <span className="text-xs text-stone-500">Pace: Balanced</span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Activity 1 */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          08:30
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">Tukad Cepung Waterfall Sunbeam Walk</h4>
                          <p className="text-[11px] text-stone-500">Tembuku, Bangli • 2.5 hrs • $12 / person</p>
                          <p className="text-[11px] text-stone-600 mt-1">Cave waterfall illuminated by morning rays with tranquil shallow pools.</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-stone-200/60 text-stone-600 shrink-0 font-medium">
                        Nature
                      </span>
                    </div>

                    {/* Activity 2 */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          12:30
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">Organic Farm Lunch overlooking Sidemen Terraces</h4>
                          <p className="text-[11px] text-stone-500">Sidemen Valley • 2 hrs • $18 / person</p>
                          <p className="text-[11px] text-stone-600 mt-1">Farm-to-table Balinese herbal dishes surrounded by quiet rice fields.</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0 font-medium">
                        Hidden Gem
                      </span>
                    </div>

                    {/* Activity 3 */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                          17:30
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">Private Sunset Clifftop Tea at Uluwatu</h4>
                          <p className="text-[11px] text-stone-500">Pecatu Coast • 1.5 hrs • $15 / person</p>
                          <p className="text-[11px] text-stone-600 mt-1">Panoramic Indian Ocean views away from the main temple bus crowds.</p>
                        </div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 shrink-0 font-medium">
                        Romantic
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Simplicity Section */}
      <section className="py-20 bg-white border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">The Modern Way to Travel</span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
              No 20-question surveys. Just smart suggestions.
            </h2>
            <p className="text-stone-600 text-sm sm:text-base">
              Traditional travel planners interrogate you. We listen to what you know, intelligently fill the gaps, and adapt to your style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-700 flex items-center justify-center font-serif font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Start with What You Know</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Even if it&apos;s just &quot;I want to go to Bali&quot; or &quot;Somewhere romantic in Japan&quot;. No required forms or rigid checklists.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-700 flex items-center justify-center font-serif font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Smart Adaptive Guidance</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                We recommend the best travel months, ideal durations, and curated vibes. You can accept, change, skip, or let AI decide.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-stone-50 border border-stone-200/70 space-y-4 hover:border-amber-300 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 text-amber-700 flex items-center justify-center font-serif font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Day-by-Day Precision</h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Receive an actionable morning-to-night itinerary with realistic travel times, curated dining, and 1-click refinement prompts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Styles Grid */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Tailored to Your Energy</span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">Explore Every Travel Style</h2>
            </div>
            <p className="text-stone-600 text-sm max-w-md">
              Whether you crave hidden waterfalls, Michelin ramen alleys, or sunset yoga, our AI dynamically shapes every day.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {TRAVEL_STYLES.slice(0, 10).map((style) => (
              <div
                key={style.id}
                onClick={() => onStartPlanning(`I want a ${style.name.toLowerCase()} trip`)}
                className="p-5 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-stone-100 group-hover:bg-amber-100 text-stone-800 group-hover:text-amber-800 flex items-center justify-center mb-3 transition-colors">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                  {style.name}
                </h4>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                  {style.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-20 bg-white border-t border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Inspiration Awaits</span>
            <h2 className="text-3xl font-serif font-bold text-stone-900">Popular Destinations Ready to Explore</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(POPULAR_DESTINATIONS).slice(0, 6).map((dest) => (
              <div
                key={dest.id}
                onClick={() => onStartPlanning(`I want to go to ${dest.name}`)}
                className="group relative rounded-3xl overflow-hidden border border-stone-200/80 bg-stone-900 shadow-md hover:shadow-xl transition-all cursor-pointer h-80 flex flex-col justify-end p-6"
              >
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />
                
                <div className="relative z-10 space-y-2 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-medium">
                    <MapPin className="w-3 h-3 text-amber-300" />
                    <span>{dest.country}</span>
                  </div>
                  <h3 className="text-2xl font-serif font-bold tracking-tight">{dest.name}</h3>
                  <p className="text-xs text-stone-300 line-clamp-2">{dest.tagline}</p>

                  <div className="pt-2 flex items-center justify-between text-xs text-amber-300 font-medium">
                    <span>Recommended: {dest.recommendedMonths[0]?.month || 'Spring'}</span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Plan Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready in 30 Seconds</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
            Ready to plan your next escape?
          </h2>
          <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto font-normal">
            No endless tabs or survey fatigue. Just tell us your destination and let the AI craft a personalized master plan.
          </p>

          <div className="pt-4">
            <button
              id="footer-plan-cta"
              onClick={() => onStartPlanning()}
              className="px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-base shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer inline-flex items-center gap-3 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Planning with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
