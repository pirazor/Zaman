/**
 * Offline city database for manual location selection.
 *
 * Users behind a denied location permission — or choosing times for somewhere
 * they are not — pick a city here instead. Each entry carries its endonyms in
 * the three app languages, coordinates for the solar calculation, and the
 * calculation method its country's authority publishes, so a manual choice
 * behaves exactly like a GPS fix.
 *
 * Pure module — no React or React Native imports — so it is unit testable.
 */

import type { CalculationMethodKey, Position } from './prayer';
import type { Language } from '../i18n/translations';

export interface City {
  /** Stable identifier, persisted in settings. */
  id: string;
  names: Record<Language, string>;
  latitude: number;
  longitude: number;
  /** The method this city's national authority uses. */
  method: CalculationMethodKey;
}

function city(
  id: string,
  en: string,
  tr: string,
  ar: string,
  latitude: number,
  longitude: number,
  method: CalculationMethodKey,
): City {
  return { id, names: { en, tr, ar }, latitude, longitude, method };
}

export const CITIES: readonly City[] = [
  city('istanbul', 'Istanbul', 'İstanbul', 'إسطنبول', 41.01, 28.98, 'Turkey'),
  city('ankara', 'Ankara', 'Ankara', 'أنقرة', 39.93, 32.86, 'Turkey'),
  city('izmir', 'Izmir', 'İzmir', 'إزمير', 38.42, 27.14, 'Turkey'),
  city('bursa', 'Bursa', 'Bursa', 'بورصة', 40.19, 29.06, 'Turkey'),
  city('antalya', 'Antalya', 'Antalya', 'أنطاليا', 36.9, 30.71, 'Turkey'),
  city('konya', 'Konya', 'Konya', 'قونية', 37.87, 32.48, 'Turkey'),
  city('adana', 'Adana', 'Adana', 'أضنة', 37, 35.32, 'Turkey'),
  city('gaziantep', 'Gaziantep', 'Gaziantep', 'غازي عنتاب', 37.07, 37.38, 'Turkey'),
  city('kayseri', 'Kayseri', 'Kayseri', 'قيصري', 38.72, 35.49, 'Turkey'),
  city('trabzon', 'Trabzon', 'Trabzon', 'طرابزون', 41, 39.72, 'Turkey'),
  city('diyarbakir', 'Diyarbakır', 'Diyarbakır', 'ديار بكر', 37.91, 40.24, 'Turkey'),
  city('london', 'London', 'Londra', 'لندن', 51.51, -0.13, 'MuslimWorldLeague'),
  city('birmingham', 'Birmingham', 'Birmingham', 'برمنغهام', 52.49, -1.89, 'MuslimWorldLeague'),
  city('manchester', 'Manchester', 'Manchester', 'مانشستر', 53.48, -2.24, 'MuslimWorldLeague'),
  city('paris', 'Paris', 'Paris', 'باريس', 48.86, 2.35, 'MuslimWorldLeague'),
  city('lyon', 'Lyon', 'Lyon', 'ليون', 45.76, 4.84, 'MuslimWorldLeague'),
  city('marseille', 'Marseille', 'Marsilya', 'مرسيليا', 43.3, 5.37, 'MuslimWorldLeague'),
  city('berlin', 'Berlin', 'Berlin', 'برلين', 52.52, 13.41, 'MuslimWorldLeague'),
  city('frankfurt', 'Frankfurt', 'Frankfurt', 'فرانكفورت', 50.11, 8.68, 'MuslimWorldLeague'),
  city('munich', 'Munich', 'Münih', 'ميونخ', 48.14, 11.58, 'MuslimWorldLeague'),
  city('cologne', 'Cologne', 'Köln', 'كولونيا', 50.94, 6.96, 'MuslimWorldLeague'),
  city('hamburg', 'Hamburg', 'Hamburg', 'هامبورغ', 53.55, 9.99, 'MuslimWorldLeague'),
  city('amsterdam', 'Amsterdam', 'Amsterdam', 'أمستردام', 52.37, 4.9, 'MuslimWorldLeague'),
  city('rotterdam', 'Rotterdam', 'Rotterdam', 'روتردام', 51.92, 4.48, 'MuslimWorldLeague'),
  city('brussels', 'Brussels', 'Brüksel', 'بروكسل', 50.85, 4.35, 'MuslimWorldLeague'),
  city('vienna', 'Vienna', 'Viyana', 'فيينا', 48.21, 16.37, 'MuslimWorldLeague'),
  city('zurich', 'Zurich', 'Zürih', 'زيورخ', 47.37, 8.54, 'MuslimWorldLeague'),
  city('stockholm', 'Stockholm', 'Stokholm', 'ستوكهولم', 59.33, 18.07, 'MuslimWorldLeague'),
  city('oslo', 'Oslo', 'Oslo', 'أوسلو', 59.91, 10.75, 'MuslimWorldLeague'),
  city('copenhagen', 'Copenhagen', 'Kopenhag', 'كوبنهاغن', 55.68, 12.57, 'MuslimWorldLeague'),
  city('madrid', 'Madrid', 'Madrid', 'مدريد', 40.42, -3.7, 'MuslimWorldLeague'),
  city('barcelona', 'Barcelona', 'Barselona', 'برشلونة', 41.39, 2.17, 'MuslimWorldLeague'),
  city('rome', 'Rome', 'Roma', 'روما', 41.9, 12.5, 'MuslimWorldLeague'),
  city('milan', 'Milan', 'Milano', 'ميلانو', 45.46, 9.19, 'MuslimWorldLeague'),
  city('sarajevo', 'Sarajevo', 'Saraybosna', 'سراييفو', 43.86, 18.41, 'MuslimWorldLeague'),
  city('skopje', 'Skopje', 'Üsküp', 'سكوبيه', 42, 21.43, 'MuslimWorldLeague'),
  city('tirana', 'Tirana', 'Tiran', 'تيرانا', 41.33, 19.82, 'MuslimWorldLeague'),
  city('athens', 'Athens', 'Atina', 'أثينا', 37.98, 23.73, 'MuslimWorldLeague'),
  city('moscow', 'Moscow', 'Moskova', 'موسكو', 55.76, 37.62, 'MuslimWorldLeague'),
  city('kazan', 'Kazan', 'Kazan', 'قازان', 55.8, 49.11, 'MuslimWorldLeague'),
  city('new-york', 'New York', 'New York', 'نيويورك', 40.71, -74.01, 'NorthAmerica'),
  city('toronto', 'Toronto', 'Toronto', 'تورونتو', 43.65, -79.38, 'NorthAmerica'),
  city('montreal', 'Montreal', 'Montreal', 'مونتريال', 45.5, -73.57, 'NorthAmerica'),
  city('chicago', 'Chicago', 'Şikago', 'شيكاغو', 41.88, -87.63, 'NorthAmerica'),
  city('houston', 'Houston', 'Houston', 'هيوستن', 29.76, -95.37, 'NorthAmerica'),
  city('dallas', 'Dallas', 'Dallas', 'دالاس', 32.78, -96.8, 'NorthAmerica'),
  city('detroit', 'Detroit', 'Detroit', 'ديترويت', 42.33, -83.05, 'NorthAmerica'),
  city('washington', 'Washington', 'Washington', 'واشنطن', 38.91, -77.04, 'NorthAmerica'),
  city('boston', 'Boston', 'Boston', 'بوسطن', 42.36, -71.06, 'NorthAmerica'),
  city('philadelphia', 'Philadelphia', 'Philadelphia', 'فيلادلفيا', 39.95, -75.17, 'NorthAmerica'),
  city('atlanta', 'Atlanta', 'Atlanta', 'أتلانتا', 33.75, -84.39, 'NorthAmerica'),
  city('miami', 'Miami', 'Miami', 'ميامي', 25.76, -80.19, 'NorthAmerica'),
  city('minneapolis', 'Minneapolis', 'Minneapolis', 'مينيابوليس', 44.98, -93.27, 'NorthAmerica'),
  city('denver', 'Denver', 'Denver', 'دنفر', 39.74, -104.99, 'NorthAmerica'),
  city('phoenix', 'Phoenix', 'Phoenix', 'فينيكس', 33.45, -112.07, 'NorthAmerica'),
  city('los-angeles', 'Los Angeles', 'Los Angeles', 'لوس أنجلوس', 34.05, -118.24, 'NorthAmerica'),
  city('san-francisco', 'San Francisco', 'San Francisco', 'سان فرانسيسكو', 37.77, -122.42, 'NorthAmerica'),
  city('seattle', 'Seattle', 'Seattle', 'سياتل', 47.61, -122.33, 'NorthAmerica'),
  city('vancouver', 'Vancouver', 'Vancouver', 'فانكوفر', 49.28, -123.12, 'NorthAmerica'),
  city('mexico-city', 'Mexico City', 'Meksiko', 'مكسيكو', 19.43, -99.13, 'NorthAmerica'),
  city('sao-paulo', 'São Paulo', 'São Paulo', 'ساو باولو', -23.55, -46.63, 'MuslimWorldLeague'),
  city('buenos-aires', 'Buenos Aires', 'Buenos Aires', 'بوينس آيرس', -34.6, -58.38, 'MuslimWorldLeague'),
  city('cairo', 'Cairo', 'Kahire', 'القاهرة', 30.04, 31.24, 'Egyptian'),
  city('alexandria', 'Alexandria', 'İskenderiye', 'الإسكندرية', 31.2, 29.92, 'Egyptian'),
  city('casablanca', 'Casablanca', 'Kazablanka', 'الدار البيضاء', 33.57, -7.59, 'MuslimWorldLeague'),
  city('rabat', 'Rabat', 'Rabat', 'الرباط', 34.02, -6.84, 'MuslimWorldLeague'),
  city('marrakesh', 'Marrakesh', 'Marakeş', 'مراكش', 31.63, -8.01, 'MuslimWorldLeague'),
  city('algiers', 'Algiers', 'Cezayir', 'الجزائر', 36.75, 3.06, 'MuslimWorldLeague'),
  city('tunis', 'Tunis', 'Tunus', 'تونس', 36.81, 10.18, 'MuslimWorldLeague'),
  city('tripoli', 'Tripoli', 'Trablus', 'طرابلس', 32.89, 13.19, 'Egyptian'),
  city('khartoum', 'Khartoum', 'Hartum', 'الخرطوم', 15.5, 32.56, 'Egyptian'),
  city('makkah', 'Makkah', 'Mekke', 'مكة المكرمة', 21.39, 39.86, 'UmmAlQura'),
  city('madinah', 'Madinah', 'Medine', 'المدينة المنورة', 24.52, 39.57, 'UmmAlQura'),
  city('riyadh', 'Riyadh', 'Riyad', 'الرياض', 24.71, 46.68, 'UmmAlQura'),
  city('jeddah', 'Jeddah', 'Cidde', 'جدة', 21.49, 39.19, 'UmmAlQura'),
  city('dammam', 'Dammam', 'Dammam', 'الدمام', 26.43, 50.1, 'UmmAlQura'),
  city('dubai', 'Dubai', 'Dubai', 'دبي', 25.2, 55.27, 'Dubai'),
  city('abu-dhabi', 'Abu Dhabi', 'Abu Dabi', 'أبوظبي', 24.45, 54.38, 'Dubai'),
  city('sharjah', 'Sharjah', 'Şarika', 'الشارقة', 25.35, 55.42, 'Dubai'),
  city('doha', 'Doha', 'Doha', 'الدوحة', 25.29, 51.53, 'Qatar'),
  city('kuwait-city', 'Kuwait City', 'Kuveyt', 'مدينة الكويت', 29.38, 47.98, 'Kuwait'),
  city('manama', 'Manama', 'Manama', 'المنامة', 26.23, 50.59, 'UmmAlQura'),
  city('muscat', 'Muscat', 'Maskat', 'مسقط', 23.59, 58.41, 'UmmAlQura'),
  city('sanaa', 'Sanaa', 'Sana', 'صنعاء', 15.37, 44.19, 'UmmAlQura'),
  city('amman', 'Amman', 'Amman', 'عمّان', 31.95, 35.93, 'MuslimWorldLeague'),
  city('jerusalem', 'Jerusalem', 'Kudüs', 'القدس', 31.78, 35.22, 'MuslimWorldLeague'),
  city('beirut', 'Beirut', 'Beyrut', 'بيروت', 33.89, 35.5, 'MuslimWorldLeague'),
  city('damascus', 'Damascus', 'Şam', 'دمشق', 33.51, 36.29, 'MuslimWorldLeague'),
  city('baghdad', 'Baghdad', 'Bağdat', 'بغداد', 33.32, 44.37, 'MuslimWorldLeague'),
  city('basra', 'Basra', 'Basra', 'البصرة', 30.51, 47.78, 'MuslimWorldLeague'),
  city('erbil', 'Erbil', 'Erbil', 'أربيل', 36.19, 44.01, 'MuslimWorldLeague'),
  city('tehran', 'Tehran', 'Tahran', 'طهران', 35.69, 51.39, 'Tehran'),
  city('mashhad', 'Mashhad', 'Meşhed', 'مشهد', 36.3, 59.61, 'Tehran'),
  city('isfahan', 'Isfahan', 'İsfahan', 'أصفهان', 32.65, 51.67, 'Tehran'),
  city('kabul', 'Kabul', 'Kabil', 'كابل', 34.56, 69.21, 'Karachi'),
  city('tashkent', 'Tashkent', 'Taşkent', 'طشقند', 41.3, 69.24, 'MuslimWorldLeague'),
  city('almaty', 'Almaty', 'Almatı', 'ألماتي', 43.24, 76.89, 'MuslimWorldLeague'),
  city('baku', 'Baku', 'Bakü', 'باكو', 40.41, 49.87, 'MuslimWorldLeague'),
  city('karachi', 'Karachi', 'Karaçi', 'كراتشي', 24.86, 67, 'Karachi'),
  city('lahore', 'Lahore', 'Lahor', 'لاهور', 31.52, 74.36, 'Karachi'),
  city('islamabad', 'Islamabad', 'İslamabad', 'إسلام آباد', 33.68, 73.05, 'Karachi'),
  city('peshawar', 'Peshawar', 'Peşaver', 'بيشاور', 34.01, 71.58, 'Karachi'),
  city('faisalabad', 'Faisalabad', 'Faysalabad', 'فيصل آباد', 31.42, 73.08, 'Karachi'),
  city('delhi', 'Delhi', 'Delhi', 'دلهي', 28.61, 77.21, 'Karachi'),
  city('mumbai', 'Mumbai', 'Mumbai', 'مومباي', 19.08, 72.88, 'Karachi'),
  city('hyderabad', 'Hyderabad', 'Haydarabad', 'حيدر آباد', 17.39, 78.49, 'Karachi'),
  city('lucknow', 'Lucknow', 'Lucknow', 'لكناو', 26.85, 80.95, 'Karachi'),
  city('dhaka', 'Dhaka', 'Dakka', 'دكا', 23.81, 90.41, 'Karachi'),
  city('chittagong', 'Chittagong', 'Chittagong', 'شيتاغونغ', 22.36, 91.78, 'Karachi'),
  city('colombo', 'Colombo', 'Kolombo', 'كولومبو', 6.93, 79.86, 'Karachi'),
  city('jakarta', 'Jakarta', 'Cakarta', 'جاكرتا', -6.21, 106.85, 'Singapore'),
  city('surabaya', 'Surabaya', 'Surabaya', 'سورابايا', -7.26, 112.75, 'Singapore'),
  city('bandung', 'Bandung', 'Bandung', 'باندونغ', -6.92, 107.61, 'Singapore'),
  city('medan', 'Medan', 'Medan', 'ميدان', 3.59, 98.67, 'Singapore'),
  city('kuala-lumpur', 'Kuala Lumpur', 'Kuala Lumpur', 'كوالالمبور', 3.14, 101.69, 'Singapore'),
  city('singapore', 'Singapore', 'Singapur', 'سنغافورة', 1.35, 103.82, 'Singapore'),
  city('bangkok', 'Bangkok', 'Bangkok', 'بانكوك', 13.76, 100.5, 'MuslimWorldLeague'),
  city('manila', 'Manila', 'Manila', 'مانيلا', 14.6, 120.98, 'MuslimWorldLeague'),
  city('hong-kong', 'Hong Kong', 'Hong Kong', 'هونغ كونغ', 22.32, 114.17, 'MuslimWorldLeague'),
  city('beijing', 'Beijing', 'Pekin', 'بكين', 39.9, 116.41, 'MuslimWorldLeague'),
  city('tokyo', 'Tokyo', 'Tokyo', 'طوكيو', 35.68, 139.69, 'MuslimWorldLeague'),
  city('seoul', 'Seoul', 'Seul', 'سيول', 37.57, 126.98, 'MuslimWorldLeague'),
  city('lagos', 'Lagos', 'Lagos', 'لاغوس', 6.52, 3.38, 'MuslimWorldLeague'),
  city('kano', 'Kano', 'Kano', 'كانو', 12, 8.52, 'MuslimWorldLeague'),
  city('abuja', 'Abuja', 'Abuja', 'أبوجا', 9.06, 7.5, 'MuslimWorldLeague'),
  city('accra', 'Accra', 'Akra', 'أكرا', 5.6, -0.19, 'MuslimWorldLeague'),
  city('dakar', 'Dakar', 'Dakar', 'داكار', 14.72, -17.47, 'MuslimWorldLeague'),
  city('nairobi', 'Nairobi', 'Nairobi', 'نيروبي', -1.29, 36.82, 'MuslimWorldLeague'),
  city('mogadishu', 'Mogadishu', 'Mogadişu', 'مقديشو', 2.05, 45.32, 'MuslimWorldLeague'),
  city('addis-ababa', 'Addis Ababa', 'Addis Ababa', 'أديس أبابا', 9.03, 38.74, 'MuslimWorldLeague'),
  city('dar-es-salaam', 'Dar es Salaam', 'Darüsselam', 'دار السلام', -6.79, 39.28, 'MuslimWorldLeague'),
  city('kampala', 'Kampala', 'Kampala', 'كمبالا', 0.35, 32.58, 'MuslimWorldLeague'),
  city('johannesburg', 'Johannesburg', 'Johannesburg', 'جوهانسبرغ', -26.2, 28.05, 'MuslimWorldLeague'),
  city('cape-town', 'Cape Town', 'Cape Town', 'كيب تاون', -33.92, 18.42, 'MuslimWorldLeague'),
  city('sydney', 'Sydney', 'Sidney', 'سيدني', -33.87, 151.21, 'MuslimWorldLeague'),
  city('melbourne', 'Melbourne', 'Melbourne', 'ملبورن', -37.81, 144.96, 'MuslimWorldLeague'),
  city('auckland', 'Auckland', 'Auckland', 'أوكلاند', -36.85, 174.76, 'MuslimWorldLeague'),];

/**
 * Case-, diacritic- and dotless-ı-insensitive folding, so that "sao paulo"
 * finds São Paulo and "istanbul" finds İstanbul from any keyboard.
 */
export function foldForSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i');
}

/** Maximum rows a search shows; enough to disambiguate, few enough to scan. */
export const MAX_CITY_RESULTS = 6;

/**
 * Cities whose name in any language contains the query, in database order.
 * An empty or whitespace query matches nothing rather than everything.
 */
export function searchCities(query: string, limit = MAX_CITY_RESULTS): City[] {
  const folded = foldForSearch(query.trim());
  if (!folded) return [];

  const results: City[] = [];
  for (const entry of CITIES) {
    if (Object.values(entry.names).some((name) => foldForSearch(name).includes(folded))) {
      results.push(entry);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export function cityById(id: string | undefined): City | undefined {
  return id ? CITIES.find((entry) => entry.id === id) : undefined;
}

export function cityPosition(entry: City): Position {
  return { latitude: entry.latitude, longitude: entry.longitude };
}
