# Tadzik – Holenderski Planer Podróży v1.2

Pełna aplikacja mobilna na **Android i iOS** zbudowana w React Native + Expo.

## Nowości w v1.2

- 💎 **Stripe Payments + iDEAL** – Premium Pass €25/rok
- 🗺️ **Mapa OpenStreetMap** – 10 markerów atrakcji z GPS
- 🚌 **Transport 9292** – wyszukiwarka połączeń
- 🔐 **Firebase Auth** – logowanie email/hasło
- 🌍 **Wielojęzyczność** – PL / NL / EN

## Szybki start (5 minut)

```bash
cd tadzik-expo
npm install
npx expo start
```

Zeskanuj kod QR w aplikacji **Expo Go** (Google Play / App Store).

## Funkcje

| Moduł | Opis |
|-------|------|
| Onboarding | Rodzina / Singiel / Senior + region + budżet |
| Dashboard | 6 szybkich akcji + podgląd planu |
| Mapa | OpenStreetMap z markerami 10 atrakcji + GPS |
| Wyszukiwarka | Filtry: kategoria, darmowe, płaskie, oświetlone |
| Planer | Timeline z powiadomieniami push (9292, zmrok) |
| Stempelki | 12 miast, pasek postępu, zdobywanie |
| Galeria | Aparat + geotagi GPS |
| Budżet | Wydatki z kategoriami |
| Transport 9292 | Szybkie linki do plannera 9292.nl |
| Profil | Tryb seniora, język, powiadomienia, logowanie |
| Auth | Firebase – email/hasło, dane w chmurze |
| 💎 **Premium** | Stripe: iDEAL, Wero, karta, Bancontact – €25/rok |

## Struktura

```
tadzik-expo/
├── App.js
├── app.json
├── package.json
├── i18n/index.js           # Tłumaczenia PL/NL/EN
├── components/
│   ├── OnboardingScreen.js
│   ├── HomeScreen.js
│   ├── SearchScreen.js
│   ├── PlannerScreen.js
│   ├── StampsScreen.js
│   ├── GalleryScreen.js
│   ├── BudgetScreen.js
│   ├── ProfileScreen.js
│   ├── MapScreen.js        # 🗺️ Mapa OSM
│   ├── TransportScreen.js  # 🚌 9292
│   ├── AuthScreen.js       # 🔐 Firebase Auth
│   └── PremiumScreen.js    # 💎 Stripe + iDEAL
├── data/
│   ├── attractions.js
│   └── stamps.js
└── utils/
    └── storage.js
```

## Konfiguracja płatności Stripe (wymagane do produkcji)

1. Wejdź na https://dashboard.stripe.com
2. Utwórz konto → pobierz **Publishable key** (pk_test_... / pk_live_...)
3. Zamień w `components/PremiumScreen.js`:
   ```js
   const STRIPE_PUBLISHABLE_KEY = 'pk_live_TwojKlucz';
   ```
4. **Backend** – musisz postawić endpoint tworzący PaymentIntent:
   ```js
   // Firebase Function / Express / Next.js API
   app.post('/create-payment-intent', async (req, res) => {
     const paymentIntent = await stripe.paymentIntents.create({
       amount: 2500,        // €25.00 w centach
       currency: 'eur',
       payment_method_types: ['ideal', 'card', 'bancontact'],
     });
     res.json({ clientSecret: paymentIntent.client_secret });
   });
   ```
5. Zamień `BACKEND_URL` w `PremiumScreen.js` na URL swojego backendu.

## Konfiguracja Firebase Auth (opcjonalnie)

1. https://console.firebase.google.com → projekt "tadzik-app"
2. Dodaj Android + iOS, skopiuj config do `AuthScreen.js`
3. Włącz Authentication → Email/Password

## Budowanie do sklepu

```bash
# Android
npx eas build --platform android

# iOS (tylko Mac)
npx eas build --platform ios
```

## Uprawnienia

- Kamera (zdjęcia)
- Lokalizacja GPS (mapa + geotagi)
- Powiadomienia (9292 + zmrok)
- Deep linking (powrót z banku po płatności iDEAL)

Wszystko skonfigurowane w `app.json`.

---
Gotowe do publikacji! 🚀
