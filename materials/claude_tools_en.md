# Complete Guide to Claude Tools

Translation for @prompt_design  
April 18, 2026

---

## Introduction

I've spent more time in Claude than in any other AI tool. By a wide margin. I've been building real workflows, real automations, and using Claude for productivity every single day for the past year.

I've even replaced real employees with Claude-powered processes.

The biggest productivity upgrade I got from Claude is probably not the one you're expecting. It's not advanced prompting strategies and it's not elaborate Claude Code workflows.

The biggest upgrade is Claude's tools, which 99% of people ignore completely (even though they're paying for them).

This is a complete guide to every Claude tool worth knowing — broken down by level, with practical explanations, written for people who want real productivity gains.

**Table of contents:**
- Level 1: core interface tools
- Level 2: research and thinking
- Level 3: agentic tools
- Level 4: coding and building

---

## Level 1: Core Interface Tools

These are the tools everyone should be using. The lowest-hanging fruit for day-to-day work with Claude.

### Projects

Projects is Claude's most important feature that most people never set up properly.

Without Projects, every conversation starts from zero. Claude knows nothing about you, your work, your voice, or your standards — and you spend the first five minutes of each session re-explaining context you've explained dozens of times.

**My advice:** spend 20–30 minutes collecting context files and uploading them into separate Projects. You'll start getting better AI responses immediately.

### Claude Skills

If Projects is the environment, Skills are the workflows that run inside it.

A Claude Skill is a pre-loaded set of instructions saved as a markdown file. Invoke it in any chat or Project and Claude instantly starts following those instructions.

Picture this: you build a "Brand Voice" Skill with your tone, audience, banned words, and formatting rules. Instead of explaining it every time, you say: "use my Brand Voice Skill to write [x]."

**TL;DR how to build:** Customize – Skills – Enable Skill-Creator. Then tell Claude: "I want to build a Skill for the process [x], help me create it."

Use Claude Skills before anything else in this guide.

### Memory

Most people don't know: Claude is building memories about you across conversations. Most people let this happen passively and never control what Claude saves.

Go to Settings – Memory right now and look at everything Claude remembers about you. Delete what's outdated or wrong and add the context you want it to keep forever.

**Pro tip:** you can export memory from other AI platforms, like ChatGPT. Just tell ChatGPT: "I'm migrating this [project/chat/memory] to Claude, give me a document to help with the move."

### Connectors

Connectors give Claude direct access to your existing tools inside any conversation.

Go to Settings – Connectors and plug in the ones you use most. For me that's Google Drive, Gmail, Slack, Notion, Google Calendar, and Excalidraw. There are 50+ connectors available total.

---

## Level 2: Research and Thinking

OK, you've set up the foundation: Skills, Connectors, Memory, Projects. Now we start using it to get elite results.

### Research Mode / Deep Research

Most people know the feature exists — and ignore it.

When you activate Deep Research, Claude doesn't just answer your query. It breaks it apart, searches across dozens of sources, cross-references findings, and comes back with an in-depth report with citations.

Depending on the complexity, this takes five to 45 minutes.

The feature is in the main chat window — enabled by clicking "+".

### Extended Thinking

By default, Claude answers fast. For most tasks that's exactly what you want.

But for complex tasks (strategy, analysis, multi-step reasoning), you want Claude to slow down and think before answering.

Extended Thinking turns on deeper reasoning and lets Claude carefully work through the problem before producing an answer.

**Two ways to enable it:**

1. Through phrasing — add phrases like "think deeply before responding"
2. Through the Extended Thinking toggle in the chat UI (below the model picker)

Remember: you can change which model runs Extended Thinking. For complex, heavy-reasoning tasks, use Opus 4.6.

### Artifacts

Artifacts are code files (HTML pages, React components, documents, diagrams, tables) that live as separate files. You can view them, edit them, download them, and iteratively refine them — unlike text buried in chat.

With Artifacts you can build literally anything, and they get especially powerful when paired with custom Skills. Build landing pages, custom apps, dashboards, and more.

**How to use:** just ask Claude to "make this an Artifact" or "build this as a downloadable file." Artifacts are on by default.

---

## Level 3: Agentic Tools

This is where you start unlocking Claude's full power. I use these tools every day and they're what let me get "real work" done with Claude agents.

### Claude Cowork

Cowork is only available in the Claude desktop app. Once installed, you can hand Claude multi-step tasks that touch your actual workflows.

I rely on three Cowork features every day:

1. **Scheduled Tasks** — Claude runs tasks automatically on a schedule. I use it for daily research, connector sweeps for briefs (Gmail and Calendar), and more.

2. **File Access** — the feature that really sets Cowork apart from other AI tools. In Cowork you can grant models access to files and folders on your computer. Claude can edit and work inside designated workspaces — all locally.

3. **Plug-Ins** — these are like Claude Skills on steroids. Skills automate a single recurring task; a Plug-In bundles multiple Skills into a single role.

### Cowork Dispatch

Dispatch lets you run Claude Cowork from your phone.

You can open your laptop, leave it running, walk away from your workspace, and still give Claude tasks. It's like a mini OpenClaw.

Just go to "Dispatch" inside Cowork and follow the setup instructions.

### Claude in Chrome

This connector lets desktop Claude users launch a task in Claude Desktop and have it executed in the browser without switching windows.

---

## Level 4: Building and Coding

This section is for people who want to build and code advanced applications (not just simple Artifacts).

### Claude Code

Claude Code is the most powerful AI coding tool available right now.

**What Claude Code actually does:**

- Hunt down complex bugs and errors in code
- Ship sites and apps
- Write tests and run the entire testing process
- Run security audits
- Plan coding sessions
- Code in natural language (vibe coding)

### Slash Commands

A built-in command system that speeds up work in Claude Code. Worth keeping a cheatsheet.

**Core commands:**

- `/help` — list every available command
- `/clear` — clear the current session's context
- `/compact` — compress the conversation history to free up context
- `/init` — create a CLAUDE.md based on project analysis
- `/memory` — open and edit the memory file
- `/model` — switch model (Opus / Sonnet / Haiku)
- `/cost` — show current token spend and dollars for the session
- `/review` — review a pull request
- `/config` — open settings
- `/mcp` — manage MCP servers
- `/resume` — continue a previous session
- `/doctor` — diagnose your Claude Code environment

**Custom commands.** You can build your own slash commands. Create a file named after the command with a `.md` extension in the project's `.claude/commands/` folder, or in `~/.claude/commands/` for global ones. The file's content is the prompt that runs when you invoke it. Handy for recurring tasks: `/deploy`, `/test-all`, `/fix-lint`, etc.

### CLAUDE.md

A markdown file you create at the root of any project. Claude Code reads it automatically before every session. Inside: instructions specific to your project (coding standards, architectural decisions, file structure, things Claude is not allowed to do).

Think of it as Project Instructions, but purpose-built for your codebase.

This is the single biggest quality upgrade most Claude Code users don't set up.

**How to create it:** make a `CLAUDE.md` file at the project root and write everything Claude Code should know before touching your code.

**Example CLAUDE.md:**

```
This is a Next.js project with TypeScript and Tailwind.

Always use functional components. Never use class components.

Run npm run lint before committing any changes.

All API calls go through the /lib/api folder. Don't call APIs directly
from components.

Don't modify the /config folder without approval.
```

### Multi-Agent Mode / Subagents

Claude Code can now run multiple subagents in parallel on different parts of the same project.

For example: one agent writes tests while another builds a feature. One refactors existing code, another works on documentation.

Claude Code decides when to use subagents on its own — based on task complexity.

**How to trigger them:** give Claude high-level, outcome-oriented prompts rather than step-by-step instructions.

### Memory (/memory)

Claude Code has its own memory system, separate from web memory. You can tell it to remember specific things about your project, your preferences, or your coding standards. It stores them in a memory file and carries them forward.

Paired with CLAUDE.md, that means Claude Code gradually accumulates understanding of your project instead of starting from scratch every session.

I genuinely believe that if you adopt these four things — slash commands, solid CLAUDE.md hygiene, subagent triggers, and proper memory management — your Claude Code productivity goes up a tier.

---

## Conclusion

That's it — my complete guide to Claude's tools.

Hope it was useful.

**Source:** @aiedge_ on X. The author publishes articles on the hottest topics in AI three times a week (Monday, Wednesday, Friday) and runs a free newsletter.
