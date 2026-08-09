import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import * as Localization from 'expo-localization';

import {
  createTranslator,
  isSupportedLanguage,
  resolveDefaultLanguage,
  resolveRegion,
  RTL_LANGUAGES,
  type Language,
  type Translate,
} from '../i18n';
import {
  captureLocation,
  isFresh,
  toPosition,
  type LocationStatus,
} from '../lib/location';
import { syncReminders } from '../lib/notifications';
import {
  defaultMethodForRegion,
  type CalculationMethodKey,
  type MadhabKey,
  type PrayerSettings,
  type Position,
} from '../lib/prayer';
import {
  DEFAULT_STATE,
  loadState,
  saveState,
  type CachedPlace,
  type PersistedState,
} from '../lib/storage';
import { defaultTimeFormat, type TimeFormat } from '../lib/time';
import { palettes, type ColorScheme, type Palette } from '../theme';

interface AppContextValue {
  ready: boolean;
  onboarded: boolean;

  language: Language;
  isRTL: boolean;
  t: Translate;

  scheme: ColorScheme;
  colors: Palette;

  /** Country the app believes the user is in, from GPS first, locale second. */
  region: string | undefined;

  method: CalculationMethodKey;
  /** True when `method` is derived from the region rather than chosen. */
  methodIsAutomatic: boolean;
  madhab: MadhabKey;
  prayerSettings: PrayerSettings;
  timeFormat: TimeFormat;

  notificationsEnabled: boolean;
  reminderMinutes: number;

  place: CachedPlace | undefined;
  position: Position | undefined;
  locationStatus: LocationStatus;

  setLanguage: (language: Language) => void;
  setMethod: (method: CalculationMethodKey | undefined) => void;
  setMadhab: (madhab: MadhabKey) => void;
  setTimeFormat: (format: TimeFormat) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setReminderMinutes: (minutes: number) => void;
  completeOnboarding: () => void;
  refreshLocation: () => Promise<LocationStatus>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  // The device locales never change while the app is running, and reading them
  // is a synchronous bridge call, so resolve once.
  const deviceLocales = useMemo(() => Localization.getLocales(), []);
  const localeRegion = useMemo(() => resolveRegion(deviceLocales), [deviceLocales]);

  useEffect(() => {
    let cancelled = false;
    loadState().then((loaded) => {
      if (cancelled) return;
      setState(loaded);
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const update = useCallback((patch: Partial<PersistedState>) => {
    setState((previous) => {
      const next = { ...previous, ...patch };
      void saveState(next);
      return next;
    });
  }, []);

  const language: Language = isSupportedLanguage(state.language)
    ? state.language
    : resolveDefaultLanguage(deviceLocales);

  const isRTL = RTL_LANGUAGES.includes(language);
  const t = useMemo(() => createTranslator(language), [language]);

  const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';
  const colors = palettes[scheme];

  // A GPS fix knows where the user actually is; the phone's locale only knows
  // how it is configured. Prefer the former when choosing regional defaults.
  const region = state.place?.region ?? localeRegion;

  const methodIsAutomatic = state.method === undefined;
  const method = state.method ?? defaultMethodForRegion(region);
  const timeFormat = state.timeFormat ?? defaultTimeFormat(region);

  const prayerSettings = useMemo<PrayerSettings>(
    () => ({ method, madhab: state.madhab }),
    [method, state.madhab],
  );

  const position = state.place ? toPosition(state.place) : undefined;

  const refreshLocation = useCallback(async (): Promise<LocationStatus> => {
    setLocationStatus('requesting');
    const result = await captureLocation();
    setLocationStatus(result.status);
    if (result.place) update({ place: result.place });
    return result.status;
  }, [update]);

  // Capture a fix on launch, reusing a recent one so the timetable is on screen
  // immediately rather than after a GPS round trip.
  const didAutoLocate = useRef(false);
  useEffect(() => {
    if (!ready || didAutoLocate.current) return;
    didAutoLocate.current = true;

    if (isFresh(state.place)) {
      setLocationStatus('granted');
      return;
    }
    void refreshLocation();
  }, [ready, state.place, refreshLocation]);

  // Keep the reminder queue in step with everything it depends on. Re-running
  // on each change is cheap and is what guarantees reminders never reflect a
  // stale location, language or calculation method.
  useEffect(() => {
    if (!ready || !position) return;

    void syncReminders({
      position,
      prayerSettings,
      language,
      timeFormat,
      reminderMinutes: state.reminderMinutes,
      enabled: state.notificationsEnabled,
    });
    // `position` is rebuilt on every render, so depend on the underlying values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ready,
    state.place?.latitude,
    state.place?.longitude,
    prayerSettings,
    language,
    timeFormat,
    state.reminderMinutes,
    state.notificationsEnabled,
  ]);

  const value = useMemo<AppContextValue>(
    () => ({
      ready,
      onboarded: state.onboarded,
      language,
      isRTL,
      t,
      scheme,
      colors,
      region,
      method,
      methodIsAutomatic,
      madhab: state.madhab,
      prayerSettings,
      timeFormat,
      notificationsEnabled: state.notificationsEnabled,
      reminderMinutes: state.reminderMinutes,
      place: state.place,
      position,
      locationStatus,
      setLanguage: (next) => update({ language: next }),
      setMethod: (next) => update({ method: next }),
      setMadhab: (next) => update({ madhab: next }),
      setTimeFormat: (next) => update({ timeFormat: next }),
      setNotificationsEnabled: (next) => update({ notificationsEnabled: next }),
      setReminderMinutes: (next) => update({ reminderMinutes: next }),
      completeOnboarding: () => update({ onboarded: true }),
      refreshLocation,
    }),
    [
      ready,
      state,
      language,
      isRTL,
      t,
      scheme,
      colors,
      region,
      method,
      methodIsAutomatic,
      prayerSettings,
      timeFormat,
      position,
      locationStatus,
      update,
      refreshLocation,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used inside <AppProvider>');
  return context;
}
