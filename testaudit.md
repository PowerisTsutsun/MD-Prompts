You are auditing this project end-to-end. Your job is to exercise every function, surface every issue, and then fix them. Do not skip anything. Do not assume code works because it "looks right."

## Phase 1 — Inventory (do this before testing anything)
1. Map the project structure. List every source file.
2. For each file, extract a complete list of:
   - Functions, methods, classes
   - API endpoints / routes
   - CLI commands
   - Event handlers, hooks, middleware
   - Exported utilities
3. Produce a checklist in a markdown table with columns:
   `File | Symbol | Type | Tested? | Status | Issue | Fix`
   Every row starts with Tested=No, Status=Pending. This table is your source of truth — update it as you go and show it after each phase.

## Phase 2 — Test each item
Work through the checklist top to bottom. For each item:
1. Read the implementation.
2. Identify its inputs, outputs, side effects, and dependencies.
3. Test it with:
   - Happy path (typical valid input)
   - Edge cases (empty, null/undefined, zero, negative, max size, unicode, whitespace)
   - Invalid input (wrong type, malformed, out of range)
   - Failure modes (network errors, missing files, permission denied, timeouts)
   - Boundary interactions with other functions it calls or is called by
4. Run the test. Capture actual vs expected behavior.
5. Mark Tested=Yes and fill in Status (Pass/Fail) and Issue (specific, reproducible).

Rules:
- If a function has no existing test, write one before moving on.
- If you can't test something in isolation, note why and test it via its caller.
- Do NOT batch-skim. One symbol at a time.

## Phase 3 — Issue report
After the checklist is fully filled, produce a prioritized issue list grouped by severity:
- **Critical** — crashes, data loss, security holes, broken core flows
- **High** — incorrect results, silent failures, missing error handling
- **Medium** — edge case bugs, poor validation, inconsistent behavior
- **Low** — style, naming, dead code, minor inefficiencies

For each issue include: location (file:line), reproduction, root cause, proposed fix.

## Phase 4 — Fix
Work the issue list top-down (Critical first). For each fix:
1. State the fix you're about to make and why.
2. Apply the change.
3. Re-run the test that caught it.
4. Re-run any related tests that might regress.
5. Update the checklist: Status=Fixed, note the commit/diff.

Stop and ask me before:
- Changing public APIs or function signatures
- Modifying database schemas or migrations
- Touching auth, payments, or anything security-sensitive
- Deleting code you think is unused

## Phase 5 — Final verification
- Run the full test suite.
- Re-run any manual checks.
- Report: total symbols, % tested, issues found, issues fixed, issues deferred (with reason).

Start with Phase 1. Show me the inventory table before you begin Phase 2.
