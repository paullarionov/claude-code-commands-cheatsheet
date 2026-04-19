# 15 Under-Utilized Features in Claude Code

Based on Boris Cherny (@bcherny), creator of Claude Code  
March 30, 2026  
Translation: Telegram channel @prompt_design

---

## Context

Boris Cherny — creator of Claude Code — shared a collection of under-utilized features of the tool. Below is a translation and retelling of his tips.

Source: X thread from March 30, 2026

---

## 1. Claude Code Mobile App

Claude Code has a full mobile app — you can code straight from your phone.

- Download the Claude app for iOS or Android
- Go to the **Code** tab in the side menu
- You can review changes, approve PRs, and write code on the go

---

## 2. Moving Sessions Between Devices

The `claude --teleport` command (or `/teleport`) lets you continue a cloud session on your local machine. And `/remote-control` gives you control over a local session from your phone or browser.

- **Teleport** — pulls a cloud session into your local terminal
- **Remote Control** — controls a local session from any device
- Tip: enable "Enable Remote Control for all sessions" in `/config` so you don't have to configure it every time

---

## 3. /loop and /schedule — Scheduled Automation

These commands run Claude automatically at a set interval — up to a week of continuous work. Examples:

- `/loop 5m /babysit` — every 5 minutes checks code reviews, rebases, and shepherds PRs to production
- `/loop 30m /slack-feedback` — every 30 minutes creates PRs from Slack feedback
- `/loop /post-merge-sweeper` — creates PRs for missed code review comments
- `/loop 1h /pr-pruner` — closes outdated and unneeded PRs

The idea is simple: turn a recurring action into a skill, then put it on a loop.

---

## 4. Hooks: Automatic Actions on Events

Hooks are scripts that run automatically when Claude does a specific action. They work as triggers: "when X happens, do Y." Unlike instructions in CLAUDE.md, hooks fire **every time**, no exceptions.

Examples:

- **On session start** (`SessionStart`) — load context from files or APIs
- **Before a command runs** (`PreToolUse`) — log every bash command Claude is about to run
- **On permission request** (`PermissionRequest`) — send a WhatsApp notification so you can approve or reject the action from your phone
- **On stop** (`Stop`) — force Claude to keep going if the task isn't finished

---

## 5. Cowork Dispatch — Remote Control of Desktop Claude

Dispatch lets you triage Slack, email, manage files, and get things done on your laptop even when you're not in front of it.

- Dispatch is **secure remote control** of the desktop Claude app
- It can use your MCP servers, browser, and computer — with your permission
- In effect, a way to delegate non-code tasks to Claude from anywhere

---

## 6. Chrome Extension for Frontend Work

The key tip: **let Claude see the result.** When it can check what the page looks like, it keeps refining the code until the result is good.

- Analogy: you ask a person to build a website, but forbid them from opening a browser — the result won't be great
- Give Claude a browser, and it will iterate until it hits the target quality
- The Chrome extension works more reliably than equivalent MCP servers for this job

---

## 7. Desktop App: Auto-Starting and Testing Web Servers

The Claude desktop app can **automatically spin up a web server and test it in the built-in browser.**

- You can build a similar setup in the CLI or VS Code via the Chrome extension
- But the desktop app gives you this out of the box, no extra configuration

---

## 8. Session Branching

Sometimes mid-conversation you want to "branch off" — try a different approach without losing the main session. Two ways:

1. Run `/branch` right in the session
2. From the terminal: `claude --resume <session-id> --fork-session`

`/branch` creates a fork — you switch into it. To return to the original: `claude -r <original-session-id>`.

---

## 9. /btw — Side Questions Without Interrupting Work

Claude is busy on a task, and you need a quick side question? `/btw` lets you ask without interrupting the agent's current work.

Example:

```
/btw how do you spell "dachshund"?
> Dachshund — from German: Dachs (badger) + Hund (dog).
```

The agent keeps working as if nothing happened.

---

## 10. Git Worktrees — Parallel Work in One Repo

Claude Code has deep built-in support for git worktrees. This lets you run **dozens of parallel Claude sessions** in one repository, each in an isolated copy.

- `claude -w` — start a new session in a separate worktree
- Or tick the **worktree** checkbox in the desktop app
- For non-git VCS, use the `WorktreeCreate` hook with your own logic

---

## 11. /batch — Mass Changes via Parallel Agents

`/batch` first clarifies the task, then distributes the work across **agents in separate worktrees** — tens, hundreds, even thousands in parallel.

- Great for large-scale code migrations and other parallelizable work
- Each agent works independently in its own copy of the repo

---

## 12. –bare — Up to 10× Faster SDK Startup

By default, `claude -p` (and the TypeScript/Python SDKs) scan for local CLAUDE.md, settings, and MCP servers at startup. For automation and scripts, that's wasted work — you typically specify what to load via `--system-prompt`, `--mcp-config`, `--settings`.

- The `--bare` flag skips autodiscovery and **speeds up startup by up to 10×**
- Future versions will make this the default

```bash
claude -p "summarize this codebase" \
    --output-format=stream-json \
    --verbose \
    --bare
```

---

## 13. –add-dir — Working Across Multiple Repos

If you need to work in two repositories at once, start Claude in one, then attach the second via `--add-dir` (or `/add-dir`).

- This doesn't just show Claude another repo — it **grants permission to work** in it
- For a persistent setup, add `"additionalDirectories"` to the project's `settings.json`

---

## 14. –agent — Custom Agent with Limited Permissions

You can create a specialized agent with its own system prompt and toolset. Define it in `.claude/agents/` and run:

```bash
claude --agent=<agent-name>
```

- The agent can have limited tools (e.g. read-only), its own model, and description
- Handy for read-only reviewers, security auditors, domain-specific helpers

---

## 15. /voice — Voice Input

You can code by voice instead of typing.

- In the CLI: run `/voice`, then hold space to record
- In the desktop app: press the voice input button
- Or enable system dictation in iOS settings

---

## Sources

- Boris Cherny (@bcherny) on X — March 30, 2026
