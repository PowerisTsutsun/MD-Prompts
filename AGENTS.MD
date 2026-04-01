# AGENTS.md

## Purpose

This repository uses AI coding agents. This file defines the default working rules for any agent operating in this repo.

The goal is to keep work safe, consistent, maintainable, and easy for future sessions to continue.

---

## Core Rules

1. Read the project context before making meaningful changes.
2. Preserve existing architecture unless there is a strong reason to change it.
3. Do not make large speculative rewrites.
4. Keep edits scoped to the task.
5. Reuse existing patterns, utilities, and conventions whenever possible.
6. Do not invent missing requirements. If something is unclear, state the uncertainty.
7. Prefer maintainable code over clever code.
8. Avoid adding unnecessary dependencies.
9. Respect security, privacy, and environment boundaries.
10. Update project memory files after meaningful work.

---

## Read First

Before making important changes, review these if they exist:

- `ai/PROJECT.md`
- `ai/PLAN.md`
- `ai/STATUS.md`
- `ai/DECISIONS.md`

If they do not exist yet, work carefully and suggest creating them.

---

## How to Work

When implementing changes:

- understand the task first
- inspect existing related files before editing
- keep changes minimal and relevant
- follow the repo’s current structure and naming style
- avoid duplicate utilities or duplicate logic
- note tradeoffs when making structural changes
- call out risks before destructive or high-impact edits

---

## Code Change Rules

- Do not break existing working logic without good reason.
- Do not rename files, functions, or folders unless necessary.
- Do not change public interfaces casually.
- Do not introduce hidden side effects.
- Do not add dead code, placeholder code, or fake implementations.
- Keep code readable and production-minded.
- Prefer consistency with the current codebase over personal preference.

---

## Dependencies

Before adding any package, library, or service:

- check whether the repo already has a solution for that need
- confirm the dependency is necessary
- prefer trusted, maintained, minimal dependencies
- avoid dependency bloat
- be cautious about supply-chain risk
- explain why the new dependency is needed

---

## Security and Privacy

Never place the following into memory files, docs, or committed notes:

- API keys
- access tokens
- passwords
- cookies
- private credentials
- secret environment values
- raw `.env` contents

Treat logs and terminal output as potentially sensitive.

---

## Memory File Rules

Use the memory files properly:

- `PROJECT.md` = stable project facts
- `PLAN.md` = roadmap and priorities
- `STATUS.md` = current working state and next step
- `DECISIONS.md` = important architecture and implementation choices

Do not turn them into a dump of raw logs or repeated notes.

After meaningful work:
- update `STATUS.md`
- update `DECISIONS.md` if a major decision was made
- update `PLAN.md` if priorities changed

---

## Communication Style

When reporting work:

- be direct
- be accurate
- mention what changed
- mention risks or blockers
- mention the next best step
- do not pretend something was verified if it was not

---

## Preferred Behavior

Agents should generally:

- make focused edits
- preserve repo conventions
- avoid overengineering
- avoid unnecessary rewrites
- explain important tradeoffs
- leave the repo in a clearer state than before

---

## If Context Is Missing

If project context is missing:

1. inspect the repo structure
2. inspect package files and config files
3. infer patterns from existing code
4. document assumptions clearly
5. suggest adding or improving project memory files

---

## Final Rule

Act like a careful contributor to an active real-world codebase.

Do not be reckless.
Do not be noisy.
Do not be lazy.
Do not be overconfident.