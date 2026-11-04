# پلتفرم Android

برای اپ‌های نیتیو اندروید: Jetpack Compose، Android Views، React Native، Expo، Flutter که به سخت‌افزار اندرویدی عرضه می‌شوند.

روی نیتیو، حالتِ بازدیدکننده تعیین می‌کند ابراز اجازهٔ دورزدنِ چه چیزی را دارد. Material Design 3 بر ساختار، ناوبری و تعامل در هر حالتی حکومت می‌کند؛ برند از طریق تم‌بندی Material ابراز می‌شود (نقش‌های رنگ، مقیاس تایپ، شکل، حرکت). اپ کراس-پلتفرمیِ همه‌جا-Material که به آیفون هم عرضه می‌شود، روی آن سخت‌افزار همچنان تضمین‌های iOS را بدهکار است: insetهای safe-area، Reduce Motion، برگشتِ کشیدن-از-لبه.

## تست اسلاپ Android

آیا کاربرِ روانِ اندروید به این اپ اعتماد می‌کند، یا در کامپوننت‌های خارج‌از-مشخصه سکندری می‌خورد؟ رایج‌ترین نشانه، اپ iOS با پوست اندرویدی است: ناوبریِ فقط-پایینی که از آیفون کپی شده، فلش برگشتی که ژست Back سیستم را نادیده می‌گیرد، سوییچ و دیالوگ‌های شکل-Cupertino. Material 3 کتاب قوانین است؛ کامپوننت‌هایش را دنبال کن و برند را از مسیرش تم بده.

## چیدمان و ساختار

- **ناوبری Material، هم‌اندازه با صفحه.** navigation bar (پایین، ۳–۵ مقصد) در عرض فشرده؛ navigation rail یا drawer در عرض باز. هرگز bottom-bar موبایلیِ دست‌نخورده روی تبلت عرضه نکن. <!-- rule:android-layout-adaptive-nav -->
- **Back سیستم همیشه کار می‌کند.** ژست Predictive Back و دکمهٔ Back را محترم بشمار؛ هرگز کاربر را به دام نینداز یا ژست را ربای. <!-- rule:android-layout-system-back -->
- **Edge-to-edge با window insetها.** insetهای نوار وضعیت، نوار ناوبری، display cutout و IME را اعمال کن تا محتوا هرگز پشت نوارهای سیستم یا کیبورد پنهان نشود. <!-- rule:android-layout-window-insets -->
- **Top app bar برای بافت صفحه**؛ وقتی صفحه یک کنش اصلیِ تکی دارد با FAB جفتش کن. <!-- rule:android-layout-top-app-bar -->

## اهداف لمسی

- **حداقل ۴۸×۴۸ dp** برای هر هدف لمسی، با دست‌کم ۸ dp فاصله بین آن‌ها. <!-- rule:android-touch-target-48dp -->

## تایپوگرافی

- **مقیاس تایپ Material.** نقش‌های Display، Headline، Title، Body، Label (هر کدام large/medium/small). متن را به نقش‌ها نگاشت کن؛ هرگز سایزها را صفحه‌به‌صفحه دستی انتخاب نکن. <!-- rule:android-typo-type-scale -->
- **Roboto قلم سیستمی است**؛ قلم برند را از مسیر مقیاس تایپ تم بده، با حفظ خوانایی و یکدستیِ بدنه، لیبل‌ها و کنترل‌ها. <!-- rule:android-typo-system-font -->
- **واحد sp، هرگز px ثابت نه**، تا تایپ تنظیم سایز فونت سیستم را دنبال کند. <!-- rule:android-typo-scalable-sp -->

## رنگ و تم‌بندی

- **نقش‌های رنگی Material** (primary، on-primary، surface، surface-variant، secondary-container، outline، error). توکن‌های نقش، واریانت‌های روشن/تیره و کنتراست را خودکار حل می‌کنند؛ hex خام آنجا می‌شکند. <!-- rule:android-color-role-tokens -->
- **Dynamic Color (Material You)** جایی که می‌خواند: طرح را از والپیپر کاربر روی Android 12+ مشتق کن، با fallback ایستا. <!-- rule:android-color-dynamic-color -->
- **تم تیره طرحی درجه‌یک است.** طراحی و تستش کن؛ هرگز معکوس‌سازیِ سریع نه. <!-- rule:android-color-dark-theme -->
- **ارتفاع تونال.** ارتفاع را از طریق پله‌های تونالِ استاندارد سطح منتقل کن (به‌علاوه سایه جایی که مناسب است)؛ سایهٔ dropِ دلخواه نه. <!-- rule:android-color-tonal-elevation -->

## کامپوننت‌ها و حرکت

- **کامپوننت‌های Material.** دکمه‌ها (filled / tonal / outlined / text)، FAB، سوییچ‌ها، chips، snackbarها، bottom sheetها، دیالوگ‌های Material، navigation bar/rail/drawer. هرگز کنترل‌های iOS را پورت نکن یا معادل ازخودساخته نساز. <!-- rule:android-components-material -->
- **یک FAB، یک کنش اصلی.** هرگز FABها را روی هم نچین یا یکی را خرج کار ثانویه نکن. <!-- rule:android-components-single-fab -->
- **Snackbar برای بازخورد گذرا** (وقتی مفید است کنش‌پذیر، هرگز به‌جای آن توست نه)؛ دیالوگ فقط برای تصمیم‌هایی که باید قطع کنند. <!-- rule:android-components-snackbar -->
- **الگوهای حرکت Material.** Container transform، shared-axis، fade-through، با ایزینگ و مدت استاندارد؛ تنظیم سیستم Remove animations را با crossfade یا برشِ فوری محترم بشمار. <!-- rule:android-motion-material-and-reduce -->

## راستی‌آزمایی بیلد

- **اسکرین‌شات‌ها از شبیه‌ساز یا دستگاه متصل می‌آیند، هرگز مرورگر نه.** بیلد و نصب کن، بعد با `adb exec-out screencap -p > <path>` بگیر (با چند دستگاه متصل، با `adb -s <serial>` انتخاب کن). هر کلاس دستگاهی که اپ عرضه می‌شود را بگیر، دست‌کم یک موبایل و اگر تبلت‌ها هدف‌اند یک تبلت، و فایل‌ها را جایی بنویس که جریان بازبینی انتظارشان را دارد. <!-- rule:android-verify-emulator-capture -->
- **تم تیره و مقیاس فونت جزو پاس‌اند.** `adb shell cmd uimode night yes` تم را عوض می‌کند؛ `adb shell settings put system font_scale 1.3` (اول هر دو تنظیم را با `adb shell cmd uimode night` و `adb shell settings get system font_scale` بخوان و بعد برگردان) لیبل‌های بریده‌شده را می‌گیرد که چیدمان ثابت پنهانشان می‌کند؛ با چند هدف متصل، `-s <serial>` کپچر روی این فرمان‌ها هم می‌رود. <!-- rule:android-verify-theme-and-scale -->
- **شبیه‌سازها پوشش می‌دهند؛ ژست‌ها، نرخ‌های نوسازی و کارایی سخت‌افزار می‌خواهند.** بگو کدام شاهد را تولید کرده. <!-- rule:android-verify-hardware-honesty -->
