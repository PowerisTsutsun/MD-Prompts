# Master-UI v3 — portable edition

Bootstrap prompt for high-craft, motion-heavy UI builds in any coding agent: OpenAI Codex CLI, GPT-5-class models via the API, Cursor, Windsurf, Aider, Copilot Agent, Gemini CLI, or plain ChatGPT with the files pasted in.

**Why this file is self-contained:** the original version loaded two Anthropic Skills (`frontend-design` + `impeccable`) from `~/.claude/skills/`. No other harness has a skill system, so this edition carries the design layer inline — Part 3 (directions), Part 4 (motion), Part 6 (standing rules), and Appendix A (the audit checklist that replaces `impeccable audit`). Nothing to install for the design layer; it's the prompt itself.

**What changed from v2 and why:** v2 stacked four overlapping design skills (they average each other into generic output), enforced 50+ prohibitions with no positive direction (the model just picks the next-most-average design that breaks no rules), and assumed a reusable prompt could replace a project brief (it can't — specificity is the input, not the scaffolding). v3 fixes all three: a lean stack, a mandatory brief, named aesthetic directions you pick from, and a motion playbook that says what TO do.

---

## Part 0: How to load this prompt

| Harness | How |
|---|---|
| **OpenAI Codex CLI** | Save as `AGENTS.md` in the repo root, or `~/.codex/prompts/master-ui.md` to invoke as `/master-ui` |
| **Cursor / Windsurf** | `.cursor/rules/master-ui.mdc` (or Windsurf rules dir), or paste into the chat |
| **GPT-5-class via API** | Pass Parts 2–6 as the system prompt; keep the brief in the first user message |
| **Aider / Copilot Agent / Gemini CLI** | `AGENTS.md` in repo root — all three read it |
| **ChatGPT (no repo access)** | Paste the file, then paste your brief. Phases 0 and 5 degrade — see Part 5 |

Set reasoning effort to **high** if your harness exposes it. This prompt asks for a lot of held context across gated phases; low-effort settings skip gates.

---

## Part 1: Install (lean stack)

Design layer = this file. So: one browser tool, one animation library.

```bash
# Preconditions
node --version    # 18+
git --version
```

### 1. Browser automation (needed for Phase 0 scraping + Phase 5 verification)

**Option A — Playwright MCP** (best; works in any MCP-capable harness).

Codex CLI — add to `~/.codex/config.toml`:

```toml
[mcp_servers.playwright]
command = "npx"
args = ["-y", "@playwright/mcp@latest"]
```

Cursor / Windsurf / most MCP clients — add to `.cursor/mcp.json` (or the equivalent):

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

**Option B — Playwright as a plain script** (no MCP support needed; works in ANY agent with shell access):

```bash
npm install -D playwright && npx playwright install chromium
```

Then the agent writes and runs throwaway scripts for the same jobs:

```js
// scripts/shot.mjs — screenshot + extract computed values
import { chromium } from 'playwright';
const [url, out] = process.argv.slice(2);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: 'networkidle' });
await p.screenshot({ path: out, fullPage: true });
console.log(await p.evaluate(() => {
  const el = document.querySelector('h1'); const s = getComputedStyle(el);
  return { font: s.fontFamily, size: s.fontSize, lh: s.lineHeight, ls: s.letterSpacing, color: s.color };
}));
await b.close();
```

Run: `node scripts/shot.mjs https://linear.app design-references/linear.png`

Option B is the portable default. Use it whenever MCP is unavailable or unreliable.

### 2. Per-project: animation library

```bash
npm install motion        # Motion (Framer Motion successor) — React
# or for vanilla/scroll-driven work:
npm install gsap          # GSAP + ScrollTrigger
```

Default: `motion` for React projects, GSAP when the project is vanilla JS or scroll-choreography-heavy.

### 3. Verify

```bash
ls design-references/ 2>/dev/null || mkdir -p design-references
node -e "require('playwright'); console.log('playwright OK')"   # Option B only
```

If using MCP, restart the harness and confirm the Playwright tools appear in its tool list.

---

## Part 2: The Project Brief (mandatory — refuse to build without it)

**This is the part v2 was missing.** A reusable prompt cannot contain the 100 small decisions that make a site feel designed. Those come from the brief. **Agent: if the user asks for a build and any field below is blank, ask for it or propose a specific answer and get confirmation. Do not start coding with an empty brief.**

```
PROJECT BRIEF
─────────────
1. Subject:        What is this site actually for? (product, person, event — be concrete)
2. Audience:       Who lands on it and what should they feel in the first 3 seconds?
3. One job:        The single action the page exists to drive.
4. Direction:      Pick ONE from Part 3 (or describe your own in 2 sentences).
5. Reference:      ONE site from the library whose feel we're chasing. One. Not five.
6. Real copy:      Paste actual headline + 2-3 sentences of real content.
                   (No lorem ipsum — placeholder copy produces placeholder design.)
7. Motion level:   ambient / lively / theatrical  (see Part 4)
8. Signature:      Optional — one element this page should be remembered by.
                   If blank, the agent proposes one in the direction doc.
```

A filled brief like *"Portfolio for a card-game web app dev, audience = potential clients, job = contact me, direction = Dark Stage, reference = ui.aceternity.com, motion = theatrical"* will beat any amount of standing rules with no brief.

---

## Part 3: Aesthetic Directions (pick one — never blend)

Each direction is a complete, opinionated package: type logic, color logic, motion character, and 2–3 reference sites to scrape. Picking one gives the model a specific target instead of an average. **Blending directions is how you get back to slop.**

### A. Dark Stage
Theatrical dark UI where motion is the brand. Near-black canvas (not #000 — tint it: `#0A0A0F` blue-black or `#0F0A0A` warm-black), one electric accent used sparingly, glow used on the accent only.
- **Type:** condensed or wide grotesque display (Clash Display, Space Grotesk, Archivo Expanded) + neutral body
- **Motion:** entrance choreography, scroll-driven reveals, cursor-reactive elements
- **Scrape:** ui.aceternity.com, magicui.design, linear.app
- **Best for:** dev tools, portfolios, anything "launch-y"

### B. Editorial Print
Magazine logic on the web. Light background tinted toward brand hue, oversized serif display, asymmetric multi-column grids, hairline rules that encode real structure.
- **Type:** high-contrast serif display (Fraunces, Canela-alikes, Instrument Serif) + humanist sans body
- **Motion:** restrained but precise — text mask reveals, image parallax at 0.9–0.95 ratio, slow underline draws
- **Scrape:** httpster.net picks, godly.website (filter: editorial), stripe.com/docs for hierarchy
- **Best for:** content sites, studios, anything with real writing

### C. Soft Industrial
Light technical UI — warm or cool grays tinted toward brand, visible grid, mono accents for data, generous whitespace, borders over shadows.
- **Type:** clean grotesque display tracked tight + mono for labels/data (Geist + Geist Mono, or Söhne-alikes)
- **Motion:** micro-interactions everywhere, almost no large movement — hover states, number tickers, subtle border glows
- **Scrape:** vercel.com/design, originui.com, primer.style
- **Best for:** SaaS dashboards, dev tooling, B2B

### D. Playful Dimensional
Saturated color, soft 3D depth (layered shadows, not glassmorphism), rounded geometry, springy physics on everything.
- **Type:** rounded or chunky display (Bricolage Grotesque, Gambetta, Clash Grotesk) + friendly body
- **Motion:** spring-based, overshoot allowed HERE (the one direction where bounce is correct), draggable elements, hover scale
- **Scrape:** cuicui.day, kokonutui.com, godly.website (filter: playful)
- **Best for:** consumer apps, games, creative tools — your Omi app would live here

### E. Brutalist Signal
Raw, loud, high-contrast. System-breaking layouts, huge type, exposed structure, deliberate "wrongness" executed with total precision.
- **Type:** one enormous display face doing all the work + tiny utility mono
- **Motion:** hard cuts and snaps over eases, marquees, hover inversions, instant state changes as a style
- **Scrape:** godly.website (filter: brutalist), httpster.net
- **Best for:** events, drops, statements — high risk, use deliberately

> **Agent:** the brief's direction wins over your defaults. Known AI-default looks to avoid spending free choices on: cream + serif + terracotta; near-black + single acid-green accent; broadsheet hairlines + zero radius. If the chosen direction legitimately calls for one of these elements, execute it — but the rest of the design must be derived from the brief's subject, not the template.

---

## Part 4: Motion Playbook (what TO do)

The user wants animated sites. Here's the positive spec, by intensity level from the brief.

### Motion levels

| Level | Page load | Scroll | Hover | Ambient |
|---|---|---|---|---|
| **ambient** | single fade-up of hero | reveals on sections only | subtle (opacity/border) | none |
| **lively** | 3–5 element choreography | reveals + one parallax layer | scale/color/icon nudges | one slow background element |
| **theatrical** | full orchestrated sequence | scroll-driven scenes, pinning | cursor-reactive, magnetic buttons | gradient drift, particles, marquee |

### The five recipes (use per level above)

**1. Entrance choreography (page load).** Stagger the hero's elements in a deliberate order: backdrop → headline (masked rise or per-word stagger, 40–60ms/word) → subhead → CTA → peripheral nav. Total sequence under 1200ms. One sequence per page — interior sections use scroll reveals, not load animations.

```jsx
// motion/react — orchestrated hero
const container = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rise = {
  hidden: { y: 24, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};
```

**2. Scroll reveals.** Fire once at ~20% viewport entry. Vary the reveal per content type — text rises, images scale from 1.04→1 with a clip reveal, cards stagger 60–80ms. Never the same fade-up on everything; uniform reveals read as templated.

```jsx
<motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
```

**3. Hover micro-interactions.** Every interactive element gets a designed hover, not a default one. Buttons: background shift + icon nudge (translateX 2–4px) or magnetic pull at theatrical level. Cards: lift 2–4px + shadow deepen + inner image scale 1.03. Links: underline draw (scaleX transform, transform-origin left). 150–250ms, ease-out.

**4. The signature moment.** One scroll-driven set piece per page that nothing else competes with: a pinned section where content swaps as you scroll, a number ticker counting up, an SVG path drawing itself, a horizontal-scroll gallery, text that fills with color as it passes center. This is where the "wow" budget goes — concentrated, not sprinkled.

**5. Ambient life (theatrical only).** A slow gradient drift (20s+ loop), a marquee of logos/keywords (pause on hover), or a subtle grain/particle layer at low opacity. One ambient element max — two reads as noise.

### Motion physics rules

- Easing: ease-out exponentials for entrances (`cubic-bezier(0.22, 1, 0.36, 1)` is the workhorse), ease-in-out for loops. Springs (`type: "spring", stiffness: 300, damping: 24`) for Playful Dimensional only.
- Micro: 150–250ms. Component: 250–400ms. Scene/page: 400–800ms.
- Stagger lists 50–80ms per item, cap visible stagger at ~6 items.
- Animate `transform` and `opacity` only; never animate layout properties on scroll.
- `prefers-reduced-motion`: every effect degrades to instant or simple fade. Non-negotiable, wired from the start, not retrofitted.

---

## Part 5: Workflow (hard gates — proof required at each)

**Agent: each phase ends with a deliverable shown to the user. Do not proceed past a gate without showing the deliverable.** If a phase gets skipped or compressed, the build restarts at the skipped phase.

### Phase 0 — References (gate: direction doc)
Scrape the ONE reference site from the brief plus 1–2 from the chosen direction's list using Playwright (MCP, or the Option B script):
- Full-page screenshot at 1440px, saved to `design-references/`
- Extract computed values from key elements via `getComputedStyle` in the page context: exact font stacks, sizes, line-heights, letter-spacing; spacing values; hex colors; shadow definitions; transition durations and easings
- Screenshot hover/focus states by triggering them

Then write a one-page direction doc containing: the brief restated, extracted values (real numbers, not vibes), the type pairing with load source, palette as named hexes, spacing scale, motion plan mapped to the level + recipes from Part 4, and the proposed signature element. **The doc must cite extracted values. A direction doc with no real numbers in it is fake — redo it.** STOP for approval.

### Phase 1 — Tokens (gate: tokens file)
One file (`lib/design-tokens.ts` or `tokens.css`) derived entirely from the approved direction doc: color (primitive + semantic layers), type scale, spacing scale, radii, shadows, motion durations/easings, breakpoints. Feeds Tailwind config and CSS variables. Show it. STOP for approval.

### Phase 2 — First section (gate: screenshot)
Build ONLY the hero + nav, with full motion (entrance choreography per the level). Screenshot it at 1440px via Playwright next to the reference screenshot. STOP — this is the cheapest point to course-correct. The user names what's off; fix before scaling.

### Phase 3 — Full build
Scale to remaining sections using approved tokens and patterns. Every value from the token file — a magic number in component code is a defect. Scroll reveals per Part 4, varied by content type. Build the signature moment.

### Phase 4 — Audit (Appendix A)
Run the **Appendix A checklist** against the build — every item, with file:line citations and PASS/FAIL per item. This is what replaces the `impeccable` skill from the Claude edition: the checklist *is* the audit. **Apply** the top 5 fixes, re-run to confirm. Remaining FAILs documented with reasons.

### Phase 5 — Visual verification (Playwright)

> **No browser access** (ChatGPT web, or any harness without shell or MCP)? This phase cannot be self-certified. Output an explicit manual test script for the user — exact URLs, viewports, which elements to hover and focus, and what correct looks like for each — and state plainly that the build is **UNVERIFIED** until a human runs it. Never substitute code-reading for this phase.

- Screenshot 1440 / 768 / 375, full page
- Trigger and screenshot hover, focus-visible, and active states on primary interactive elements
- Record or step through the entrance choreography and signature moment
- Side-by-side against the reference screenshot — comparable quality or iterate
- Zero console errors; run an axe pass for accessibility violations

**Done = all of Phase 5 passes.** Never claim done from reading code.

---

## Part 6: Standing rules (condensed)

The short list that survives from v2 — framed as defaults to execute, not just sins to avoid.

**Type.** Distinctive display face per the direction (never Inter/Roboto/system-ui for display), readable body face, ≥1.25 scale ratio, display tracked -0.02 to -0.04em, small UI tracked +0.01em, prose at 65–75ch.

**Color.** Neutrals tinted toward brand hue. Dark mode = desaturated palette + borders over shadows, not inverted lightness. Accent does the glowing; nothing else does.

**Layout.** Hierarchy decides alignment — asymmetric when content supports it. Cards only when they're the right affordance; never nested. Sections breathe: 80–120px vertical between major sections desktop, 48–64px mobile.

**States.** Hover, active, focus-visible, disabled designed on every interactive element. Focus is a visible ring, never `outline: none`. Loading states designed; empty states have direction + action. Hit targets ≥44px mobile.

**Copy.** Real words from the brief. Buttons are specific verbs ("Save changes", not "Submit"). Errors say what to do next. No "Welcome to your dashboard!", no exclamation-mark enthusiasm.

**Accessibility.** WCAG AA (4.5:1 body, 3:1 UI), aria-labels on icon buttons, labeled inputs, color never the sole state indicator, logical tab order, reduced-motion respected.

**Hygiene.** Tokens in one file. Semantic HTML, headings in order. Icons from one library (lucide-react). No emoji as icons.

**Permissions.** Apply these rules without asking. DO ask before: adding dependencies, deleting files, migrations, commits. If a rule conflicts with the brief, the brief wins — flag it.

---

## Part 7: Reference library (trimmed, mapped)

| Use | Sites |
|---|---|
| Motion-heavy components | ui.aceternity.com · magicui.design · hover.dev |
| Clean components | ui.shadcn.com · originui.com · 21st.dev |
| Design systems (tokens) | vercel.com/design · linear.app · primer.style |
| Playful | cuicui.day · kokonutui.com |
| Aesthetic browsing | godly.website (filter by industry) · httpster.net |
| Motion timing | easings.net · animista.net |

Scraping etiquette: 500ms–1s between navigations; cache screenshots locally; some sites block headless — fall back to `--headless=false`.

---

## Troubleshooting

- **Design layer ignored:** it's inline in this file, so there is nothing to load — the cause is context loss. Re-paste Parts 3, 4 and 6 before the phase that needs them, or move them into `AGENTS.md` so they reload every turn.
- **Playwright MCP down:** validate the MCP config syntax (`config.toml` for Codex, `mcp.json` for Cursor), restart the harness, check its logs — then fall back to Option B, which needs no MCP at all.
- **Agent blows through gates:** raise reasoning effort to high, and feed one phase's section at a time instead of the whole file. Weaker models compress multi-phase instructions into a single pass.
- **Output still looks generic:** the brief was too thin. Go back to Part 2 — name a more specific reference, paste real copy, pick a sharper direction. Generic in, generic out; no install step fixes that.

## Appendix A: Audit checklist (Phase 4)

This replaces the `impeccable` skill the Claude edition invoked. Run it as a real pass, not a vibe check: **every line below gets an explicit PASS or FAIL with a `file:line` citation.** A FAIL with no citation is not a finding; a PASS with no citation is not an audit.

Report format, one row per item:

```
[PASS|FAIL] A1.3  src/components/Hero.tsx:42  — display face is Inter, direction calls for a grotesque display
```

**A1 — Type**
1. Display face is distinctive and matches the chosen direction (never Inter/Roboto/system-ui for display)
2. Body face is readable at 16px+ and pairs deliberately with the display face
3. Type scale ratio ≥1.25 and every size in use comes from it
4. Display tracking -0.02 to -0.04em; small UI text +0.01em
5. Prose measure lands at 65–75ch

**A2 — Color**
1. Neutrals are tinted toward the brand hue, not pure grays
2. Dark mode desaturates and uses borders over shadows — not inverted lightness
3. The accent is the only element that glows
4. Contrast: 4.5:1 body, 3:1 UI — checked, not assumed
5. Color is never the sole indicator of state

**A3 — Layout & spacing**
1. Every spacing value traces to the token file — no magic numbers in component code
2. Major section rhythm 80–120px desktop / 48–64px mobile
3. Alignment follows hierarchy; asymmetry is intentional where used
4. No nested cards; cards used only where they're the right affordance
5. Layout holds at 1440 / 768 / 375 with no horizontal overflow

**A4 — States**
1. Hover, active, focus-visible and disabled designed on every interactive element
2. Focus is a visible ring — zero instances of `outline: none` without a replacement
3. Loading states designed; empty states carry direction plus an action
4. Hit targets ≥44px on mobile
5. Error states say what to do next

**A5 — Motion**
1. Motion level matches the brief (ambient / lively / theatrical)
2. Only `transform` and `opacity` animate; no layout properties animated on scroll
3. Durations in band: micro 150–250ms, component 250–400ms, scene 400–800ms
4. Reveals vary by content type — not one fade-up applied everywhere
5. Exactly one signature moment, and one ambient element at most
6. `prefers-reduced-motion` degrades every effect to instant or a simple fade

**A6 — Accessibility**
1. Semantic HTML; headings in order with no skipped levels
2. Icon-only buttons carry `aria-label`; every input has a real label
3. Tab order is logical; no keyboard traps
4. Images have meaningful `alt` (or `alt=""` when decorative)
5. An automated pass (axe or equivalent) reports zero violations

**A7 — Hygiene**
1. Tokens live in exactly one file
2. Icons come from one library; no emoji used as icons
3. Copy is real, from the brief — no lorem ipsum, no "Welcome to your dashboard!"
4. Console is clean at runtime — zero errors, zero warnings
5. No dead CSS, unused imports, or commented-out blocks left behind

---

## Version history

- **v3.0-portable** (current): harness-agnostic — the two skills inlined as Parts 3/4/6 + Appendix A, MCP config for Codex/Cursor plus a no-MCP Playwright fallback, Part 0 loading table, explicit no-browser degradation path
- **v3.0**: Lean 2-skill stack, mandatory project brief, five named aesthetic directions, positive motion playbook with code, hard-gated phases with proof requirements
- **v2.0**: Four skills + reference scraping + prohibition-style ground rules
- **v1.0**: Initial setup
