# Marketing / landing page

*One page, one job, judged in three seconds. The only category where the
design IS the product experience, and the only one where a 200ms delay
measurably costs conversions.*

## Stack

Next.js 15 (App Router) · Vercel. **Skip Supabase and Drizzle entirely** unless
you are capturing leads or the copy is CMS-backed — then add them for the form
or content tables only. A landing page with a database it does not need is a
maintenance liability with no upside.

- Static-first: prerender everything. If a section needs client JS to render its
  text, that is a defect.
- Forms: a server action plus a rate limit beats a third-party form service for
  anything under a few hundred submissions a month.

## Skills

- `taste` — with a reference or competitor URL, run it first. Its extracted
  tokens and the reasoning behind them become raw material for DESIGN.md.
  **Adapt, never clone** — a copied competitor site is a worse failure than a
  generic one, because it is both derivative and legally interesting.
- `ui-ux-pro-max` — when there is no reference to work from:
  ```bash
  python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<product> <industry> landing" \
    --design-system --persist -p "<Project>"
  ```
- `stitch-utilities:taste-design` — alternative DESIGN.md scaffold (banned
  clichés, typography, layout rules).
- `impeccable` **or** `design-taste-frontend` — polish. One, for the project.

## DESIGN.md additions

Lane candidates: editorial · brutalist · warm-premium · technical-precision ·
quiet-luxury.

Also required for this category:

- **The thesis sentence.** The single most characteristic true thing about this
  product, in one line. The hero is built to deliver it. If it could describe a
  competitor, it is not the thesis yet.
- **Section list, with a reason per section.** Each section names the job it
  does. A section without a job gets cut before it is built.
- **Imagery treatment** — photography, illustration, type-only, or product
  screenshots — decided up front, since it drives the entire page's texture.

## Anti-slop checklist

- **Hero → three feature cards → testimonial carousel → CTA → footer is the
  template shape.** Every section earns its place or gets cut. Three cards
  because there are three real features, never because three fills the row.
- **The hero is a thesis, not a headline-subhead-button assembly.** Open with
  the most characteristic thing about the product.
- **No gradient-blob backgrounds** as default texture. No glassmorphism unless
  DESIGN.md argues for it.
- **Numbered 01/02/03 markers only for actual sequences**, never as decoration.
- **No stock-photo people, no generic isometric illustration sets.** Type,
  real product imagery, or nothing.
- **Real copy, written alongside the layout.** Placeholder copy produces
  placeholder design — the layout gets built around text that has no shape.
- **Social proof is specific or absent.** "Loved by teams everywhere" with five
  gray logos is worth less than one named quote.
- **One CTA verb, repeated.** If the hero says "Get started" and the footer
  says "Sign up free", the page is arguing with itself.

## Technical guardrails

- **Performance budget, checked not assumed:** LCP under 2.5s on a throttled
  4G profile. The hero image is the LCP element in most builds — size it, use
  `next/image` with `priority`, and preload the display font.
- **Fonts:** self-host or `next/font`, `font-display: swap`, subset to the
  characters used. A display face blocking first paint is the most common
  self-inflicted LCP failure.
- **CLS from animation.** Entrance animations that shift layout are a scored
  penalty, not just a taste issue. Animate `transform` and `opacity` only.
- **Metadata is part of the build**, not a follow-up: title, description,
  canonical, OG and Twitter cards with a real OG image, favicon set.
- **Analytics and consent** decided before launch, not bolted on. If a consent
  banner is required, design it — it is the first thing a visitor sees.
- **Forms:** honeypot or turnstile, server-side validation, a real success
  state, and an error state that preserves what was typed.

## Workflow overrides

1. Brief and direction proposal — audience, the page's one job, the thesis
   sentence, named lane. Sign-off, then DESIGN.md.
2. **Write the real copy next, before layout.** Headline, subhead, every
   section's body. Show it. Copy and layout are one design problem.
3. Tokens, then build the hero to finished quality and stop. Screenshot it.
   The hero decides whether the direction works; the rest is execution.
4. Remaining sections: structure → polish → screenshot at 375/768/1440.
5. Reduced-motion fallback for every scroll-triggered and hero animation.
6. Lighthouse or equivalent before calling it done.

## Done

Base criteria, plus: LCP under 2.5s throttled · CLS under 0.1 · the lane is
identifiable from a screenshot with the logo hidden · every section can name
its job · metadata and OG image render correctly in a link preview · the form
has success and error states that were actually triggered.

---
**This project:** [audience, the page's one job, thesis, constraints]
