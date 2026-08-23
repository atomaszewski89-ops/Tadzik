import { CyclingRouteComment } from '../types';

export const SEEDED_CYCLING_COMMENTS: Record<string, CyclingRouteComment[]> = {
  'lesna-puszcza-zielonka': [
    {
      id: 'comm-pz-1',
      routeId: 'lesna-puszcza-zielonka',
      authorName: 'Marek_Cyklista',
      rating: 5,
      text: 'Genialna trasa w upalny dzień! Prawie cała w gęstym, pachnącym cieniu sosen i dębów. Polecam wejść na wieżę na Dziewiczej Górze – widok na Poznań i lasy zapiera dech w piersiach!',
      tags: ['🌲 Cudowny cień', '☕ Świetna kawiarnia', '🚴‍♂️ Dobra nawierzchnia'],
      createdAt: '2026-08-14',
      likes: 14
    },
    {
      id: 'comm-pz-2',
      routeId: 'lesna-puszcza-zielonka',
      authorName: 'Grażyna i Janusz',
      rating: 5,
      text: 'Jeździliśmy na e-bike’ach trekkingowych. Bardzo bezpiecznie, zero samochodów, mnóstwo ławek do odpoczynku nad jeziorem. W Owińskich można naładować baterię.',
      tags: ['⚡ E-Bike friendly', '🪑 Dużo ławek', '🛡️ Zero aut'],
      createdAt: '2026-08-18',
      likes: 9
    }
  ],
  'polna-kinderdijk-zulawy': [
    {
      id: 'comm-kd-1',
      routeId: 'polna-kinderdijk-zulawy',
      authorName: 'Ania_Wiatraki',
      rating: 5,
      text: 'Najbardziej malowniczy holenderski szlak polderowy! Płasko jak stół, wiatraki robią niesamowite wrażenie. Warto kupić bilet na Waterbus z Rotterdamu z rowerem na pokładzie.',
      tags: ['🌾 Sielskie widoki', '📸 Idealna na zdjęcia', '🧀 Pyszny ser'],
      createdAt: '2026-08-10',
      likes: 21
    },
    {
      id: 'comm-kd-2',
      routeId: 'polna-kinderdijk-zulawy',
      authorName: 'Piotr_K',
      rating: 5,
      text: 'Asfalt gładki, bez żadnych dziur. Pamiętajcie tylko o wietrze – przy powrocie z zachodu potrafi powiać, więc e-bike lub spokojne tempo to strzał w dziesiątkę.',
      tags: ['🟢 Super asfalt', '💨 Uważaj na wiatr'],
      createdAt: '2026-08-16',
      likes: 12
    }
  ],
  'terenowa-jura-krakowska': [
    {
      id: 'comm-jura-1',
      routeId: 'terenowa-jura-krakowska',
      authorName: 'Bartek_Gravel',
      rating: 5,
      text: 'Top trasa gravelowa w Małopolsce. Szutry wokół Ojcowa są wyśmienicie ubite. Zamek Pieskowa Skała wygląda jak z bajki. Pstrąg w Ojcowie obowiązkowy!',
      tags: ['🚵 Szuter pierwszej klasy', '🏰 Zamki i skałki', '🍽️ Pyszny pstrąg'],
      createdAt: '2026-08-05',
      likes: 18
    }
  ],
  'turystyczna-nadmorska-trojmiasto': [
    {
      id: 'comm-3miasto-1',
      routeId: 'turystyczna-nadmorska-trojmiasto',
      authorName: 'Katarzyna_Gdańsk',
      rating: 5,
      text: 'Prawdziwa rowerowa autostrada nad samym morzem. Szum fal, zapach jodu, mnóstwo kawiarni i źródełek z darmową wodą pitną. Idealna dla seniorów i rodzin.',
      tags: ['🌊 Widok na morze', '🚰 Darmowa woda', '🟢 Płaska i bez barier'],
      createdAt: '2026-08-12',
      likes: 27
    }
  ],
  'dlugodystansowa-zelazny-szlak': [
    {
      id: 'comm-zelazny-1',
      routeId: 'dlugodystansowa-zelazny-szlak',
      authorName: 'Tomasz_Bikepacker',
      rating: 5,
      text: 'Wzór do naśladowania dla tras w Europie! Dawny nasyp kolejowy sprawia, że podjazdy są minimalne. Czeska strona pętli bardzo zadbana, super stacje serwisowe z pompkami.',
      tags: ['🗺️ Trasa marzeń', '🛠️ Stacje naprawcze', '🍻 Czeska kofola'],
      createdAt: '2026-08-08',
      likes: 31
    }
  ]
};

const STORAGE_KEY = 'tadzik_cycling_route_comments';

export function getCyclingRouteComments(routeId: string): CyclingRouteComment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customMap: Record<string, CyclingRouteComment[]> = raw ? JSON.parse(raw) : {};
    const seeded = SEEDED_CYCLING_COMMENTS[routeId] || [];
    const custom = customMap[routeId] || [];
    
    // Combine custom (first) and seeded
    return [...custom, ...seeded];
  } catch (e) {
    console.error('Failed to load cycling comments from localStorage:', e);
    return SEEDED_CYCLING_COMMENTS[routeId] || [];
  }
}

export function saveCyclingRouteComment(routeId: string, comment: Omit<CyclingRouteComment, 'id' | 'createdAt' | 'likes'>): CyclingRouteComment {
  const newComment: CyclingRouteComment = {
    id: 'comm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    routeId,
    authorName: comment.authorName || 'Anonimowy Rowerzysta',
    rating: comment.rating || 5,
    text: comment.text,
    tags: comment.tags || [],
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customMap: Record<string, CyclingRouteComment[]> = raw ? JSON.parse(raw) : {};
    if (!customMap[routeId]) {
      customMap[routeId] = [];
    }
    customMap[routeId].unshift(newComment);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customMap));
  } catch (e) {
    console.error('Failed to save cycling comment to localStorage:', e);
  }

  return newComment;
}

export function toggleLikeCyclingComment(routeId: string, commentId: string): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const customMap: Record<string, CyclingRouteComment[]> = raw ? JSON.parse(raw) : {};
    
    let likes = 0;
    if (customMap[routeId]) {
      const found = customMap[routeId].find(c => c.id === commentId);
      if (found) {
        found.likedByMe = !found.likedByMe;
        found.likes = (found.likes || 0) + (found.likedByMe ? 1 : -1);
        likes = found.likes;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customMap));
        return likes;
      }
    }
  } catch (e) {
    console.error('Failed to like comment:', e);
  }
  return 0;
}
