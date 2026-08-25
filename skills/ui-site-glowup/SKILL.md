---
name: ui-site-glowup
description: >
  Full-site visual overhaul orchestrator for UI that already exists. Use when
  the user wants a whole website or app to "look amazing", asks for a redesign,
  visual refresh or design-system retrofit, or says the UI looks generic,
  dated, inconsistent or ugly. Locks a design direction and a token foundation
  FIRST, then runs a page-by-page transformation loop — audit, structure,
  polish, screenshot verification, commit — resumable from its own state files.
  Never restyles ad hoc without a locked direction. For a brand-new surface use
  ui-craft-build; for one targeted defect use ui-polish-pass.
---

# Site Glowup — full-site design overhaul

A controlled, site-wide visual transformation of existing UI. The dominant
failure mode of "make it look amazing" is generic AI slop: purple-to-blue
gradients, Inter everywhere, glassmorphism cards, emoji headers, the same
untouched component-library energy on every page. This skill prevents that by
refusing to touch pixels until a direction is locked and tokenized.

## Non-negotiable guardrails

1. **Branch first.** `git checkout -b design/glowup`. Commit after every page,
   so any single page can be reverted without unwinding the whole pass.
2. **Zero functionality changes.** No logic, data, routing or API edits. If a
   visual fix genuinely needs a structural refactor, do the minimum and log the
   rest in `PROGRESS.md` as follow-up.
3. **Direction before decoration.** Phases run in order. Skipping Phase 1 is
   forbidden even when the user says "just make it pretty" — the interview can
   be three questions, but it happens.
4. **State survives compaction.** `.agent-glowup/` holds `PLAN.md`,
   `TOKENS.md` and `PROGRESS.md`; `DESIGN.md` at repo root is the durable
   design source of truth (the same contract ui-craft-build writes and
   ui-polish-pass reads). Resume from `PROGRESS.md` if interrupted.
5. **One polish skill per project.** See Phase 4. Never stack two — they encode
   competing taste and will undo each other page by page.
6. **Nothing ships unverified.** A page is not done until it has been looked
   at, at three widths, in every theme the project supports.

---

## Phase 0 — Preflight

Establish what is actually available and what the pass will cost.

**Hard requirements — stop and tell the user if any is missing:**
- a git repo with a clean working tree (uncommitted work must be committed or
  stashed first; this pass touches a lot of files)
- a way to render the app — dev server command, or a build plus static preview
- an inventory of routes and shared components (glob the routes/pages dir)

**Optional companions — report what is missing, what it unlocks, and ask
before installing. Never install silently.**

| Companion | Unlocks | Fallback if absent |
|---|---|---|
| Playwright MCP | screenshot verification at 375/768/1440, state capture | read rendered output and diff markup; flag verification as degraded in `PROGRESS.md` |
| `ui-critical-inspector` agent | judgment-based audit with severity routing | the inline audit checklist in Phase 3 |
| `web-design-guidelines` (Vercel) | ~100 objective rules in file:line form | the inline checklist covers the a11y and interaction subset |
| `taste` skill (+ Playwright) | design-DNA extraction from a reference URL | derive the direction from the interview and Part 2 of ui-craft-build |
| a polish skill (`impeccable`, `frontend-design`, `design-taste-frontend`) | Phase 4 polish pass | do the polish inline against `DESIGN.md`; quality bar drops, procedure does not |

Record availability in `PROGRESS.md` so later phases stop re-checking.

Then size the job: count pages and shared components, and state the plan back
to the user — "17 routes, 9 shared components, 6 phases, commit per page."
Ambition (Phase 1 question 4) scales what happens per page, never whether
verification happens.

---

## Phase 1 — Design direction (the taste layer)

Interview: at most four questions, each with a proposed default so the user can
answer by agreeing.

1. **Personality — pick ONE lane.** Editorial/refined, brutalist/raw,
   quiet-luxury, industrial/utilitarian, playful/toy-like, retro-terminal,
   swiss/grid-strict. "Modern and clean" is not an answer; push for a lane.
2. **Reference.** One site or product they admire, or a vibe word.
3. **Constraints.** Brand colors that must survive, framework, dark mode,
   anything the redesign must not break.
4. **Ambition.** Conservative refresh, or full transformation.

**Accelerators, if installed.** With a reference URL and the `taste` skill,
run it — the extracted tokens plus the reasoning behind them become raw
material for `DESIGN.md`. Adapt, never clone. Without it, source concrete
numbers from the reference by hand; a direction written in adjectives is not
a direction.

Write `DESIGN.md` at repo root, mirrored to `.agent-glowup/DIRECTION.md`:

- the chosen lane, and three adjectives
- **what this site will deliberately NOT look like** (name the clichés being
  refused, so later passes can be checked against them)
- one **signature element** — oversized numerals, hairline rules, a texture, an
  unusual accent placement — that makes the site recognizable at a glance
- the font pairing: display plus body, never defaulting to Inter, characterful
  and fitting the lane, with the load source
- the palette as named hexes, with the accent's contrast ratio stated
- motion character in one sentence, plus durations and easing

> **Gate: the user approves `DESIGN.md` before any code changes.**

*Greenfield note:* if there is no existing UI to overhaul, this is the wrong
skill — use `ui-craft-build`. If part of the site is greenfield, build those
surfaces with `ui-craft-build` under the same `DESIGN.md`, then return here.

---

## Phase 2 — Token foundation

Retrofit or create the token layer so every later fix lands on rails.

- **Color:** background / surface / border / text hierarchy, one accent, plus
  semantic success-warn-danger. Check every pairing against AA now, with
  computed ratios rather than judgment (see the ui-polish-pass contrast script).
- **Type:** one display plus one body family, a modular scale (1.2 or 1.25),
  a deliberate weight set.
- **Spacing:** a 4px or 8px base scale. **Radii:** ONE radius language — sharp,
  soft, or pill, not all three. **Shadows:** at most two elevations.
  **Motion:** two durations, one easing, plus a `prefers-reduced-motion` guard.
- Sweep for hardcoded values and map them to tokens:

```bash
grep -rnE '#[0-9a-fA-F]{3,8}\b' src app components --include='*.ts' --include='*.tsx' --include='*.css' | grep -v 'tokens'
```

Unmappable leftovers go into `TOKENS.md` as a per-page worklist for Phase 4 —
they are the honest measure of how much drift the site carries.

Commit: `glowup: token foundation`.

---

## Phase 3 — Baseline audit

Two audits, one backlog. Run whichever of these is available; the inline list
is the floor, not the ceiling.

1. **`ui-critical-inspector`** (full run) for judgment findings with severity.
2. **`web-design-guidelines`** across the same files for objective compliance
   in file:line form.
3. **Inline floor, always run:** contrast failures against the new tokens ·
   missing focus-visible · hit targets under 44px · unlabeled inputs and
   icon-only buttons · heading order breaks · images without dimensions ·
   layout breakage at 375 · missing loading, empty and error states ·
   nested cards · unmapped hex and arbitrary spacing values from `TOKENS.md`.

Merge into one deduplicated backlog, mapped to priority: a11y hard-fails are
P0; focus, hit-target and form rules are P1; everything else is P2 or P3.

Then merge the backlog with `DESIGN.md` into `.agent-glowup/PLAN.md` — an
ordered page list, highest-traffic first, each entry carrying **defects to fix**
and **direction upgrades to apply**. Shared components get their own entries,
placed before the pages that consume them.

---

## Phase 4 — Page-by-page transformation loop

For each entry in `PLAN.md`, in order. **Shared components first.**

1. **Structure pass.** Hierarchy, layout, spacing rhythm, states (loading,
   empty, error), responsive breakage, and this page's P0 and P1 findings.
   Apply the new tokens. Use `ui-ux-pro-max` here if installed.
2. **Polish pass — exactly ONE polish skill for the entire project.**
   Default `impeccable`. Alternatives, if installed and better suited to the
   lane: `design-taste-frontend` for kinetic or asymmetric lanes,
   `frontend-design` for a general craft bar. Record the choice in
   `PROGRESS.md` at first use and never change it mid-project. Scope:
   typography detailing, micro-interactions, hover and focus states, the
   signature element, transitions.
3. **Verify.** Screenshot at 375 / 768 / 1440, in every theme the project
   supports. Then check, concretely:
   - no unmapped hex or arbitrary spacing values remain in the touched files
   - focus-visible renders on every interactive element on the page
   - dark mode intact; the untouched theme is byte-identical if only one theme
     was in scope
   - the signature element is present and consistent with earlier pages
   - nothing broke functionally — the page still renders its real data
   - would a designer name the lane from this screenshot with the logo hidden?
4. **Commit** `glowup(<page>): structure + polish`, then tick `PROGRESS.md`
   with what was done and what was deferred.

If a page fails its own verification twice, stop and show the user the
screenshot rather than iterating blind a third time.

---

## Phase 5 — Coherence pass

The cross-page look, which is where most overhauls actually fall apart:

- nav and footer identical on every route, including edge routes (404, auth,
  settings) that the page list tends to miss
- page transitions consistent, and consistent with the motion character
- one empty-state and one error-state illustration style site-wide
- loading skeletons match the final layouts they stand in for
- favicon, OG images and theme-color meta updated to the new direction
- typography scale actually used — no page inventing its own heading size

Commit: `glowup: coherence pass`.

---

## Phase 6 — Exit audit

Re-run the Phase 3 audits over the whole site and compare against the recorded
baseline. **Pass criteria, all concrete:**

- zero P0 and zero P1 findings remaining
- total findings reduced against the baseline count recorded in Phase 3
- every page in `PLAN.md` marked done in `PROGRESS.md`, or explicitly deferred
  with a reason
- the token grep from Phase 2 returns only the token file
- zero console errors across the audited routes

If P0s remain, loop Phase 4 on those pages only. Deliver a before/after summary:
baseline versus exit counts, the pages touched, the deferred list, and where
the screenshots and report live.

---

## Anti-slop checklist (apply on every page pass)

- Would a designer identify the lane from a screenshot with the logo hidden?
- Is there exactly one accent color, and is it doing real work?
- Does anything still look like an untouched component-library default?
- Is the signature element present, and consistent with the pages before it?
- Gradients, glassmorphism, emoji-as-icons: only if `DESIGN.md` says so.
- Is the dark theme a desaturated palette, or just an inverted light one?
