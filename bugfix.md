# EXTREME BUG HUNT MODE

You are performing a full systematic bug audit of this entire codebase. Do not skip files. Do not assume code is fine because it "looks" fine. Read it. Findings must be evidence-based — every claim must point to real code you actually read in this session.

---

## Phase 0: Setup and safety rails (do this FIRST, before reading any code)

1. **Create a working branch.** Run `git status` first. If the tree is dirty, stop and ask before proceeding. Then: `git checkout -b bug-hunt/audit-$(date +%Y%m%d)`. Never commit to main/master. Never push unless I explicitly say so.

2. **Discover the verification harness.** Inspect `package.json` scripts, `Makefile`, `pyproject.toml`, `tox.ini`, CI configs (`.github/workflows/`, etc.) and record the exact commands for: lint, type check, test suite, build. Run the test suite ONCE now to establish a baseline — record which tests already fail BEFORE you touch anything, so pre-existing failures are never attributed to your fixes. If no test framework exists, note that and adjust Phase 4 rule 4 accordingly.

3. **Create the audit state directory.** Your context will be compacted on a large codebase; these files are your durable memory. Create `.bug-hunt/` (add it to `.gitignore`) containing:
   - `manifest.md` — checklist of every file to audit (built in Phase 1), one line each: `- [ ] path/to/file.ts`. Check off files ONLY after fully reading them. This is the single source of truth for coverage.
   - `findings.md` — append every finding immediately when found, in the format defined in Phase 3. Never hold findings only in memory.
   - `notes.md` — architecture map, data-flow notes, conventions observed, deferred questions.

4. **Resume protocol.** If you ever lose context (compaction, new session, or I say "continue the bug hunt"): re-read all three `.bug-hunt/` files first, then resume from the first unchecked file in `manifest.md`. Do not re-audit checked files. Do not restart from scratch.

5. Read `CLAUDE.md` / `AGENTS.md` / `CONTRIBUTING.md` if present and respect project conventions.

---

## Phase 1: Map the project

1. Enumerate every source file, route file, config, env example, migration, seed, script, Dockerfile, and CI file. Use `git ls-files` (not raw `find`) so you respect `.gitignore` and skip vendored/`node_modules`/build output. Write the full list into `.bug-hunt/manifest.md`.
2. Identify the stack, frameworks, entry points, route definitions, and all external boundaries: DB, third-party APIs, file system, auth provider, queues, cron/background jobs, webhooks, websockets.
3. Sketch the data flow in `notes.md`: request in → middleware → handlers → services → data layer → response out. Note where trust boundaries are crossed (anything user-controlled: body, query, params, headers, cookies, file uploads, webhook payloads).
4. **Risk-rank the manifest.** Reorder it so the highest-risk surfaces are audited first:
   - Tier 1: auth/session/permissions, payment/money/credits, anything executing raw SQL or shell commands, file upload/download paths, webhook handlers, admin routes
   - Tier 2: all other route handlers and API surface
   - Tier 3: services/business logic
   - Tier 4: utils, config, scripts, migrations
   
   Coverage must still reach 100% — risk ranking changes the order, never the scope.
5. Run targeted sweeps NOW and queue any hits for deep review regardless of tier:
   - `grep -rn` for: `eval(`, `exec(`, `child_process`, `subprocess`, `os.system`, `dangerouslySetInnerHTML`, `innerHTML`, `pickle.loads`, `yaml.load(` (without SafeLoader), string-built SQL (`f"SELECT`, `"SELECT " +`, `${...}` inside query strings), `md5`, `http://`, `TODO`/`FIXME`/`HACK`/`XXX`, `as any`, `@ts-ignore`, `# type: ignore`, empty `catch`/`except: pass`, hardcoded-looking secrets (`apikey`, `secret`, `password ?= ?["']`)
   - `npm audit` / `pip-audit` / `cargo audit` (or read lockfile versions) for known CVEs in dependencies.

---

## Phase 2: Walk every file

Go file by file in manifest order. **Read the whole file** — not just the part a grep hit pointed at. For each file, also open its direct callers/callees when needed to confirm a suspected bug is actually reachable; a finding you haven't traced is a guess, not a finding.

**Anti-false-positive rules (these matter as much as finding bugs):**
- Before flagging injection/XSS/CSRF, confirm the framework or ORM doesn't already neutralize it (parameterized queries, auto-escaping templates, built-in CSRF middleware). "Could be unsafe in some framework" is not a finding.
- Before flagging a missing null check, confirm the value can actually be null on a reachable path.
- Every finding must include the exact code you read, quoted. If you cannot quote it, you did not find it.
- Distinguish bugs from preferences. Style opinions that change no behavior are not findings — at most a LOW "smell" with explicit justification.

Per-file checklist:

**Logic bugs**
- Off-by-one, wrong operators (`==` vs `===`, `=` vs `==`, `&&` vs `||`), operator precedence surprises
- Inverted conditions, unreachable branches, dead code, copy-paste bugs (same condition twice, wrong variable reused)
- Wrong loop bounds, missing `break`/`return`, unintended switch fallthrough
- Async functions without `await`, promises not returned or not `.catch`ed, fire-and-forget where the result matters, `forEach` with async callback
- Race conditions, shared mutable state, non-atomic read-modify-write, check-then-act (TOCTOU)
- Floating-point math on money; timezone/DST bugs; naive vs aware datetimes; locale-sensitive string compare/sort
- Mutation of function arguments or shared default args (Python mutable defaults)

**Null / undefined / type safety**
- Unchecked nullables; missing optional chaining where the chain can break
- Type coercion surprises, `NaN` propagation, empty string vs null vs undefined conflation
- Array index/`.find()` results used without checking; destructuring of possibly-undefined
- `JSON.parse` / deserialization without try/catch on untrusted input
- Type escapes that hide real bugs: `as any`, non-null `!`, `@ts-ignore`, `# type: ignore`, unchecked casts

**Routes and paths**
- Duplicate or shadowed routes, wrong HTTP verbs, GET endpoints with side effects
- Missing auth middleware on protected routes; auth checked but authorization (role/ownership) not
- IDOR: user-supplied IDs used to fetch records without ownership check
- Path traversal in any file operation built from user input
- Params/query/body not validated; pagination params unbounded (DoS via `?limit=1000000`)
- Wrong status codes, missing error responses, inconsistent response shapes
- Mass assignment: spreading whole request body into a model update

**Security**
- SQL/NoSQL/command injection; template injection; SSRF (user-supplied URLs fetched server-side)
- XSS in rendered output; missing escaping; unsafe `innerHTML`/`dangerouslySetInnerHTML`
- CSRF protection missing on state-changing routes (when cookie-based auth is in use)
- Secrets in code, logs, error messages, or client bundles; tokens leaked in URLs
- Open CORS (`*` with credentials), weak/missing rate limiting on auth endpoints, missing brute-force protection
- JWT: `alg: none`, signature not verified, expiry not checked, secrets weak
- Insecure deserialization, `eval`, dynamic `require`/import from user input
- Password handling: plaintext, weak hash (md5/sha1), missing salt; timing-unsafe comparisons of secrets
- Redirects to user-supplied URLs (open redirect); regex from user input or catastrophic-backtracking patterns (ReDoS)
- File uploads: type/size unvalidated, stored in web root, original filename trusted

**Error handling**
- Swallowed exceptions (empty catch, `except: pass`), errors logged but flow continues into bad state
- Generic 500s where a 4xx is correct; internal error details leaked to clients
- Resource leaks: unclosed files, connections, streams, listeners; missing `finally`/context managers
- Missing transaction rollback on failure; partial writes left committed
- Errors that crash the process vs errors that should be handled; missing global handlers for unhandled rejections

**Data layer**
- N+1 queries; queries inside loops; missing indexes implied by WHERE/ORDER BY patterns
- Migrations that drop or truncate data; irreversible migrations without a flagged warning; missing rollback
- Wrong column types, nullable mismatches between schema and code assumptions
- ORM misuse, lazy-loading footguns, detached-entity bugs
- Cache invalidation gaps; stale reads after writes; cache keys missing tenant/user scoping
- Soft-delete rows leaking into queries that forget the filter

**Concurrency & jobs**
- Missing locks; double-spend/double-submit possibilities; unique constraints relied on but absent
- Idempotency missing on retried operations (payments, emails, webhooks)
- Background jobs not safe to run twice; jobs with no timeout, no retry policy, or unbounded retries
- Webhook handlers that don't verify signatures or handle replay

**Config and env**
- Required env vars with no validation at startup (fail late instead of fail fast)
- Different defaults in dev vs prod that hide bugs; debug mode reachable in prod
- Hardcoded URLs, ports, paths, credentials
- `.env.example` out of sync with actual env usage

**Dependencies**
- Known CVEs (from the audit run in Phase 1), deprecated APIs, missing version pins / wildly loose ranges
- Unused deps, missing peer deps, dev deps imported in production code

After finishing each file: append findings to `findings.md`, then check the file off in `manifest.md`. Do both immediately — not in batches.

**For large codebases:** you may dispatch parallel subagents (Task tool) to audit independent directory chunks, but each subagent must write findings in the same format to its own findings file, and YOU must merge them into `findings.md` and verify each subagent finding by reading the cited code yourself before it enters the report. Coverage checkoffs in `manifest.md` happen only after verification.

---

## Phase 3: Report before fixing

Compile `findings.md` into a single report grouped by severity. Present it to me and WAIT for my go-ahead before fixing anything.

Severity rubric — classify by worst plausible impact on a reachable path:
- **CRITICAL** — data loss/corruption, auth bypass, injection, money bugs, secrets exposure, prod-path crashes
- **HIGH** — wrong behavior real users will hit; security issues requiring unusual but possible conditions
- **MEDIUM** — edge cases, degraded UX, performance problems, reliability risks
- **LOW** — smells, dead code, cleanup, tiny risks

Each finding uses this exact format:

```
### [SEV-###] Short title
File: path/to/file.ext:LINE
Code: `the actual offending line(s), quoted verbatim`
What: what is wrong
Why: why it's wrong / how it's triggered (include the trace: where the bad input comes from)
Fix: proposed fix (concrete, minimal)
Confidence: HIGH (verified reachable) | MEDIUM (likely, partial trace) | LOW (suspicious, needs human confirmation)
```

End the report with a coverage statement: files audited / total files from manifest, plus anything intentionally excluded and why.

---

## Phase 4: Fix

Fix in order: CRITICAL → HIGH → MEDIUM → LOW. Skip LOW-confidence findings unless I confirm them.

Rules:
1. One concern per change. One git commit per finding (or per tight group of identical findings), message format: `fix(SEV-###): short description`. Keep diffs reviewable.
2. Do not refactor unrelated code. Do not "improve while you're in there."
3. Do not change public API shapes, response formats, or DB schemas unless the bug requires it — and if it does, flag it loudly in the report and ask first.
4. Add a regression test for every CRITICAL and HIGH fix when a test framework exists. The test must fail on the old code and pass on the new code — actually verify this (stash/checkout the old version or invert the fix temporarily).
5. Run lint, type check, and the test suite after each severity batch. Compare against the Phase 0 baseline — fix anything YOU broke before moving on; do not chase pre-existing failures unless they're in your report.
6. If a fix is risky, ambiguous, or has multiple defensible approaches, stop and ask before applying.
7. Update `findings.md` status per item: `FIXED <commit>`, `WONTFIX <reason>`, `NEEDS-HUMAN <question>`.

---

## Phase 5: Final pass

1. Re-run the full test suite, linter, and type checker. Goal: zero new warnings vs baseline.
2. `git diff main...HEAD --stat` and review your own diff once, end to end, hunting for anything you broke.
3. Produce the final summary:
   - What changed (by severity, with commit refs)
   - Found but intentionally not fixed, and why
   - NEEDS-HUMAN items and open questions
   - Follow-ups recommended (missing tests, missing indexes, dependency upgrades)
   - Final coverage: N/N files audited

---

## Non-negotiables

- Do not stop early. Do not say "the rest looks fine" without reading it. If the codebase is huge, work in chunks across turns/sessions using `.bug-hunt/` state, and keep going until every manifest file is checked.
- Never report a bug at a file:line you haven't read this session. No hallucinated line numbers, no findings from memory of "typical" codebases.
- When token budget per turn runs low, finish the current file, sync `.bug-hunt/` state, and tell me exactly where you stopped so "continue" resumes cleanly.
