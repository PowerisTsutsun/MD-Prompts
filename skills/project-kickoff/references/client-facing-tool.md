# Client-facing tool

*Staff-facing tools built for and with an external client. The distinguishing
constraint is not technical: someone who is paying will judge this, in a demo,
against expectations you did not set.*

## Stack

Next.js 15 (App Router) · Vercel · Neon or Supabase (Postgres) + Drizzle.

- **AI-assisted intake:** Azure AI Foundry — Whisper for transcription, a
  GPT-4o-class vision model for document extraction. Confirm the client's data
  residency and retention requirements *before* wiring any model, not after;
  for a regulated client this can invalidate the whole approach.
- **Auth:** staff-facing usually means internal RBAC over public signup. Confirm
  explicitly whether a customer-facing surface exists at all — assuming it does
  not is a common and expensive misread of the brief.
- **Audit trail from day one.** Who changed what, when, and whether a human or
  a model proposed it. Retrofitting an audit log after a client asks for one
  means backfilling history you never recorded.

## Skills

- `ui-ux-pro-max` — structure pass.
- `impeccable` **or** `design-taste-frontend` — polish. One, for the project.
- `taste` — if the client supplied a brand reference site, extract its real
  design system before drafting DESIGN.md, so the tool sits inside their visual
  language rather than next to it.

## DESIGN.md additions

Lane candidates: quiet-luxury editorial · trustworthy-clinical ·
warm-professional. Pick from the client's actual brand vertical — "enterprise
SaaS blue" is a default, not a decision.

Also required for this category:

- **The client's existing brand constraints** — logo, palette, type — and
  explicitly which of them are binding versus advisory.
- **The AI-versus-human visual language**, if any model output surfaces in the
  UI: how a suggested value looks different from a verified one, everywhere.
- **Tone of voice** for empty states, errors and confirmations. One
  inconsistent screen undercuts the trust every other screen built.

## Anti-slop checklist

- **Do not let it read as a generic CRUD admin panel** when the brief calls for
  something the client's own staff or customers will judge as premium. The
  client is not comparing it to other internal tools; they are comparing it to
  the last polished product they used.
- **Every AI-suggested action needs a human confirm gate** — matched record,
  extracted field, drafted reply. Never auto-apply, never auto-submit. The
  first time a model silently writes something wrong into a client's data, the
  project's credibility is spent.
- **AI-suggested and human-verified data stay visually distinct everywhere**,
  not just on the screen where the feature was demoed.
- **Show the model's confidence and its source.** A extracted field should be
  traceable to the region of the document it came from; a low-confidence
  extraction should look different from a high-confidence one.
- **Error copy is written for the client's staff**, in their vocabulary, not in
  engineering terms. "Couldn't reach the mail server — retry, or enter this
  manually" beats a status code.
- **No half-built screen in a demo path.** A visibly unfinished area teaches the
  client to distrust the finished ones.

## Technical guardrails

- **PII discipline.** Know what personal data flows through, where it lands, and
  what leaves the tenancy. Model inputs count as leaving. Redact in logs.
- **Idempotency on anything that sends, charges or writes externally.** Staff
  double-click, networks retry, and a duplicate outbound email to the client's
  customer is a visible failure.
- **Rate-limit and budget-cap model calls.** A loop over a document set can burn
  a month's spend in an afternoon.
- **Long operations need real progress**, resumability and a failure state that
  keeps partial work. Transcription and extraction are slow; a spinner that
  runs for ninety seconds reads as broken.
- **Test with the client's actual data shapes** — their weird filenames, their
  scanned-sideways PDFs, their duplicate records. Clean seed data hides every
  interesting failure.

## Workflow overrides

1. Brief and direction proposal — who the client is, what their staff's core
   job is, the named lane. Sign-off, then DESIGN.md.
2. **Seed a demo scenario before building screens.** One named example record —
   a customer, a case, whatever the domain object is — that threads through the
   entire flow. Every screen gets built against it. A stakeholder demo should
   tell a complete story in under two minutes, not click through empty tables.
3. Build the demo path end-to-end first, thin but complete, then deepen. A
   narrow finished path demos far better than five half-built screens.
4. Per screen: structure → polish → screenshot at 375/768/1440 → commit.
5. **Walk the demo scenario end-to-end before every client checkpoint**, not
   just before the final one.

## Done

Base criteria, plus: the demo scenario runs start to finish without a dead end ·
every AI-proposed value has a confirm gate and a visible confidence or source ·
suggested and verified data are distinguishable on every screen · an audit
record exists for every write · error and empty copy share one voice · the tool
has been run against real client-shaped data, not seeds.

---
**This project:** [client name and vertical, staff's core job, data constraints]
