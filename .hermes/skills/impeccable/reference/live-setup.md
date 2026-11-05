راه‌اندازی یک‌بارهٔ پروژه برای حالت زنده (live mode). فقط در این موارد از [live.md](live.md) بارگذاری می‌شود: وقتی `impeccable live` گزارش `config_missing` / `config_invalid` می‌دهد، وقتی `configDrift` نیاز به رسیدگی دارد، یا وقتی پیکربندی `cspChecked` را ندارد. بخشی از مسیر پرمصرف (hot path) هر نشست نیست.

## نوشتن پیکربندی

فایل را در همان `path`ای که بوت گزارش کرده است بساز (پیش‌فرض `.impeccable/live/config.json`):

```json
{
  "files": ["<path-or-glob>", "<path-or-glob>", ...],
  "exclude": ["<optional-glob>", ...],
  "insertBefore": "</body>",
  "commentSyntax": "html",
  "cspChecked": true
}
```

`files` هدفِ تزریق است: **فایل‌های HTMLای که مرورگر واقعاً بارگذاری می‌کند**، نه لزوماً سورس (اینجا تفاوت tracked و generated اهمیتی ندارد؛ wrap گارد مخصوص فایل تولیدشدهٔ خودش را دارد). هر ورودی یک مسیر تحت‌اللفظی یا یک الگوی glob است. `exclude` (اختیاری) فایل‌هایی را که globِ `files` وگرنه شامل می‌شد کنار می‌گذارد (قالب‌های ایمیل، فیکیستورهای نمایشی). `cspChecked` ثبت می‌کند که گام CSP پایین اجرا شده است؛ در راه‌اندازی نخست غایب است.

**مسیرهای مستثنای قطعی (قابل بازنویسی نیستند):** `**/node_modules/**` و `**/.git/**`؛ تزریق در آن‌ها یعنی مداخله در کد شخص ثالث.

**نحو glob:** `**` با هر تعداد سگمنت مطابقت دارد (حتی صفر)، `*` در محدودهٔ یک سگمنت مطابقت دارد، `?` با یک نویسه مطابقت دارد. مسیرها نسبت به ریشهٔ پروژه و با اسلشِ رو‌به‌جلو نوشته می‌شوند.

| فریم‌ورک | `files` | `insertBefore` | `commentSyntax` |
|-----------|---------|----------------|-----------------|
| اسپا با شلِ واحد (Vite / React / HTML ساده) | `["index.html"]` | `</body>` | `html` |
| Next.js (App Router) | `["app/layout.tsx"]` | `</body>` | `jsx` |
| Next.js (Pages) | `["pages/_document.tsx"]` | `</body>` | `jsx` |
| Nuxt | `["app.vue"]` | `</body>` | `html` |
| Svelte / SvelteKit | `["src/app.html"]` | `</body>` | `html` |
| TanStack Router (SPA, Vite) | `["index.html"]` | `</body>` | `html` |
| TanStack Start (SSR) | `["src/routes/__root.tsx"]` | `<Scripts` | `jsx` |
| Astro | `[" <root layout .astro>"]` | `</body>` | `html` |
| چندصفحه‌ای (برای هر مسیر HTML جدا) | `["public/**/*.html"]`، glob روی پوشهٔ سرو‌شونده | `</body>` | `html` |

لنگری را انتخاب کن که در همهٔ فایل‌ها موجود است (`</body>` تقریباً همیشه جواب می‌دهد)؛ `insertAfter` به جای آن، بعد از یک خط را تطبیق می‌دهد. برای سایت‌های چندصفحه‌ای glob را ترجیح بده تا صفحات جدید خودبه‌خود پوشش داده شوند. برای سایت‌هایی که صفحات‌شان با یک جنریتور بازسازی می‌شود، تزریق فقط تا بازتولید بعدی دوام دارد: پس از هر بیلد دوباره `impeccable live` را اجرا کن (accept بی‌تأثیر است؛ از مسیر جایگزین (fallback) سورس واقعی را می‌نویسد).

**آداپتورهای فریم‌ورک (هنگام تزریق خودکار تشخیص داده می‌شوند).** هر تزریق آنچه را نوشته است در `.impeccable/live/inject-journal.json` ثبت می‌کند؛ تزریق یا حذف بعدی، آثار باقی‌مانده از یک کرش یا توقف در مسیر اشتباه را ترمیم می‌کند. SvelteKit و Nuxt و TanStack Start پوستهٔ سند را سمت سرور رندر می‌کنند، پس یک `<script>` خام در قالب ورودی به‌طور قابل‌اعتماد اجرا نمی‌شود؛ `impeccable live-inject` این‌ها را تشخیص می‌دهد و به یک آداپتور اختصاصی هدایت می‌کند (SvelteKit: کامپوننت ریشهٔ فقط‌توسعه‌ای از `+layout.svelte`؛ Nuxt: پلاگین `.client.ts` فقط‌توسعه‌ای؛ TanStack Start: کامپوننت تولیدشدهٔ فقط‌توسعه‌ای `ImpeccableLiveRoot` در `__root`). مقدار `files` همچنان یک راهنمای معتبر تشخیص/CSP می‌ماند، اما خودِ نقطهٔ درجِ تحت‌اللفظی نیست. یک اسپای سادهٔ TanStack Router مسیر پایهٔ Vite را طی می‌کند.

## رانش پیکربندی

در هر بوت، پروژه به‌دنبال فایل‌های HTML زیر ریشه‌های رایج صفحه (`public/`، `src/`، `app/`، `pages/`) اسکن می‌شود که فهرست نهایی‌شدهٔ `files` آن‌ها را پوشش نمی‌دهد؛ این‌ها به‌شکل `configDrift.orphans` همراه با یک راهنما ظاهر می‌شوند. در هر نشست یک‌بار به کاربر بگو کدام فایل‌ها پوشش ندارند و پیشنهاد بده آن‌ها را اضافه کنی یا `files` را به یک glob تغییر بدهی. هرگز پیکربندی را خودکار به‌روزرسانی نکن؛ تصمیم با کاربر است. وقتی رانشی وجود ندارد، `configDrift` برابر `null` است.

## تشخیص CSP (فقط بار نخست)

همهٔ مجوزهای پایین را فقط‌توسعه‌ای نگه دار، از جمله ویرایش‌های دستی middleware و متاتگ. برای بارگذاری هلپر localhost، CSP سایت تولیدیِ استقرارشده را تغییر نده؛ برای گزینه‌های بازرسی در محیط تولید، [live.md](live.md) را ببین.

اگر `config.cspChecked === true` بود، کل این بخش را رد کن؛ از کاربر قبلاً یک‌بار پرسیده شده است.

```bash
.hermes/skills/impeccable/scripts/impeccable detect-csp
```

خروجی `{ shape, signals }` است؛ شکل، *سازوکارِ وصله* را نام می‌برد، پس یک قالب فریم‌ورک‌های بسیاری را پوشش می‌دهد:

- **`null`**: CSP وجود ندارد؛ پیکربندی را با `cspChecked: true` بنویس و همین‌جا متوقف شو.
- **`append-arrays`**: CSP به‌شکل آرایه‌های ساختاریافتهٔ directive؛ قابل وصله‌کردنِ خودکار (هلپرهای مونوریپو با `additionalScriptSrc`/`additionalConnectSrc`، `kit.csp.directives` در SvelteKit، `nuxt-security` در Nuxt).
- **`append-string`**: CSP به‌شکل رشتهٔ مقدارِ تحت‌اللفظی؛ قابل وصله‌کردنِ خودکار (`headers()` درون‌خطی در `next.config.*`، `routeRules` در Nuxt).
- **`middleware`** / **`meta-tag`**: تشخیص داده می‌شوند اما خودکار وصله نمی‌خورند. فایل‌های تشخیص‌داده‌شده را به کاربر نشان بده، از او بخواه `http://localhost:8400` را به‌صورت دستی به `script-src` و `connect-src` اضافه کند، سپس `cspChecked: true` را علامت بزن و ادامه بده.

### پرامپت رضایت (همین عبارت‌بندی را به کار ببر)

> **وصلهٔ CSP لازم است.** در پروژهٔ شما یک Content Security Policy تشخیص دادم که `http://localhost:8400` را مسدود می‌کند: انتخاب‌گر حالت زنده بدون یک مجوز بارگذاری نمی‌شود. تغییری که اعمال خواهم کرد این است:
>
> ```diff
> [file: <patchTarget>]
> [exact diff, 2-5 lines]
> ```
>
> این تغییر با `NODE_ENV === "development"` گارد شده است، پس این ورودیِ اضافه فقط در محیط توسعه ظاهر می‌شود و هرگز به تولید نمی‌رسد. هر زمان بخواهید می‌توانید با بازگرداندن این فایل آن را حذف کنید. اعمال شود؟ [y/n]

در پاسخ «نه»: از وصله صرف‌نظر کن، یادداشت کن که حالت زنده تا وقتی مجوز به‌صورت دستی اضافه نشود کار نخواهد کرد، و با این حال `cspChecked: true` را بنویس (سؤال پرسیده شده است). در پاسخ «بله»: وصلهٔ متناسب با شکل را مطابق پایین اعمال کن، سپس `cspChecked: true` را بنویس.

### append-arrays

نزدیک بالای فایلی که آرایه‌های CSP را نگه می‌دارد تعریف کن، سپس `...__impeccableLiveDev` را به آرایه‌های script-src و connect-src اضافه کن:

```ts
// Dev-only allowance so impeccable live mode can load. Guarded by NODE_ENV.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? ["http://localhost:8400"] : [];
```

به‌تفکیک فریم‌ورک: Next.js + هلپر مونوریپو: `next.config.*` مربوط به *خود اپ* را ویرایش کن (نه هلپر مشترک) و به `additionalScriptSrc` / `additionalConnectSrc` اضافه کن. SvelteKit: `svelte.config.js`، `kit.csp.directives['script-src']` و `['connect-src']`. Nuxt + nuxt-security: `nuxt.config.*`، `security.headers.contentSecurityPolicy['script-src']` و `['connect-src']`. خروجی‌های مرجع: [nextjs-turborepo/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-turborepo/expected-after-patch.ts)، [sveltekit-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/sveltekit-csp/expected-after-patch.js). رفتار idempotent: اگر `__impeccableLiveDev` از قبل در فایل موجود باشد، وصله اعمال می‌شود؛ فقط `cspChecked: true` را علامت بزن.

### append-string

وصلهٔ دو نقطه‌ای: یک رشتهٔ فقط‌توسعه‌ای تعریف کن و آن را در مقدار CSP در هر دو directive درون‌یابی کن (با فاصلهٔ ابتدایی تا الحاق تمیز انجام شود؛ رشته‌های تحت‌اللفظی را هم بخشی از همین ویرایش به template string تبدیل کن):

```ts
// Dev-only allowance so impeccable live mode can load.
const __impeccableLiveDev =
  process.env.NODE_ENV === "development" ? " http://localhost:8400" : "";
```

- `script-src 'self' 'unsafe-inline'` تبدیل می‌شود به `` `script-src 'self' 'unsafe-inline'${__impeccableLiveDev}` ``
- `connect-src 'self'` تبدیل می‌شود به `` `connect-src 'self'${__impeccableLiveDev}` ``

به‌تفکیک فریم‌ورک: Next.js با `headers()` درون‌خطی در `next.config.*`؛ Nuxt با `routeRules['/**'].headers['Content-Security-Policy']` در `nuxt.config.*`. خروجی‌های مرجع: [nextjs-inline-csp/expected-after-patch.js](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nextjs-inline-csp/expected-after-patch.js)، [nuxt-csp/expected-after-patch.ts](https://github.com/pbakaus/impeccable/blob/8dac6ae7e020c43ab10ce9b41939f6fd42627b96/tests/framework-fixtures/nuxt-csp/expected-after-patch.ts).

## رفع اشکال

اگر کاربر به وصلهٔ CSP پاسخ «نه» گفته و بعداً گزارش کرده که حالت زنده کار نمی‌کند: CSP توسعهٔ او `http://localhost:8400` را مسدود می‌کند. `cspChecked` را از `.impeccable/live/config.json` حذف کن و دوباره `impeccable live` را اجرا کن؛ راه‌اندازی دوباره سؤال می‌پرسد.

پس از راه‌اندازی، دوباره `impeccable live` را اجرا کن.
