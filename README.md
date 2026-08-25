# MD-Prompts

A library of long-form, stack-agnostic prompts for Claude Code. Each file is a
complete operating procedure for one kind of engineering work — audits, bug
hunts, cleanup passes, UI builds — written to be pasted into a session or
installed as a subagent / `CLAUDE.md`.

The UI procedures live in [`skills/`](skills/) as installable Claude Code
skills, so they load on their own when a request matches instead of being
pasted. Everything else is paste-in Markdown.

**Two editions.** The root files target Claude Code. [`openAI/`](openAI/) holds the same
prompts ported to run on any model — built for OpenAI (Codex CLI, GPT-5-class via API,
ChatGPT) and compatible with Cursor, Windsurf, Aider, Copilot Agent and Gemini CLI. Same
substance; vendor-bound scaffolding swapped. See [`openAI/README.md`](openAI/README.md)
for what differs.

---

## Contents

| File | Lines | What it does |
|---|---|---|
| [`sub-agents.md`](sub-agents.md) | 1396 | Fifteen exhaustive-mode subagent definitions (audit, security, reliability, debug, check, test, refactor, perf, deps, migration, docs, ui, api-contract, env, release) plus the routing table and universal rules that govern them. |
| [`security-audit.md`](security-audit.md) | 340 | Full security audit and hardening pass — 12 sections from exposed secrets through DoS, with an aggressive autofix policy and a hard stage-only boundary for irreversible actions. |
| [`aggressive-audit.md`](aggressive-audit.md) | 236 | Reliability audit and remediation across five patterns: idempotency, deduplication, caching, rate limiting, atomic operations. Every finding must carry a provable failure narrative. |
| [`refactor.md`](refactor.md) | 205 | Finishing pass that takes a project from "works" to "shippable" — dead code, legacy paths, duplication, repo hygiene, dependencies, then release-grade quality on what survives. |
| [`bugfix.md`](bugfix.md) | 186 | Extreme bug hunt — 100% file coverage with a durable `.bug-hunt/` state directory so the audit survives context compaction, plus a baseline-first fix and verify protocol. |
| [`skills/`](skills/) | — | Four installable Claude Code skills, split by scope of change: [`project-kickoff`](skills/project-kickoff/) (new project — classify across five build types, stack defaults, per-category guardrails, DESIGN.md gate), [`ui-craft-build`](skills/ui-craft-build/) (new surface — brief, one aesthetic direction, tokens, gated build with motion), [`ui-site-glowup`](skills/ui-site-glowup/) (whole-site overhaul — direction, token retrofit, page-by-page loop, exit audit), [`ui-polish-pass`](skills/ui-polish-pass/) (one named defect — measure, fix the token, sweep every consumer). Supersedes the old `master-ui.md` and `glowup.md`. |
| [`email-pdf-ingestion.md`](email-pdf-ingestion.md) | 180 | Reusable Microsoft Graph prompt for "email a PDF to a mailbox and the app pulls it in" — admin runbook, pre-flight test before any app code, per-tick pipeline, acceptance tests, and the four gotchas that each cost a day on a real tenant. |
| [`TIMELOG.MD`](TIMELOG.MD) | 119 | Work Session Logger agent — tracks meaningful work during a session and emits a daily summary plus an employer-friendly timesheet, with explicit rules on what does and doesn't count as loggable. |
| [`DOCUMENTATION.MD`](DOCUMENTATION.MD) | 110 | Project Documentation Maintainer agent — keeps docs accurate after changes, defines the minimum doc set, changelog behavior, and a truthfulness rule that forbids documenting what wasn't verified. |
| [`devbrain-hook.md`](devbrain-hook.md) | 91 | Pre-project prompt wiring a session to a persistent `devbrain/` knowledge folder — what to read when, and rules of engagement. Paste it, or save it as `CLAUDE.md`. |
| [`openAI/`](openAI/) | — | The six root prompts plus the UI build procedure, ported to be harness-agnostic. `AGENTS.md` instead of `CLAUDE.md`, named role prompts instead of native subagents, inlined design layer instead of Skills, and explicit degraded-mode rules for chat-only models. |

---

## Usage

**Paste directly.** Open a prompt, copy the whole file, and drop it in as the
first message of a Claude Code session at the root of the target repo.

**Install as subagents.** Split `sub-agents.md` on its `---` boundaries into
`.claude/agents/<name>.md` so Claude Code loads each block as a real subagent —
then the routing table in that file (and in your global `CLAUDE.md`) decides
which one handles a given request.

**Install as a project prompt.** Save `devbrain-hook.md` as `CLAUDE.md`
in a project root so it loads automatically every session.

**Install as skills.** Copy the directories in [`skills/`](skills/) into
`~/.claude/skills/` (user-wide) or `.claude/skills/` (per project) and restart
Claude Code — they then load on their own when a request matches, instead of
being pasted. See [`skills/README.md`](skills/README.md).

## Conventions

These prompts share a design philosophy, and edits should keep it:

- **Exhaustive by default.** Full-project scope unless the invocation names a
  narrower one. No sampling, no "representative files."
- **Evidence over volume.** A finding that can't be traced to code read in the
  session, with a concrete failure narrative, is not a finding.
- **Baseline first.** Record what already passes before changing anything, so
  pre-existing failures are never attributed to the pass.
- **Safe fixes applied, dangerous ones staged.** Secret rotation, history
  rewrites, schema and infra changes, anything touching auth or payments — these
  are written up with exact human steps, never performed autonomously.
