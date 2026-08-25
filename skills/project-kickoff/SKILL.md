---
name: project-kickoff
description: >
  New-project bootstrap orchestrator — the entry point for a build that does
  not exist yet. Use at the start of a UI-heavy project: a new internal
  dashboard or SaaS tool, marketing/landing page, 3D/WebGL portfolio,
  client-facing staff tool, or e-commerce/product site. Classifies the project,
  loads that category's stack defaults, skill subset, technical guardrails and
  anti-slop checklist, then gates on an approved DESIGN.md before any code.
  Hands the visual build to ui-craft-build and leaves DESIGN.md at repo root so
  a later ui-site-glowup pass starts at its token phase instead of re-running
  the direction interview. If the codebase already exists, this is the wrong
  skill — use ui-site-glowup.
---

# Project Kickoff — new-build bootstrap

Slop is not usually chosen. It accretes: screen two copies screen one's default
card, screen five invents a third button style, and by screen twelve the
project has a look nobody decided on. `ui-site-glowup` fixes that after the
fact and it is expensive. This skill spends twenty minutes up front instead.

**Where this sits.** Kickoff decides *what kind of project this is* — stack,
guardrails, category traps. `ui-craft-build` decides *what it looks like and
how it moves*. Kickoff runs first and hands off; it does not re-implement the
craft layer.

```
project-kickoff  → classify, stack, guardrails, DESIGN.md gate
   └─ ui-craft-build  → aesthetic direction, tokens, motion, gated build
        └─ ui-polish-pass   → later, for a named defect
        └─ ui-site-glowup   → later, when the project has drifted
```

## Guardrails

1. **No code before `DESIGN.md` is approved.** Same artifact `ui-site-glowup`
   checks for at its direction gate, so the work is never done twice.
2. **One polish skill per project, for the life of the project.** Never stack
   `impeccable`, `design-taste-frontend` and `frontend-design` — they hold
   competing opinions on type, spacing and motion and will undo each other.
   Record the choice in `DESIGN.md` at first use.
3. **Verify visually before "done"** — 375 / 768 / 1440, in every theme.
4. **Scaffolding is a real decision.** Auth, payments and data-model choices
   made in hour one are the expensive ones to reverse. Name them explicitly
   and get agreement; do not let them default silently.

---

## Step 0 — Confirm this is greenfield

```bash
git log --oneline -5 2>/dev/null | head
ls app pages src/app src/pages components 2>/dev/null
```

If UI already exists and the complaint is that it looks wrong, stop:
`ui-site-glowup` is the right skill and this one will fight it. A repo with a
framework scaffold and no real screens still counts as greenfield.

## Step 1 — Classify

Infer from the brief; ask only if genuinely ambiguous.

| Type | Signal | Reference |
|---|---|---|
| Internal dashboard / SaaS tool | "internal tool", "admin console", "dashboard", staff logins | `references/dashboard-saas.md` |
| Marketing / landing page | "landing page", "marketing site", one conversion-focused page | `references/marketing-landing.md` |
| 3D / WebGL portfolio | "portfolio", any Three.js / WebGL / R3F mention | `references/3d-portfolio.md` |
| Client-facing tool | built FOR an external client, their staff are the users | `references/client-facing-tool.md` |
| E-commerce / product site | catalog, cart, checkout, Stripe | `references/ecommerce.md` |

**Hybrids.** Real projects straddle. Name the primary type — the one whose
*failure* kills the project — and follow its reference as the spine, then merge
in the secondary's anti-slop checklist and technical guardrails. A marketing
site with a checkout is marketing-primary with e-commerce guardrails on the
purchase flow. Say which you picked and why in one line.

**None of the five.** Mobile app, docs site, game, CLI, data pipeline with a
thin UI — do not force a category. Skip to `ui-craft-build` directly, and apply
this skill's DESIGN.md contract and definition of done anyway.

## Step 2 — Preflight

Detect, then degrade. Never block on a missing optional tool, and never install
without asking.

| Capability | Status on this machine | If missing |
|---|---|---|
| `ui-ux-pro-max` | installed | structure passes run inline against DESIGN.md |
| `impeccable` | installed | inline polish against DESIGN.md; bar drops, procedure does not |
| `frontend-design`, `design-taste-frontend` | installed | alternatives to impeccable — pick ONE, ever |
| `taste` | installed | without a reference URL, derive direction from the interview |
| `image-to-code` | installed | greenfield escape hatch when the direction will not resolve in words |
| `ui-craft-build` | this repo's `skills/` | run its phases inline from that file |
| Playwright MCP | check for `mcp__playwright__*` | verification degrades to reading rendered output — say so out loud |
| `webgpu-threejs-tsl` | **not installed** | 3D projects only; see that reference |

> **`ui-ux-pro` does not exist** — the skill is `ui-ux-pro-max`, and it is
> driven by a script, not a bare invocation:
> ```bash
> python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> <keywords>" \
>   --design-system --persist -p "<Project Name>"
> ```
> It writes `design-system/MASTER.md`. That file is **generated input**, not the
> source of truth — `DESIGN.md` is, and where they disagree, `DESIGN.md` wins.
> Fold anything useful from MASTER.md into DESIGN.md rather than maintaining two.

Install commands for anything missing live in
`../ui-craft-build/reference/install.md`. Verify the command still works before
running it — skill-installer syntax has churned, and a stale one-liner failing
is not a reason to abandon the tool.

## Step 3 — The DESIGN.md contract

Every category ends here, so it is defined once. Write to **repo root**.

**Required in all cases:**
- the chosen lane, named, from the category's candidates or a better one
- three adjectives
- **what this will deliberately NOT look like** — name the clichés being
  refused, so later passes can be checked against a commitment
- one **signature element**: a specific detail that makes the project
  recognizable with the logo hidden
- font pairing, display + body, with load source. Never Inter for display.
- palette as named hexes, with the accent's contrast ratio stated
- motion character in one sentence: durations and easing
- the one polish skill chosen for this project

Categories add their own required fields — see each reference.

**Avoid by default**, unless the brief genuinely demands one: cream + serif +
terracotta; near-black + a single acid-green or vermilion accent; broadsheet
hairline-rule columns; purple-to-blue gradient on glass cards. These are where
model output clusters, which is precisely why they read as machine-made.

> **Gate: the user approves `DESIGN.md` before any code is written.**

## Step 4 — Build

Hand to `ui-craft-build` and run its phases — tokens, first screen, full build,
audit, visual verification. Layer the category reference's workflow overrides on
top; they exist because each category has a different riskiest part and it
should be built first:

| Category | Build the risky thing first |
|---|---|
| Dashboard | the densest table or the most complex form, not the login screen |
| Marketing | the hero, with real copy |
| 3D portfolio | the signature 3D moment, in isolation, before any page chrome |
| Client-facing | the demo scenario, end to end |
| E-commerce | the checkout failure states |

## Step 5 — Definition of done

- `DESIGN.md` approved, and the built UI matches it — lane identifiable from a
  screenshot with the logo hidden
- one token source; the hex grep returns only the token file
- screenshots at 375 / 768 / 1440 in every theme
- keyboard path through the primary flow, focus visible at every stop
- AA contrast verified by computation, not by eye
  (`../ui-polish-pass/scripts/contrast.mjs`)
- `prefers-reduced-motion` honored
- zero console errors
- the category reference's own done-criteria met

## Step 6 — Hand-off note

Tell the user, once, in a sentence: `DESIGN.md` at repo root is what
`ui-site-glowup` looks for at its direction gate, so a future overhaul starts at
the token phase and the direction interview never happens twice. Keep it updated
when the direction genuinely changes — a stale DESIGN.md is worse than none,
because the next pass will trust it.
