import { ELEVEN_LABS_API_KEY, GOOGLE_API_KEY, OPENAI_API_KEY, PEXELS_API_KEY } from '@env';

// TOGGLE THIS TO 'true' IF YOU RUN OUT OF API CREDITS DURING THE DEMO
const IS_MOCK_MODE = false; 

// --- MOCK DATA (5 Robust Items for Demo Safety) ---
const MOCK_RESULTS = [
  { place_id: '1', name: "Neon Burger", rating: 4.8, user_ratings_total: 320, vicinity: "123 Cyber Lane", photoUrl: null, distance: "0.2 km", travelTime: "5 mins", isOpen: true },
  { place_id: '2', name: "Tacos 2077", rating: 4.5, user_ratings_total: 150, vicinity: "45 Future St", photoUrl: null, distance: "0.5 km", travelTime: "10 mins", isOpen: true },
  { place_id: '3', name: "Pizza Glitch", rating: 4.2, user_ratings_total: 89, vicinity: "8-bit Avenue", photoUrl: null, distance: "1.2 km", travelTime: "18 mins", isOpen: false },
  { place_id: '4', name: "Quantum Sushi", rating: 4.9, user_ratings_total: 500, vicinity: "Mainframe Blvd", photoUrl: null, distance: "2.1 km", travelTime: "25 mins", isOpen: true },
  { place_id: '5', name: "Binary Bagels", rating: 4.0, user_ratings_total: 42, vicinity: "Coder's Alley", photoUrl: null, distance: "3.0 km", travelTime: "35 mins", isOpen: true },
];

const MOCK_MENU = [
  { id: '1', name: 'System Error Burger', description: 'Could not connect to AI. Check internet.', price: 0.00 }
];

// --- HELPER: FORMAT GOOGLE PHOTO URL ---
const getGooglePhotoUrl = (photoReference) => {
  if (!photoReference) return 'https://via.placeholder.com/400';
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${GOOGLE_API_KEY}`;
};

// ======================================================
// 1. MENU PARSING (GPT-4o Vision)
// ======================================================
export const parseMenuFromImage = async (base64Image) => {
  console.log("📸 Starting Menu Scan...");

  // Safety Check
  if (IS_MOCK_MODE) return MOCK_MENU;
  if (!OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY is missing");
    return MOCK_MENU;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a menu parser. Output strictly valid JSON. Return an object with an 'items' array. Each item: id, name, description, price (number). If price is missing, use 0."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Parse this menu text." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Image}`, detail: "low" } }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

    const parsedData = JSON.parse(data.choices[0].message.content);
    return parsedData.items || [];
  } catch (error) {
    console.error("❌ MENU PARSE FAILED:", error);
    return MOCK_MENU;
  }
};

// ======================================================
// 2. IMAGE FETCHING (Pexels)
// ======================================================
export const fetchItemImage = async (query) => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query} food&per_page=1`,
      { headers: { Authorization: PEXELS_API_KEY || '' } }
    );
    const data = await response.json();
    return data.photos?.[0]?.src?.medium || 'https://via.placeholder.com/400';
  } catch (e) {
    return 'https://via.placeholder.com/400';
  }
};

// ======================================================
// 3. RESTAURANT FINDER (GPT + Google Maps)
// ======================================================
export const findLocalFood = async (preferences, location) => {
  console.log(`🔎 Finding food: "${preferences}" near "${location}"`);

  if (IS_MOCK_MODE) {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_RESULTS), 1000));
  }

  try {
    // A. Ask GPT to convert "vibes" into a search query
    // e.g. "Romantic spots" -> "Romantic dinner restaurants"
    let searchQuery = preferences;
    if (OPENAI_API_KEY) {
      const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "Convert user food preferences into a concise Google Maps search query (e.g. 'Italian restaurants'). Return only the query string." },
            { role: "user", content: preferences }
          ]
        })
      });
      const gptData = await gptResponse.json();
      if (gptData.choices) {
        searchQuery = gptData.choices[0].message.content.trim();
      }
    }
    console.log(`🧠 AI Query: ${searchQuery}`);

    // B. Search Google Places (Text Search)
    const placesUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(searchQuery)} in ${encodeURIComponent(location)}&key=${GOOGLE_API_KEY}`;
    const placesRes = await fetch(placesUrl);
    const placesData = await placesRes.json();

    if (!placesData.results || placesData.results.length === 0) return [];

    // C. Slice Top 5 Results
    const top5Places = placesData.results.slice(0, 5);

    // D. Get Distances (Distance Matrix API)
    const destinations = top5Places.map(p => `place_id:${p.place_id}`).join('|');
    const distanceUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(location)}&destinations=${destinations}&units=metric&key=${GOOGLE_API_KEY}`;
    
    const distRes = await fetch(distanceUrl);
    const distData = await distRes.json();

    // E. Merge Data
    const enrichedResults = top5Places.map((place, index) => {
      const distanceInfo = distData.rows?.[0]?.elements?.[index];
      
      return {
        id: place.place_id, // Important for keys
        place_id: place.place_id,
        name: place.name,
        rating: place.rating || "New",
        reviewCount: place.user_ratings_total || 0,
        address: place.formatted_address,
        vicinity: place.vicinity || place.formatted_address, // Shorter address
        photoUrl: place.photos ? getGooglePhotoUrl(place.photos[0].photo_reference) : null,
        distance: distanceInfo?.status === 'OK' ? distanceInfo.distance.text : 'Unknown',
        travelTime: distanceInfo?.status === 'OK' ? distanceInfo.duration.text : '',
        isOpen: place.opening_hours?.open_now,
      };
    });

    return enrichedResults;

  } catch (error) {
    console.error("❌ Google Maps / API Error:", error);
    return MOCK_RESULTS; // Fallback to mock on crash
  }
};

// ... existing imports ...


// ... existing code (parseMenu, findLocalFood) ...

// 1. Generate the Menu Story (OpenAI)
export const generateMenuStory = async (menuItems) => {
  if (!menuItems || menuItems.length === 0) return "This menu looks delicious.";

  const itemsText = menuItems.map(i => i.name).join(", ");
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Fast and cheap
        messages: [
          { 
            role: "system", 
            content: "You are a gourmet narrator. Write a 30-second, mouth-watering story describing these menu items as if you are a chef presenting them to a guest. Keep it under 100 words." 
          },
          { role: "user", content: `Menu items: ${itemsText}` }
        ]
      })
    });
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.error("Story Gen Error:", e);
    return "Welcome to Menulator. This food looks absolutely amazing. You should definitely try the specials.";
  }
};

// 2. Turn Text to Audio (ElevenLabs)
export const textToSpeech = async (text) => {
  const VOICE_ID = 'pFZP5JQG7iQjIQuC4Bku'; // Your requested Voice ID
  const API_KEY = ELEVEN_LABS_API_KEY; // Ensure this is in your .env

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: { stability: 0.5, similarity_boost: 0.5 }
      })
    });

    if (!response.ok) throw new Error("ElevenLabs Error");

    // Return the audio as a blob/buffer that expo-av can play
    // Note: React Native handling of Blobs for audio can be tricky.
    // Ideally, for a hackathon, we save it to a file, but let's try returning the Base64.
    const blob = await response.blob();
    return blob; 
    
    // ALTERNATIVE HACKATHON APPROACH (If Blobs fail):
    // Just return the 'stream' URL if possible, or handle Base64 conversion in the screen.
  } catch (e) {
    console.error("TTS Error:", e);
    return null;
  }
};