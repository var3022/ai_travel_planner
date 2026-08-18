import { MonthRecommendation, DurationRecommendation } from '../types';

export interface DestinationMeta {
  id: string;
  name: string;
  country: string;
  region: string;
  tagline: string;
  heroImage: string;
  accentColor: string;
  recommendedMonths: MonthRecommendation[];
  recommendedDurations: DurationRecommendation[];
  popularStyles: string[];
  sampleHighlights: string[];
  currency: string;
  transportTip: string;
  etiquetteTip: string;
}

export const TRAVEL_STYLES = [
  { id: 'beach', name: 'Beach & Relaxation', icon: 'Umbrella', desc: 'Coastal serenity, sun, and turquoise waters' },
  { id: 'adventure', name: 'Adventure & Outdoors', icon: 'Compass', desc: 'Hiking, water sports, and thrill-seeking' },
  { id: 'nature', name: 'Nature & Landscapes', icon: 'Trees', desc: 'Waterfalls, volcanoes, lush greenery' },
  { id: 'hidden_gems', name: 'Hidden Gems', icon: 'Sparkles', desc: 'Off-the-beaten-path secret spots and quiet vistas' },
  { id: 'food', name: 'Food & Local Life', icon: 'Utensils', desc: 'Night markets, street eats, farm-to-table dining' },
  { id: 'culture', name: 'Culture & History', icon: 'Landmark', desc: 'Ancient temples, architecture, and living traditions' },
  { id: 'romantic', name: 'Romantic Getaway', icon: 'Heart', desc: 'Sunset viewpoints, intimate dinners, cozy stays' },
  { id: 'nightlife', name: 'Nightlife & Social', icon: 'PartyPopper', desc: 'Beach clubs, speakeasies, vibrant evenings' },
  { id: 'photography', name: 'Photography & Vistas', icon: 'Camera', desc: 'Golden hour vantage points and dramatic scenery' },
  { id: 'luxury', name: 'Luxury & Wellness', icon: 'Crown', desc: 'Spas, boutique villas, private charters' },
  { id: 'budget', name: 'Budget & Backpacker', icon: 'Wallet', desc: 'High-value hostels, local transport, free sights' },
  { id: 'spiritual', name: 'Spiritual & Mindfulness', icon: 'Flower2', desc: 'Yoga retreats, meditation centers, quiet shrines' },
  { id: 'wildlife', name: 'Wildlife & Safari', icon: 'PawPrint', desc: 'Animal sanctuaries, diving, bird watching' },
  { id: 'road_trip', name: 'Road Trip & Scenic Drives', icon: 'Car', desc: 'Coastal highways, mountain passes, freedom to roam' },
  { id: 'surprise_me', name: 'Surprise Me', icon: 'HelpCircle', desc: 'Let our AI curate an unexpected, balanced blend' },
];

export const POPULAR_DESTINATIONS: Record<string, DestinationMeta> = {
  bali: {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    tagline: 'Island of the Gods, emerald terraces & spiritual retreats',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'emerald',
    recommendedMonths: [
      {
        month: 'May',
        title: 'May',
        weather: 'Sunny, low humidity & gentle breezes',
        crowds: 'Moderate crowds before summer peak',
        priceLevel: 'Great overall value',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Ideal dry season start with lush post-rain landscapes and minimal congestion.'
      },
      {
        month: 'June',
        title: 'June',
        weather: 'Sunny & pleasant coastal winds',
        crowds: 'Slightly busier as holidays approach',
        priceLevel: 'Moderate rates',
        isRecommended: true,
        description: 'Great beach weather, vibrant cafe scene, and excellent diving visibility.'
      },
      {
        month: 'July - August',
        title: 'July - Aug',
        weather: 'Crisp, sunny & dry',
        crowds: 'High season crowds',
        priceLevel: 'Peak season rates',
        isRecommended: false,
        description: 'Festive energy and peak dry weather, but requires early bookings for popular spots.'
      },
      {
        month: 'September - October',
        title: 'Sep - Oct',
        weather: 'Warm with occasional evening showers',
        crowds: 'Calmer shoulder season',
        priceLevel: 'Excellent discounts',
        isRecommended: true,
        badge: 'Smart Pick',
        description: 'Warm ocean water, calm temples, and discounted boutique accommodations.'
      }
    ],
    recommendedDurations: [
      {
        days: 5,
        label: '4 - 5 Days',
        highlight: 'Highlights Sprint',
        description: 'Perfect for Ubud cultural heart and southern sunset cliffs (Uluwatu).',
        isRecommended: false
      },
      {
        days: 7,
        label: '6 - 7 Days',
        highlight: 'Recommended First Trip',
        description: 'Balanced pace: Ubud rainforests, Sidemen rice valleys, and Canggu / Uluwatu coast.',
        isRecommended: true
      },
      {
        days: 10,
        label: '8 - 10 Days',
        highlight: 'Deep & Immersive',
        description: 'Slow travel across Ubud, northern waterfalls (Munduk), and offshore Nusa Penida island.',
        isRecommended: false
      }
    ],
    popularStyles: ['Nature', 'Romantic', 'Hidden Gems', 'Culture', 'Beach & Relaxation'],
    sampleHighlights: ['Tegallalang Hidden Rice Terraces', 'Sidemen Valley Peaceful Walk', 'Uluwatu Cliffside Sunset', 'Jatiluwih UNESCO Terraces'],
    currency: 'IDR (Indonesian Rupiah)',
    transportTip: 'Private day drivers or Grab/Gojek apps are comfortable and very affordable.',
    etiquetteTip: 'Wear a sarong and sash when visiting sacred temples; respect daily offerings on the ground.'
  },
  tokyo: {
    id: 'tokyo',
    name: 'Tokyo & Kyoto',
    country: 'Japan',
    region: 'East Asia',
    tagline: 'Futuristic neon, centuries-old shrines & culinary mastery',
    heroImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'indigo',
    recommendedMonths: [
      {
        month: 'April',
        title: 'April',
        weather: 'Mild spring, cherry blossoms',
        crowds: 'Busy during sakura bloom',
        priceLevel: 'High demand',
        isRecommended: true,
        badge: 'Iconic Season',
        description: 'Cherry blossom magic across park walkways, historic moats, and riverbanks.'
      },
      {
        month: 'May',
        title: 'May',
        weather: 'Pleasant 20°C / 68°F, sunny',
        crowds: 'Comfortable post-Golden Week',
        priceLevel: 'Balanced value',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Green foliage, clear Mount Fuji views, and pleasant walking temperatures.'
      },
      {
        month: 'October - November',
        title: 'Oct - Nov',
        weather: 'Crisp autumn air & golden foliage',
        crowds: 'Moderate',
        priceLevel: 'Moderate to good',
        isRecommended: true,
        description: 'Stunning crimson maple leaves in gardens, comfortable walking weather.'
      }
    ],
    recommendedDurations: [
      {
        days: 6,
        label: '5 - 6 Days',
        highlight: 'Tokyo Focus',
        description: 'Explore modern Shibuya/Shinjuku, historic Asakusa, and hidden Yanaka district.',
        isRecommended: false
      },
      {
        days: 8,
        label: '7 - 8 Days',
        highlight: 'Tokyo + Kyoto Classic',
        description: 'The golden route: 4 days in vibrant Tokyo and 4 days in traditional Kyoto/Nara.',
        isRecommended: true
      },
      {
        days: 12,
        label: '10 - 12 Days',
        highlight: 'Complete Journey',
        description: 'Tokyo, Hakone onsen ryokan, Kyoto shrines, and culinary food streets of Osaka.',
        isRecommended: false
      }
    ],
    popularStyles: ['Culture & History', 'Food & Local Life', 'Photography & Vistas', 'Hidden Gems'],
    sampleHighlights: ['Yanaka Ginza retro district', 'Meiji J Shrine quiet morning walk', 'Gion hidden lantern alleys', 'Fushimi Inari mountain hike'],
    currency: 'JPY (Japanese Yen)',
    transportTip: 'Suica/Pasmo IC cards on iPhone or physical card make metro & bullet trains effortless.',
    etiquetteTip: 'Quiet on public transit, avoid walking while eating, and keep trash in your bag.'
  },
  paris: {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    region: 'Western Europe',
    tagline: 'Artistic elegance, romantic boulevards & cafe culture',
    heroImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'rose',
    recommendedMonths: [
      {
        month: 'May',
        title: 'May',
        weather: 'Warm spring, long daylight',
        crowds: 'Moderate',
        priceLevel: 'Standard European rates',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Gardens in full bloom, sidewalk cafe seating, and late evening golden hours.'
      },
      {
        month: 'September - October',
        title: 'Sep - Oct',
        weather: 'Pleasant crisp autumn breezes',
        crowds: 'Calmer post-summer vibe',
        priceLevel: 'Moderate value',
        isRecommended: true,
        badge: 'Smart Pick',
        description: 'Vibrant art exhibitions, wine harvest season, and warm romantic atmosphere.'
      }
    ],
    recommendedDurations: [
      {
        days: 4,
        label: '3 - 4 Days',
        highlight: 'Essential City Break',
        description: 'Louvre/Orsay, Eiffel Tower, Saint-Germain-des-Prés, and Montmartre.',
        isRecommended: false
      },
      {
        days: 6,
        label: '5 - 6 Days',
        highlight: 'Recommended Stroll',
        description: 'Balanced mix of iconic monuments, Marais boutiques, Canal Saint-Martin, and Versailles day trip.',
        isRecommended: true
      },
      {
        days: 8,
        label: '7 - 8 Days',
        highlight: 'Leisurely Parisian Life',
        description: 'Deep neighborhood immersion, cooking workshops, and Champagne region day trip.',
        isRecommended: false
      }
    ],
    popularStyles: ['Romantic Getaway', 'Culture & History', 'Food & Local Life', 'Photography & Vistas'],
    sampleHighlights: ['Palais-Royal quiet arcades', 'Le Marais historic courtyards', 'Seine sunset river picnic', 'Montmartre secret vineyard'],
    currency: 'EUR (Euros)',
    transportTip: 'The Paris Metro and walking are fastest; use contactless bank card or Navigo Easy.',
    etiquetteTip: 'Always greet shopkeepers with a friendly "Bonjour Madame/Monsieur" upon entering.'
  },
  goa: {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    region: 'South Asia',
    tagline: 'Portuguese heritage, sun-drenched coves & bohemian spirit',
    heroImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'amber',
    recommendedMonths: [
      {
        month: 'November - February',
        title: 'Nov - Feb',
        weather: 'Sunny, pleasant breezes, cool evenings',
        crowds: 'Lively holiday season',
        priceLevel: 'Standard to peak rates',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Perfect beach weather, open-air flea markets, and calm Arabian Sea water.'
      },
      {
        month: 'March - April',
        title: 'Mar - Apr',
        weather: 'Warm and sunny',
        crowds: 'Calm and peaceful',
        priceLevel: 'Great value deals',
        isRecommended: true,
        description: 'Quiet beaches, sunset beach shacks, and discounted luxury heritage villas.'
      }
    ],
    recommendedDurations: [
      {
        days: 4,
        label: '3 - 4 Days',
        highlight: 'Quick Coast Escape',
        description: 'Explore North Goa beach shacks or South Goa quiet sands.',
        isRecommended: false
      },
      {
        days: 6,
        label: '5 - 6 Days',
        highlight: 'North & South Blend',
        description: 'Fontainhas Latin Quarter heritage, spice plantations, and serene Palolem beaches.',
        isRecommended: true
      }
    ],
    popularStyles: ['Beach & Relaxation', 'Food & Local Life', 'Hidden Gems', 'Nightlife & Social'],
    sampleHighlights: ['Fontainhas colorful Portuguese quarters', 'Cola Beach hidden fresh water lagoon', 'Divar Island peaceful ferry cycle', 'Assagao bohemian cafes'],
    currency: 'INR (Indian Rupee)',
    transportTip: 'Renting a scooter or booking pre-paid airport taxis via GoaMiles is very popular.',
    etiquetteTip: 'Respect local village privacy outside resort beaches; carry cash for small beach shacks.'
  },
  kerala: {
    id: 'kerala',
    name: 'Kerala',
    country: 'India',
    region: 'South Asia',
    tagline: "God's Own Country, emerald backwaters & misty tea hills",
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'teal',
    recommendedMonths: [
      {
        month: 'October - March',
        title: 'Oct - Mar',
        weather: 'Pleasant tropical breeze, cool hill stations',
        crowds: 'Moderate',
        priceLevel: 'Balanced',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Crisp morning air in Munnar tea hills and ideal conditions for backwater cruising.'
      }
    ],
    recommendedDurations: [
      {
        days: 5,
        label: '4 - 5 Days',
        highlight: 'Backwaters & Fort Kochi',
        description: 'Heritage walk in Fort Kochi and an overnight traditional houseboat in Alleppey.',
        isRecommended: false
      },
      {
        days: 7,
        label: '6 - 7 Days',
        highlight: 'Hills & Backwaters Classic',
        description: 'Fort Kochi colonial art, Munnar emerald tea estates, Thekkady spices, and Alleppey houseboats.',
        isRecommended: true
      }
    ],
    popularStyles: ['Nature & Landscapes', 'Romantic Getaway', 'Spiritual & Mindfulness', 'Culture & History'],
    sampleHighlights: ['Alleppey peaceful village canoe ride', 'Munnar Kolukkumalai sunrise jeep trek', 'Fort Kochi Kathakali performance', 'Marari quiet beach sunset'],
    currency: 'INR (Indian Rupee)',
    transportTip: 'Hiring a private AC car with driver for the whole circuit is relaxing and economical.',
    etiquetteTip: 'Sample traditional meals on banana leaves with right hand; dress modestly in temple towns.'
  },
  sri_lanka: {
    id: 'sri_lanka',
    name: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'South Asia',
    tagline: 'Ancient fortresses, scenic blue trains & golden coastlines',
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'sky',
    recommendedMonths: [
      {
        month: 'December - April',
        title: 'Dec - Apr',
        weather: 'Sunny on South and West coasts & Hill Country',
        crowds: 'Moderate',
        priceLevel: 'Great value',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Perfect for surf beaches, wildlife safaris in Yala, and scenic train rides.'
      }
    ],
    recommendedDurations: [
      {
        days: 7,
        label: '6 - 7 Days',
        highlight: 'Cultural Triangle & Coast',
        description: 'Sigiriya rock fortress, Kandy, scenic Ella train, and Galle Dutch Fort.',
        isRecommended: true
      },
      {
        days: 10,
        label: '9 - 10 Days',
        highlight: 'Complete Island Loop',
        description: 'Wildlife safari in Yala/Udawalawe, tea plantations, and southern surf towns.',
        isRecommended: false
      }
    ],
    popularStyles: ['Adventure & Outdoors', 'Nature & Landscapes', 'Culture & History', 'Wildlife & Safari'],
    sampleHighlights: ['Sigiriya Lion Rock sunrise', 'Kandy to Ella mountain railway', 'Galle Fort cobblestone walk', 'Mirissa whale watching'],
    currency: 'LKR (Sri Lankan Rupee)',
    transportTip: 'Private car with driver or 2nd class reserved scenic trains provide majestic views.',
    etiquetteTip: 'Do not take selfies with your back directly facing Buddha statues.'
  },
  amalfi: {
    id: 'amalfi',
    name: 'Amalfi Coast',
    country: 'Italy',
    region: 'Southern Europe',
    tagline: 'Pastel cliffside villages, azure waters & lemon groves',
    heroImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    accentColor: 'yellow',
    recommendedMonths: [
      {
        month: 'May - June',
        title: 'May - Jun',
        weather: 'Warm sunshine, fresh blossoms',
        crowds: 'Moderate before July rush',
        priceLevel: 'Moderate to high',
        isRecommended: true,
        badge: 'Recommended',
        description: 'Warm sea breeze, vibrant lemon groves, and ideal hiking along Path of the Gods.'
      },
      {
        month: 'September',
        title: 'September',
        weather: 'Warm sea, gentle breezes',
        crowds: 'Calming down',
        priceLevel: 'Good value',
        isRecommended: true,
        badge: 'Smart Pick',
        description: 'Perfect swimming conditions, romantic sunsets, and easier restaurant reservations.'
      }
    ],
    recommendedDurations: [
      {
        days: 5,
        label: '4 - 5 Days',
        highlight: 'Coastline Highlights',
        description: 'Positano, Amalfi town, and a day trip to magical Capri island.',
        isRecommended: true
      },
      {
        days: 7,
        label: '6 - 7 Days',
        highlight: 'Coast & Ravello Escape',
        description: 'Slower pace including Ravello cliff gardens and Path of the Gods trek.',
        isRecommended: false
      }
    ],
    popularStyles: ['Romantic Getaway', 'Photography & Vistas', 'Food & Local Life', 'Luxury & Wellness'],
    sampleHighlights: ['Path of the Gods clifftop trail', 'Villa Cimbrone infinity terrace in Ravello', 'Private Capri boat charter', 'Sunset spritz in Positano'],
    currency: 'EUR (Euros)',
    transportTip: 'Ferries between coastal towns avoid road traffic and offer spectacular sea views.',
    etiquetteTip: 'Dress smartly for evening dinners; book cliffside restaurants a few days ahead.'
  }
};

export const QUICK_PROMPTS = [
  {
    label: '✨ Bali Romance',
    text: 'I want to go to Bali for 7 days with my partner. We love nature, hidden gems, and romantic sunsets without crowded tourist traps.'
  },
  {
    label: '🌸 Japan Explorer',
    text: 'Tokyo and Kyoto in May. We are a couple who love incredible local food, peaceful shrines, and photography.'
  },
  {
    label: '🌊 Goa Chill',
    text: 'Trip to Goa with 2 friends. We want quiet beach coves, Portuguese heritage quarters, and great seafood.'
  },
  {
    label: '🍃 Kerala Backwaters',
    text: 'Kerala for 6 days. We want a relaxing trip with tea hills and houseboat backwaters.'
  },
  {
    label: '🚂 Sri Lanka Adventure',
    text: 'Backpacking Sri Lanka for 8 days on a moderate budget. Love wildlife safaris, scenic trains, and historic ruins.'
  },
  {
    label: '🍋 Amalfi Coast',
    text: 'Romantic vacation to Amalfi Coast for 5 days with scenic cliffside dining and Capri boat day.'
  }
];
