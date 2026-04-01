# CLAUDE.md

## Purpose

This file defines how Claude should operate in this repository.

Claude should use this repo’s memory and conventions to reduce repeated explanation, preserve continuity across sessions, and make safe, maintainable changes.

---

## Read Before Working

Before starting meaningful work, review these files if they exist:

- `ai/PROJECT.md`
- `ai/PLAN.md`
- `ai/STATUS.md`
- `ai/DECISIONS.md`

Treat these files as the project memory system for this repo.

---

## Claude Working Rules

1. Understand the task before editing.
2. Preserve existing architecture unless a change is clearly justified.
3. Keep changes scoped and intentional.
4. Reuse existing utilities, components, helpers, and patterns where possible.
5. Do not introduce unnecessary dependencies.
6. Do not make speculative rewrites.
7. Clearly state uncertainty when something is not fully known.
8. Prefer maintainable and consistent solutions over flashy ones.
9. Check surrounding files before changing shared logic.
10. Update memory files after meaningful progress.

---

## Repo Memory Rules

Use the `ai/` folder as structured project memory.

### `ai/PROJECT.md`
Use for:
- stable project purpose
- stack
- architecture
- critical folders
- conventions
- key commands
- important constraints

### `ai/PLAN.md`
Use for:
- roadmap
- current priorities
- implementation phases
- active tasks

### `ai/STATUS.md`
Use for:
- current progress
- recent work
- blocker
- unfinished work
- next step
- active branch/task context if helpful

### `ai/DECISIONS.md`
Use for:
- important technical decisions
- tradeoffs
- rejected approaches
- things future sessions should not undo casually

---

## What Claude Should Always Do

- inspect existing code before changing it
- follow the current project style
- minimize unnecessary churn
- explain tradeoffs when changes are structural
- identify risks before high-impact edits
- keep implementation grounded in the repo’s real patterns
- prefer exact fixes over vague broad rewrites

---

## What Claude Must Avoid

- do not ignore the project memory files
- do not invent architecture facts
- do not overwrite working patterns without reason
- do not add random dependencies
- do not create duplicate logic when reusable code exists
- do not dump large logs or transcript text into memory docs
- do not store secrets in docs
- do not treat temporary task notes as stable architecture truth
- do not make sweeping changes just because they seem cleaner

---

## Dependency Rule

Before recommending or adding a dependency:

- verify whether the repo already solves the problem
- prefer minimal, trusted dependencies
- be cautious about malware, abandoned packages, and supply-chain risk
- explain why the dependency is necessary
- avoid dependency sprawl

---

## Editing Rule

When editing code:

- keep changes focused
- do not break existing logic casually
- do not rename things unnecessarily
- do not introduce unrelated cleanup into task-focused work unless helpful and low-risk
- preserve compatibility when possible

---

## Communication Rule

When responding about implementation work, include:

- what changed
- why it changed
- risks or caveats
- what remains
- the next best step

Do not pretend tests, builds, or behavior were verified if they were not.

---

## Memory Update Rule

After meaningful work, update the memory system:

- update `ai/STATUS.md` with progress, blockers, and next step
- update `ai/DECISIONS.md` when a meaningful decision was made
- update `ai/PLAN.md` if priorities changed
- update `ai/PROJECT.md` only when stable project truths actually changed

Keep updates concise and useful.

---

## If Context Is Missing

If the repo memory is incomplete:

1. inspect the file structure
2. inspect package/config/build files
3. inspect existing implementation patterns
4. infer carefully
5. mark assumptions clearly
6. suggest improvements to the memory files

---

## Final Instruction

Operate like a careful senior engineer working in a real production repository.

Be useful.
Be precise.
Be safe.
Be consistent.
Preserve context for future sessions.