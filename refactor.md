You are doing a ruthless cleanup pass on this codebase. The goal is 
to delete code, not add it. Every line you remove is a win. Do not 
preserve things "just in case." Git history exists for a reason.

Scope: the entire project tree. Walk it.

============================================================
1) DEAD CODE
============================================================
Find and delete:
- Functions, classes, methods, and constants with zero references
- Unreachable branches (code after return, impossible conditions, 
  commented-out blocks left as "reference")
- Unused imports across every file
- Unused parameters in function signatures
- Unused variables and assignments
- Private helpers that nothing calls
- Exported symbols that nothing outside the module imports
- Entire files with no inbound references

Be aggressive. If a symbol is only referenced by tests for itself 
(no production code uses it), it is dead. Delete the symbol and 
the test.

Tools to use: grep, ripgrep, ts-prune, knip, vulture (Python), 
unimport, depcheck. Do not trust one tool, cross-check.

============================================================
2) DEPRECATED CODE
============================================================
Find and remove:
- Anything marked @deprecated, # DEPRECATED, // TODO remove, 
  // legacy, // old version, // do not use
- Old API versions that have a v2 or newer replacement already in use
- Compatibility shims for removed features
- Polyfills for browsers or runtimes the project no longer targets
- Feature flags that are permanently on or permanently off (inline 
  the resolved branch, delete the flag plumbing)
- Migration helpers from completed migrations
- Deprecated library calls (check the lib changelogs, swap to the 
  current API)

If something is deprecated and still in use, migrate the callers 
first, then delete the deprecated path.

============================================================
3) DUPLICATE CODE
============================================================
Find and consolidate:
- Functions that do the same thing under different names 
  (parseFoo, getFoo, loadFoo all returning the same shape)
- Copy-pasted blocks across files (same 10+ lines repeated)
- Two utilities solving the same problem with slightly different 
  signatures (pick one, migrate the other's callers, delete it)
- Duplicate type or interface definitions for the same domain object
- Duplicate constants (same magic string or number defined in 
  multiple places)
- Re-implementations of stdlib or already-installed library 
  functionality (custom debounce when lodash is already a 
  dependency, custom date math when date-fns is installed)

Rule: one canonical implementation per concept. If you cannot pick 
which copy is canonical, pick the one with the best tests and 
delete the others.

============================================================
4) EXTRA FILES
============================================================
Hunt the tree for cruft:
- .bak, .old, .copy, .orig, _backup, _v2, _new, _final, _final2 files
- Empty files and empty directories
- Generated files checked into git that should be in .gitignore 
  (build outputs, .next, dist, coverage, .DS_Store, Thumbs.db)
- Editor and IDE files (.vscode/settings.json with personal paths, 
  .idea/, *.swp)
- Log files committed by accident
- node_modules or venv accidentally tracked
- Sample or scratch files (test.py, scratch.ts, untitled.md, 
  foo.txt at repo root)
- Old screenshots, old design mockups, old PDFs no doc references
- Duplicate config files (two .eslintrc, two tsconfig variants 
  not actually used)
- README files in subdirectories that are stubs or outdated
- Dockerfiles, compose files, or deploy scripts for environments 
  that no longer exist

For each file: confirm nothing references it (grep the path, the 
filename, and the basename), then delete.

============================================================
5) DEPENDENCIES
============================================================
Clean package.json, requirements.txt, pyproject.toml, *.csproj, etc:
- Packages listed but not imported anywhere (depcheck, pip-autoremove)
- Packages imported but not listed (move them in properly)
- Duplicate packages solving the same problem (axios and fetch 
  wrapper and got all present, pick one)
- Dev dependencies in prod section and vice versa
- Pinned-to-old versions with no reason

Do not bump versions in this pass. Just remove unused entries.

============================================================
RULES OF ENGAGEMENT
============================================================
- Run the test suite before you start. Note what passes.
- After each batch of deletions, run the test suite again. If 
  something breaks that was passing, you deleted something live. 
  Restore and investigate.
- For dynamic references (string-based imports, reflection, 
  framework conventions like Next.js pages, decorators, DI 
  containers), be extra careful. Grep for the basename, not just 
  the import.
- Do not delete public API surface without checking external 
  consumers. If this project exposes a library or an HTTP API, 
  removed symbols are a breaking change.
- Group changes into focused commits: "remove dead code in 
  parsers/", "delete legacy auth flow", "drop unused deps", etc. 
  Not one giant commit.

============================================================
DELIVERABLE
============================================================
1. A short report at the top: files deleted, lines removed, 
   dependencies removed, functions consolidated.
2. The actual changes applied.
3. A list of anything you flagged but did NOT delete, with the 
   reason (dynamic reference suspected, public API, unclear 
   ownership, etc.) so a human can review.

Start now. Delete first, justify second. Test as you go.
