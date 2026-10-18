/**
 * Keeps React Native's own right-to-left mirroring switched off.
 *
 * The app mirrors its layout itself, following the language chosen in the app
 * rather than the phone's (see `Text` and the `row-reverse` styles). Left on,
 * React Native would additionally mirror everything whenever the *phone* is
 * set to Arabic, and the two flips cancel out: Arabic laid out left to right,
 * or English mirrored for someone whose phone is in Arabic.
 *
 * The `supportsRTL: false` build setting stops this before the first frame.
 * This covers builds made before that setting existed: it switches mirroring
 * off and reloads once, which is when React Native reads the preference.
 */

import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reloadAppAsync } from 'expo';

const ATTEMPT_KEY = 'zaman.nativeRtlResetAt';

/** Resolves `true` when a reload is underway and nothing should render. */
export async function ensureNativeLayoutLTR(): Promise<boolean> {
  if (!I18nManager.isRTL) return false;

  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);

  try {
    // A reload that did not take effect is not retried in a loop.
    const last = Number(await AsyncStorage.getItem(ATTEMPT_KEY));
    if (Date.now() - last < 60_000) return false;

    await AsyncStorage.setItem(ATTEMPT_KEY, String(Date.now()));
    await reloadAppAsync('Switching off native right-to-left mirroring');
    return true;
  } catch {
    return false;
  }
}
