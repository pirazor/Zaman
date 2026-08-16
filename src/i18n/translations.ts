/**
 * All user-facing copy lives here. English is the source of truth: the
 * `Translations` type is derived from it, so Turkish and Arabic will fail
 * typechecking if they drift out of sync.
 */

export const LANGUAGES = ['en', 'tr', 'ar'] as const;
export type Language = (typeof LANGUAGES)[number];

/** Languages whose script runs right-to-left. */
export const RTL_LANGUAGES: readonly Language[] = ['ar'];

/** Endonyms, shown on the language picker so each is readable to its own speaker. */
export const LANGUAGE_NAMES: Record<Language, string> = {
  en: 'English',
  tr: 'Türkçe',
  ar: 'العربية',
};

const en = {
  appName: 'Zaman',

  tabs_times: 'Prayer Times',
  tabs_qibla: 'Qibla',
  tabs_settings: 'Settings',

  prayer_fajr: 'Fajr',
  prayer_sunrise: 'Sunrise',
  prayer_dhuhr: 'Dhuhr',
  prayer_asr: 'Asr',
  prayer_maghrib: 'Maghrib',
  prayer_isha: 'Isha',

  home_next: 'Next prayer',
  home_timeLeft: 'Time remaining',
  home_now: 'Now',

  // Unit names for the countdown, by plural category. English inflects on
  // one/other; `few` is unused here and mirrors the plural.
  duration_hour_one: 'hour',
  duration_hour_few: 'hours',
  duration_hour_many: 'hours',
  duration_minute_one: 'minute',
  duration_minute_few: 'minutes',
  duration_minute_many: 'minutes',
  duration_second_one: 'second',
  duration_second_few: 'seconds',
  duration_second_many: 'seconds',
  /** Joins the two parts of a spoken duration. */
  duration_separator: ' ',

  home_tomorrow: 'Tomorrow',
  home_locating: 'Finding your location…',
  home_calculating: 'Calculating prayer times…',
  home_locationOff: 'Location is off',
  home_locationOffBody:
    'Zaman needs your location to work out prayer times and the Qibla direction for where you are.',
  home_turnOnLocation: 'Turn on location',
  home_openSettings: 'Open phone settings',
  home_tryAgain: 'Try again',
  home_unknownPlace: 'Your location',
  home_updated: 'Updated {time}',

  qibla_title: 'Qibla direction',
  qibla_instruction: 'Turn slowly until the green arrow points to the Qibla.',
  qibla_facing: 'You are facing the Qibla',
  qibla_turnRight: 'Turn right',
  qibla_turnLeft: 'Turn left',
  qibla_where: 'Makkah is to the {dir} · {km} km away',

  // Eight-wind compass names, indexed clockwise from north.
  dir_north: 'north',
  dir_northeast: 'northeast',
  dir_east: 'east',
  dir_southeast: 'southeast',
  dir_south: 'south',
  dir_southwest: 'southwest',
  dir_west: 'west',
  dir_northwest: 'northwest',
  qibla_calibrate: 'Move your phone in a figure of eight to calibrate the compass',
  qibla_noCompass: 'This phone has no compass sensor.',
  qibla_noCompassBody:
    'The Qibla is {degrees}° from north. Use a separate compass to find that direction.',
  qibla_needLocation: 'Turn on location to find the Qibla.',

  settings_title: 'Settings',
  settings_language: 'Language',
  settings_notifications: 'Reminder',
  settings_notificationsOn: 'Remind me',
  settings_minutesBefore: '{minutes} minutes before',
  settings_notificationsBlocked: 'Notifications are switched off for Zaman in your phone settings.',
  settings_calculation: 'Calculation method',
  settings_calculationAuto: 'Automatic ({method})',
  settings_calculationAutoDesc: 'Changes when you travel',
  settings_madhab: 'Asr time',
  settings_madhab_shafi: 'Earlier (Shafi‘i, Maliki, Hanbali)',
  settings_madhab_hanafi: 'Later (Hanafi)',
  settings_timeFormat: 'Clock',
  settings_timeFormat_12: '12-hour',
  settings_timeFormat_24: '24-hour',
  settings_location: 'Location',
  settings_cityAuto: 'Automatic (your location)',
  settings_searchCity: 'Search for a city…',
  settings_refreshLocation: 'Update my location',
  settings_secondCity: 'Show a second city',

  // Compact duration units for the second-city chip, where the full words
  // would not fit: "6 h 3 m".
  duration_hour_short: 'h',
  duration_minute_short: 'm',
  duration_second_short: 's',
  settings_about: 'About Zaman',
  settings_aboutBody:
    'Zaman is free, with no accounts and no ads. Everything is calculated on your phone and works offline. Your location never leaves your device.',
  settings_version: 'Version {version}',
  settings_done: 'Done',

  onboarding_welcome: 'Welcome',
  onboarding_chooseLanguage: 'Choose your language',
  onboarding_continue: 'Continue',
  onboarding_locationTitle: 'Allow your location',
  onboarding_locationBody:
    'Prayer times and the Qibla depend on where you are. Zaman works this out on your phone and never sends it anywhere.',
  onboarding_locationAllow: 'Allow location',
  onboarding_notificationTitle: 'Reminders before the adhan',
  onboarding_notificationBody:
    'Zaman can send you a quiet reminder 15 minutes before each prayer, so you are never caught out.',
  onboarding_notificationAllow: 'Turn on reminders',
  onboarding_skip: 'Not now',

  notification_title: '{prayer} in {minutes} minutes',
  notification_body: '{prayer} begins at {time}.',

  common_cancel: 'Cancel',
  common_ok: 'OK',
  common_on: 'On',
  common_off: 'Off',

  method_MuslimWorldLeague: 'Muslim World League',
  method_Turkey: 'Diyanet, Türkiye',
  method_Egyptian: 'Egyptian General Authority',
  method_UmmAlQura: 'Umm al-Qura, Makkah',
  method_Karachi: 'Islamic Sciences, Karachi',
  method_NorthAmerica: 'ISNA, North America',
  method_Dubai: 'Dubai (UAE) Ministry',
  method_Kuwait: 'Kuwait Ministry of Awqaf',
  method_Qatar: 'Qatar Ministry of Awqaf',
  method_Singapore: 'Singapore (MUIS)',
  method_Tehran: 'Tehran Institute of Geophysics',
  method_MoonsightingCommittee: 'Moonsighting Committee',
} as const;

export type TranslationKey = keyof typeof en;
export type Translations = Record<TranslationKey, string>;

const tr: Translations = {
  appName: 'Zaman',

  tabs_times: 'Vakitler',
  tabs_qibla: 'Kıble',
  tabs_settings: 'Ayarlar',

  prayer_fajr: 'İmsak',
  prayer_sunrise: 'Güneş',
  prayer_dhuhr: 'Öğle',
  prayer_asr: 'İkindi',
  prayer_maghrib: 'Akşam',
  prayer_isha: 'Yatsı',

  home_next: 'Sıradaki vakit',
  home_timeLeft: 'Kalan süre',
  home_now: 'Şu an',

  // Turkish nouns do not take a plural suffix after a numeral: "3 saat",
  // never "3 saatler". Every category is therefore the same word.
  duration_hour_one: 'saat',
  duration_hour_few: 'saat',
  duration_hour_many: 'saat',
  duration_minute_one: 'dakika',
  duration_minute_few: 'dakika',
  duration_minute_many: 'dakika',
  duration_second_one: 'saniye',
  duration_second_few: 'saniye',
  duration_second_many: 'saniye',
  duration_separator: ' ',

  home_tomorrow: 'Yarın',
  home_locating: 'Konumunuz bulunuyor…',
  home_calculating: 'Vakitler hesaplanıyor…',
  home_locationOff: 'Konum kapalı',
  home_locationOffBody:
    'Zaman, bulunduğunuz yerin namaz vakitlerini ve kıble yönünü hesaplamak için konumunuza ihtiyaç duyar.',
  home_turnOnLocation: 'Konumu aç',
  home_openSettings: 'Telefon ayarlarını aç',
  home_tryAgain: 'Tekrar dene',
  home_unknownPlace: 'Konumunuz',
  home_updated: '{time} güncellendi',

  qibla_title: 'Kıble yönü',
  qibla_instruction: 'Yeşil ok kıbleyi gösterene kadar yavaşça dönün.',
  qibla_facing: 'Kıbleye dönüksünüz',
  qibla_turnRight: 'Sağa dönün',
  qibla_turnLeft: 'Sola dönün',
  qibla_where: 'Mekke {dir} yönünde · {km} km uzakta',

  dir_north: 'kuzey',
  dir_northeast: 'kuzeydoğu',
  dir_east: 'doğu',
  dir_southeast: 'güneydoğu',
  dir_south: 'güney',
  dir_southwest: 'güneybatı',
  dir_west: 'batı',
  dir_northwest: 'kuzeybatı',
  qibla_calibrate: 'Pusulayı ayarlamak için telefonu sekiz çizerek hareket ettirin',
  qibla_noCompass: 'Bu telefonda pusula sensörü yok.',
  qibla_noCompassBody:
    'Kıble, kuzeyden {degrees}° yönündedir. Bu yönü bulmak için ayrı bir pusula kullanın.',
  qibla_needLocation: 'Kıbleyi bulmak için konumu açın.',

  settings_title: 'Ayarlar',
  settings_language: 'Dil',
  settings_notifications: 'Hatırlatma',
  settings_notificationsOn: 'Bana hatırlat',
  settings_minutesBefore: '{minutes} dakika önce',
  settings_notificationsBlocked: 'Zaman için bildirimler telefon ayarlarınızda kapalı.',
  settings_calculation: 'Hesaplama yöntemi',
  settings_calculationAuto: 'Otomatik ({method})',
  settings_calculationAutoDesc: 'Seyahat ederken değişir',
  settings_madhab: 'İkindi vakti',
  settings_madhab_shafi: 'Erken (Şafii, Maliki, Hanbeli)',
  settings_madhab_hanafi: 'Geç (Hanefi)',
  settings_timeFormat: 'Saat',
  settings_timeFormat_12: '12 saat',
  settings_timeFormat_24: '24 saat',
  settings_location: 'Konum',
  settings_cityAuto: 'Otomatik (konumunuz)',
  settings_searchCity: 'Şehir arayın…',
  settings_refreshLocation: 'Konumumu güncelle',
  settings_secondCity: 'İkinci şehir göster',

  duration_hour_short: 'sa',
  duration_minute_short: 'dk',
  duration_second_short: 'sn',
  settings_about: 'Zaman hakkında',
  settings_aboutBody:
    'Zaman ücretsizdir. Hesap yok, reklam yok. Her şey telefonunuzda hesaplanır ve internetsiz çalışır. Konumunuz cihazınızdan asla çıkmaz.',
  settings_version: 'Sürüm {version}',
  settings_done: 'Tamam',

  onboarding_welcome: 'Hoş geldiniz',
  onboarding_chooseLanguage: 'Dilinizi seçin',
  onboarding_continue: 'Devam',
  onboarding_locationTitle: 'Konumunuza izin verin',
  onboarding_locationBody:
    'Namaz vakitleri ve kıble bulunduğunuz yere bağlıdır. Zaman bunu telefonunuzda hesaplar ve hiçbir yere göndermez.',
  onboarding_locationAllow: 'Konuma izin ver',
  onboarding_notificationTitle: 'Ezandan önce hatırlatma',
  onboarding_notificationBody:
    'Zaman, her namazdan 15 dakika önce size sessiz bir hatırlatma gönderebilir.',
  onboarding_notificationAllow: 'Hatırlatmaları aç',
  onboarding_skip: 'Şimdi değil',

  notification_title: '{prayer} vaktine {minutes} dakika',
  notification_body: '{prayer} vakti {time} itibarıyla giriyor.',

  common_cancel: 'Vazgeç',
  common_ok: 'Tamam',
  common_on: 'Açık',
  common_off: 'Kapalı',

  method_MuslimWorldLeague: 'Dünya İslam Birliği',
  method_Turkey: 'Diyanet İşleri Başkanlığı',
  method_Egyptian: 'Mısır Genel Kurumu',
  method_UmmAlQura: "Ümmü'l-Kura, Mekke",
  method_Karachi: 'İslam Bilimleri, Karaçi',
  method_NorthAmerica: 'ISNA, Kuzey Amerika',
  method_Dubai: 'Dubai (BAE) Bakanlığı',
  method_Kuwait: 'Kuveyt Evkaf Bakanlığı',
  method_Qatar: 'Katar Evkaf Bakanlığı',
  method_Singapore: 'Singapur (MUIS)',
  method_Tehran: 'Tahran Jeofizik Enstitüsü',
  method_MoonsightingCommittee: 'Moonsighting Committee',
};

const ar: Translations = {
  appName: 'زمان',

  tabs_times: 'أوقات الصلاة',
  tabs_qibla: 'القبلة',
  tabs_settings: 'الإعدادات',

  prayer_fajr: 'الفجر',
  prayer_sunrise: 'الشروق',
  prayer_dhuhr: 'الظهر',
  prayer_asr: 'العصر',
  prayer_maghrib: 'المغرب',
  prayer_isha: 'العشاء',

  home_next: 'الصلاة القادمة',
  home_timeLeft: 'الوقت المتبقي',
  home_now: 'الآن',

  // Arabic counts 3–10 with the plural (٥ ساعات) and everything else with the
  // singular (١ ساعة، ٤٥ دقيقة). The dual is deliberately not used: after an
  // explicit numeral, interface text takes the singular — "٢ ساعة", the same
  // convention iOS and Android use in Arabic.
  duration_hour_one: 'ساعة',
  duration_hour_few: 'ساعات',
  duration_hour_many: 'ساعة',
  duration_minute_one: 'دقيقة',
  duration_minute_few: 'دقائق',
  duration_minute_many: 'دقيقة',
  duration_second_one: 'ثانية',
  duration_second_few: 'ثوانٍ',
  duration_second_many: 'ثانية',
  // Arabic joins with wāw, written attached to the word that follows it.
  duration_separator: ' و',

  home_tomorrow: 'غداً',
  home_locating: 'جارٍ تحديد موقعك…',
  home_calculating: 'جارٍ حساب أوقات الصلاة…',
  home_locationOff: 'الموقع مغلق',
  home_locationOffBody: 'يحتاج تطبيق زمان إلى موقعك لحساب أوقات الصلاة واتجاه القبلة في مكانك.',
  home_turnOnLocation: 'تشغيل الموقع',
  home_openSettings: 'فتح إعدادات الهاتف',
  home_tryAgain: 'إعادة المحاولة',
  home_unknownPlace: 'موقعك',
  home_updated: 'حُدّث {time}',

  qibla_title: 'اتجاه القبلة',
  qibla_instruction: 'استدر ببطء حتى يشير السهم الأخضر إلى القبلة.',
  qibla_facing: 'أنت تواجه القبلة',
  qibla_turnRight: 'استدر يميناً',
  qibla_turnLeft: 'استدر يساراً',
  qibla_where: 'مكة في اتجاه {dir} · على بعد {km} كم',

  dir_north: 'الشمال',
  dir_northeast: 'الشمال الشرقي',
  dir_east: 'الشرق',
  dir_southeast: 'الجنوب الشرقي',
  dir_south: 'الجنوب',
  dir_southwest: 'الجنوب الغربي',
  dir_west: 'الغرب',
  dir_northwest: 'الشمال الغربي',
  qibla_calibrate: 'حرّك هاتفك على شكل رقم ثمانية لمعايرة البوصلة',
  qibla_noCompass: 'لا يوجد مستشعر بوصلة في هذا الهاتف.',
  qibla_noCompassBody: 'القبلة على {degrees}° من الشمال. استخدم بوصلة منفصلة لتحديد هذا الاتجاه.',
  qibla_needLocation: 'شغّل الموقع لتحديد القبلة.',

  settings_title: 'الإعدادات',
  settings_language: 'اللغة',
  settings_notifications: 'التنبيه',
  settings_notificationsOn: 'ذكّرني',
  settings_minutesBefore: 'قبل {minutes} دقيقة',
  settings_notificationsBlocked: 'التنبيهات مغلقة لتطبيق زمان في إعدادات هاتفك.',
  settings_calculation: 'طريقة الحساب',
  settings_calculationAuto: 'تلقائي ({method})',
  settings_calculationAutoDesc: 'يتغير عند السفر',
  settings_madhab: 'وقت العصر',
  settings_madhab_shafi: 'مبكر (الشافعي، المالكي، الحنبلي)',
  settings_madhab_hanafi: 'متأخر (الحنفي)',
  settings_timeFormat: 'الساعة',
  settings_timeFormat_12: '12 ساعة',
  settings_timeFormat_24: '24 ساعة',
  settings_location: 'الموقع',
  settings_cityAuto: 'تلقائي (موقعك)',
  settings_searchCity: 'ابحث عن مدينة…',
  settings_refreshLocation: 'تحديث موقعي',
  settings_secondCity: 'إظهار مدينة ثانية',

  duration_hour_short: 'س',
  duration_minute_short: 'د',
  duration_second_short: 'ث',
  settings_about: 'عن زمان',
  settings_aboutBody:
    'زمان مجاني، بلا حسابات وبلا إعلانات. يُحسب كل شيء على هاتفك ويعمل دون إنترنت. موقعك لا يغادر جهازك أبداً.',
  settings_version: 'الإصدار {version}',
  settings_done: 'تم',

  onboarding_welcome: 'أهلاً بك',
  onboarding_chooseLanguage: 'اختر لغتك',
  onboarding_continue: 'متابعة',
  onboarding_locationTitle: 'اسمح بالوصول إلى موقعك',
  onboarding_locationBody:
    'تعتمد أوقات الصلاة والقبلة على مكانك. يحسب زمان ذلك على هاتفك ولا يرسله إلى أي جهة.',
  onboarding_locationAllow: 'السماح بالموقع',
  onboarding_notificationTitle: 'تنبيه قبل الأذان',
  onboarding_notificationBody: 'يمكن لزمان تنبيهك بهدوء قبل كل صلاة بخمس عشرة دقيقة.',
  onboarding_notificationAllow: 'تشغيل التنبيهات',
  onboarding_skip: 'ليس الآن',

  notification_title: '{prayer} بعد {minutes} دقيقة',
  notification_body: 'يدخل وقت {prayer} في {time}.',

  common_cancel: 'إلغاء',
  common_ok: 'حسناً',
  common_on: 'مُفعّل',
  common_off: 'مُعطّل',

  method_MuslimWorldLeague: 'رابطة العالم الإسلامي',
  method_Turkey: 'رئاسة الشؤون الدينية، تركيا',
  method_Egyptian: 'الهيئة المصرية العامة للمساحة',
  method_UmmAlQura: 'أم القرى، مكة المكرمة',
  method_Karachi: 'العلوم الإسلامية، كراتشي',
  method_NorthAmerica: 'الجمعية الإسلامية لأمريكا الشمالية',
  method_Dubai: 'دائرة الشؤون الإسلامية، دبي',
  method_Kuwait: 'وزارة الأوقاف، الكويت',
  method_Qatar: 'وزارة الأوقاف، قطر',
  method_Singapore: 'المجلس الإسلامي، سنغافورة',
  method_Tehran: 'معهد الجيوفيزياء، طهران',
  method_MoonsightingCommittee: 'لجنة رؤية الهلال',
};

export const dictionaries: Record<Language, Translations> = { en, tr, ar };
