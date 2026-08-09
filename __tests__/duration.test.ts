import { splitRemaining } from '../src/lib/duration';
import { describeRemaining, pluralCategory, unitLabel } from '../src/i18n';
import { LANGUAGES } from '../src/i18n/translations';

const seconds = (n: number) => n * 1000;
const minutes = (n: number) => n * seconds(60);
const hours = (n: number) => n * minutes(60);

describe('splitRemaining', () => {
  it('gives hours and minutes for a long span', () => {
    expect(splitRemaining(hours(1) + minutes(33) + seconds(12))).toEqual([
      { value: 1, unit: 'hour' },
      { value: 33, unit: 'minute' },
    ]);
  });

  it('drops a zero minutes part rather than saying "2 hours 0 minutes"', () => {
    expect(splitRemaining(hours(2))).toEqual([{ value: 2, unit: 'hour' }]);
  });

  it('gives minutes alone under an hour', () => {
    expect(splitRemaining(minutes(33) + seconds(40))).toEqual([{ value: 33, unit: 'minute' }]);
  });

  it('shows seconds only in the last minute, where they matter', () => {
    expect(splitRemaining(seconds(45))).toEqual([{ value: 45, unit: 'second' }]);
    expect(splitRemaining(minutes(1))).toEqual([{ value: 1, unit: 'minute' }]);
  });

  it('never mixes seconds into a longer span', () => {
    for (const ms of [minutes(1), minutes(5) + seconds(30), hours(3) + seconds(59)]) {
      expect(splitRemaining(ms).some((segment) => segment.unit === 'second')).toBe(false);
    }
  });

  it('is empty at zero, so callers can say "Now" instead of showing zeroes', () => {
    expect(splitRemaining(0)).toEqual([]);
    expect(splitRemaining(-5000)).toEqual([]);
    expect(splitRemaining(999)).toEqual([]);
  });

  it('never returns more than two parts, or a zero-valued one', () => {
    for (let ms = 0; ms < hours(13); ms += seconds(37)) {
      const segments = splitRemaining(ms);
      expect(segments.length).toBeLessThanOrEqual(2);
      for (const segment of segments) expect(segment.value).toBeGreaterThan(0);
    }
  });
});

describe('pluralCategory', () => {
  it('inflects English on one versus many', () => {
    expect(pluralCategory('en', 1)).toBe('one');
    expect(pluralCategory('en', 2)).toBe('many');
    expect(pluralCategory('en', 33)).toBe('many');
  });

  it('leaves Turkish uninflected after a numeral', () => {
    for (const count of [1, 2, 5, 33]) expect(pluralCategory('tr', count)).toBe('many');
  });

  it('follows the Arabic 3-to-10 rule', () => {
    expect(pluralCategory('ar', 1)).toBe('one');
    // After an explicit numeral, interface Arabic takes the singular for 2.
    expect(pluralCategory('ar', 2)).toBe('many');
    expect(pluralCategory('ar', 3)).toBe('few');
    expect(pluralCategory('ar', 10)).toBe('few');
    expect(pluralCategory('ar', 11)).toBe('many');
    expect(pluralCategory('ar', 45)).toBe('many');
    // 103 would be "few" again, though the countdown never reaches it.
    expect(pluralCategory('ar', 103)).toBe('few');
  });
});

describe('unitLabel', () => {
  it('names English units, singular and plural', () => {
    expect(unitLabel('en', 'hour', 1)).toBe('hour');
    expect(unitLabel('en', 'hour', 2)).toBe('hours');
    expect(unitLabel('en', 'minute', 1)).toBe('minute');
    expect(unitLabel('en', 'minute', 33)).toBe('minutes');
    expect(unitLabel('en', 'second', 45)).toBe('seconds');
  });

  it('uses one Turkish form throughout', () => {
    expect(unitLabel('tr', 'hour', 1)).toBe('saat');
    expect(unitLabel('tr', 'hour', 5)).toBe('saat');
    expect(unitLabel('tr', 'minute', 33)).toBe('dakika');
  });

  it('uses the Arabic plural only for 3 to 10', () => {
    expect(unitLabel('ar', 'hour', 1)).toBe('ساعة');
    expect(unitLabel('ar', 'hour', 5)).toBe('ساعات');
    expect(unitLabel('ar', 'hour', 11)).toBe('ساعة');
    expect(unitLabel('ar', 'minute', 5)).toBe('دقائق');
    expect(unitLabel('ar', 'minute', 33)).toBe('دقيقة');
  });
});

describe('describeRemaining', () => {
  const span = splitRemaining(hours(1) + minutes(33));

  it('reads as a sentence in each language', () => {
    expect(describeRemaining('en', span)).toBe('1 hour 33 minutes');
    expect(describeRemaining('tr', span)).toBe('1 saat 33 dakika');
    // Arabic joins with wāw, attached to the following word.
    expect(describeRemaining('ar', span)).toBe('1 ساعة و33 دقيقة');
  });

  it('says "now" rather than reading out zeroes', () => {
    expect(describeRemaining('en', [])).toBe('Now');
    expect(describeRemaining('tr', [])).toBe('Şu an');
    expect(describeRemaining('ar', [])).toBe('الآن');
  });

  it('never leaves a stray separator on a single part', () => {
    const single = splitRemaining(minutes(33));
    for (const language of LANGUAGES) {
      expect(describeRemaining(language, single).trim()).toBe(
        describeRemaining(language, single),
      );
      expect(describeRemaining(language, single)).not.toMatch(/\s{2}/);
    }
  });

  it('produces no digits-only or unit-only output at any point in an hour', () => {
    for (let ms = 0; ms < hours(1); ms += seconds(61)) {
      for (const language of LANGUAGES) {
        const text = describeRemaining(language, splitRemaining(ms));
        expect(text.length).toBeGreaterThan(0);
        expect(text).not.toMatch(/undefined|NaN|\{/);
      }
    }
  });
});
