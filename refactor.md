You are performing a FINISHING PASS on this codebase. The goal is to take this
project from "works" to "shippable finished product." That means two things in
this order: (1) ruthlessly delete everything that doesn't belong, and
(2) bring everything that remains up to release quality.

Deleting code is a win. Git history exists for a reason. But "finished" also
means the survivors are consistent, documented, secure, and verifiable.

Scope: the entire project tree. Walk it. Build a mental map of entry points,
public surface, and runtime conventions BEFORE deleting anything.

============================================================
PHASE 0 — BASELINE (do this before touching anything)
============================================================
- Identify the stack, entry points, build system, and how the app is run/deployed.
- Run the full test suite, linter, type checker, and build. Record exactly what
  passes and what fails. This is your contract: nothing that passed at baseline
  may fail at the end.
- If there are no tests for a critical path you intend to refactor or
  consolidate, write a minimal characterization test FIRST so you can prove
  behavior is unchanged.
- Note dynamic-reference hotspots: string-based imports, reflection, DI
  containers, framework conventions (Next.js routes, Django apps, plugin
  registries, decorators, CLI entry points in package metadata, templates
  referencing code by name). Treat anything in these zones as "live until
  proven dead."

============================================================
PHASE 1 — DEAD CODE
============================================================
Find and delete:
- Functions, classes, methods, and constants with zero references
- Unreachable branches (code after return, impossible conditions,
  commented-out blocks left as "reference")
- Unused imports across every file
- Unused parameters in function signatures (unless required by an interface,
  callback signature, or framework hook)
- Unused variables and assignments
- Private helpers that nothing calls
- Exported symbols nothing outside the module imports
- Entire files with no inbound references
- Dead CSS classes, unused assets (images/fonts/icons nothing references),
  unused translations/locale keys, unused environment variables, dead routes
  and endpoints, orphaned database migration helpers

If a symbol is only referenced by tests for itself (no production code uses
it), it is dead. Delete the symbol and the test.

Tools: grep/ripgrep, ts-prune, knip, vulture (Python), unimport, depcheck,
coverage reports. Never trust one tool — cross-check at least two, and
manually grep the basename for anything in a dynamic-reference hotspot.

============================================================
PHASE 2 — DEPRECATED & LEGACY
============================================================
Find and remove:
- Anything marked @deprecated, # DEPRECATED, // TODO remove, // legacy,
  // old version, // do not use
- Old API versions with a newer replacement already in use
- Compatibility shims for removed features
- Polyfills for runtimes/browsers the project no longer targets
- Feature flags permanently on or off (inline the resolved branch, delete the
  flag plumbing end to end: config, checks, dashboards references in code)
- Migration helpers from completed migrations
- Deprecated library calls (check changelogs, swap to the current API)

If something is deprecated but still in use: migrate the callers first, verify
tests pass, THEN delete the deprecated path. Never leave both paths alive.

============================================================
PHASE 3 — DUPLICATES & CONSOLIDATION
============================================================
Find and consolidate:
- Functions doing the same thing under different names (parseFoo / getFoo /
  loadFoo returning the same shape)
- Copy-pasted blocks across files (same 10+ lines repeated)
- Two utilities solving the same problem with slightly different signatures
  (pick one, migrate callers, delete the other)
- Duplicate type/interface definitions for the same domain object
- Duplicate constants (same magic string/number defined in multiple places —
  hoist to one source of truth)
- Re-implementations of stdlib or already-installed libraries (custom debounce
  when lodash is present, custom date math when date-fns is installed)
- Near-duplicate config blocks across environments (extract a base config)

Rule: one canonical implementation per concept. If you can't pick the
canonical copy, pick the one with the best tests and the clearest behavior on
edge cases, and delete the others. Document any subtle behavior difference you
intentionally collapsed.

============================================================
PHASE 4 — FILE & REPO HYGIENE
============================================================
Hunt the tree for cruft:
- .bak, .old, .copy, .orig, _backup, _v2, _new, _final, _final2 files
- Empty files and empty directories
- Generated/build outputs checked into git (dist, .next, coverage, __pycache__,
  .DS_Store, Thumbs.db) — delete from tracking AND add to .gitignore
- Editor/IDE files with personal paths (.vscode/settings.json, .idea/, *.swp)
- Log files, dumps, .env files, or credentials committed by accident —
  if you find a committed secret, FLAG IT LOUDLY (it must be rotated; deleting
  the file does not un-leak it)
- node_modules / venv accidentally tracked
- Scratch files (test.py, scratch.ts, untitled.md, foo.txt at repo root)
- Old screenshots, mockups, PDFs nothing references
- Duplicate or unused config files (two .eslintrc, tsconfig variants not used)
- Stub or outdated READMEs in subdirectories
- Dockerfiles, compose files, CI jobs, or deploy scripts for environments that
  no longer exist

For each file: grep the full path, the filename, and the basename across the
tree (including configs, CI, and docs) before deleting.

============================================================
PHASE 5 — DEPENDENCIES
============================================================
Clean package.json, requirements.txt, pyproject.toml, *.csproj, go.mod, etc.:
- Packages listed but never imported (depcheck, pip-autoremove, go mod tidy)
- Packages imported but not declared (declare them properly)
- Multiple packages solving one problem (axios + got + a fetch wrapper — pick
  one, migrate, remove the rest)
- Dev dependencies in prod section and vice versa
- Dead scripts in package.json / Makefile targets nothing runs
- Lockfile drift: regenerate the lockfile after removals
Do NOT bump versions in this pass — removal only. But FLAG any dependency with
a known critical vulnerability or that is officially abandoned, for the report.

============================================================
PHASE 6 — FINISHING QUALITY (what remains must be release-grade)
============================================================
Now polish the survivors. No rewrites for taste — only changes that move the
project toward "finished product":

CONSISTENCY
- One formatting standard, enforced: run the project's formatter/linter across
  the whole tree (prettier, black, gofmt, etc.). If none is configured, add a
  minimal config and apply it.
- Consistent naming for the same concept everywhere (don't leave userId,
  user_id, and uid for the same field across layers).
- Resolve every remaining TODO/FIXME/HACK: either do it now if small, or
  convert it to a tracked item in the report. Zero anonymous TODOs survive.

CORRECTNESS & ROBUSTNESS
- Fix all linter and type-checker errors. Tighten obviously-loose types
  (any, object, untyped dicts on public boundaries) where low-risk.
- Audit error handling on every external boundary: network calls, file I/O,
  DB queries, user input. No silently swallowed exceptions, no bare except,
  no .catch(() => {}). Errors must be handled, logged, or propagated —
  deliberately.
- Remove debug leftovers: console.log / print debugging, commented debug
  flags, hardcoded test credentials, localhost URLs in production paths.

SECURITY & CONFIG
- All secrets come from environment/config, never hardcoded. Provide a
  .env.example listing every required variable with a comment.
- Validate that user input paths sanitize/validate (injection, path traversal)
  — flag anything suspicious you don't fix.
- Sensible production defaults: debug mode off by default, CORS not wide open
  unless intentional, error pages don't leak stack traces.

DOCUMENTATION (the "finished product" test: a new dev can run it cold)
- Root README must accurately cover: what the project is, prerequisites,
  setup, how to run it, how to test it, how to deploy it, and configuration
  reference. Rewrite it if it's stale. Delete claims that are no longer true.
- Every public API / exported function on the package boundary gets a docstring
  or doc comment if it lacks one.
- If there's an HTTP API, ensure the route list/docs match reality.

============================================================
RULES OF ENGAGEMENT
============================================================
- After EACH batch of changes, re-run tests + linter + type check + build.
  If something breaks that passed at baseline, you broke something live:
  restore it and investigate before continuing. Never batch up breakage.
- Delete in confidence order: obvious cruft files first, then unused deps,
  then dead code, then deprecated paths, then consolidation. Consolidation is
  the riskiest — do it last and with the most test coverage.
- Public API surface (library exports, HTTP endpoints, CLI flags, webhook
  payloads, DB schemas) is a breaking-change zone. Do not remove anything
  there without explicit confirmation — flag it instead.
- For dynamic references, grep the basename and the string form, not just
  imports. When genuinely uncertain whether something is live: flag, don't
  delete.
- Group changes into focused commits with clear messages:
  "chore: remove dead code in parsers/", "chore: drop unused deps",
  "refactor: consolidate date utils", "docs: rewrite README setup section".
  Never one giant commit.

============================================================
DELIVERABLE
============================================================
1. SUMMARY REPORT (top of your final message):
   - Files deleted, lines removed, dependencies removed, functions consolidated
   - Quality fixes applied (lint errors fixed, error handling added, docs
     rewritten, secrets externalized)
   - Final verification: test/lint/type/build status vs. baseline
2. The actual changes, applied and committed in focused batches.
3. FLAGGED-NOT-DONE list — everything you found but did not change, each with
   a reason: suspected dynamic reference, public API surface, committed secret
   needing rotation, vulnerable/abandoned dependency, large refactor out of
   scope, unclear ownership. This list is the human review queue.
4. A one-paragraph "definition of done" verdict: is this project now a
   finished product? If not, the 3–5 items standing between it and that bar.

Verify first, delete second, polish third. Test as you go. Begin with Phase 0.
