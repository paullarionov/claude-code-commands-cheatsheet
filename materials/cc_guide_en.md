# Everything I Learned in 2 Months With Claude Code

Everything I Learned Using Claude Code for 2 Months

A practical guide by @axel_bitblaze69  
Source: X / Twitter  
Translation: Telegram channel @prompt_design  
March 30, 2026

---

## What Claude Code Actually Is

March 2026. If you're still pasting code into ChatGPT, we need to have a serious talk.

I've been heads-down with Claude Code for the last two months. Not casually — every day. Took the courses, got certified, built projects, broke them, fixed them, built again. Over that time I've spent more hours in a terminal with Claude than in conversation with humans.

This isn't another "top 10 AI tools" list. It's everything I learned in practice — features nobody writes about, workflows that actually work, mistakes that cost me hours, and tricks that saved me days.

Save this. You'll want it later.

### The big misconception

Let me start here: Claude Code is not Copilot. Not a chatbot you paste code into. Not autocomplete on steroids.

It's an **agent**. An autonomous agent that:

- reads your entire codebase
- plans an approach
- edits files across the project
- runs tests
- sees errors and fixes them
- iterates until the task is done

The key word is **agentic**. It works in a loop: gather context, act, check the result, repeat. You tell it what you want — it figures out how to get there. You're not writing code together. You're delegating to someone who actually understands what they read.

Claude Code lives in the terminal. That's not a limitation — it's the point. The terminal is the most powerful interface on your machine. Claude Code meets you there.

### Where it runs

Claude Code isn't just a CLI anymore. It's everywhere:

- **Terminal**: the original. Full power. Fastest. This is where the magic happens.
- **VS Code extension**: inline diffs, @-mentions, a side panel for conversations. For people who live in an editor.
- **JetBrains plugin**: same thing for IntelliJ users.
- **Desktop app (Claude Cowork)**: visual diff view, multiple sessions, scheduled tasks. No terminal needed. For those who don't want the command line.
- **Web app (claude.ai/code)**: no local install. Kick off long tasks from anywhere. Open a browser and go.
- **Mobile access via remote control**: start a session on your laptop, drive it from your phone.
- **Slack**: mention @Claude in your workspace, turn issues into PRs straight from chat.
- **GitHub Actions**: comment `@claude` on a PR — it replies with real code changes.
- **GitLab CI/CD**: same idea for GitLab teams.

Remote control is the most underrated feature nobody talks about. You're at lunch, a Slack message about a bug lands, you pull out your phone, tell Claude to fix it. It runs on your machine at home. You review the diff on your phone. Approve. Done.

---

## Getting Started

### Install

macOS/Linux:
```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Windows:
```powershell
irm https://claude.ai/install.ps1 | iex
```

Homebrew:
```bash
brew install --cask claude-code
```

### First launch

```bash
cd your-project
claude
```

Log in to your Anthropic account and start working. No configs. No setup wizards. No 47 extensions. No YAML hell. Just `cd` into a project and `claude`.

### First thing to try

```bash
claude "what does this project do?"
```

Watch Claude explore the codebase, read files, figure out the architecture, and produce a summary. The moment it correctly describes a 20,000+ line repo is the moment you realize: this isn't autocomplete.

---

## Models

Claude Code runs on the Anthropic model family. Knowing which one to use when is half the battle:

- **Claude Opus 4.6**: the heavy artillery. Best reasoning. For complex architectural decisions, tricky debugging, 10+ file refactors. When you need to actually think.
- **Claude Sonnet 4.6**: the workhorse. Default model. Best balance of speed, cost, and quality for daily coding. Your main tool.
- **Claude Haiku**: the sprinter. Cheap and fast. Good for simple tasks and subagents. Don't underestimate it for quick questions.

Switch models at any time:

```bash
/model opus
```

— switch mid-session when you hit a hard problem.

```bash
claude --model opus
```

— run the whole session on opus.

Here's what I learned the hard way: **match effort to task**. Don't burn opus tokens on a variable rename. Don't use haiku for reworking auth. In the first week I spent about $200 using opus for everything because it "felt smarter." Sonnet handles 90% of tasks just as well.

### Reasoning depth

Reasoning depth can be tuned independently of the model:

- `/effort low` — fast answers, minimum reasoning. For "what's the syntax for X?"
- `/effort high` — deeper analysis, extended thinking. For debugging.
- `/effort max` — full power. Burns more tokens but catches edge cases a human would miss. For anything going to production.

---

## Pricing

### Plans

| Plan | Price | What you get |
|------|-------|--------------|
| Pro | $20/mo | Claude Code access, Sonnet + Opus, good starting point |
| Max 5x | $100/mo | 5× limits, 1M context window, priority access |
| Max 20x | $200/mo | 20× limits, request caps effectively gone |
| Team | $100/seat/mo (premium) | Centralized billing, shared settings, analytics |
| API | Per token | Sonnet: $3/$15 per MTok in/out. Opus: $15/$75 |

Real numbers from Anthropic: the average developer spends about **$6/day**. 90% of users stay under $12/day.

The stat that convinced me: one developer tracked 10 billion tokens over 8 months. At API rates that would be about $15,000. On the Max plan, $800. If you use Claude Code daily (and you should), Max pays for itself by week two.

When Max limits are exhausted, you can enable "extra usage" billed at API rates. No hard cutoff. No "come back tomorrow."

### Savings tips I wish I'd known on day one

- Use Sonnet for 90% of tasks, Opus for the hard ones
- Use subagents to isolate expensive operations (more below)
- `/compact` to compress and save context tokens when the conversation has gotten long
- `/clear` between unrelated tasks — don't drag CSS-bug context into an API redesign
- Keep CLAUDE.md lean — bloated instructions burn tokens on every message

---

## The .claude Folder — Project Control Center

This is where most people miss 80% of the value. The `.claude` folder isn't a black box. It's the control panel for Claude's behavior in your project.

A crucial detail few know: **there are two .claude directories, not one.**

The first lives inside the project (committed to git, shared with the team). The second lives in `~/.claude/` (personal settings, local machine state, session history).

### CLAUDE.md — the most important file

When Claude Code starts a session, the first thing it reads is CLAUDE.md. It loads straight into the system prompt. Whatever's there, Claude does. Every session. Consistently.

If you say "always write tests before implementation," it will. If you say "never use console.log, use the custom logger," it follows every time.

**What to put in it:**
- Build, test, and lint commands (`npm run test`, `make build`)
- Key architectural decisions ("we use a monorepo with turborepo")
- Non-obvious gotchas ("TypeScript strict mode is on — unused variables are errors")
- Conventions for imports, naming, error handling
- File and folder structure of the main modules

**What NOT to put:**
- Things that belong in a linter or formatter config (Prettier's job, not CLAUDE.md's)
- Full documentation you could link to
- Long theoretical paragraphs

**Keep it under 200 lines**

Longer files start eating too much context, and instruction-following degrades. I saw this in practice: my 400-line CLAUDE.md was half-ignored. I cut it to 150 and everything improved.

**Example of a good CLAUDE.md:**

```
Project: Acme API

Commands
npm run dev          # Start dev server
npm run test         # Run tests (Jest)
npm run lint         # ESLint + Prettier check
npm run build        # Production build

Architecture
- Express REST API, Node 20
- PostgreSQL via Prisma ORM
- All handlers live in src/handlers/
- Shared types in src/types/

Conventions
- Use zod for request body validation
- Return shape is always { data, error }
- Never expose stack traces to the client
- Use the logger module, not console.log

Watch out for
- Tests use a real local DB, not mocks. Run `npm run db:test:reset` first
- Strict TypeScript: no unused imports, ever
```

20 lines. Claude gets everything it needs to be productive without constant clarification.

### CLAUDE.local.md — personal settings

Sometimes you have preferences that apply to you, not the team. Maybe you prefer a different test runner. Maybe you want Claude to open files a certain way.

Create `CLAUDE.local.md` at the project root. Claude reads it alongside the main CLAUDE.md, and it's automatically in `.gitignore` — your personal settings never hit the repo.

### The rules/ folder — modular instructions that scale

CLAUDE.md works great for a single project. But as the team grows, you end up with a 300-line CLAUDE.md that nobody maintains and everyone ignores.

The `rules/` folder solves this.

Every markdown file inside `.claude/rules/` loads alongside CLAUDE.md automatically:

```
.claude/rules/
-- code-style.md
-- testing.md
-- api-conventions.md
-- security.md
```

Each file stays focused. The person responsible for API conventions edits `api-conventions.md`. The person responsible for testing standards edits `testing.md`. Nobody steps on each other's edits.

The real power is **path-scoped rules**. Add a YAML header and the rule activates only when Claude works with matching files:

```yaml
---
paths:
  - "src/api/**/*.ts"
  - "src/handlers/**/*.ts"
---
API Design Rules
All handlers return { data, error } shape
Use zod for request body validation
Never expose internal error details to clients
```

Claude won't load this rule when it edits a React component. It fires only when working inside `src/api/` or `src/handlers/`. Clean, focused, efficient.

---

## Features That Changed How I Work

### Multi-file editing

This is where Claude Code leaves everything else behind. This is the feature that made me drop other tools for serious work.

```bash
claude "refactor the authentication system to use JWT tokens instead of sessions"
```

It will:
- find every file related to auth
- update middleware
- change routes
- rewrite tests
- update config
- fix imports

Across 15+ files in a single session. Shows diffs for review before applying. You approve, reject, or request changes per file.

I refactored an entire Express app from callbacks to async/await in one session. 23 files. Every one correct. Try doing that with Tab autocomplete.

### Git integration

Claude Code is git-native and writes commit messages better than most humans:

```bash
claude "commit my changes with a descriptive message"
claude "create a PR for this feature"
claude "help me resolve these merge conflicts"
claude "show me what changed in the last 5 commits and explain the impact"
```

It writes real commit messages — not "fixed stuff" but descriptions of what changed and why. Creates PRs with a summary and a test plan. Resolves merge conflicts by actually understanding both sides of the code, not picking one at random.

### The agentic loop: write, test, fix, repeat

Claude doesn't just write code — it runs it:

write a function → run tests → see an error → read the log → fix the bug → run tests again → all green

This loop is the whole point. It's not "here's the code, good luck." It's "I wrote it, tested it, caught an edge case you didn't think about, and everything passes." I've watched it catch bugs in its own code that I wouldn't have noticed for hours.

### Subagents — the underrated feature

It took me 3 weeks to start using these properly, and I regret every day of that.

Claude can spawn specialized subagents to handle tasks in isolation:

- **Explore agent**: read-only, fast, uses Haiku. Ideal for "figure out how this module works."
- **Plan agent**: analyzes before implementing. Forces "think before you code."
- **General agent**: complex multi-step tasks in a clean context.

Why it matters: when you ask Claude to run a full test suite, hundreds of lines of pass/fail output flood the context window. The main conversation gets polluted with noise. Subagents run in isolation. They do the dirty work, compress the results, and return a clean summary.

### Custom agents

You can build your own agents for specific workflows:

`.claude/agents/security-reviewer.md`

```yaml
---
name: security-reviewer
description: Expert code reviewer for security vulnerabilities.
  Use PROACTIVELY when reviewing PRs or before deployments.
model: sonnet
tools: Read, Grep, Glob
---
You are a senior security engineer. When reviewing code:
- Flag bugs, not just style issues
- Check for SQL injection and XSS risks
- Look for exposed credentials or secrets
- Check authentication and authorization gaps
- Note performance concerns only when they matter at scale
```

Now Claude automatically delegates security reviews to your custom agent. Or call it directly: `/security-reviewer`.

The `tools` field is intentionally restricted — a security auditor only needs Read, Grep, and Glob. It has no reason to write files. The `model` field lets you use Haiku for cheap read-heavy tasks, and Opus for tasks that need deep analysis.

Personal agents live in `~/.claude/agents/` and are available in every project.

---

## MCP — Model Context Protocol

This is where Claude Code goes from "good coding helper" to "orchestrator of your whole workflow."

**MCP lets Claude connect to external tools and services:**

- **GitHub**: search repos, read issues, manage PRs, review code
- **Slack**: read channels, send messages, reply in threads
- **PostgreSQL/MySQL**: query the database directly
- **Jira**: update tickets, change statuses
- **Figma**: read designs (yes, seriously)
- **Puppeteer/Playwright**: browser automation
- **Sentry**: error monitoring
- **Notion**: read and edit documents

Configure it in `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "github": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token"
      }
    }
  }
}
```

Now you can do things like:

```bash
claude "find all open bugs in our github repo tagged 'critical' and summarize them"
```

```bash
claude "query the database for users who signed up this week
        and post the count to #metrics on slack"
```

```bash
claude "check sentry for the top 5 errors this week
        and create github issues for each one"
```

One tool, connected to everything. I have Claude pulling GitHub issues, reading the database, and posting summaries to Slack in a single conversation. No tab switching. No context loss. No copy-pasting between tools.

---

## Hooks — Deterministic Automation

CLAUDE.md instructions are guidance. Claude follows them most of the time, but not always. You can't rely on a language model to *always* run the linter. *Always* format code. *Always* check for dangerous commands.

Hooks make that behavior **deterministic**. They're event handlers that fire automatically at defined points in Claude's workflow. Your shell script runs every time, no exceptions.

### Events

- **PreToolUse**: fires before any tool runs. A guard rail. Block dangerous commands here.
- **PostToolUse**: fires after a successful tool call. Auto-format, auto-lint, auto-validate.
- **Stop**: fires when Claude finishes a task. Quality control. "Tests must pass before you declare done."
- **UserPromptSubmit**: fires when you press Enter. Prompt validation.
- **Notification**: desktop notifications when Claude needs your attention.

### Example hook configuration

Auto-format every file Claude touches, and block dangerous bash commands:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write 2>/dev/null"
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "$CLAUDE_PROJECT_DIR/.claude/hooks/bash-firewall.sh"
          }
        ]
      }
    ]
  }
}
```

The bash-firewall script reads the command from stdin, checks for dangerous patterns (`rm -rf`, `git push --force`, `DROP TABLE`), and exits with code 2 to block. Code 0 = pass. Code 1 = warn but continue. Code 2 = block fully.

A Stop hook that runs `npm test` and returns code 2 on failure will prevent Claude from declaring "done" until the tests are green.

Hooks don't hot-reload — restart the session after editing. They run with full user permissions, so escape shell variables and validate JSON input.

---

## Skills — Reusable Workflows

Skills are the feature that made me realize how deep the rabbit hole goes.

A skill is a workflow Claude can invoke itself based on context, or that you launch with a slash command. Skills watch the conversation and fire at the right moment.

### Structure

Each skill lives in its own subdirectory with a SKILL.md file:

```
.claude/skills/
-- security-review/
   -- SKILL.md
   -- DETAILED_GUIDE.md
-- deploy/
   -- SKILL.md
   -- templates/
      -- release-notes.md
```

SKILL.md uses a YAML header to describe activation conditions:

```yaml
name: security-review
description: Comprehensive security audit. Use when reviewing code
  for vulnerabilities, before deployments, or when the user
  mentions security.
allowed-tools: Read, Grep, Glob

Analyze the codebase for security vulnerabilities:
- SQL injection and XSS risks
- Exposed credentials or secrets
- Insecure configurations
- Authentication and authorization gaps

Report findings with severity ratings and specific remediation
steps. Reference @DETAILED_GUIDE.md for our security standards.
```

When you say "check this PR for security issues," Claude reads the description, recognizes the match, and invokes the skill automatically. Or call it directly: `/security-review`.

The key difference from commands: **skills can include companion files**. The `@DETAILED_GUIDE.md` link pulls in a document living next to SKILL.md. Commands are single files. Skills are packages.

The `/last30days` skill that went viral on X is a great example. Someone built a skill that scans Reddit and X over the last 30 days on any topic, synthesizes community findings, and emits ready-to-use prompts. You type `/last30days prompting techniques for legal questions` — you get frameworks that lawyers and power users actually use.

Personal skills live in `~/.claude/skills/` and are available in every project.

---

## Plan Mode

This feature has saved me from myself countless times.

**Before letting Claude loose on a big refactor:**

1. Press Shift+Tab twice to enter plan mode
2. `claude "analyze the database layer and propose a migration to TypeORM"`

Claude explores the codebase, reads relevant files, analyzes the architecture — and presents a plan. No changes. Nothing modified. Just analysis and a proposed approach.

You review. Tweak. Ask questions. Poke holes. Once you're confident, you approve and it implements.

This prevents the "Claude rewrote my whole project and I didn't ask" moment. Trust me, that moment is not fun. Plan first, build second. Always.

---

## The Memory System

Claude remembers things across sessions. Automatically.

Correct it once — "don't use class components in this project, we use hooks" — and it saves the preference. Next session, it already knows. You don't have to repeat yourself.

Manage it via `/memory`. Stored in `~/.claude/projects/<project>/memory/`.

The combination of CLAUDE.md (team knowledge) + automatic memory (personal learning) means **Claude accumulates experience**. The more you use it, the better it works. Week-one Claude and week-eight Claude on the same project are two different tools.

---

## Computer Use

Landed in March 2026.

Claude can now control the computer directly:
- open applications
- navigate browsers
- fill out spreadsheets
- interact with any GUI
- take screenshots and respond to what it sees

No setup required. Works from your phone via remote control.

I haven't gone deep on this yet — still experimenting. But the possibilities are striking. Imagine: "open Figma, screenshot the latest design, then implement it in React." That's where we're headed.

---

## Advanced Workflows

Patterns that turned me from "Claude Code user" into "dangerous Claude Code user." None of this is in the docs.

### The "Interview Me" Technique

Starting a complex project? Don't write a giant prompt. Don't try to think of everything in advance. Just say:

```bash
claude "interview me in detail about what i want to build"
```

Let Claude ask YOU questions. It'll ask about the stack, requirements, edge cases, existing code, deployment targets, user types — things you'd forget to mention in a prompt. 10 minutes of Q&A gives Claude better context than a 500-word prompt.

I use this for every new feature. Every one.

### Research → Implement Separation

Never let Claude implement something it hasn't understood first.

**Phase 1:** Shift+Tab twice → plan mode → `"explore the codebase and understand how payments work"`

Review the analysis. Make sure it actually got it.

**Phase 2:** `"implement subscription billing based on your analysis"`

The quality difference between "just do it" and "understand first, then do it" is huge. Especially on legacy codebases where nothing lives where you'd expect.

### Parallel work with worktrees

```
Terminal 1: claude --worktree auth-feature
Terminal 2: claude --worktree billing-feature
```

Each gets an isolated git branch. Two features developed simultaneously by two separate Claude sessions. Merge when ready.

Sometimes I run 3 worktrees. Auth feature in terminal 1, API endpoint in terminal 2, test suite in terminal 3. All in parallel. All isolated.

### Context management

**This is the #1 skill that separates good Claude Code users from great ones.**

The context window is about 200K tokens. Sounds like a lot. But when you're deep in a session, it runs out fast. As it fills up:
- old tool output gets purged first
- the conversation gets auto-compacted
- early instructions can get lost

**Manage it actively:**
- `/compact` — manually compress the conversation to save space
- `/clear` — fresh start between unrelated tasks
- `/cost` — see what's eating tokens and where
- Subagents for heavy operations (test output, log analysis, large file reads)
- Repeated instructions go in CLAUDE.md, not the conversation

**Golden rule:** after two failed attempts, stop. Don't push through. `/clear` and a better opening prompt with a clear prompt almost always beats a polluted context full of failed approaches. I learned this at the cost of about 6 hours of wasted time.

### The ! prefix

Type `!` before any command to run it directly in the shell without Claude:

```bash
!git status
!npm test
!cat src/config.ts
```

The output automatically feeds into Claude's context. Handy for quickly showing Claude the current state without asking it to run a command and waiting on permissions.

### External editor for long prompts

`Ctrl+G` opens your system editor (vim, VS Code — whatever's configured). Write complex multi-line prompts with syntax highlighting. Save and close — it sends to Claude.

Far better than typing a paragraph into a single-line terminal input. I use this for every prompt longer than two sentences.

### Double Escape — roll back

This one few people mention.

Claude went the wrong way? Double-tapping Escape brings up a rollback menu. You can undo the last action, go back further, or "compact from here," which compresses the failed attempt while keeping useful context. Much better than `/clear` because you don't lose everything — just the mistake.

### Permission modes

Claude Code has different autonomy levels:

Start with default mode. Switch to `acceptEdits` once you trust it (took me about a week). Use plan mode for exploration before big refactors.

**Command allow/deny lists** live in `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git status)",
      "Bash(git diff *)",
      "Read",
      "Write",
      "Edit"
    ],
    "deny": [
      "Bash(rm -rf *)",
      "Bash(curl *)",
      "Read(./.env)",
      "Read(./.env.*)"
    ]
  }
}
```

Allow-list runs without asking. Deny-list blocks completely. Anything not on either list, Claude asks for permission. That middle ground is intentional. Safety net without micromanaging every command.

---

## Claude Code vs Cursor vs Copilot

Honest comparison. No fanboying. Just personal experience.

**Claude Code**: terminal-native, genuinely agentic. Reads the whole codebase. Autonomous multi-file changes. Best for: complex refactors, architectural decisions, project-wide changes, debugging tangled problems, anything touching more than 3 files. Feels like a calm senior engineer who never tires and never judges your code.

**Cursor**: IDE-native (VS Code fork). Best everyday tool for Tab autocomplete and inline suggestions. Tighter in-editor feedback loop. Less autonomous but faster for small edits. Best for: quick fixes, inline suggestions, staying in flow while writing code.

**GitHub Copilot**: plugin approach. Best free tier ($10/mo). Safest enterprise choice. Agentic features are growing but still trail Claude Code and Cursor.

Many people miss this: **you don't have to pick one.**

The combined strategy is real, and most experienced users use it. Cursor for daily autocomplete and inline edits. Claude Code for heavy lifting: refactors, new features, debugging, architectural decisions.

The data backs it up: experienced developers average **2.3 AI coding tools**. It's not about replacing one with another. It's about the right tool for the right task.

Claude Code became the **#1 most loved AI coding tool** in under a year. 46% of developers named it their favorite in early-2026 surveys. 95% of developers use AI tools weekly. 75% use AI for more than half of their coding.

The game changed. For good. The question isn't whether to use AI coding tools. It's how fast you'll learn to work with them.

---

## The Claude Code Ecosystem

The community has built a huge amount of tooling on top of Claude Code. Here's what's worth knowing:

- **Superpowers (obra/superpowers)**: a complete development methodology for AI agents. 117K+ GitHub stars. Changes how the agent writes code — forces it to brainstorm first, build a detailed implementation plan, run development through subagents, and do a two-stage code review before finishing. If Claude Code sometimes produces spaghetti, this is the cure.

- **GSD — Get Shit Done (gsd-build/get-shit-done)**: a meta-prompting and context-management system for Claude Code. Lightweight but powerful. Solves the context-degradation problem.

- **awesome-claude-code**: a community-curated collection of the best resources, skills, agents, and MCP servers. Starting point for the ecosystem.

- **The /last30days skill**: the viral one. Scans Reddit, X, YouTube, Hacker News, and the web over the last 30 days on any topic you give it. Synthesizes community knowledge into ready-to-use prompts. You type `/last30days cold email frameworks` — it finds the 3 Ps framework, ADA, intent-based triggers — things you wouldn't find yourself. Then writes ready prompts based on what actually works. Open source, MIT license.

- **Claude How-To**: a visual guide to mastering Claude Code with examples. Best resource for visual learners who prefer structured tutorials.

- **Claude Mem**: a persistent memory layer. For when the built-in memory system isn't enough for your workflow.

- **UI UX Pro Max**: design-focused tooling for Claude Code. For when you need Claude to care about how things look, not just how they work.

- **n8n-MCP**: connects Claude Code to n8n automations. If you already use n8n, this is the obvious integration.

The ecosystem is growing fast. New tools every week. Listed here are the ones I've actually used or seen in action.

---

## Common Mistakes (I Made All of Them)

### 1. A novel instead of CLAUDE.md

Keep it under 200 lines. Specific. Applicable. If Claude ignores instructions, your CLAUDE.md is probably too long. Mine was 400 lines — practically a manifesto. I cut it to 150 and things improved.

### 2. No /clear between tasks

A conversation about fixing a CSS bug has no useful context for a new API endpoint. Residual context actively gets in the way. Clear it. Start fresh. Every time.

### 3. Fighting instead of restarting

After two failed attempts, the context is polluted with failed approaches. Claude starts referring to its own mistakes. `/clear` and write a better prompt. A fresh context almost always wins. I once spent 6 hours before I learned this.

### 4. Ignoring subagents

Running a full test suite in the main conversation floods the context with hundreds of lines of output. Delegate to a subagent. Keep the main conversation clean and focused on the work.

### 5. Opus for everything

Sonnet handles 90% of tasks just as well. Opus is for the 10% that actually needs deep reasoning: complex architecture, tricky debugging, subtle logic errors. Your wallet will thank you. Mine did.

### 6. Skipping plan mode for big changes

Always plan when more than 3 files are involved. Always. 5 minutes reviewing a plan saves 2 hours fixing what Claude got wrong.

### 7. Passive about context

The context window is a resource. Treat it that way. `/compact` when the conversation has gotten long. Subagents for heavy operations. CLAUDE.md for instructions instead of repeating them every session. People who manage context well get dramatically better results.

---

## The Bottom Line

Claude Code isn't a tool. It's a partner.

A partner that reads the entire codebase, follows your standards, runs tests, creates PRs, remembers your preferences, connects to all your tools, and gets better every time you use it.

I've been at this for 2 months. Took the courses, got the certifications, build something every day. I can say with full confidence: developers who learn to work WITH Claude Code, not just paste into it, are shipping at a pace that was unthinkable a year ago.

It's 2026. You have access to an AI agent that autonomously navigates a 50,000-line codebase, makes targeted changes across many files, runs tests, fixes its own bugs, and creates a pull request with documentation.

Stop saving articles about AI. Start building with it.

If this was useful, send it to someone still copy-pasting into ChatGPT. They need it more.

Author: @axel_bitblaze69
