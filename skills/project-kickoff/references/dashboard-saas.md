# Dashboard / internal tool

*SaaS dashboards, internal tooling, admin consoles. The users are captive —
they cannot leave for a competitor, which is exactly why the quality bar slips
and why density and keyboard speed matter more than delight.*

## Stack

Next.js 15 (App Router) · Vercel · Supabase (Postgres) + Drizzle ORM.

- **Auth:** internal tools default to Auth.js v5 with Microsoft Entra ID SSO,
  not a public signup flow. Staff already have accounts; a second credential
  set is a support burden and a security surface.
- **Mail/calendar data:** Microsoft Graph API, reusing the Entra tokens. Do not
  add a third auth provider to read a mailbox.
- **Roles:** decide the RBAC model in hour one — role list, where it is stored,
  and whether the UI hides or disables unauthorized actions. Retrofitting
  permissions across built screens is the single most expensive dashboard
  rework there is.

## Skills

- `ui-ux-pro-max` — lock the component system before screen two:
  ```bash
  python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<domain> internal dashboard admin" \
    --design-system --persist -p "<Project>"
  ```
- `impeccable` — the polish pass. One polish skill, whole project.
- `taste` — only if matching an existing internal look; point it at the
  reference URL and extract the real system before drafting DESIGN.md.

## DESIGN.md additions

Lane candidates: Swiss-minimal data console · quiet functional editorial ·
neutral-plus-one-accent.

Also required for this category:

- **Density target.** Comfortable, compact, or switchable. This decides row
  height, control size and font size everywhere, so it cannot be per-screen.
- **Button hierarchy**, defined before any screen: primary (one per view),
  secondary, ghost, destructive. Write the rule for which gets used when.
- **Number and date formatting.** Tabular figures, decimal places, thousands
  separators, timezone displayed or implied, relative vs absolute dates.
  Inconsistency here reads as a bug, not a style choice.

## Anti-slop checklist

- **Every entity type gets its own treatment.** A project card, a work entry
  and a user row are different objects; the same default card reused for all
  three is how a dashboard stops communicating.
- **Not every action is a solid-fill button.** If a toolbar has five filled
  buttons, none of them are primary.
- **Empty states are a design surface** — specific copy and a specific next
  action per context. "No data found" is an unfinished screen. First-run empty
  differs from filtered-to-nothing empty; the second needs a clear filter.
- **Loading is a skeleton matching the final layout**, not a centered spinner.
  Spinners hide layout shift instead of preventing it.
- **Tables carry real affordances:** row hover, visible sort state, sticky
  header on scroll, numbers right-aligned with tabular figures, and enough
  border or zebra contrast to track a row across the width. Gray-on-gray rows
  are the most common dashboard failure.
- **Destructive actions are recoverable or confirmed** — undo toast preferred
  over a confirm dialog, confirm dialog required when undo is impossible.
- **Permission-aware UI:** an action the user cannot perform is disabled with a
  reason on hover, or absent. Never present it and fail on click.

## Technical guardrails

- **Pagination or virtualization decided before the first table is built.**
  Rendering 5,000 rows works locally and dies on real data. Server-side
  pagination is the default; virtualize only when the UX genuinely needs one
  continuous scroll.
- **Filter and sort state lives in the URL.** Staff share links to filtered
  views; state trapped in React means they cannot.
- **Optimistic updates need a rollback path.** Show the failure, restore the
  prior value, keep the user's input.
- **Empty, loading, error and forbidden are four states**, and every data
  surface needs all four before it ships.

## Workflow overrides

1. Brief and direction proposal — who uses this daily, their one core job, the
   named lane. Sign-off, then DESIGN.md.
2. Tokens (`ui-craft-build` Phase 1).
3. **Build the hardest screen first** — the densest table or the most complex
   form. The login page proves nothing; the data grid is where the design
   system either holds or collapses.
4. Then nav, empty states and loading skeletons as ONE pass each, applied
   everywhere, before any single screen is called done.
5. Remaining screens: structure → polish → screenshot at 375/768/1440 → commit.

## Done

Base criteria, plus: the primary flow is completable by keyboard alone · every
table has hover, sort and sticky header · every data surface has all four
states · no action is visible-but-unauthorized · numbers and dates format
identically on every screen.

---
**This project:** [who uses it daily, their core job, roles, constraints]
