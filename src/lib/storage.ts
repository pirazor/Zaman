/**
 * Persisted state. Everything the app remembers lives on the device; there is
 * no account and nothing is synced.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from '../i18n/translations';
import type { CalculationMethodKey, MadhabKey, Position } from './prayer';
import type { TimeFormat } from './time';

const KEY = 'zaman.state.v1';

export interface CachedPlace extends Position {
  /** Human-readable label, e.g. "Istanbul". Absent if reverse geocoding failed. */
  label?: string;
  /** Region code from reverse geocoding, used to pick a calculation method. */
  region?: string;
  /** Epoch milliseconds of the fix. */
  capturedAt: number;
}

export interface PersistedState {
  /** Set once the user has been through the welcome screens. */
  onboarded: boolean;
  /** Explicit choice; `undefined` means "still following the device region". */
  language?: Language;
  /** Explicit choice; `undefined` means "derive from the user's region". */
  method?: CalculationMethodKey;
  madhab: MadhabKey;
  timeFormat?: TimeFormat;
  notificationsEnabled: boolean;
  reminderMinutes: number;
  place?: CachedPlace;
  /**
   * Id of a manually chosen city from `cities.ts`; `undefined` means the
   * location is automatic (GPS). A manual city overrides `place` everywhere.
   */
  manualCityId?: string;
}

export const DEFAULT_STATE: PersistedState = {
  onboarded: false,
  madhab: 'shafi',
  notificationsEnabled: true,
  reminderMinutes: 15,
};

export async function loadState(): Promise<PersistedState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...(JSON.parse(raw) as Partial<PersistedState>) };
  } catch {
    // A corrupt or unreadable store must not stop the app from opening; the
    // user simply sees defaults again.
    return DEFAULT_STATE;
  }
}

export async function saveState(state: PersistedState): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Non-fatal: the session continues with in-memory state.
  }
}
