/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Attraction } from '../types';

export const DEFAULT_PLACE_PHOTO = 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80';

export const CATEGORY_FALLBACK_PHOTOS: Record<string, string> = {
  forest: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  museum: 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=800&auto=format&fit=crop&q=80',
  park: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop&q=80',
  historical_site: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
  historical: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
  waterway: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  restaurant_cafe: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
  amusement_park: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  adult_park: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  childrens_attraction: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  toddler_park: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  romantic: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
  cycling: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
};

export const ATTRACTION_PHOTOS_MAP: Record<string, string> = {
  // Netherlands
  'depot-boijmans': 'https://images.unsplash.com/photo-1616447154831-293f24032a1f?w=800&auto=format&fit=crop&q=80',
  'kralingse-bos': 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
  'rijksmuseum': 'https://images.unsplash.com/photo-1601961405399-801fb1f34581?w=800&auto=format&fit=crop&q=80',
  'amsterdamse-bos': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  'vondelpark': 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?w=800&auto=format&fit=crop&q=80',
  'dom-tower': 'https://images.unsplash.com/photo-1601621915196-2621bfb0cd6e?w=800&auto=format&fit=crop&q=80',
  'maximapark': 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  'plaswijckpark': 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
  'scheveningen-beach': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'spido-cruise': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
  'dudok-cafe': 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&auto=format&fit=crop&q=80',
  'hoge-veluwe-forest': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=80',
  'mastbos-breda': 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',

  // Belgium
  'brussels-grand-place': 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
  'antwerp-central-station': 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?w=800&auto=format&fit=crop&q=80',
  'sonian-forest-brussels': 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80',
  'atomium-brussels': 'https://images.unsplash.com/photo-1569959220744-ff553533f492?w=800&auto=format&fit=crop&q=80',

  // France
  'paris-eiffel-seine': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop&q=80',
  'bois-de-boulogne-paris': 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=80',
  'louvre-gardens-paris': 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&auto=format&fit=crop&q=80',

  // Germany
  'berlin-brandenburg-gate': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
  'grunewald-berlin': 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop&q=80',
  'tiergarten-berlin': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80',

  // Poland
  'lazienki-park': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&auto=format&fit=crop&q=80',
  'krakow-wawel-square': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
  'krakow-kopiec-krakusa': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=80',
  'puszcza-kampinoska': 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=800&auto=format&fit=crop&q=80',
  'puszcza-zielonka': 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
  'las-wolski-krakow': 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&auto=format&fit=crop&q=80',
  'muzeum-powstania-warszawskiego': 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80',
  'muzeum-narodowe-krakow': 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80',
  'zamek-krolewski-warszawa': 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&auto=format&fit=crop&q=80',
  'plaza-sopot-molo': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'park-slaski-chorzow': 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80'
};

export function getAttractionPhoto(att: Attraction, photosState?: Record<string, { url: string }[]>): string {
  if (photosState && photosState[att.id] && photosState[att.id].length > 0 && photosState[att.id][0].url) {
    return photosState[att.id][0].url;
  }
  if (ATTRACTION_PHOTOS_MAP[att.id]) {
    return ATTRACTION_PHOTOS_MAP[att.id];
  }
  if (att.category && CATEGORY_FALLBACK_PHOTOS[att.category]) {
    return CATEGORY_FALLBACK_PHOTOS[att.category];
  }
  return DEFAULT_PLACE_PHOTO;
}
