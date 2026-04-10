# MASTER PROJECT TEMPLATE v2 — Claude Code Starter Kit

> **Usage**: Feed this prompt to Claude Code at the start of any new project.
> It scaffolds a production-ready Next.js app with a full Claude Code harness
> (CLAUDE.md, DESIGN.md, agents, commands, hooks, MCP) and a visual QA loop
> via Playwright so every component gets verified in a real browser.

---

## 0 — Design research workflow (run before scaffolding)

Before writing any code, study real sites to establish the visual direction.
Use the Playwright MCP server to browse these reference galleries and extract
patterns, layouts, color systems, and motion ideas:

### Reference sites to study

| Site | What to extract |
|------|----------------|
| [godly.website](https://godly.website/) | Hero layouts, page rhythm, scroll choreography, full-page compositions |
| [21st.dev/community/components](https://21st.dev/community/components) | Individual component patterns — cards, navbars, CTAs, feature grids |
| [lookup.design](https://lookup.design/) | Specific UI patterns by category — pricing tables, dashboards, onboarding flows |
| [Screenlane (via PlusUI)](https://www.plusuidesign.com/resources/screenlane) | Mobile + responsive patterns, real-world app screens |
| [Google Stitch](https://stitch.withgoogle.com/) | Extract DESIGN.md from any URL — portable design system in markdown |

### How to use these references

1. **Browse with Playwright MCP**: Open each gallery site in the browser, navigate
   to relevant categories, screenshot patterns you want to emulate
2. **Extract a DESIGN.md from Stitch**: If you have a reference URL whose aesthetic
   you want to match, use Stitch to extract its design system as DESIGN.md, or
   grab one from [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md)
3. **Capture specifics**: Save screenshots of layouts, hover states, spacing patterns,
   and animation timing you want to replicate
4. **Write the DESIGN.md**: Encode everything into the project's DESIGN.md file
   (see section 3 for the format)

> **The goal**: No component should be built from imagination alone. Every UI
> decision should trace back to a real reference or an intentional design rule
> documented in DESIGN.md.

---

## 1 — What to build

Create a production-ready starter template for a modern web application.
The template must be immediately usable for real projects — not a demo.

### Tech stack

- Next.js 14+ (App Router)
- React 18+
- TypeScript (strict mode)
- Tailwind CSS
- shadcn/ui (install only the components used)
- Framer Motion for animation
- pnpm as the package manager

### Design direction

Do NOT use the default AI SaaS look (purple/blue gradients on white, Inter font,
generic card grids, predictable hero-subtext-CTA stacks).

Before choosing any visual direction, consult the DESIGN.md file. If none exists
yet, create one using the format in section 3, drawing from the reference sites above.

The aesthetic should feel:
- Intentional — every spacing, color, and motion choice is deliberate
- Premium — like Linear, Raycast, or Vercel, not like a Tailwind template
- Distinctive — someone should be able to tell this apart from other AI-built UIs
- Restrained — motion and effects serve hierarchy, not decoration

---

## 2 — Project structure to generate

```
project-root/
├── CLAUDE.md                        # Project memory (concise, <150 lines)
├── DESIGN.md                        # Design system (Stitch-compatible format)
├── AGENTS.md                        # Cross-tool agent instructions
├── .claude/
│   ├── settings.json                # Hooks, permissions, env
│   ├── settings.local.json          # Personal overrides (gitignored)
│   ├── scripts/
│   │   └── save-session.sh          # Session logging hook script
│   ├── session-logs/                # Auto-saved session transcripts (gitignored)
│   │   └── INDEX.md                 # Rolling index of all sessions
│   ├── agents/
│   │   ├── code-reviewer.md         # Reviews diffs for quality + security
│   │   ├── ui-reviewer.md           # Checks design consistency via DESIGN.md
│   │   ├── visual-qa.md             # Opens browser, screenshots, compares to refs
│   │   └── researcher.md            # Investigates before implementation
│   ├── commands/
│   │   ├── scaffold-feature.md      # /project:scaffold-feature
│   │   ├── pr-review.md             # /project:pr-review
│   │   ├── test-and-lint.md         # /project:test-and-lint
│   │   ├── visual-check.md          # /project:visual-check
│   │   └── design-audit.md          # /project:design-audit
│   └── skills/
│       └── design-system/
│           └── SKILL.md             # Points to DESIGN.md, component patterns
├── .mcp.json                        # MCP server configuration
├── .env.example                     # Required environment variables (including MCP credentials)
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout with providers + fonts
│   │   ├── page.tsx                 # Landing page (animated hero, cards)
│   │   ├── (marketing)/             # Public pages group
│   │   │   └── page.tsx
│   │   ├── (dashboard)/             # Authenticated pages group
│   │   │   ├── layout.tsx           # Dashboard shell (sidebar, nav)
│   │   │   └── page.tsx             # Dashboard home
│   │   └── api/
│   │       ├── health/route.ts      # Health check endpoint
│   │       └── ai/chat/route.ts     # AI endpoint stub (provider-agnostic)
│   ├── components/
│   │   ├── ui/                      # shadcn/ui components (auto-managed)
│   │   ├── shared/                  # Cross-feature components
│   │   │   ├── nav.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── empty-state.tsx
│   │   │   └── page-transition.tsx
│   │   ├── landing/                 # Landing page sections
│   │   │   ├── hero.tsx
│   │   │   ├── feature-cards.tsx
│   │   │   └── cta.tsx
│   │   └── dashboard/               # Dashboard components
│   │       ├── sidebar.tsx
│   │       ├── stat-card.tsx
│   │       └── activity-feed.tsx
│   ├── lib/
│   │   ├── utils.ts                 # cn() helper, shared utilities
│   │   ├── fonts.ts                 # Font configuration
│   │   └── motion.ts               # Framer Motion presets & variants
│   ├── hooks/                       # Custom React hooks
│   ├── types/                       # Shared TypeScript types
│   └── styles/
│       └── globals.css              # Tailwind base + CSS custom properties
├── docs/
│   ├── ARCHITECTURE.md              # How the codebase is organized
│   ├── SCALING.md                   # Notes for growing the project
│   └── MOTION_SYSTEM.md             # Animation conventions
└── .design-refs/                    # Reference screenshots (gitignored)
    └── .gitkeep
```

---

## 3 — DESIGN.md (Stitch-compatible format)

Generate a complete DESIGN.md at the project root following this structure.
This file is the single source of truth for all visual decisions. Every agent,
skill, and component must defer to it.

```markdown
# Design System

## Overview
[1-3 sentences: product type, audience, mood. Example: "Developer tool for
infrastructure teams. The interface should feel precise, fast, and quietly
powerful — like a well-made instrument."]

## Visual Theme & Atmosphere
[Qualitative description that gives the agent calibration beyond tokens.
Example: "Dark surfaces with restrained warmth. Nothing glows. Nothing bounces.
Depth comes from layered surfaces and subtle shadow, not gradients or blur.
The UI should feel like it was carved, not painted."]

## Colors

### Palette
- **Background**: #0A0A0B — primary canvas
- **Surface**: #141416 — cards, panels, elevated layers
- **Surface Raised**: #1C1C1F — hover states, active surfaces
- **Border**: #27272A — subtle separators (use sparingly)
- **Text Primary**: #FAFAFA — headings, primary content
- **Text Secondary**: #A1A1AA — labels, captions, metadata
- **Text Muted**: #52525B — placeholder, disabled
- **Accent**: #E2C07C — primary actions, links, key highlights
- **Accent Hover**: #D4A853 — hover state for accent
- **Success**: #4ADE80
- **Warning**: #FBBF24
- **Error**: #F87171

### Color rules
- Never use raw hex values in components — always reference CSS custom properties
- Accent color appears ONLY on primary CTAs, active nav items, and key data
- No colored backgrounds on sections — use surface layering instead
- Borders are optional, not default — prefer shadow or spacing for separation

## Typography

### Font stack
- **Display**: [chosen display font, e.g. "Geist" or "Satoshi"] — headings, hero text
- **Body**: [chosen body font, e.g. "Geist" or "Inter var"] — paragraphs, UI text
- **Mono**: "Geist Mono" or "JetBrains Mono" — code, data, technical content

### Type scale
- Hero: 56px / 700 / -0.02em tracking / 1.1 line-height
- H1: 40px / 700 / -0.02em / 1.15
- H2: 30px / 600 / -0.015em / 1.2
- H3: 22px / 600 / -0.01em / 1.3
- Body: 16px / 400 / 0 / 1.6
- Small: 14px / 400 / 0 / 1.5
- Caption: 12px / 500 / 0.02em / 1.4

### Typography rules
- Never use more than 2 font families on one screen
- Headings use tight tracking (negative letter-spacing)
- Body text uses natural tracking (0 or slightly positive)
- All caps only for labels/badges, never for headings

## Spacing

### Scale
- Base unit: 4px
- Scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128px
- Section padding: 96px (desktop), 64px (tablet), 48px (mobile)
- Card padding: 24px standard, 32px featured
- Component gap: 12px-16px internal, 24px-32px between groups

### Layout rules
- Max content width: 1280px for marketing, 1536px for dashboard
- Use consistent vertical rhythm — sections should feel evenly paced
- Generous whitespace between sections; dense spacing within components

## Components

### Buttons
- Primary: accent bg, dark text, 8px radius, 44px height, 600 weight
- Secondary: transparent, border, 8px radius, 44px height
- Ghost: no border, text only, hover shows surface-raised bg
- All buttons: 160ms transition, subtle scale(0.98) on active

### Cards
- Surface bg, no border by default, 12px radius
- 1px border only on hover (border color)
- Shadow: 0 1px 2px rgba(0,0,0,0.3) resting, deepen on hover
- Content padding: 24px

### Inputs
- Surface bg, 1px border, 8px radius, 44px height
- Focus: accent border (1px), no glow/ring
- Placeholder: text-muted color

### Navigation
- Fixed top, surface bg with backdrop-blur
- Active item: accent color text or underline
- Hover: surface-raised bg, 150ms transition

## Motion

### Principles
- Motion is functional, never decorative
- Default duration: 200ms for micro-interactions, 400-600ms for reveals
- Default easing: cubic-bezier(0.16, 1, 0.3, 1) — fast in, gentle out
- Respect prefers-reduced-motion: disable all animation

### Presets (defined in src/lib/motion.ts)
- fadeInUp: y:20→0, opacity:0→1, 500ms
- staggerContainer: staggerChildren 0.08s, delayChildren 0.1s
- scaleOnHover: scale 1→1.02, 200ms
- pageTransition: opacity cross-fade, 250ms

### Motion rules
- Never animate layout properties (width, height, top, left) — use transform + opacity
- Stagger reveals top-to-bottom, never random
- No bounce, no overshoot, no elastic easing
- One reveal animation per scroll viewport — don't re-trigger

## Do's and Don'ts

### Do
- Use surface layering for depth (bg → surface → surface-raised)
- Let typography create hierarchy before reaching for visual effects
- Keep interactive states subtle (opacity, surface shift) not dramatic
- Use accent color sparingly — it should draw the eye to exactly one thing per viewport

### Don't
- Don't use gradients for backgrounds or buttons
- Don't use blur/glass effects as primary surface treatment
- Don't use colored shadows or glowing borders
- Don't use more than 3 font sizes on a single screen
- Don't center-align body text
- Don't use icon-only buttons without aria-labels
- Don't use animation durations over 800ms
```

> **To customize**: Replace the color palette, fonts, and component specs above
> with values extracted from your reference sites or Stitch. The structure stays
> the same — only the values change per project.

---

## 4 — Claude Code harness files

### CLAUDE.md

Keep this under 150 lines. Point to DESIGN.md and docs instead of duplicating.

```markdown
# Project: [name]

## Quick reference
- Package manager: pnpm
- Dev server: pnpm dev
- Build: pnpm build
- Lint: pnpm lint
- Type check: pnpm typecheck
- Test: pnpm test

## Architecture
- Next.js App Router in src/app/
- Components organized by feature in src/components/[feature]/
- Shared components in src/components/shared/
- All visual decisions live in DESIGN.md — read it before touching any UI
- Motion presets in src/lib/motion.ts — always use these, don't inline variants
- API routes are provider-agnostic stubs — easy to swap backends

## Design rules (defer to DESIGN.md for specifics)
- All colors from CSS custom properties — never hardcode hex values
- All motion from src/lib/motion.ts presets — never define variants inline
- All spacing from Tailwind scale — no arbitrary values like p-[13px]
- Before building any component, check DESIGN.md for matching patterns
- Use /project:visual-check after building UI to verify in browser

## Code rules
- Named exports only (except page/layout files)
- Prefer server components; add "use client" only when needed
- Never commit secrets — .env files are gitignored
- Run `pnpm typecheck` before committing
- New components get their own file — no multi-component files
- All interactive elements need keyboard + screen reader support

## Finding things
- Design system: DESIGN.md (project root)
- Design skill: .claude/skills/design-system/SKILL.md
- Architecture docs: docs/ARCHITECTURE.md
- Motion conventions: docs/MOTION_SYSTEM.md
- Subagents: .claude/agents/ (code-reviewer, ui-reviewer, visual-qa, researcher)
- Slash commands: .claude/commands/
- Reference screenshots: .design-refs/
- Session logs: .claude/session-logs/ (search here before re-debugging old issues)
- MCP servers: .mcp.json (Playwright, Figma, GitHub, Filesystem, Context7, Sequential Thinking)
```

### .mcp.json

All five essential MCP servers are included by default. Credentials go in `.env`
and are referenced via the `env` field — never hardcoded.

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"],
      "description": "Browser automation for visual QA, scraping reference sites, and testing flows in a real browser"
    },
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp",
      "description": "Design-to-code: read Figma frames, extract tokens, use Code Connect for component reuse, and push Code to Canvas"
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_PAT}"
      },
      "description": "Repo/PR/issue awareness: create branches, review diffs, manage issues, search code"
    },
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "."],
      "description": "Structured read/write access to the project directory for deep context and file operations"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "description": "Up-to-date library docs (Next.js, React, Tailwind, shadcn, Framer Motion) injected directly into context"
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "description": "Step-by-step reasoning for complex planning, architecture decisions, and multi-step debugging"
    }
  }
}
```

#### MCP setup notes

| Server | Auth required | Setup |
|--------|--------------|-------|
| **Playwright** | None | `npx playwright install chromium` on first use |
| **Figma** | OAuth via Figma plugin | `claude plugin install figma@claude-plugins-official` — or enable Dev Mode MCP in Figma Desktop Preferences and add the local SSE endpoint instead |
| **GitHub** | PAT with `repo` + `read:org` scopes | Add `GITHUB_PAT` to `.env`, reference via `${GITHUB_PAT}` in config |
| **Filesystem** | None | Scoped to project root (`.`) by default — expand paths as needed |
| **Context7** | None | Works out of the box |
| **Sequential Thinking** | None | Works out of the box |

> **Add as needed per project:**
> - `@modelcontextprotocol/server-postgres` — database queries (use a read-only user)
> - Vercel MCP — deployment management (connect via claude.ai connectors)
> - Sentry MCP — error tracking
> - Stitch MCP/SDK — generate UI designs, extract DESIGN.md from URLs
>
> Always pass credentials via `env` field, never CLI args. Never commit `.env` files.

### .claude/settings.json

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "if": "Edit(*.ts) || Edit(*.tsx)",
        "command": "pnpm exec eslint --fix --no-warn-ignored ${file} 2>/dev/null || true",
        "timeout": 10000
      }
    ],
    "PreToolUse": [
      {
        "if": "Bash(git push *)",
        "command": "pnpm typecheck && pnpm lint",
        "timeout": 30000
      },
      {
        "if": "Bash(rm -rf *)",
        "command": "echo 'BLOCKED: destructive command' && exit 1",
        "timeout": 1000
      }
    ],
    "PreCompact": [
      {
        "command": "bash .claude/scripts/save-session.sh pre-compact",
        "timeout": 5000
      }
    ],
    "SessionEnd": [
      {
        "command": "bash .claude/scripts/save-session.sh session-end &",
        "timeout": 5000
      }
    ],
    "Stop": [
      {
        "command": "bash .claude/scripts/save-session.sh stop",
        "timeout": 5000
      }
    ]
  },
  "permissions": {
    "allow": [
      "Edit",
      "Read",
      "Glob",
      "Grep",
      "Bash(pnpm *)",
      "Bash(git diff *)",
      "Bash(git log *)",
      "Bash(git status)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(cat *)",
      "Bash(ls *)",
      "Bash(mkdir *)",
      "Bash(npx shadcn@latest add *)",
      "Bash(npx playwright install *)",
      "Bash(bash .claude/scripts/*)",
      "mcp__playwright__*",
      "mcp__figma__*",
      "mcp__github__*",
      "mcp__filesystem__*",
      "mcp__context7__*",
      "mcp__sequential-thinking__*"
    ],
    "deny": [
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(rm -rf /)"
    ]
  },
  "env": {
    "NODE_ENV": "development"
  }
}
```

### .claude/scripts/save-session.sh

This hook script saves session transcripts on every compaction, stop, and session
end. Bug fixes, architecture decisions, and debugging breakthroughs are preserved
so you never burn tokens re-solving the same problem.

```bash
#!/bin/bash
# Save Claude Code session transcript for future reference.
# Called by hooks: PreCompact, Stop, SessionEnd
# Usage: save-session.sh <event-type>

set -euo pipefail

EVENT="${1:-unknown}"
HOOK_DATA=$(cat 2>/dev/null || echo '{}')

# Extract session info from hook JSON input
SESSION_ID=$(echo "$HOOK_DATA" | jq -r '.session_id // "unknown"' 2>/dev/null || echo "unknown")
TRANSCRIPT_PATH=$(echo "$HOOK_DATA" | jq -r '.transcript_path // empty' 2>/dev/null || echo "")

# Create session log directory
LOG_DIR=".claude/session-logs"
mkdir -p "$LOG_DIR"

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$LOG_DIR/${TIMESTAMP}_${EVENT}_${SESSION_ID:0:8}.md"

# Build the log entry
{
  echo "# Session Log"
  echo ""
  echo "- **Date**: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "- **Event**: $EVENT"
  echo "- **Session**: $SESSION_ID"
  echo "- **Branch**: $(git branch --show-current 2>/dev/null || echo 'unknown')"
  echo "- **Dirty files**: $(git diff --name-only 2>/dev/null | wc -l | tr -d ' ')"
  echo ""

  # Capture what changed in this session
  if [ "$(git diff --name-only 2>/dev/null | wc -l)" -gt 0 ]; then
    echo "## Files modified (uncommitted)"
    echo '```'
    git diff --name-only 2>/dev/null || true
    echo '```'
    echo ""
  fi

  # Capture recent commits from this session
  RECENT_COMMITS=$(git log --oneline --since="2 hours ago" 2>/dev/null | head -10)
  if [ -n "$RECENT_COMMITS" ]; then
    echo "## Recent commits"
    echo '```'
    echo "$RECENT_COMMITS"
    echo '```'
    echo ""
  fi

  # If transcript exists, save a pointer to it
  if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
    echo "## Transcript"
    echo "Full transcript: \`$TRANSCRIPT_PATH\`"
    echo ""
    # Save token-efficient summary: first and last 50 lines
    echo "### First 50 lines"
    echo '```'
    head -50 "$TRANSCRIPT_PATH" 2>/dev/null || true
    echo '```'
    echo ""
    echo "### Last 50 lines"
    echo '```'
    tail -50 "$TRANSCRIPT_PATH" 2>/dev/null || true
    echo '```'
  fi
} > "$LOG_FILE" 2>/dev/null

# Maintain a rolling index of all sessions
INDEX_FILE="$LOG_DIR/INDEX.md"
echo "| $TIMESTAMP | $EVENT | ${SESSION_ID:0:8} | $(git branch --show-current 2>/dev/null || echo '-') | $LOG_FILE |" >> "$INDEX_FILE" 2>/dev/null

exit 0
```

#### Session log conventions

- Logs are saved to `.claude/session-logs/` (add to `.gitignore` if private,
  or commit if you want team-shared debugging history)
- **PreCompact** captures the full context before compaction destroys it
- **Stop** captures state when Claude finishes a task
- **SessionEnd** captures everything when you close the session
- The `INDEX.md` file gives you a quick searchable table of all sessions
- To find a past bug fix: `grep -r "error message" .claude/session-logs/`
- To resume a session: `claude --resume <session-id>` using the ID from the log

---

## 5 — Agents

### .claude/agents/code-reviewer.md

```markdown
---
name: code-reviewer
description: Reviews code changes for quality, security, and consistency
tools: Read, Grep, Glob, Bash
model: sonnet
maxTurns: 10
---

You are a senior engineer reviewing a diff. Check for:

- TypeScript strict compliance (no `any`, no type assertions without justification)
- Security issues (injection, secrets, XSS, auth gaps)
- Missing error handling and edge cases
- Component files that export more than one component
- Inline Framer Motion variants (should use presets from lib/motion.ts)
- Default exports where named exports are expected
- Missing accessibility attributes on interactive elements
- Hardcoded hex colors (should use CSS custom properties per DESIGN.md)
- Arbitrary Tailwind values like p-[13px] (should use the spacing scale)

Report findings with file paths and line references. Suggest fixes.
```

### .claude/agents/ui-reviewer.md

```markdown
---
name: ui-reviewer
description: Checks UI components against DESIGN.md for visual consistency
tools: Read, Grep, Glob
model: sonnet
maxTurns: 8
---

You are a design systems engineer. Before reviewing, read DESIGN.md at the project root.

Check all UI changes against DESIGN.md for:

- Color usage matches the palette (no hardcoded hex, correct semantic usage)
- Accent color usage is restrained (only primary CTAs, active states, key data)
- Typography follows the type scale (correct sizes, weights, tracking)
- Spacing follows the documented scale (no arbitrary values)
- Component patterns match DESIGN.md specs (button heights, card radius, input styles)
- Motion uses presets from lib/motion.ts (matches DESIGN.md motion rules)
- Do's and Don'ts from DESIGN.md are respected
- Interactive elements have focus-visible styles
- Components are responsive (check mobile breakpoints)
- Empty states are handled, not just the happy path

Flag deviations with file paths, the violated DESIGN.md rule, and recommended fix.
```

### .claude/agents/visual-qa.md

```markdown
---
name: visual-qa
description: Uses Playwright to open the app in a real browser and verify UI visually
tools: Read, Bash, mcp__playwright__*
model: sonnet
maxTurns: 15
---

You are a visual QA engineer. Use the Playwright MCP server to verify UI in a real browser.

Workflow:
1. Ensure the dev server is running (check with `curl -s http://localhost:3000/api/health`)
2. If not running, start it with `pnpm dev &` and wait for ready
3. Use Playwright to navigate to the target page
4. Take a screenshot of the full page
5. Check specific components by navigating to their sections
6. Verify against DESIGN.md:
   - Are colors correct? (dark surfaces, accent usage)
   - Is typography hierarchy clear? (sizes, weights, spacing)
   - Do hover states work? (navigate and interact)
   - Is spacing consistent? (visual rhythm between sections)
   - Does it look premium or generic? (the crucial question)
7. Test at mobile viewport (375px width) and desktop (1440px)
8. Report findings with screenshots and specific recommendations

If something looks like "default Tailwind" or "AI slop" — flag it.
Describe what's wrong and reference the DESIGN.md rule it violates.
```

### .claude/agents/researcher.md

```markdown
---
name: researcher
description: Investigates before implementation — reads docs, searches codebase, browses references, checks Figma and GitHub
tools: Read, Grep, Glob, Bash, mcp__playwright__*, mcp__context7__*, mcp__figma__*, mcp__github__*
model: sonnet
maxTurns: 15
---

You are a staff engineer who investigates before writing code.

When asked to research:
1. Read DESIGN.md and CLAUDE.md for project conventions
2. Search the codebase for existing patterns related to the task
3. Read relevant docs in the docs/ directory
4. If researching a UI pattern: use Playwright to browse reference sites
   (godly.website, 21st.dev, lookup.design) for real-world examples
5. If a Figma file is linked: use the Figma MCP to read frames, extract tokens,
   and check for existing components via Code Connect
6. If researching a library: use Context7 MCP for up-to-date documentation
7. If the task relates to an issue or PR: use GitHub MCP to read the context
8. Check .claude/session-logs/ for previous sessions that solved similar problems
9. Summarize findings: what exists, what patterns to follow, what to avoid
10. Propose an implementation plan with file paths

Never write implementation code. Your job is to produce a clear plan
that an implementation agent can follow without guessing.
```

---

## 6 — Commands

### .claude/commands/scaffold-feature.md

```markdown
Scaffold a new feature module. Create the folder structure, component stubs,
types file, and hook file for the feature named: $ARGUMENTS

Follow these conventions:
- Create src/components/$ARGUMENTS/ with an index.ts barrel export
- Create component files with named exports
- Add a types.ts for feature-specific types
- Add a use-$ARGUMENTS.ts hook if stateful logic is expected
- Read DESIGN.md before creating any component — apply the correct tokens
- Use the design system skill for styling patterns

Before scaffolding, use a subagent to research existing patterns in the codebase.
```

### .claude/commands/pr-review.md

```markdown
Review the current branch against main for merge readiness.

Steps:
1. Run: git diff main...HEAD --stat
2. Run: git diff main...HEAD
3. Use the code-reviewer agent on the diff
4. Use the ui-reviewer agent if any .tsx files changed
5. If UI changed: use the visual-qa agent to check in browser
6. Run: pnpm typecheck && pnpm lint && pnpm test
7. Summarize: what changed, what's good, what needs fixing, and a go/no-go
```

### .claude/commands/test-and-lint.md

```markdown
Run the full quality gate:

!pnpm typecheck 2>&1
!pnpm lint 2>&1
!pnpm test --passWithNoTests 2>&1

Report results. If anything fails, show the errors and suggest fixes.
```

### .claude/commands/visual-check.md

```markdown
Run a visual QA check on the current state of the app.

Use the visual-qa agent to:
1. Start the dev server if not running
2. Navigate to $ARGUMENTS (default: http://localhost:3000)
3. Screenshot the page at desktop (1440px) and mobile (375px)
4. Compare against DESIGN.md rules
5. Flag anything that looks generic, inconsistent, or violates the design system
6. Suggest specific CSS/component changes to fix issues

Save screenshots to .design-refs/ for future comparison.
```

### .claude/commands/design-audit.md

```markdown
Audit the entire codebase for DESIGN.md compliance.

Steps:
1. Read DESIGN.md
2. Use Grep to find all hardcoded hex colors in .tsx files
3. Use Grep to find all arbitrary Tailwind values (e.g. p-[*], m-[*], text-[*])
4. Use Grep to find all inline Framer Motion variants (not from lib/motion.ts)
5. Use Grep to find all font-family declarations not matching DESIGN.md
6. Check every component in src/components/ for DESIGN.md compliance
7. Report: total violations, by category, with file paths
8. Prioritize fixes by impact (most visible pages first)
```

---

## 7 — Skills

### .claude/skills/design-system/SKILL.md

```markdown
---
name: design-system
description: >
  Design tokens, component patterns, and styling conventions for this project.
  Invoked automatically when creating or modifying any UI component.
  Reads DESIGN.md as the source of truth for all visual decisions.
---

## Source of truth

All design decisions live in `DESIGN.md` at the project root.
Read it before creating or modifying any component.

## Token implementation

DESIGN.md tokens are implemented as:
- CSS custom properties in `src/styles/globals.css`
- Tailwind theme extensions in `tailwind.config.ts`
- Never as hardcoded values in components

## Component patterns

- All components use named exports
- Props interfaces are defined and exported in the same file
- Use `cn()` from `lib/utils` for conditional classes
- Prefer composition over configuration (slots > props for layout variants)
- Wrap client interactivity in the smallest possible "use client" boundary

## Motion

Import presets from `src/lib/motion.ts`. Available presets:
- `fadeInUp` — default reveal animation
- `staggerContainer` — parent that staggers children
- `scaleOnHover` — subtle scale on hover
- `pageTransition` — route transition variants

Never define motion variants inline. Add new presets to the motion file,
following the rules in DESIGN.md § Motion.

## Anti-patterns to avoid

These are signs of AI slop — flag them immediately:
- Purple/blue gradient backgrounds
- Generic card grids with no visual hierarchy
- Inter font at default weights
- Oversized hero text with no supporting visual
- Rounded-full badges everywhere
- Identical padding on every section
- Drop shadows on cards as the only depth mechanism
- Centered body text paragraphs
```

---

## 8 — AGENTS.md

```markdown
# AGENTS.md — Project conventions for AI-assisted development

## Design-first rule
Before writing ANY UI code, read DESIGN.md. It is the single source of truth for:
colors, typography, spacing, component patterns, motion, and do's/don'ts.
If DESIGN.md doesn't cover something, check reference screenshots in .design-refs/
or browse real sites with Playwright for inspiration before inventing.

## Code standards
- TypeScript strict mode. No `any`. No untyped function parameters.
- Named exports only (except Next.js page/layout files which require default).
- One component per file. Name the file after the component.
- Props interfaces exported alongside their component.
- Prefer server components. Mark "use client" only at the smallest boundary.

## Folder ownership
- `DESIGN.md` — design system. Changes affect every UI component.
- `src/app/` — routing and layouts only. No business logic.
- `src/components/ui/` — shadcn/ui managed. Do not edit manually.
- `src/components/shared/` — cross-feature components. Changes here affect everything.
- `src/components/[feature]/` — feature-scoped components. Isolated.
- `src/lib/` — pure utilities. No React imports except in hooks/.
- `src/lib/motion.ts` — motion presets. Must match DESIGN.md § Motion.
- `src/hooks/` — custom React hooks. One hook per file.
- `src/styles/globals.css` — CSS custom properties. Must match DESIGN.md § Colors.
- `docs/` — human-readable project documentation.
- `.claude/` — Claude Code configuration. Treat as infrastructure.
- `.design-refs/` — reference screenshots. Gitignored.

## Before changing anything
- Read CLAUDE.md and DESIGN.md
- Search .claude/session-logs/ for previous sessions about the same problem
- Search for existing patterns with Grep/Glob before creating new ones
- Check if the file you're editing is imported elsewhere
- Review the design system skill if touching UI
- Review docs/ARCHITECTURE.md if changing structure
- If working from a Figma design: use the Figma MCP to read the frame first
- If working from a GitHub issue: use the GitHub MCP to read the full context

## UI consistency (enforced by DESIGN.md)
- All colors from CSS custom properties — never hardcoded
- All motion from src/lib/motion.ts presets — never inline
- All spacing from Tailwind scale — no arbitrary values
- Responsive: mobile-first, test at 375px and 1440px
- Every interactive element needs focus-visible and aria attributes
- Use Playwright via /project:visual-check to verify after building

## Animation rules (from DESIGN.md § Motion)
- Use Framer Motion exclusively (no CSS keyframe animations except in globals.css)
- Import presets from lib/motion.ts — add new ones there if needed
- Default easing: cubic-bezier(0.16, 1, 0.3, 1)
- Reveals: fadeInUp with stagger. No slide-from-side.
- Hover: subtle scale (1.02) or opacity. No color flash.
- Page transitions: cross-fade, 250ms. No slide.
- Never animate layout properties — use transform and opacity
- Never exceed 800ms duration
- Always respect prefers-reduced-motion

## Security
- No secrets in code. All credentials in .env (gitignored).
- Sanitize all user input before rendering.
- API routes validate input with zod.
- No dangerouslySetInnerHTML without explicit justification.
- Dependencies: prefer well-maintained packages with >1k weekly downloads.
- Run `pnpm audit` before adding new dependencies.

## Dependency rules
- pnpm only. No npm or yarn.
- Pin exact versions in package.json.
- No packages that duplicate existing functionality.
- shadcn/ui components are added via CLI, not installed as a package.
- Check bundle size impact before adding any new dependency.

## Visual QA workflow
After any UI changes:
1. Run `/project:visual-check` to open the app in Playwright
2. Verify at desktop (1440px) and mobile (375px)
3. Compare against DESIGN.md rules
4. Save screenshots to .design-refs/ for future comparison
5. Fix any "AI slop" indicators before committing

## Do not break
- DESIGN.md tokens without updating globals.css and tailwind.config.ts
- Existing component APIs (props interfaces are contracts)
- Route structure without updating nav components
- CSS custom properties without updating all consumers
- Motion presets without checking all animation usage
- The build. Run `pnpm build` after structural changes.

## Session logs & debugging history
- Sessions are auto-saved to .claude/session-logs/ on compaction, stop, and exit
- Before debugging a recurring issue, search session logs first:
  `grep -r "error message" .claude/session-logs/`
- If you fixed a tricky bug, the fix is preserved in the session log — don't re-solve it
- Use `claude --resume <session-id>` to continue a past session with full context
- Session logs include: modified files, recent commits, branch, and transcript excerpts

## MCP workflow
- **Figma**: Always read the Figma frame before implementing UI from a design link
- **GitHub**: Read the full issue/PR before starting work on a ticket
- **Playwright**: Use for visual QA after building UI, and for browsing reference sites
- **Filesystem**: Use for deep reads when Glob/Grep aren't sufficient
- **Context7**: Use before writing code with any library — get current API, not stale memory
- **Sequential Thinking**: Use for complex multi-step planning before implementation
```

---

## 9 — Files to generate

Generate every file listed in the project structure (section 2). For each file:

- Write complete, working code — no placeholder comments
- Follow DESIGN.md for all visual decisions (colors, fonts, spacing, motion, components)
- Use strong TypeScript types throughout
- Make the landing page genuinely impressive: animated hero with staggered text reveal,
  surface-layered feature cards, smooth scroll behavior — all matching DESIGN.md
- Make the dashboard shell functional: collapsible sidebar, stat cards with subtle
  entrance animations, activity feed with empty state
- Wire up DESIGN.md tokens as CSS custom properties in globals.css
- Extend tailwind.config.ts with the DESIGN.md color and spacing values
- Create motion.ts with all presets matching DESIGN.md § Motion
- Include the health check API route
- Include the AI chat route stub with zod validation

---

## 10 — Additional docs

### README.md
- Quick start (clone, pnpm install, pnpm dev)
- Tech stack with versions
- Design system: explain DESIGN.md and how to modify it
- MCP setup: table of all 6 servers with auth requirements
- How to use Playwright MCP for visual QA
- How to use Figma MCP for design-to-code
- How to browse design references
- Session logs: where they live, how to search them, how to resume
- Claude Code workflow (agents, commands, hooks)
- Environment variables reference (including GITHUB_PAT, FIGMA credentials)

### docs/ARCHITECTURE.md
- App Router conventions
- Component organization
- DESIGN.md → globals.css → tailwind.config.ts token flow
- Data flow patterns
- API route patterns

### docs/SCALING.md
- When to extract DESIGN.md into a design tokens package
- When to add a database
- When to add auth
- When to add E2E testing with Playwright (not just MCP)
- How to add more MCP servers
- When to use Stitch to generate new page designs

### docs/MOTION_SYSTEM.md
- Available presets and when to use each
- How to add new presets (must match DESIGN.md § Motion)
- Performance: will-change, GPU layers, avoiding layout thrash
- Accessibility: prefers-reduced-motion implementation
- Duration and easing reference table

---

## 11 — Final checks before delivering

After generating everything:

1. Verify the folder structure matches section 2 exactly
2. Confirm every import path resolves
3. Confirm CLAUDE.md is under 150 lines
4. Confirm DESIGN.md follows the format in section 3
5. Confirm globals.css custom properties match DESIGN.md § Colors exactly
6. Confirm tailwind.config.ts extends with DESIGN.md values
7. Confirm no hardcoded hex colors in any component
8. Confirm no inline motion variants — all from lib/motion.ts
9. Confirm motion presets match DESIGN.md § Motion specs
10. Confirm no default exports except in page.tsx and layout.tsx files
11. Confirm .env.example lists every required variable
12. Confirm .gitignore covers: .env*, node_modules, .next, .design-refs/, .claude/settings.local.json, .claude/session-logs/
13. If possible: run `pnpm dev` and use Playwright to screenshot the landing page as validation
