# Security Audit & Hardening — Agent Prompt

> Paste this into any coding agent with repo write access — OpenAI Codex CLI, Cursor,
> Windsurf, Aider, Copilot Agent, Gemini CLI, a GPT-5-class model via the API — at the
> root of the project you want audited. It is stack-agnostic: it detects what the
> project is built with and adapts. It fixes everything it safely can on its own, and
> stages the rest with exact human steps.
>
> **Set reasoning effort to high.** This audit holds a whole threat model across twelve
> sections; low-effort settings collapse it into a shallow grep pass.
>
> **No shell or file access** (e.g. ChatGPT web)? Then you cannot audit — you can only
> review what is pasted. Say so first, request files in the order the DETECTION PASS
> implies, mark every finding **UNVERIFIED**, and hand back the exact commands the user
> should run. Do not emit a report that reads as though the repo was swept.

You are doing a full security audit of this codebase and then hardening it. Treat the
repo as hostile territory. Assume an attacker has already cloned it, opened devtools on
the deployed frontend, and is reading every network request. Find every way they can
hurt this system and shut those doors.

---

## ENGAGEMENT RULES (read first, do not skip)

**Order of operations is mandatory:**

1. Run the **DETECTION PASS** below so you know what you're dealing with.
2. Do **SECTION 0 (exposed secrets)** completely. Then **STOP** at the gate and report
   before touching anything else. A live key in the bundle is bleeding — triage it first.
3. After the gate, work top-down: auth → authz → injection → everything else. Earlier
   sections gate later ones.

**Autofix policy — aggressive, with a hard safety boundary:**

You have permission to fix things directly and aggressively. Apply fixes as you go; do
not wait for approval on the safe categories. BUT the following actions are **STAGE-ONLY**
— never perform them autonomously, because they are irreversible, lock-out-causing, or
require coordination. For these, write the exact steps into the deliverables and stop:

- Rotating / regenerating a secret at the provider (you cannot un-rotate; live traffic breaks)
- Rewriting git history / force-pushing (`git-filter-repo`, BFG) — coordinate with collaborators first
- Deleting a client-side auth or payment check **before** a verified server-side equivalent exists
- Dropping or downgrading a dependency that other code imports, without confirming nothing breaks
- Any infrastructure change (DNS, firewall, bucket ACLs, DB network rules, CI secrets)
- Anything that changes externally observable behavior of a payment, login, or data-export path

Everything else — parameterizing queries, adding validation, setting headers, fixing cookie
flags, adding rate limits, adding `.gitignore` entries, installing a pre-commit hook,
replacing `innerHTML` with safe rendering, adding ownership checks — **just fix it.**

**Per-finding output format (use this exact schema for every finding):**

```
[ID] <short title>
  File:     path/to/file:line
  Severity: CRITICAL | HIGH | MEDIUM | LOW
  Attack:   <one sentence — how an attacker exploits this>
  Status:   FIXED | STAGED (needs-human) | ACCEPTED-RISK
  Fix:      <what you did, or what the human must do>
```

Severity rubric: **CRITICAL** = production access, payments, all-user data, admin, or RCE.
**HIGH** = single-account compromise, auth bypass, injection with real impact. **MEDIUM** =
needs chained conditions or limited blast radius. **LOW** = defense-in-depth / hygiene.

---

## DETECTION PASS (do this first, output a short summary)

Don't assume the stack. Figure it out, then tailor every later check to it.

- **Languages / frameworks:** inspect `package.json`, `requirements.txt`/`pyproject.toml`,
  `composer.json`, `go.mod`, `Gemfile`, `*.csproj`, etc. Note frontend framework (React/Next/
  Vue/Nuxt/Svelte/plain), backend framework, and whether it's SSR, SPA, or static.
- **Data layer:** SQL (which engine), NoSQL (Mongo/etc.), or a BaaS (Firebase/Supabase/
  Appwrite). Find the ORM/query builder or raw driver.
- **Auth model:** sessions, JWT, OAuth, BaaS auth, or none. Where are tokens stored?
- **Hosting / infra hints:** Vercel/Netlify/Cloudflare/Docker/serverless. Any `Dockerfile`,
  CI config (`.github/`, `.gitlab-ci.yml`), deploy scripts.
- **AI surface:** any LLM/model calls (hosted API or self-hosted like Ollama/vLLM). Note
  where user input enters a prompt and where model output is used.
- **File-parsing surface:** does it accept uploads (images, PDF, Office docs, archives, CSV)?
- **Available tooling:** check whether `trufflehog`, `gitleaks`, `npm`, `pip-audit`, `trivy`,
  etc. are installed; use what's there, note what's missing.

Output: a 5–10 line "Project Profile" so the rest of the audit is grounded in reality.

---

## 0) IMMEDIATE — EXPOSED SECRETS  *(priority zero; gate after this)*

> Covers: exposed DB credentials, public `.env`, hardcoded API keys, secrets in frontend JS,
> leaked commit history, build-log leaks, source maps re-exposing secrets.

Any secret reachable from a client bundle, the repo, or git history is **already
compromised** — plan rotation, not just relocation.

**Hunt for:**
- Keys/tokens/passwords/connection strings/private keys/JWT secrets in any
  client-shipped file (`.ts/.tsx/.js/.jsx/.vue/.svelte/.html`, public configs).
- Browser-exposed env vars holding secrets: `NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`,
  `NUXT_PUBLIC_*`, `EXPO_PUBLIC_*`. These ship to the browser — they are **not** secret.
- Hardcoded patterns: `api[_-]?key`, `secret`, `password`, `token`, `bearer`,
  `authorization`, `private[_-]?key`, `client[_-]?secret`, `sk_`, `pk_live`, `AKIA`,
  `ghp_`, `xox[baprs]-`, `AIza`, `eyJ` (JWTs), `-----BEGIN ... PRIVATE KEY-----`.
- `.env*` committed now **and** anywhere in history: `git log --all --full-history -- .env*`
  and `git log --all -p -S 'SECRET' -- .` (scan added strings).
- Secrets in commit messages, config files, Dockerfiles, CI/CD, deploy scripts, test
  fixtures, seed data, and fetch URLs (secrets as query params).
- **Source maps in production** (`.map` files served, or `productionBrowserSourceMaps`/
  `build.sourcemap` on) — they re-expose original source and any inlined secrets.

**For each secret found:**
1. List it redacted (first 4 + last 4 chars only).
2. Severity: CRITICAL if it grants production / payments / user data / admin.
3. **FIX (do now):** move usage server-side, replace client references with a thin
   backend proxy (frontend → your server → third-party API with the secret), and remove
   the literal from the working tree.
4. **STAGE (human):** rotation at the provider + git-history scrub + cache/bundle
   invalidation — write these into `ROTATION-CHECKLIST.md`. Do not perform autonomously.

Run whichever are available: `gitleaks detect`, `trufflehog filesystem .`,
`detect-secrets scan`. Install a pre-commit hook before finishing (see Deliverables).

> ### ⛔ GATE
> Stop here. Output the Project Profile + every Section 0 finding + the rotation list.
> Confirm all literals are out of the working tree and a proxy/server path exists for each
> formerly-embedded key. Only then continue to Section 1.

---

## 1) AUTHENTICATION

> Covers: weak/missing auth, admin routes unprotected, client-only checks, JWT issues,
> session management, password reset, default credentials.

- Endpoints missing an auth check that need one; **admin routes with no protection**.
- Auth enforced **only in the frontend** — the server is the only thing that counts.
  (Don't delete the client guard until the server guard is verified — see autofix boundary.)
- JWT validation that skips signature, expiry, issuer, or audience. Reject `alg: none`.
  JWT signing secret must live server-side only and be high-entropy (not reused across envs).
- Sessions: enforce expiry, rotate on privilege change, invalidate on logout.
- Password storage must use bcrypt / scrypt / argon2. md5/sha1/sha256/plaintext = catastrophic.
- Login/signup: rate limit + lockout/backoff (cross-ref Section 12).
- Password reset tokens: single-use, short-lived, high-entropy, invalidated after use.
- "Remember me" cookies: bounded expiry, stored securely (see Section 4 cookie flags).
- OAuth: `state` param present (login CSRF); callback validates `redirect_uri` against an allowlist.
- **Default credentials** (admin/admin, seeded demo users, framework defaults) removed or forced-rotate.

---

## 2) AUTHORIZATION

> Covers: missing authz, cross-user data access (IDOR), open DB permissions seen from the
> app layer, frontend-only payment checks, mass assignment, tenant isolation, AI action authz.

- **IDOR:** any endpoint taking an `id` must verify the caller owns/may access that
  resource. `GET /api/orders/123` must confirm 123 belongs to the authed user.
- Role checks must be server-side. Hiding a button is not security.
- **Mass assignment:** never spread `req.body` straight into a DB write — an attacker sends
  `isAdmin: true` / `role: "owner"`. Allowlist writable fields explicitly.
- **Tenant isolation (multi-user/multi-tenant):** every query scoped to the caller's
  tenant/user (`WHERE tenant_id = ?`). Verify this holds on reads, writes, and deletes.
- **Payment / subscription / quota checks** must be enforced server-side, never trusted
  from the frontend. Re-verify entitlement on the protected action itself.
- File/resource access by path or id must check ownership.
- **AI actions/tools:** if the model can call tools or read data, those calls run under the
  *user's* permissions and are authz-checked the same as any endpoint. The model is not a
  trust boundary — a tool that reads records must still enforce ownership/tenant scope.

---

## 3) INPUT VALIDATION & INJECTION

> Covers: missing validation, SQL/NoSQL injection, command injection, path traversal, SSRF,
> XXE, prototype pollution, ReDoS, SSTI, LLM prompt injection.

- **SQL:** parameterize everything. No string concatenation or template literals into
  queries — ever. (Fix directly.)
- **NoSQL:** block operator injection (Mongo `$where`, query objects from raw user input).
- **Command injection:** no `exec`/`spawn`/`shell=True` with user input; use arg arrays,
  validate against an allowlist.
- **Path traversal:** normalize then confirm the resolved path stays under an intended base
  dir before any fs operation.
- **SSRF:** user-supplied URLs fetched server-side must hit an allowlist and block private/
  link-local ranges (`10/8`, `172.16/12`, `192.168/16`, `127/8`, `169.254/16`, `::1`, `fc00::/7`)
  and metadata IPs (`169.254.169.254`).
- **XXE:** disable external entities / DTDs in any XML parser.
- **Prototype pollution:** guard object merges/`set`-by-path against `__proto__`/`constructor`.
- **ReDoS:** no user input into catastrophic-backtracking regex; bound or rewrite.
- **SSTI:** never render user input through a server-side template engine.
- **LLM prompt injection:** treat any user text entering a prompt as hostile. Keep
  instructions and untrusted data separated, constrain tool/output formats, and treat model
  output as untrusted — never `eval`/exec it, sanitize before rendering (cross-ref Section 4).

Validate every input at the boundary with a schema library (zod / joi / pydantic /
valibot / FluentValidation). Reject unknown fields. Cap string length, array size, number
range, and file size.

---

## 4) XSS, HEADERS & FRONTEND SECURITY

> Covers: XSS, security headers, CORS, cookie flags, localStorage tokens, source maps.

- No `dangerouslySetInnerHTML` / `v-html` / `innerHTML` with unsanitized values; render as
  text or sanitize with a maintained library (DOMPurify) when HTML is truly required.
- Escape user content; block `javascript:` and `data:` in user-supplied `href`/`src`.
- **Security headers** (set at the app or edge): `Content-Security-Policy` (lock down
  `script-src`; avoid `unsafe-inline`), `X-Content-Type-Options: nosniff`,
  `Referrer-Policy`, `Strict-Transport-Security` (cross-ref Section 8), and either
  `X-Frame-Options: DENY` or CSP `frame-ancestors 'none'` (clickjacking).
- **CORS:** explicit origin allowlist. Never `*` with credentials; never blindly reflect the
  `Origin` header.
- **Cookies:** `HttpOnly`, `Secure`, `SameSite=Lax` (or `Strict`) on session/auth cookies.
- **Tokens in `localStorage`/`sessionStorage`** are XSS-exfiltratable — prefer `HttpOnly`
  cookies for session tokens.
- `postMessage` handlers must validate `event.origin`.
- Disable production source maps (cross-ref Section 0).

---

## 5) CSRF

- State-changing endpoints (POST/PUT/PATCH/DELETE) need CSRF tokens **or** `SameSite`
  cookie protection (token pattern required if auth rides on cookies cross-site).
- No GET endpoint may mutate state — move to POST, then protect.
- Cookie-based auth: enforce `SameSite=Lax`/`Strict`.
- Server-rendered forms include CSRF tokens.

---

## 6) FILE HANDLING

> Every parser (image, PDF, Office doc, archive, CSV) is an attack surface.

- Enforce upload **size limits** (DoS via huge files) and a **MIME + extension allowlist**;
  verify content matches the claimed type (magic bytes), don't trust the extension.
- Never store under a user-controlled filename (path traversal / overwrite) — generate
  server-side names.
- Serve user-uploaded files from a separate origin **or** with
  `Content-Disposition: attachment` and `X-Content-Type-Options: nosniff`.
- **Macro-enabled Office files** (`.xlsm`, `.docm`) contain executable code — reject unless
  there's a hard requirement; if required, sandbox the parser.
- Bound parser resources (memory/time) against zip bombs, decompression bombs, and
  malicious PDFs/images.
- Virus-scan (e.g. ClamAV) any user-uploaded file another user can download.

---

## 7) DEPENDENCIES

- Run whatever applies: `npm audit`, `pip-audit`, `dotnet list package --vulnerable`,
  `composer audit`, `govulncheck`, plus `trivy fs .`.
- List every CRITICAL/HIGH advisory affecting installed versions. Patch/upgrade directly
  where non-breaking; **stage** major-version bumps that could break imports.
- Flag typosquatted packages (lookalike names) and unmaintained ones (no release > 2 yrs,
  unanswered security issues).
- Ensure a lock file exists and is committed (`package-lock.json` / `poetry.lock` /
  `packages.lock.json` / `go.sum`).

---

## 8) DATA STORAGE, BaaS & INFRASTRUCTURE

> Covers: misconfigured Firebase/Supabase/S3, excessive DB privileges, encryption at rest,
> backups, transport, exposed services. *(Many items here are STAGE-ONLY infra changes.)*

- **BaaS rules / RLS / bucket policies:** if using Firebase, Supabase, Appwrite, or S3-style
  storage, audit the security rules. Default-deny; no public read/write on buckets or tables;
  Row-Level Security enabled and policies actually scope rows to the owner/tenant. A
  permissive rule here is equivalent to an open database.
- **DB least privilege:** the app's DB user should have only the privileges it needs — not
  `SUPERUSER`/`ALL`/`root`. No DDL rights from the app role in production.
- **Encryption at rest** for sensitive data/fields; **encryption in transit** everywhere.
- **Backups:** a working backup *and* a tested restore path exists. (Untested backup = no backup.)
- HTTPS enforced; HTTP → HTTPS redirect; HSTS with sane `max-age` + `includeSubDomains`;
  TLS 1.2 minimum (prefer 1.3).
- Internal service-to-service calls authenticated (mTLS or signed requests) — "same network"
  is not auth.
- Self-hosted model/inference endpoints (Ollama/vLLM/etc.) not publicly reachable without auth.
- Database not reachable from the public internet.
- Admin panels behind VPN / IP allowlist / strong auth + MFA.

---

## 9) EXPOSED SURFACES

> Covers: debug pages in prod, public test/staging, internal dashboards.

- Debug/diagnostic endpoints and dev-only pages disabled in production.
- No publicly reachable test/staging environment without auth (and never sharing prod data/keys).
- Internal dashboards (admin, metrics, queue UIs, DB admin) not publicly exposed.

---

## 10) WEBHOOKS & THIRD-PARTY CALLBACKS

- Inbound webhook endpoints **verify the provider's signature** (HMAC/secret) before acting.
- Replay protection (timestamp window / nonce) where the provider supports it.
- Treat webhook payloads as untrusted input — validate like any other boundary (Section 3).

---

## 11) LOGGING & MONITORING

> Covers: secrets/PII in logs, verbose errors, audit logs, alerting.

- No secrets, tokens, passwords, or full PII written to logs (redact).
- No stack traces or verbose errors returned to clients in production (generic message +
  server-side log with correlation id). Don't leak schema, file paths, or library versions.
- Audit log for sensitive actions: login, password/permission change, data export, admin actions.
- Alerting on auth-failure spikes, 401/403 spikes, and 500 spikes.

---

## 12) DENIAL OF SERVICE

- Rate limits on login, signup, password reset, public APIs, and AI/expensive endpoints.
- Pagination with an enforced max page size (no "give me 1M rows").
- Depth limits on recursion / graph / nested-query traversal.
- No catastrophic-backtracking regex on user input (cross-ref Section 3).
- Bound queues, caches, and in-memory collections.
- Per-user concurrency cap on expensive operations (LLM calls, PDF generation, report builds).

---

## META — OVER-TRUSTING GENERATED CODE

This audit includes code that was AI-generated or scaffolded. Do not assume generated code
is safe because it "looks done." Re-read it against the sections above with the same
hostility as hand-written code — especially auth, authz, and query construction.

---

## DELIVERABLES

1. **`SECURITY-AUDIT.md`** at repo root: Project Profile, then every finding in the
   per-finding schema, grouped by section, each marked FIXED / STAGED / ACCEPTED-RISK.
2. **`ROTATION-CHECKLIST.md`**: every secret to rotate, with provider name and exact
   rotation steps. (Rotation itself is human-performed.)
3. **The actual code fixes**, in focused commits per category (e.g.
   `security: parameterize all DB queries`, `security: set auth cookie flags`).
4. **Updated `.gitignore`** covering `.env*`, `secrets/`, `*.pem`, `*.key`, `*.p12`.
5. **A committed pre-commit hook** (gitleaks or detect-secrets) so secrets can't be
   committed again. Include the config file and a one-line setup note in `SECURITY-AUDIT.md`.

**Begin with the Detection Pass, then Section 0. Stop at the gate.**
