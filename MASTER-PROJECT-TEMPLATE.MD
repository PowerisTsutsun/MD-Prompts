# MASTER PROJECT TEMPLATE — Claude Code Starter Kit

> **Usage**: Feed this prompt to Claude Code at the start of any new project.
> It scaffolds a production-ready Next.js app with a full Claude Code harness
> (CLAUDE.md, agents, commands, hooks, MCP, skills) so every future session
> starts with the right context and tooling.

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

Do NOT use the default AI SaaS look (purple/blue gradients on white).
Choose a distinctive visual system:

- Deep neutrals, warm metallic accents
- Glass, blur, subtle grain, premium shadows
- Strong typographic hierarchy with non-generic fonts
- Motion that feels expensive and intentional, never playful or bouncy
- Hover states, transitions, and depth that reward interaction

Reference the aesthetic quality of sites like 21st.dev, Linear, Vercel, Raycast.

---

## 2 — Project structure to generate

```
project-root/
├── CLAUDE.md                        # Project memory (concise, <150 lines)
├── AGENTS.md                        # Cross-tool agent instructions
├── .claude/
│   ├── settings.json                # Hooks, permissions, env
│   ├── settings.local.json          # Personal overrides (gitignored)
│   ├── agents/
│   │   ├── code-reviewer.md         # Reviews diffs for quality + security
│   │   ├── ui-reviewer.md           # Checks design consistency + a11y
│   │   └── researcher.md            # Investigates before implementation
│   ├── commands/
│   │   ├── scaffold-feature.md      # /project:scaffold-feature
│   │   ├── pr-review.md             # /project:pr-review
│   │   └── test-and-lint.md         # /project:test-and-lint
│   └── skills/
│       └── design-system/
│           └── SKILL.md             # Design tokens, component patterns
├── .mcp.json                        # MCP server configuration
├── .env.example                     # Required environment variables
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
└── docs/
    ├── ARCHITECTURE.md              # How the codebase is organized
    ├── SCALING.md                   # Notes for growing the project
    └── MOTION_SYSTEM.md             # Animation conventions
```

---

## 3 — Claude Code harness files

### CLAUDE.md

Keep this under 150 lines. Include only what's universally needed every session:

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
- Design tokens as CSS custom properties in globals.css
- Motion presets in src/lib/motion.ts — always use these, don't inline variants
- API routes are provider-agnostic stubs — easy to swap backends

## Rules
- Use named exports, no default exports (except page/layout files)
- Prefer server components; add "use client" only when needed
- Never commit secrets — .env files are gitignored
- Run `pnpm typecheck` before committing
- New components get their own file — no multi-component files
- All interactive elements need keyboard + screen reader support

## Finding things
- Design system skill: .claude/skills/design-system/SKILL.md
- Architecture docs: docs/ARCHITECTURE.md
- Motion conventions: docs/MOTION_SYSTEM.md
- Subagents: .claude/agents/ (code-reviewer, ui-reviewer, researcher)
- Slash commands: .claude/commands/
```

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
      "Bash(npx shadcn@latest add *)"
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

### .mcp.json

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"],
      "description": "Up-to-date docs for libraries (Next.js, React, Tailwind, etc.)"
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"],
      "description": "Step-by-step reasoning for complex planning"
    }
  }
}
```

> **Add as needed per project:**
> - `@anthropic-ai/mcp-server-github` — PR workflows, issue management
> - `@anthropic-ai/mcp-server-postgres` — database queries
> - Vercel MCP — deployment management
> - Figma MCP — design-to-code
> - Sentry MCP — error tracking
>
> Always pass credentials via `env`, never CLI args.

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

Report findings with file paths and line references. Suggest fixes.
```

### .claude/agents/ui-reviewer.md

```markdown
---
name: ui-reviewer
description: Checks UI components for design system consistency and accessibility
tools: Read, Grep, Glob
model: sonnet
maxTurns: 8
---

You are a design systems engineer. Review UI changes for:

- Correct use of CSS custom properties from globals.css (no hardcoded colors)
- Consistent spacing using Tailwind spacing scale
- Font usage matches the configured font stack (no arbitrary font families)
- Motion uses presets from lib/motion.ts
- Interactive elements have focus-visible styles
- Components are responsive (check for mobile breakpoints)
- Empty states are handled, not just the happy path

Flag deviations with file paths and recommended fixes.
```

### .claude/agents/researcher.md

```markdown
---
name: researcher
description: Investigates before implementation — reads docs, searches codebase, gathers context
tools: Read, Grep, Glob, Bash
model: sonnet
maxTurns: 15
---

You are a staff engineer who investigates before writing code. When asked to research:

1. Search the codebase for existing patterns related to the task
2. Read relevant docs in the docs/ directory
3. Check CLAUDE.md and skills for project conventions
4. Summarize findings: what exists, what patterns to follow, what to avoid
5. Propose an implementation plan with file paths

Never write implementation code. Your job is to produce a clear plan.
```

### .claude/commands/scaffold-feature.md

```markdown
Scaffold a new feature module. Create the folder structure, component stubs,
types file, and hook file for the feature named: $ARGUMENTS

Follow these conventions:
- Create src/components/$ARGUMENTS/ with an index.ts barrel export
- Create component files with named exports
- Add a types.ts for feature-specific types
- Add a use-$ARGUMENTS.ts hook if stateful logic is expected
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
5. Run: pnpm typecheck && pnpm lint && pnpm test
6. Summarize: what changed, what's good, what needs fixing, and a go/no-go
```

### .claude/commands/test-and-lint.md

```markdown
Run the full quality gate:

!pnpm typecheck 2>&1
!pnpm lint 2>&1
!pnpm test --passWithNoTests 2>&1

Report results. If anything fails, show the errors and suggest fixes.
```

### .claude/skills/design-system/SKILL.md

```markdown
---
name: design-system
description: Design tokens, component patterns, and styling conventions for this project. Use when creating or modifying any UI component.
---

## Tokens

All colors, radii, and shadows are CSS custom properties defined in src/styles/globals.css.
Never hardcode colors — always reference variables.

## Component patterns

- All components use named exports
- Props interfaces are defined in the same file, exported
- Use cn() from lib/utils for conditional classes
- Prefer composition over configuration (slots > props for layout variants)
- Wrap client interactivity in the smallest possible "use client" boundary

## Motion

Import presets from src/lib/motion.ts:
- `fadeInUp` — default reveal animation
- `staggerContainer` — parent that staggers children
- `scaleOnHover` — subtle scale on hover
- `pageTransition` — route transition variants

Never define motion variants inline. Add new presets to the motion file.

## Typography

- Display: [configured display font]
- Body: [configured body font]
- Use Tailwind's type scale. Custom sizes go in tailwind.config.ts, not inline.

## Spacing & Layout

- Use Tailwind spacing scale consistently
- Max content width: max-w-7xl for marketing, max-w-screen-2xl for dashboard
- Section padding: py-24 on desktop, py-16 on mobile
- Card padding: p-6 standard, p-8 for featured
```

---

## 4 — AGENTS.md

```markdown
# AGENTS.md — Project conventions for AI-assisted development

## Code standards
- TypeScript strict mode. No `any`. No untyped function parameters.
- Named exports only (except Next.js page/layout files which require default).
- One component per file. Name the file after the component.
- Props interfaces exported alongside their component.
- Prefer server components. Mark "use client" only at the smallest necessary boundary.

## Folder ownership
- `src/app/` — routing and layouts only. No business logic.
- `src/components/ui/` — shadcn/ui managed. Do not edit manually.
- `src/components/shared/` — cross-feature components. Changes here affect everything.
- `src/components/[feature]/` — feature-scoped components. Isolated.
- `src/lib/` — pure utilities. No React imports except in hooks/.
- `src/hooks/` — custom React hooks. One hook per file.
- `docs/` — human-readable project documentation.
- `.claude/` — Claude Code configuration. Treat as infrastructure.

## Before changing anything
- Read CLAUDE.md
- Search for existing patterns with Grep/Glob before creating new ones
- Check if the file you're editing is imported elsewhere
- Review the design system skill if touching UI
- Review docs/ARCHITECTURE.md if changing structure

## UI consistency
- All colors from CSS custom properties, never hardcoded
- All motion from src/lib/motion.ts presets, never inline
- All spacing from Tailwind's scale
- Responsive: mobile-first, test at 375px and 1440px minimum
- Every interactive element needs focus-visible and aria attributes

## Animation rules
- Use Framer Motion exclusively (no CSS keyframe animations except in globals.css)
- Import presets from lib/motion.ts — add new ones there if needed
- Reveals: fadeInUp with stagger. No slide-from-side.
- Hover: subtle scale or opacity. No color flash.
- Page transitions: cross-fade, 200ms. No slide.
- Never animate layout properties (width, height, top, left) — use transform and opacity

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

## Do not break
- Existing component APIs (props interfaces are contracts)
- Route structure without updating nav components
- CSS custom properties without updating all consumers
- Motion presets without checking all animation usage
- The build. Run `pnpm build` after structural changes.
```

---

## 5 — Files to generate

Generate every file listed in the project structure (section 2). For each file:

- Write complete, working code — no placeholder comments like `// TODO` or `// add logic here`
- Use strong TypeScript types throughout
- Follow the conventions defined in CLAUDE.md and AGENTS.md
- Make the landing page genuinely impressive: animated hero with staggered text reveal, glass-morphism feature cards, smooth scroll behavior
- Make the dashboard shell functional: collapsible sidebar, stat cards with subtle entrance animations, activity feed with empty state
- Wire up the design tokens in globals.css as CSS custom properties
- Create the motion.ts file with all referenced presets as real Framer Motion variants
- Include the health check API route with proper typing
- Include the AI chat route stub with clear extension points and zod validation

---

## 6 — Additional docs to generate

### README.md
- Project name, one-line description
- Quick start (clone, install, dev)
- Tech stack with versions
- Project structure overview
- How to add features (reference the scaffold command)
- How to use Claude Code with this project (reference CLAUDE.md, agents, commands)
- Environment variables reference

### docs/ARCHITECTURE.md
- App Router conventions used
- Component organization philosophy
- Data flow patterns
- API route patterns
- How to add new route groups

### docs/SCALING.md
- When to add a database (and which ones work well)
- When to add auth (and recommended providers)
- When to add state management (and why you probably don't need it yet)
- When to extract a design system package
- When to add E2E testing
- How to add more MCP servers for team workflows

### docs/MOTION_SYSTEM.md
- Available presets and when to use each
- How to add new presets
- Performance guidelines (will-change, GPU layers)
- Accessibility: respects prefers-reduced-motion

---

## 7 — Final checks before delivering

After generating everything:

1. Verify the folder structure matches section 2 exactly
2. Confirm every import path resolves
3. Confirm CLAUDE.md is under 150 lines
4. Confirm no hardcoded colors in components — all from CSS variables
5. Confirm no inline motion variants — all from lib/motion.ts
6. Confirm no default exports except in page.tsx and layout.tsx files
7. Confirm .env.example lists every required variable
8. Confirm .gitignore covers .env*, node_modules, .next, .claude/settings.local.json
