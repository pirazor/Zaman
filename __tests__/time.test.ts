import { dateInTimeZone, defaultTimeFormat, formatTime } from '../src/lib/time';

/**
 * Dates are built from local components (`new Date(y, m, d, h, min)`), so the
 * hour read back is the hour written regardless of the machine's timezone.
 */
const localTime = (hours: number, minutes: number) => new Date(2026, 7, 9, hours, minutes);

describe('formatTime', () => {
  it('pads the 24-hour clock to a fixed width', () => {
    expect(formatTime(localTime(4, 5), '24h', 'en')).toBe('04:05');
    expect(formatTime(localTime(18, 42), '24h', 'en')).toBe('18:42');
    expect(formatTime(localTime(0, 0), '24h', 'tr')).toBe('00:00');
    expect(formatTime(localTime(23, 59), '24h', 'ar')).toBe('23:59');
  });

  it('renders the 12-hour clock with a meridiem', () => {
    expect(formatTime(localTime(4, 5), '12h', 'en')).toBe('4:05 AM');
    expect(formatTime(localTime(18, 42), '12h', 'en')).toBe('6:42 PM');
  });

  it('localizes the meridiem marker', () => {
    expect(formatTime(localTime(4, 5), '12h', 'tr')).toBe('4:05 ÖÖ');
    expect(formatTime(localTime(18, 42), '12h', 'tr')).toBe('6:42 ÖS');
    expect(formatTime(localTime(4, 5), '12h', 'ar')).toBe('4:05 ص');
    expect(formatTime(localTime(18, 42), '12h', 'ar')).toBe('6:42 م');
  });

  it('shows noon and midnight as 12, not 0', () => {
    expect(formatTime(localTime(0, 30), '12h', 'en')).toBe('12:30 AM');
    expect(formatTime(localTime(12, 30), '12h', 'en')).toBe('12:30 PM');
    expect(formatTime(localTime(0, 30), '12h', 'ar')).toBe('12:30 ص');
    expect(formatTime(localTime(12, 30), '12h', 'tr')).toBe('12:30 ÖS');
  });
});

describe('defaultTimeFormat', () => {
  it('defaults every region to the 24-hour clock', () => {
    // Timetables are published in 24-hour time; 12-hour remains a setting.
    expect(defaultTimeFormat('US')).toBe('24h');
    expect(defaultTimeFormat('TR')).toBe('24h');
    expect(defaultTimeFormat('EG')).toBe('24h');
    expect(defaultTimeFormat(undefined)).toBe('24h');
  });
});

describe('timezone-aware rendering', () => {
  // 12:00 UTC on a fixed date: 15:00 in Istanbul (UTC+3), 08:00 in New York
  // (UTC-4, summer time).
  const noonUTC = new Date(Date.UTC(2026, 7, 10, 12, 0, 0));

  it('formats a moment on another city’s wall clock', () => {
    expect(formatTime(noonUTC, '24h', 'en', 'Europe/Istanbul')).toBe('15:00');
    expect(formatTime(noonUTC, '24h', 'en', 'America/New_York')).toBe('08:00');
    expect(formatTime(noonUTC, '12h', 'en', 'America/New_York')).toBe('8:00 AM');
  });

  it('falls back to the device clock for an unknown zone', () => {
    expect(formatTime(noonUTC, '24h', 'en', 'Not/AZone')).toBe(
      formatTime(noonUTC, '24h', 'en'),
    );
  });

  it('resolves the calendar day the city is actually in', () => {
    // 23:30 in New York on the 10th is already the 11th in Istanbul.
    const lateNY = new Date(Date.UTC(2026, 7, 11, 3, 30, 0));
    expect(dateInTimeZone(lateNY, 'Europe/Istanbul').getDate()).toBe(11);
    expect(dateInTimeZone(lateNY, 'America/New_York').getDate()).toBe(10);
  });

  it('returns the input unchanged without a zone', () => {
    expect(dateInTimeZone(noonUTC, undefined)).toBe(noonUTC);
  });
});
