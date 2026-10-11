# Team agents — research and the v2 redesign (2026-10-10)

This is the research the owner asked for before anything was changed: a
forensic read of all sixteen installed agents, the evidence for why a run of
`ui-agent` on a real project "barely did anything", what the current Claude
Code harness supports that the agents did not use, how to measure an agent
instead of trusting it, and the v2 design that came out of it (the shared
rules, the ownership matrix, the manager agent, the gate hook). Every claim
about an agent file cites a line of the file as it was on 2026-10-10
(`~/.claude/agents/<name>.md`, synced copies in `sub-agents.md`).

## 1. What actually happened on the snacks project

- The `ui-agent` run fixed dark-mode tokens and stopped. A manual signed-in
  review on 2026-10-07 (DevBrain/Desktop/snacks-ui-review.md) listed eleven
  misses: mobile list rows keeping desktop column widths so names wrap 5–6
  lines; a flat type scale (h1 ≈ 20px, h2 = item names); unlabeled "✕"/"✓"
  glyph buttons next to destructive actions; a 7,500px catalog with no
  search, filter or section nav; the same add-form duplicated on two pages;
  an unstyled native file input; a header wrapping to three rows on mobile;
  a money panel with three unexplained budgets; votes shown with no vote
  control; prices shown twice; light-mode contrast still failing.
- Only two of the eleven (flat type, light contrast) were things the agent
  file instructed and measured. The other nine were not in the file at all
  (grep for `search|filter|paginat|sticky|heuristic` returned nothing) or
  were explicitly accepted (line 381–382 accepted a header that "wraps").
- Three rules in the file rewarded the small result:
  1. Line 140–141: "A change you can't measure is a preference. Preferences
     get reverted." Phase 5 #2 (551–552): "No measurable improvement and no
     slop tell removed → revert." The only numbers the file produced were
     contrast, overflow, targets under 24px and inputs under 16px. Every
     judgment-based fix the manual review wanted was, by the file's own
     definition, a preference to revert.
  2. Line 166 "Use the URL in the invocation" plus 170–172 "Production URLs
     are read-only … never type credentials" meant a production URL
     pre-empted the local dev server, and the signed-in routes (where the
     misses were) were skipped by rule.
  3. The frontmatter granted thirteen Playwright tools but not
     `browser_type` or `browser_fill_form`: the agent could not type a
     password into a login form even on localhost. `browser_snapshot` (the
     accessibility tree, the one instrument for "accessible name on every
     icon-only control") was granted and never mentioned in the body.

So the agent did exactly what its definition rewarded. The same shape
appears in the other fifteen.

## 2. Findings across all sixteen agents

Four analysts read every file in full against one rubric (mandate, tools,
fix scope, definition-of-done floor, verification, overlap, vague
instructions, missing capabilities, contradictions). The per-agent reports
are summarized here; the patterns repeated in nearly every file:

| Pattern | Where | Effect |
|---|---|---|
| A sentence that licenses doing less: "Fewer verified fixes beat many unverified edits" (5 files), "a change you can't measure is a preference and gets reverted" (perf 10–11, reliability 14, ui 140–141) | api-contract, compliance, deps, env, security, perf, reliability, ui | Wherever an instrument is missing, the agent is told to revert rather than build the instrument |
| Browser work described, no browser tools granted | check 297, debug 222–224, test 531–533, perf 269–270, compliance 437–441, security 315–319 (CSP) | Every UI-touching check degrades to NEEDS-RUNTIME-CHECK; UI bugs end CANNOT-REPRODUCE |
| No definition of done, no scope ratio | 14 of 16 (api-contract and release force per-item accounting) | "Contrast fails 12 → 7" or "2 fixes kept, 6 reverted" is a legal end state and reverts vanish from every report |
| The universal block contradicts the agent's own default twice | all 16 (universal 85–87 "if asked, applied directly", 90–91 "wait for explicit sign-off", 99–101 "OPEN — report-only default" vs each file's "Default mode is FIX") | The prompt argues with itself; the conservative reading wins on a hard repo |
| HUMAN-GATE "exactly N things" ends with a catch-all | most files | The gate list is open-ended in practice |
| True fix overlaps (two agents apply the same fix with different policies) | headers (audit, security), validation schemas (security "reject unknown keys" vs api-contract "accept every value consumers send"), auth rate limits (security applies, reliability gates), font self-hosting (ui, perf, compliance), image attrs (ui, perf), `.env.example` (env, docs, security, test, ui all write it), CVE patches (security, deps), unused deps (refactor runs `npm uninstall`, deps claims the manifest), `.only` removal (audit, test), comments-that-lie (audit, docs), STAGED SQL (perf, reliability, migration with three header formats) | Sequential runs add, gate and reshape the same lines; two agents will write different schemas on the same handler |
| Ownership statements that point at the wrong agent | deps sends Actions SHA-pinning to security (security has no such fix; audit owns it); env says release reads its table (release never mentions env); compliance self-hosts fonts while assigning font loading to ui | Handoffs land nowhere |
| Orchestration promised, impossible as written | release-agent "invokes check-agent, migration-agent, env-agent" with no `Agent` tool; body says "apply check-agent's Phase 0/2/3/4" (re-read 500-line siblings inline) | The release gate re-implements shallower versions of its sub-gates and skips security and dependency gates entirely |
| Three different baseline file names | `.agent-audit/baseline.md`, `check/baseline.md`, `audit/baseline.md` | Agents cannot read each other's baselines |

Per-agent single biggest reason it would stop short (from the forensic
reads, each cited in `analysis/<agent>.md` in the session scratchpad):
- **ui-agent:** measurement-or-revert with a four-number probe set; cannot
  sign in.
- **audit-agent:** fixes a narrow catalogue, hands most categories away,
  no per-category ratio, prose-only categories declared clean after a read.
- **security-agent:** evidence ladder has no bottom rung (authz needs a
  runner, headers need a started app, CSP needs a browser it lacks); most
  fixes degrade to APPLIED-UNVERIFIED.
- **reliability-agent:** every recipe conditioned on infrastructure "that
  already exists"; "will this double-charge" is gated outright.
- **debug-agent:** blast radius is one self-written regex read hit-by-hit;
  CANNOT-REPRODUCE ends the run; UI bugs land there.
- **check-agent:** a consumer-breakage checker labelled a reviewer; UI
  changes can never PASS.
- **test-agent:** no floor; a coverage map plus "remaining gaps" is a
  complete deliverable.
- **refactor-agent:** the deletion half works, the refactoring half is
  report-only.
- **perf-agent:** strong on DB/server, near-zero on frontend because every
  measurement is "when a browser is available".
- **deps-agent:** npm-only commands; a peer conflict blocks every batch
  with no BLOCKED disposition.
- **migration-agent:** verifies its own SQL with a regex and a tautology;
  never parses or dry-runs even on a throwaway local DB.
- **docs-agent:** never starts the app; inline comments never enumerated.
- **env-agent:** without a linked Vercel CLI every dev-fallback fix becomes
  a proposal.
- **api-contract-agent:** "unsure → EXTERNAL" then EXTERNAL is excluded
  from fixing; nothing is ever executed.
- **compliance-agent:** cannot prove consent gates anything (no browser).
- **release-agent:** cannot orchestrate; NOT RUN is compatible with GO.

## 3. What the harness supports that the agents did not use

Verified against code.claude.com docs on 2026-10-10 (Claude Code 2.1.280):
- `model:` accepts `inherit`, `fable`, `opus`, `sonnet`, `haiku` or a full
  id. All sixteen were pinned to `opus`; the owner runs Fable 5.1. `inherit`
  gives every agent the session's model.
- `memory: user | project | local` gives an agent a notes folder across
  runs (`~/.claude/agent-memory/<name>/`, `.claude/agent-memory/<name>/`,
  `.claude/agent-memory-local/<name>/`). None used it; every run re-learned
  how to start the app and sign in.
- `hooks:` in agent frontmatter supports `PreToolUse`, `PostToolUse` and
  `Stop` (converted to `SubagentStop`). A Stop hook may answer
  `{"decision":"block","reason":"…"}` and the agent keeps working. That is
  an enforceable definition of done.
- `skills:` preloads up to 32 skills into the agent's context at start.
- Subagents can spawn subagents up to three layers deep when `Agent` is in
  `tools:`, so a real orchestrator (release, manager) is possible.
- `mcp__<server>__*` wildcards are valid in `tools:`.
- `claude plugin eval` exists (early access) with six grader types
  (`regex`, `tool_used`, `tool_order`, `file_exists`, `llm`, `baseline`),
  cases up to 200 turns, fixtures via `scaffold_script`. It loads no MCP
  servers or user config, so it suits trigger/shape regression tests, not
  full browser runs.

## 4. How to measure an agent (the "beyond 100%" mechanism)

Sources: Anthropic, "Demystifying evals for AI agents" (grade what the
agent produced, boolean checks over evidence, convert real failures into
regression evals); arXiv 2607.25152 (in-band self-evaluation degenerates to
accept-all; an out-of-band evaluator with independent world access and
file-based handoff restores discrimination); anthropics/cwc-long-running-
agents (default-FAIL results ledger the agent cannot flip without opening
evidence, a fresh-context evaluator without write tools, findings become
the next prompt); Anthropic "Building effective agents" (bounded
evaluator-optimizer loop).

Applied to this suite:
1. **Definition of Done as a ledger.** Every agent declares 8–15 checkable
   criteria. At run start it writes them all `false` to `dod.json`; a row
   flips only with an evidence path. The report prints PASS or
   `FAIL — <reason code>`; a FAIL without a code is an unfinished run.
2. **Scope ratio on line 2 of every report:** `Found N | Fixed N |
   Applied-unverified N | Staged N | Gated N | Handed off N | Blocked N |
   Reverted N | Not attempted 0`. "Not attempted" must be zero or every item
   listed with a reason code. Reverted batches get their own section, so
   reverts stop vanishing.
3. **A gate hook that refuses to let the agent finish** until the report
   exists and satisfies the contract (`~/.claude/hooks/agent-gate.mjs`,
   deterministic, blocks at most twice per run, never blocks on its own
   error).
4. **An out-of-band grader** (`manager-agent`): no product edits, fresh
   context, grades from the working tree and by re-running the agent's own
   "Manager re-checks" (every agent now ends with 6–12 runnable
   re-checks), samples files marked clean with the agent's own patterns
   (recall), and re-invokes the agent with the exact misses, up to three
   loops. Scorecards accumulate in memory; a check that fails in three of
   five runs becomes a proposed definition diff (closed loop on the
   prompts themselves).
5. **Two evidence tracks** replace measurement-or-revert: Track A (a number
   moved) or Track B (a named rule from the agent's list, before/after
   artefacts, one sentence why). Only a change with neither is reverted.
6. **Build the instrument before you degrade:** a running app, a browser,
   a signed-in session (five-step ladder), a throwaway local database and
   network docs are things the agent provisions and logs before any item
   becomes `BLOCKED-*`.
7. **One owner per concern** (25-row matrix in `OWNERSHIP.md`); everyone
   else writes an append-only handoff line to
   `.agent-audit/handoffs/<owner>.md` and reads their own file at start.
8. **Recall against planted defects:** when `.agent-audit/expected.md`
   lists known defects, the manager reports recall per agent. Fixture
   repos with planted defects are the next step for a regression suite.

## 5. The v2 suite

- Seventeen agents: the sixteen plus `manager-agent`.
- Shared `UNIVERSAL.md` (eleven numbered sections: coverage, durable state,
  evidence tracks, instrument-building, definition of done, gating,
  report contract, fix loop, ownership, memory, manager re-checks),
  embedded verbatim in every file and checked by a validator.
- Frontmatter: `model: inherit`, `memory: local`, the Stop-hook gate; tools
  per agent, with Playwright granted to ui, perf, debug, check, test,
  compliance and security, `Agent` to release and manager, Web tools to
  deps, security, compliance, docs, ui and manager.
- Every agent has: Owns and hands off; Reading your handoffs; Phase 0 with
  a package-manager table and the instrument ladder; executable phases
  with hit counts; a closed HUMAN-GATE list with no catch-all; dated
  standards; stack notes; static patterns; the deterministic output
  format; a Definition of Done table; Manager re-checks.
- Removed from every file: the do-less sentences, the browser "when
  available" conditionals, the contradictory universal lines, the
  catch-all gates, the fixes that belong to another owner.
- `ui-agent` specifically: can sign in (`browser_fill_form`), measures
  signed-in routes locally even when a production URL is supplied, runs a
  third probe for accessibility counts (and axe when installed), a
  task-flow walk per route, Nielsen's ten as pass/fail checks, row-stacking
  and header-budget rules, findability rules for long pages, derived-text
  captions and labels as AGENT-SAFE, wiring an existing action to a visible
  control as AGENT-SAFE, a 15-row definition of done.
- Install surface: `~/.claude/agents/*.md`, `~/.claude/hooks/agent-gate.mjs`,
  `~/.claude/references/team-agents/{UNIVERSAL,OWNERSHIP}.md` +
  `validate-agent.mjs`, the existing `taste` skill and `ui-benchmarks`;
  bundled by `npm run agents:bundle` in RcDevDash into
  `install-team-agents.md`.

## 6. How to use the loop

- `/manager-agent run ui-agent` — runs ui-agent, grades it, reruns it with
  the misses until it passes (max 3 loops), writes scorecards under
  `.agent-audit/manager/`.
- `/manager-agent grade security-agent` — grades the last run only.
- `/manager-agent suite pre-ship` — security → reliability → test → check,
  graded at every step, handoffs propagated.
- `/manager-agent calibrate` — validator on all 17 definitions, ownership
  collisions, trigger collisions, drift, gate health, scorecard trends,
  proposed definition diffs.
- Any agent on its own still has to satisfy the gate hook before it can
  finish.
