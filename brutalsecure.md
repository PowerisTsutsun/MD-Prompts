You are doing a full security audit of this codebase. Treat it as 
hostile territory. Assume an attacker has already cloned the repo, 
opened devtools on the deployed frontend, and is reading every 
network request. Your job is to find every way they can hurt this 
system and shut those doors.

CONTEXT: Keys are currently stored in plain frontend code. That is 
already a breach. Treat any key visible in client bundles, repo 
history, or browser-accessible config as compromised. Plan rotation, 
not just relocation.

============================================================
0) IMMEDIATE: EXPOSED SECRETS
============================================================
This is priority zero. Do this before anything else.

Hunt for:
- API keys, tokens, passwords, connection strings, private keys, 
  JWT secrets in any frontend file (.tsx, .ts, .js, .jsx, .vue, 
  .html, .css, public env files)
- NEXT_PUBLIC_*, VITE_*, REACT_APP_*, NUXT_PUBLIC_* variables 
  holding anything sensitive (these ship to the browser, they are 
  not secret)
- Hardcoded credentials in source (search: api[_-]?key, secret, 
  password, token, bearer, authorization, private[_-]?key, 
  client[_-]?secret, sk_, pk_live, AKIA, ghp_, xoxb-, 
  AIza, eyJ for JWTs)
- .env files committed to git (check current tree AND full git 
  history with: git log --all --full-history -- .env*)
- Secrets in commit messages, PR descriptions, or comments
- Secrets in config files, Docker files, CI/CD configs, deploy 
  scripts
- Secrets in test fixtures or seed data
- Secrets in client-side fetch URLs as query params

For each found secret:
1. List it (redacted: show first 4 chars and last 4 only)
2. Mark severity: CRITICAL if it grants production access, payments, 
   user data, or admin
3. Plan: rotate at the provider, move to server-side env, scrub 
   from git history (git-filter-repo or BFG), invalidate any 
   cached client bundles
4. Architectural fix: if the frontend needs to call a third-party 
   API, build a thin backend proxy. Frontend calls your server, 
   your server calls the API with the secret. Never embed.

Tools: trufflehog, gitleaks, detect-secrets, git-secrets. Run all 
of them.

============================================================
1) AUTHENTICATION
============================================================
Flag and fix:
- Endpoints with no auth check that should have one
- Auth checks done in the frontend only (delete those, only the 
  server matters)
- JWT validation that does not verify signature, expiry, issuer, 
  or audience
- JWT secret stored anywhere reachable by client
- Sessions with no expiry, no rotation on privilege change, no 
  invalidation on logout
- Password storage not using bcrypt, scrypt, argon2 (md5, sha1, 
  sha256, plain = catastrophic)
- Login endpoints with no rate limit and no lockout
- Password reset tokens that are guessable, long-lived, or reusable
- "Remember me" cookies with no expiry or stored insecurely
- OAuth flows missing state parameter (CSRF on login)
- OAuth callbacks accepting any redirect_uri

============================================================
2) AUTHORIZATION
============================================================
Flag and fix:
- IDOR: endpoints that take an id and do not check the caller owns 
  that resource (GET /api/orders/123 must verify 123 belongs to 
  the authed user)
- Role checks done client-side only (hide-the-button is not security)
- Admin endpoints with no role verification
- Mass assignment: req.body spread directly into DB writes 
  (attacker sends isAdmin: true)
- Tenant isolation failures in multi-tenant code (queries missing 
  WHERE tenant_id = ?)
- File access by path/id with no ownership check

============================================================
3) INPUT VALIDATION & INJECTION
============================================================
Flag and fix:
- SQL queries built with string concatenation or template literals 
  (parameterize everything, no exceptions)
- NoSQL injection (Mongo $where, JS strings as queries)
- Command injection: exec, spawn, shell=True with user input
- Path traversal: user-supplied paths joined to fs operations 
  without normalization and base-dir check
- SSRF: user-supplied URLs fetched server-side without allowlist 
  (block private IP ranges: 10.x, 172.16-31.x, 192.168.x, 127.x, 
  169.254.x, ::1, fc00::/7)
- XXE in XML parsers (disable external entities)
- Prototype pollution in object merges
- ReDoS: user input fed to complex regex with catastrophic 
  backtracking
- Server-side template injection
- LLM prompt injection: this project uses Qwen3 via Ollama. Any 
  user input that lands in a prompt needs guardrails. Treat model 
  output as untrusted, never execute or eval it, sanitize before 
  rendering.

Validate every input at the boundary. Use a schema library (zod, 
joi, pydantic, FluentValidation). Reject unknown fields. Cap 
string lengths, array sizes, number ranges, file sizes.

============================================================
4) XSS & FRONTEND SECURITY
============================================================
Flag and fix:
- dangerouslySetInnerHTML, v-html, innerHTML with non-sanitized 
  values
- User content rendered without escaping
- href or src attributes with user-supplied values (javascript: 
  URLs)
- Missing Content-Security-Policy header
- Missing X-Frame-Options or frame-ancestors directive (clickjacking)
- Missing X-Content-Type-Options: nosniff
- Missing Referrer-Policy
- Missing Strict-Transport-Security
- Cookies without HttpOnly, Secure, SameSite flags
- localStorage holding tokens (vulnerable to XSS exfiltration, 
  use HttpOnly cookies instead)
- CORS set to wildcard or reflecting origin without allowlist
- postMessage handlers not checking event.origin

============================================================
5) CSRF
============================================================
Flag and fix:
- State-changing endpoints (POST/PUT/DELETE) with no CSRF token 
  or SameSite cookie protection
- GET endpoints that mutate state (move them to POST first, then 
  protect)
- Cookie-based auth with no SameSite=Lax or Strict
- Forms without CSRF tokens in server-rendered apps

============================================================
6) FILE HANDLING
============================================================
This project parses xlsm, xlsx, pdf, docx. Every parser is an 
attack surface.

Flag and fix:
- Uploads with no size limit (DoS via huge files)
- Uploads with no MIME type and extension allowlist
- Uploads stored under user-controlled filenames (path traversal, 
  overwrites)
- Uploaded files served from the same origin as the app (host them 
  on a separate domain or with Content-Disposition: attachment)
- xlsm files: macros are executable code. Reject xlsm unless you 
  have a hard requirement, then sandbox the parser
- Office docs and PDFs parsed in-process with no resource limits 
  (memory bombs, zip bombs, infinite loop PDFs)
- No virus scanning on uploads (ClamAV at minimum for any user-
  uploaded file that another user can download)
- Image processing without bounds checks (decompression bombs)

============================================================
7) DEPENDENCIES
============================================================
- Run npm audit, pip-audit, dotnet list package --vulnerable, 
  trivy fs .
- List every CRITICAL and HIGH advisory affecting installed 
  versions
- Patch or replace. If no patch exists, evaluate dropping the 
  dependency
- Check for typosquatted packages (similar names to popular libs)
- Check for unmaintained packages (last release > 2 years, no 
  response to security issues)
- Lock file present and committed (package-lock.json, 
  poetry.lock, packages.lock.json)

============================================================
8) TRANSPORT & INFRASTRUCTURE
============================================================
- HTTPS enforced everywhere, HTTP redirects to HTTPS
- HSTS header with reasonable max-age and includeSubDomains
- TLS 1.2 minimum, prefer 1.3
- Internal service-to-service calls authenticated (mTLS or signed 
  requests, not just "we are on the same network")
- RunPod / Ollama endpoints not exposed publicly without auth
- Database not reachable from the public internet
- Admin panels behind VPN, IP allowlist, or at minimum strong auth 
  with MFA

============================================================
9) LOGGING & MONITORING
============================================================
Flag and fix:
- Secrets, tokens, passwords, full PII written to logs
- Stack traces returned to the client in production
- Verbose error messages leaking schema, file paths, library 
  versions
- No audit log for sensitive actions (login, password change, 
  permission change, data export, admin actions)
- No alerting on auth failures, 401/403 spikes, or 500 spikes

============================================================
10) DENIAL OF SERVICE
============================================================
- Endpoints with no rate limit (covered in offensive audit, 
  re-verify)
- Pagination with no max page size (attacker requests 1M rows)
- Recursion or graph traversal with no depth limit
- Regex with catastrophic backtracking on user input
- Unbounded queues, caches, or in-memory collections
- Expensive endpoints (LLM calls, PDF generation) with no per-user 
  concurrency cap

============================================================
RULES OF ENGAGEMENT
============================================================
- Start with section 0. Stop everything else until exposed secrets 
  are rotated and removed. A live key in the bundle is bleeding, 
  patch it first.
- After section 0, work top-down. Auth before authz before 
  injection before everything else.
- For each issue: file, line, attack scenario in one sentence, 
  severity (CRITICAL / HIGH / MEDIUM / LOW), fix.
- Apply the fixes. Do not just report.
- Anything you cannot fix safely (requires infra change, requires 
  human decision on UX tradeoff, requires coordinated rotation), 
  flag clearly with what the human needs to do.

============================================================
DELIVERABLE
============================================================
1. SECURITY-AUDIT.md at the repo root with findings, severity, and 
   status (fixed / needs-human / accepted-risk)
2. A separate ROTATION-CHECKLIST.md listing every secret that must 
   be rotated at its provider, with the provider name and the 
   rotation steps
3. The actual code fixes, in focused commits per category
4. Updated .gitignore covering .env*, secrets/, *.pem, *.key
5. A pre-commit hook configured (gitleaks or detect-secrets) so 
   this does not happen again

Start with section 0 right now.
