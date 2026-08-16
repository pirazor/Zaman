/**
 * Offline city database for manual location selection.
 *
 * Users behind a denied location permission — or wanting the timetable for
 * somewhere they are not — pick a city here instead. Each entry carries its
 * endonyms in the three app languages, coordinates for the solar calculation,
 * the calculation method its country's authority publishes, and its IANA
 * timezone, so the city's times render on the city's own clock rather than
 * the phone's.
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
  /** IANA zone, e.g. "Europe/Istanbul"; DST-correct across the year. */
  timezone: string;
}

function city(
  id: string,
  en: string,
  tr: string,
  ar: string,
  latitude: number,
  longitude: number,
  method: CalculationMethodKey,
  timezone: string,
): City {
  return { id, names: { en, tr, ar }, latitude, longitude, method, timezone };
}

export const CITIES: readonly City[] = [
  city('istanbul', 'Istanbul', 'İstanbul', 'إسطنبول', 41.01, 28.98, 'Turkey', 'Europe/Istanbul'),
  city('ankara', 'Ankara', 'Ankara', 'أنقرة', 39.93, 32.86, 'Turkey', 'Europe/Istanbul'),
  city('izmir', 'Izmir', 'İzmir', 'إزمير', 38.42, 27.14, 'Turkey', 'Europe/Istanbul'),
  city('bursa', 'Bursa', 'Bursa', 'بورصة', 40.19, 29.06, 'Turkey', 'Europe/Istanbul'),
  city('antalya', 'Antalya', 'Antalya', 'أنطاليا', 36.9, 30.71, 'Turkey', 'Europe/Istanbul'),
  city('konya', 'Konya', 'Konya', 'قونية', 37.87, 32.48, 'Turkey', 'Europe/Istanbul'),
  city('adana', 'Adana', 'Adana', 'أضنة', 37, 35.32, 'Turkey', 'Europe/Istanbul'),
  city('gaziantep', 'Gaziantep', 'Gaziantep', 'غازي عنتاب', 37.07, 37.38, 'Turkey', 'Europe/Istanbul'),
  city('kayseri', 'Kayseri', 'Kayseri', 'قيصري', 38.72, 35.49, 'Turkey', 'Europe/Istanbul'),
  city('trabzon', 'Trabzon', 'Trabzon', 'طرابزون', 41, 39.72, 'Turkey', 'Europe/Istanbul'),
  city('diyarbakir', 'Diyarbakır', 'Diyarbakır', 'ديار بكر', 37.91, 40.24, 'Turkey', 'Europe/Istanbul'),
  city('london', 'London', 'Londra', 'لندن', 51.51, -0.13, 'MuslimWorldLeague', 'Europe/London'),
  city('birmingham', 'Birmingham', 'Birmingham', 'برمنغهام', 52.49, -1.89, 'MuslimWorldLeague', 'Europe/London'),
  city('manchester', 'Manchester', 'Manchester', 'مانشستر', 53.48, -2.24, 'MuslimWorldLeague', 'Europe/London'),
  city('paris', 'Paris', 'Paris', 'باريس', 48.86, 2.35, 'MuslimWorldLeague', 'Europe/Paris'),
  city('lyon', 'Lyon', 'Lyon', 'ليون', 45.76, 4.84, 'MuslimWorldLeague', 'Europe/Paris'),
  city('marseille', 'Marseille', 'Marsilya', 'مرسيليا', 43.3, 5.37, 'MuslimWorldLeague', 'Europe/Paris'),
  city('berlin', 'Berlin', 'Berlin', 'برلين', 52.52, 13.41, 'MuslimWorldLeague', 'Europe/Berlin'),
  city('frankfurt', 'Frankfurt', 'Frankfurt', 'فرانكفورت', 50.11, 8.68, 'MuslimWorldLeague', 'Europe/Berlin'),
  city('munich', 'Munich', 'Münih', 'ميونخ', 48.14, 11.58, 'MuslimWorldLeague', 'Europe/Berlin'),
  city('cologne', 'Cologne', 'Köln', 'كولونيا', 50.94, 6.96, 'MuslimWorldLeague', 'Europe/Berlin'),
  city('hamburg', 'Hamburg', 'Hamburg', 'هامبورغ', 53.55, 9.99, 'MuslimWorldLeague', 'Europe/Berlin'),
  city('amsterdam', 'Amsterdam', 'Amsterdam', 'أمستردام', 52.37, 4.9, 'MuslimWorldLeague', 'Europe/Amsterdam'),
  city('rotterdam', 'Rotterdam', 'Rotterdam', 'روتردام', 51.92, 4.48, 'MuslimWorldLeague', 'Europe/Amsterdam'),
  city('brussels', 'Brussels', 'Brüksel', 'بروكسل', 50.85, 4.35, 'MuslimWorldLeague', 'Europe/Brussels'),
  city('vienna', 'Vienna', 'Viyana', 'فيينا', 48.21, 16.37, 'MuslimWorldLeague', 'Europe/Vienna'),
  city('zurich', 'Zurich', 'Zürih', 'زيورخ', 47.37, 8.54, 'MuslimWorldLeague', 'Europe/Zurich'),
  city('stockholm', 'Stockholm', 'Stokholm', 'ستوكهولم', 59.33, 18.07, 'MuslimWorldLeague', 'Europe/Stockholm'),
  city('oslo', 'Oslo', 'Oslo', 'أوسلو', 59.91, 10.75, 'MuslimWorldLeague', 'Europe/Oslo'),
  city('copenhagen', 'Copenhagen', 'Kopenhag', 'كوبنهاغن', 55.68, 12.57, 'MuslimWorldLeague', 'Europe/Copenhagen'),
  city('madrid', 'Madrid', 'Madrid', 'مدريد', 40.42, -3.7, 'MuslimWorldLeague', 'Europe/Madrid'),
  city('barcelona', 'Barcelona', 'Barselona', 'برشلونة', 41.39, 2.17, 'MuslimWorldLeague', 'Europe/Madrid'),
  city('rome', 'Rome', 'Roma', 'روما', 41.9, 12.5, 'MuslimWorldLeague', 'Europe/Rome'),
  city('milan', 'Milan', 'Milano', 'ميلانو', 45.46, 9.19, 'MuslimWorldLeague', 'Europe/Rome'),
  city('sarajevo', 'Sarajevo', 'Saraybosna', 'سراييفو', 43.86, 18.41, 'MuslimWorldLeague', 'Europe/Sarajevo'),
  city('skopje', 'Skopje', 'Üsküp', 'سكوبيه', 42, 21.43, 'MuslimWorldLeague', 'Europe/Skopje'),
  city('tirana', 'Tirana', 'Tiran', 'تيرانا', 41.33, 19.82, 'MuslimWorldLeague', 'Europe/Tirane'),
  city('athens', 'Athens', 'Atina', 'أثينا', 37.98, 23.73, 'MuslimWorldLeague', 'Europe/Athens'),
  city('moscow', 'Moscow', 'Moskova', 'موسكو', 55.76, 37.62, 'MuslimWorldLeague', 'Europe/Moscow'),
  city('kazan', 'Kazan', 'Kazan', 'قازان', 55.8, 49.11, 'MuslimWorldLeague', 'Europe/Moscow'),
  city('new-york', 'New York', 'New York', 'نيويورك', 40.71, -74.01, 'NorthAmerica', 'America/New_York'),
  city('toronto', 'Toronto', 'Toronto', 'تورونتو', 43.65, -79.38, 'NorthAmerica', 'America/Toronto'),
  city('montreal', 'Montreal', 'Montreal', 'مونتريال', 45.5, -73.57, 'NorthAmerica', 'America/Toronto'),
  city('chicago', 'Chicago', 'Şikago', 'شيكاغو', 41.88, -87.63, 'NorthAmerica', 'America/Chicago'),
  city('houston', 'Houston', 'Houston', 'هيوستن', 29.76, -95.37, 'NorthAmerica', 'America/Chicago'),
  city('dallas', 'Dallas', 'Dallas', 'دالاس', 32.78, -96.8, 'NorthAmerica', 'America/Chicago'),
  city('detroit', 'Detroit', 'Detroit', 'ديترويت', 42.33, -83.05, 'NorthAmerica', 'America/Detroit'),
  city('washington', 'Washington', 'Washington', 'واشنطن', 38.91, -77.04, 'NorthAmerica', 'America/New_York'),
  city('boston', 'Boston', 'Boston', 'بوسطن', 42.36, -71.06, 'NorthAmerica', 'America/New_York'),
  city('philadelphia', 'Philadelphia', 'Philadelphia', 'فيلادلفيا', 39.95, -75.17, 'NorthAmerica', 'America/New_York'),
  city('atlanta', 'Atlanta', 'Atlanta', 'أتلانتا', 33.75, -84.39, 'NorthAmerica', 'America/New_York'),
  city('miami', 'Miami', 'Miami', 'ميامي', 25.76, -80.19, 'NorthAmerica', 'America/New_York'),
  city('minneapolis', 'Minneapolis', 'Minneapolis', 'مينيابوليس', 44.98, -93.27, 'NorthAmerica', 'America/Chicago'),
  city('denver', 'Denver', 'Denver', 'دنفر', 39.74, -104.99, 'NorthAmerica', 'America/Denver'),
  city('phoenix', 'Phoenix', 'Phoenix', 'فينيكس', 33.45, -112.07, 'NorthAmerica', 'America/Phoenix'),
  city('los-angeles', 'Los Angeles', 'Los Angeles', 'لوس أنجلوس', 34.05, -118.24, 'NorthAmerica', 'America/Los_Angeles'),
  city('san-francisco', 'San Francisco', 'San Francisco', 'سان فرانسيسكو', 37.77, -122.42, 'NorthAmerica', 'America/Los_Angeles'),
  city('seattle', 'Seattle', 'Seattle', 'سياتل', 47.61, -122.33, 'NorthAmerica', 'America/Los_Angeles'),
  city('vancouver', 'Vancouver', 'Vancouver', 'فانكوفر', 49.28, -123.12, 'NorthAmerica', 'America/Vancouver'),
  city('mexico-city', 'Mexico City', 'Meksiko', 'مكسيكو', 19.43, -99.13, 'NorthAmerica', 'America/Mexico_City'),
  city('sao-paulo', 'São Paulo', 'São Paulo', 'ساو باولو', -23.55, -46.63, 'MuslimWorldLeague', 'America/Sao_Paulo'),
  city('buenos-aires', 'Buenos Aires', 'Buenos Aires', 'بوينس آيرس', -34.6, -58.38, 'MuslimWorldLeague', 'America/Argentina/Buenos_Aires'),
  city('cairo', 'Cairo', 'Kahire', 'القاهرة', 30.04, 31.24, 'Egyptian', 'Africa/Cairo'),
  city('alexandria', 'Alexandria', 'İskenderiye', 'الإسكندرية', 31.2, 29.92, 'Egyptian', 'Africa/Cairo'),
  city('casablanca', 'Casablanca', 'Kazablanka', 'الدار البيضاء', 33.57, -7.59, 'MuslimWorldLeague', 'Africa/Casablanca'),
  city('rabat', 'Rabat', 'Rabat', 'الرباط', 34.02, -6.84, 'MuslimWorldLeague', 'Africa/Casablanca'),
  city('marrakesh', 'Marrakesh', 'Marakeş', 'مراكش', 31.63, -8.01, 'MuslimWorldLeague', 'Africa/Casablanca'),
  city('algiers', 'Algiers', 'Cezayir', 'الجزائر', 36.75, 3.06, 'MuslimWorldLeague', 'Africa/Algiers'),
  city('tunis', 'Tunis', 'Tunus', 'تونس', 36.81, 10.18, 'MuslimWorldLeague', 'Africa/Tunis'),
  city('tripoli', 'Tripoli', 'Trablus', 'طرابلس', 32.89, 13.19, 'Egyptian', 'Africa/Tripoli'),
  city('khartoum', 'Khartoum', 'Hartum', 'الخرطوم', 15.5, 32.56, 'Egyptian', 'Africa/Khartoum'),
  city('makkah', 'Makkah', 'Mekke', 'مكة المكرمة', 21.39, 39.86, 'UmmAlQura', 'Asia/Riyadh'),
  city('madinah', 'Madinah', 'Medine', 'المدينة المنورة', 24.52, 39.57, 'UmmAlQura', 'Asia/Riyadh'),
  city('riyadh', 'Riyadh', 'Riyad', 'الرياض', 24.71, 46.68, 'UmmAlQura', 'Asia/Riyadh'),
  city('jeddah', 'Jeddah', 'Cidde', 'جدة', 21.49, 39.19, 'UmmAlQura', 'Asia/Riyadh'),
  city('dammam', 'Dammam', 'Dammam', 'الدمام', 26.43, 50.1, 'UmmAlQura', 'Asia/Riyadh'),
  city('dubai', 'Dubai', 'Dubai', 'دبي', 25.2, 55.27, 'Dubai', 'Asia/Dubai'),
  city('abu-dhabi', 'Abu Dhabi', 'Abu Dabi', 'أبوظبي', 24.45, 54.38, 'Dubai', 'Asia/Dubai'),
  city('sharjah', 'Sharjah', 'Şarika', 'الشارقة', 25.35, 55.42, 'Dubai', 'Asia/Dubai'),
  city('doha', 'Doha', 'Doha', 'الدوحة', 25.29, 51.53, 'Qatar', 'Asia/Qatar'),
  city('kuwait-city', 'Kuwait City', 'Kuveyt', 'مدينة الكويت', 29.38, 47.98, 'Kuwait', 'Asia/Kuwait'),
  city('manama', 'Manama', 'Manama', 'المنامة', 26.23, 50.59, 'UmmAlQura', 'Asia/Bahrain'),
  city('muscat', 'Muscat', 'Maskat', 'مسقط', 23.59, 58.41, 'UmmAlQura', 'Asia/Muscat'),
  city('sanaa', 'Sanaa', 'Sana', 'صنعاء', 15.37, 44.19, 'UmmAlQura', 'Asia/Aden'),
  city('amman', 'Amman', 'Amman', 'عمّان', 31.95, 35.93, 'MuslimWorldLeague', 'Asia/Amman'),
  city('jerusalem', 'Jerusalem', 'Kudüs', 'القدس', 31.78, 35.22, 'MuslimWorldLeague', 'Asia/Jerusalem'),
  city('beirut', 'Beirut', 'Beyrut', 'بيروت', 33.89, 35.5, 'MuslimWorldLeague', 'Asia/Beirut'),
  city('damascus', 'Damascus', 'Şam', 'دمشق', 33.51, 36.29, 'MuslimWorldLeague', 'Asia/Damascus'),
  city('baghdad', 'Baghdad', 'Bağdat', 'بغداد', 33.32, 44.37, 'MuslimWorldLeague', 'Asia/Baghdad'),
  city('basra', 'Basra', 'Basra', 'البصرة', 30.51, 47.78, 'MuslimWorldLeague', 'Asia/Baghdad'),
  city('erbil', 'Erbil', 'Erbil', 'أربيل', 36.19, 44.01, 'MuslimWorldLeague', 'Asia/Baghdad'),
  city('tehran', 'Tehran', 'Tahran', 'طهران', 35.69, 51.39, 'Tehran', 'Asia/Tehran'),
  city('mashhad', 'Mashhad', 'Meşhed', 'مشهد', 36.3, 59.61, 'Tehran', 'Asia/Tehran'),
  city('isfahan', 'Isfahan', 'İsfahan', 'أصفهان', 32.65, 51.67, 'Tehran', 'Asia/Tehran'),
  city('kabul', 'Kabul', 'Kabil', 'كابل', 34.56, 69.21, 'Karachi', 'Asia/Kabul'),
  city('tashkent', 'Tashkent', 'Taşkent', 'طشقند', 41.3, 69.24, 'MuslimWorldLeague', 'Asia/Tashkent'),
  city('almaty', 'Almaty', 'Almatı', 'ألماتي', 43.24, 76.89, 'MuslimWorldLeague', 'Asia/Almaty'),
  city('baku', 'Baku', 'Bakü', 'باكو', 40.41, 49.87, 'MuslimWorldLeague', 'Asia/Baku'),
  city('karachi', 'Karachi', 'Karaçi', 'كراتشي', 24.86, 67, 'Karachi', 'Asia/Karachi'),
  city('lahore', 'Lahore', 'Lahor', 'لاهور', 31.52, 74.36, 'Karachi', 'Asia/Karachi'),
  city('islamabad', 'Islamabad', 'İslamabad', 'إسلام آباد', 33.68, 73.05, 'Karachi', 'Asia/Karachi'),
  city('peshawar', 'Peshawar', 'Peşaver', 'بيشاور', 34.01, 71.58, 'Karachi', 'Asia/Karachi'),
  city('faisalabad', 'Faisalabad', 'Faysalabad', 'فيصل آباد', 31.42, 73.08, 'Karachi', 'Asia/Karachi'),
  city('delhi', 'Delhi', 'Delhi', 'دلهي', 28.61, 77.21, 'Karachi', 'Asia/Kolkata'),
  city('mumbai', 'Mumbai', 'Mumbai', 'مومباي', 19.08, 72.88, 'Karachi', 'Asia/Kolkata'),
  city('hyderabad', 'Hyderabad', 'Haydarabad', 'حيدر آباد', 17.39, 78.49, 'Karachi', 'Asia/Kolkata'),
  city('lucknow', 'Lucknow', 'Lucknow', 'لكناو', 26.85, 80.95, 'Karachi', 'Asia/Kolkata'),
  city('dhaka', 'Dhaka', 'Dakka', 'دكا', 23.81, 90.41, 'Karachi', 'Asia/Dhaka'),
  city('chittagong', 'Chittagong', 'Chittagong', 'شيتاغونغ', 22.36, 91.78, 'Karachi', 'Asia/Dhaka'),
  city('colombo', 'Colombo', 'Kolombo', 'كولومبو', 6.93, 79.86, 'Karachi', 'Asia/Colombo'),
  city('jakarta', 'Jakarta', 'Cakarta', 'جاكرتا', -6.21, 106.85, 'Singapore', 'Asia/Jakarta'),
  city('surabaya', 'Surabaya', 'Surabaya', 'سورابايا', -7.26, 112.75, 'Singapore', 'Asia/Jakarta'),
  city('bandung', 'Bandung', 'Bandung', 'باندونغ', -6.92, 107.61, 'Singapore', 'Asia/Jakarta'),
  city('medan', 'Medan', 'Medan', 'ميدان', 3.59, 98.67, 'Singapore', 'Asia/Jakarta'),
  city('kuala-lumpur', 'Kuala Lumpur', 'Kuala Lumpur', 'كوالالمبور', 3.14, 101.69, 'Singapore', 'Asia/Kuala_Lumpur'),
  city('singapore', 'Singapore', 'Singapur', 'سنغافورة', 1.35, 103.82, 'Singapore', 'Asia/Singapore'),
  city('bangkok', 'Bangkok', 'Bangkok', 'بانكوك', 13.76, 100.5, 'MuslimWorldLeague', 'Asia/Bangkok'),
  city('manila', 'Manila', 'Manila', 'مانيلا', 14.6, 120.98, 'MuslimWorldLeague', 'Asia/Manila'),
  city('hong-kong', 'Hong Kong', 'Hong Kong', 'هونغ كونغ', 22.32, 114.17, 'MuslimWorldLeague', 'Asia/Hong_Kong'),
  city('beijing', 'Beijing', 'Pekin', 'بكين', 39.9, 116.41, 'MuslimWorldLeague', 'Asia/Shanghai'),
  city('tokyo', 'Tokyo', 'Tokyo', 'طوكيو', 35.68, 139.69, 'MuslimWorldLeague', 'Asia/Tokyo'),
  city('seoul', 'Seoul', 'Seul', 'سيول', 37.57, 126.98, 'MuslimWorldLeague', 'Asia/Seoul'),
  city('lagos', 'Lagos', 'Lagos', 'لاغوس', 6.52, 3.38, 'MuslimWorldLeague', 'Africa/Lagos'),
  city('kano', 'Kano', 'Kano', 'كانو', 12, 8.52, 'MuslimWorldLeague', 'Africa/Lagos'),
  city('abuja', 'Abuja', 'Abuja', 'أبوجا', 9.06, 7.5, 'MuslimWorldLeague', 'Africa/Lagos'),
  city('accra', 'Accra', 'Akra', 'أكرا', 5.6, -0.19, 'MuslimWorldLeague', 'Africa/Accra'),
  city('dakar', 'Dakar', 'Dakar', 'داكار', 14.72, -17.47, 'MuslimWorldLeague', 'Africa/Dakar'),
  city('nairobi', 'Nairobi', 'Nairobi', 'نيروبي', -1.29, 36.82, 'MuslimWorldLeague', 'Africa/Nairobi'),
  city('mogadishu', 'Mogadishu', 'Mogadişu', 'مقديشو', 2.05, 45.32, 'MuslimWorldLeague', 'Africa/Mogadishu'),
  city('addis-ababa', 'Addis Ababa', 'Addis Ababa', 'أديس أبابا', 9.03, 38.74, 'MuslimWorldLeague', 'Africa/Addis_Ababa'),
  city('dar-es-salaam', 'Dar es Salaam', 'Darüsselam', 'دار السلام', -6.79, 39.28, 'MuslimWorldLeague', 'Africa/Dar_es_Salaam'),
  city('kampala', 'Kampala', 'Kampala', 'كمبالا', 0.35, 32.58, 'MuslimWorldLeague', 'Africa/Kampala'),
  city('johannesburg', 'Johannesburg', 'Johannesburg', 'جوهانسبرغ', -26.2, 28.05, 'MuslimWorldLeague', 'Africa/Johannesburg'),
  city('cape-town', 'Cape Town', 'Cape Town', 'كيب تاون', -33.92, 18.42, 'MuslimWorldLeague', 'Africa/Johannesburg'),
  city('sydney', 'Sydney', 'Sidney', 'سيدني', -33.87, 151.21, 'MuslimWorldLeague', 'Australia/Sydney'),
  city('melbourne', 'Melbourne', 'Melbourne', 'ملبورن', -37.81, 144.96, 'MuslimWorldLeague', 'Australia/Melbourne'),
  city('auckland', 'Auckland', 'Auckland', 'أوكلاند', -36.85, 174.76, 'MuslimWorldLeague', 'Pacific/Auckland'),];

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
