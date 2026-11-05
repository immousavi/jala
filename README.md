# جلا (Jala)

واژگان طراحی برای ایجنت کدنویسیِ تو — **نسخهٔ فارسیِ [Impeccable](https://github.com/pbakaus/impeccable)**. با `polish` و `bolder` هدایت کن، با `critique` و `audit` بازبینی کن، و اسلاپِ هوش مصنوعی را قبل از عرضه بگیر. با دانش کاملِ طراحی فارسی: تایپوگرافی فارسی، چیدمان راست‌به‌چپ (RTL)، ارقام فارسی، تقویم جلالی، تومان و شناسه‌های ایرانی.

> **این چیست؟** جلا یک فورک کاملِ فارسی از Impeccable است: هر ۴۶ فایل مرجع و دستورالعمل به فارسی ترجمه شده، ۸ قاعدهٔ مطلقِ فارسی به خط پایهٔ کیفیت اضافه شده، و چهار مرجع جدید (`fa-typography`، `fa-rtl`، `fa-numbers-dates`، `fa-components`) واژگان طراحی فارسی را به ایجنت می‌دهد. موتور تشخیص (۶۲ قاعدهٔ قطعی) از پروژهٔ اصلی می‌آید و تغییری نکرده است.

## نصب

### روش ۱: کپی دستی (بدون Node، سریع‌ترین راه)

پوشهٔ اسکیل را در پروژهٔ خودت کپی کن:

```bash
mkdir -p your-project/.claude/skills
cp -r skill your-project/.claude/skills/jala
```

ابزارت را ری‌استارت کن و بعد در ایجنت `/jala init` را اجرا کن. برای بقیهٔ ابزارها همین پوشه را در مقصد مربوط به هر ابزار کپی کن (جدول پایین). فایل لانچر موتور را هم داخل اسکیل نگه دار — `skill/scripts/` باید دست‌نخورده بماند، چون لانچر باینری موتور را در اولین اجرا دانلود می‌کند.

| ابزار | پوشهٔ پروژه | پوشهٔ سراسری |
|---|---|---|
| Claude Code | `.claude/skills/` | `~/.claude/skills/` |
| Cursor | `.cursor/skills/` | |
| Codex CLI، Replit Agent | `.agents/skills/` | `~/.agents/skills/` |
| GitHub Copilot | `.github/skills/` | |
| Gemini CLI | `.gemini/skills/` | |
| OpenCode | `.opencode/skills/` | |
| بقیهٔ ابزارها | جدول کامل در [README اصلی Impeccable](https://github.com/pbakaus/impeccable#installation) | |

### روش ۲: نصب‌کنندهٔ پروژهٔ اصلی (انگلیسی)

```bash
npx impeccable install
```

نصب‌کنندهٔ رسمی Impeccable ابزارهای کدنویسی‌ات را پیدا می‌کند و هوکِ طراحی را هم تنظیم می‌کند — ولی محتوایی که نصب می‌کند نسخهٔ انگلیسی است. برای محتوای فارسی، پوشهٔ `skill/` این ریپو را بعد از نصب، روی پوشهٔ نصب‌شده کپی کن (فقط فایل‌های `.md` را جایگزین کن؛ `scripts/` را دست نزن).

### روش ۳: پلاگین Claude Code

از این ریپو: `/plugin marketplace add <این-ریپو>` (اگر روی گیت هاست)، یا بعد از بیلد محلی از `.claude-plugin/marketplace.json`.

سازگاری: Claude Code، Cursor، Codex CLI، GitHub Copilot، Devin، Replit Agent، Gemini CLI، Grok Build، OpenCode، Kiro، Trae و بقیه — همان فهرست کامل Impeccable. مستندات اصلی: [impeccable.style/docs](https://impeccable.style/docs).

## چرا

Inter برای همه‌چیز. گرادیان بنفش‌به‌آبی. کارت داخل کارت، متن خاکستری روی پس‌زمینهٔ رنگی، کاشی آیکنِ مربع‌گوشه‌گرد بالای هر عنوان — و در نسخهٔ فارسی: Tahoma به‌عنوان فونت اصلی، ایتالیک مصنوعی روی حروف چسبان، ارقام مخلوط فارسی/لاتین/عربی، تقویم میلادی در محصول ایرانی، و چیدمانی که فقط `dir="rtl"` خورده و آینه نشده. از ایجنت بخواه صفحه‌ای بسازد بدون هیچ راهنمایی دیگر، و این‌ها دوباره و دوباره ظاهر می‌شوند.

- **کلمه‌ها برای چیزی که می‌خواهی.** «جذابش کن» ایجنت را در حدس رها می‌کند. `/jala bolder the pricing cards` پلی‌بوکِ مخصوص همان حرکت را لود می‌کند و به یک هدف مشخص نشانه می‌رود.
- **یک بازبین.** `critique` طراحی را با اصول استفاده‌پذیری نمره می‌دهد و اولویت درست‌کردن‌ها را می‌چیند. `audit` دسترس‌پذیری، کارایی، تم و رفتار واکنش‌گرا را چک می‌کند با یافته‌های رده‌بندی‌شده از P0 (مسدودکننده) تا P3 (پالایش) — و روی سطوح فارسی، چک‌های RTL و فارسی را هم اضافه می‌کند.
- **دیتکتور اسلاپ.** ۶۲ قاعدهٔ قطعی نشانه‌های بالا را می‌گیرد، به‌علاوهٔ مشکلات کیفی مثل پدینگ خفه و پرش سطح عنوان. بدون LLM، بدون کلید API. متن اسکیل و توضیح فرمان‌ها در این فورک فارسی است؛ باینری موتور از ریلیزهای پروژهٔ اصلی می‌آید و توضیح قواعدش انگلیسی می‌ماند.

## چطور کار می‌کند

`/jala init` را در هر پروژه یک‌بار اجرا کن. کدت را می‌خواند، فقط چیزهایی را می‌پرسد که نمی‌تواند استنتاج کند (محصول برای کیست، چه باید بکند، محدودیت‌ها) و `PRODUCT.md` را می‌نویسد. هر فرمان بعدی آن را می‌خواند. `/jala document` سیستم بصری موجودت را در `DESIGN.md` ثبت می‌کند تا تغییرها برند را نگه دارند — قالب فارسی آن، DESIGN.md فارسی تولید می‌کند.

بعد یک فرمان و یک هدف نام ببر:

```
/jala critique the onboarding flow
/jala quieter the landing page
/jala polish settings
/jala harden checkout
```

یا فقط بگو چه می‌خواهی: `/jala این بخش هیرو را از نو بساز`. هدف‌های باریک نتیجهٔ بهتری می‌دهند. فرمانی که زیاد استفاده می‌کنی را با `/jala pin audit` پین کن تا `/audit` میان‌بر مستقل شود.

وقتی سطح فارسی است (محتوا، برند یا زبان محصول)، اسکیل خودش مرجع‌های فارسی را لود می‌کند:

- **`fa-typography`** — فونت‌های فارسی (وزیرمتن، استعداد و...)، ارتفاع خط ۱٫۷–۲٫۱، ممنوعیت ایتالیک و letter-spacing، نیم‌فاصله (ZWNJ)، ارقام فارسی.
- **`fa-rtl`** — پراپرتی‌های منطقی به‌جای چپ/راست، چه چیزی آینه می‌شود و چه چیزی نه، فرم‌ها، تست RTL.
- **`fa-numbers-dates`** — ارقام فارسی در برابر عربی، تقویم جلالی با هفتهٔ شنبه‌شروع، تومان، کد ملی/کارت/شبا/موبایل با `Intl` فارسی.
- **`fa-components`** — منابع فارسی: کتابخانهٔ [vibefarsi.ir](https://vibefarsi.ir/) (۷۸ کامپوننت RTL فارسی، تقویم جلالی، ورودی‌های ایرانی) با نصب `npx vibefarsi@latest init`، فونت‌ها، و ضدالگوهای «فارسی‌سازی».

### ۲۴ فرمان

| | فرمان‌ها |
|---|---|
| **هدایت** | `bolder` طراحیِ محافظه‌کار را پرقدرت می‌کند · `quieter` تند را آرام می‌کند · `distill` حذف می‌کند هرچه صفحه لازم ندارد · `colorize` به رابط خاکستری رنگ می‌آورد · `typeset` فونت‌ها، سلسله‌مراتب و سایزها را درست می‌کند · `layout` فاصله‌گذاری و ریتم را · `animate` ترنزیشن و بازخورد تعامل اضافه می‌کند · `delight` شخصیت می‌دهد · `overdrive` سراغ شیدر، فیزیک فنری و افکت‌های scroll-driven می‌رود |
| **بازبینی** | `critique` نمرهٔ UX می‌دهد · `audit` گزارش کیفیت فنی |
| **پایان‌کاری** | `polish` آخرین پاس قبل از عرضه · `harden` خطاها، بومی‌سازی، سرریز و حالت‌های مرزی · `clarify` متن نامفهوم را بازنویسی می‌کند · `adapt` اندازه‌های صفحه و دستگاه‌ها · `optimize` کارایی لود و رندر · `onboard` جریان‌های اولیه و حالت‌های خالی |
| **تکرار زنده** | `live` عنصر را در مرورگر انتخاب می‌کنی و روی واریانت‌ها چرخ می‌زنی · `generate` واریانتِ عنصرِ نام‌دار بدون انتخاب دستی |
| **برنامه و راه‌اندازی** | `shape` قبل از کد UX را برنامه می‌ریزد · `init` می‌نویسد `PRODUCT.md` · `document` می‌نویسد `DESIGN.md` · `extract` الگوهای تکرارشونده را به سیستم طراحی می‌کشد |

فرمان بیست‌وچهارم `craft` است: نام مستعارِ منسوخ برای یک درخواست ساخت معمولی. فقط `/jala` را تایپ کن تا فهرست را در ایجنتت ببینی. صفحهٔ اختصاصی هر فرمان: [impeccable.style/docs](https://impeccable.style/docs).

### حالت زنده (live)

`/jala live` سرور توسعهٔ در حال اجرایت را با یک اورلی باز می‌کند. عنصر را انتخاب کن، جهت را بگو، و واریانت‌ها سر جایشان با HMR عوض می‌شوند. یکی را قبول کن و در سورس نوشته می‌شود. با Vite، Next، SvelteKit، Astro، Nuxt و HTML ساده کار می‌کند.

حالت زنده فقط checkout محلی را ویرایش می‌کند؛ آن را به سایت دیپلوی‌شده تزریق نکن و برای کارکردنش CSP پروداکشن را تضعیف نکن. اعمالِ ویرایش‌های متنی، اسکریپت اختیاریِ `impeccable:manual-edit-validate` از `package.json` تو را با دسترسی‌های خودت اجرا می‌کند، پس پیش از استفاده در ریپوی ناآشنا آن را بازبینی کن.

Apply، ویرایش‌های متنیِ استیج‌شده را در حین پولینگ نشست زنده به ایجنت چت تو می‌فرستد. اگر هیچ ایجنتی در یک دقیقهٔ گذشته پولینگ نکرده باشد، به‌جایش CLI را از PATH اجرا می‌کن (`codex`، یا در نبودش `claude`)، با تأییدها، چک‌های دسترسی و سندباکس خاموش (`--dangerously-bypass-approvals-and-sandbox` یا `--permission-mode bypassPermissions`) و محیط ارثی. پرامپتش ویرایش‌های استیج‌شده، HTML عناصر ویرایش‌شده و متن مجاورشان، URL صفحه و مسیرهای کاندیدِ سورس را حمل می‌کند. برای اینکه Apply در سشن چت خودت بماند، `IMPECCABLE_LIVE_COPY_AGENT=chat` را در محیطی که حالت زنده را راه می‌اندازد ست کن؛ یا `off` برای غیرفعال‌کردن Apply. سرور این را فقط یک بار در شروع می‌خواند.

## سه راه اجرای دیتکتور

**در ایجنتت.** هوکِ طراحی هر فایل UI را که ایجنت ویرایش می‌کند اسکن می‌کند و یافته‌ها را قبل از اعلامِ «تمام شد» به او می‌دهد. بیشترین اسلاپ همین‌جا گرفته می‌شود. روی Claude Code، Cursor، Codex، GitHub Copilot، Grok Build و Hermes Agent موجود است؛ نصب‌کننده تنظیمش می‌کند. قبولش کن. (هوک‌ها زیرساخت موتورِ اصلی‌اند و نام‌ها همان impeccable می‌ماند — مسیر نصب اسکیل `skills/impeccable/` است حتی وقتی دستور `/jala` است.)

**در CI یا ترمینال.** CLI به ایجنت نیاز ندارد:

```bash
npx impeccable detect src/                   # اسکن یک پوشه
npx impeccable detect https://example.com    # اسکن صفحهٔ رندرشده (از Chrome یا Edge نصب‌شده استفاده می‌کند)
npx impeccable detect --json .               # خروجی ماشین‌خوان
npx impeccable detect --github src/          # انوتیشن GitHub Actions
npx impeccable detect --list-rules           # همهٔ قواعد با id و توضیح (توضیح‌ها انگلیسی‌اند — از باینری آپ‌استریم)
```

**در مرورگرت.** [پسوند Chrome](https://chromewebstore.google.com/detail/impeccable/bdkgmiklpdmaojlpflclinlofgjfpabf) همان یافته‌ها را روی هر صفحهٔ زنده نمایش می‌دهد — این لینک نسخهٔ انگلیسیِ پروژهٔ اصلی است؛ سورس فارسی‌شدهٔ اکستنشن در پوشهٔ `extension/` همین ریپو هست ولی هنوز در استور منتشر نشده.

کد خروجی `2` یعنی یافته وجود دارد، `1` یعنی هدف قابل اسکن نبود. برای معاف‌کردن فونت برند: `npx impeccable ignores add-value overused-font Inter --reason "Brand font"`.

## نکته‌ها

- **مسیر نصب و برند:** نام اسکیل `jala` است (دستورها `/jala <command>`)؛ اما پوشهٔ نصب `skills/impeccable/` و لانچر `scripts/impeccable` به همین نام می‌مانند، چون باینری موتور (که از ریلیزهای پروژهٔ اصلی دانلود می‌شود) این مسیرها را در هوک‌ها و مدیریت drift ثابت نگه می‌دارد. تغییرشان هوک و داکتر را بی‌سروصدا می‌شکند.
- **موتور بدون Node:** اسکیل یک لانچر خودکفا دارد؛ باینری موتور در اولین اجرا در `~/.impeccable/bin/` دانلود و با چک‌سام تأیید می‌شود.
- **هوک‌ها بیرون از تأیید مدل اجرا می‌شوند.** در Claude Code هوک‌های نصب‌شده حتی وقتی فرمانِ خودِ مدل را رد می‌کنی اجرا می‌شوند؛ قبل از اجراهای بدون‌ناظر، هوک‌های نصب‌شده را بازبینی کن.
- **چیزی خراب است؟** `/jala doctor` فایل‌های context کهنه، تنظیمات بی‌استفاده و هوک‌های شکسته را پیدا می‌کند.
- **تلمتری.** موتور، جهت‌های بصری را از کاتالوگ impeccable.style می‌گیرد. خاموش‌کردنش با `npx impeccable telemetry off` یا `DO_NOT_TRACK=1`.
- **پروژه‌های فارسی بساز:** برای کامپوننت‌های حساس‌به‌فارسی (تقویم جلالی، کد ملی، کارت بانکی، OTP پیامکی) قبل از ساختن از صفر، `fa-components` را ببین.

## فایل‌های پروژه و git

جلا فایل‌های کاری‌اش را زیر `.impeccable/` می‌نویسد. چند مورد آرتیفکتِ مشترکِ پروژه‌اند و جای‌شان ریپوست: `config.json`، `live/config.json`، `design.json`، `surfaces/*.md` و `critique/*.md`. `PRODUCT.md` و `DESIGN.md` را هم در ریپو نگه دار. بقیه اسکرین‌شات، کش و وضعیت runtime است — این الگو را در `.gitignore` پروژه‌ات بگذار (توضیح خطوط داخل کامنت‌ها؛ محتوای الگو قرارداد موتور است و ترجمه نمی‌شود):

```gitignore
# impeccable-ignore-start
# Ephemeral output, runtime state, and per-dev overrides.
# The **/ prefix covers .impeccable at the repo root or in a nested workspace.
# Shared artifacts stay tracked: config.json, live/config.json,
# design.json, surfaces/*.md, critique/*.md.
**/.impeccable/config.local.json
**/.impeccable/hook.cache.json
**/.impeccable/hook.pending.json
**/.impeccable/*.png
**/.impeccable/review/
**/.impeccable/questions/
**/.impeccable/live/server.json
**/.impeccable/live/sessions/
**/.impeccable/live/previews/
**/.impeccable/live/annotations/
**/.impeccable/live/cache/
**/.impeccable/live/manual-edit-apply-transaction.json
**/.impeccable/live/manual-edit-events.jsonl
**/.impeccable/live/manual-edit-evidence/
**/.impeccable/live/*.png
# impeccable-ignore-end
```

## توسعه

- ساخت اسکیل‌ها برای همهٔ ابزارها: `bun run build:skills` (به Bun نیاز دارد) — پوشه‌های `.claude/`، `.cursor/`، `.gemini/` و بقیه در ریشهٔ ریپو، خروجی‌های بیلدِ کامیت‌شده‌اند و بعد از تغییر سورس دوباره تولید می‌شوند.
- مستندات فنی موتور (Rust) به انگلیسی باقی مانده‌اند؛ مخاطب‌شان توسعه‌دهندگان موتور است. راهنمای توسعه در [docs/DEVELOP.md](docs/DEVELOP.md).
- واژه‌نامهٔ ترجمه و قرارداد نگارش این فورک: [GLOSSARY.md](GLOSSARY.md).

## منبع و مجوز

این پروژه فورک فارسیِ [Impeccable](https://github.com/pbakaus/impeccable) اثر [Paul Bakaus](https://www.paulbakaus.com) است (Apache 2.0) که خودش از اسکیل [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) شرکت Anthropic شروع شده. مجوز: Apache 2.0 — ببین [LICENSE](LICENSE) و [NOTICE.md](NOTICE.md). منابع فارسی: [vibefarsi.ir](https://vibefarsi.ir/) — کتابخانهٔ کامپوننت RTL فارسی.

---

توسط [Paul Bakaus](https://www.paulbakaus.com) ساخته شد · فارسی‌سازی: فورک جلا
