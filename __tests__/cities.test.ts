import {
  CITIES,
  cityById,
  cityPosition,
  foldForSearch,
  MAX_CITY_RESULTS,
  searchCities,
} from '../src/lib/cities';
import { SELECTABLE_METHODS } from '../src/lib/prayer';
import { qiblaBearing } from '../src/lib/qibla';
import { LANGUAGES } from '../src/i18n/translations';

describe('the city database', () => {
  it('holds a worldwide set of cities', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(120);
  });

  it('gives every city a unique, stable id', () => {
    const ids = CITIES.map((city) => city.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it('names every city in all three languages', () => {
    for (const city of CITIES) {
      for (const language of LANGUAGES) {
        expect(city.names[language].trim()).not.toBe('');
      }
    }
  });

  it('keeps every coordinate on the globe', () => {
    for (const city of CITIES) {
      expect(Math.abs(city.latitude)).toBeLessThanOrEqual(90);
      expect(Math.abs(city.longitude)).toBeLessThanOrEqual(180);
    }
  });

  it('assigns every city a method the settings screen can name', () => {
    for (const city of CITIES) {
      expect(SELECTABLE_METHODS).toContain(city.method);
    }
  });

  it('gives every city a real IANA timezone', () => {
    for (const city of CITIES) {
      // An unknown zone throws here, so this catches typos in the data.
      expect(() => new Intl.DateTimeFormat('en-US', { timeZone: city.timezone })).not.toThrow();
      expect(city.timezone).toMatch(/^[A-Za-z_]+\/[A-Za-z_/]+$/);
    }
  });

  it('places flagship cities in their correct zones', () => {
    expect(cityById('istanbul')?.timezone).toBe('Europe/Istanbul');
    expect(cityById('new-york')?.timezone).toBe('America/New_York');
    expect(cityById('makkah')?.timezone).toBe('Asia/Riyadh');
    expect(cityById('tehran')?.timezone).toBe('Asia/Tehran');
    expect(cityById('delhi')?.timezone).toBe('Asia/Kolkata');
    expect(cityById('phoenix')?.timezone).toBe('America/Phoenix');
  });

  it('pairs each authority with its home cities', () => {
    expect(cityById('istanbul')?.method).toBe('Turkey');
    expect(cityById('new-york')?.method).toBe('NorthAmerica');
    expect(cityById('cairo')?.method).toBe('Egyptian');
    expect(cityById('makkah')?.method).toBe('UmmAlQura');
    expect(cityById('karachi')?.method).toBe('Karachi');
    expect(cityById('dubai')?.method).toBe('Dubai');
    expect(cityById('singapore')?.method).toBe('Singapore');
    expect(cityById('tehran')?.method).toBe('Tehran');
  });

  it('produces a usable position for prayer and qibla math', () => {
    const makkah = cityById('makkah');
    expect(makkah).toBeDefined();

    // From Makkah itself the qibla is trivially close; the point is that the
    // coordinates flow into the same math a GPS fix would.
    const bearing = qiblaBearing(cityPosition(makkah!));
    expect(Number.isFinite(bearing)).toBe(true);
  });
});

describe('foldForSearch', () => {
  it('strips diacritics', () => {
    expect(foldForSearch('São Paulo')).toBe('sao paulo');
    expect(foldForSearch('Münih')).toBe('munih');
  });

  it('folds Turkish dotless ı to i', () => {
    expect(foldForSearch('Diyarbakır')).toBe('diyarbakir');
    expect(foldForSearch('İstanbul')).toBe('istanbul');
  });

  it('lower-cases and leaves Arabic intact', () => {
    expect(foldForSearch('LONDON')).toBe('london');
    expect(foldForSearch('القاهرة')).toBe('القاهرة');
  });
});

describe('searchCities', () => {
  it('finds a city typed without its diacritics', () => {
    expect(searchCities('istanbul')[0]?.id).toBe('istanbul');
    expect(searchCities('sao paulo')[0]?.id).toBe('sao-paulo');
    expect(searchCities('munih')[0]?.id).toBe('munich');
  });

  it('matches the endonym in every language', () => {
    expect(searchCities('Kahire')[0]?.id).toBe('cairo');
    expect(searchCities('القاهرة')[0]?.id).toBe('cairo');
    expect(searchCities('Cairo')[0]?.id).toBe('cairo');
  });

  it('matches partial input', () => {
    expect(searchCities('istan').map((city) => city.id)).toContain('istanbul');
  });

  it('caps the result list at a scannable size', () => {
    const results = searchCities('a');
    expect(results.length).toBeLessThanOrEqual(MAX_CITY_RESULTS);
  });

  it('returns nothing for an empty or whitespace query', () => {
    expect(searchCities('')).toEqual([]);
    expect(searchCities('   ')).toEqual([]);
  });

  it('returns nothing for gibberish', () => {
    expect(searchCities('zzzzqqq')).toEqual([]);
  });
});
