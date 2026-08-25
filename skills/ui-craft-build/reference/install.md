# Install reference — ui-craft-build companions

Only read this when the preflight found something missing and the user agreed
to install it. Nothing here is required: the skill degrades gracefully without
every one of these.

Preconditions: `node --version` 18 or newer, `git --version` present.

---

## 1. frontend-design (Anthropic official — base craft layer)

**macOS / Linux**

```bash
mkdir -p /tmp/skills-install ~/.claude/skills
git clone --depth 1 https://github.com/anthropics/skills /tmp/skills-install/anthropics-skills
cp -r /tmp/skills-install/anthropics-skills/skills/frontend-design ~/.claude/skills/frontend-design
rm -rf /tmp/skills-install
```

**Windows (PowerShell)**

```powershell
$tmp = Join-Path $env:TEMP 'skills-install'
New-Item -ItemType Directory -Force $tmp, "$HOME\.claude\skills" | Out-Null
git clone --depth 1 https://github.com/anthropics/skills "$tmp\anthropics-skills"
Copy-Item -Recurse -Force "$tmp\anthropics-skills\skills\frontend-design" "$HOME\.claude\skills\frontend-design"
Remove-Item -Recurse -Force $tmp
```

## 2. impeccable (audit pass only)

```bash
git clone --depth 1 https://github.com/pbakaus/impeccable /tmp/impeccable
cp -r /tmp/impeccable/.claude/skills/impeccable ~/.claude/skills/impeccable
rm -rf /tmp/impeccable
```

PowerShell: same shape as above — clone to `$env:TEMP`, `Copy-Item -Recurse`
the `.claude\skills\impeccable` folder into `$HOME\.claude\skills`.

## 3. Playwright MCP

```bash
claude mcp add playwright npx @playwright/mcp@latest
```

If the `claude` CLI is not on PATH, add the server to `~/.claude.json` by hand:

```json
"mcpServers": {
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

Validate the file still parses before restarting:

```bash
node -e "JSON.parse(require('fs').readFileSync(require('os').homedir()+'/.claude.json','utf8'))" && echo OK
```

## 4. Animation library (per project)

```bash
npm install motion   # Motion, the Framer Motion successor — React default
npm install gsap     # GSAP + ScrollTrigger — vanilla or scroll-choreography-heavy
```

Pick one per project. Both in the same codebase means two motion vocabularies
fighting over the same elements.

---

## After installing

1. Restart Claude Code fully — skills load at startup.
2. `ls ~/.claude/skills/` should list what you installed.
3. Confirm `mcp__playwright__*` tools appear in the session.

## Deliberately not installed

`design-taste-frontend` and `ui-ux-pro-max` overlap `frontend-design` on type,
spacing and motion. Loaded together they average each other into the generic
output this skill exists to prevent. Experiment with them in a separate
session, never alongside the base stack.

## Troubleshooting

- **Skill not loading:** every skill directory needs a `SKILL.md` at its root
  with `name` and `description` frontmatter. Check for a nested extra folder
  from the copy step.
- **Playwright MCP absent after restart:** validate `~/.claude.json` parses
  (command above), then check the MCP logs.
- **npx prompts to install on first run:** run the clone or MCP add once
  interactively so the package cache is warm.
