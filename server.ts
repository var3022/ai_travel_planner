import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { POPULAR_DESTINATIONS } from './src/data/destinations';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Resilient Gemini generator with multi-model fallback and retry
async function generateGeminiContentWithFallback(
  ai: GoogleGenAI,
  options: {
    prompt: string;
    systemInstruction?: string;
    responseMimeType?: string;
  }
): Promise<string | null> {
  const modelsToTry = ['gemini-2.5-flash', 'gemini-3.7-flash', 'gemini-2.5-pro'];
  
  for (const model of modelsToTry) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: options.prompt,
          config: {
            systemInstruction: options.systemInstruction,
            responseMimeType: options.responseMimeType || 'application/json',
          },
        });
        if (response.text) {
          return response.text;
        }
      } catch (err: any) {
        const isUnavailableOrRateLimited = 
          err?.status === 503 || 
          err?.status === 429 || 
          err?.message?.includes('503') || 
          err?.message?.includes('429') ||
          err?.message?.includes('high demand') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('RESOURCE_EXHAUSTED');

        console.warn(`[Gemini] Model ${model} (attempt ${attempt + 1}) encountered error:`, err?.message || err);
        
        if (isUnavailableOrRateLimited && attempt === 0) {
          // Quick wait before retry
          await new Promise((r) => setTimeout(r, 600));
          continue;
        }
        // Break to next model
        break;
      }
    }
  }
  return null;
}

// Fallback intelligent natural language analyzer
function fallbackAnalyzeInput(userInput: string) {
  const lower = userInput.toLowerCase();
  
  // Destination matching
  let destKey = 'bali';
  let destName = 'Bali';
  let country = 'Indonesia';
  let region = 'Southeast Asia';
  let tagline = 'Island of the Gods, emerald terraces & spiritual retreats';
  let imageUrl = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80';

  if (lower.includes('tokyo') || lower.includes('japan') || lower.includes('kyoto')) {
    destKey = 'tokyo';
    destName = 'Tokyo & Kyoto';
    country = 'Japan';
    region = 'East Asia';
    tagline = 'Futuristic neon, centuries-old shrines & culinary mastery';
    imageUrl = 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80';
  } else if (lower.includes('paris') || lower.includes('france') || lower.includes('europe')) {
    destKey = 'paris';
    destName = 'Paris';
    country = 'France';
    region = 'Western Europe';
    tagline = 'Artistic elegance, romantic boulevards & cafe culture';
    imageUrl = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80';
  } else if (lower.includes('goa')) {
    destKey = 'goa';
    destName = 'Goa';
    country = 'India';
    region = 'South Asia';
    tagline = 'Portuguese heritage, sun-drenched coves & bohemian spirit';
    imageUrl = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80';
  } else if (lower.includes('kerala')) {
    destKey = 'kerala';
    destName = 'Kerala';
    country = 'India';
    region = 'South Asia';
    tagline = "God's Own Country, emerald backwaters & misty tea hills";
    imageUrl = 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80';
  } else if (lower.includes('sri lanka') || lower.includes('colombo') || lower.includes('ceylon')) {
    destKey = 'sri_lanka';
    destName = 'Sri Lanka';
    country = 'Sri Lanka';
    region = 'South Asia';
    tagline = 'Ancient fortresses, scenic blue trains & golden coastlines';
    imageUrl = 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80';
  } else if (lower.includes('amalfi') || lower.includes('italy') || lower.includes('positano') || lower.includes('rome')) {
    destKey = 'amalfi';
    destName = 'Amalfi Coast';
    country = 'Italy';
    region = 'Southern Europe';
    tagline = 'Pastel cliffside villages, azure waters & lemon groves';
    imageUrl = 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80';
  } else {
    // Extract any capitalized word or custom destination
    const words = userInput.trim().split(/\s+/);
    if (words.length > 0) {
      destName = words[0].charAt(0).toUpperCase() + words[0].slice(1).replace(/[,.!?]/g, '');
      if (words.length > 1 && !['i', 'want', 'to', 'go', 'a', 'the', 'for', 'with', 'in'].includes(words[1].toLowerCase())) {
        destName += ' ' + words[1].charAt(0).toUpperCase() + words[1].slice(1).replace(/[,.!?]/g, '');
      }
      destKey = 'bali'; // use bali template for recommendations
    }
  }

  // Duration extraction
  let durationDays: number | undefined = undefined;
  const durationMatch = lower.match(/(\d+)\s*(days|day|d)\b/i) || lower.match(/(a\s*week|one\s*week)/i);
  if (durationMatch) {
    if (durationMatch[1] && !isNaN(parseInt(durationMatch[1], 10))) {
      durationDays = parseInt(durationMatch[1], 10);
    } else {
      durationDays = 7;
    }
  }

  // Travelers / Traveler type extraction
  let travelerType: any = undefined;
  let travelerCount: number | undefined = undefined;
  if (lower.includes('girlfriend') || lower.includes('boyfriend') || lower.includes('partner') || lower.includes('husband') || lower.includes('wife') || lower.includes('couple') || lower.includes('honeymoon') || lower.includes('anniversary')) {
    travelerType = 'couple';
    travelerCount = 2;
  } else if (lower.includes('friends') || lower.includes('buddies') || lower.includes('mates')) {
    travelerType = 'friends';
    travelerCount = 3;
  } else if (lower.includes('family') || lower.includes('kids') || lower.includes('children')) {
    travelerType = 'family';
    travelerCount = 4;
  } else if (lower.includes('solo') || lower.includes('alone') || lower.includes('myself') || lower.includes('by myself')) {
    travelerType = 'solo';
    travelerCount = 1;
  }

  // Date / Month extraction
  let startMonth: string | undefined = undefined;
  const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
  for (const m of months) {
    if (lower.includes(m)) {
      startMonth = m.charAt(0).toUpperCase() + m.slice(1);
      break;
    }
  }

  // Travel styles extraction
  const styles: string[] = [];
  if (lower.includes('romantic') || lower.includes('honeymoon') || lower.includes('anniversary')) styles.push('Romantic Getaway');
  if (lower.includes('nature') || lower.includes('waterfall') || lower.includes('lush') || lower.includes('mountain')) styles.push('Nature & Landscapes');
  if (lower.includes('hidden gem') || lower.includes('quiet') || lower.includes('secret') || lower.includes('offbeat') || lower.includes('not crowded') || lower.includes('hate crowd')) styles.push('Hidden Gems');
  if (lower.includes('adventure') || lower.includes('hike') || lower.includes('trek') || lower.includes('surf') || lower.includes('outdoor')) styles.push('Adventure & Outdoors');
  if (lower.includes('food') || lower.includes('cuisine') || lower.includes('eat') || lower.includes('culinary') || lower.includes('coffee')) styles.push('Food & Local Life');
  if (lower.includes('beach') || lower.includes('coast') || lower.includes('ocean') || lower.includes('relax')) styles.push('Beach & Relaxation');
  if (lower.includes('culture') || lower.includes('temple') || lower.includes('history') || lower.includes('shrine')) styles.push('Culture & History');
  if (lower.includes('luxury') || lower.includes('boutique') || lower.includes('spa')) styles.push('Luxury & Wellness');
  if (lower.includes('budget') || lower.includes('backpacker') || lower.includes('cheap') || lower.includes('not too expensive')) styles.push('Budget & Backpacker');

  // Budget
  let budget: any = undefined;
  if (lower.includes('luxury') || lower.includes('5 star') || lower.includes('high end')) budget = 'luxury';
  else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('not too expensive') || lower.includes('affordable')) budget = 'budget';
  else if (lower.includes('moderate') || lower.includes('balanced')) budget = 'moderate';

  // Pace
  let pace: any = undefined;
  if (lower.includes('relax') || lower.includes('slow') || lower.includes("don't want to spend the entire day") || lower.includes('leisure')) pace = 'relaxed';
  else if (lower.includes('packed') || lower.includes('fast') || lower.includes('see everything')) pace = 'fast_paced';

  const meta = POPULAR_DESTINATIONS[destKey] || POPULAR_DESTINATIONS.bali;

  const inferredPreferences: { field: string; value: string; reason: string }[] = [];
  const assumptionsMade: { field: string; value: string; reason: string; source: any }[] = [];

  if (lower.includes('romantic') || travelerType === 'couple') {
    inferredPreferences.push({
      field: 'Vibe',
      value: 'Romantic & Scenic',
      reason: 'Inferred from couple / romantic vacation context',
    });
  }

  if (lower.includes('hate crowd') || lower.includes('not crowded') || lower.includes('quiet')) {
    inferredPreferences.push({
      field: 'Crowd Preference',
      value: 'Avoid Crowded Spots',
      reason: 'Explicitly requested serene, less congested locations',
    });
  }

  if (!durationDays) {
    assumptionsMade.push({
      field: 'Duration',
      value: '7 Days',
      reason: `Recommended duration for a balanced first-time trip to ${destName}`,
      source: 'ai_recommended',
    });
  }

  if (!budget) {
    assumptionsMade.push({
      field: 'Budget',
      value: 'Moderate',
      reason: 'Default balanced standard with boutique stays and quality local dining',
      source: 'ai_recommended',
    });
  }

  if (!pace) {
    assumptionsMade.push({
      field: 'Pace',
      value: 'Balanced',
      reason: '2-3 key highlights per day with ample leisure and dining buffer',
      source: 'default',
    });
  }

  return {
    destination: destName,
    destinationDetails: {
      country,
      region,
      tagline,
      imageUrl,
    },
    extractedInfo: {
      dates: startMonth ? { startMonth, isFlexible: true } : undefined,
      durationDays,
      travelerCount,
      travelerType,
      travelStyles: styles.length > 0 ? styles : undefined,
      budget,
      pace,
      accommodation: undefined,
      specialPreferences: lower.includes('hate crowd') || lower.includes('quiet') ? ['Avoid overcrowded tourist traps'] : undefined,
    },
    inferredPreferences,
    assumptionsMade,
    aiGreeting: `${destName} sounds like a fantastic destination!`,
    aiInsight: `If your dates are flexible, ${meta.recommendedMonths[0]?.month || 'May'} is a standout time with balanced weather, comfortable crowds, and great value.`,
    recommendedMonths: meta.recommendedMonths,
    recommendedDurations: meta.recommendedDurations,
  };
}

// 1. API: Natural Language Input Analyzer
app.post('/api/ai/analyze-input', async (req, res) => {
  try {
    const { input } = req.body;
    if (!input || typeof input !== 'string') {
      return res.status(400).json({ error: 'Input text is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Offline / Demo fallback
      const fallbackResult = fallbackAnalyzeInput(input);
      return res.json(fallbackResult);
    }

    // Call Gemini for structured extraction with resilient fallback
    const prompt = `You are a world-class travel planner operating on the principle: "ASK LESS. HELP MORE."
Analyze the user's trip request: "${input}".
Extract known entities, infer subtle preferences (e.g., couple -> romantic, hates crowds -> hidden gems, don't spend whole day traveling -> relaxed pace), and generate recommendations.

Respond in strict JSON with the following schema:
{
  "destination": "Destination name",
  "destinationDetails": {
    "country": "Country",
    "region": "Region",
    "tagline": "Engaging 1-sentence tagline"
  },
  "extractedInfo": {
    "dates": {
      "startMonth": "Month string if mentioned or null",
      "startDate": "YYYY-MM-DD or null",
      "endDate": "YYYY-MM-DD or null",
      "isFlexible": true
    },
    "durationDays": 7 or null,
    "travelerCount": 2 or null,
    "travelerType": "solo" | "couple" | "friends" | "family" | "group" | "not_sure" or null,
    "travelStyles": ["Romantic Getaway", "Nature & Landscapes"] or null,
    "budget": "budget" | "moderate" | "luxury" or null,
    "pace": "relaxed" | "balanced" | "fast_paced" or null,
    "specialPreferences": ["Avoid crowded tourist spots"]
  },
  "inferredPreferences": [
    { "field": "Traveler Type", "value": "Couple", "reason": "Mentioned boyfriend" }
  ],
  "assumptionsMade": [
    { "field": "Duration", "value": "7 Days", "reason": "Optimal duration for this destination", "source": "ai_recommended" }
  ],
  "aiGreeting": "Bali sounds incredible!",
  "aiInsight": "If your dates are flexible, May and June offer pristine weather and calm crowds.",
  "recommendedMonths": [
    {
      "month": "May",
      "title": "May",
      "weather": "Warm & dry",
      "crowds": "Moderate",
      "priceLevel": "Great value",
      "isRecommended": true,
      "badge": "Recommended",
      "description": "Ideal balance"
    }
  ],
  "recommendedDurations": [
    {
      "days": 7,
      "label": "6-7 Days",
      "highlight": "Recommended",
      "description": "Balanced first trip",
      "isRecommended": true
    }
  ]
}`;

    const text = await generateGeminiContentWithFallback(ai, {
      prompt,
      systemInstruction: 'You are an intelligent travel concierge. Extract information accurately and propose smart, helpful recommendations. Always return pure JSON.',
      responseMimeType: 'application/json',
    });

    if (text) {
      try {
        const parsed = JSON.parse(text);
        // Attach hero image if standard
        const destKey = (parsed.destination || '').toLowerCase();
        for (const [key, val] of Object.entries(POPULAR_DESTINATIONS)) {
          if (destKey.includes(key) || key.includes(destKey)) {
            parsed.destinationDetails = {
              ...parsed.destinationDetails,
              imageUrl: val.heroImage,
            };
            break;
          }
        }
        if (!parsed.destinationDetails?.imageUrl) {
          parsed.destinationDetails = {
            ...parsed.destinationDetails,
            imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
          };
        }
        return res.json(parsed);
      } catch (e) {
        console.warn('Gemini JSON parse failed, using fallback:', e);
      }
    }

    return res.json(fallbackAnalyzeInput(input));
  } catch (error) {
    console.error('Error in /api/ai/analyze-input:', error);
    return res.json(fallbackAnalyzeInput(req.body?.input || 'Bali'));
  }
});

// Helper to build realistic mock itineraries for any destination
function buildFallbackItinerary(tripProfile: any) {
  const dest = tripProfile.destination?.value || 'Bali';
  const duration = tripProfile.durationDays?.value || 7;
  const styles = tripProfile.travelStyles?.value || ['Nature & Landscapes', 'Romantic Getaway', 'Hidden Gems'];
  const travelerType = tripProfile.travelerType?.value || 'couple';
  const pace = tripProfile.pace?.value || 'balanced';
  const budget = tripProfile.budget?.value || 'moderate';
  const datesDesc = tripProfile.dates?.value?.startMonth || 'May (Recommended)';

  const days: any[] = [];
  const areasByDest: Record<string, string[]> = {
    Bali: ['Ubud & Cultural Highlands', 'Sidemen Valley & Waterfalls', 'Jatiluwih & Bedugul', 'Uluwatu & Southern Cliffs', 'Canggu & Coastal Sunset', 'Nusa Lembongan Escape', 'Seminyak & Gastronomy'],
    'Tokyo & Kyoto': ['Shinjuku & Meiji Shrine', 'Asakusa & Old Tokyo Yanaka', 'Shibuya & Harajuku Hidden Alleys', 'Kyoto Gion & Higashiyama', 'Arashiyama Bamboo & Riverboat', 'Fushimi Inari & Nara Deer Park', 'Ginza & Tsukiji Culinary Trail'],
    Paris: ['Le Marais & Historic Courtyards', 'Saint-Germain & Seine Riverbanks', 'Montmartre Secret Passages', 'Palais-Royal & Louvre Gardens', 'Canal Saint-Martin & Belleville', 'Versailles Orangerie & Gardens', 'Latin Quarter & Luxembourg Gardens'],
    Goa: ['Fontainhas Latin Quarter', 'Assagao Bohemian Cafes & Shacks', 'Cola Beach Fresh Water Lagoon', 'Divar Island Countryside Ferry', 'Palolem Serene Crescent Beach', 'Spice Plantation & Dudhsagar', 'Chapora Fort & Sunset Shacks'],
    Kerala: ['Fort Kochi Colonial Heritage', 'Munnar Misty Tea Hills', 'Kolukkumalai Sunrise Safari', 'Thekkady Cardamom Trails', 'Alleppey Emerald Backwaters', 'Marari Serene Fisher Village', 'Varkala Cliffside Sunset'],
    'Sri Lanka': ['Sigiriya Ancient Lion Rock', 'Dambulla Cave Temples', 'Kandy Sacred Tooth Temple', 'Scenic Blue Mountain Train to Ella', 'Nine Arch Bridge & Little Adam Peak', 'Yala Wildlife Leopard Safari', 'Galle Dutch Colonial Fortress'],
    'Amalfi Coast': ['Positano Pastel Clifftops', 'Path of the Gods Hike', 'Ravello Villa Cimbrone Gardens', 'Capri Island Private Grotto Cruise', 'Amalfi Town & Lemon Groves', 'Praiano Quiet Sunset Cove', 'Sorrento Historic Marina Grande'],
  };

  const areas = areasByDest[dest] || [
    `${dest} Historic Center`,
    `${dest} Scenic Nature Reserve`,
    `${dest} Secret Old Quarter`,
    `${dest} Coastal & Sunset Vistas`,
    `${dest} Culinary & Artisan Trail`,
    `${dest} Mountain Viewpoints`,
    `${dest} Leisure & Relaxation Haven`,
  ];

  for (let i = 1; i <= duration; i++) {
    const area = areas[(i - 1) % areas.length];
    days.push({
      dayNumber: i,
      dayTitle: i === 1 ? `Arrival, Unwind & Sunset Welcome` : i === duration ? `Farewell Leisure, Artisan Crafts & Departure` : `${area} Highlights`,
      area: area,
      theme: styles.slice(0, 2).join(' & ') || 'Culture & Relaxation',
      summary: `A carefully balanced day in ${area} combining scenic vistas, delicious local flavors, and relaxed exploration.`,
      highlightActivity: i === 1 ? `Scenic Golden Hour Welcome Dinner` : `${area} Guided Immersion`,
      dayPace: pace === 'relaxed' ? 'Relaxed' : pace === 'fast_paced' ? 'Active' : 'Balanced',
      stayAreaRecommendation: `Boutique villa / hotel in ${area}`,
      activities: [
        {
          id: `d${i}-act1`,
          timeSlot: 'Morning',
          timeRange: '08:30 AM - 11:00 AM',
          title: i === 1 ? 'Arrival, Check-in & Refreshment' : `Morning Discovery at ${area}`,
          category: 'Nature',
          location: `${area} Scenic Point`,
          area: area,
          description: i === 1 ? `Arrive, settle into your boutique stay, and enjoy a tropical welcome drink.` : `Beat the mid-day heat with a serene morning stroll through lush surroundings and viewpoint lookouts.`,
          duration: '2.5 hrs',
          costEstimate: '$10 - $20 / person',
          transport: {
            type: 'Taxi / Grab',
            duration: '15 mins',
            distanceFromPrev: '1.5 km',
          },
          whySelected: `Selected because you prefer ${styles[0] || 'nature'} with comfortable, unhurried pacing.`,
          insiderTip: 'Early mornings offer the clearest light for photography and zero tour bus crowds.',
        },
        {
          id: `d${i}-act2`,
          timeSlot: 'Afternoon',
          timeRange: '12:30 PM - 03:00 PM',
          title: `Artisan Lunch & Hidden Culture Trail`,
          category: 'Culture',
          location: `${area} Old Town & Local Eatery`,
          area: area,
          description: `Enjoy authentic regional specialties prepared with farm-fresh organic ingredients, followed by quiet village exploration.`,
          duration: '2.5 hrs',
          costEstimate: '$15 - $30 / person',
          transport: {
            type: 'Walk',
            duration: '10 mins',
            distanceFromPrev: '600 m',
          },
          whySelected: 'Curated to avoid generic tourist restaurants in favor of family-run local culinary gems.',
          insiderTip: 'Ask the chef for their seasonal special of the day.',
        },
        {
          id: `d${i}-act3`,
          timeSlot: 'Evening',
          timeRange: '05:00 PM - 07:00 PM',
          title: `Golden Hour Sunset Vistas`,
          category: 'Romantic',
          location: `${area} Clifftop / Waterfront Panorama`,
          area: area,
          description: `Relax with sweeping views as the sun sinks beneath the horizon, accompanied by acoustic music and chilled refreshments.`,
          duration: '2 hrs',
          costEstimate: 'Free / $10 beverage',
          transport: {
            type: 'Private Driver',
            duration: '20 mins',
            distanceFromPrev: '4 km',
          },
          whySelected: `Matched with your preference for romantic, picturesque moments.`,
          insiderTip: 'Arrive 30 minutes before sunset to secure the coziest front-row seating.',
        },
        {
          id: `d${i}-act4`,
          timeSlot: 'Dinner',
          timeRange: '07:30 PM - 09:30 PM',
          title: `Intimate Candlelit Dining Experience`,
          category: 'Food & Drink',
          location: `${area} Garden Sanctuary`,
          area: area,
          description: `A memorable evening dining experience featuring traditional tasting menus and locally sourced ingredients.`,
          duration: '2 hrs',
          costEstimate: '$25 - $50 / person',
          transport: {
            type: 'Walk',
            duration: '5 mins',
            distanceFromPrev: '300 m',
          },
          whySelected: 'Hand-picked for exceptional ambiance, warm hospitality, and rave reviews.',
          insiderTip: 'Reservations are recommended for outdoor garden tables.',
        },
      ],
    });
  }

  return {
    id: `trip-${Date.now()}`,
    tripTitle: `Your ${duration}-Day ${dest} Adventure`,
    destination: dest,
    country: tripProfile.destinationDetails?.country || 'Indonesia',
    datesDescription: datesDesc,
    durationDays: duration,
    travelerSummary: `${tripProfile.travelerCount?.value || 2} Travelers (${travelerType.toUpperCase()})`,
    travelStyles: styles,
    budgetLevel: budget.toUpperCase(),
    pace: pace.toUpperCase(),
    heroImageUrl: tripProfile.destinationDetails?.imageUrl || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    overview: `A bespoke ${duration}-day journey crafted around ${styles.join(', ')}. From peaceful mornings to unforgettable golden hour sunsets, every day balances exploration with relaxation.`,
    whyWeChoseThis: `Because you requested ${styles.join(' and ')} with a ${pace} pace, we clustered activities geographically to minimize transit stress and prioritized quieter, authentic experiences over crowded tourist centers.`,
    matchedPreferences: [
      `Prioritized ${styles[0] || 'nature'} spots with high peacefulness ratings`,
      `Clustered activities geographically to keep transit under 30 mins`,
      `Set dining at authentic local favorites rather than tourist traps`,
      `Paced with afternoon leisure buffers to prevent travel fatigue`,
    ],
    days,
    essentialTips: {
      bestTransport: 'Pre-arranged drivers and local ride-hail apps are the most hassle-free.',
      localEtiquette: 'Dress respectfully when entering temples and shrines. Carry cash for small local stalls.',
      currencyAndTipping: 'Tipping 5-10% is customary for great service at sit-down dining.',
      weatherNote: 'Tropical and sunny with cool evening ocean breezes.',
      packingMustHaves: ['Breathable linen clothing', 'Comfortable walking sandals', 'Sunscreen & insect spray', 'Universal travel adapter'],
    },
    createdAt: Date.now(),
  };
}

// 2. API: Generate Complete Itinerary
app.post('/api/ai/generate-itinerary', async (req, res) => {
  try {
    const { tripProfile } = req.body;
    if (!tripProfile) {
      return res.status(400).json({ error: 'Trip profile is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Return rich handcrafted fallback
      const fallback = buildFallbackItinerary(tripProfile);
      return res.json(fallback);
    }

    const dest = tripProfile.destination?.value || 'Bali';
    const duration = tripProfile.durationDays?.value || 7;
    const styles = (tripProfile.travelStyles?.value || []).join(', ') || 'Nature, Hidden Gems, Romantic';
    const travelerType = tripProfile.travelerType?.value || 'couple';
    const budget = tripProfile.budget?.value || 'moderate';
    const pace = tripProfile.pace?.value || 'balanced';
    const special = (tripProfile.specialPreferences?.value || []).join(', ') || 'None specified';

    const prompt = `You are an elite travel concierge. Generate an unforgettable, day-by-day itinerary strictly adhering to the user's trip profile:
Destination: ${dest}
Duration: ${duration} days
Traveler Type: ${travelerType} (${tripProfile.travelerCount?.value || 2} travelers)
Travel Styles / Interests: ${styles}
Budget Level: ${budget}
Travel Pace: ${pace}
Special Preferences / Constraints: ${special}

Instructions:
1. Provide exactly ${duration} days.
2. For each day, provide 3 to 4 sequential activities (Morning, Afternoon, Evening, Dinner) with specific names, real local areas, concise descriptions, transport details, and "whySelected" reflecting user preferences.
3. Include an engaging "whyWeChoseThis" rationale explaining how their preferences shaped the route.
4. Return strict valid JSON.`;

    const text = await generateGeminiContentWithFallback(ai, {
      prompt,
      systemInstruction: 'You are an award-winning travel itinerary designer. Always output realistic, localized, perfectly paced itineraries in valid JSON.',
      responseMimeType: 'application/json',
    });

    if (text) {
      try {
        const parsed = JSON.parse(text);
        if (!parsed.heroImageUrl) {
          const destKey = dest.toLowerCase();
          parsed.heroImageUrl = POPULAR_DESTINATIONS[destKey]?.heroImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80';
        }
        parsed.id = parsed.id || `trip-${Date.now()}`;
        parsed.createdAt = Date.now();
        return res.json(parsed);
      } catch (e) {
        console.warn('Gemini JSON parse failed, returning robust fallback:', e);
      }
    }
    return res.json(buildFallbackItinerary(tripProfile));
  } catch (error) {
    console.error('Error generating itinerary:', error);
    return res.json(buildFallbackItinerary(req.body?.tripProfile || {}));
  }
});

// 3. API: Refine Itinerary
app.post('/api/ai/refine-itinerary', async (req, res) => {
  try {
    const { itinerary, refinementType, customPrompt, tripProfile } = req.body;
    if (!itinerary) {
      return res.status(400).json({ error: 'Current itinerary is required' });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Modify fallback dynamically
      const updated = JSON.parse(JSON.stringify(itinerary));
      const refDesc = customPrompt || refinementType || 'Personalized refinement';

      updated.whyWeChoseThis = `${updated.whyWeChoseThis} (Updated based on refinement: "${refDesc}")`;
      updated.matchedPreferences = updated.matchedPreferences || [];
      updated.matchedPreferences.push(`Applied modification: ${refDesc}`);

      // Adjust activities slightly
      if (updated.days && updated.days.length > 0) {
        updated.days.forEach((day: any) => {
          if (refinementType?.toLowerCase().includes('beach')) {
            day.activities[1] = {
              ...day.activities[1],
              title: `Secluded Coastal Cove & Swimming`,
              category: 'Nature',
              description: `Relax on uncrowded golden sands with crystal clear calm waters and refreshing coconut drinks.`,
              whySelected: `Updated to include more pristine beach time.`,
            };
          } else if (refinementType?.toLowerCase().includes('romantic')) {
            day.activities[2] = {
              ...day.activities[2],
              title: `Private Clifftop Sunset Lounge`,
              category: 'Romantic',
              description: `Enjoy champagne and artisanal bites with panoramic ocean sunset views.`,
              whySelected: `Enhanced for ultimate romantic ambiance.`,
            };
          } else if (refinementType?.toLowerCase().includes('adventure')) {
            day.activities[0] = {
              ...day.activities[0],
              title: `Sunrise Jungle Trek & Waterfall Splash`,
              category: 'Adventure',
              description: `An invigorating outdoor trail leading to a hidden secluded waterfall pool.`,
              whySelected: `Added higher energy adventure activities.`,
            };
          } else if (refinementType?.toLowerCase().includes('cheap') || refinementType?.toLowerCase().includes('budget')) {
            day.activities.forEach((act: any) => {
              act.costEstimate = 'Free / Under $10';
            });
          }
        });
      }

      return res.json(updated);
    }

    const prompt = `You are modifying an existing travel itinerary.
Current Itinerary Destination: ${itinerary.destination}
Duration: ${itinerary.durationDays} days
Requested Refinement: "${refinementType || ''}"
Custom User Instructions: "${customPrompt || ''}"

Current Itinerary JSON:
${JSON.stringify(itinerary, null, 2)}

Instructions:
1. Modify the activities, pacing, and recommendations to directly fulfill the refinement request while preserving the overall trip coherence.
2. Update "whyWeChoseThis" and "matchedPreferences" to reflect the new changes.
3. Return the COMPLETE updated itinerary as strict valid JSON adhering to the same schema.`;

    const text = await generateGeminiContentWithFallback(ai, {
      prompt,
      systemInstruction: 'You are an expert travel editor. Always modify itineraries intelligently while maintaining consistency. Return pure JSON.',
      responseMimeType: 'application/json',
    });

    if (text) {
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch (e) {
        console.warn('Gemini JSON parse failed on refinement:', e);
      }
    }
    return res.json(itinerary);
  } catch (error) {
    console.error('Error refining itinerary:', error);
    return res.json(req.body?.itinerary || {});
  }
});

// Vite Middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Travel Planner Server running on http://localhost:${PORT}`);
  });
}

startServer();
