# RELIABILITY AUDIT & REMEDIATION

> **Portable edition.** Runs in any coding agent with repo read/write and shell access —
> OpenAI Codex CLI, Cursor, Windsurf, Aider, Copilot Agent, Gemini CLI, or a GPT-5-class
> model via the API. Nothing here depends on a specific vendor's tooling.
>
> **Set reasoning effort to high.** Phase 0 recon has to stay loaded through Phase 4;
> low-effort settings drop the topology facts that decide whether a finding is even valid.
>
> **No shell or file access** (e.g. ChatGPT web): you cannot complete Phase 0, so you
> cannot validly flag anything — the whole point of recon is that a missing in-app rate
> limit is not a finding if the platform enforces one. Say that plainly, ask for the files
> Phase 0 needs, and mark every observation **UNVERIFIED** with the command to confirm it.

You are performing a rigorous audit of this codebase for five reliability
patterns: **idempotency, deduplication, caching, rate limiting, and atomic
operations** — then fixing what you find. Be direct and skeptical, but every
finding must be *provable*: if you cannot write the concrete failure
narrative, it is not a finding. Inventing problems to look thorough is a
failure of this task.

---

## SCOPE

**In scope:** every API endpoint, background job, scheduled task, queue
consumer, webhook handler, outbound HTTP/API call, DB write path, counter or
balance mutation, and file I/O operation.

**Out of scope (do not flag, do not touch):** test files, fixtures, vendored
or generated code, one-off scripts clearly marked as such, and existing
migration files (you may *add* new migrations).

---

## PHASE 0 — RECON (mandatory, before flagging anything)

Do not prescribe a single fix until you can answer all of these. Write the
answers into the top of `AUDIT.md`:

1. **Stack & framework** — language, web framework, ORM, job/queue system.
2. **Datastores available** — which DB (and engine/version if discoverable),
   is Redis/memcached present, is there any existing cache layer?
3. **Deployment topology** — single process or multiple workers/instances?
   (Check Procfile, gunicorn/uwsgi config, Dockerfiles, hosting hints.)
   This determines whether in-process caches/limiters are valid at all.
4. **Existing guards** — search for middleware, decorators, DB constraints,
   unique indexes, and reverse-proxy/platform-level protections *before*
   flagging their absence. A missing in-app rate limit is not a finding if
   the platform enforces one — but note the dependency.
5. **Entry-point inventory** — list every route, job, consumer, and webhook
   with file:line. This is your hunt map.
6. **Test baseline** — run the existing test suite now. Record pass/fail
   counts. If there is no test suite, say so; it changes the fix rules below.

---

## PHASE 1 — HUNT

For each pattern, work from the entry-point inventory. A finding is only
valid if it includes a **failure narrative**: the specific interleaving,
retry, or replay sequence that breaks, what state results, and who notices.

### 1) Idempotency
Any state mutation that can be retried (network retry, double-click, queue
redelivery, webhook replay, job re-run).

Hunt for:
- POST/PUT/PATCH/DELETE endpoints with side effects and no idempotency key
  support (prioritize: payments, sends, anything creating money- or
  user-visible records)
- Webhook handlers with no replayed-event check (no event-id ledger)
- Background jobs that double-charge, double-send, or double-write on re-run
- "Check if exists, then create" as two separate queries instead of an
  atomic upsert / `INSERT ... ON DUPLICATE KEY` / `ON CONFLICT`
- Email/SMS/notification sends with no dedupe guard

**Fix pattern:** accept an `Idempotency-Key` header (or derive a key from
event id / content hash). **The claim must be atomic** — insert the key into
a table with a unique constraint (or `SETNX` if Redis exists) *before*
executing the operation; on conflict, return the stored result. A
read-then-write cache check is itself a race and is not an acceptable fix.
Default retention: 24h, stated in a comment.

### 2) Deduplication
Same logical event processed more than once.

Hunt for:
- Queue consumers with no message-id tracking
- Webhook endpoints with no event-id ledger (also check timestamp tolerance
  if the provider signs with one)
- Bulk import paths that insert without checking/upserting existing rows
- File upload handlers that don't hash content before storing duplicates
- Any "for each item, do X" loop where X is not safe to run twice

**Fix pattern:** persist a seen-set — DB table with unique index is the
default; Redis SET only if Redis exists and loss of the set is acceptable.
Short-circuit on hit.

**Migration safety (critical):** before adding any unique constraint to an
existing table, first query for existing duplicates. If duplicates exist,
write a dedupe migration step (keep newest/oldest — state your choice and
why) that runs *before* the constraint. A unique-index migration that fails
on prod data is worse than the bug.

### 3) Caching
Expensive reads with no cache, and caches that lie.

Hunt for:
- Hot reads hitting the DB or an external API on every request
- N+1 queries in loops (check ORM lazy-loading in templates/serializers too)
- LLM / embedding / inference calls with no response cache — key on
  `(model, prompt hash, sampling params)`; only cache when params make
  output deterministic-enough for the use case, and say so in a comment
- File parsing repeated on identical inputs (hash the bytes, cache the parse)
- Caches with no TTL, no invalidation on write, or no negative caching
- Stale-read risk: identify the strategy per cache (cache-aside,
  write-through) and verify invalidation actually fires on every write path,
  not just the obvious one
- Hot keys with stampede risk (many concurrent misses recompute together) —
  add a lock/singleflight or short jittered TTL where it matters

**Fix pattern:** smallest correct layer — in-process LRU only if recon
confirmed single-process; otherwise DB or Redis. Every cache gets: explicit
TTL, a documented key convention, and invalidation on write. Document the
strategy in a comment at the cache site.

### 4) Rate limiting & outbound resilience
Every entry point that can be hammered; every outbound call that can hang or
be throttled.

Hunt for:
- Public or authenticated endpoints with no per-user/per-IP limit
- Login, signup, password reset, OTP routes with no brute-force guard
  (these are security findings — severity floor: High)
- File upload endpoints with no size cap or frequency cap
- LLM/inference endpoints with no per-user concurrency or budget limit
  (metered GPU = unbounded cost exposure → Critical)
- **Outbound calls with no timeout.** A missing timeout is worse than
  missing backoff — flag every external call without an explicit one
- Outbound calls with no retry policy, or retries with no exponential
  backoff + jitter, or retrying non-idempotent operations
- Repeated-failure paths with no circuit breaker where a dependency outage
  would cascade
- Connection pool / worker exhaustion risks (slow outbound call holding a
  worker per request)

**Fix pattern:** token bucket or sliding window keyed by user id / IP / API
key, backed by shared storage if multi-worker. Return `429` with
`Retry-After`. Outbound: explicit timeouts on every call, exponential
backoff + jitter, retry only idempotent operations, circuit-break repeated
failures. If platform-level limiting is the right answer (reverse proxy,
hosting config), implement what's possible in code and document the rest in
`BACKLOG.md`.

### 5) Atomic operations
Multi-step writes that can leave torn state.

Hunt for:
- Read-modify-write with no transaction and no row lock
- Multiple DB writes that must commit together but don't share a transaction
- Counter/balance updates via SELECT-then-UPDATE instead of
  `UPDATE ... SET x = x + 1` or equivalent atomic primitive
- Check-then-insert uniqueness logic with no unique constraint backing it
  (the constraint is the fix; the application check is just UX)
- File writes without atomic replace (write `.tmp`, fsync, rename)
- Cross-system writes (DB + S3, DB + queue, DB + external API) with no
  outbox pattern, saga, or at least a documented reconciliation story
- Transactions that hold locks across network calls (deadlock/latency risk —
  flag these too; the fix is moving the call outside the transaction)

**Fix pattern:** wrap in a transaction at appropriate isolation;
`SELECT ... FOR UPDATE` or optimistic locking with a version column; atomic
primitives where available; outbox for cross-system writes. Match the ORM's
idioms — don't drop to raw SQL unless the ORM cannot express it.

---

## PHASE 2 — REPORT

Write findings to `AUDIT.md` before changing any code. For each:

1. **ID** (e.g. `IDEM-01`) · file path · line range
2. **Failure narrative** — the concrete sequence that breaks, and the
   resulting state
3. **Evidence of no existing guard** — what you checked (constraint,
   middleware, platform) and didn't find
4. **Severity**, per this rubric:
   - **Critical** — money moved twice, data corrupted, auth brute-forceable,
     or unbounded cost (e.g. unmetered GPU/LLM spend)
   - **High** — user-visible duplicate side effects (double email/SMS),
     torn state needing manual repair, dependency outage cascades
   - **Medium** — measurable performance/load problems (N+1 on hot paths,
     uncached expensive reads), races with limited blast radius
   - **Low** — theoretical races with low probability *and* low impact,
     hygiene issues
5. **Proposed fix** — exact change, plus any migration/backfill required

Rank by severity, then by blast radius.

---

## PHASE 3 — FIX (rules of engagement)

- Fix the **top 10** by severity. Everything else goes to `BACKLOG.md` with
  enough detail that a future session can pick each item up cold.
- **Minimal diffs.** No drive-by refactors, no formatting sweeps, no
  renames. The diff should read as exactly the fix.
- Use infrastructure confirmed in recon. Do not introduce Redis, a queue,
  or a new dependency to fix one finding — pick the DB-backed equivalent or
  backlog it with rationale.
- Every fix gets a regression test demonstrating the failure is closed
  (simulate the retry/replay/race where feasible). If the project has no
  test harness, create a minimal one for the fixes only.
- One commit per finding (or per tightly-coupled group). Message format:
  `fix(IDEM-01): <what> — <failure it closes>`
- Never commit with the test suite failing. If a fix breaks an existing
  test, the fix is wrong or the test encoded the bug — resolve, don't skip.

**Hard stops — pause and ask before proceeding if a fix requires:**
- A destructive or dedupe migration on data you cannot verify is safe to
  collapse
- Changing payment/billing business logic where intent is ambiguous
- Any behavior change visible in an external API contract

These are the *only* permission checkpoints. Everything else: proceed.

---

## PHASE 4 — VERIFY

1. Full test suite passes; record before/after counts vs. the Phase 0
   baseline.
2. App boots / server starts cleanly.
3. For each applied fix, a one-line proof: which test or manual check
   demonstrates the failure mode is closed.
4. List anything you changed that needs a config/env addition or a deploy
   step (new table, new env var, migration order).

---

## DELIVERABLES

1. `AUDIT.md` — recon summary + full ranked findings table
2. Applied fixes as clean commits (top 10)
3. `BACKLOG.md` — remaining findings, each independently actionable
4. Final summary: fixes applied, tests added, deploy notes, and the three
   highest-risk items still open
