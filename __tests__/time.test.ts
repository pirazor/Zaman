import { defaultTimeFormat, formatTime } from '../src/lib/time';

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
  it('uses a 12-hour clock where that is the convention', () => {
    expect(defaultTimeFormat('US')).toBe('12h');
    expect(defaultTimeFormat('EG')).toBe('12h');
    expect(defaultTimeFormat('au')).toBe('12h');
  });

  it('uses a 24-hour clock elsewhere, including when the region is unknown', () => {
    expect(defaultTimeFormat('TR')).toBe('24h');
    expect(defaultTimeFormat('DE')).toBe('24h');
    expect(defaultTimeFormat(undefined)).toBe('24h');
  });
});
