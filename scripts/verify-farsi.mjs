#!/usr/bin/env node
// Cross-platform twin of scripts/verify-farsi.ps1 (the PowerShell original
// needs pwsh, which macOS/Linux contributors usually lack). Runs the same
// static gates over the jala Persian fork:
//   1. rule markers (<!-- rule:... -->) preserved versus HEAD
//   2. code-fence count preserved versus HEAD
//   3. heading count preserved versus HEAD
//   4. {{placeholder}} occurrences never fewer than HEAD
//   5. at least 50 Persian characters per file (a file left English fails)
//   6. no leftover {{command_prefix}}impeccable (the one mechanical rename
//      the glossary allows must have been applied everywhere)
// Usage: node scripts/verify-farsi.mjs [--quiet]
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const quiet = process.argv.includes('--quiet');
process.chdir(ROOT);

const files = [
  ...fs.readdirSync('skill/reference').filter((f) => f.endsWith('.md')).map((f) => `skill/reference/${f}`),
  ...fs.readdirSync('skill/agents').filter((f) => f.endsWith('.md')).map((f) => `skill/agents/${f}`),
  'skill/SKILL.src.md',
];

const count = (text, re) => (text.match(re) || []).length;
const rows = [];
const problems = [];

for (const rel of files) {
  const cur = fs.readFileSync(rel, 'utf8');
  let head = '';
  try {
    head = execFileSync('git', ['show', `HEAD:${rel}`], { encoding: 'utf8', maxBuffer: 10e6 });
  } catch {
    rows.push(`NEW          ${rel}`);
    continue;
  }

  const checks = [
    ['rule markers', count(head, /<!-- rule:/g), count(cur, /<!-- rule:/g)],
    ['code fences', count(head, /^```/gm), count(cur, /^```/gm)],
    ['headings', count(head, /^#{1,6} /gm), count(cur, /^#{1,6} /gm)],
  ];
  for (const [name, before, after] of checks) {
    if (before !== after) problems.push(`${rel}: ${name} ${before} -> ${after}`);
  }

  // Every {{placeholder}} present at HEAD must survive translation; a smaller
  // count means the translator dropped a template token mid-sentence.
  for (const ph of new Set(head.match(/\{\{[a-z_]+\}\}/g) || [])) {
    const escaped = ph.replace(/[{}]/g, (m) => `\\${m}`);
    const before = count(head, new RegExp(escaped, 'g'));
    const after = count(cur, new RegExp(escaped, 'g'));
    if (before > after) problems.push(`${rel}: placeholder lost ${ph} ${before} -> ${after}`);
  }

  const faCount = count(cur, /[\u0600-\u06FF]/g);
  if (faCount < 50) problems.push(`${rel}: only ${faCount} Persian chars (NOT-FA)`);
  if (cur.includes('{{command_prefix}}impeccable')) problems.push(`${rel}: leftover {{command_prefix}}impeccable`);

  if (!quiet) rows.push(`${problems.some((p) => p.startsWith(`${rel}:`)) ? 'PROBLEM' : 'OK'}          ${rel}`);
}

if (!quiet) {
  console.log(rows.join('\n'));
  console.log('');
}

if (problems.length === 0) {
  console.log('ALL CHECKS PASSED');
} else {
  console.log(`PROBLEMS (${problems.length}):`);
  for (const p of problems) console.log(` - ${p}`);
  process.exitCode = 1;
}
