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
  qibla_instruction: 'Hold your phone flat and turn slowly',
  qibla_facing: 'You are facing the Qibla',
  qibla_turnRight: 'Turn right',
  qibla_turnLeft: 'Turn left',
  qibla_fromNorth: '{degrees}° from north',
  qibla_distance: '{distance} km to Makkah',
  qibla_calibrate: 'Move your phone in a figure of eight to calibrate the compass',
  qibla_noCompass: 'This phone has no compass sensor.',
  qibla_noCompassBody:
    'The Qibla is {degrees}° from north. Use a separate compass to find that direction.',
  qibla_needLocation: 'Turn on location to find the Qibla.',

  settings_title: 'Settings',
  settings_language: 'Language',
  settings_notifications: 'Reminders',
  settings_notificationsOn: 'Remind me before the adhan',
  settings_reminderTime: 'Remind me',
  settings_minutesBefore: '{minutes} minutes before',
  settings_notificationsBlocked: 'Notifications are switched off for Zaman in your phone settings.',
  settings_calculation: 'Calculation method',
  settings_calculationAuto: 'Automatic ({method})',
  settings_madhab: 'Asr time',
  settings_madhab_shafi: 'Earlier (Shafi‘i, Maliki, Hanbali)',
  settings_madhab_hanafi: 'Later (Hanafi)',
  settings_timeFormat: 'Clock',
  settings_timeFormat_12: '12-hour',
  settings_timeFormat_24: '24-hour',
  settings_location: 'Location',
  settings_refreshLocation: 'Update my location',
  settings_about: 'About Zaman',
  settings_aboutBody:
    'Zaman is free, has no accounts and no adverts, and works without an internet connection. Prayer times and the Qibla are calculated on your phone. Your location is never sent anywhere.',
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
  method_Dubai: 'Dubai',
  method_Kuwait: 'Kuwait',
  method_Qatar: 'Qatar',
  method_Singapore: 'Singapore',
  method_Tehran: 'Tehran',
  method_MoonsightingCommittee: 'Moonsighting Committee',
} as const;

export type TranslationKey = keyof typeof en;
export type Translations = Record<TranslationKey, string>;

const tr: Translations = {
  appName: 'Zaman',

  tabs_times: 'Namaz Vakitleri',
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
  qibla_instruction: 'Telefonu düz tutun ve yavaşça dönün',
  qibla_facing: 'Kıbleye dönüksünüz',
  qibla_turnRight: 'Sağa dönün',
  qibla_turnLeft: 'Sola dönün',
  qibla_fromNorth: 'Kuzeyden {degrees}°',
  qibla_distance: "Mekke'ye {distance} km",
  qibla_calibrate: 'Pusulayı ayarlamak için telefonu sekiz çizerek hareket ettirin',
  qibla_noCompass: 'Bu telefonda pusula sensörü yok.',
  qibla_noCompassBody:
    'Kıble, kuzeyden {degrees}° yönündedir. Bu yönü bulmak için ayrı bir pusula kullanın.',
  qibla_needLocation: 'Kıbleyi bulmak için konumu açın.',

  settings_title: 'Ayarlar',
  settings_language: 'Dil',
  settings_notifications: 'Hatırlatmalar',
  settings_notificationsOn: 'Ezandan önce hatırlat',
  settings_reminderTime: 'Hatırlatma',
  settings_minutesBefore: '{minutes} dakika önce',
  settings_notificationsBlocked: 'Zaman için bildirimler telefon ayarlarınızda kapalı.',
  settings_calculation: 'Hesaplama yöntemi',
  settings_calculationAuto: 'Otomatik ({method})',
  settings_madhab: 'İkindi vakti',
  settings_madhab_shafi: 'Erken (Şafii, Maliki, Hanbeli)',
  settings_madhab_hanafi: 'Geç (Hanefi)',
  settings_timeFormat: 'Saat',
  settings_timeFormat_12: '12 saat',
  settings_timeFormat_24: '24 saat',
  settings_location: 'Konum',
  settings_refreshLocation: 'Konumumu güncelle',
  settings_about: 'Zaman hakkında',
  settings_aboutBody:
    'Zaman ücretsizdir, hesap açmanız gerekmez, reklam içermez ve internet olmadan çalışır. Namaz vakitleri ve kıble telefonunuzda hesaplanır. Konumunuz hiçbir yere gönderilmez.',
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
  method_Dubai: 'Dubai',
  method_Kuwait: 'Kuveyt',
  method_Qatar: 'Katar',
  method_Singapore: 'Singapur',
  method_Tehran: 'Tahran',
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
  qibla_instruction: 'أمسك هاتفك مستوياً واستدر ببطء',
  qibla_facing: 'أنت تواجه القبلة',
  qibla_turnRight: 'استدر يميناً',
  qibla_turnLeft: 'استدر يساراً',
  qibla_fromNorth: '{degrees}° من الشمال',
  qibla_distance: '{distance} كم إلى مكة',
  qibla_calibrate: 'حرّك هاتفك على شكل رقم ثمانية لمعايرة البوصلة',
  qibla_noCompass: 'لا يوجد مستشعر بوصلة في هذا الهاتف.',
  qibla_noCompassBody: 'القبلة على {degrees}° من الشمال. استخدم بوصلة منفصلة لتحديد هذا الاتجاه.',
  qibla_needLocation: 'شغّل الموقع لتحديد القبلة.',

  settings_title: 'الإعدادات',
  settings_language: 'اللغة',
  settings_notifications: 'التنبيهات',
  settings_notificationsOn: 'نبّهني قبل الأذان',
  settings_reminderTime: 'التنبيه',
  settings_minutesBefore: 'قبل {minutes} دقيقة',
  settings_notificationsBlocked: 'التنبيهات مغلقة لتطبيق زمان في إعدادات هاتفك.',
  settings_calculation: 'طريقة الحساب',
  settings_calculationAuto: 'تلقائي ({method})',
  settings_madhab: 'وقت العصر',
  settings_madhab_shafi: 'مبكر (الشافعي، المالكي، الحنبلي)',
  settings_madhab_hanafi: 'متأخر (الحنفي)',
  settings_timeFormat: 'الساعة',
  settings_timeFormat_12: '12 ساعة',
  settings_timeFormat_24: '24 ساعة',
  settings_location: 'الموقع',
  settings_refreshLocation: 'تحديث موقعي',
  settings_about: 'عن زمان',
  settings_aboutBody:
    'زمان تطبيق مجاني، بلا حسابات وبلا إعلانات، ويعمل دون اتصال بالإنترنت. تُحسب أوقات الصلاة والقبلة على هاتفك، ولا يُرسل موقعك إلى أي جهة.',
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
  method_Dubai: 'دبي',
  method_Kuwait: 'الكويت',
  method_Qatar: 'قطر',
  method_Singapore: 'سنغافورة',
  method_Tehran: 'طهران',
  method_MoonsightingCommittee: 'لجنة رؤية الهلال',
};

export const dictionaries: Record<Language, Translations> = { en, tr, ar };
