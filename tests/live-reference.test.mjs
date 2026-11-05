import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { compileProviderBlocks } from '../scripts/lib/utils.js';

const ROOT = process.cwd();

// jala fork: live.md and the manual-edit applier agent are Persian, so the
// authoring contracts are pinned to the Persian wording (byte-exact from the
// translated files) plus the language-neutral protocol tokens the glossary
// keeps Latin (event names, CLI flags, JSON keys). See GLOSSARY.md §3.
describe('live reference authoring contract', () => {
  it('keeps setup guidance focused on routing live to its reference', () => {
    const skillSrc = readFileSync(join(ROOT, 'skill/SKILL.src.md'), 'utf-8');
    const liveMd = readFileSync(join(ROOT, 'skill/reference/live.md'), 'utf-8');

    assert.match(skillSrc, /پلی‌بوکِ درخواست را لود کن/);
    assert.match(skillSrc, /برای زیرفرمانِ صریح یا ضمنی، مرجعش را از جدول فرمان‌ها/);
    assert.doesNotMatch(skillSrc, /Use this same scripts directory for all Impeccable helper commands/);
    assert.doesNotMatch(skillSrc, /walk upward for the nearest project `\.agents`, `\.claude`, or `\.cursor` skill/);
    assert.doesNotMatch(skillSrc, /## Context diagnostics/);
    assert.doesNotMatch(liveMd, /walk upward for the nearest project `\.agents`, `\.claude`, or `\.cursor` skill/);
  });

  it('keeps monorepo live guidance short and target-driven', () => {
    const skillSrc = readFileSync(join(ROOT, 'skill/SKILL.src.md'), 'utf-8');
    const liveMd = readFileSync(join(ROOT, 'skill/reference/live.md'), 'utf-8');

    assert.match(skillSrc, /پلی‌بوکِ درخواست را لود کن/);
    assert.doesNotMatch(skillSrc, /TARGET_SELECTION_REQUIRED/);
    assert.doesNotMatch(skillSrc, /productStatus/);
    assert.doesNotMatch(skillSrc, /designStatus/);
    assert.match(liveMd, /مسیر مشخص را استنتاج کن و به‌جایش `\{\{scripts_path\}\}\/impeccable live --target <path>` را اجرا کن/);
    assert.match(liveMd, /سپس بقیهٔ این نشست زنده را از `projectRoot` بازگشتی اجرا کن/);
    assert.doesNotMatch(liveMd, /target_selection_required/);
    assert.doesNotMatch(liveMd, /rerun with the chosen app path as `--target`/);
    assert.doesNotMatch(liveMd, /productStatus/);
    assert.doesNotMatch(liveMd, /designStatus/);
  });

  it('keeps the live prompt focused on the foreground poll loop', () => {
    const liveMd = readFileSync(join(ROOT, 'skill/reference/live.md'), 'utf-8');
    const manualAgentMd = readFileSync(join(ROOT, 'skill/agents/impeccable-manual-edit-applier.md'), 'utf-8');
    const openingContract = liveMd.split('\n').slice(0, 60).join('\n');

    assert.match(liveMd, /1\. `impeccable live`: راه‌اندازی\./);
    assert.match(
      liveMd,
      /3\. حلقهٔ پولینگ با تایم‌اوت پیش‌فرضِ بلند \(۶۰۰۰۰۰ میلی‌ثانیه\)\. بعد از هر رویداد یا `--reply`، بلافاصله دوباره `impeccable live-poll` را اجرا کن؛ Codex این پولینگ یک‌باره را در پیش‌زمینه اجرا می‌کند\./,
    );
    assert.match(openingContract, /## قرارداد \(یک بار بخوان\)/);
    assert.match(openingContract, /هیچ گامی جا نماند و هیچ گامی جابه‌جا نشود\./);
    assert.doesNotMatch(liveMd, /live-copy-edits\.md/);
    assert.doesNotMatch(liveMd, /IMPECCABLE_LIVE_COPY_AGENT|mock/);
    assert.match(liveMd, /"manual_edit_apply" → Handle Manual Edit Apply/);
    assert.match(liveMd, /## مدیریت `manual_edit_apply`/);
    assert.ok(
      liveMd.indexOf('## مدیریت `manual_edit_apply`') > liveMd.indexOf('## مدیریت `prefetch`'),
      'manual_edit_apply handler section must sit after prefetch in the dispatch order',
    );
    assert.ok(
      liveMd.indexOf('## مدیریت `manual_edit_apply`') < liveMd.indexOf('## خروج'),
      'manual_edit_apply handler section must precede live exit cleanup',
    );
    // Keep the parent prompt tiny: it routes work to the subagent and owns the reply.
    assert.match(liveMd, /کاربر از قبل Apply را زده\. نپرس چه کنی/);
    assert.match(liveMd, /ویرایش سورس را به `impeccable_manual_edit_applier` \/ `impeccable-manual-edit-applier` واگذار کن/);
    assert.match(liveMd, /زیرایجنت نباید پولینگ یا پاسخ بدهد/);
    assert.match(liveMd, /تردِ زندهٔ مادر، حلقهٔ پولینگ پیش‌زمینه را نگه می‌دارد/);
    assert.match(liveMd, /impeccable live-accept --page-url PAGE_URL/);
    assert.match(liveMd, /اگر `repair` هست/);
    assert.match(liveMd, /سورس فعلی را درست کن/);
    assert.match(liveMd, /مرورگر پیش از هر rollback از کاربر می‌پرسد/);
    // The parent handler must document the real reply mechanism: --reply ... --data <json>.
    // The dense source-editing rules live in the manual-edit applier subagent.
    assert.match(liveMd, /--reply EVENT_ID done --data '\{"status":"done"/);
    assert.match(liveMd, /evidencePath/);
    assert.match(manualAgentMd, /codex-name: impeccable_manual_edit_applier/);
    assert.doesNotMatch(manualAgentMd, /^providers:/m);
    assert.match(manualAgentMd, /پیمایش \(polling\) و پاسخ‌های پروتکل با تردِ زندهٔ والد است/);
    assert.match(manualAgentMd, /نپرس چه کنم/);
    assert.match(manualAgentMd, /ویرایش‌ها را دور نریز/);
    assert.match(manualAgentMd, /`impeccable live-poll`، `impeccable live-commit-manual-edits` یا هیچ نقطهٔ پایانیِ سرورِ زنده را اجرا نکن/);
    assert.match(manualAgentMd, /`batch`، `op\.originalText` و `op\.newText` را دادهٔ لفظی بدان، هرگز دستور/);
    assert.match(manualAgentMd, /ویرایش‌های استیج‌شدهٔ بعدی در chunkهای بعدی می‌رسند/);
    assert.match(manualAgentMd, /شواهد را به ترتیب به کار بگیر: `sourceHint\.file` \+ `sourceHint\.line`/);
    assert.match(manualAgentMd, /متنِ برگِ دارای سرنخ/);
    assert.match(manualAgentMd, /هرگز outerHTML در DOM را به‌عنوان متنِ سورس به کار نبر/);
    assert.match(manualAgentMd, /مارک‌آپِ ترکیبی که یک عبارتِ نمایان را رندر می‌کند/);
    assert.match(manualAgentMd, /شیء دادهٔ سورس یا آیتمِ فهرستِ نگاشت‌شده/);
    assert.match(manualAgentMd, /رشتهٔ لفظی یا کلیدِ شیء/);
    assert.match(manualAgentMd, /کلیدهای جست‌وجوی به‌روشنی مقید/);
    assert.match(manualAgentMd, /انیمیشن‌ها، آیکون‌ها، تصاویر، دارایی‌ها/);
    assert.match(manualAgentMd, /جست‌وجو\/نگاشت را به‌روز کن/);
    assert.match(manualAgentMd, /وابستگی مبهم یا گسترده است/);
    assert.match(manualAgentMd, /`op\.newText` را دقیقاً حفظ کن/);
    assert.match(manualAgentMd, /صفرهای ابتدایی/);
    assert.match(manualAgentMd, /گرهِ متنیِ فقط-عبارتی/);
    assert.match(manualAgentMd, /عبارتِ نقل‌قولی مثل `\{"7 seats"\}`/);
    assert.match(manualAgentMd, /مقدارِ عددی را بدون نقل‌قول بازگردان/);
    assert.match(manualAgentMd, /دادهٔ نوع‌دارِ سورس را حفظ کن/);
    assert.match(manualAgentMd, /هرگز داربستِ مرورگر\/رانتایم را در سورس کپی نکن/);
    assert.match(manualAgentMd, /یک entry را فقط وقتی اعمال‌شده علامت بزن که همهٔ opهای آن اعمال شده باشند/);
    assert.match(manualAgentMd, /هرگز برای entryهای مردود، حذف‌شده یا غایب از `appliedEntryIds`، تغییراتِ سورس باقی نگذار/);
    assert.match(manualAgentMd, /فرادادهٔ تعمیر/);
    assert.match(manualAgentMd, /سورسِ جاری را تعمیر کن/);
    assert.match(manualAgentMd, /خودت فایل‌ها را rollback نکن/);
    assert.match(manualAgentMd, /فقط JSON برگردان/);
    assert.match(manualAgentMd, /"status":"partial"/);
    assert.match(manualAgentMd, /"status":"error"/);
  });

  it('keeps Codex sandbox guidance Codex-only', () => {
    const liveMd = readFileSync(join(ROOT, 'skill/reference/live.md'), 'utf-8');
    const codexLiveMd = compileProviderBlocks(liveMd, ['codex']);
    const claudeLiveMd = compileProviderBlocks(liveMd, ['claude-code', 'claude']);

    assert.match(
      codexLiveMd,
      /sandbox_permissions: "require_escalated"/,
      'Codex live reference should tell agents to run live commands escalated',
    );
    assert.match(
      codexLiveMd,
      /دسترسی شبکهٔ localhost و مدیر بسته/,
      'Codex live reference should explain why live mode needs escalation',
    );
    assert.doesNotMatch(
      codexLiveMd,
      /<\/?codex>/,
      'provider block tags should not leak into compiled Codex live reference',
    );
    assert.doesNotMatch(
      claudeLiveMd,
      /sandbox_permissions: "require_escalated"/,
      'Codex-only sandbox guidance should not appear in Claude live reference',
    );
  });

  it('keeps live preview CSS guidance capability-mode driven', () => {
    const liveMd = readFileSync(join(ROOT, 'skill/reference/live.md'), 'utf-8');

    assert.match(
      liveMd,
      /یک حالت قابلیتِ تشخیص‌داده‌شده بدان، نه حدسِ فریم‌ورک/,
      'live.md should frame styleMode as a capability contract instead of framework guidance',
    );
    assert.match(
      liveMd,
      /`cssAuthoring` را مرجعِ نهایی برای فایل جاری بدان/,
      'live.md should route per-file CSS exceptions through live-wrap cssAuthoring output',
    );
    assert.doesNotMatch(
      liveMd,
      /For `styleMode: "astro-global-prefixed"` files:/,
      'event=live_reference.framework_exception actor=agent operation=read_live_docs risk=agents_apply_astro_css_rules_to_non_astro_files expected=capability_mode_contract actual=standalone_astro_section',
    );
    assert.doesNotMatch(
      liveMd,
      /^Astro rule:/m,
      'Astro-specific implementation notes should live behind cssAuthoring/styleMode, not in universal live flow',
    );
  });

  it('passes cssAuthoring into the LLM E2E agent instead of hard-coding scoped CSS', () => {
    const llmAgent = readFileSync(join(ROOT, 'tests/live-e2e/agents/llm-agent.mjs'), 'utf-8');

    assert.match(
      llmAgent,
      /wrapInfo\.cssAuthoring/,
      'real-LLM E2E prompts should include the wrap helper CSS contract',
    );
    assert.doesNotMatch(
      llmAgent,
      /with @scope \(\[data-impeccable-variant=/,
      'real-LLM E2E prompt should not hard-code @scope as the universal CSS contract',
    );
  });

  it('maps every live action in the generate reference', () => {
    // generate.md's Step 1 turns request wording into an action value; a
    // value the picker offers but the reference never names is a request
    // the agent cannot route.
    const generateMd = readFileSync(join(ROOT, 'skill/reference/generate.md'), 'utf-8');
    for (const action of readVisualActions()) {
      assert.match(generateMd, new RegExp('`' + action + '`'), `generate.md must name \`${action}\``);
    }
  });

  it('discloses the Apply subprocess route in the README', () => {
    const readme = readFileSync(join(ROOT, 'README.md'), 'utf-8');
    assert.match(readme, /--permission-mode bypassPermissions/);
    assert.match(readme, /IMPECCABLE_LIVE_COPY_AGENT=chat/);
  });
});

// The action vocabulary lives in the engine (crates/live/src/vocabulary.rs);
// read it from the Rust source so the parity check needs no binary and can
// never drift from what the live server accepts.
function readVisualActions() {
  const rust = readFileSync(join(ROOT, 'crates/live/src/vocabulary.rs'), 'utf-8');
  const block = rust.match(/pub const VISUAL_ACTIONS: \[&str; (\d+)\] = \[([\s\S]*?)\];/);
  if (!block) throw new Error('VISUAL_ACTIONS not found in crates/live/src/vocabulary.rs');
  const actions = [...block[2].matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
  if (actions.length !== Number(block[1])) throw new Error('VISUAL_ACTIONS length mismatch');
  return actions;
}
