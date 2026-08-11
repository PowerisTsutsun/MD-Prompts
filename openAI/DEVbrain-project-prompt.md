# Pre-Project Prompt — DevBrain Hook

> Paste this at the start of a new conversation, or save it as `AGENTS.md` in your project
> root — OpenAI Codex CLI, Cursor, Windsurf, Aider, Copilot Agent and Gemini CLI all read
> that file automatically, so the hook fires every session without you pasting anything.
> See **Loading it per harness** at the bottom for the rest.

---

## Context

I maintain a persistent knowledge folder ("second brain") at:

**`<absolute path to your devbrain folder>`**
> Replace this with your real path, e.g. `C:\Users\you\Desktop\Projects\devbrain`
> or `~/devbrain`. An unedited placeholder is the #1 reason this hook silently no-ops.

This folder is the source of truth for everything you should already know about how I work and what I'm building. Before answering, treat it as required reading — not optional reference.

## Folder structure

```
devbrain/
├── 00-index.md            ← map of what's in the brain, read this first
├── project-overview.md    ← what I'm building, stack, goals, non-goals
├── architecture.md        ← services, data flow, where things live
├── conventions.md         ← code style, naming, patterns I prefer
├── known-bugs.md          ← symptom → root cause → fix, one per bug
├── decisions.md           ← choices already made and why (don't re-litigate)
├── glossary.md            ← internal acronyms, product names, jargon
└── snippets/              ← reusable prompts, code templates, boilerplate
```

## How to use it

**At the start of every session:**
1. Read `00-index.md` to orient yourself
2. Read `project-overview.md` and `conventions.md` in full
3. Skim the other files so you know what's in them

**During the conversation, consult specific files based on what I'm asking:**

| If I ask about… | Read first |
|---|---|
| Debugging or "why is X broken" | `known-bugs.md` — check if it's already documented |
| Writing new code | `conventions.md` + relevant section of `architecture.md` |
| Architectural changes | `decisions.md` — don't suggest things I've already ruled out |
| An unfamiliar term I use | `glossary.md` |
| A repeated task | `snippets/` — there may already be a template |

## Rules of engagement

1. **Never ask me to re-explain something that's in the brain.** If you need context, read the file. If the file is empty or missing the info, say so explicitly and I'll add it.

2. **If I tell you something new about the project, propose where it should live.** At the end of your response, add a section like:

   > 📝 **Brain update suggested:** Add to `conventions.md` under "Error handling":
   > "We wrap all DB calls in `withRetry()` — never call the driver directly."

   I'll commit it manually so I stay in control of what gets persisted.

3. **If two files contradict each other, flag it.** Don't silently pick one — tell me and let me resolve it.

4. **If a file is stale or doesn't match what we're actually doing**, say so. The brain is only useful if it's accurate.

5. **Decisions in `decisions.md` are binding.** Don't propose alternatives unless I explicitly ask to revisit a decision, or unless new information genuinely invalidates it (in which case, say so clearly).

## How I want you to start

When this prompt is loaded, your first response should be:

1. A one-line confirmation you've read the brain (e.g. *"Brain loaded: working on [project name], stack is [X], [N] known bugs on file."*)
2. Then answer my actual question.

Don't dump the brain contents back at me — just prove you read it by being accurate and specific about my project from turn one.

---

## Loading it per harness

The layering is the same everywhere: **global preferences** + **this project hook** +
**the brain itself in-repo**. Only the filenames change.

### OpenAI Codex CLI

- `~/.codex/AGENTS.md` — personal preferences that apply to *every* project
- `<repo>/AGENTS.md` — this file, project-specific hook
- `<repo>/devbrain/` — the actual knowledge (or a symlink to the central folder)

Codex reads `AGENTS.md` at session start and merges global with repo-local, so the hook
fires every time without pasting. Set reasoning effort to high for brain-heavy sessions.

### Cursor / Windsurf

- `.cursor/rules/devbrain.mdc` with `alwaysApply: true` (Windsurf: its rules directory)
- Or just `AGENTS.md` in the repo root — Cursor reads it too
- Keep `devbrain/` in the repo so the files are indexable and `@`-mentionable

### Aider / Copilot Agent / Gemini CLI

All three read `AGENTS.md` from the repo root. Aider users can also pass the brain
explicitly as read-only context: `aider --read devbrain/00-index.md --read devbrain/conventions.md`.

### GPT-5-class models via the API

Pass this file as the **system prompt**, and inject the brain files the request actually
needs as context — `00-index.md` and `conventions.md` every time, the rest on demand per
the table above. Cache the system prompt if your provider supports it; the brain is stable
across turns and re-sending it uncached is the main cost driver.

### ChatGPT Projects (or any chat UI with a knowledge/files feature)

1. Create a Project
2. Paste this entire prompt into the Project's **custom instructions**
3. Upload the contents of your devbrain folder into the Project's **files / knowledge**
4. Re-upload whenever you update the brain files (or sync periodically)

Chat UIs have no repo access, so rule 1 below inverts: the model cannot read files you
haven't uploaded. If it needs something absent from the knowledge base, it must say which
file it wants rather than guessing.

### Plain chat, nothing configured

Paste this file, then paste `00-index.md` and `conventions.md`. Expect to re-paste after
long sessions — without an auto-loaded instruction file, the hook decays as context fills.
