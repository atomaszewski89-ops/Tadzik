/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attraction, Language, TravelMode } from '../types';
import { CITY_COORDINATES } from '../data/weatherData';

export interface GpsCoordinates {
  lat: number;
  lng: number;
}

export interface GpsLocationState {
  coords: GpsCoordinates | null;
  status: 'idle' | 'locating' | 'success' | 'error' | 'denied';
  locationName: string;
  accuracyMeters?: number;
  errorMessage?: string;
  updatedAt?: number;
}

export interface TransitOption {
  mode: TravelMode;
  modeLabel: string;
  icon: string;
  minutes: number;
  timeFormatted: string;
  distanceKm: number;
  distanceFormatted: string;
  details: string;
  badge?: string;
  costEstimate?: string;
  calories?: number;
}

export interface AttractionDistanceInfo {
  distanceKm: number;
  distanceFormatted: string;
  destinationCoords: GpsCoordinates;
  options: TransitOption[];
}

/**
 * Calculates straight-line distance using the Haversine formula (km)
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Resolve exact coordinates for an attraction, with fallback to city coordinates
 */
export function getAttractionCoordinates(attraction: Attraction): GpsCoordinates {
  if (attraction.coordinates && typeof attraction.coordinates.lat === 'number' && typeof attraction.coordinates.lng === 'number') {
    return {
      lat: attraction.coordinates.lat,
      lng: attraction.coordinates.lng
    };
  }

  // Fallback to city mapping
  const cityKey = attraction.city;
  if (CITY_COORDINATES[cityKey]) {
    return {
      lat: CITY_COORDINATES[cityKey].lat,
      lng: CITY_COORDINATES[cityKey].lon
    };
  }

  // Generic fallback (Rotterdam)
  return { lat: 51.9244, lng: 4.4777 };
}

/**
 * Identify closest major city to given GPS coordinates
 */
export function getNearestCityFromCoords(coords: GpsCoordinates): { cityName: string; country: string; distanceKm: number } {
  let nearestCity = 'Rotterdam';
  let nearestCountry = 'Netherlands';
  let minDistance = Infinity;

  Object.entries(CITY_COORDINATES).forEach(([city, data]) => {
    const dist = calculateHaversineDistanceKm(coords.lat, coords.lng, data.lat, data.lon);
    if (dist < minDistance) {
      minDistance = dist;
      nearestCity = city;
      nearestCountry = data.country;
    }
  });

  return {
    cityName: nearestCity,
    country: nearestCountry,
    distanceKm: Math.round(minDistance * 10) / 10
  };
}

/**
 * Format duration in minutes into a human-friendly string
 */
export function formatTransitDuration(minutes: number, language: Language): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMins = minutes % 60;
  
  if (language === 'pl') {
    if (remainingMins === 0) return `${hours} godz.`;
    return `${hours} godz. ${remainingMins} min`;
  }
  if (language === 'nl') {
    if (remainingMins === 0) return `${hours} uur`;
    return `${hours} uur ${remainingMins} min`;
  }
  if (language === 'de') {
    if (remainingMins === 0) return `${hours} Std.`;
    return `${hours} Std. ${remainingMins} Min.`;
  }
  if (remainingMins === 0) return `${hours} h`;
  return `${hours} h ${remainingMins} min`;
}

/**
 * Format distance in kilometers or meters
 */
export function formatDistance(distanceKm: number): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }
  return `${Math.round(distanceKm)} km`;
}

/**
 * Calculate multi-modal transit options from GPS position to attraction
 */
export function getAttractionTransitInfo(
  userCoords: GpsCoordinates | null,
  attraction: Attraction,
  language: Language
): AttractionDistanceInfo {
  const destCoords = getAttractionCoordinates(attraction);
  const pl = language === 'pl';
  const nl = language === 'nl';

  // If no user GPS, provide realistic baseline based on destination city center
  let directDistKm = 2.5;
  if (userCoords) {
    directDistKm = calculateHaversineDistanceKm(
      userCoords.lat,
      userCoords.lng,
      destCoords.lat,
      destCoords.lng
    );
  }

  // Road factor adjustments (urban street curvature ~ 1.25x - 1.35x)
  const roadDistKm = directDistKm * (directDistKm < 15 ? 1.28 : 1.18);
  const formattedDist = formatDistance(roadDistKm);

  // 1. CAR (Samochód)
  let carSpeed = roadDistKm < 5 ? 28 : roadDistKm < 25 ? 45 : 85;
  let carMinutes = Math.max(3, Math.round((roadDistKm / carSpeed) * 60) + 2); // +2 min parking/start
  const carCost = (roadDistKm * 0.14).toFixed(2);

  // 2. TRAIN / REGIONAL RAIL (Pociąg / Kolej NS / PKP / Intercity)
  let trainSpeed = roadDistKm < 15 ? 45 : roadDistKm < 60 ? 75 : 105;
  let trainMinutes = Math.max(
    6,
    Math.round((roadDistKm / trainSpeed) * 60) + (roadDistKm < 20 ? 8 : 14)
  );

  const transportInfo = attraction.transport;

  // 3. BUS (Autobus Miejski / Regionalny)
  let busSpeed = roadDistKm < 8 ? 22 : 32;
  let busMinutes = Math.max(
    4,
    Math.round((roadDistKm / busSpeed) * 60) + (roadDistKm < 5 ? 4 : 8)
  );
  const busLineNumber = transportInfo?.type === 'bus' ? transportInfo.line : (
    attraction.city === 'Rotterdam' ? 'Bus 33 / 40' :
    attraction.city === 'Amsterdam' ? 'Bus 347 / 397' :
    attraction.city === 'Den Haag' || attraction.city === 'The Hague' ? 'Bus 22 / 24' :
    attraction.city === 'Utrecht' ? 'Bus 28 / 12' :
    attraction.city === 'Kraków' ? 'Autobus 179 / 304' :
    attraction.city === 'Warsaw' || attraction.city === 'Warszawa' ? 'Autobus 116 / 180' :
    attraction.city === 'Gdańsk' ? 'Autobus 100 / 210' :
    attraction.city === 'Wrocław' ? 'Autobus 106 / D' :
    'Bus ' + ((attraction.name.charCodeAt(0) % 50) + 10)
  );

  // 4. TRAM / METRO (Tramwaj Miejski / Szybki Tramwaj)
  let tramSpeed = roadDistKm < 6 ? 20 : 28;
  let tramMinutes = Math.max(
    3,
    Math.round((roadDistKm / tramSpeed) * 60) + (roadDistKm < 5 ? 3 : 6)
  );
  const tramLineNumber = (transportInfo?.type === 'tram' || transportInfo?.type === 'metro') 
    ? `${transportInfo.type === 'metro' ? 'Metro' : 'Tramwaj'} ${transportInfo.line}`
    : (
      attraction.city === 'Rotterdam' ? 'Tramwaj 7 / 8 / 23' :
      attraction.city === 'Amsterdam' ? 'Tramwaj 2 / 12 / 14' :
      attraction.city === 'Den Haag' || attraction.city === 'The Hague' ? 'Tramwaj 1 / 9 / 16' :
      attraction.city === 'Utrecht' ? 'Tramwaj 22 (Sneltram)' :
      attraction.city === 'Kraków' ? 'Tramwaj 3 / 8 / 18 / 50' :
      attraction.city === 'Warsaw' || attraction.city === 'Warszawa' ? 'Tramwaj 4 / 10 / 33' :
      attraction.city === 'Gdańsk' ? 'Tramwaj 2 / 6 / 12' :
      attraction.city === 'Wrocław' ? 'Tramwaj 6 / 7 / 10' :
      'Tramwaj ' + ((attraction.name.charCodeAt(0) % 20) + 1)
    );

  // 5. BICYCLE (Rower / E-Bike)
  const bikeSpeed = 17.5;
  let bikeMinutes = Math.max(2, Math.round((roadDistKm / bikeSpeed) * 60));
  const bikeCalories = Math.round(roadDistKm * 32);

  // 6. WALKING (Pieszo)
  const walkSpeed = 4.8;
  let walkMinutes = Math.max(1, Math.round((roadDistKm / walkSpeed) * 60));
  const walkCalories = Math.round(roadDistKm * 55);

  const options: TransitOption[] = [
    {
      mode: 'transit',
      modeLabel: pl ? 'Pociąg (Kolej)' : nl ? 'Trein (NS/OV)' : 'Train / Rail',
      icon: '🚆',
      minutes: trainMinutes,
      timeFormatted: formatTransitDuration(trainMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? `Kolej regionalna / Intercity ➔ Stacja ${transportInfo?.stopName || attraction.city + ' Centraal'} (peron ${transportInfo?.platform || '1-4'})`
        : `Intercity / Sprinter ➔ Station ${transportInfo?.stopName || attraction.city + ' Central'} (platform ${transportInfo?.platform || '1-4'})`,
      badge: pl ? 'NS / PKP Na Czas ⏱️' : 'NS / Rail Live ⏱️',
      costEstimate: roadDistKm < 15 ? '~3.40 €' : '~8.50 €'
    },
    {
      mode: 'bus',
      modeLabel: pl ? 'Autobus' : nl ? 'Bus' : 'Bus',
      icon: '🚌',
      minutes: busMinutes,
      timeFormatted: formatTransitDuration(busMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? `${busLineNumber} ➔ Przystanek: ${transportInfo?.stopName || attraction.name.split(' ')[0] + ' Bushalte'} • Odjazdy co 8-12 min (Płatność OVpay / Karta)`
        : `${busLineNumber} ➔ Stop: ${transportInfo?.stopName || attraction.name.split(' ')[0] + ' Bus Stop'} • Every 8-12 min (OVpay / Card contactless)`,
      badge: pl ? 'Częste kursy 🚌' : 'Frequent departures 🚌',
      costEstimate: roadDistKm < 10 ? '~2.20 €' : '~4.10 €'
    },
    {
      mode: 'tram',
      modeLabel: pl ? 'Tramwaj / Metro' : nl ? 'Tram / Metro' : 'Tram / Metro',
      icon: '🚊',
      minutes: tramMinutes,
      timeFormatted: formatTransitDuration(tramMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? `${tramLineNumber} ➔ Przystanek pod wejściem: ${transportInfo?.stopName || 'Centrum / Museumpark'} • Bez korków, 100% niskopodłogowy ♿`
        : `${tramLineNumber} ➔ Direct entrance stop: ${transportInfo?.stopName || 'City Center'} • No traffic jams, 100% low floor ♿`,
      badge: pl ? 'Bez korków ⚡ ♿' : 'Zero traffic ⚡ ♿',
      costEstimate: roadDistKm < 8 ? '~1.95 €' : '~3.20 €'
    },
    {
      mode: 'car',
      modeLabel: pl ? 'Samochód' : nl ? 'Auto' : 'Car',
      icon: '🚗',
      minutes: carMinutes,
      timeFormatted: formatTransitDuration(carMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? (roadDistKm > 30 ? 'Autostrada / Droga szybkiego ruchu + Parking P+R' : 'Trasa miejska + Dostępny parking na miejscu')
        : (roadDistKm > 30 ? 'Highway / Fast route + P+R Parking' : 'City roads + On-site parking available'),
      badge: roadDistKm < 10 ? (pl ? 'Szybki dojazd' : 'Quick drive') : (pl ? 'Wygodna trasa' : 'Comfort route'),
      costEstimate: `~${carCost} €`
    },
    {
      mode: 'bike',
      modeLabel: pl ? 'Rower (Fiets)' : nl ? 'Fiets' : 'Bicycle',
      icon: '🚲',
      minutes: bikeMinutes,
      timeFormatted: formatTransitDuration(bikeMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? 'Wydzielone, płaskie drogi rowerowe (fietspad) • Bezpieczna i malownicza trasa'
        : 'Dedicated flat cycle paths (fietspad) • Safe and scenic bike route',
      badge: roadDistKm <= 12 ? (pl ? 'Polecane na dziś 🌿' : 'Recommended 🌿') : (pl ? 'Trasa rekreacyjna' : 'Scenic route'),
      calories: bikeCalories
    },
    {
      mode: 'walk',
      modeLabel: pl ? 'Pieszo' : nl ? 'Lopend' : 'Walking',
      icon: '🚶',
      minutes: walkMinutes,
      timeFormatted: formatTransitDuration(walkMinutes, language),
      distanceKm: roadDistKm,
      distanceFormatted: formattedDist,
      details: pl 
        ? (roadDistKm <= 2.5 ? 'Przyjemny krótki spacer, równe chodniki i przejścia dla pieszych' : 'Dłuższy marsz turystyczny')
        : (roadDistKm <= 2.5 ? 'Pleasant short walk, flat pavements and crossings' : 'Longer walking tour'),
      badge: roadDistKm <= 3 ? (pl ? 'Blisko na piechotę ✨' : 'Walkable distance ✨') : undefined,
      calories: walkCalories
    }
  ];

  return {
    distanceKm: roadDistKm,
    distanceFormatted: formattedDist,
    destinationCoords: destCoords,
    options
  };
}

/**
 * Request high-accuracy GPS position with smart timeout and readable name
 */
export async function getLiveGpsLocation(): Promise<{
  coords: GpsCoordinates;
  accuracy: number;
  locationName: string;
}> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        };
        const accuracy = Math.round(pos.coords.accuracy || 20);
        const nearest = getNearestCityFromCoords(coords);
        
        const locName = nearest.distanceKm < 15
          ? `${nearest.cityName} (${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E)`
          : `GPS: ${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E (~${nearest.distanceKm} km od ${nearest.cityName})`;

        resolve({
          coords,
          accuracy,
          locationName: locName
        });
      },
      (err) => {
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000
      }
    );
  });
}
