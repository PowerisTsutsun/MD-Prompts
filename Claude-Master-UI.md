# Claude-Master-UI

Reusable bootstrap prompt for setting up an anti-slop UI environment in Claude Code, plus the standing ground rules I want enforced on every UI build.

Paste this into a fresh Claude Code session, or hand it to a Claude that will be doing UI work for me.

---

## What this installs

Four skills (one base + three opinionated layers) and one MCP server.

| # | Name | Source | Role |
|---|---|---|---|
| 1 | `frontend-design` | Anthropic official ([anthropics/skills](https://github.com/anthropics/skills/tree/main/skills/frontend-design)) | Base layer that the others build on |
| 2 | `impeccable` | [pbakaus/impeccable](https://github.com/pbakaus/impeccable) | Sub-commands: craft, shape, audit, critique, polish, harden, animate, distill, etc. |
| 3 | `design-taste-frontend` | [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) | "High-Agency Frontend" — DESIGN_VARIANCE, MOTION_INTENSITY, VISUAL_DENSITY dials |
| 4 | `ui-ux-pro-max` | [nextlevelbuilder/ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | 161-rule reasoning engine, design-system generator (requires Python 3) |
| MCP | `playwright` | [@playwright/mcp](https://www.npmjs.com/package/@playwright/mcp) | Real-browser screenshots, multi-breakpoint verification + design scraping |

> Skills 2, 3, and 4 are third-party. They're popular and active but not Anthropic-published — review the SKILL.md of each before using if that matters to you.

---

## Install protocol

Run these in order. Stop and report at any failure — do not improvise around an error.

### 0. Preconditions

```bash
# Required tools — abort if any missing
node --version          # 18+
npm --version
git --version
python3 --version || python --version   # only needed for ui-ux-pro-max design-system generator
```

### 1. Anthropic frontend-design (base layer)

```bash
mkdir -p /tmp/skills-install
git clone --depth 1 https://github.com/anthropics/skills /tmp/skills-install/anthropics-skills
cp -r /tmp/skills-install/anthropics-skills/skills/frontend-design ~/.claude/skills/frontend-design
```

### 2. impeccable

The README's install path (`dist/claude-code/.claude/`) does not exist in the repo. Real path is `.claude/skills/impeccable/` at the repo root.

```bash
git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/skills-install/impeccable
cp -r /tmp/skills-install/impeccable/.claude/skills/impeccable ~/.claude/skills/impeccable
```

### 3. design-taste-frontend (the "Taste" skill)

Use the Vercel Labs `skills` CLI. The skill's repo dir is named `taste-skill` but its frontmatter `name:` is `design-taste-frontend` — `-s` matches the frontmatter name, not the dir name.

```bash
npx -y skills add Leonxlnx/taste-skill -g -a claude-code -s design-taste-frontend -y
```

To install the full set (9 code variants + 3 image-gen) instead, use `--all`. Default install is the main `design-taste-frontend` only.

### 4. ui-ux-pro-max

`uipro-cli init` is project-scoped only — no `--global` flag. Workaround: install to a staging dir, then move into `~/.claude/skills/`.

```bash
mkdir -p /tmp/uipro-stage
cd /tmp/uipro-stage
npx -y uipro-cli init --ai claude
cp -r /tmp/uipro-stage/.claude/skills/* ~/.claude/skills/
```

### 5. Playwright MCP

If `claude` CLI is on PATH:
```bash
claude mcp add playwright npx @playwright/mcp@latest
```

If `claude` CLI is **not** on PATH (typical on Windows + VSCode-extension-only setups), edit `~/.claude.json` directly. Add this top-level key (or merge into an existing `mcpServers`):

```json
"mcpServers": {
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

After editing, validate the JSON is still parseable:
```bash
node -e "JSON.parse(require('fs').readFileSync(require('os').homedir()+'/.claude.json','utf8'))" && echo OK
```

### 6. Cleanup + verify

```bash
rm -rf /tmp/skills-install /tmp/uipro-stage
ls ~/.claude/skills/
# Expect: design-taste-frontend  frontend-design  impeccable  ui-ux-pro-max
```

### 7. Restart Claude Code

Skills register at startup. The MCP also initializes at startup. Restart the VSCode extension (or CLI) before relying on either.

After restart, confirm the Playwright MCP loaded by checking that tools prefixed `mcp__playwright__*` are available.

---

## Design reference library (for $20k-quality output)

Before building anything, scrape reference patterns from these sites using Playwright MCP. Don't build from memory or generic defaults — build from actual high-quality examples.

### Tier 1: Premium component libraries (scrape 2-3 of these first)

These have the highest design quality, best accessibility, and most thoughtful details.

| Site | What to extract | Stack | Why |
|------|----------------|-------|-----|
| [ui.shadcn.com](https://ui.shadcn.com) | Component patterns, accessibility | React + Tailwind | Industry standard, Radix UI primitives |
| [21st.dev](https://21st.dev) | Modern components, animations | React + Tailwind | Clean, premium feel, great motion |
| [magicui.design](https://magicui.design) | Animated components, effects | React + Tailwind + Framer Motion | Best-in-class animations |
| [originui.com](https://originui.com) | Clean component patterns | React + Tailwind | Minimal, production-ready |
| [getjustd.com](https://getjustd.com) | Polished UI primitives | React + Tailwind | Modern, accessible patterns |

### Tier 2: Design system references (for tokens and overall direction)

Study these for typography, color, spacing systems, and brand cohesion.

| Site | What to extract | Why |
|------|----------------|-----|
| [vercel.com/design](https://vercel.com/design) | Typography scale, spacing rhythm, Geist font system | Clean technical aesthetic, production quality |
| [linear.app/method](https://linear.app/method) | Color system, micro-interactions, empty states | Best-in-class product design |
| [stripe.com/docs](https://stripe.com/docs) | Documentation hierarchy, code examples, spacing | Gold standard for developer-facing UI |
| [primer.style](https://primer.style) | GitHub design system, dark mode approach | Technical minimalism, open source quality |

### Tier 3: Open source component collections (pick by aesthetic fit)

| Site | Aesthetic | Stack | Best for |
|------|-----------|-------|----------|
| [ui.aceternity.com](https://ui.aceternity.com) | Premium motion, gradients | React + Tailwind + Framer Motion | Marketing sites, portfolios |
| [cuicui.day](https://cuicui.day) | Modern, playful | React + Tailwind | Creative projects, fun interactions |
| [kokonutui.com](https://kokonutui.com) | Clean, component-focused | React + Tailwind | Dashboard, SaaS UI |
| [hextaui.com](https://hextaui.com) | Modern, animated | React + Tailwind | Portfolio, landing pages |
| [ui.indie-starter.dev](https://ui.indie-starter.dev) | Indie hacker aesthetic | React + Tailwind | Startup landing pages |
| [bundui.io](https://bundui.io) | Minimal, clean | React + Tailwind | Simple, focused UIs |
| [fancycomponents.dev](https://www.fancycomponents.dev) | Premium, polished | React + Tailwind | High-end marketing sites |
| [eldoraui.site](https://www.eldoraui.site) | Clean component library | React + Tailwind | General purpose UI |
| [ui.lndev.me](https://ui.lndev.me) | Developer-focused | React + Tailwind | Technical projects |
| [hover.dev](https://www.hover.dev) | Hover effects, micro-interactions | React + Tailwind | Interactive components |
| [atomix-ui.vercel.app](https://atomix-ui.vercel.app) | Atomic design patterns | React + Tailwind | Component systems |

### Tier 4: HTML/CSS libraries (for non-React projects or pure CSS patterns)

| Site | Stack | Best for |
|------|-------|----------|
| [hyperui.dev](https://www.hyperui.dev) | Tailwind | Marketing components, blocks |
| [preline.co](https://preline.co) | Tailwind | Business sites, dashboards |
| [html.tailus.io](https://html.tailus.io) | Tailwind | Static sites, blocks |
| [ui-layout.com](https://www.ui-layout.com) | Pure CSS | Layout patterns, grids |
| [ground.bossadizenith.me](https://ground.bossadizenith.me) | HTML + CSS | Minimal components |
| [flashui.site](https://flashui.site) | Tailwind | Quick prototypes |

### Tier 5: Inspiration galleries (for overall aesthetic direction)

| Site | Use when |
|------|----------|
| [godly.website](https://godly.website) | Need overall aesthetic direction (filter by industry) |
| [httpster.net](https://httpster.net) | Looking for editorial/minimal portfolio style |
| [siteinspire.com](https://siteinspire.com) | Browsing for layout inspiration |
| [awwwards.com](https://awwwards.com) | Seeking cutting-edge (but often impractical) design |

### Tier 6: Specific pattern libraries (scrape as needed for specific needs)

| Site | Pattern type |
|------|-------------|
| [uiverse.io](https://uiverse.io) | Micro-interactions (buttons, loaders, cards) |
| [reactcomponents.com](https://reactcomponents.com) | React component examples |
| [csslayout.io](https://csslayout.io) | Layout patterns (sidebar, masonry, split) |
| [animista.net](https://animista.net) | CSS animations with easing functions |
| [easings.net](https://easings.net) | Motion timing visualization |
| [ever-ui.com](https://www.ever-ui.com) | Component variations |

### Scraping workflow (run this BEFORE tokens phase)

```
Step 1: Gather references (15-20 minutes)
Primary sources (pick 2-3 from Tier 1):
- Use Playwright MCP to navigate to chosen sites
- Take full-page screenshots at 1440px
- Extract specific component screenshots (navbar, hero, cards, forms, buttons)
- Screenshot hover/focus/active states by using Playwright to trigger them
- Save to /project-root/design-references/tier1/

Design system references (pick 1-2 from Tier 2):
- Navigate to design system documentation
- Screenshot typography scales, color palettes, spacing systems
- Extract computed CSS values (font-size, line-height, letter-spacing, colors)
- Save to /project-root/design-references/systems/

Aesthetic reference (pick 1 from Tier 3 OR Tier 5):
- Find 2-3 sites that match the project's intended aesthetic
- Full-page screenshots at 1440px
- Save to /project-root/design-references/aesthetic/

Step 2: Extract patterns (10 minutes)
For each reference:
- Open browser dev tools via Playwright
- Inspect computed styles for:
  * Typography: font-family, font-size, font-weight, line-height, letter-spacing
  * Spacing: padding, margin, gap values (extract the scale/pattern)
  * Colors: exact hex/rgb values, identify tint direction for neutrals
  * Shadows: box-shadow values, layering approach
  * Radii: border-radius values, extract the scale
  * Motion: transition/animation properties, duration, easing
- Screenshot interaction states:
  * Hover (trigger :hover via Playwright)
  * Focus (trigger :focus-visible)
  * Active/pressed (trigger :active)
  * Disabled (if present)
- Document layout approach:
  * Grid columns and gaps
  * Breakpoint values
  * Container max-widths
  * Vertical rhythm (margin between sections)

Step 3: Synthesize direction doc (5-10 minutes)
Write a 1-2 page design direction doc with these sections:

1. Reference sources
   - List the 3-5 sites scraped and why each was chosen
   - Include paths to saved screenshots

2. Typography system
   - Display face: [name], loaded from [Google Fonts/Bunny Fonts/etc]
   - Body face: [name], loaded from [source]
   - Scale: base [16px], ratio [1.25/1.333/1.5], steps [12, 14, 16, 20, 24, 32, 40, 48]
   - Line heights: tight [1.1-1.2], normal [1.5], relaxed [1.75]
   - Tracking: display [-0.02em], body [0], small UI [+0.01em]
   - Source: adapted from [reference site]

3. Color system
   - Primary palette: [colors with hex values]
   - Neutral tint direction: [warm/cool/neutral], based on [reference]
   - Semantic tokens: success, warning, error, info
   - Dark mode approach: [how neutrals shift, saturation adjustments]
   - Source: inspired by [reference site]

4. Spacing scale
   - Base: [4px or 8px]
   - Scale: [0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 8, 12, 16, 24] (in rem)
   - Rhythm pattern: sections use [6-8 scale steps], components use [2-4]
   - Container max-width: [1280px/1440px/etc]
   - Source: measured from [reference site]

5. Motion system
   - Timing: micro [150-200ms], component [250-300ms], page [400ms]
   - Easing: default [cubic-bezier(0.4, 0, 0.2, 1)], specifics from [reference]
   - Stagger: list items [50-75ms offset]
   - Reduced motion: replaces animations with [instant/fade]
   - Source: extracted from [reference site] interactions

6. Specific patterns we're adapting
   - Navbar: [describe pattern, cite screenshot path]
   - Hero: [describe pattern, cite screenshot]
   - Cards: [describe pattern, cite screenshot]
   - Buttons: [describe states, cite screenshot]
   - Forms: [describe validation pattern, cite screenshot]
   - [Any other key patterns]

Stop and show me the direction doc + screenshots before generating tokens.
User must approve or request changes before proceeding to token generation.
```

### Quality bar: What $20k websites do differently

Real design teams at this price point:

1. **Custom typography pairing** — Not Inter everywhere. A distinctive display face (serif, condensed sans, mono) paired with a readable body face. Loaded from Google Fonts or Bunny Fonts, not system defaults.

2. **Intentional color systems** — Neutrals tinted toward the brand hue (warm grays for warm brands, cool grays for technical products). Semantic tokens (success, warning, error) derived from the palette, not Tailwind defaults.

3. **Sophisticated spacing** — Rhythm follows a consistent scale (1.25x or 1.5x multiplier) but varies contextually. Tight spacing in dense UI, generous spacing in marketing sections. Never uniform padding everywhere.

4. **Interaction details** — Every button has distinct hover, active, and focus states. Forms show validation inline. Loading states are designed, not just spinners. Empty states have illustration + actionable copy.

5. **Motion that earns its place** — Stagger animations on list items (50-100ms offset). Scroll-triggered reveals with intersection observer. Micro-interactions on important actions. Everything respects `prefers-reduced-motion`.

6. **Real hierarchy** — Not three sizes of the same weight. Use weight, tracking, and line-height contrast. Display text is tracked tight (-0.02em to -0.04em), small UI text is tracked wide (+0.01em to +0.02em).

7. **Accessible by default** — WCAG AA contrast (4.5:1 body, 3:1 UI), focus indicators that aren't `outline: none`, ARIA labels on icon-only buttons, semantic HTML.

8. **Cohesive asset quality** — If using icons, one library (lucide-react) used consistently. If using illustrations, one style maintained across all graphics. No mixing icon packs.

The difference between a $500 template and a $20k site is not features — it's 100 small decisions made consistently across every screen.

---

## How to invoke this stack on a UI build

Given a build request, run the skills in this order. Don't run them all at once — they'll talk over each other.

**Phase 0: Reference gathering (new, always run first)**
- Scrape 3-5 reference sites using Playwright MCP (see "Design reference library" above)
- Extract screenshots, computed styles, and interaction patterns
- Write the design direction doc citing specific references
- Wait for confirmation before proceeding

**Phase 1: Tokens** (`ui-ux-pro-max`)
- Generate the design system using the direction doc as input
- Spacing scale, type scale, color (semantic + primitive layers), radii, shadows, motion, breakpoints
- Show me the tokens file and wait for confirmation before building

**Phase 2: Build** (`frontend-design` + `design-taste-frontend` ambient)
- Components reference tokens, never magic values
- `design-taste-frontend`'s dials default to DESIGN_VARIANCE 8, MOTION_INTENSITY 6 — adjust if the project warrants it (dashboards lower variance, marketing higher)
- Build 3-5 core components first, show for review before scaling to full feature set

**Phase 3: Review** (`impeccable audit`)
- Run a real review pass with file:line citations and PASS/FAIL per item
- Apply the top 5 fixes, don't just report them
- Re-run audit to confirm fixes landed

**Phase 4: Verification** (Playwright MCP)
- Load at 1440 / 768 / 375
- Screenshot full-page at each breakpoint
- Test interaction states (hover on buttons, focus on inputs, open modals)
- Compare against reference screenshots from Phase 0
- Fix any breakage and re-screenshot until clean

---

## Standing ground rules (anti-slop)

These apply to every UI you build for me. Don't ask, just enforce.

**Layout**
- No centered-everything default. Centered is for a deliberate single-focal-point reason, not a fallback.
- No glassmorphism (frosted blur over a vague gradient) unless explicitly requested and justified.
- No "floating cards on a gradient" hero.
- Cards are the lazy answer. Use them when they're truly the right affordance. Nested cards are always wrong.
- Asymmetric layouts over symmetric when the content hierarchy supports it.

**Color**
- No pure `#000` on pure `#fff`. Tint neutrals toward the brand hue.
- No rainbow gradients on text or backgrounds (purple to pink to orange).
- No neon glow shadows.
- Dark mode is not inverted lightness — saturation dialed back, shadows reduced or replaced with borders.
- Gradients only when they serve hierarchy or brand identity. Avoid decorative-only gradients.

**Typography**
- Never use Inter, Roboto, Arial, or system-ui for display faces. Pick something distinctive.
- Hierarchy through scale + weight contrast (at least 1.25 ratio between steps). Three sizes of one weight is a fail.
- Body line-length 65–75ch. Don't let prose blocks span the container.
- No all-caps body text. Reserve for short labels (navigation, tags, metadata).
- Display text: tight tracking (-0.02em to -0.04em). Small UI text: wide tracking (+0.01em to +0.02em).

**Spacing**
- Every value comes from the defined scale. No `p-3` next to `p-5` next to `p-7` — pick a rhythm and hold it.
- Vary spacing for rhythm; same padding everywhere is monotony.
- Sections should breathe. Use generous vertical spacing between major sections (80px–120px desktop, 48px–64px mobile).

**Iconography**
- No emoji as icons. Use lucide-react or hand-drawn SVG.
- Don't put an icon on every button. Most buttons read better as just text.
- Icon size should match surrounding text metrics (1em or 1.2em for inline, fixed px for standalone).

**Motion**
- `prefers-reduced-motion` respected universally.
- Micro-interactions 150–250ms. Page-level 250–400ms.
- No bounce / elastic easing on UI elements. Ease-out exponentials (quart, quint, expo) preferred.
- Stagger animations on lists: 50–100ms offset between items, max 6 items or it reads as slow.
- Scroll-triggered animations fire once at 20% viewport entry, not on every scroll.

**Microcopy**
- No "Welcome to your dashboard!", no "Let's get started!", no "Awesome!".
- No "Lorem ipsum" — write real copy, even for placeholders.
- Button labels are verbs that describe the action. "Submit" is lazy. "Save changes", "Send message", "Create account" are clear.
- Empty / error messages tell the user what to do, not just what failed.
- Casual, first-person, student-engineer voice. No corporate-speak or AI-sounding phrasing.

**Interaction states (the test that separates good from generic)**
- Every interactive element has hover, active, focus-visible, and disabled states designed explicitly.
- Focus indicators are not `outline: none`. Use a visible ring or underline.
- Hover states are subtle (opacity 0.8–0.9 or slight background shift), not dramatic.
- Active/pressed states provide tactile feedback (scale 0.98 or brightness drop).
- Loading states show progress or spinner, not just disabled buttons.

**Engineering hygiene that affects design**
- Tokens live in one file (`lib/design-tokens.ts` or similar) and feed both Tailwind config and CSS variables. No magic numbers in component code.
- Every interactive element has a `:focus-visible` style — not the default that gets reset to `none`.
- Hit targets at least 40×40px (44px on mobile).
- Loading states exist for async actions. Empty states exist for any list that can be empty.
- Semantic HTML: headings in order (h1, h2, h3), buttons for actions, links for navigation, forms with labels.

**Accessibility (non-negotiable)**
- WCAG AA contrast minimum: 4.5:1 for body text, 3:1 for UI components, 7:1 for small text if aiming for AAA.
- All icon-only buttons have `aria-label` or `sr-only` text.
- Form inputs have associated labels (explicit `for` attribute or wrapping label).
- Color is never the only indicator of state (use icons, text, or patterns as backup).
- Keyboard navigation works: tab order is logical, focus is always visible, no keyboard traps.

**File organization**
- Components in `components/ui/` for primitives (button, input, card), `components/sections/` for page sections (hero, features, pricing).
- Shared utilities in `lib/utils.ts`, design tokens in `lib/design-tokens.ts`.
- Each component file includes types, the component, and any variants. No splitting into separate type files unless the types are shared across 3+ components.

**On asking permission**
- Don't ask before applying these rules. They're standing.
- Do ask before adding dependencies, deleting files, running migrations, or committing.
- If a rule conflicts with a specific project requirement, flag it and ask which takes priority.

---

## When the build is "done"

Done = all of these are true:

1. `impeccable audit` passes (or remaining FAILs are acknowledged with a reason and documented)
2. Playwright screenshots at all three breakpoints (1440 / 768 / 375) look right
3. Reference comparison: side-by-side screenshot with one Tier 1 reference site shows comparable quality
4. Dev server is reachable and interactive states (hover, focus, click) work as expected
5. No console errors, no accessibility violations flagged by axe or similar

Don't claim done from looking at the code alone. Visual verification is mandatory.

---

## Quick reference: skill command map

| Command | When to use | What it does |
|---------|-------------|--------------|
| `impeccable craft` | Full build from scratch | Shape → tokens → build → review cycle |
| `impeccable audit` | Review existing code | File:line citations, PASS/FAIL checklist |
| `impeccable critique` | UX/design review | Hierarchy, clarity, emotional resonance |
| `impeccable polish` | Final pass before shipping | Design system alignment, micro-details |
| `impeccable extract` | Refactor duplicated patterns | Pull into reusable components |
| `impeccable distill` | Simplify over-complex UI | Strip to essence, reduce noise |
| `impeccable animate` | Add purposeful motion | Micro-interactions, scroll reveals |
| `impeccable harden` | Edge cases + resilience | Error states, empty states, loading, i18n |

Playwright MCP commands are prefixed `mcp__playwright__*` — use for navigation, screenshots, and interaction testing.

---

## Troubleshooting

**Skills not loading after install**
- Restart Claude Code completely (close VSCode, reopen)
- Check `~/.claude/skills/` contains all four skill directories
- Each skill dir must have a `SKILL.md` file at the root

**Playwright MCP not connecting**
- Validate `~/.claude.json` is valid JSON (run the node validation command from step 5)
- Restart Claude Code after editing the config
- Check Claude Code logs for MCP connection errors

**ui-ux-pro-max design-system generator failing**
- Ensure Python 3 is on PATH: `python3 --version` or `python --version`
- The generator script is at `~/.claude/skills/ui-ux-pro-max/scripts/design_system.py`
- If it's missing, re-run the `uipro-cli init` step

**Reference scraping hitting rate limits**
- Add delays between Playwright navigation calls (500ms–1s)
- Some sites (like Vercel) may block headless browsers — use `--headless=false` flag
- Cache screenshots locally to avoid re-scraping the same site

---

## Version history

- **v2.0** (current): Added design reference scraping, $20k quality standards, expanded ground rules
- **v1.0**: Initial four-skill + Playwright MCP setup