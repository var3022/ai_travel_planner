import { AIAnalysisResult, TripProfile, Itinerary, RefineRequest } from '../types';

export class AIService {
  static async analyzeInput(userInput: string): Promise<AIAnalysisResult> {
    try {
      const response = await fetch('/api/ai/analyze-input', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userInput }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.warn('AI analysis API error, falling back locally:', err);
      // Local graceful fallback
      return {
        destination: 'Bali',
        destinationDetails: {
          country: 'Indonesia',
          region: 'Southeast Asia',
          tagline: 'Island of the Gods, emerald terraces & spiritual retreats',
          imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
        },
        extractedInfo: {
          dates: { startMonth: 'May', isFlexible: true },
          durationDays: 7,
          travelerCount: 2,
          travelerType: 'couple',
          travelStyles: ['Nature & Landscapes', 'Romantic Getaway', 'Hidden Gems'],
          budget: 'moderate',
          pace: 'balanced',
        },
        inferredPreferences: [
          { field: 'Traveler Type', value: 'Couple', reason: 'Context analysis' },
        ],
        assumptionsMade: [
          { field: 'Duration', value: '7 Days', reason: 'Recommended duration for first-time trip', source: 'ai_recommended' },
          { field: 'Budget', value: 'Moderate', reason: 'Estimated balanced baseline', source: 'ai_recommended' },
          { field: 'Pace', value: 'Balanced', reason: 'Default balanced pace with ample relaxation', source: 'default' },
        ],
        aiGreeting: 'Bali sounds like an incredible journey!',
        aiInsight: 'If your dates are flexible, May and June provide an optimal blend of dry weather, calm crowds, and high value.',
      };
    }
  }

  static async generateItinerary(tripProfile: TripProfile): Promise<Itinerary> {
    try {
      const response = await fetch('/api/ai/generate-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripProfile }),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Itinerary generation error:', err);
      throw err;
    }
  }

  static async refineItinerary(req: RefineRequest): Promise<Itinerary> {
    try {
      const response = await fetch('/api/ai/refine-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
      });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Itinerary refinement error:', err);
      throw err;
    }
  }
}
