# Zaman — Prayer Times & Qibla

A small, calm prayer times app for iOS and Android. Open it and you see the next
prayer, how long is left, today's timetable, and a compass that points to the
Qibla. There is no sign-up, no account, no advertising, and nothing to configure
before it works.

Built with Expo (React Native), so one codebase ships to both the App Store and
Google Play. Free on both.

## What it does

- **Prayer times** for wherever you are, calculated on the phone from your
  location — accurate offline, with no server involved.
- **A live countdown** to the next prayer, rolling over to tomorrow's Fajr after
  Isha.
- **A Qibla compass** that turns as you turn, with a gold Kaaba marker to line up
  against a fixed pointer. It vibrates once when you are facing the right way, so
  you do not have to watch the screen while turning.
- **A reminder 15 minutes before each adhan** (adjustable to 5, 10, 20 or 30),
  delivered as a local notification that works with the phone offline.
- **English, Turkish and Arabic**, including right-to-left layout for Arabic.
- **Automatic location**, captured once on launch and cached — not tracked
  continuously. Or pick any of ~140 cities by hand from an offline,
  diacritic-insensitive search in three scripts; a chosen city drives times,
  Qibla and the calculation method exactly like a GPS fix.

## Designed to be usable by anyone

The target audience explicitly includes elderly users and people with little
experience of smartphones, which drove most of the interface decisions:

- Body text starts at 19pt and the countdown is 60pt. The OS text-size setting is
  honoured on top of that, up to 1.6x.
- Every tappable target is at least 56pt tall, and the whole row is the target —
  never just a small control inside it.
- Three tabs, always labelled, no nested navigation. Every screen is one press
  from every other screen. Nothing is hidden behind a gesture or an unlabelled
  icon.
- Selection is shown by a tick *and* a tinted background, so it survives
  colour-blindness and a dimmed screen. All foreground/background pairs meet
  WCAG AA contrast.
- The Qibla instruction is physical, not numerical: turn until the Kaaba on the
  dial meets the arrow, with a dotted arc showing how far is left to go. The
  small print gives a compass direction in words ("Makkah is to the
  northeast"), never raw degrees.
- Every setting has a working default, so Settings is entirely optional.

## Default language by region

First launch picks a language from the device's region, then offers it for
confirmation on a single screen with all three options written in their own
script:

| Where the phone is set to | Language |
| ------------------------- | -------- |
| Turkey, or a Turkish-language device | Turkish |
| United States | English |
| Everywhere else | Arabic |

Region wins over language inside those two countries, so an English speaker
living in Turkey gets the timetable conventions their neighbours use, and vice
versa.

iOS exposes no public API for the App Store storefront without StoreKit, so this
uses the device's **Region** setting, which is what the store account country
tracks in practice; the region's currency (`TRY`, `USD`) is a fallback signal for
the same thing when the region code is missing. Android has no storefront concept
and the region setting is the only meaningful input. Once a language is chosen it
is stored and the region is never consulted again.

The rules live in `src/i18n/resolveLanguage.ts` and are covered by tests.

## Accuracy

Prayer times come from [`adhan`](https://github.com/batoulapps/adhan-js), the
high-precision astronomical library most well-regarded prayer apps use. On top of
it this app:

- **Picks the calculation method from your country** — Diyanet in Turkey, ISNA in
  North America, Umm al-Qura in Saudi Arabia, and so on, so the times match the
  timetable posted at the local mosque without anyone opening Settings. It stays
  overridable.
- **Handles high latitudes.** Above roughly 48° the sun may never reach the
  twilight angle that defines Fajr and Isha; the recommended high-latitude rule
  and the "nearest locality" polar-circle resolution keep the timetable sane
  inside the Arctic circle.
- **Solves the Qibla as a great circle**, not a flat-map angle. The two disagree
  by roughly 30° in New York, so this matters everywhere outside Arabia.

The test suite pins these against published references — the Diyanet timetable
for Istanbul, the Umm al-Qura rule that Isha falls exactly 90 minutes after
Maghrib, and the documented Qibla bearings for five cities across four
continents.

## Privacy

There is no account, no analytics, and no backend. Location is used on the device
to compute times and the Qibla, and is stored only on the device. The one
optional network call is reverse geocoding, purely to show a city name on the
home screen; if it fails the app carries on without it.

Only `ACCESS_COARSE_LOCATION` / `ACCESS_FINE_LOCATION` ("when in use") are
requested. Background location is explicitly blocked in `app.json`, and the iOS
"Always" permission strings are removed so the app cannot ask for more than it
needs.

## Running it

```bash
npm install
npx expo start          # then press i / a, or scan the QR code
```

`expo-location`, `expo-notifications` and `expo-sensors` need native code, so use
a development build rather than Expo Go:

```bash
npx expo run:ios        # or: npx expo run:android
```

### Tests and typecheck

```bash
npm test
npm run typecheck
```

Tests cover the pure logic only — prayer times, Qibla maths, language
resolution, reminder scheduling and formatting — and run in plain Node with no
native mocks. They use `jest` directly rather than `jest-expo`, whose transitive
`react-dom` dependency conflicts with the React version Expo SDK 57 pins.
`adhan` is mapped to its ESM build in the Jest config because the package
declares `"type": "module"` while shipping CommonJS files, which Node's resolver
rejects; Metro selects the same ESM build, so tests and app exercise identical
code.

## Building for the stores

```bash
npm install -g eas-cli
eas login
eas build:configure          # sets extra.eas.projectId in app.json
eas build --platform all --profile production
eas submit --platform all
```

`eas build:configure` (or `eas init`) links the project to your Expo account
and writes `extra.eas.projectId` into `app.json` — commit that change. Set
`ios.bundleIdentifier` / `android.package` if `com.connectedwise.zaman` is not
the intended identifier.

The store listing needs no paid tier: the app has no purchases, subscriptions or
ads. `ios.config.usesNonExemptEncryption` is already declared `false`, which
clears the export-compliance question on every App Store submission.

### A note on Android exact alarms

Reminders are scheduled through `AlarmManager`. On Android 12+ exact alarms need
`SCHEDULE_EXACT_ALARM`, which is declared here and which the user can grant in
system settings; without it `expo-notifications` falls back to
`setAndAllowWhileIdle`, which may drift by a few minutes under Doze.
`USE_EXACT_ALARM` — the variant that is granted automatically — is deliberately
**not** declared, since Google Play restricts it to alarm-clock and calendar
apps and using it risks a policy rejection.

iOS holds at most 64 pending local notifications per app, so Zaman maintains a
rolling window of the next 50 reminders (about ten days) and rebuilds it whenever
the app is opened or the location, language or settings change.

## Layout

```
app/                       Routes (expo-router)
  _layout.tsx              Providers, splash, onboarding guard
  welcome/                 First-run: language, location, reminders
  (tabs)/                  Prayer times, Qibla, Settings
src/
  components/              Text, Button, Card, PrayerRow, CompassDial, …
  hooks/                   useNow (ticking clock), useCompassHeading
  i18n/                    Translations and the region → language rule
  lib/                     prayer, qibla, cities, location, notifications, time, storage
  state/AppProvider.tsx    Settings, location and the reminder queue
  theme/                   Colour, type scale and spacing tokens
__tests__/                 Unit tests for the pure logic
scripts/generate-icons.py  Regenerates the icon set from one definition
```

## Licence

MIT — see [LICENSE](LICENSE).
