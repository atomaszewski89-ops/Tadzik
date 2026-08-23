# Tadzik – Holenderski Planer Podróży

Gotowa aplikacja mobilna na **Android i iOS** zbudowana w React Native + Expo oraz wersja webowa React.

## Co potrzebujesz

- Node.js 18+ (https://nodejs.org)
- npm (instaluje się razem z Node)
- Dla iOS: Mac + Xcode (tylko na macOS)
- Dla Android: Android Studio lub fizyczny telefon

## Instalacja (1 minuta)

```bash
# 1. Wejdź do folderu projektu
cd tadzik-expo

# 2. Zainstaluj zależności
npm install

# 3. Uruchom serwer deweloperski
npx expo start
```

## Uruchomienie na telefonie (najszybsze)

1. Zainstaluj aplikację **Expo Go** z Google Play / App Store
2. W terminalu po `npx expo start` zeskanuj kod QR
3. Aplikacja Tadzik otworzy się natychmiast na Twoim telefonie

## Uruchomienie na emulatorze

### Android
```bash
npx expo start --android
```

### iOS (tylko Mac)
```bash
npx expo start --ios
```

## Budowanie plików do sklepu (Google Play / App Store)

### Android – APK / AAB
```bash
# Zaloguj się do EAS (wymaga konta Expo, darmowe)
npx eas login

# Skonfiguruj projekt
npx eas build:configure

# Zbuduj plik produkcyjny
npx eas build --platform android
```

### iOS – IPA
```bash
npx eas build --platform ios
```

Po zbudowaniu otrzymasz link do pobrania gotowego pliku `.aab` (Android) lub `.ipa` (iOS), który wrzucasz do Google Play Console / App Store Connect.

## Funkcje aplikacji

| Funkcja | Opis |
|---------|------|
| Onboarding | 3 kroki: Rodzina/Singiel/Senior + region + budżet |
| Dashboard | Szybkie akcje + podgląd dzisiejszego planu |
| Wyszukiwarka | Atrakcje z filtrami (kategoria, darmowe, płaskie) |
| Planer dnia | Timeline z oznaczaniem "zrobione" + przypomnienia push |
| Stempelki | 12 miast, pasek postępu, zdobywanie stempli |
| Galeria | Aparat + geotagi GPS + zapis lokalny |
| Budżet | Dodawanie wydatków z kategoriami + suma |
| Profil | Tryb seniora, powiadomienia 9292, reset danych |
| Storage | Wszystkie dane zapisane na urządzeniu (AsyncStorage / LocalStorage) |

## Struktura plików

```
tadzik-expo/
├── App.js                  # Główny plik z nawigacją
├── app.json                # Konfiguracja Expo (uprawnienia, ikony)
├── package.json            # Zależności
├── components/
│   ├── OnboardingScreen.js # 3-krokowy onboarding
│   ├── HomeScreen.js       # Dashboard
│   ├── SearchScreen.js     # Wyszukiwarka atrakcji
│   ├── PlannerScreen.js    # Plan dnia + powiadomienia
│   ├── StampsScreen.js     # Paszport stempli
│   ├── GalleryScreen.js    # Galeria zdjęć + aparat
│   ├── BudgetScreen.js     # Budżet wydatków
│   └── ProfileScreen.js    # Ustawienia profilu
├── data/
│   ├── attractions.js      # Baza 10 atrakcji NL
│   └── stamps.js           # 12 miast do zdobycia
└── utils/
    └── storage.js          # AsyncStorage wrapper
```

## Uprawnienia (automatyczne)

Aplikacja poprosi o:
- **Kamera** – robienie zdjęć w galerii
- **Lokalizacja** – geotagi zdjęć i pobliskie atrakcje
- **Powiadomienia** – przypomnienia o 9292 i zmroku

Wszystko skonfigurowane w `app.json` – nie musisz nic dodawać ręcznie.

## Następne kroki (opcjonalnie)

1. **Dodaj własne ikony** – zastąp pliki w folderze `assets/`
2. **Więcej atrakcji** – rozbuduj `data/attractions.js`
3. **Mapa** – dodaj `@react-native-maps` z markerami atrakcji
4. **Synchronizacja chmury** – podpiąć Firebase do backupu danych
5. **Płatności** – zintejurj Stripe / Mollie dla Premium Pass

---

Gotowe do publikacji w Google Play i App Store! 🚀
