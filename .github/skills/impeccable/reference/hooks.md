# /jala hooks

**هوک دیتکتور طراحی** را برای پروژهٔ جاری مدیریت کن.

هوک، دیتکتور طراحی جلا را روی ویرایش مستقیم فایل‌های مرتبط با طراحی اجرا می‌کند (`.tsx`، `.jsx`، `.html`، `.vue`، `.svelte`، `.astro`، `.css`، `.scss`، `.sass`، `.less`، `.ts`، `.js`). Claude Code، Codex، Cursor و GitHub Copilot از هوک پس‌ازابزار (post-tool-use) استفاده می‌کنند و پس از ویرایش، یک یادآور سیستمیِ کوتاه را به بافت ایجنت می‌رانند؛ یافته‌ها پرامپت اصلاح می‌گیرند، مسائل معلق یادآوریِ دوباره می‌گیرند و فایل‌های شبه‌UIِ پاک یک تأیید کوتاه، مگر آنکه حالت بی‌صدا روشن باشد (`hook.quiet` در config). فایل‌های لختِ `.ts` و `.js` هم اسکن می‌شوند، اما بی‌صدا می‌مانند مگر آنکه دیتکتور چیزی بیابد. Grok Build همان اسکن PostToolUse را برای علامت‌گذاری فایل‌های دست‌خورده شلیک می‌کند و سپس یافته‌ها را روی Stop به شکل `additionalContext` نشان می‌دهد. انتظارِ یک یادآورِ هر ویرایش از Grok نداشته باش: Grok آن stdout را دور می‌ریزد. روی Hermes Agent، یافته‌های هر ویرایش داخل خودِ نتیجهٔ ابزار `write_file` یا `patch` می‌رسند، در فیلد `impeccable` آن.

قواعد دیتکتور در دو طبقه اجرا می‌شوند. هوکِ هر ویرایش فقط طبقهٔ فوری را نشان می‌دهد: مشکلات مکانیکی و بی‌ابهامی که وقفه‌انداختن در یک ویرایش می‌ارزد، مثل تصاویر شکسته، محتوای سرریزشده، شکست‌های کنتراست و خوانایی، متن گرادیانی، سایه‌های درخشان، و فاصله‌گرفتن از سیستم طراحی (design-system drift). هر چیز دیگری (آهنگ متن، سلیقهٔ پالت و تایپوگرافی، ریتم چیدمان) به یک گذر عمیق روی رویداد هوک `Stop` سپرده می‌شود که مجموعهٔ کامل قواعد را روی هر فایل UI دست‌خورده در نشست اجرا می‌کند و یافته‌های باقی‌مانده را یک بار، بدون تکرارِ آنچه گذرِ هر ویرایش گزارش کرده بود، نشان می‌دهد. نشستی که چیزی برای گزارش نداشته باشد بی‌صدا تمام می‌شود. برای بازگرداندن مجموعهٔ کامل قواعد به هر ویرایش، `hook.perEditRules` را در `.impeccable/config.json` روی `"all"` بگذار. گذر عمیق Stop برای Claude Code، Codex و Grok Build سیم‌کشی شده که رویداد هوک بومیِ `Stop` را ارسال می‌کنند، و برای Hermes Agent که پلاگینش آن را از `pre_verify` می‌فرستد. Cursor چیزی از این دست نمی‌گیرد (هوک `stop` آن فقط می‌تواند با یک پیام کاربریِ پیگیری پاسخ دهد) و رویدادهای stop-گونهٔ GitHub Copilot چیزی به مدل پس نمی‌دهند، پس آن‌ها دیتکتور کامل را روی هر ویرایش نگه می‌دارند. Grok بعد از `end_turn` یک Stopِ فقط‌مشاهداتی با `reason: "shutdown"` هم شلیک می‌کند؛ آن یکی را رد کن و فقط `end_turn` را اسکن کن.

هر هوک یک گذر مکانیکی است. بازتاب‌هایی که هیچ اسکنری نمی‌گیرد در [craft-floor.md](craft-floor.md) زندگی می‌کنند، که اسکیل پیش از ویرایش UI آن را بار می‌کند؛ پس این بازتاب‌ها با یا بدون اتصال هوک اعمال می‌شوند. نشستی که هوک خودکار نداشته باشد یک دستورالعملِ `MANUAL_DETECTOR_REQUIRED` از `impeccable context` می‌گیرد که یک اجرای واحد دیتکتور را در پایان می‌خواهد.

این فرمان هوک را **به‌ازای هر پروژه** با ویرایش `.impeccable/config.json` خاموش و روشن می‌کند (config یکپارچهٔ جلا؛ تنظیمات زمان‌اجرای هوک زیر کلید `hook` آن زندگی می‌کند و ignoreهای مشترک دیتکتور زیر `detector`). overrideهای هر توسعه‌دهنده، از جمله تصمیمِ رضایتِ نصب (`hook.consent`) که CLI ثبت می‌کند، در `.impeccable/config.local.json`ِ gitignore‌شده زندگی می‌کنند. برای خاموش‌کردن هوک `hook.enabled: false` را تنظیم کن، برای بی‌صداکردن تأییدهای پاک/معلق `hook.quiet: true`، یا `hook.auditLog` را برای یک گزارش NDJSON به مسیر فایلی بده. متغیرهای محیطیِ قدیمیِ `IMPECCABLE_HOOK_DISABLED`، `IMPECCABLE_HOOK_QUIET` و `IMPECCABLE_HOOK_LOG` هنوز پذیرفته می‌شوند و در صورت تنظیم، روی این مقادیر config برتری دارند.

وقتی پروژه از فایل‌های Blade، Twig، ERB یا Handlebars استفاده می‌کند، پسوندهای قالبِ سمت سرور را زیر **`detector.extensions`** اعلام کن؛ در غیر این صورت هوک از آن‌ها می‌گذرد، چون بیرون از فهرست پسوندهای داخلی‌اند. برای هر پسوند یک مدخل، `{ "ext": ".blade.php", "engine": "html" }`. `engine` تحلیل‌گر را برمی‌گزیند (`html` برای قالب‌های مارک‌آپ، `text` برای فایل‌های شبه‌JS/TS/CSS) و پیش‌فرضش `html` است. تطبیق با انتهای نام فایل است، پس پسوندهای دوتایی مثل `.blade.php` و `.html.erb` کار می‌کنند. config فقط پسوند اضافه می‌کند؛ فهرست داخلی همیشه اعمال می‌شود.

اسکن‌های دستیِ `.github/skills/impeccable/scripts/impeccable detect` به‌طور پیش‌فرض از همان config فیلتر پروژه استفاده می‌کنند: `detector.ignoreRules`، `detector.ignoreFiles`، `detector.ignoreValues` و `detector.designSystem.enabled`. `hook.enabled` فقط اجرای خودکارِ هوک را کنترل می‌کند، نه اسکن‌های دستی CLI. برای یک اجرای خام دیتکتور که config و بافت پروژه را نادیده می‌گیرد، از `.github/skills/impeccable/scripts/impeccable detect --no-config ...` استفاده کن. برای CRUD مستقیم CLI روی همان ignoreهای دیتکتور، از `.github/skills/impeccable/scripts/impeccable ignores ...` استفاده کن.

هارنس‌های پشتیبانی‌شده: Claude Code (`.claude/settings.local.json` برای نصب در مقیاس پروژه؛ `~/.claude/settings.json` برای نصب در مقیاس کاربر؛ هوکِ پروژه‌ای که به `.claude/settings.json` مشترک منتقل شده هم در همان‌جا پذیرفته می‌شود)، Codex (`.codex/hooks.json` در پروژه)، Cursor (`.cursor/hooks.json` در پروژه)، Grok Build (`.grok/hooks/impeccable.json` در پروژه؛ نیازمند `/hooks-trust` یا `--trust`)، GitHub Copilot (`.github/hooks/impeccable.json` در پروژه، فایل کامیت‌شدهٔ مشترکِ تیمی که هم Copilot CLI و هم ایجنت ابری می‌خوانند)، و Hermes Agent (پلاگینِ `impeccable-design-hook` در `~/.hermes/plugins/`؛ کاربر یک بار با `hermes plugins enable impeccable-design-hook` فعالش می‌کند؛ لانچرِ نصبِ پروژه‌ای فقط در پروژه‌ای که Hermes به آن اعتماد کرده اجرا می‌شود، از طریق `hermes skills trust`). برای Copilot CLI، هوک‌های سطح ریپو از همان لحظه‌ای که `.github/hooks/impeccable.json` به شاخهٔ پیش‌فرض ریپو کامیت شود فعال می‌شوند.

روی **Cursor**، هوک روی `postToolUse` برای ابزار `Write` (هر ویرایش فایلِ ایجنت) اجرا می‌شود و یادآورش را به شکل `additional_context` برمی‌گرداند که Cursor بعد از نتیجهٔ ابزار اضافه می‌کند. پروژه‌هایی که پیش از این راه‌اندازی شده بودند یک گیت `preToolUse` (`hook-before-edit`) داشتند که نوشتن‌های بد را پیش از فرود مسدود می‌کرد؛ آن گیت تا وقتی `hooks on` یا `impeccable update` یا `impeccable doctor --fix` مدخل را به `postToolUse` منتقل کند سر جایش کار می‌کند.

Gemini هوک‌های نشست و پایان را در `.gemini/settings.json` نصب می‌کند و با تنظیمات موجود ادغام می‌کند (کامنت‌ها تحمل می‌شوند؛ فایل کامنت‌دار پیش از بازنویسی به `settings.json.bak` بکاپ می‌رود و فایلی که JSON معتبر نباشد دست نمی‌خورد). هوک دیتکتورِ هر ویرایش نصب نمی‌کند. هوک `BeforeTool` فقط فرمان‌های شلی را که `build-phase` را اجرا می‌کنند بازنویسی می‌کند، و فقط روی macOS و Linux؛ روی Windows (جایی که Gemini هوک‌ها را از طریق PowerShell اجرا می‌کند) هیچ session id به شل نمی‌رسد، پس ساخت کامپ به نشست گره نمی‌خورد و یادآورِ پایان بی‌صدا می‌ماند.

## مسیریابی

آرگومان اول، کنش است. پیش‌فرضش `status` است.

| کنش | کاری که می‌کند |
|---|---|
| `status` | وضعیت فعلی، مسیرهای config مشترک/محلی، قاعده/فایل/مقدارهای نادیده‌گرفته و override محیطی را چاپ می‌کند. |
| `on` | `enabled: true` را در `.impeccable/config.json` تنظیم می‌کند، رضایت محلیِ هوک را پذیرفته‌شده ثبت می‌کند، و وقتی اسکیل نصب است مانیفست‌های هوکِ ارائه‌دهنده‌ها را نصب/ترمیم می‌کند. |
| `off` | `enabled: false` را در `.impeccable/config.json` تنظیم می‌کند. |
| `ignore-rule <id>` | `<id>` را به `detector.ignoreRules` می‌افزاید؛ برای `overused-font` به `--all-values` نیاز دارد. قاعده را در کل پروژه بی‌اثر می‌کند. |
| `ignore-file <glob>` | `<glob>` را به `detector.ignoreFiles` می‌افزاید. **همهٔ** قواعد را برای فایل‌های منطبق بی‌اثر می‌کند. |
| `ignore-value <id> <value> [--shared] [--reason "..."]` | یک سرکوبِ قاعده/مقدار به `.impeccable/config.json` مشترک می‌افزاید. |
| `ignore-value <id> <value> --local [--reason "..."]` | یک سرکوبِ خصوصیِ قاعده/مقدار به `.impeccable/config.local.json` می‌افزاید. |
| `ignore-value <id> "*" --file <glob> [--file <glob>...]` | یک قاعده را فقط در فایل‌های منطبق خاموش می‌کند و در بقیه‌جا فعال می‌گذارد. `--file` را تکرار کن، یا از `--file=<glob>` / `--files=<glob>` استفاده کن. یک `"*"` لخت بدون `--file` رد می‌شود: اگر واقعاً منظورت کل پروژه است از `ignore-rule <id>` استفاده کن. |
| `reset` | config پروژه، کش dedup و صف معلق Cursor را حذف می‌کند و مدخل‌های هوک را از هر مانیفستِ ارائه‌دهنده‌ای که `on` نصب می‌کند برمی‌دارد، از جمله فایل کامیت‌شدهٔ Copilot (فایل `settings.json`ِ مشترکِ تیمی را که `on` هرگز نمی‌نویسد هرگز دست نمی‌زند). |

## جریان

1. کنش را از آرگومان کاربر استخراج کن. اگر کنشی داده نشده بود، `status` را به کار ببر.
2. اسکریپت ادمین را فراخوانی کن و خروجی‌اش را کلمه‌به‌کلمه منتقل کن:

   ```bash
   .github/skills/impeccable/scripts/impeccable hooks <action> [args...]
   ```

3. اگر `<action>` برابر `off` بود، این یادداشتِ یک‌خطی را دنبالش کن: «انجام شد. ویرایش‌های جدید تا وقتی `/jala hooks on` را اجرا نکنی، دیگر هوک طراحی را در این پروژه فعال نمی‌کنند.»
4. اگر `<action>` برابر `on` بود، دنبالش کن: «انجام شد. هوک طراحی بعد از Edit/Write بعدی روی یک فایل UI شلیک می‌شود.» روی Hermes Agent، `on` نمی‌تواند پلاگین را نصب یا فعال کند: اگر `impeccable context` مقدار `MANUAL_DETECTOR_REQUIRED` را گزارش کرده بود، به کاربر بگو به‌جایش `npx impeccable install` و سپس `hermes plugins enable impeccable-design-hook` را اجرا کند.
5. اگر `<action>` برابر `ignore-value`، `ignore-file` یا `ignore-rule` بود، فقط خروجی اسکریپت را چاپ کن. دامنهٔ پیش‌فرض `.impeccable/config.json` مشترک است؛ `--local` را فقط وقتی اضافه کن که کاربر صریحاً استثنای خصوصی بخواهد.
6. اگر `<action>` برابر `status` بود، فقط خروجی اسکریپت را چاپ کن. مگر آنکه کاربر سؤال پیگیری پرسیده باشد، توضیحی اضافه نکن.

## دسته‌بندی یافته‌ها

خودِ هوک هرگز config نادیده‌گرفتن را نمی‌نویسد؛ هر استثنا از `impeccable hooks` می‌گذرد. هر یافته را به یکی از سه سرنوشت دسته‌بندی کن:

- **مشکل واقعی طراحی**: آن را رفع کن. هرگز برای فرار از یک رفع یا عبورِ یک نوشتنِ بلاک‌شده، ignore اضافه نکن.
- **مثبت کاذبِ مطمئن یا استثنای مجاز**: خودت تنگ‌ترین ignore را ماندگار کن و در پاسخت افشایش کن. معیار، شاهدی است که بتوانی نامش را ببری: یک دمو یا فیکیستورِ عمدی، مستندسازیِ طراحی بد، حرکت لفظی یا متناسب با دامنه (توپی که می‌جهد)، یا انتخابی که کاربر از قبل تأیید کرده. آن شاهد را در `--reason` به شکل `"<who decided: evidence>"` بگذار؛ مقدار "user confirmed" را فقط وقتی بنویس که کاربر واقعاً چنین کرده باشد.
- **مطمئن نیستی**: یافته را برجا بگذار و در یک خط از کاربر بپرس. فقط یک بار بپرس؛ یک پرسشِ یک‌خطی ارزان‌تر از آن است که هوک در هر ویرایش بعدی دوباره شلیک شود.

اقدام مستقل تا `ignore-value` مجاز است. `ignore-file` و `ignore-rule` آن‌قدر چیزها را بی‌صدا می‌کنند که نباید با قضاوت خودت اضافه‌شان کنی؛ اول از کاربر بپرس.

تنگ‌ترین استثنا را ترجیح بده:

- اگر خط یافته، جفتِ `ignore-value <rule> <value>` را نشان می‌دهد، همان را همراه `--reason` خودت به `impeccable hooks ignore-value` بده. این کار به‌طور پیش‌فرض در `.impeccable/config.json` مشترک می‌نویسد.
- برای یافته‌های وابسته به مقدار خاص مثل `overused-font` و `bounce-easing`، برای همان مقدارِ خاص از `ignore-value` استفاده کن. برای یک فونتِ خاص از `ignore-rule overused-font` استفاده نکن.
- اگر یافته فرمانِ وابسته به مقدار خاص ندارد، مثل `side-tab`، همان یک قاعده را به فایل محدود کن: `ignore-value <id> "*" --file <path>`. اول `.github/skills/impeccable/scripts/impeccable detect <path>` را اجرا کن تا ببینی واقعاً چه چیزی آن‌جا شلیک می‌شود.
- به `ignore-file <path>` فقط وقتی دست بزن که کل فایل بیرون از دامنهٔ بازبینی طراحی است: یک فیکیستور، یک آرتیفکت تولیدشده، یک دموی عمدیِ اسلاپ. این کار هر قاعده را برای همیشه برای آن فایل بی‌صدا می‌کند، از جمله قواعدی که هنوز نوشته نشده‌اند. یک سطح UI واقعی با یک قاعدهٔ پرسر‌وصدا، به ignore مقداریِ محدودشده به فایل در بالا نیاز دارد.
- `ignore-rule <id>` را فقط وقتی به کار ببر که کاربر بخواهد کل آن قاعده در سراسر پروژه سرکوب شود. برای سرکوب گستردهٔ فونت پرمصرف، `ignore-rule overused-font --all-values` را فقط وقتی استفاده کن که کاربر بخواهد فونت‌های پرمصرف را به‌طور کلی نادیده بگیرد.
- به‌طور پیش‌فرض ignoreهای config (همان فرمان‌های بالا) را ترجیح بده؛ آن‌ها سرکوب‌ها را در یک جای قابل‌بازبینی نگه می‌دارند. به کامنت درون‌خطی فقط وقتی دست بزن که چشم‌پوشی باید همراه یک فایلِ واحدی برود که ریپو را ترک می‌کند (یک سند مستقلِ تولیدشده/اکسپورت‌شده، یک فایل HTML ایمیل‌شده). مارکرِ پشتیبانی‌شده `impeccable-disable <rule>` (کل فایل) یا `impeccable-disable-line` / `impeccable-disable-next-line` (یک خط) است، در هر نحو کامنتی، با یک دلیل اختیاری بعد از `:` یا `--`. دیتکتور به‌طور پیش‌فرض آن را می‌پذیرد؛ `--no-inline-ignores` یا `--no-config` از آن می‌گذرد.

مثال استثنای وابسته به مقدار خاص:

```bash
.github/skills/impeccable/scripts/impeccable hooks ignore-value overused-font Inter --shared --reason "User confirmed Inter is intentional"
```

مثال استثنای مستقل، با شاهدِ نام‌برده:

```bash
.github/skills/impeccable/scripts/impeccable hooks ignore-value bounce-easing bounce-ball --shared --reason "Agent: literal ball-bounce animation, bounce easing is the subject"
```

مثال استثنای کل‌قاعده برای فونت:

```bash
.github/skills/impeccable/scripts/impeccable hooks ignore-rule overused-font --all-values --reason "User asked to ignore overused fonts generally"
```

مثال استثنای یک‌قاعده-در-یک‌فایل، برای فایلی که هنوز از نظر بقیهٔ چیزها
ارزش بازبینی دارد:

```bash
.github/skills/impeccable/scripts/impeccable hooks ignore-value design-system-font-size "*" --file "src/overlay/widget.js" --reason "Injected widget builds its own type scale; DESIGN.md's ramp describes the site"
```

مثال استثنای کل‌فایل، برای فایلی که به‌کلی بیرون از دامنه است:

```bash
.github/skills/impeccable/scripts/impeccable hooks ignore-file "src/legacy/Card.tsx"
```

## محدودیت‌ها

- هرگز `.impeccable/config.json` یا `.impeccable/config.local.json` را از این فرمان به‌صورت دستی تغییر نده. همیشه از `impeccable hooks` برو تا نوشتن‌ها اعتبارسنجی‌شده بمانند و شکل فایل یکدست بماند. یک استثنا: `detector.extensions` هیچ کنش ادمینی ندارد، پس وقتی کاربر می‌خواهد پشتهٔ قالبی پوشش داده شود، همان یک فیلد را مستقیم در `.impeccable/config.json` ویرایش کن و بقیهٔ فایل را دست‌نخورده بگذار.
- لانچر یا باینریِ پشت `impeccable hook` و `impeccable hook-before-edit` را از این جریان ویرایش نکن. آن‌ها زیرساخت داخلیِ اسکیل‌اند.
- وقتی کاربر می‌پرسد هوک را چقدر می‌توان باور کرد، بگو موتور را بدون سندباکس، با محیط و دسترسی شبکهٔ ایجنت اجرا می‌کند (در ایجنت ابری Copilot هم، وقتی `.github/hooks/impeccable.json` کامیت شده باشد)، و اینکه لانچر پیش از اولین اجرا، موتور دانلودشده را با `.github/skills/impeccable/scripts/engine-checksums.txt` می‌سنجد؛ **هرگز** آن را سندباکس‌شده معرفی نکن.
- هوک هرگز ویرایشی را بلاک نمی‌کند؛ یک یادآورِ پس‌ازویرایش منتشر می‌کند. (پروژهٔ Cursorای که هنوز روی گیت قدیمی `preToolUse` است می‌تواند تا وقتی مانیفستش مهاجرت کند، یک نوشتن را بلاک کند.) خاموش‌کردن، یادآورها را متوقف می‌کند.
- هوک همراهِ اسکیل جلا عرضه می‌شود. نصب‌های پروژه‌ای از `.claude/settings.local.json`، `.codex/hooks.json`، `.cursor/hooks.json`، `.github/hooks/impeccable.json` و `.gemini/settings.json` استفاده می‌کنند؛ نصب Claude در مقیاس کاربر از `~/.claude/settings.json`. روی Codex، کاربر باید اولین بار هوک را از طریق `/hooks` تأیید کند. روی Cursor، تأیید کن هوک‌ها زیر Settings -> Hooks فعال‌اند. روی GitHub Copilot، CLI وقتی `.github/hooks/impeccable.json` به شاخهٔ پیش‌فرض ریپو کامیت شود آن را لود می‌کند و ایجنت ابری مستقیم از ریپو می‌خواندش.

## حالت‌های شکست

- اگر `.impeccable/config.json` یا `.impeccable/config.local.json` ناخوانا یا بدشکل باشد، هوک آن فایل را نادیده می‌گیرد و از بقیهٔ config/پیش‌فرض‌های معتبر استفاده می‌کند. `impeccable hooks status` فایل‌های بدشکل را به‌عنوان نادیده‌گرفته‌شده نشان می‌دهد.
- اگر کاربر خواست هوک «به‌طور سراسری» غیرفعال شود، با `/jala hooks off` شروع کن (ماندگار برای این پروژه؛ `hook.enabled: false` را در config می‌نویسد). متغیر محیطیِ قدیمیِ `IMPECCABLE_HOOK_DISABLED=1` هم به‌عنوان یک override یک‌باره که دنبال شل می‌رود کار می‌کند.
