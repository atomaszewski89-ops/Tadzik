import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // =========================================================================
  // 🚆 API Route for Precise AI International & Local Transit Route Planning
  // Connects Netherlands, Belgium, Germany, France, Poland public transit & trains
  // =========================================================================
  app.post("/api/transit/plan-route", async (req, res) => {
    try {
      const {
        origin,
        destination,
        departureDate,
        departureTime,
        transportMode = 'public',
        needElevators = true,
        avoidStairs = true,
        needRestroom = true,
        needPrioritySeats = true,
        language = 'pl'
      } = req.body || {};

      if (!origin && !destination) {
        return res.status(400).json({ error: "Missing origin and destination parameters" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined. Using smart local route generator.");
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const langCode = language || 'pl';

      const systemInstruction = `You are the master European transit coordinator and senior travel AI called "Tadzik".
Your job is to calculate an ultra-precise, highly realistic step-by-step route itinerary between any origin and destination, specifically specializing in:
1. Cross-border international rail and transit corridors connecting Netherlands (NL), Belgium (BE), Germany (DE), France (FR), and Poland (PL) (e.g. from Roosendaal to Poznań, Amsterdam to Warsaw, Brussels to Kraków, Paris to Berlin, Gdańsk to Rotterdam, etc.).
2. Local urban and regional journeys (buses, trams, metro, S-Bahn, regional trains, walking connections).
3. The exact official public transit and railway carriers across Europe:
   - Netherlands (NL): NS (Nederlandse Spoorwegen), NS International, 9292.nl, RET (Rotterdam), GVB (Amsterdam), HTM (The Hague), U-OV (Utrecht).
   - Belgium (BE): SNCB / NMBS, STIB / MIVB (Brussels), De Lijn (Flanders), TEC (Wallonia).
   - Germany (DE): Deutsche Bahn (DB ICE / IC / RE), S-Bahn, BVG (Berlin), HVV (Hamburg), KVB (Cologne), RMV (Frankfurt).
   - France (FR): SNCF (TGV InOui, TER, Eurostar), RATP (Paris Metro/RER/Tram).
   - Poland (PL): PKP Intercity (Berlin-Warszawa-Express BWE, EIC, IC, TLK), Polregio, Koleje Wielkopolskie, MPK Poznań, ZTM Warszawa, MPK Kraków, MPK Wrocław, Jakdojade.
4. Senior & Accessibility safety: step-free elevators, level boarding, platform numbers, PRM accessible restrooms, priority seating, clear transfer buffer minutes (at least 15-30 min at major hubs), and exact ticket purchasing guidance (OVpay, DB Navigator, PKP QR tickets, senior discounts).

Output language: "${langCode}". All human-facing titles, instructions, advice, and descriptions must be in ${langCode === 'pl' ? 'Polish' : langCode === 'nl' ? 'Dutch' : langCode === 'de' ? 'German' : 'English'}.
All responses must be strictly valid JSON matching this schema:
{
  "title": "Short title describing the corridor, e.g., '🇳🇱 Roosendaal ➔ 🇩🇪 Berlin ➔ 🇵🇱 Poznań Główny'",
  "originFormatted": "Clean name of the origin, e.g., 'Roosendaal (Stacja / Adres)'",
  "destinationFormatted": "Clean name of the destination, e.g., 'Poznań Główny / Stary Rynek'",
  "isCrossBorder": true,
  "countriesInvolved": [
    { "code": "NL", "name": "Holandia", "flag": "🇳🇱" },
    { "code": "DE", "name": "Niemcy", "flag": "🇩🇪" },
    { "code": "PL", "name": "Polska", "flag": "🇵🇱" }
  ],
  "totalDuration": "e.g. '9h 45m'",
  "totalDistanceKm": 850,
  "totalPriceEur": 58.50,
  "totalPricePln": 252.00,
  "transfersCount": 2,
  "comfortScore": "9.9/10",
  "summaryDescription": "Comprehensive senior-friendly summary explaining the smooth journey, trains used, and transfer safety.",
  "safetyAndComfortTips": "Senior advice regarding resting, daylight arrival, tea/meals onboard, luggage assistance.",
  "recommendedReturnTime": "e.g. '18:30'",
  "operators": [
    {
      "name": "NS (Nederlandse Spoorwegen)",
      "country": "NL",
      "flag": "🇳🇱",
      "type": "Kolej Holenderska",
      "officialWebsite": "https://www.nsinternational.com/"
    },
    {
      "name": "Deutsche Bahn (DB ICE/IC)",
      "country": "DE",
      "flag": "🇩🇪",
      "type": "Ekspres Niemiecki",
      "officialWebsite": "https://www.bahn.de/"
    },
    {
      "name": "PKP Intercity (Berlin-Warszawa-Express)",
      "country": "PL",
      "flag": "🇵🇱",
      "type": "Ekspres Polski",
      "officialWebsite": "https://www.intercity.pl/"
    },
    {
      "name": "MPK Poznań / Jakdojade",
      "country": "PL",
      "flag": "🇵🇱",
      "type": "Komunikacja Miejska",
      "officialWebsite": "https://jakdojade.pl/poznan"
    }
  ],
  "legs": [
    {
      "legNumber": 1,
      "type": "walk | train | bus | tram | metro | transfer",
      "iconType": "walk | train | bus | tram | transfer",
      "title": "Clear leg title, e.g., '1. Pociąg NS Intercity: Roosendaal ➔ Hengelo / Amersfoort'",
      "carrier": "NS Intercity / DB / PKP Intercity / MPK",
      "carrierLogo": "🚆",
      "carrierCountry": "NL",
      "carrierUrl": "https://www.nsinternational.com/",
      "departureTime": "08:15",
      "departureStation": "Roosendaal Stacja",
      "departurePlatform": "Peron 1",
      "arrivalTime": "09:40",
      "arrivalStation": "Amersfoort Centraal",
      "arrivalPlatform": "Peron 2",
      "duration": "1h 25m",
      "distance": "115 km",
      "priceEur": 18.20,
      "transferBufferMins": 25,
      "transferInstructions": "Spokojna przesiadka na tym samym peronie wyspowym lub zjazd windą. Czas na gorącą kawę i toaletę.",
      "seatReservation": true,
      "ticketSystem": {
        "name": "System OVpay / NS International",
        "howToPay": "Zbliżenie karty bankowej lub bilet elektroniczny z kodem QR.",
        "seniorDiscount": "Zniżka senioralna 60+ / bilet ulgowy"
      },
      "accessibility": "Winda na peron, brak schodów, toaleta PRM w wagonie 2, miejsca z pierwszeństwem dla seniorów."
    }
  ]
}
Make sure every leg has realistic times according to departure date "${departureDate || 'today'}" and start time "${departureTime || '09:00'}". Return ONLY valid raw JSON with no markdown wrapping.`;

      const userPrompt = `Plan an exact step-by-step route from: "${origin}" to: "${destination}".
Departure time: ${departureTime || '09:00'} on date: ${departureDate || 'today'}.
Selected transport mode: ${transportMode}.
User requirements: needElevators=${needElevators}, avoidStairs=${avoidStairs}, needRestroom=${needRestroom}, needPrioritySeats=${needPrioritySeats}.
Language: ${langCode}.
Provide realistic intermediate transfer stations (e.g. if Roosendaal to Poznań: Roosendaal -> Amersfoort/Hengelo -> Berlin Hbf -> Poznań Główny with real carriers like NS, DB, PKP Intercity, and local transport MPK Poznań).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.2,
          responseMimeType: "application/json"
        },
      });

      let text = response.text || "{}";
      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.replace(/^```\s*/, "");
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }

      let data;
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        console.error("Invalid JSON from AI in /api/transit/plan-route:", text);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      // Add direct Google Maps transit routing URL
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${transportMode === 'car' ? 'driving' : transportMode === 'bicycle' ? 'bicycling' : transportMode === 'walk' ? 'walking' : 'transit'}`;
      data.googleMapsUrl = googleMapsUrl;

      res.json(data);
    } catch (error: any) {
      console.error("Gemini API Error in /api/transit/plan-route:", error);
      res.status(500).json({ error: error.message || "Failed to plan transit route" });
    }
  });

  // API Route for AI Senior Guide Recommendations
  app.post("/api/guide/ai-suggest", async (req, res) => {
    try {
      const { country, language } = req.body;

      if (!country || !language) {
        return res.status(400).json({ error: "Missing country or language" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined. Falling back to dummy response.");
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const countryNames: Record<string, string> = {
        nl: "Netherlands / Holandia",
        be: "Belgium / Belgia",
        pl: "Poland / Polska",
        de: "Germany / Niemcy",
        fr: "France / Francja"
      };

      const countryName = countryNames[country] || country;

      const systemInstruction = `You are Tadzik, an exceptionally helpful and polite senior travel assistant. 
Your task is to generate tourist recommendations for the country: ${countryName}.
You must respond in the requested language (${language}). If pl, write in Polish. If nl, write in Dutch. If de, write in German. Otherwise, write in English.
Keep all content senior-friendly (comfortable pace, accessible, avoid long exhausting walks, focus on clear toilets availability, elevators, safety warnings).
Your response must be valid JSON matching the following structure:
{
  "cities": [
    {
      "name": "City Name",
      "desc": "Short senior-friendly description of the city",
      "accessibility": "Details about station accessibility, flat surfaces, or elevators",
      "budgetTip": "Smart ways to save money, senior discounts, or free attractions here",
      "safetyTip": "Crucial safety warnings (e.g., tram tracks, busy bike paths, uneven cobblestones)",
      "toiletTip": "Where to find clean, accessible public restrooms easily"
    }
  ],
  "mainAttractions": [
    {
      "name": "Attraction Name",
      "desc": "Short description focusing on history or view with comfortable access",
      "cost": "Estimated price (e.g., 'Free', '€15', '€8 with Senior Card')",
      "seniorFriendlyFactor": "Why it is great for seniors (e.g., plenty of benches, elevators, wheelchair friendly)"
    }
  ],
  "hiddenGems": [
    {
      "name": "Hidden Gem Name",
      "desc": "Less known, peaceful, uncrowded place of interest, lovely for relaxing",
      "cost": "Estimated price",
      "physicalEffortLevel": "Effort level (e.g., 'Low - Easy benches nearby', 'Medium - Small stairs')"
    }
  ]
}
Generate exactly 2 cities, exactly 2 main attractions, and exactly 2 hidden gems. Ensure the response is perfectly valid JSON with absolutely no markdown or surrounding text - only the raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Generate senior recommendations for ${countryName} in language ${language}.`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.3,
          responseMimeType: "application/json"
        },
      });

      let text = response.text || "{}";
      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      let data;
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        console.error("Invalid JSON from AI:", text);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json(data);
    } catch (error: any) {
      console.error("Gemini API Error in /api/guide/ai-suggest:", error);
      res.status(500).json({ error: error.message || "Failed to query Gemini API" });
    }
  });

  // API Route for AI Cycling Route Generation
  app.post("/api/cycling/generate", async (req, res) => {
    try {
      const { country, language, routeType, startCity, startPoint, endPoint } = req.body || {};

      if (!country || !language || !routeType) {
        return res.status(400).json({ error: "Missing required parameters: country, language, or routeType" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const typePrompts: Record<string, string> = {
        lesna: "Trasa leśna (Forest trail) - wiodąca przez zwarte kompleksy leśne, puszcze, parki krajobrazowe, zacienione dukty, leśne jeziora i śpiew ptaków.",
        polna: "Trasa polna (Countryside & fields) - drogi polne, szutry wśród pól uprawnych, łąk, wiatraków, wiejskich zagród i otwartych krajobrazów.",
        terenowa: "Trasa terenowa (Off-road / Gravel / MTB) - ścieżki gruntowe, szuter, kamieniste odcinki, pagórki, bezdroża, przygoda w trudniejszym terenie.",
        turystyczna: "Trasa turystyczna (Touring & Scenic) - spokojna, płaska, bezpieczna, po wydzielonych asfaltowych ścieżkach rowerowych, z dużą liczbą ławek, zabytków i kawiarni.",
        dlugodystansowa: "Trasa długodystansowa (Long-distance / Bikepacking) - dłuższy dystans (40-100+ km), szlaki nadrzeczne, pętle regionalne, wyprawy całodniowe.",
        wyczynowa: "Trasa wyczynowa - szybka, dłuższy dystans, treningowa.",
        przygoda: "Trasa krajobrazowa - spontaniczna wyprawa na łono natury."
      };

      const selectedTypePrompt = typePrompts[routeType] || typePrompts.turystyczna;

      let locationConstraints = "";
      if (startCity) {
        locationConstraints += `\n- The route MUST be centered in or around city/area: "${startCity}".`;
      }
      if (startPoint) {
        locationConstraints += `\n- The EXACT starting location or landmark MUST be: "${startPoint}". Set JSON field "startPoint" to "${startPoint}".`;
      }
      if (endPoint) {
        locationConstraints += `\n- The EXACT destination or endpoint MUST be: "${endPoint}". Set JSON field "endPoint" to "${endPoint}".`;
      }

      const systemInstruction = `You are an expert AI Cycling Route Planner. 
Your task is to generate a realistic cycling route in ${country} matching the type: ${selectedTypePrompt}.${locationConstraints}
Write the entire output in the requested language (${language}). If pl, write in Polish. If nl, write in Dutch. If de, write in German. Otherwise, write in English.
The output must be a valid JSON object matching this structure exactly:
{
  "title": "A catchy, evocative name for the cycle route",
  "category": "${['lesna','polna','terenowa','turystyczna','dlugodystansowa'].includes(routeType) ? routeType : 'turystyczna'}",
  "difficulty": "easy / moderate / medium / hard",
  "distanceKm": 25,
  "estimatedDuration": "1h 45m",
  "startPoint": "${startPoint ? startPoint.replace(/"/g, '\\"') : "Real city/spot where route starts"}",
  "endPoint": "${endPoint ? endPoint.replace(/"/g, '\\"') : "Real city/spot where route ends"}",
  "description": "A descriptive, senior-friendly overview of the terrain, safety, scenery, and road conditions.",
  "surface": "e.g. 85% gładki asfalt, 15% ubity szuter",
  "recommendedBike": "e.g. Trekking / Gravel / E-bike",
  "smartInsights": {
    "shadePercent": 80,
    "restBenches": "Ławki i wiaty co 2 km",
    "waterPoints": "Źródełko z wodą i kawiarnia",
    "eBikeCharging": true,
    "safetyLevel": "100% drogi bezkolizyjne z autami",
    "recommendedFor": "Seniorzy, rodziny, miłośnicy przyrody"
  },
  "highlights": [
    "Highlight spot 1",
    "Highlight spot 2",
    "Highlight spot 3",
    "Highlight spot 4"
  ]
}
Ensure the response is perfectly valid JSON with absolutely no markdown or surrounding text - only the raw JSON.`;

      const userPrompt = `Generate a cycle route in ${country}${startCity ? ` near ${startCity}` : ''}${startPoint ? ` starting at ${startPoint}` : ''}${endPoint ? ` ending at ${endPoint}` : ''} with type ${routeType} in language ${language}.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json"
        },
      });

      let text = response.text || "{}";
      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.replace(/^```\s*/, "");
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      let data;
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        console.error("Invalid JSON from AI:", text);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json(data);
    } catch (error: any) {
      console.error("Gemini API Error in /api/cycling/generate:", error);
      res.status(500).json({ error: error.message || "Failed to generate cycle route" });
    }
  });

  // API Route for AI Motorcycle Route Generation (Trasy na Motor)
  app.post("/api/motorcycle/generate", async (req, res) => {
    try {
      const { country, language, routeType, startCity, startPoint, endPoint, bikePreference } = req.body || {};

      if (!country || !language || !routeType) {
        return res.status(400).json({ error: "Missing required parameters: country, language, or routeType" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const motoTypePrompts: Record<string, string> = {
        winkle: "Kręte Winkle & Przełęcze (Twisty mountain passes, hairpin bends, fast flowing corners, elevation changes, high asphalt grip, canyon roads)",
        wybrzeza: "Malownicze Wybrzeża & Rzeki (Coastal runs, river valley roads along Rhine/Danube/Moselle, lakeside curves, sweeping panoramas, oceanic bridges)",
        lesna: "Leśne Przeloty & Bezdroża (Forest cruising, national park scenic tarmac, shaded pine tree avenues, lake district curves)",
        cruiser: "Turystyka & Cruiser / Chopper (Relaxed cruising, wide open scenic byways, castles, Biker-Friendly inns, low fatigue, scenic cafes)",
        adv_long: "Wyprawy ADV & Długodystansowe (Adventure & touring 100-300+ km, mixed terrain, mountain passes, gas stops, scenic viewpoints)"
      };

      const selectedTypePrompt = motoTypePrompts[routeType] || motoTypePrompts.winkle;

      let locationConstraints = "";
      if (startCity) {
        locationConstraints += `\n- The route MUST be situated in or around city/region: "${startCity}".`;
      }
      if (startPoint) {
        locationConstraints += `\n- The EXACT starting landmark/location MUST be: "${startPoint}". Set JSON field "startPoint" to "${startPoint}".`;
      }
      if (endPoint) {
        locationConstraints += `\n- The EXACT destination or endpoint MUST be: "${endPoint}". Set JSON field "endPoint" to "${endPoint}".`;
      }
      if (bikePreference) {
        locationConstraints += `\n- Tailored specifically for motorcycle type: "${bikePreference}".`;
      }

      const systemInstruction = `You are Tadzik's Expert AI Motorcycle Route Master & Road Guide.
Your task is to generate a realistic, exhilarating, and scenic motorcycle route in ${country} matching the category: ${selectedTypePrompt}.${locationConstraints}
Write the entire output in the requested language (${language}). If pl, write in Polish. If nl, write in Dutch. If de, write in German. Otherwise, write in English.
Focus on motorcycle-critical details: asphalt quality, grip, number of curves/corners (winkle), fuel stations with tire pressure gauges, biker-friendly stops with helmet racks, and safety precautions.

The output must be a valid JSON object matching this structure exactly:
{
  "title": "Evocative motorcycle route name (e.g. Wstęga Zakrętów Pętli Beskidzkiej)",
  "category": "${['winkle','wybrzeza','lesna','cruiser','adv_long'].includes(routeType) ? routeType : 'winkle'}",
  "difficulty": "easy / moderate / medium / challenging",
  "distanceKm": 65,
  "estimatedDuration": "1h 15m",
  "startPoint": "${startPoint ? startPoint.replace(/"/g, '\\"') : "Real starting city or moto waypoint"}",
  "endPoint": "${endPoint ? endPoint.replace(/"/g, '\\"') : "Real destination, summit or biker inn"}",
  "description": "Rich description focusing on corner flow, lean angles, scenery, viewpoints, road condition and atmosphere.",
  "asphaltCondition": "e.g. 95% gładki, przyczepny asfalt, szerokie wyprofilowane łuki",
  "recommendedBike": "e.g. Naked / Sport / Adventure / Cruiser",
  "cornersCount": 85,
  "smartInsights": {
    "cornersDensity": "Wysoka (85 wyprofilowanych winkli i agrafek)",
    "asphaltQuality": "Wysoka przyczepność na suchym, brak kolein",
    "fuelStations": "Stacje paliw z kompresorem co 15-20 km (np. Orlen/Shell)",
    "bikerSpots": "Kultowy zajazd Biker-Friendly ze stojakami na kaski i tarasem",
    "scenicViewpoints": "2 panoramiczne punkty widokowe z parkingiem dla motocykli",
    "recommendedBike": "Naked / Sport / Adventure / Cruiser",
    "safetyNote": "Szerokie pobocze, dobra widoczność w łukach, brak piasku",
    "recommendedFor": "Miłośnicy winkli, wyprawy solo i w grupie"
  },
  "highlights": [
    "Highlight spot 1",
    "Highlight spot 2",
    "Highlight spot 3",
    "Highlight spot 4"
  ]
}
Ensure the response is perfectly valid JSON with absolutely no markdown or surrounding text - only the raw JSON.`;

      const userPrompt = `Generate a motorcycle route in ${country}${startCity ? ` near ${startCity}` : ''}${startPoint ? ` starting at ${startPoint}` : ''}${endPoint ? ` ending at ${endPoint}` : ''} with category ${routeType} in language ${language}.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4,
          responseMimeType: "application/json"
        },
      });

      let text = response.text || "{}";
      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.startsWith("```")) {
        text = text.replace(/^```\s*/, "");
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      let data;
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        console.error("Invalid JSON from AI in /api/motorcycle/generate:", text);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json(data);
    } catch (error: any) {
      console.error("Gemini API Error in /api/motorcycle/generate:", error);
      res.status(500).json({ error: error.message || "Failed to generate motorcycle route" });
    }
  });

  // API Route for AI Contest Fictional Sticker Awarding
  app.post("/api/contests/award-sticker", async (req, res) => {
    try {
      const { cityOrAttraction, userActivity, language } = req.body;

      if (!cityOrAttraction || !language) {
        return res.status(400).json({ error: "Missing required parameters: cityOrAttraction or language" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are Tadzik, the senior travel companion.
The user is checking in to a city or attraction: "${cityOrAttraction}". They said they did this there: "${userActivity || 'visited and took photos'}".
Verify this visit in a friendly, lighthearted way, and award them a customized fictional sticker for their sticker album!
Your response must be a valid JSON object matching this structure exactly:
{
  "emoji": "Choose a perfect single emoji matching the city/attraction, e.g., 🥖 for Paris, 🚲 for Amsterdam, 🗼 for Eiffel Tower",
  "stickerTitle": "A personalized title, e.g., 'Certyfikat Paryż' or 'Zdobywca Warszawy'",
  "gradient": "Tailwind gradient class starting with from- and to-, e.g., 'from-amber-400 to-orange-500', 'from-pink-500 to-purple-600', 'from-cyan-400 to-blue-600'",
  "aiCongratulations": "A warm, personal, senior-focused congratulations note of 2-3 sentences. Commend their exploration, give a small safety advice (like resting or drinking water), and sign as 'Twój Tadzik' in the requested language (${language})."
}
Ensure the response is perfectly valid JSON with absolutely no markdown or surrounding text - only the raw JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Award a sticker for visiting ${cityOrAttraction} with activity ${userActivity} in language ${language}.`,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.5,
          responseMimeType: "application/json"
        },
      });

      let text = response.text || "{}";
      text = text.trim();
      if (text.startsWith("```json")) {
        text = text.substring(7);
      }
      if (text.endsWith("```")) {
        text = text.substring(0, text.length - 3);
      }
      
      let data;
      try {
        data = JSON.parse(text.trim());
      } catch (e) {
        console.error("Invalid JSON from AI:", text);
        return res.status(500).json({ error: "AI returned invalid JSON" });
      }

      res.json(data);
    } catch (error: any) {
      console.error("Gemini API Error in /api/contests/award-sticker:", error);
      res.status(500).json({ error: error.message || "Failed to award sticker" });
    }
  });

  // API Route for Tadzik Chat
  app.post("/api/tadzik/chat", async (req, res) => {
    try {
      const { prompt, language } = req.body;

      if (!prompt || !language) {
        return res.status(400).json({ error: "Missing required parameters: prompt or language" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to local responder.");
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are Tadzik, an exceptionally polite, warm, and supportive tour guide specializing in travel companion services for elderly travelers/seniors visiting Dutch cities (Amsterdam, Rotterdam, Utrecht, Haarlem, etc.), Belgian cities (Brussels, Bruges, Antwerp), Polish cities (Warsaw, Krakow, Wroclaw, Gdansk), or German cities (Berlin, Munich, Frankfurt, Hamburg).
Your primary audience consists of seniors who need high-readability explanations, step-by-step clear directions, budget-friendly and money-saving hacks (such as free Polish transport for seniors 70+, German Deutschland-Ticket, or Belgian €8.30 Seniorenticket), safety warnings (avoiding fast bikes, staying hydrated, slipping hazards on wet stones), clean restroom finder guides, and a highly structured, bold, bulleted layout.
Answer the user's question in the selected language (${language}). If the language is 'pl', write in Polish. If 'nl', write in Dutch. If 'de', write in German. Otherwise, write in English.
Make your responses exceptionally helpful, caring, clear, and easy to read for older eyes. Use bold titles and tidy bulleted lists. Limit output to maximum 3 paragraphs or a neat list. Keep instructions literal, reassuring, and human. Avoid telemetry, logs, or robotic jargon. Be supportive and enthusiastic to help them achieve their travel goals!`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error in /api/tadzik/chat:", error);
      res.status(500).json({ error: error.message || "Failed to query Gemini API" });
    }
  });

  // Backward compatibility endpoint for Szymon Chat
  app.post("/api/szymon/chat", async (req, res) => {
    try {
      const { prompt, language } = req.body;

      if (!prompt || !language) {
        return res.status(400).json({ error: "Missing required parameters: prompt or language" });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.warn("GEMINI_API_KEY is not defined in environment variables. Falling back to local responder.");
        return res.status(400).json({ error: "Missing API Key" });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are Tadzik, an exceptionally polite, warm, and supportive tour guide specializing in travel companion services for elderly travelers/seniors visiting Dutch, Belgian, Polish, or German cities. Answer the user's question in the selected language (${language}).`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to query Gemini API" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
