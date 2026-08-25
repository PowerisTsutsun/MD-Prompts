# openAI — portable edition

The same prompts as the repo root, ported to run on **any** model or harness — built and
tuned primarily for OpenAI: Codex CLI, GPT-5-class models via the API, and ChatGPT. They
also work in Cursor, Windsurf, Aider, Copilot Agent and Gemini CLI, which share the
`AGENTS.md` convention.

Substance is unchanged. Only the vendor-bound scaffolding was replaced.

---

## Contents

| File | Ported from | Port notes |
|---|---|---|
| [`sub-agents.md`](sub-agents.md) | `../sub-agents.md` | 15 review roles. Native subagent dispatch → per-harness install table (`~/.codex/prompts/`, `.cursor/rules/`, API system prompt). Tool names → capability declarations. `model: opus` → `reasoning: high`. |
| [`security-audit.md`](security-audit.md) | `../security-audit.md` | Security audit, 12 sections. Harness-neutral intro + degraded-mode contract. Body unchanged — it was already stack-agnostic. |
| [`aggressive-audit.md`](aggressive-audit.md) | `../aggressive-audit.md` | Reliability audit. Portability header explaining why Phase 0 recon is load-bearing without shell access. |
| [`refactor.md`](refactor.md) | `../refactor.md` | Finishing pass. Portability header + instruction-file lookup that isn't Claude-specific. |
| [`bugfix.md`](bugfix.md) | `../bugfix.md` | Bug hunt. `Task tool` subagents → generic parallel-worker wording with a serial fallback. Instruction-file lookup now leads with `AGENTS.md`. |
| [`master-ui.md`](master-ui.md) | `../skills/ui-craft-build/` | **Heaviest port.** Two Anthropic Skills replaced by inline design layer + a new Appendix A audit checklist; MCP setup for Codex/Cursor plus a no-MCP Playwright script fallback; Part 0 loading table. |
| [`devbrain-hook.md`](devbrain-hook.md) | `../devbrain-hook.md` | `CLAUDE.md` → `AGENTS.md`, and per-harness loading for Codex / Cursor / Aider / API / ChatGPT Projects / plain chat. |

---

## What changed, and why

**1. `CLAUDE.md` → `AGENTS.md`.** `AGENTS.md` is the cross-vendor instruction file — Codex
CLI, Cursor, Aider, Copilot Agent and Gemini CLI all read it. Where a lookup list made
sense the prompts now check `AGENTS.md`, `CLAUDE.md`, `.cursor/rules/` and
`CONTRIBUTING.md`, so a repo set up for either ecosystem still works.

**2. Subagents → named role prompts.** Claude Code auto-dispatches subagents from
`.claude/agents/`. Nothing else does. The 15 roles are now prompts you invoke by name —
`/security-agent` in Codex CLI, `@security-agent` in Cursor, one system prompt per role
via the API. The routing table still tells the orchestrating session which to reach for;
only dispatch is manual.

**3. Skills → inline content.** Anthropic Skills are Claude-only, so `master-ui.md` can't
`cp` a design skill into place. Its design layer is now the prompt itself, and the
`impeccable audit` step became **Appendix A** — a 7-section, 32-item checklist requiring a
PASS/FAIL plus `file:line` citation per item.

**4. Tool names → capabilities.** `tools: Read, Grep, Glob, Bash` named Claude Code's
tools. Role frontmatter now declares what a role *needs* — read, search, shell,
write/edit, web — so you can map it onto whatever your harness calls them.

**5. `model: opus` → `reasoning: high`.** Model IDs date fast and don't cross vendors.
Every role now asks for the most capable model available at high reasoning effort, with
the reason inline: these prompts demand sustained whole-repo coverage, and low-effort
settings quietly turn an exhaustive pass into a spot check.

**6. MCP config for the right clients.** `claude mcp add` and `~/.claude.json` became
Codex CLI's `~/.codex/config.toml` (`[mcp_servers.playwright]`) and Cursor's
`.cursor/mcp.json` — plus **Option B**, driving Playwright as a plain Node script, which
needs no MCP support and is the portable default.

**7. Degraded mode, stated explicitly.** Chat-only harnesses (ChatGPT web) have no shell
and no repo. Rather than pretending otherwise, each audit prompt now says what it cannot
verify, asks for files in risk order, and requires findings be labelled **UNVERIFIED**
with the command to confirm them. This is the fix for the failure mode where a model
without repo access emits a confident report that reads as if it swept the codebase.

---

## Quick start (Codex CLI)

```bash
# Roles as invocable prompts
mkdir -p ~/.codex/prompts
# split sub-agents.md on its --- boundaries into ~/.codex/prompts/<name>.md
# then: /audit-agent, /security-agent, /refactor-agent, ...

# A standalone pass — paste at the repo root
codex "$(cat openAI/security-audit.md)"
```

Set reasoning effort to high before running any of these.

## Keeping the two editions in sync

Edit the root file first, then port the change here. Only the seven categories above
should ever differ — if you find yourself changing the substance of a finding, a phase,
or a rule in only one edition, that's drift, not a port.
