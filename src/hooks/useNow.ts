import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

/**
 * A `Date` that advances once a second, for the countdown.
 *
 * Two details matter for battery and correctness: the timer stops while the
 * app is backgrounded, and it resyncs immediately on return so a countdown
 * that has been off screen for an hour is never briefly wrong.
 */
export function useNow(intervalMs = 1000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer) return;
      setNow(new Date());
      timer = setInterval(() => setNow(new Date()), intervalMs);
    };

    const stop = () => {
      if (!timer) return;
      clearInterval(timer);
      timer = undefined;
    };

    if (AppState.currentState === 'active') start();

    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') start();
      else stop();
    });

    return () => {
      stop();
      subscription.remove();
    };
  }, [intervalMs]);

  return now;
}
