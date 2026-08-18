import { useState } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { LandingView } from './components/LandingView';
import { InitialInputView } from './components/InitialInputView';
import { AdaptivePlanningView } from './components/AdaptivePlanningView';
import { AssumptionsReviewView } from './components/AssumptionsReviewView';
import { GenerationLoadingView } from './components/GenerationLoadingView';
import { ItineraryView } from './components/ItineraryView';
import { TripProfile, Itinerary, MonthRecommendation, DurationRecommendation, ValueSource } from './types';
import { AIService } from './services/aiService';
import { POPULAR_DESTINATIONS } from './data/destinations';

type AppStep = 'landing' | 'input' | 'adaptive' | 'review' | 'generating' | 'itinerary';

export default function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('landing');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isRefining, setIsRefining] = useState(false);

  // AI Dialogue & Recommendations State
  const [aiGreeting, setAiGreeting] = useState('');
  const [aiInsight, setAiInsight] = useState('');
  const [recommendedMonths, setRecommendedMonths] = useState<MonthRecommendation[]>([]);
  const [recommendedDurations, setRecommendedDurations] = useState<DurationRecommendation[]>([]);
  const [assumptions, setAssumptions] = useState<{ field: string; value: string; reason: string; source: ValueSource }[]>([]);

  // Central Trip Profile State
  const [tripProfile, setTripProfile] = useState<TripProfile>({
    id: `profile-${Date.now()}`,
    destination: { value: 'Bali', source: 'unknown' },
    dates: { value: { startMonth: 'May', isFlexible: true }, source: 'unknown' },
    durationDays: { value: 7, source: 'ai_recommended' },
    travelerCount: { value: 2, source: 'default' },
    travelerType: { value: 'couple', source: 'unknown' },
    travelStyles: { value: ['Nature & Landscapes', 'Romantic Getaway', 'Hidden Gems'], source: 'unknown' },
    budget: { value: 'moderate', source: 'default' },
    pace: { value: 'balanced', source: 'default' },
    accommodation: { value: 'boutique', source: 'default' },
    specialPreferences: { value: [], source: 'default' },
    lastUpdated: Date.now(),
  });

  // Generated Itinerary State
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);

  // Handlers
  const handleStartPlanning = (promptText?: string) => {
    if (promptText) {
      setInitialPrompt(promptText);
      handleAnalyzeInput(promptText);
    } else {
      setInitialPrompt('');
      setCurrentStep('input');
    }
  };

  const handleAnalyzeInput = async (userInput: string) => {
    setIsLoadingAnalysis(true);
    try {
      const result = await AIService.analyzeInput(userInput);

      const dest = result.destination || 'Bali';
      const destKey = dest.toLowerCase();
      const meta = POPULAR_DESTINATIONS[destKey] || POPULAR_DESTINATIONS.bali;

      // Build updated profile
      const newProfile: TripProfile = {
        id: `profile-${Date.now()}`,
        rawInput: userInput,
        destination: {
          value: dest,
          source: 'user_provided',
        },
        destinationDetails: result.destinationDetails || {
          country: meta.country,
          region: meta.region,
          tagline: meta.tagline,
          imageUrl: meta.heroImage,
        },
        dates: {
          value: {
            startMonth: result.extractedInfo.dates?.startMonth || result.recommendedMonths?.[0]?.month || meta.recommendedMonths[0]?.month || 'May',
            isFlexible: result.extractedInfo.dates?.isFlexible ?? true,
          },
          source: result.extractedInfo.dates?.startMonth ? 'user_provided' : 'ai_recommended',
        },
        durationDays: {
          value: result.extractedInfo.durationDays || meta.recommendedDurations.find((d) => d.isRecommended)?.days || 7,
          source: result.extractedInfo.durationDays ? 'user_provided' : 'ai_recommended',
        },
        travelerCount: {
          value: result.extractedInfo.travelerCount || 2,
          source: result.extractedInfo.travelerCount ? 'user_provided' : 'default',
        },
        travelerType: {
          value: result.extractedInfo.travelerType || 'couple',
          source: result.extractedInfo.travelerType ? 'user_provided' : 'ai_inferred',
        },
        travelStyles: {
          value: result.extractedInfo.travelStyles && result.extractedInfo.travelStyles.length > 0
            ? result.extractedInfo.travelStyles
            : meta.popularStyles || ['Nature & Landscapes', 'Romantic Getaway', 'Hidden Gems'],
          source: result.extractedInfo.travelStyles && result.extractedInfo.travelStyles.length > 0 ? 'user_provided' : 'ai_recommended',
        },
        budget: {
          value: result.extractedInfo.budget || 'moderate',
          source: result.extractedInfo.budget ? 'user_provided' : 'default',
        },
        pace: {
          value: result.extractedInfo.pace || 'balanced',
          source: result.extractedInfo.pace ? 'user_provided' : 'default',
        },
        accommodation: {
          value: result.extractedInfo.accommodation || 'boutique',
          source: result.extractedInfo.accommodation ? 'user_provided' : 'default',
        },
        specialPreferences: {
          value: result.extractedInfo.specialPreferences || [],
          source: result.extractedInfo.specialPreferences ? 'user_provided' : 'default',
        },
        lastUpdated: Date.now(),
      };

      setTripProfile(newProfile);
      setAiGreeting(result.aiGreeting || `${dest} sounds like a fantastic destination!`);
      setAiInsight(result.aiInsight || `If your dates are flexible, ${meta.recommendedMonths[0]?.month || 'May'} is a standout time with balanced weather, comfortable crowds, and great value.`);
      setRecommendedMonths(result.recommendedMonths || meta.recommendedMonths);
      setRecommendedDurations(result.recommendedDurations || meta.recommendedDurations);
      setAssumptions(result.assumptionsMade || [
        { field: 'Duration', value: `${newProfile.durationDays.value} Days`, reason: `Recommended for a balanced first-time trip to ${dest}`, source: 'ai_recommended' },
        { field: 'Budget', value: 'Moderate', reason: 'Default balanced baseline', source: 'default' },
        { field: 'Pace', value: 'Balanced', reason: 'Ample buffer for relaxation and scenic dining', source: 'default' },
      ]);

      setCurrentStep('adaptive');
    } catch (err) {
      console.error('Failed to analyze trip input:', err);
      setCurrentStep('adaptive');
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleUpdateProfile = (updatedFields: Partial<TripProfile>) => {
    setTripProfile((prev) => ({
      ...prev,
      ...updatedFields,
      lastUpdated: Date.now(),
    }));
  };

  const handleBuildTrip = async () => {
    setCurrentStep('generating');
    try {
      const generated = await AIService.generateItinerary(tripProfile);
      setItinerary(generated);
      setCurrentStep('itinerary');

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore confetti errors
      }
    } catch (err) {
      console.error('Itinerary generation failed:', err);
      // Still show fallback
      setCurrentStep('itinerary');
    }
  };

  const handleRefineItinerary = async (refinementType: string, customPrompt?: string) => {
    if (!itinerary) return;
    setIsRefining(true);
    try {
      const updated = await AIService.refineItinerary({
        itinerary,
        tripProfile,
        refinementType,
        customPrompt,
      });
      setItinerary(updated);
    } catch (err) {
      console.error('Itinerary refinement failed:', err);
    } finally {
      setIsRefining(false);
    }
  };

  const handleNewTrip = () => {
    setInitialPrompt('');
    setItinerary(null);
    setCurrentStep('input');
  };

  const handleGoHome = () => {
    setCurrentStep('landing');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased">
      {/* Navigation */}
      <Navbar
        currentStep={currentStep}
        onNewTrip={handleNewTrip}
        onGoHome={handleGoHome}
        tripDestination={tripProfile.destination?.value}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentStep === 'landing' && (
          <LandingView onStartPlanning={handleStartPlanning} />
        )}

        {currentStep === 'input' && (
          <InitialInputView
            initialValue={initialPrompt}
            onSubmit={handleAnalyzeInput}
            isLoading={isLoadingAnalysis}
          />
        )}

        {currentStep === 'adaptive' && (
          <AdaptivePlanningView
            tripProfile={tripProfile}
            aiGreeting={aiGreeting}
            aiInsight={aiInsight}
            recommendedMonths={recommendedMonths}
            recommendedDurations={recommendedDurations}
            onUpdateProfile={handleUpdateProfile}
            onProceedToReview={() => setCurrentStep('review')}
            onBack={() => setCurrentStep('input')}
          />
        )}

        {currentStep === 'review' && (
          <AssumptionsReviewView
            tripProfile={tripProfile}
            assumptions={assumptions}
            onBuildTrip={handleBuildTrip}
            onEditField={() => setCurrentStep('adaptive')}
            onBackToPlanning={() => setCurrentStep('adaptive')}
          />
        )}

        {currentStep === 'generating' && (
          <GenerationLoadingView destination={tripProfile.destination.value} />
        )}

        {currentStep === 'itinerary' && itinerary && (
          <ItineraryView
            itinerary={itinerary}
            onRefine={handleRefineItinerary}
            isRefining={isRefining}
            onNewTrip={handleNewTrip}
          />
        )}
      </main>
    </div>
  );
}
