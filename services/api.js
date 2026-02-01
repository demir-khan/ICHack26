// services/api.js
import { OPENAI_API_KEY, PEXELS_API_KEY } from '@env';

const IS_MOCK_MODE = false; 

const MOCK_MENU = [
  { id: '1', name: 'Network Error Burger', description: 'Could not connect to AI.', price: 0.00 }
];

export const parseMenuFromImage = async (base64Image) => {
  console.log("🚑 Starting Network Doctor...");

  // 1. TEST INTERNET CONNECTION
  try {
    console.log("1️⃣ Testing Internet...");
    const googleTest = await fetch('https://www.google.com');
    if (googleTest.ok) {
        console.log("✅ Internet is WORKING.");
    } else {
        throw new Error("Internet is down");
    }
  } catch (e) {
    console.error("❌ CRITICAL FAILURE: Your Simulator has NO INTERNET.", e);
    return MOCK_MENU;
  }

  // 2. CHECK KEY
  console.log("2️⃣ Checking Key...");
  if (!OPENAI_API_KEY) {
    console.error("❌ ERROR: OPENAI_API_KEY is missing from .env");
    return MOCK_MENU;
  }
  console.log("✅ Key found.");

  // 3. SEND REQUEST (With extra safety)
  if (IS_MOCK_MODE) return MOCK_MENU;

  try {
    console.log("3️⃣ Sending Image to OpenAI...");
    
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
              { type: "text", text: "Parse this menu." },
              { 
                type: "image_url", 
                image_url: { 
                  // Use 'low' detail to save massive bandwidth
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "low" 
                } 
              }
            ]
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("❌ OpenAI API Refused:", data);
      return MOCK_MENU;
    }

    console.log("✅ SUCCESS: Data received!");
    const parsedData = JSON.parse(data.choices[0].message.content);
    return parsedData.items || [];

  } catch (error) {
    console.error("❌ NETWORK REQUEST FAILED:", error);
    return MOCK_MENU;
  }
};

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


// location

export const findLocalFood = async (preferences, location) => {
  if (IS_MOCK_MODE) {
    return new Promise((resolve) => setTimeout(() => resolve([
      { name: "Mock Burger Joint", address: "123 Main St", cuisine: "American", description: "Best burgers in town." },
      { name: "Fake Pizza Place", address: "456 High St", cuisine: "Italian", description: "Authentic wood-fired pizza." }
    ]), 1500));
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
            content: "You are a local food guide. Suggest 5 REAL, existing restaurants based on the user's location and preferences. Return a strict JSON object with a key 'recommendations' containing an array. Each item must have: 'name', 'cuisine', 'description' (short), and 'address' (approximate is fine). Do not include intro text."
          },
          {
            role: "user",
            content: `Location: ${location}. Preferences: ${preferences}. Find 5 places.`
          }
        ],
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json();
    const parsedData = JSON.parse(data.choices[0].message.content);
    return parsedData.recommendations || [];

  } catch (error) {
    console.error("Local Food Error:", error);
    return [];
  }
};