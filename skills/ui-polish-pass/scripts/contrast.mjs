#!/usr/bin/env node
// WCAG 2.1 contrast ratio calculator. No dependencies.
//
//   node contrast.mjs "#b2aca0" "#25211c"
//   node contrast.mjs "#b2aca0" "#25211c" "#15130f" "#1d1a15"   # one fg, many bg
//   node contrast.mjs --pairs pairs.json
//
// pairs.json: [{ "name": "ink-muted on elevated", "fg": "#b2aca0", "bg": "#25211c" }]
//
// Exit code 1 if any pair falls below its target, so it can gate a polish pass.

import { readFileSync } from 'node:fs';

const parseHex = (hex) => {
  const h = String(hex).trim().replace(/^#/, '');
  const full = h.length === 3 || h.length === 4 ? h.slice(0, 3).replace(/./g, (c) => c + c) : h.slice(0, 6);
  if (!/^[0-9a-fA-F]{6}$/.test(full)) throw new Error(`not a hex color: ${hex}`);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
};

const luminance = (hex) => {
  const [r, g, b] = parseHex(hex).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (fg, bg) => {
  const [hi, lo] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (hi + 0.05) / (lo + 0.05);
};

const grade = (r) => {
  if (r >= 7) return 'AAA body';
  if (r >= 4.5) return 'AA body';
  if (r >= 3) return 'AA large / UI only';
  return 'FAIL';
};

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('usage: contrast.mjs <fg> <bg> [...more bg]   |   contrast.mjs --pairs <file.json>');
  process.exit(2);
}

let pairs;
if (args[0] === '--pairs') {
  pairs = JSON.parse(readFileSync(args[1], 'utf8'));
} else {
  const [fg, ...bgs] = args;
  pairs = bgs.map((bg) => ({ name: `${fg} on ${bg}`, fg, bg }));
}

let failed = false;
for (const p of pairs) {
  const r = ratio(p.fg, p.bg);
  const target = p.target ?? 4.5;
  const ok = r >= target;
  if (!ok) failed = true;
  const label = p.name ?? `${p.fg} on ${p.bg}`;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2)}:1  (target ${target}:1, ${grade(r)})  ${label}`);
}

process.exit(failed ? 1 : 0);
