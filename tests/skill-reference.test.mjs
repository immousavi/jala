import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// jala fork: the reference files are Persian, so the authoring contracts are
// pinned to the Persian wording (copied byte-exact from the translated files)
// plus the language-neutral engine contract tokens the glossary keeps Latin
// (rule markers, contract-block labels, CLI flags, code identifiers). See
// GLOSSARY.md §3 for what must never be translated.
describe('skill reference authoring contracts', () => {
  it('keeps direction contracts in development-only surface briefs', () => {
    const newWork = readFileSync(join(ROOT, 'skill/reference/new-work.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const recordDecision = newWork.match(/## ۵\. ثبت تصمیم\n([\s\S]*?)\n## ۶\./)?.[1] ?? '';

    assert.match(recordDecision, /قرارداد فقط‌توسعه‌ای زیر `## Direction contract` در بریف سطحِ مربوط ثبت کن/);
    assert.match(recordDecision, /بعد از نوشتن، یک بار دیگر بریف را بخوان/);
    assert.match(recordDecision, /هر شش بلاک قرارداد و مرجع seed/);
    assert.match(recordDecision, /SEED REFERENCEای که concept-seed چاپ کرده .*هرگز کلید خامِ seed/);

    for (const block of ['THESIS:', 'OWN-WORLD:', 'STORY:', 'FIRST VIEWPORT:', 'FORM:', 'FINISH:']) {
      assert.match(recordDecision, new RegExp(`${block}`));
    }

    for (const browserArtifact of [
      /کامنت‌های HTML یا فریم‌ورک/,
      /DOM مخفی/,
      /<template>/,
      /`data-\*`/,
      /props یا state سریالایز‌شده/,
      /payloadهای React Server Component/,
      /باندل‌های کلاینت/,
      /متادیتا یا JSON-LD/,
      /متنِ فقط‌دسترس‌پذیری/,
    ]) {
      assert.match(recordDecision, browserArtifact);
    }

    assert.match(recordDecision, /هرگز قرارداد جهت را داخل سورس پیاده‌سازی یا هیچ آرتیفکتِ تحویل‌شده به مرورگر کپی نکن/);
    assert.doesNotMatch(newWork, /contract in the artifact's opening comment/);
    assert.doesNotMatch(newWork, /survives the production build/);
    assert.doesNotMatch(newWork, /grep the built output/);
    assert.doesNotMatch(newWork, /emitted markup/);
    assert.doesNotMatch(newWork, /first child of the document's body/);
  });

  it('collects the existing-DESIGN.md choice before the documenter writes', () => {
    const newWork = readFileSync(join(ROOT, 'skill/reference/new-work.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const documenter = readFileSync(join(ROOT, 'skill/agents/impeccable-documenter.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const handoff = newWork.match(/بعد از آخرین اصلاح[\s\S]*?<!-- rule:skill-documenter-records-the-world -->/)?.[0] ?? '';
    const inputContract = documenter.match(/## قرارداد ورودی\n([\s\S]*?)\n## روند کار/)?.[1] ?? '';

    assert.match(handoff, /\{\{ask_instruction\}\} refresh، overwrite یا merge را پیشنهاد بده/);
    assert.ok(handoff.indexOf('{{ask_instruction}}') < handoff.indexOf('مستندساز همراه'), 'the choice is collected before the documenter is spawned');
    assert.match(inputContract, /نوسازی، بازنویسی کامل، یا ادغام/);
    assert.doesNotMatch(documenter, /update, not replace/);
    assert.match(documenter, /پاسخی نرسیده، هیچ ننویس/);
  });

  it('skips the detector and its degraded banner on native critique targets', () => {
    const critique = readFileSync(join(ROOT, 'skill/reference/critique.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const orchestration = critique.match(/### هماهنگی ارزیابی‌ها\n([\s\S]*?)\n<codex>/)?.[1] ?? '';

    assert.match(orchestration, /\*\*پلتفرم‌های نیتیو\*\* \(`ios` \/ `android` \/ `adaptive`\): ارزیابی B موضوعیت ندارد/);
    assert.match(orchestration, /هر دو گیتِ زیرایجنتِ پایین را رد کن، از جمله پرسشِ مجوز Codex/);
    assert.match(critique, /پلتفرم‌های نیتیو فقط A را اجرا می‌کنند/);
    assert.match(critique, /- نیتیو: `Method: design review only \(detector not applicable, native platform\)`/);
    assert.match(critique, /به‌جایش بنویس `not applicable \(native platform\)`/);
  });

  it('keeps reduced-motion guidance on the animation build path', () => {
    const animate = readFileSync(join(ROOT, 'skill/reference/animate.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const accessibility = animate.match(/## دسترس‌پذیری و کنترل\n([\s\S]*?)\n## راستی‌آزمایی/)?.[1] ?? '';
    const verify = animate.match(/## راستی‌آزمایی\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? '';

    assert.match(accessibility, /prefers-reduced-motion/);
    assert.match(accessibility, /جایگزینیِ آگاهانه/);
    assert.match(accessibility, /نه خاموشیِ همهٔ حرکت/);
    assert.match(verify, /reduced[- ]motion/i);
  });

  it('uses an exact content fingerprint before inheriting a critique snapshot', () => {
    const critique = readFileSync(join(ROOT, 'skill/reference/critique.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const polish = readFileSync(join(ROOT, 'skill/reference/polish.md'), 'utf-8').replace(/\r\n?/g, '\n');

    assert.match(critique, /یک اثرانگشتِ دقیق از محتوا هم ثبت می‌کند/);
    assert.match(polish, /اثر انگشتِ محتوای فعلیِ دقیق فایل را با اثر انگشتی که critique ثبت کرده مقایسه می‌کند/);
    assert.match(polish, /محتوای بدون تغییر در وضعیت staged، unstaged یا untracked همچنان به‌روز است/);
    assert.match(polish, /هر تغییر بایتی، حذف، یا جایگزینی با غیرفایل، بک‌لاگی که همین اسنپ‌شات شناسایی کرده را می‌بندد/);
    assert.match(polish, /latest "<resolved target>" --json/);
    assert.match(polish, /هویت دقیق `snapshot_file`/);
    assert.match(polish, /close "<resolved target>" "<snapshot_file returned by latest>"/);
    assert.match(polish, /اگر در این میان critique تازه‌تری رسیده باشد، بک‌لاگ آن زنده می‌ماند/);
    assert.doesNotMatch(polish, /git status|git log/);
  });

  it('routes visual decision fallback through wait capability and start failure', () => {
    const newWork = readFileSync(join(ROOT, 'skill/reference/new-work.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const visualDecisionPage = newWork.match(
      /هارنسی که می‌تواند شلی را در پس‌زمینه بلاک نگه دارد[\s\S]*?<!-- rule:skill-visual-decision-page -->/,
    )?.[0] ?? '';

    assert.match(visualDecisionPage, /نمی‌تواند یک `--wait` بلاک‌کننده را نگه دارد/);
    assert.match(visualDecisionPage, /بدون راه‌اندازی صفحه/);
    assert.match(visualDecisionPage, /ابزار ساختاریافته/);
    assert.match(visualDecisionPage, /در اولین پاسخ افشا می‌کند/);
    assert.match(visualDecisionPage, /کد خروج 2 از راه‌اندازی/);
    assert.match(visualDecisionPage, /بررسی wait پیش از راه‌اندازی/);
    // Codex's exec_command returns a still-running --wait as a pollable session;
    // that is not a harness that backgrounds the command away (astra/sol, 2026-10-04).
    assert.match(visualDecisionPage, /سشنی قابل‌پول پس می‌دهد، wait را نگه می‌دارد/);
    assert.match(visualDecisionPage, /`--wait` را فقط وقتی دوباره اجرا کن که بدون پاسخ خارج شده باشد/);
    assert.doesNotMatch(
      visualDecisionPage,
      /only exit code 2 from starting it routes the decision to the structured tool; that exit is the fallback/,
    );
  });

  it('lists every card kind the engine accepts in the identity rule', () => {
    const newWork = readFileSync(join(ROOT, 'skill/reference/new-work.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const telemetry = readFileSync(join(ROOT, 'crates/context/src/telemetry.rs'), 'utf-8');
    const cardKinds = telemetry.match(/pub const CARD_KINDS: .*? = \[(.*?)\];/)?.[1].match(/[a-z]+/g) ?? [];
    const identityRule = newWork.match(/هر گزینه هویتش را اعلام می‌کند: ([\s\S]*?)، و هر چلنجر/)?.[1] ?? '';

    assert.ok(cardKinds.includes('dealt'));
    for (const kind of cardKinds) {
      assert.match(identityRule, new RegExp(`\`${kind}\``));
    }
  });

  it('sizes the hand by the verdicts, never by a requested count', () => {
    const newWork = readFileSync(join(ROOT, 'skill/reference/new-work.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const handComposition = newWork.match(
      /یک دست حداکثر سه چلنجرِ کارت‌کامل دارد[\s\S]*?یک کارت هم برای آن اضافه کن/,
    )?.[0] ?? '';

    assert.match(handComposition, /اندازهٔ دست از حکم‌ها پیروی می‌کند، نه از عددی که کاربر گفته/);
    assert.match(handComposition, /در یک خط بگو چرا کوچک‌تر است، و پخش دوباره‌ای پیشنهاد کن/);
    assert.match(handComposition, /چلنجر declined هرگز برای پر کردن یک خانه ارتقا نمی‌گیرد/);
    assert.match(handComposition, /خروج دائمی، بعد از آنکه کاربر دیدش و رد کرد، در عدد خواسته‌شده حساب نمی‌شود/);
  });

  it('keeps touch-gesture verification in the adapt, audit, and harden references', () => {
    const adapt = readFileSync(join(ROOT, 'skill/reference/adapt.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const audit = readFileSync(join(ROOT, 'skill/reference/audit.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const harden = readFileSync(join(ROOT, 'skill/reference/harden.md'), 'utf-8').replace(/\r\n?/g, '\n');
    const verifyAdaptations = adapt.match(/## راستی‌آزمایی تطبیق‌ها\n([\s\S]*?)\n## /)?.[1] ?? '';
    const responsive = audit.match(/### ۴\. طراحی واکنش‌گرا\n([\s\S]*?)\n### ۵\./)?.[1] ?? '';
    const edgeCases = harden.match(/### حالت‌های مرزی و شرایط مرزی\n([\s\S]*?)\n### /)?.[1] ?? '';
    const verifyHardening = harden.match(/## سخت‌سازی را راستی‌آزمایی کن\n([\s\S]*?)(?:\n## |$)/)?.[1] ?? '';

    assert.match(verifyAdaptations, /\*\*ژست اصلی\*\*/);
    assert.match(verifyAdaptations, /بگو چه چیزی شاهد را تولید کرده/);
    assert.match(verifyAdaptations, /چیدمان را راستی‌آزمایی می‌کنند، هرگز یک ژست را/);
    assert.match(verifyAdaptations, /شکافی گزارش‌شده است، نه مسدودکننده/);
    assert.match(verifyAdaptations, /\*\*اسکرول روی آن\*\*[\s\S]*بدون آنکه کنترل را فعال کند/);
    assert.match(responsive, /\*\*تعامل لمسی شکسته\*\*/);
    assert.match(responsive, /چه چیزی تست‌نشده ماند/);
    assert.match(responsive, /ژست را وقتی ابزار مرورگر می‌تواند لمس سنتز کند ورزش بده/);
    assert.match(edgeCases, /\*\*ژست‌های قطع‌شده\*\*[\s\S]*بدون reload کار می‌کند/);
    assert.match(edgeCases, /وضعیت dragging را پاک کن و capture را آزاد کن/);
    assert.match(verifyHardening, /\*\*ژست‌های قطع‌شده\*\*/);
  });

  it('keeps audit score-table dimensions aligned with their numbered sections', () => {
    // Persian numerals in the section headings; the score table kept Latin
    // digits. Normalize so both sides compare on the same numbering.
    const faDigits = { '۱': '1', '۲': '2', '۳': '3', '۴': '4', '۵': '5' };
    for (const filename of ['audit.md', 'audit.native.md']) {
      const audit = readFileSync(join(ROOT, `skill/reference/${filename}`), 'utf-8')
        .replace(/\r\n?/g, '\n')
        .replace(/[۱۲۳۴۵]/g, (d) => faDigits[d]);
      const sections = [...audit.matchAll(/^### ([1-5])\. (.+?)(?: \([^\n]+\))?$/gm)].map((match) => [
        match[1],
        match[2],
      ]);
      const scores = [...audit.matchAll(/^\| ([1-5]) \| ([^|]+?) \|/gm)].map((match) => [
        match[1],
        match[2].trim(),
      ]);

      assert.deepEqual(scores, sections, filename);
    }
  });
});

describe('mode rule files', () => {
  it('each shipped mode file has exactly the Directions and Comps sections the engine prints', () => {
    // The headings stay English on purpose: the engine extracts these two
    // sections by name (crates/context/src/concept_seed.rs). See GLOSSARY.md §3.
    for (const mode of ['persuade', 'operate', 'read']) {
      const text = readFileSync(join(ROOT, `skill/reference/mode-${mode}.md`), 'utf-8').replace(/\r\n?/g, '\n');
      const headings = text.split('\n').filter((line) => line.startsWith('## '));
      assert.deepEqual(headings, ['## Directions', '## Comps'], `mode-${mode}.md`);
      for (const section of text.split(/^## (?:Directions|Comps)\n/m).slice(1)) {
        assert.ok(section.trim().length > 200, `mode-${mode}.md has an empty or stub section`);
      }
    }
  });
});
