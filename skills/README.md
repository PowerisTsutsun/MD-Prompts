# Skills

Claude Code skills, in the format the harness loads: one directory per skill,
each with a `SKILL.md` carrying `name` and `description` frontmatter.

Unlike the prompts in the repo root — which you paste at the top of a session —
these load automatically when the request matches the description, and stay out
of context when it does not.

## The UI set

Four skills, split by **scope of change**. They share one contract: whichever
runs first writes `DESIGN.md` at the repo root, and the others read it.

| Skill | Use when | Scope |
|---|---|---|
| [`project-kickoff`](project-kickoff/) | starting a project that does not exist yet | classify the build → stack + guardrails → DESIGN.md gate → hand to `ui-craft-build` |
| [`ui-craft-build`](ui-craft-build/) | building a new surface, or replacing one wholesale | brief → one aesthetic direction → tokens → gated build with motion |
| [`ui-site-glowup`](ui-site-glowup/) | an existing site should look better everywhere | direction → token retrofit → audit → page-by-page loop → coherence → exit audit |
| [`ui-polish-pass`](ui-polish-pass/) | one named visual defect: muddy contrast, dissolving labels, dead space | measure → fix the token → sweep every consumer → verify |

Rough rule: **new project → kickoff · new surface → build · whole site →
glowup · one complaint → polish.** Escalate rather than stretch — a polish pass
that turns into a redesign should stop and become a glowup with the user's
consent.

They compose in one direction:

```
project-kickoff  →  ui-craft-build  →  ui-polish-pass   (later, one defect)
                                    →  ui-site-glowup   (later, drifted)
```

`project-kickoff` owns the *category* layer — stack defaults, auth and payment
decisions, per-category technical guardrails and anti-slop traps, across five
project types (dashboard, marketing, 3D portfolio, client-facing tool,
e-commerce). `ui-craft-build` owns the *craft* layer — aesthetic direction,
tokens, motion, gated phases. Kickoff hands off rather than re-implementing it.

## Install

Copy the directories into your skills folder and restart Claude Code.

```bash
# user-wide
cp -r skills/ui-craft-build skills/ui-site-glowup skills/ui-polish-pass ~/.claude/skills/

# or project-scoped
cp -r skills/ui-* .claude/skills/
```

```powershell
# Windows, user-wide
Copy-Item -Recurse -Force .\skills\ui-* "$HOME\.claude\skills\"
```

Verify with `ls ~/.claude/skills/` — each directory needs a `SKILL.md` at its
root, not nested one level deeper.

## What each ships with

```
project-kickoff/
  SKILL.md
  references/dashboard-saas.md        internal tools, admin consoles
  references/marketing-landing.md     one page, one job, LCP budget
  references/3d-portfolio.md          R3F/Three.js, with the real WebGL traps
  references/client-facing-tool.md    built for an external client's staff
  references/ecommerce.md             catalog, cart, Stripe, failure states
ui-craft-build/
  SKILL.md
  reference/install.md      companion install steps, macOS/Linux + PowerShell
ui-site-glowup/
  SKILL.md
ui-polish-pass/
  SKILL.md
  scripts/contrast.mjs      dependency-free WCAG ratio calculator, exits 1 on fail
```

`contrast.mjs` is useful outside the skill too:

```bash
node skills/ui-polish-pass/scripts/contrast.mjs "#8f887c" "#25211c"
# FAIL/PASS  4.56:1  (target 4.5:1, AA body)  #8f887c on #25211c
```

## Companions

Each skill preflights for optional companions (Playwright MCP,
`frontend-design`, `impeccable`, `ui-critical-inspector`, `taste`), reports what
is missing, and degrades gracefully rather than blocking. None are required.

One rule they all enforce: **never stack two taste skills on one project.**
`frontend-design`, `impeccable`, `design-taste-frontend` and `ui-ux-pro-max`
hold competing opinions on type, spacing and motion; loaded together they
average each other into exactly the generic output the skills exist to prevent.

## Conventions

These follow the repo's house style — exhaustive by default, evidence over
volume, baseline first, safe fixes applied and dangerous ones staged — plus two
of their own:

- **Direction before decoration.** No pixels change until an aesthetic
  direction is written down and approved.
- **Gates need artifacts.** A phase ends with a file or a screenshot the user
  can look at, never with a description of work performed.
