# EXTREME BUG HUNT MODE

You are doing a full systematic bug audit of this entire codebase. Do not skip files. Do not assume code is fine because it "looks" fine. Read it.

## Phase 1: Map the project
1. List every source file, route file, config, env example, migration, and script.
2. Identify the stack, entry points, route definitions, and all external boundaries (DB, APIs, file system, auth, queues).
3. Build a mental model of data flow: request in -> handlers -> services -> data layer -> response out.

## Phase 2: Walk every file
Go file by file. For each one, check for:

**Logic bugs**
- Off-by-one, wrong operators (== vs ===, = vs ==, && vs ||)
- Inverted conditions, unreachable branches, dead code
- Wrong loop bounds, missing break/return, fallthroughs
- Async functions without await, promises not returned, fire-and-forget where it matters
- Race conditions, shared mutable state, non-atomic read-modify-write

**Null / undefined / type safety**
- Unchecked nullables, optional chaining missing where needed
- Type coercion surprises, NaN handling, empty string vs null
- Array index access without bounds checks
- JSON.parse without try/catch
- Any cast away of types (as any, !, # pragma) that hides real bugs

**Routes and paths**
- Duplicate routes, shadowed routes, wrong HTTP verbs
- Missing auth middleware on protected routes
- Path traversal in file operations
- Trailing slash inconsistencies, case sensitivity issues
- Wrong status codes, missing error responses
- Params not validated, query strings trusted blindly

**Security**
- SQL injection, NoSQL injection, command injection
- XSS in rendered output, missing escaping in templates
- CSRF protection missing on state-changing routes
- Secrets in code or logs, tokens leaked in errors
- Open CORS, weak auth checks, missing rate limiting
- Insecure deserialization, eval, dynamic require
- IDOR (user accessing other users data via id in URL)

**Error handling**
- Swallowed exceptions (empty catch), errors logged but not handled
- Wrong error types thrown, generic 500s where 4xx is right
- Resource leaks: unclosed files, connections, streams
- Missing finally, missing transaction rollback
- Errors that crash the process vs errors that should

**Data layer**
- N+1 queries, missing indexes implied by query patterns
- Migrations that drop data, missing rollback
- Wrong column types, nullable mismatches
- ORM misuse, lazy loading footguns
- Cache invalidation gaps

**Concurrency**
- Missing locks, double-spend possibilities
- Idempotency missing on retried operations
- Background jobs that can run twice safely or not

**Config and env**
- Missing env vars with no fallback or validation
- Different defaults in dev vs prod that hide bugs
- Hardcoded URLs, ports, paths

**Dependencies**
- Deprecated APIs, known CVEs, version pins missing
- Unused deps, missing peer deps

## Phase 3: Report before fixing
Produce a single report grouped by severity:
- CRITICAL: data loss, security holes, crashes in prod paths
- HIGH: wrong behavior users will hit
- MEDIUM: edge cases, degraded UX, perf
- LOW: smells, cleanup, tiny risks

For each finding include: file, line, what is wrong, why it is wrong, proposed fix.

## Phase 4: Fix
Once the report is ready, fix in this order: CRITICAL, HIGH, MEDIUM, LOW.

Rules while fixing:
1. One concern per change. Keep diffs reviewable.
2. Do not refactor unrelated code.
3. Do not change public API shapes unless the bug requires it. If it does, flag it loudly.
4. Add a regression test for every CRITICAL and HIGH fix when a test framework exists.
5. Run the linter, type checker, and test suite after each batch. If something breaks, fix it before moving on.
6. If a fix is risky or ambiguous, stop and ask before applying.

## Phase 5: Final pass
- Re-run full test suite.
- Re-run linter and type checker with zero warnings as the goal.
- Summarize what changed, what was found but intentionally not fixed, and any followups.

Do not stop early. Do not say "the rest looks fine" without actually reading it. If the codebase is huge, work in chunks and keep going across turns until every file is covered.
