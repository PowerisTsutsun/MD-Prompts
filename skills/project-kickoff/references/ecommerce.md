# E-commerce / product site

*Catalog, cart, checkout. The only category where a visual inconsistency and a
reliability bug cost the same thing — a sale — and where the states nobody
enjoys designing are the ones that decide revenue.*

## Stack

Next.js 15 (App Router) · Vercel · Supabase (Postgres) + Drizzle ORM · Stripe.

- **Stripe Checkout or Elements only. Never handle raw card fields.** Touching
  card numbers directly moves the project into a PCI scope it cannot afford.
  Hosted components keep it at SAQ-A.
- **Stripe webhooks are the source of payment truth**, not the browser redirect.
  The customer closes the tab; the webhook still arrives. Build the fulfillment
  path on the webhook from the start.
- **Verify webhook signatures** and make the handler idempotent — Stripe retries,
  and a duplicate order is worse than a missing one.
- Product imagery through `next/image` or a real image CDN with per-breakpoint
  sizes. Catalog pages are image-bound; unoptimized product photos are the
  single largest performance cost in this category.

## Skills

- `taste` — if there is a reference retailer, extract its DNA first. Adapt, do
  not clone.
- `ui-ux-pro-max` — lock PLP, PDP, cart and checkout components as one set:
  ```bash
  python3 ~/.claude/skills/ui-ux-pro-max/scripts/search.py "<vertical> ecommerce retail" \
    --design-system --persist -p "<Project>"
  ```
- `impeccable` **or** `design-taste-frontend` — polish. One, for the project.

## DESIGN.md additions

Lane candidates: tactile-product-forward · editorial-retail · minimal-premium.

Also required for this category:

- **Photography and imagery treatment** — backdrop, crop ratio, retouch style,
  on-model versus flat, shadow treatment. Product photos are the dominant
  visual material on every page; leaving them undecided means the catalog
  decides the design for you, inconsistently.
- **The product card specification**, locked: image ratio, where price sits,
  where the badge sits, CTA position and behavior. This component appears
  hundreds of times; it cannot drift.
- **Badge vocabulary** — sale, new, low stock, sold out — and the rule for how
  many can appear at once.

## Anti-slop checklist

- **Do not default to the generic theme PDP** — image left, buy-box right,
  accordion below — without a reason tied to this catalog. It is the shape
  every platform template ships with, which is why every store looks the same.
- **Design the states that lose sales**, none of which get a generic toast:
  empty cart · out of stock · back-order · variant unavailable in the selected
  combination · payment declined · shipping unavailable to the entered address.
- **Checkout decisions are explicit, not defaulted:** guest checkout yes or no,
  shipping cost visible before the final step, and recovery copy that says what
  to try next on failure. Surprise cost at step four is the top abandonment
  cause in every study of this flow.
- **Product-card treatment is identical across every category page.** Price,
  badge and CTA never move between pages.
- **Variant selection shows availability inline** — a color swatch for a
  sold-out size should look sold out before it is clicked.
- **Reviews and ratings are specific or absent.** Five identical five-star
  quotes read as fabricated and cost more trust than an empty section.

## Technical guardrails

- **Inventory truth lives server-side and is re-checked at checkout.** A cart
  built from a cached availability value will sell things that no longer exist.
- **Cart persistence** decided up front: cookie, session, or account-bound, and
  what happens when a guest cart meets a login.
- **Price is computed server-side, always.** Never trust a price, quantity or
  discount that arrives from the client.
- **Tax and shipping** — how they are calculated and when they become visible —
  decided before checkout is built. Retrofitting tax logic reshapes the whole
  flow.
- **Accessibility on variant pickers.** Swatches are commonly rendered as
  unlabeled divs; they need real radio semantics, keyboard operation, focus
  states, and a text label that is not just a color.
- **Catalog performance:** paginate or infinite-scroll deliberately, lazy-load
  below the fold, and set explicit image dimensions so the grid does not
  reflow as photos arrive.
- **Order confirmation is a page and an email**, both designed, both containing
  what was bought and what happens next.

## Workflow overrides

1. Brief and direction proposal — who is buying, what makes this catalog
   distinct, the named lane. Sign-off, then DESIGN.md.
2. Tokens, then **lock the design system — PLP card, PDP layout, cart line item,
   checkout step — before populating real products.** Inconsistency compounds
   fastest in a catalog, because every fix is multiplied by the item count.
3. Build flow-by-flow in purchase order: browse → PDP → cart → checkout.
4. **Build each flow's failure states in the same pass as its happy path**, not
   as a later cleanup. They are the ones that get skipped otherwise.
5. Per flow: structure → polish → screenshot at 375/768/1440 → commit.
6. Run a real test purchase end-to-end in Stripe test mode, including a
   deliberately declined card and a webhook replay.

## Done

Base criteria, plus: a test purchase completes and fulfills via webhook · a
declined card produces a recoverable state with the cart intact · a replayed
webhook does not duplicate the order · every listed failure state is designed
and was actually triggered · product cards are identical across categories ·
variant pickers are keyboard-operable and labeled · the confirmation page and
email both render correctly.

---
**This project:** [who's buying, catalog size and type, constraints]
