# REUSABLE PROMPT — Email → App PDF Ingestion (Microsoft Graph)

> Paste everything below the divider into a Claude Code session for any project
> that needs "email a PDF to a mailbox and the app pulls it in automatically."
> Fill in the CONFIG block first. Battle-tested: the gotchas at the bottom each
> cost a real day on a previous tenant.

---

## CONFIG (fill these in before pasting)

- **MAILBOX:** `<documents@company.com>` — the shared mailbox to watch
- **ALLOWED SENDERS:** `<comma-separated addresses/domains, or "any" (not recommended)>`
- **ACCEPTED FILES:** `<e.g. PDF only>` (magic bytes: `%PDF`)
- **ON INGEST:** `<what the app does with each file — e.g. "run AI extraction and add to the documents pool">`
- **HOSTING:** `<serverless (Vercel/similar) | long-running server>`
- **STORAGE:** `<where file bytes go — e.g. Supabase Storage private bucket / S3>`
- **DB:** `<where dedupe hashes + ingestion log live — e.g. existing Postgres via Drizzle>`

---

## TASK

Add email ingestion to this project: people email {ACCEPTED FILES} to {MAILBOX};
the app automatically pulls them, validates them, and performs {ON INGEST}.
Must handle a 1-page PDF, a 40-page PDF, and an email carrying several
attachments equally well.

**Transport: Microsoft Graph with app-only (client-credentials) auth. Never
IMAP** — app-only IMAP is being retired and fails with a misleading
"authenticated but not connected".

The mail-transport layer must be isolated (e.g. `lib/email/graph.ts`) from the
ingestion logic, and the ingestion logic must call the app's **single shared
ingest entry point** (the same function the manual-upload path uses). If no such
entry point exists yet, refactor one out first.

## PART A — Admin runbook (generate `docs/EMAIL-SETUP.md`)

Write a runbook a non-developer admin can follow. It needs a Global/Exchange
admin and contains exactly these steps:

1. **Create a shared mailbox** ({MAILBOX}) — M365 admin → Teams & groups →
   Shared mailboxes. Free, no license, no password. It must be a **real
   mailbox**, not a distribution group or unlicensed user, and **no other
   object may share the address**. Verify both:
   ```powershell
   Get-Mailbox <MAILBOX>        # must return a mailbox
   Get-Recipient -Anr <name>    # must return only ONE thing
   ```
2. **Register an Azure app** — Entra ID → App registrations → New. Single
   tenant, no redirect URI. Save the client ID and tenant ID.
3. **Create a client secret** — copy immediately (shown once), calendar the
   expiry. Rotation = update the host's env var **and redeploy/restart**.
4. **Grant the Graph permission** ⭐ — API permissions → Add → Microsoft Graph →
   **Application permissions** (never Delegated — delegated needs a signed-in
   user and can never work here) → **`Mail.ReadWrite`** → **Grant admin
   consent** (must show the green check).
   **`Mail.ReadWrite`, not `Mail.Read`** — the pipeline moves/patches messages,
   and read-only 403s on the final step of every poll.
5. **Scope the app to the one mailbox** — `Mail.ReadWrite` is tenant-wide by
   default. In Exchange Online PowerShell:
   ```powershell
   New-DistributionGroup -Name "App Ingestion Scope" -Type Security -Members <MAILBOX>
   New-ApplicationAccessPolicy -AppId <CLIENT_ID> `
     -PolicyScopeGroupId "App Ingestion Scope" -AccessRight RestrictAccess `
     -Description "App may only access the ingestion mailbox"
   # Verify against a REAL second mailbox:
   Test-ApplicationAccessPolicy -Identity <MAILBOX> -AppId <CLIENT_ID>   # Granted
   Test-ApplicationAccessPolicy -Identity you@company.com -AppId <CLIENT_ID> # Denied
   ```
6. Create three mailbox subfolders: **Processed**, **Failed**, **Rejected**.

## PART B — Pre-flight test (build this FIRST, before any app code)

Ship `scripts/graph-test.mjs`: client-credentials token → decode the JWT roles
claim and print it → read 3 inbox messages (`$top=3`,
`$select=subject,hasAttachments`). **Do not write any further code until it
prints SUCCESS** (an empty inbox is fine). Include this error table in its
output/docs:

| Output | Cause | Fix |
|---|---|---|
| `Roles: (none)` | Permission not admin-consented | Redo Part A step 4 |
| `404 MailboxNotEnabledForRESTAPI` | Not a real mailbox, or duplicate address | Part A step 1 |
| `403 … AccessPolicy` | Policy hasn't propagated | **Wait** (see gotchas) |
| `401 invalid_client` | Bad/expired secret | New secret |

## PART C — Trigger (choose by {HOSTING})

**Serverless (Vercel etc.):** there is no resident process. A **cron** hits
`/api/email/poll` (e.g. `*/2 * * * *`; minute-level needs Vercel Pro — on Hobby
add a manual "Check mailbox" button as the primary trigger). The route sets
`maxDuration` high (300s), and rejects any request lacking the `CRON_SECRET`
bearer header. Env changes require a redeploy.

**Long-running server:** an interval worker (default 60s), started behind an
`ENABLE_EMAIL_WATCHER=true` flag. Token is cached ~1h — restart after env
changes.

Either way the tick must be **overlap-safe and crash-safe**: idempotent
processing, so a tick that dies mid-batch or overlaps the next never
double-ingests (hash dedupe) or loses mail (state lives in mailbox folders).

**Later upgrade (document, don't build now):** Graph change notifications
(webhook + subscription renewed by a daily job) for near-instant ingestion.

## PART D — Per-tick pipeline

1. Get token; list inbox messages `$filter=hasAttachments eq true` with a
   minimal `$select`; **follow `@odata.nextLink`** until exhausted. Cap the
   number processed per tick — the remainder waits for the next tick.
2. **Sender allowlist** ({ALLOWED SENDERS} via env var). Not allowed → move
   message to `Rejected`, log it, never process it.
3. Per attachment: accept only `@odata.type === '#microsoft.graph.fileAttachment'`
   (otherwise inline signature images arrive as attachments), then verify
   **magic bytes** and enforce a size cap — filename/content-type is not trust.
   Attachments over ~3 MB have **no `contentBytes`** in the response — fetch
   `/messages/{id}/attachments/{id}/$value` or they ingest as empty files.
4. SHA-256 the bytes. **Dedupe on content hash only, never message id** — a
   multi-attachment email shares one message id; id-dedupe drops every
   attachment after the first. Duplicate → skip and log.
5. New file → upload bytes to {STORAGE} → call the shared ingest entry point
   ({ON INGEST}).
6. Record an ingestion-log row in {DB}: message id, sender, received time,
   filename, hash, outcome.
7. Only after **every** attachment in a message succeeds → move the message to
   `Processed`. Any failure → `Failed` + a **visible** failed-ingestion record
   in the app UI (never silent). **Folder moves are the state machine — never
   `isRead`**, which breaks the moment a human opens the mailbox in Outlook,
   and races when ticks overlap.
8. Any post-ingest chaining the app needs (pairing, notifications, queue jobs).

## PART E — Env vars (add to `.env.example`; secrets never committed)

```
EMAIL_OAUTH_TENANT_ID=
EMAIL_OAUTH_CLIENT_ID=
EMAIL_OAUTH_CLIENT_SECRET=
EMAIL_MAILBOX_ADDRESS=
EMAIL_ALLOWED_SENDERS=
CRON_SECRET=            # serverless
ENABLE_EMAIL_WATCHER=   # long-running server
EMAIL_POLL_SECONDS=60   # long-running server
```

## PART F — Visibility

The app must show ingestion state somewhere staff already look: recent
arrivals, rejected/failed items with a **human-readable reason** ("Sender not
approved", "File was not a valid PDF", "Could not read page 3"). No silent
failures, no toast storms.

## ACCEPTANCE TESTS (all must pass end-to-end)

1. Email a real multi-page PDF from an **allowed outside** account; don't open
   it in the mailbox → appears in the app within ~2× the poll interval,
   processed correctly; message lands in `Processed`.
2. Re-send the same file → skipped as duplicate, logged as such.
3. One email with **several** PDF attachments → every attachment ingests.
4. Email from a non-allowed address → message in `Rejected`, visible in the
   app, nothing ingested.
5. A non-PDF renamed to `.pdf` → rejected by magic-byte check, message in
   `Failed`, visible reason.

## THE FOUR THINGS THAT WILL COST YOU A DAY (put these in the runbook)

1. **Application permissions, not Delegated.** Delegated needs a signed-in user
   and can never work app-only.
2. **Exchange mailbox permission ≠ Graph permission.** Two separate layers —
   Exchange PowerShell succeeding proves nothing about Graph. A missing admin
   consent looks like a mailbox problem (404) and wastes the most time.
3. **Check for a duplicate mailbox address first.** An old unlicensed user
   sharing the address causes `"multiple recipients matching the identity"` and
   Graph resolves to the wrong object.
4. **A 403 right after an access-policy change is cache lag, not a bug.**
   Propagation takes 30 min–hours while `Test-ApplicationAccessPolicy` says
   *Granted* the whole time. Confirm by testing a mailbox that's been in the
   scope group since the policy was created — if that works, just wait.
   **Don't keep changing things; each change restarts the clock.**
