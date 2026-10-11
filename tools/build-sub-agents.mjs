// Rebuilds sub-agents.md from the installed agent definitions.
//
//   node tools/build-sub-agents.mjs [--agents <dir>] [--out sub-agents.md]
//
// Source of truth is the agents directory (default ~/.claude/agents). The
// output keeps the routing table and the universal rules once at the top,
// then one block per agent in the suite order below. Each block is the
// agent's complete file (frontmatter in a ```yaml fence, then the body), so
// splitting the blocks on their `---` boundaries still yields installable
// agents. The universal block inside each body is left in place on purpose:
// an installed agent must be self-contained.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const AGENTS_DIR = opt("--agents", join(homedir(), ".claude", "agents"));
const OUT = opt("--out", "sub-agents.md");
const REF = join(homedir(), ".claude", "references", "team-agents");

const ORDER = [
  "audit-agent", "security-agent", "reliability-agent", "debug-agent", "check-agent",
  "test-agent", "refactor-agent", "perf-agent", "deps-agent", "migration-agent",
  "docs-agent", "ui-agent", "compliance-agent", "api-contract-agent", "env-agent",
  "release-agent", "manager-agent",
];

const read = (p) => readFileSync(p, "utf8").replace(/\r\n/g, "\n").trimEnd();
const universal = existsSync(join(REF, "UNIVERSAL.md")) ? read(join(REF, "UNIVERSAL.md")) : null;
const ownership = existsSync(join(REF, "OWNERSHIP.md")) ? read(join(REF, "OWNERSHIP.md")) : null;

const header = `# General Use Prompt — Exhaustive Full-Project Sub-Agents (v2)

Stack-agnostic. Seventeen fix-by-default subagents for Claude Code. Install
them with \`install-team-agents.md\` (one paste), or split each \`---\` block
below into its own file under \`~/.claude/agents/<name>.md\`. Every agent
embeds the same Universal rules, carries a Definition of Done, a Stop-hook
gate (\`~/.claude/hooks/agent-gate.mjs\`) that refuses to let it finish
without a complete report, and a "Manager re-checks" list that
\`manager-agent\` executes out of band to grade the run.

**Mode: EXHAUSTIVE, FIX BY DEFAULT.** Every agent defaults to full-project
scope and applies every fix it owns. A narrower scope or "report only" must
be stated in the invocation.

---

## How this works

The **main agent** delegates to the matching sub-agent, which writes its
report to \`.agent-audit/<agent>/report.md\` and returns a copy. To make an
agent finish the whole job, run it through the manager:
\`/manager-agent run <agent>\` spawns it, grades it from the working tree,
and re-invokes it with the exact misses (up to three loops).

**Routing rule for the main agent:**

| Trigger | Sub-agent |
|---|---|
| "audit this", "code quality pass", "general review", "is this shippable" | \`audit-agent\` (first pass; routes handoffs to every owner) |
| "security audit", "harden this", "pentest the code", "find vulnerabilities", "exposed secrets" | \`security-agent\` |
| "reliability audit", "safe under retries/load", "idempotency", "race conditions", "will this double-charge" | \`reliability-agent\` |
| "this is broken", "reproduce this bug", "why is X happening", stack trace pasted | \`debug-agent\` |
| "review this before I merge", "sanity check this", "does this look right" | \`check-agent\` |
| "write tests", "add coverage", "does this have tests", "run the test suite" | \`test-agent\` |
| "clean this up", "find dead code", "what's unused/broken", "refactor pass", "simplify this" | \`refactor-agent\` |
| "why is this slow", "performance pass", "bundle size", "optimize", "N+1", "Core Web Vitals" | \`perf-agent\` |
| "update dependencies", "check CVEs", "is this package maintained", "upgrade X" | \`deps-agent\` |
| "review this migration", "is this schema change safe", "RLS drift" | \`migration-agent\` |
| "are the docs accurate", "update the README", "docs check", "generate docs" | \`docs-agent\` |
| "fix the UI", "fix mobile view", "fix the colors/fonts", "the UI is ugly", "looks AI-generated", "accessibility check", "a11y", "design consistency", "does this match DESIGN.md" | \`ui-agent\` |
| "compliance check", "launch legal", "is this site legal to ship", "privacy/cookie/T&C check", "GDPR/CCPA", "trust pass", "are these claims backed" | \`compliance-agent\` |
| "do the types match", "API contract check", "schema/type drift", "validation gaps" | \`api-contract-agent\` |
| "check env vars", "config audit", "why does prod behave differently" | \`env-agent\` |
| "ready to ship?", "pre-deploy check", "release checklist", "go/no-go" | \`release-agent\` (spawns check, migration, env, security, deps, compliance sub-gates) |
| "manager", "check the agent's work", "did the agent do everything", "grade the run", "run X and verify", "make X finish", "pre-ship suite", "calibrate the agents" | \`manager-agent\` |

Suites (run through \`/manager-agent suite <name>\`, graded at every step):
\`pre-ship\` = security → reliability → test → check ·
\`cleanup\` = audit → refactor → test → check ·
\`launch\` = ui → compliance → check ·
\`bugfix <bug>\` = debug → test → check ·
\`release\` = release-agent (spawns its own sub-gates).

HUMAN-GATE items from any agent (auth/RBAC, schema, billing, prod data,
irreversible deletes, brand, copy meaning) are written up as exact edits
for sign-off and never applied.

---
`;

const parts = [header];
if (universal) parts.push(universal + "\n\n---\n");
if (ownership) parts.push("# " + ownership.replace(/^# /, "") + "\n\n---\n");

for (const name of ORDER) {
  const p = join(AGENTS_DIR, `${name}.md`);
  if (!existsSync(p)) throw new Error(`missing agent file: ${p}`);
  const t = read(p);
  const m = t.match(/^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/);
  if (!m) throw new Error(`no frontmatter in ${p}`);
  parts.push("```yaml\n---\n" + m[1] + "\n---\n```\n\n" + m[2].trimEnd() + "\n\n---\n");
}

parts.push(`## Notes for adapting this

- **Cost/time warning:** exhaustive mode on a large repo means long runs and
  heavy token use. Name a scope in the invocation for a shorter run.
- \`model: inherit\` uses the session's model; set a specific alias per agent
  if you want a cheaper model on, say, check-agent.
- The Stop-hook gate needs Node.js on PATH; when it fails to run, the agent
  simply finishes unblocked (\`onFailure\` defaults to continue).
- \`memory: local\` writes notes to \`.claude/agent-memory-local/<agent>/\`;
  every agent adds that folder and \`.agent-audit/\` to \`.gitignore\`.
- Ownership is one agent per concern (the matrix above). Add a concern by
  adding a row and an owner; never let two agents fix the same thing.
`);

const out = parts.join("\n") + "\n";
writeFileSync(OUT, out);
console.log(`wrote ${OUT}: ${ORDER.length} agents, ${out.split("\n").length} lines`);
