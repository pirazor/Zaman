import { defaultTimeFormat, formatCountdown, formatTime } from '../src/lib/time';

/**
 * Dates are built from local components (`new Date(y, m, d, h, min)`), so the
 * hour read back is the hour written regardless of the machine's timezone.
 */
const localTime = (hours: number, minutes: number) => new Date(2026, 7, 9, hours, minutes);

describe('formatTime', () => {
  it('pads the 24-hour clock to a fixed width', () => {
    expect(formatTime(localTime(4, 5), '24h')).toBe('04:05');
    expect(formatTime(localTime(18, 42), '24h')).toBe('18:42');
    expect(formatTime(localTime(0, 0), '24h')).toBe('00:00');
    expect(formatTime(localTime(23, 59), '24h')).toBe('23:59');
  });

  it('renders the 12-hour clock with a meridiem', () => {
    expect(formatTime(localTime(4, 5), '12h')).toBe('4:05 AM');
    expect(formatTime(localTime(18, 42), '12h')).toBe('6:42 PM');
  });

  it('shows noon and midnight as 12, not 0', () => {
    expect(formatTime(localTime(0, 30), '12h')).toBe('12:30 AM');
    expect(formatTime(localTime(12, 30), '12h')).toBe('12:30 PM');
  });
});

describe('formatCountdown', () => {
  const minutes = (n: number) => n * 60 * 1000;
  const hours = (n: number) => n * 60 * minutes(1);

  it('omits the hours field under one hour', () => {
    expect(formatCountdown(minutes(23) + 45_000)).toBe('23:45');
    expect(formatCountdown(45_000)).toBe('00:45');
  });

  it('includes hours, unpadded, above one hour', () => {
    expect(formatCountdown(hours(1) + minutes(23) + 45_000)).toBe('1:23:45');
    expect(formatCountdown(hours(12) + minutes(5) + 6_000)).toBe('12:05:06');
  });

  it('floors partial seconds so the countdown never shows a time already past', () => {
    expect(formatCountdown(59_999)).toBe('00:59');
  });

  it('clamps a lapsed countdown to zero rather than going negative', () => {
    expect(formatCountdown(0)).toBe('00:00');
    expect(formatCountdown(-5_000)).toBe('00:00');
  });

  it('is monotonic as time runs down', () => {
    const samples = [hours(3), hours(1), minutes(30), minutes(1), 1_000, 0];
    const rendered = samples.map(formatCountdown);
    expect(new Set(rendered).size).toBe(rendered.length);
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
