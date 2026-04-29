You are doing an aggressive, no-mercy audit of this codebase for five 
specific reliability patterns. Assume the code is broken until proven 
otherwise. Do not be polite. Find real problems and fix them.

Scope: every API endpoint, background job, queue consumer, webhook 
handler, external API call, DB write path, and file I/O operation.

============================================================
1) IDEMPOTENCY
============================================================
Hunt for any operation that mutates state and could be retried 
(network retries, user double-clicks, queue redelivery, webhook replays).

Flag and fix:
- POST/PUT/PATCH/DELETE endpoints with no idempotency key support
- Webhook handlers that do not check for replay (no event id store)
- Background jobs that double-charge, double-send, or double-write 
  if re-run
- Any code that says "if not exists, create" using two separate 
  queries instead of an atomic upsert
- Payment, email, SMS, or notification sends with no dedupe guard

Fix pattern: accept Idempotency-Key header, store result keyed by 
that hash for N hours, return cached response on retry.

============================================================
2) DEDUPLICATION
============================================================
Find places where the same logical event gets processed more than once.

Flag and fix:
- Queue consumers with no message id tracking
- Webhook endpoints with no event id ledger
- Bulk import paths that do not check existing rows before insert
- File upload handlers that do not hash and compare
- Any "for each item, do X" loop where X is not safe to run twice

Fix pattern: persist a seen-set (Redis SET, DB unique index, or 
bloom filter for high volume) keyed by event id or content hash. 
Reject or short-circuit on hit.

============================================================
3) CACHING
============================================================
Find every expensive read with no cache, and every cache that lies.

Flag and fix:
- Hot reads hitting the DB or external API every request
- N+1 queries in loops
- LLM or embedding calls with no response cache (this project hits 
  Qwen3 via Ollama, check those paths hard)
- File parsing repeated on identical inputs (hash the bytes, cache 
  the parse)
- Caches with no TTL, no invalidation strategy, or no negative 
  caching for misses
- Stale cache risks on writes (write-through? write-behind? 
  cache-aside with proper invalidation?)

Fix pattern: add a cache layer (in-memory LRU, Redis, or disk) 
with explicit TTL, key naming convention, and invalidation on 
write. Document the strategy in comments.

============================================================
4) RATE LIMITING
============================================================
Find every entry point that can be hammered, and every outbound call 
that can be throttled by the other side.

Flag and fix:
- Public or auth endpoints with no per-user or per-IP limit
- Login, signup, password reset, OTP routes with no brute force guard
- Outbound API calls with no client-side throttle, no backoff, no 
  jitter
- File upload endpoints with no size or frequency cap
- LLM/inference endpoints with no concurrency limit (RunPod GPU 
  costs money, do not let one user nuke it)

Fix pattern: token bucket or sliding window per key (user id, IP, 
api key). Return 429 with Retry-After. Outbound: exponential backoff 
plus jitter, circuit breaker for repeated failures.

============================================================
5) ATOMIC OPERATIONS
============================================================
Find every multi-step write that can leave the system in a torn state.

Flag and fix:
- Read-modify-write sequences with no transaction or no row lock
- Multiple DB writes that should commit together but do not
- File writes without atomic rename (write to .tmp, fsync, rename)
- Counter increments using SELECT then UPDATE instead of UPDATE SET 
  x = x + 1
- Cross-service writes (DB plus S3, DB plus queue) with no outbox 
  pattern or saga
- Race conditions on uniqueness checks (check-then-insert without 
  unique constraint backing it)

Fix pattern: wrap in DB transaction with appropriate isolation level, 
use SELECT FOR UPDATE or optimistic locking with version columns, 
use atomic primitives (INCR, compare-and-swap), or implement outbox 
pattern for cross-system writes.

============================================================
DELIVERABLE
============================================================
For each issue found, output:
1. File path and line range
2. The specific failure mode (what breaks, under what conditions)
3. Severity (critical, high, medium, low)
4. The exact code change to fix it

Then actually apply the fixes. Do not just report. Do not ask 
permission for each one. Group related fixes into clean commits 
with clear messages.

Start with the highest severity issues. If you find more than 20 
problems, fix the top 10 first and list the rest.
