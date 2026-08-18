export type ValueSource = 'user_provided' | 'ai_inferred' | 'ai_recommended' | 'default' | 'unknown';

export type TravelerType = 'solo' | 'couple' | 'friends' | 'family' | 'group' | 'joining' | 'not_sure';
export type BudgetLevel = 'budget' | 'moderate' | 'luxury' | 'you_decide';
export type TravelPace = 'relaxed' | 'balanced' | 'fast_paced' | 'you_decide';
export type AccommodationType = 'hotel' | 'resort' | 'hostel' | 'boutique' | 'no_preference' | 'you_decide';

export interface TripProfileField<T> {
  value: T;
  source: ValueSource;
  confidence?: number;
  reasoning?: string;
}

export interface TripProfile {
  id: string;
  destination: TripProfileField<string>;
  destinationDetails?: {
    country?: string;
    region?: string;
    imageUrl?: string;
    tagline?: string;
  };
  dates: TripProfileField<{
    startMonth?: string;
    startDate?: string;
    endDate?: string;
    seasonType?: string;
    isFlexible: boolean;
  }>;
  durationDays: TripProfileField<number>;
  travelerCount: TripProfileField<number>;
  travelerType: TripProfileField<TravelerType>;
  travelStyles: TripProfileField<string[]>;
  budget: TripProfileField<BudgetLevel>;
  pace: TripProfileField<TravelPace>;
  accommodation: TripProfileField<AccommodationType>;
  specialPreferences: TripProfileField<string[]>; // e.g. ["Avoid crowded tourist spots", "Seafood focus", "Sunrise hikes"]
  rawInput?: string;
  lastUpdated: number;
}

export interface MonthRecommendation {
  month: string;
  title: string;
  weather: string;
  crowds: string;
  priceLevel: string;
  isRecommended: boolean;
  badge?: string;
  description: string;
}

export interface DurationRecommendation {
  days: number;
  label: string;
  highlight: string;
  description: string;
  isRecommended: boolean;
}

export interface AIAnalysisResult {
  destination?: string;
  destinationDetails?: {
    country?: string;
    region?: string;
    tagline?: string;
    imageUrl?: string;
  };
  extractedInfo: {
    dates?: {
      startMonth?: string;
      startDate?: string;
      endDate?: string;
      isFlexible?: boolean;
    };
    durationDays?: number;
    travelerCount?: number;
    travelerType?: TravelerType;
    travelStyles?: string[];
    budget?: BudgetLevel;
    pace?: TravelPace;
    accommodation?: AccommodationType;
    specialPreferences?: string[];
  };
  inferredPreferences: {
    field: string;
    value: string;
    reason: string;
  }[];
  assumptionsMade: {
    field: string;
    value: string;
    reason: string;
    source: ValueSource;
  }[];
  aiGreeting: string;
  aiInsight: string;
  recommendedMonths?: MonthRecommendation[];
  recommendedDurations?: DurationRecommendation[];
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Dinner' | 'Night';

export interface ActivityItem {
  id: string;
  timeSlot: TimeOfDay;
  timeRange: string; // e.g. "09:00 AM - 11:30 AM"
  title: string;
  category: 'Nature' | 'Culture' | 'Adventure' | 'Food & Drink' | 'Relaxation' | 'Sightseeing' | 'Hidden Gem' | 'Local Life' | 'Photography' | 'Nightlife';
  location: string;
  area: string;
  description: string;
  duration: string; // e.g. "2.5 hrs"
  costEstimate: string; // e.g. "$15 - $25 / person" or "Free"
  transport: {
    type: 'Walk' | 'Taxi / Grab' | 'Scooter / Bike' | 'Private Driver' | 'Boat / Ferry' | 'Train / Metro';
    duration: string;
    distanceFromPrev?: string;
  };
  whySelected: string;
  insiderTip?: string;
  imageUrl?: string;
  isFavorite?: boolean;
}

export interface DayPlan {
  dayNumber: number;
  dayTitle: string; // e.g. "Cultural Heart & Sacred Waterfalls"
  area: string; // e.g. "Ubud & Central Highlands"
  theme: string; // e.g. "Nature, Ancient Temples & Organic Cuisine"
  summary: string;
  highlightActivity: string;
  activities: ActivityItem[];
  dayPace: 'Relaxed' | 'Balanced' | 'Active';
  stayAreaRecommendation: string;
}

export interface Itinerary {
  id: string;
  tripTitle: string;
  destination: string;
  country: string;
  datesDescription: string;
  durationDays: number;
  travelerSummary: string;
  travelStyles: string[];
  budgetLevel: string;
  pace: string;
  heroImageUrl: string;
  overview: string;
  whyWeChoseThis: string;
  matchedPreferences: string[];
  days: DayPlan[];
  essentialTips: {
    bestTransport: string;
    localEtiquette: string;
    currencyAndTipping: string;
    weatherNote: string;
    packingMustHaves: string[];
  };
  createdAt: number;
}

export interface RefineRequest {
  itinerary: Itinerary;
  tripProfile: TripProfile;
  refinementType: string;
  customPrompt?: string;
}
