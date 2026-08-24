---
name: site-glowup
description: >
  Full-site visual overhaul orchestrator. Use when the user wants an entire
  website/app to "look amazing," needs a site-wide redesign, visual refresh,
  design-system retrofit, or says the UI looks generic/dated/ugly. Establishes
  a deliberate design direction and token foundation FIRST, then executes a
  page-by-page transformation loop chaining ui-critical-inspector (audit),
  ui-ux-pro (structure), and impeccable (polish) with screenshot verification.
  Never restyles ad-hoc without a locked direction.
---

# Site Glowup — Full-Site Design Overhaul Orchestrator

You are running a controlled, site-wide visual transformation. The #1 failure
mode of "make it look amazing" is generic AI slop: purple-to-blue gradients,
Inter everywhere, glassmorphism cards, emoji headers, identical shadcn energy.
This skill exists to prevent that. **No pixel changes until a design direction
is locked and tokenized.**

## Non-Negotiable Guardrails

1. **Branch first.** `git checkout -b design/glowup`. Commit after every page.
2. **Zero functionality changes.** No logic, data, routing, or API edits.
   If a visual fix requires a structural refactor, do the minimum and log it.
3. **Direction before decoration.** Phases run in order. Skipping Phase 1
   is forbidden even if the user says "just make it pretty" — the direction
   interview can be 3 questions, but it happens.
4. **State lives in** `.agent-audit/glowup/` (PLAN.md, DIRECTION.md,
   TOKENS.md, PROGRESS.md), with `DESIGN.md` at repo root as the durable
   design source of truth. Resume from PROGRESS.md if interrupted.
5. **One polish skill per project.** See Phase 4 — never stack impeccable,
   design-taste-frontend, and frontend-design on the same codebase.

---

## Phase 0 — Dependency Preflight

Check which optional companions are installed (look in `.claude/skills/`,
`~/.claude/skills/`, and the agents dir for `ui-critical-inspector`). For
any that are missing, tell the user what's absent and what it unlocks, and
**ask before installing** — never install silently:

```bash
# Objective audit rules for Phase 3 (Vercel, fetched fresh at runtime)
npx skills add vercel-labs/agent-skills --skill web-design-guidelines

# /taste design-DNA extractor for Phase 1 (needs Playwright MCP)
git clone https://github.com/senlindesign/taste-skill ~/.claude/skills/taste
```

If the user declines or offline, proceed — every phase degrades gracefully
without them. Record what's available in PROGRESS.md so later phases don't
re-check. Required non-negotiables: git repo present, and the
ui-critical-inspector agent + ui-ux-pro + one polish skill installed
(if any of THOSE are missing, stop and tell the user).

---

## Phase 1 — Design Direction (the taste layer)

Interview the user briefly (max 4 questions, offer defaults):

1. **Personality:** pick ONE lane — e.g. editorial/refined, brutalist/raw,
   quiet-luxury, industrial/utilitarian, playful/toy-like, retro-terminal,
   swiss/grid-strict. ("Modern and clean" is not an answer — push for a lane.)
2. **Reference:** one site/product they admire, or a vibe word.
3. **Constraints:** brand colors that must stay, framework, dark mode?
4. **Ambition:** conservative refresh vs. full transformation.

**Accelerators (use if installed):**
- If the user gave a reference URL and the **taste** skill (senlindesign
  design-DNA extractor) is available, run `/taste <url>` — its Design Map +
  Taste DNA (tokens AND the reasoning/trade-offs behind them) becomes the
  raw material for DIRECTION.md. Adapt, don't clone.
- If the **stitch-design-taste** / **taste-design** skill is available, use
  it to draft the DESIGN.md scaffold (banned clichés, typography, layout
  rules) and refine from the interview answers.

Then write the direction as **`DESIGN.md` at the repo root** (single source
of truth every future agent session reads), mirrored to
`.agent-audit/glowup/DIRECTION.md`. It must contain: the chosen lane,
3 adjectives, what this site will deliberately NOT look like, one signature
element (a distinctive detail — oversized numerals, hairline rules, a
texture, an unusual accent — that makes it memorable), and the font pairing
(display + body; never default to Inter; pick something characterful that
fits the lane).

**Gate: user approves DESIGN.md before any code changes.**

(Greenfield only: if there is no existing UI to overhaul and the user wants
to explore visually first, the **image-to-code** skill can generate reference
frames and implement them — then this skill takes over from Phase 2.)

## Phase 2 — Token Foundation

Retrofit or create the token layer so every later fix lands on rails:

- Color: bg/surface/border/text hierarchy + accent + semantic (success/warn/
  danger) as CSS vars or Tailwind theme. Check accent contrast (AA) now.
- Type scale: 1 display + 1 body family, modular scale (e.g. 1.25), weights.
- Spacing: 4px or 8px base scale. Radii: ONE radius language (sharp, soft,
  or pill — not all three). Shadows: max 2 elevations. Motion: 2 durations +
  1 easing, `prefers-reduced-motion` guard.
- Sweep the codebase for hardcoded hex/px values and map them to tokens
  (log unmappable ones in TOKENS.md for the page passes).

Commit: `glowup: token foundation`.

## Phase 3 — Baseline Audit

Two audits, one backlog:

1. Invoke the **ui-critical-inspector** agent (full run) — judgment-based
   findings with severity + fix-skill routing.
2. If the **web-design-guidelines** skill (Vercel) is installed, run it
   across the same files — objective checklist compliance (~100+ rules,
   fetched fresh at runtime) in file:line format. Merge its findings into
   REPORT.md, deduplicating against the inspector's; map each to P0–P3
   (a11y hard-fails = P0, hit-target/focus/form rules = P1, the rest = P2).

Merge REPORT.md with DESIGN.md into `PLAN.md` — an ordered page list
(highest-traffic first) with per-page: defects to fix + direction upgrades
to apply.

## Phase 4 — Page-by-Page Transformation Loop

For each page in PLAN.md:

1. **Structure pass — use the ui-ux-pro skill.** Fix hierarchy, layout,
   spacing rhythm, states (loading/empty/error), responsive breakage, and
   the inspector's P0/P1s for this page. Apply the new tokens.
2. **Polish pass — use exactly ONE polish skill for the whole project.**
   Default: **impeccable**. Alternatives if installed and better suited to
   the lane: **design-taste-frontend** (Leonxlnx — dial-based variance/
   motion/density, strong for kinetic/asymmetric lanes) or Anthropic's
   **frontend-design**. NEVER run two polish skills on the same project —
   they encode competing taste and will fight. Record the choice in
   PROGRESS.md at first use. Scope: typography detailing, micro-
   interactions, hover/focus states, the signature element, transitions.
3. **Verify.** Screenshot at 375 / 768 / 1440 (Playwright if available;
   otherwise re-read the rendered output). Check against DESIGN.md:
   does this page look like the chosen lane, or did it drift toward slop?
   Checklist: no unmapped hex values, no arbitrary spacing, focus states
   visible, dark mode intact, nothing broke functionally.
4. **Commit** `glowup(<page>): structure + polish`, tick PROGRESS.md.

Shared components get their own loop iteration BEFORE the pages that use them.

## Phase 5 — Coherence Pass

The cross-page look: nav/footer identical everywhere, page transitions,
consistent empty-state illustration style, favicon/OG images match the new
direction, loading skeletons match final layouts.

## Phase 6 — Exit Audit

Re-invoke **ui-critical-inspector**. Target: zero P0/P1, and its Verdict
grade improved by ≥2 letters. If P0s remain, loop Phase 4 on those pages.
Deliver a before/after summary with the final report path.

---

## Anti-Slop Checklist (apply during every page pass)

- Would a designer identify the lane from a screenshot with the logo hidden?
- Is there exactly one accent color doing real work?
- Does anything look like a default component library theme? Restyle it.
- Is the signature element present and consistent?
- Gradients, glassmorphism, emoji-as-icons: only if DESIGN.md says so.
