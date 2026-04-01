I want you to set up a **persistent AI project memory system** for this repository so future Claude Code and Codex sessions do not need repeated explanations.

Your job is to create and maintain a **repo-based memory structure** using markdown files and strict working rules.

This system must work for **all future sessions in this repo** and must be designed so that:
- project context stays inside the repo
- instructions remain easy to update
- temporary status is separated from stable architecture facts
- both Claude Code and Codex can quickly understand the project
- token waste is reduced by keeping context structured and reusable
- private/personal notes can be kept local if needed
- the system stays maintainable and does not become a messy dump

## Main goal

Set up a reusable repository memory framework using files such as:

- `CLAUDE.md`
- `AGENTS.md`
- `ai/PROJECT.md`
- `ai/PLAN.md`
- `ai/STATUS.md`
- `ai/DECISIONS.md`

You may adjust filenames slightly if needed, but keep the structure clean and obvious.

## What each file should do

### `CLAUDE.md`
This file is for Claude Code behavior inside this repo.

It should contain:
- repo-specific coding rules
- workflow expectations
- architecture boundaries
- what Claude should always check first
- what Claude should avoid doing
- how Claude should behave when making changes
- where important project docs live
- how to read and update the memory system
- instructions to consult the `ai/` folder before major work

### `AGENTS.md`
This file is for Codex and other coding agents.

It should contain:
- repo instructions equivalent to Claude rules where appropriate
- expectations for safe code edits
- rules for respecting architecture and conventions
- instructions to consult the memory docs before acting
- requirements for updating status and decisions after meaningful work

### `ai/PROJECT.md`
This file should contain stable project facts:
- what this project is
- who it is for
- key features
- stack and frameworks
- architecture overview
- folder structure summary
- main services / modules
- deployment overview
- major constraints
- coding conventions
- testing expectations
- commands that matter
- files/folders that are critical
- files/folders that should be touched carefully

This file should stay relatively stable and should not become a daily scratchpad.

### `ai/PLAN.md`
This file should contain current roadmap and execution plan:
- current project priorities
- active milestones
- feature roadmap
- implementation phases
- technical debt to address
- short-term next tasks
- dependencies between tasks

This should be more changeable than `PROJECT.md`, but still organized.

### `ai/STATUS.md`
This file should contain the current working state:
- what was worked on recently
- current progress
- current blocker
- unfinished work
- what should be done next
- recent files changed
- known risks
- current branch/task context if useful

This file is the main “where we left off” memory.

### `ai/DECISIONS.md`
This file should contain major decisions:
- architecture choices
- rejected approaches
- tradeoffs
- important implementation decisions
- reasons behind those decisions
- things future sessions must not undo casually

This file should prevent repeated bad decisions and loss of context.

## Required working rules

Create this system so that future AI sessions follow these rules:

1. Always read `CLAUDE.md` or `AGENTS.md` first, depending on the agent.
2. Before making meaningful changes, review:
   - `ai/PROJECT.md`
   - `ai/PLAN.md`
   - `ai/STATUS.md`
   - `ai/DECISIONS.md`
3. Treat `PROJECT.md` as stable truth unless the user explicitly changes it.
4. Treat `STATUS.md` as temporary working memory.
5. After meaningful work, update:
   - `STATUS.md` with what changed, blockers, and next step
   - `DECISIONS.md` if an important decision was made
   - `PLAN.md` if roadmap or priorities changed
6. Do not dump huge logs or raw transcripts into these files.
7. Keep memory concise, structured, and useful.
8. Do not repeat the same fact in multiple files unless necessary.
9. Keep stable facts separate from temporary notes.
10. Do not overwrite important architecture context with task-level noise.
11. If something is uncertain, mark it clearly instead of pretending it is settled.
12. If a file becomes bloated, reorganize it instead of letting it rot.

## Behavior rules for the agent

When working in this repo, always:

- preserve existing architecture unless there is a strong reason to change it
- avoid unnecessary rewrites
- avoid breaking working logic
- respect repo conventions
- check for existing utilities before adding new ones
- keep edits scoped and intentional
- explain tradeoffs when making structural changes
- note important risks
- update the memory files after meaningful progress

The agent must not:

- invent architecture facts
- ignore the project memory files
- make large speculative changes without justification
- turn the memory system into a trash bin
- store secrets, API keys, tokens, passwords, cookies, or sensitive env values in these memory files
- paste raw chain-of-thought or massive logs into memory docs
- duplicate the same status note forever without cleanup

## Privacy and repo separation rules

This memory system is for this repository only.

That means:
- do not mix memory from other repos into this repo
- do not assume rules from another project apply here
- keep this repo’s context isolated
- if personal-only notes are needed, recommend keeping them in local ignored files, not committed shared docs
- do not place secrets in committed memory files

If helpful, suggest optional local-only files such as:
- `ai/LOCAL.md`
- `CLAUDE.local.md`
- `AGENTS.local.md`

But clearly mark them as local/private and recommend gitignoring them.

## Output requirements

Do all of the following:

1. Propose the exact file structure.
2. Draft the content for each file.
3. Make the drafts practical, clean, and reusable.
4. Keep the writing professional and direct.
5. Make the instructions strong enough that future sessions behave consistently.
6. Make the system general enough to reuse across many projects, but still adaptable to this repo.
7. Where repo-specific details are unknown, use clearly labeled placeholders like:
   - `[PROJECT PURPOSE]`
   - `[MAIN STACK]`
   - `[KEY COMMANDS]`
   - `[DEPLOYMENT METHOD]`
8. Do not leave the result vague. Fill in as much useful structure as possible.
9. Make each file ready to paste into the repository immediately.

## Formatting requirements

- Use clean markdown
- Use clear headings
- Use concise bullet points where helpful
- Keep sections scannable
- Do not make the files too short or too generic
- Do not make them bloated
- Optimize for long-term maintainability

## Final instruction

Generate the full contents for:
- `CLAUDE.md`
- `AGENTS.md`
- `ai/PROJECT.md`
- `ai/PLAN.md`
- `ai/STATUS.md`
- `ai/DECISIONS.md`

Make them copy-paste ready.