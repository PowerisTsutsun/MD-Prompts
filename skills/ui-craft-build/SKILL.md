---
name: ui-craft-build
description: >
  Build a NEW frontend surface — site, landing page, app shell, or major
  feature — to a high craft bar with deliberate motion. Use when starting a
  build from scratch or replacing a surface wholesale and the result has to
  look designed rather than generic: "build me a landing page", "animated
  portfolio", "hero that wows", "make this look incredible". Enforces a filled
  project brief, ONE named aesthetic direction, a token file, and gated phases
  where each gate needs a real artifact (extracted values, tokens, screenshots).
  For improving UI that already exists, use ui-site-glowup (whole site) or
  ui-polish-pass (targeted fix) instead.
---

# UI Craft Build — new surfaces, built to a bar

Generic output is not a taste failure, it is an input failure. A model with no
brief picks the statistical average of every site it has seen. This skill
replaces that average with three things the average cannot survive: a concrete
brief, one committed aesthetic direction, and gates that demand proof.

## Operating rules

1. **No build on a blank brief.** Part 1 must be filled before code. You may
   draft it yourself — see the fill protocol — but it exists before Phase 0.
2. **One direction, never blended.** Part 2. Mixing two directions returns you
   to the average you were trying to escape.
3. **Tokens before components.** Phase 1 output is the only place raw values
   live. A hex, px, or ms literal in component code after Phase 1 is a defect.
4. **Gates need artifacts.** Each phase ends with something the user can look
   at. Do not advance on a description of work — show the file or the
   screenshot. A skipped gate means the build restarts at that gate.
5. **State survives compaction.** Keep `.agent-ui/BRIEF.md`, `DIRECTION.md`,
   and `PROGRESS.md`; write `DESIGN.md` at repo root as the durable design
   source of truth (the same contract ui-site-glowup and ui-polish-pass read).
6. **Reduced motion from line one.** Wired as you build, never retrofitted.
7. Apply everything here without asking. DO ask before: adding dependencies,
   deleting files, migrations, commits. The brief beats these rules on
   conflict — flag the conflict when it happens.

## Preflight (capability check, ~30 seconds)

Detect, then degrade — never block the build on a missing optional tool.

| Capability | Detect | If missing |
|---|---|---|
| Playwright MCP | `mcp__playwright__*` tools present | Phase 0 cannot scrape. Build the direction doc from the direction's stated values in Part 2 plus the reference described in words. Say so out loud; Phase 5 falls back to reading rendered output. |
| `frontend-design` skill | `~/.claude/skills/frontend-design` | Proceed; this skill carries its own craft bar. |
| `impeccable` skill | `~/.claude/skills/impeccable` | Phase 4 uses the inline audit checklist instead. |
| Animation library | `motion` or `gsap` in package.json | Ask before installing. Default `motion` for React, `gsap` for vanilla or scroll-choreography-heavy work. CSS-only motion is a valid fallback at the *ambient* level. |

Install commands, including Windows-safe forms: `reference/install.md`.
Record what is available in `PROGRESS.md` so later phases stop re-checking.

**Never run two taste skills on one project.** `frontend-design`,
`impeccable`, `design-taste-frontend` and `ui-ux-pro-max` all hold opinions on
type, spacing and motion; stacked, they average each other out — the exact
failure this skill exists to prevent. One base skill, one audit skill, done.

---

## Part 1 — The Project Brief

```
PROJECT BRIEF
─────────────
1. Subject:        What is this actually for? (product, person, event — concrete)
2. Audience:       Who lands here, and what should they feel in 3 seconds?
3. One job:        The single action this surface exists to drive.
4. Direction:      ONE from Part 2, or your own in two sentences.
5. Reference:      ONE site whose feel we are chasing. One. Not five.
6. Real copy:      Actual headline + 2-3 sentences of real content.
                   Lorem ipsum produces lorem-ipsum design.
7. Motion level:   ambient / lively / theatrical (Part 3)
8. Signature:      One element this page should be remembered by.
                   Blank is fine — you propose one in the direction doc.
```

**Fill protocol.** Ask at most one round of questions, and only for fields you
genuinely cannot infer. For everything else, propose a specific answer and let
the user correct it. If the user says "just build it", write the whole brief
yourself from what they have already said, show it, and ask for a one-line
confirm. A brief you drafted and they approved is worth ten fields extracted by
interrogation. Save to `.agent-ui/BRIEF.md`.

A filled brief outperforms any amount of standing rules: *"Portfolio for a
card-game web dev; audience = potential clients; job = contact me; direction =
Dark Stage; reference = ui.aceternity.com; motion = theatrical."*

---

## Part 2 — Aesthetic directions (pick one)

Each is a complete package — type logic, color logic, motion character, and
sites worth scraping. Picking one gives a target instead of an average.

### A. Dark Stage
Theatrical dark UI where motion is the brand. Near-black canvas — never pure
black, tint it (`#0A0A0F` blue-black, `#0F0A0A` warm-black). One electric
accent used sparingly; glow belongs to the accent and nothing else.
- **Type:** condensed or wide grotesque display (Clash Display, Space Grotesk, Archivo Expanded) + neutral body
- **Motion:** entrance choreography, scroll-driven reveals, cursor-reactive elements
- **Scrape:** ui.aceternity.com · magicui.design · linear.app
- **Fits:** dev tools, portfolios, launches

### B. Editorial Print
Magazine logic on the web. Light ground tinted toward the brand hue, oversized
serif display, asymmetric multi-column grids, hairline rules that encode real
structure rather than decorate.
- **Type:** high-contrast serif display (Fraunces, Instrument Serif, Canela-alikes) + humanist sans body
- **Motion:** restrained and precise — text mask reveals, image parallax at 0.9-0.95, slow underline draws
- **Scrape:** httpster.net · godly.website (editorial filter) · stripe.com/docs for hierarchy
- **Fits:** content sites, studios, anything with real writing

### C. Soft Industrial
Light technical UI. Warm or cool grays tinted toward brand, visible grid, mono
for data and labels, generous whitespace, borders instead of shadows.
- **Type:** clean grotesque display tracked tight + mono for labels/data (Geist + Geist Mono, Söhne-alikes)
- **Motion:** micro-interactions everywhere, almost no large movement — hover states, number tickers, subtle border transitions
- **Scrape:** vercel.com/design · originui.com · primer.style
- **Fits:** SaaS dashboards, dev tooling, B2B

### D. Playful Dimensional
Saturated color, soft 3D depth from layered shadows (not glassmorphism),
rounded geometry, springy physics.
- **Type:** rounded or chunky display (Bricolage Grotesque, Gambetta, Clash Grotesk) + friendly body
- **Motion:** spring-based; overshoot is correct HERE and nowhere else. Draggable elements, hover scale
- **Scrape:** cuicui.day · kokonutui.com · godly.website (playful filter)
- **Fits:** consumer apps, games, creative tools

### E. Brutalist Signal
Raw, loud, high contrast. System-breaking layout, enormous type, exposed
structure — deliberate wrongness executed with total precision.
- **Type:** one enormous display face carrying the page + tiny utility mono
- **Motion:** hard cuts and snaps over eases, marquees, hover inversions, instant state change as a style
- **Scrape:** godly.website (brutalist filter) · httpster.net
- **Fits:** events, drops, statements. High risk — use deliberately.

**Known AI-default looks.** Do not spend a free choice on: cream + serif +
terracotta; near-black + one acid-green accent; broadsheet hairlines at zero
radius; purple-to-blue gradient on glass cards. If the chosen direction
genuinely calls for one of these, execute it — but derive the rest from the
brief's subject, not from the template.

---

## Part 3 — Motion playbook

| Level | Page load | Scroll | Hover | Ambient |
|---|---|---|---|---|
| **ambient** | single fade-up of hero | reveals on sections only | opacity/border shifts | none |
| **lively** | 3-5 element choreography | reveals + one parallax layer | scale/color/icon nudges | one slow background element |
| **theatrical** | full orchestrated sequence | scroll-driven scenes, pinning | cursor-reactive, magnetic buttons | gradient drift, particles, or marquee — one |

**1. Entrance choreography (page load).** Stagger the hero in a deliberate
order: backdrop, then headline (masked rise, or per-word stagger at 40-60ms),
then subhead, CTA, peripheral nav. Whole sequence under 1200ms. One per page —
interior sections get scroll reveals, not load animations.

```jsx
// motion/react — orchestrated hero
const container = { show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
const rise = {
  hidden: { y: 24, opacity: 0 },
  show:   { y: 0,  opacity: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
```

**2. Scroll reveals.** Fire once at ~20% viewport entry. Vary by content type —
text rises, images scale 1.04 to 1 behind a clip reveal, cards stagger 60-80ms.
The same fade-up on everything reads as templated, which is the tell.

```jsx
<motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
```

**3. Hover micro-interactions.** Every interactive element gets a designed
hover, not a default one. Buttons: background shift plus icon nudge 2-4px, or
magnetic pull at theatrical. Cards: lift 2-4px, shadow deepen, inner image
scale 1.03. Links: underline draw via `scaleX` with `transform-origin: left`.
150-250ms, ease-out.

**4. The signature moment.** ONE scroll-driven set piece per page that nothing
competes with: a pinned section whose content swaps on scroll, a counter
ticking up, an SVG path drawing itself, a horizontal gallery, text filling with
color as it crosses center. The wow budget is spent concentrated, not sprinkled.

**5. Ambient life (theatrical only).** A 20s+ gradient drift, a marquee that
pauses on hover, or a low-opacity grain layer. One. Two reads as noise.

**Physics.**
- Entrances: `cubic-bezier(0.22, 1, 0.36, 1)`. Loops: ease-in-out. Springs
  (`stiffness: 300, damping: 24`) for Playful Dimensional only.
- Micro 150-250ms · component 250-400ms · scene 400-800ms.
- Stagger 50-80ms per item; cap visible stagger around six.
- Animate `transform` and `opacity` only. Animating layout properties on scroll
  is a performance defect, not a style choice.
- `prefers-reduced-motion`: every effect degrades to instant or a plain fade.

---

## Part 4 — Phases and gates

Each gate lists what the user must be shown and what makes it pass.

### Phase 0 — References, then the direction doc

Scrape the brief's reference plus 1-2 from the direction's list (Playwright):
full-page screenshot at 1440 into `design-references/`; computed values pulled
from key elements — font stacks, sizes, line-heights, letter-spacing, spacing
values, hex colors, shadow definitions, transition durations and easings;
hover and focus states triggered and captured.

Then write the direction doc: brief restated · extracted values as real numbers ·
type pairing with load source · palette as named hexes · spacing scale · motion
plan mapped to the level and the recipes above · proposed signature element.

> **Gate.** Doc shown, user approves. **Fails if** it contains no extracted
> numbers — a direction doc written in adjectives is fiction. Redo it.
> Without Playwright: say so, and source every number from Part 2 plus the
> reference's public design docs. Still numbers, still specific.

### Phase 1 — Tokens

One file (`lib/design-tokens.ts` or `tokens.css`) derived entirely from the
approved doc: color as primitive plus semantic layers, type scale, spacing
scale, radii, shadows, motion durations and easings, breakpoints. Feeds the
Tailwind config and the CSS variables.

> **Gate.** File shown, user approves. **Passes when** every value the build
> will need has a name here, one radius language is chosen, at most two shadow
> elevations exist, and the accent clears AA against its background.

### Phase 2 — First section

Build the hero and nav only, with full motion for the level. Screenshot at
1440 beside the reference screenshot.

> **Gate.** Side-by-side shown. STOP. This is the cheapest possible
> course-correction — the user names what is off and it gets fixed before the
> pattern is copied into eight more sections.

### Phase 3 — Full build

Scale to the remaining sections on approved tokens and patterns. Scroll reveals
varied by content type. Build the signature moment. Then prove the token rule:

```bash
# expect zero hits outside the token file
grep -rnE '#[0-9a-fA-F]{3,8}\b' src app components \
  --include='*.ts' --include='*.tsx' --include='*.css' --include='*.vue' --include='*.svelte' \
  | grep -v 'design-tokens\|tokens.css'
```

### Phase 4 — Audit

Run `impeccable` if installed, otherwise this checklist, with file:line
citations and PASS/FAIL per item. **Apply the top five fixes**, re-run to
confirm. Document remaining FAILs with the reason each was left.

Inline checklist: heading order · focus-visible on every interactive element ·
`alt` on meaningful images and empty `alt` on decorative ones · AA contrast on
body (4.5:1) and UI (3:1) · hit targets at least 44px on mobile · labeled
inputs · aria-labels on icon-only buttons · color never the sole state signal ·
reduced motion honored · no layout-shifting animation · fonts preloaded with
`font-display: swap` · images sized to prevent CLS · one icon library · no
emoji as icons · no nested cards · prose at 65-75ch.

### Phase 5 — Visual verification

- Full-page screenshots at 1440 / 768 / 375
- Hover, focus-visible and active states triggered and captured on the primary
  interactive elements
- Entrance choreography and signature moment stepped through
- Side-by-side against the reference — comparable quality, or iterate
- Zero console errors; axe pass clean; reduced-motion emulated and re-checked

> **Done means Phase 5 passed.** Never claim done from reading code.

---

## Part 5 — Standing rules

**Type.** Distinctive display face per the direction — never Inter, Roboto or
system-ui for display. Readable body face. Scale ratio at least 1.25. Display
tracked -0.02 to -0.04em, small UI +0.01em. Prose 65-75ch.

**Color.** Neutrals tinted toward the brand hue. Dark mode is a desaturated
palette with borders doing the separation work, not inverted lightness. The
accent glows; nothing else does.

**Layout.** Hierarchy decides alignment — asymmetric when the content supports
it. Cards only where a card is the right affordance, never nested. 80-120px
between major sections on desktop, 48-64px on mobile.

**States.** Hover, active, focus-visible and disabled designed on everything
interactive. Focus is a visible ring — `outline: none` without a replacement is
a bug. Loading states designed. Empty states carry direction and an action.

**Copy.** Real words from the brief. Buttons are specific verbs — "Save
changes", not "Submit". Errors say what to do next. No "Welcome to your
dashboard!", no exclamation-mark enthusiasm.

**Hygiene.** Tokens in one file. Semantic HTML, headings in order. One icon
library (lucide-react unless the project already has one).

---

## Reference library

| Use | Sites |
|---|---|
| Motion-heavy components | ui.aceternity.com · magicui.design · hover.dev |
| Clean components | ui.shadcn.com · originui.com · 21st.dev |
| Design systems and tokens | vercel.com/design · linear.app · primer.style |
| Playful | cuicui.day · kokonutui.com |
| Browsing for feel | godly.website (filter by industry) · httpster.net |
| Motion timing | easings.net · animista.net |

Scraping etiquette: 500ms-1s between navigations, cache screenshots locally,
fall back to a headed browser on sites that block headless.

## When it still looks generic

The brief was thin. Go back to Part 1 — name a sharper reference, paste real
copy, commit harder to one direction. No install step and no rule list fixes
generic input. If the brief is genuinely full and the output is still average,
two directions got blended somewhere; find where, and cut one.
