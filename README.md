# MD-Prompts

A library of long-form, stack-agnostic prompts for Claude Code. Each file is a
complete operating procedure for one kind of engineering work — audits, bug
hunts, cleanup passes, UI builds — written to be pasted into a session or
installed as a subagent / `CLAUDE.md`.

No code, no build step. Markdown only.

---

## Contents

| File | Lines | What it does |
|---|---|---|
| [`Sub-Agents.md`](Sub-Agents.md) | 1396 | Fifteen exhaustive-mode subagent definitions (audit, security, reliability, debug, check, test, refactor, perf, deps, migration, docs, ui, api-contract, env, release) plus the routing table and universal rules that govern them. |
| [`brutalsecure.md`](brutalsecure.md) | 340 | Full security audit and hardening pass — 12 sections from exposed secrets through DoS, with an aggressive autofix policy and a hard stage-only boundary for irreversible actions. |
| [`aggressive-audit.md`](aggressive-audit.md) | 236 | Reliability audit and remediation across five patterns: idempotency, deduplication, caching, rate limiting, atomic operations. Every finding must carry a provable failure narrative. |
| [`refactor.md`](refactor.md) | 205 | Finishing pass that takes a project from "works" to "shippable" — dead code, legacy paths, duplication, repo hygiene, dependencies, then release-grade quality on what survives. |
| [`bugfix.md`](bugfix.md) | 186 | Extreme bug hunt — 100% file coverage with a durable `.bug-hunt/` state directory so the audit survives context compaction, plus a baseline-first fix and verify protocol. |
| [`Master-UI.md`](Master-UI.md) | 272 | Bootstrap prompt for high-craft, motion-heavy UI builds: lean skill stack, mandatory project brief, five named aesthetic directions, a motion playbook, and gated workflow phases. |
| [`DEVbrain-project-prompt`](DEVbrain-project-prompt) | 89 | Pre-project prompt wiring a session to a persistent `claude-brain/` knowledge folder — what to read when, and rules of engagement. No `.md` extension; paste it or save it as `CLAUDE.md`. |

---

## Usage

**Paste directly.** Open a prompt, copy the whole file, and drop it in as the
first message of a Claude Code session at the root of the target repo.

**Install as subagents.** Split `Sub-Agents.md` on its `---` boundaries into
`.claude/agents/<name>.md` so Claude Code loads each block as a real subagent —
then the routing table in that file (and in your global `CLAUDE.md`) decides
which one handles a given request.

**Install as a project prompt.** Save `DEVbrain-project-prompt` as `CLAUDE.md`
in a project root so it loads automatically every session.

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
