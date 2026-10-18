# Zaman on Google Play: submission guide

Everything to paste into Play Console, in the order Play Console asks for it. Graphics are in `graphics/` next to this file (one folder per language, plus the 512 px icon).

---

## 1. Build and upload (on WSL)

```bash
cd Zaman && git pull
npx eas-cli build --platform android --profile production
```

- First Android build only: when asked **"Generate a new Android Keystore?"** answer **Yes**. EAS stores it on expo.dev; it becomes your *upload key*.
- When the build finishes, open its page on expo.dev and **download the `.aab` file**.
- Google requires the **first upload to be done by hand** in Play Console (EAS Submit only works from the second release on), so: Play Console → your app → **Testing → Internal testing → Create new release** → upload the `.aab`.
- When Play Console offers **Play App Signing**, accept the default (Google manages the app signing key).

**Before you go to production, install it on a real Android phone.** Add yourself as an internal tester, open the opt-in link on the phone, install from the Play Store, and check:

1. Fresh install: no permission dialog on the language screen; the location dialog appears after **Continue**.
2. After allowing reminders on Android 14 or later: the **"Reminders on time"** screen appears; **Open settings** goes straight to Zaman's "Alarms & reminders" switch; turning it on and pressing Back finishes setup by itself.
3. Set reminders to 5 minutes and wait for the next prayer: the reminder arrives on the minute.
4. Qibla compass turns smoothly and vibrates when aligned.
5. Phone language set to Arabic: Zaman's Arabic screens read right to left (time on the left, prayer name on the right, as in the Arabic screenshots).
6. The bottom tab bar is not squashed by Android's navigation bar (try both gesture and 3-button navigation if you can).

> **Account type matters.** If your Play developer account is a **personal** account created after 13 November 2023, Google requires a **closed test with at least 12 testers for 14 days** before you can apply for production. **Organization** accounts (registered as ConnectedWise with a D-U-N-S number) are exempt and can go to production after internal testing.

---

## 2. Store listing (Grow → Store presence → Main store listing)

Add **English (United States)** as default, then **Turkish** and **Arabic** under *Manage translations*.

| Field | English | Turkish | Arabic |
|---|---|---|---|
| App name (30) | `Zaman: Prayer Times & Qibla` | `Zaman: Namaz Vakitleri` | `زمان: مواقيت الصلاة والقبلة` |
| Short description (80) | `Prayer times for where you are, a Qibla compass and reminders before the adhan.` | `Bulunduğunuz yerin namaz vakitleri, kıble pusulası ve ezandan önce hatırlatma.` | `مواقيت الصلاة حيث أنت، وبوصلة القبلة، وتنبيه هادئ قبل الأذان.` |

**Graphics, per language** (from `graphics/`):
- App icon: `icon-512.png` (same for all languages)
- Feature graphic: `en/feature-graphic-en.png`, `tr/feature-graphic-tr.png`, `ar/feature-graphic-ar.png`
- Phone screenshots: the five `1-…` to `5-…` files in each language folder, in that order
- Tablet screenshots: optional; leave empty

### Full description: English

```
Zaman shows today's prayer times for where you are, which prayer comes next, and how long remains, written in plain words such as "1 hour 25 minutes".

EASY TO READ
Large text, strong contrast and three labelled tabs. There is nothing to sign up for and nothing to set up: open the app and the times are there.

TIMES FROM YOUR COUNTRY'S AUTHORITY
Zaman uses the method your country publishes: Diyanet in Türkiye, ISNA in North America, Umm al-Qura in Saudi Arabia, the Egyptian General Authority, the University of Islamic Sciences in Karachi, and more. Asr follows the same authority, so the times match your local mosque. You can choose a different method at any time.

QIBLA COMPASS
Turn until the Kaaba on the dial meets the arrow. The phone vibrates gently when you are facing the Qibla.

REMINDERS BEFORE THE ADHAN
A quiet notification before each prayer, 15 minutes by default and adjustable from 5 to 30. Reminders are scheduled on your phone and arrive even without internet.

A SECOND CITY
Keep family elsewhere in mind: add a second city and see its next prayer and local time on your home screen.

WORKS OFFLINE, IN THREE LANGUAGES
More than 130 cities are built in if you prefer to choose by hand. English, Turkish and Arabic. Prayer times are calculated on your phone. No account, no ads, no tracking.

May Allah accept your prayers. 🤲
```

### Full description: Turkish

```
Zaman, bulunduğunuz yerin bugünkü namaz vakitlerini, sıradaki vakti ve ne kadar kaldığını "1 saat 25 dakika" gibi açık sözcüklerle gösterir.

KOLAY OKUNUR
Büyük yazı, belirgin renkler ve üç etiketli sekme. Üyelik yok, kurulum yok: uygulamayı açtığınızda vakitler ekrandadır.

ÜLKENİZİN RESMÎ YÖNTEMİ
Zaman, ülkenizin yayımladığı yöntemi kullanır: Türkiye'de Diyanet, Kuzey Amerika'da ISNA, Suudi Arabistan'da Ümmü'l-Kura, Mısır Genel Otoritesi, Karaçi İslami İlimler Üniversitesi ve diğerleri. İkindi vakti de aynı kurumun yayımladığı gibidir; vakitler mahallenizdeki camiyle uyuşur. Dilediğiniz zaman başka bir yöntem seçebilirsiniz.

KIBLE PUSULASI
Kadrandaki Kâbe oka gelene kadar dönün. Kıbleye döndüğünüzde telefon hafifçe titrer.

EZANDAN ÖNCE HATIRLATMA
Her namazdan önce sessiz bir bildirim: varsayılan 15 dakika, 5 ile 30 dakika arasında ayarlanabilir. Hatırlatmalar telefonunuzda planlanır ve internet olmadan da gelir.

İKİNCİ BİR ŞEHİR
Uzaktaki aileniz aklınızda olsun: ikinci bir şehir ekleyin, sıradaki vaktini ve yerel saatini ana ekranda görün.

İNTERNETSİZ, ÜÇ DİLDE
Elle seçmek isterseniz 130'dan fazla şehir uygulamada hazır. Türkçe, İngilizce ve Arapça. Namaz vakitleri telefonunuzda hesaplanır. Hesap yok, reklam yok, takip yok.

Allah namazlarınızı kabul etsin. 🤲
```

### Full description: Arabic

```
يعرض زمان مواقيت الصلاة لليوم حيث أنت، والصلاة القادمة، والوقت المتبقي لها بكلمات واضحة مثل «ساعة و25 دقيقة».

سهل القراءة
خط كبير وألوان واضحة وثلاث علامات تبويب مسمّاة. لا تسجيل ولا إعداد: افتح التطبيق تجد المواقيت أمامك.

مواقيت من الجهة الرسمية في بلدك
يعتمد زمان الطريقة التي تنشرها الجهة الرسمية في بلدك: أم القرى في السعودية، والهيئة المصرية العامة للمساحة، ورئاسة الشؤون الدينية في تركيا، والجمعية الإسلامية لأمريكا الشمالية، وجامعة العلوم الإسلامية في كراتشي، وغيرها. ووقت العصر يتبع الجهة نفسها، فتتوافق المواقيت مع مسجدك. ويمكنك اختيار طريقة أخرى متى شئت.

بوصلة القبلة
استدر حتى تلتقي الكعبة على القرص بالسهم، ويهتز الهاتف بلطف عندما تواجه القبلة.

تنبيه قبل الأذان
تنبيه هادئ قبل كل صلاة، بخمس عشرة دقيقة افتراضياً، ويمكن ضبطه من 5 إلى 30 دقيقة. تُجدول التنبيهات على هاتفك وتصل حتى دون إنترنت.

مدينة ثانية
تابع أهلك في مكان آخر: أضف مدينة ثانية لترى صلاتها القادمة ووقتها المحلي على الشاشة الرئيسية.

يعمل دون إنترنت وبثلاث لغات
أكثر من 130 مدينة جاهزة إن أردت الاختيار يدوياً. العربية والتركية والإنجليزية. تُحسب المواقيت على هاتفك. بلا حساب ولا إعلانات ولا تتبّع.

تقبّل الله صلاتكم. 🤲
```

---

## 3. Store settings (Grow → Store presence → Store settings)

- **App or game:** App
- **Category:** Lifestyle
- **Contact details:** your support email (required); website: your Netlify page
- **External marketing:** leave on

---

## 4. App content (Policy → App content)

**Privacy policy:** your Netlify page with `/#privacy`. Update its location paragraph first (see section 5).

**Ads:** No, my app does not contain ads.

**App access:** All functionality is available without special access.

**Content rating** (IARC questionnaire):
- Category: **Reference, News, or Educational**
- Violence, sexuality, language, controlled substances, gambling, horror: **No** to all
- Can users interact or exchange content? **No**
- Does the app share the user's current location with other users? **No**
- Digital purchases: **No**
- Expected result: **Everyone / PEGI 3 / USK 0**

**Target audience and content:**
- Age groups: **13–15, 16–17, 18 and over** (selecting under 13 brings in the Families programme for no benefit)
- Could the app unintentionally appeal to children? **No**

**News app:** No · **Government app:** No · **Financial features:** None · **Health:** None

**Data safety** (the honest answer for the current build; see section 5 for why):

| Question | Answer |
|---|---|
| Does your app collect or share any of the required user data types? | **Yes** |
| Is all of the user data collected by your app encrypted in transit? | **Yes** |
| Do you provide a way for users to request that their data is deleted? | **No** (nothing is stored) |
| Data types | **Location → Approximate location** and **Precise location** |
| Collected / Shared | Collected: **Yes** · Shared: **No** |
| Processed ephemerally? | **Yes** |
| Required or optional? | **Optional** (people can decline and pick a city) |
| Purpose | **App functionality** |

Everything else (personal info, contacts, app activity, device IDs, files, health, financial): **not collected**.

**Permissions you may be asked about:** the app requests location (while in use only, background location is explicitly removed), notifications, and **exact alarms** (`SCHEDULE_EXACT_ALARM`). Exact alarms need no declaration form; only `USE_EXACT_ALARM` does, and Zaman deliberately does not use it.

---

## 5. One privacy correction to make on both stores

The app's privacy wording says location "never leaves your device". That is **not strictly true**: to show the *name* of your town, the app asks the phone's built-in geocoding service (Apple on iPhone, Google on Android) to look up the coordinates. Zaman itself sends nothing anywhere and stores nothing, but the coordinates do go to Apple or Google for that one lookup.

- **Apple's App Privacy label** ("Data Not Collected") is still correct: Apple's definition excludes data processed in real time and not retained.
- **Google's Data safety** counts even momentary transmission, hence the location answer above.
- **Your privacy page** should say this. Replacement location paragraph:

> **Location.** Zaman uses your phone's location to calculate prayer times and the Qibla direction, on your phone. To display the name of your town, your phone's built-in map service (Apple on iPhone, Google on Android) is asked for the place name. That request is made by your phone's operating system; Zaman has no servers and never stores or shares your location. You can decline location access and choose a city instead.

The cleaner fix is to stop using the online lookup and name the town from Zaman's own built-in city list, which would make "never leaves your device" literally true and let both stores say "no data collected". That changes what the home screen shows for people living far from a listed city, so it is your call; it is not part of this release.

---

## 6. After this release

The iOS app can receive today's JavaScript fixes (the Diyanet Asr fix and the Arabic layout fix) over the air, with no App Store review:

```bash
npx eas-cli update --channel production --message "Asr by authority; Arabic layout direction"
```

Keep the version at **1.0.0**, or installed builds will ignore the update.
