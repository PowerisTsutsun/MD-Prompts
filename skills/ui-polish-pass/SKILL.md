---
name: ui-polish-pass
description: >
  Surgical UI polish on a codebase that already has a design system. Use for a
  named visual complaint rather than a redesign — "dark mode looks muddy",
  "the tags dissolve into the background", "cards don't separate", "this text
  is hard to read", "tighten up the card layout", contrast and WCAG fixes,
  token value corrections, hover and focus state gaps, empty-state dead space.
  Fixes values, not vibes: measures contrast rather than eyeballing it, changes
  lightness without neutralizing brand hue, and sweeps every consumer of a
  changed token instead of fixing one screen. For a whole-site overhaul use
  ui-site-glowup; for a new surface use ui-craft-build.
---

# UI Polish Pass — targeted fixes on an existing design system

This is the small, safe, high-precision pass. The design language is already
decided; something inside it is measurably wrong. The job is to find the token
or component detail responsible, correct it with numbers, and propagate the
correction everywhere it applies — without touching logic, and without
laundering a redesign through a polish request.

## Operating rules

1. **The complaint is the scope.** Fix what was named, plus every other
   instance of the same defect. Do not restyle adjacent things because you are
   already in the file.
2. **Measure, never eyeball.** Every contrast claim comes with a computed
   ratio. `scripts/contrast.mjs` in this skill computes them.
3. **Change value, preserve hue.** A warm-cast theme is brand, not a bug. Fix
   lightness and saturation; neutralizing the hue is a redesign, and a
   redesign needs the user's consent.
4. **Tokens first, components second.** If the defect appears on three screens,
   it is a token problem. Fixing it in one component is how drift starts.
5. **Sweep every consumer.** A changed token or component ships to every page
   that uses it. Enumerate those pages before claiming done.
6. **Untouched themes stay byte-identical.** If only dark mode was in scope,
   the light palette must not change at all — verify, do not assume.
7. **Zero logic changes.** No server actions, migrations, RLS, auth, pricing or
   data-fetch edits. If a visual fix requires one, stop and list it as a
   follow-up instead of doing it.
8. **Verification is part of the fix.** A polish pass that was never looked at
   is not finished.

---

## Step 1 — Locate the system

Before changing anything, find and read:

- the token layer — `globals.css`, `theme.css`, `tokens.ts`, the Tailwind
  theme block, or the CSS custom property root
- `DESIGN.md` at repo root if one exists (written by ui-craft-build or
  ui-site-glowup) — it states the intended lane and what the site refuses to
  look like; the fix must stay inside that
- every theme variant: light, dark, and any per-scope overlays
  (`[data-theme]`, `[data-variant]`, per-tenant or per-entity theme blocks)
- recent commits touching those files — someone may have already half-fixed
  this, and double-applying a correction overshoots

State back what the system is before proposing changes: base scale, token
names, theme mechanism, how themes are switched.

## Step 2 — Reproduce and measure

Turn the complaint into numbers.

- Identify the exact tokens and components involved. "The tags dissolve" means
  a specific text token on a specific surface token.
- Compute the current contrast ratio for every text-on-surface pair in scope,
  on **every** surface the token actually lands on — base background, elevated
  surface, sunken surface, and each overlay variant. A token that passes on one
  surface routinely fails on another.

```bash
node skills/ui-polish-pass/scripts/contrast.mjs "#b2aca0" "#25211c"
node skills/ui-polish-pass/scripts/contrast.mjs --pairs pairs.json
```

Targets: 4.5:1 body text, 3:1 large text and UI boundaries, and note that AA
is a floor, not a goal. Text sitting at 4.5-4.6:1 is technically compliant and
still reads muddy — that gap is usually the real complaint. Aim for 7:1 on
primary text and 5.5:1 or better on secondary.

Write the measurements down in the response. They are the justification for
every value you are about to change.

## Step 3 — Fix at the token layer

For each failing pair, change lightness — not hue — until the target ratio is
met, then re-measure against **all** its surfaces.

- Update any code comments that document the old ratios; a stale comment
  asserting "4.55:1" next to a corrected value is a future bug.
- Check the corrected token against the other themes it appears in. Raising
  a shared token's lightness for dark mode can break light mode.
- Where separation rather than legibility is the problem — cards that do not
  detach from the page — reach for borders and surface steps before shadows.
  A border token one step stronger usually beats adding an elevation.
- New interaction surfaces (a hover-elevated background, a soft accent
  background for chips) belong in the token layer with names, not inline in a
  component as a one-off `color-mix`.

## Step 4 — Component detail

Only after the tokens are right. Typical work, each of which should be
justified by the complaint:

- **Label and chip treatment.** Bare muted text that must read as a label gets
  a real chip: soft accent background, accent foreground, small padding, the
  radius language already in use. Verify the accent-on-accent-soft pair in
  every theme and every overlay variant.
- **Dead space and alignment.** Cards whose optional content is missing leave a
  gap that breaks row alignment. Either render a meaningful fallback line, or
  restructure so rows of mixed cards keep their bylines aligned.
- **Affordance.** A card that is a link should signal it across the whole
  surface — title color or underline on `group-hover` — not only via a corner
  icon.
- **Scan order.** Inside dense meta rows, promote the values and demote the
  labels and icons, so the numbers are what the eye lands on.
- **Motion.** A 1px lift or a border transition on hover is enough. Anything
  added here must collapse under `prefers-reduced-motion`.

## Step 5 — Sweep every consumer

The change is not done on the screen where it was reported.

```bash
grep -rn "eyebrow\|--ink-muted\|<QuizCard" src app components
```

Enumerate every route and component that renders the changed token or
component — feeds, detail pages, profile pages, headers, footers, empty states,
auth screens, and any themed sub-scope. Anything that visually rhymes with the
fixed element (pills, badges, tags elsewhere) should be brought into rhyme
deliberately or explicitly left alone with a reason.

## Step 6 — Framework gotchas

Check the ones that apply before trusting a visual result:

- **Tailwind v4:** the important modifier is a suffix (`class!`); the v3 prefix
  form (`!class`) silently emits no CSS. Attribute-only selectors must live
  inside `@layer base` or the scanner strips them. Dynamic class names built by
  string concatenation are never scanned — the class simply does not exist.
- **Tailwind (any version):** verify a changed class actually appears in the
  compiled output rather than assuming, especially after adding a new token.
- **CSS custom properties:** a variable redefined in a nested theme scope wins
  over the root; check the overlay blocks, not just `:root`.
- **CSS modules / styled-components:** specificity and load order decide the
  winner; the value you edited may not be the one rendering.
- **Server-rendered themes:** confirm the theme attribute is present on first
  paint, or the fix is invisible until hydration.

## Step 7 — Verify

- Render the app and capture the affected screens at 375 / 768 / 1440, in
  **every** theme, plus at least one overlay variant if the project has them.
- Confirm: the reported defect is gone; no contrast regression anywhere,
  including the theme that was out of scope; focus-visible rings still render;
  `prefers-reduced-motion` still collapses any transition you added; nothing
  shifted layout.
- Re-run the measurement from Step 2 and show before/after ratios.
- Run the project's linter and type-checker on the touched files.

## Step 8 — Report

- Every token changed, with before/after values and before/after ratios.
- Every file touched, and every consumer swept.
- The follow-up list: anything that would have needed a logic, schema or
  out-of-scope change, written as concrete next steps rather than done work.
