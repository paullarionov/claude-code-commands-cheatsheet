# Hermes Agent: A Plain-English Guide

Open-source agent with self-learning and 7 workflows for everyday use

Based on @NickSpisak_  
Source: X / Twitter, April 2026  
Translation: Telegram channel @prompt_design

---

## What Hermes Agent Is (in 30 seconds)

Hermes Agent hit 50,000 GitHub stars in two months. Plenty of videos explain what it is. None tell you what to do with it on day one.

Hermes is a personal automation agent that lives on a server (or laptop) and talks to you through messaging apps (Telegram, Discord, Slack, WhatsApp, Signal, Email — 15+ platforms) or via CLI. It's a system that runs 24/7: performs recurring tasks, monitors what matters to you, learns from experience, and creates reusable skills.

Installation takes 2 minutes:

```bash
# download the install script
curl ...
# run
hermes
# choose a model
hermes model
# connect Telegram
hermes gateway setup
```

Done. You have an agent.

Install it on a cheap VPS or a personal device. It runs in the background and wakes up on demand. Message it when needed — it remembers what's already in progress.

---

## The Learning Loop (the whole point)

Every ~15 tool calls, Hermes pauses. Looks at what happened. What worked. What failed. What took too long. Then writes a skill — a markdown file in `~/.hermes/skills/` that turns the experience into a reusable process.

Those files aren't hidden. You can open them, read them, edit them, delete the bad ones.

The practical difference: ask Hermes to research a topic on day one and you get a generic summary. Ask it the same thing on day 30 and the result is more accurate, more relevant, and formatted the way you like. It learns from what you react to and what you ignore.

Claude Code's memory stores facts about your preferences. Hermes stores **executable procedures**. It doesn't just remember that you like bullet points. It remembers the full "research – filter – format" process that produces bullet points the way you want them.

---

## How It Differs From Claude Code and OpenClaw

**Claude Code** lives in your repository. Reads code, writes code, runs tests, commits. One of the best code agents. But it doesn't live on a server. Doesn't text you on Telegram. Doesn't run recurring tasks while you sleep.

**OpenClaw** lives on your server. A personal agent with messaging, scheduling, and tool access. But it has no learning loop. It doesn't write its own skills based on experience.

**Hermes** lives on a server like OpenClaw, but adds the learning loop. Every task makes it a bit better at the next one. If you're moving from OpenClaw, one command imports everything: persona, memory, skills, API keys, messaging setups:

```bash
hermes claw migrate
```

Five minutes, and you're over.

The main thing: **don't compare them, use them together.** Claude Code for development. Hermes for everything else. They speak the same MCP protocol, so your tools work in both. That's the architecture.

---

## 7 Workflows

### 1. Morning Briefings That Learn

One developer bought a Mac Mini M4 to run local LLMs. It wasn't powerful enough. So he turned it into a home server with Hermes and a Telegram bot. Now it handles his job-search pipeline, project tracking, and daily summaries. He stopped opening his laptop to check email in the morning.

**Setup:** connect Hermes to Telegram via `hermes gateway setup`. Tell it to monitor email, calendar, and 2–3 topics. Schedule it. Every morning the summary lands in Telegram.

The value isn't the summary itself. The value is what happens two weeks later. Hermes learns which senders you reply to, which meetings you prep for, which topics you ask follow-ups on. The skill file updates itself. The day-30 summary doesn't look like the day-1 summary.

### 2. Website Monitoring Instead of Manual Review

One developer set up Hermes to review incoming user reports on a live site and make decisions about metadata corrections. He completely replaced the manual review process. The agent reads the report, checks it against existing data, applies the fix if it's correct, and logs the change.

Hermes ships with **Camoufox** — a stealth browser that doesn't get flagged like standard automation tools. Sites that block headless browsers work cleanly. Add **Firecrawl** for structured extraction, and you have a monitoring pipeline that isn't detected.

Point it at competitor pricing pages, job boards, news sources, product catalogs. Hermes handles extraction, tracks changes, and knows what's new versus what it showed you yesterday. Set it up once — it runs on a schedule.

Result: you stop manually checking 10 tabs every morning and instead get a diff of what actually changed overnight.

### 3. One Agent Running a Whole Company

A fintech startup founder tried the multi-agent approach. Five specialized AI agents: marketing, sales, engineering, community, and daily briefings. Each with its own identity, memory, and schedule.

It failed in 48 hours. Agents couldn't share context. Skills got duplicated. Brand voice was inconsistent across channels because each agent had its own instructions.

He collapsed everything into a single Hermes instance. Claude Code handles the codebase. One agent runs marketing, outreach, community management, and daily briefings for a fintech startup with zero employees. The marketing context is available during outreach because it's the same agent.

Result: a single memory means every function feeds context into every other. That compounding effect doesn't happen when you split the work across 5 disconnected tools.

### 4. A Knowledge Base That Gets Smarter Over Time

Hermes ships with **Karpathy's LLM Wiki** pattern as a built-in skill. You tell it to create a wiki, point it at sources, and it organizes everything into linked markdown files. Summaries, entity pages, concept pages, comparison pages — all cross-linked and maintained by the agent.

The wiki has three layers:

- **Raw sources** are loaded and never modified
- **Wiki pages** are written and maintained by the agent based on the sources
- **A schema file** defines the rules, keeping everything consistent

Why this matters specifically for Hermes: the learning loop means the wiki maintains itself. Add a new source — the agent doesn't just drop it in a folder. It checks existing pages, updates what changed, adds cross-links, and flags contradictions. After a month of regular use, you have a compounding knowledge base that synthesizes everything you've fed into it.

643 community skills are available in the Skills Hub. Browse them with `/skills` inside Hermes.

### 5. Experiments That Optimize Themselves

The autoresearch pattern works like this: an AI agent makes a small change, tests whether it worked, saves the winner, and tries again. Over and over. Automatically.

Hermes is built for that loop. Give it a metric to improve: email open rate, landing page conversion, lead response time. Tell it to make small changes, measure the result, and keep what works. The learning loop means it doesn't test randomly. It gets better at predicting which changes will work based on what's already been tried.

One developer gave Hermes a broker API key and created 4 automated trading strategies deployed to a real account. Another ran an automated token operation on Solana. These aren't demos. These are production systems running with real money.

Result: you set the goal and constraints. Hermes runs the experiments while you're doing something else.

### 6. Connecting to Claude Code MCP Servers (No Migration)

Hermes v0.8.0 added native MCP client support. MCP is the same protocol Claude Code uses for tool integration.

Every MCP server you've already built or installed for Claude Code works with Hermes. Google Workspace connector, database tools, custom APIs. Hermes discovers them automatically. No rebuild. No reconfigure.

The working combo: Claude Code writes code and manages repos. Hermes handles research, briefings, monitoring, and automation — using the same MCP servers already configured. One infrastructure investment, two agents, zero duplication.

### 7. Model Selection (or Lost Weekends)

Wrong model choice is the #1 reason Hermes setups "feel broken." People blame the framework when it's actually a model that can't handle tool calls.

One developer ran Hermes on a project for almost 3 hours straight after upgrading to v0.8.0 — but only after switching to a frontier model. Others tried big open-source models and watched the agent hallucinate tool calls that didn't exist.

**Gemma 4 26B via Ollama** is the best option for local experiments. But for the workflows in this guide, use a frontier model API.

Switching:

```bash
hermes model
```

Nous Portal, OpenRouter with 200+ models, OpenAI, or your own endpoint. No code changes, no vendor lock-in. Run `hermes doctor` if something's off — it diagnoses config issues before you spend hours guessing.

---

## Summary

Hermes Agent is an open-source agent with a learning loop that lives on your server and gets better with every task.

- **Claude Code** — for development
- **Hermes** — for everything else
- Both speak MCP, tools are shared

Install it. Connect Telegram. Give it one recurring task. Let it run for two weeks before you evaluate. The version of your agent on day 30 is the one worth evaluating.

---

## Sources

- Nick Spisak (@NickSpisak_), X / Twitter, April 10, 2026
- Nous Research (@NousResearch)
- GitHub: Hermes Agent (50K+ stars)
