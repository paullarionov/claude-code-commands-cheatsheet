# Saving Claude Code Tokens When Working With Documents

Integration with NotebookLM

Complete guide by @hooeem  
Source: X / Twitter, April 2026  
Translation: Telegram channel @prompt_design  
April 11, 2026

---

## The Problem: Token Limits and Claude's Amnesia

Recognize the message "Claude usage limit reached. Your limit will reset at 7pm"? If so, this article is for you.

The problem is that Claude's amnesia eats tokens. On the Pro plan ($20/mo), limits run out fast. On Max ($100–200/mo) the ceiling is higher, but heavy research still eats the budget.

Want Claude to analyze 30 documents, find connections across them, and write a report? That's an expensive day.

The solution is a bridge between Claude Code and Google NotebookLM. Offload the heavy analytical work to Google's free infrastructure and spend Claude tokens only on orchestration and final polish.

---

## What Claude Code Is (Briefly)

If you've only used Claude through chat, Claude Code is a different animal.

It runs in the terminal. Reads all your code. Writes files, runs scripts, spins up subagents in parallel, executes multi-step processes without hand-holding at every step.

The problem is pricing. Every chunk of context you feed Claude burns tokens. On Pro, limits run out fast. Max is larger, but intensive research still drains the budget.

---

## What NotebookLM Gives You

NotebookLM is Google's research tool built on RAG (retrieval-augmented generation). You upload documents, it indexes everything, and you can ask questions across all sources at once.

The numbers:

- Free tier: 50 sources per notebook
- Pro tier: 300 sources per notebook
- Processing cost: zero

It supports PDFs, web links, YouTube videos, Google Docs, text, audio, images. Because answers are grounded in your uploaded sources, it doesn't hallucinate the way a general-purpose chatbot does.

The limit: no official API. It's a browser-only tool. You can't script it, automate it, or plug it into anything.

That's what **notebooklm-py** fixes.

---

## Installing the Bridge

Developer Teng Ling reverse-engineered NotebookLM's internal protocols and published the open-source CLI tool **notebooklm-py**. It lets you drive NotebookLM entirely from the terminal: create notebooks, upload sources, run queries, generate slides, podcasts, and flashcards.

### What you need

- Python 3.10+
- A Google account
- A terminal (macOS, Linux, Windows)

### Install

Repo: https://github.com/teng-lin/notebooklm-py

Follow the README.

---

## Teaching Claude Code to Use NotebookLM

The bridge is installed. Now we need to give Claude knowledge of how to use it. That's what **skills** are for.

### Skills in 30 seconds

A skill is a set of instructions in a SKILL.md file that Claude reads when it detects a matching task. Think of it as a playbook on your machine. Claude loads it automatically when it recognizes a match in your request.

Skills follow an open standard. They work in Claude Code, Cursor, Gemini CLI, Codex, and others. No vendor lock-in.

### Where skills live

**Personal** (available in every project):

```
~/.claude/skills/skill-name/SKILL.md
```

**Project-scoped** (tied to a single repo, shareable via Git):

```
.claude/skills/skill-name/SKILL.md
```

Project skills override personal skills on a name match.

### Installing the NotebookLM skill

```
notebooklm skill install
```

The skill installs in two places: `~/.claude/skills/notebooklm/` (for Claude Code) and `~/.agents/skills/notebooklm/` (for compatible agents like Codex).

Verify:

```
notebooklm skill status
```

Once installed, Claude knows how to create notebooks, upload sources, run queries, and generate outputs via the CLI. No need to explain the syntax every session.

### How Claude decides when to use a skill

Every skill has a description in its header. Claude reads every available description at startup and matches them against your request. Say "research B2B sales strategies and put together a report" and it pulls in the NotebookLM skill automatically.

You can also invoke it directly: `/notebooklm`

### Creating your own skills

Anthropic publishes a meta-skill called **skill-creator**. Run `/skill-creator` in Claude Code — it interviews you about what you want, generates the full SKILL.md, runs test prompts, and packages the result.

From "I want a skill that does X" to a working, tested skill in minutes, not hours.

---

## Four Workflows

Setup is the boring part. The value is in these four workflows.

### Workflow A: Research Without Burning Tokens

**Problem:** you need to analyze 30+ documents. Doing it locally kills your token budget.

**Solution:** Claude orchestrates, NotebookLM processes. Free.

#### Step by step

**1. Collect sources.** PDFs, articles, YouTube transcripts (Claude can use yt-dlp to pull transcripts).

**2. Claude creates the notebook:**

```
notebooklm create "My Research Project"
```

**3. Claude uploads all sources:**

```
notebooklm source add \
  "./transcript-1.md" \
  "https://example.com/article" \
  "./report.pdf"
```

Up to 50 sources on the free tier — enough for most projects.

**4. Claude queries NotebookLM instead of processing locally:**

```
notebooklm ask \
  "what are the three most important themes \
  across all sources?"
```

Google's Gemini engine handles the query across every uploaded document. Returns an answer with citations. Free.

**5. Claude generates outputs:**

```
notebooklm generate slide-deck
notebooklm generate flashcards --quantity more
notebooklm generate mind-map
notebooklm generate data-table "compare key concepts"
notebooklm generate audio "make it engaging" --wait
```

Everything downloads to your machine.

**6. Claude polishes the result.** It takes the raw artifacts and refines them locally: edits slides, reformats tables, integrates findings into the final document. Only this step spends your Claude tokens.

#### The math

The expensive analytical work happens on Google's infrastructure. Claude tokens are reserved exclusively for orchestration and final polish. You just stretched a $20/mo plan into what used to cost $200/mo.

### Workflow B: Building Expert AI Agents From Web Research

You want to assemble a custom AI agent for a specific domain (say, B2B sales). But vague prompts produce vague agents.

Use NotebookLM's Deep Research for autonomous expert-knowledge collection from the web, then structure it into a Claude Code skill.

#### Step by step

**1. Run Deep Research in NotebookLM.** Open NotebookLM in the browser, pick the "web" source type, and enter a specific query:

"advanced B2B multi-channel outbound sales strategies, retention loops, and re-engagement sequences"

Deep Research autonomously crawls hundreds of pages, reads docs and guides, and assembles a cited report.

**2. Structure the result by the DBS framework:**

- **Direction** — step-by-step logic, decision trees, error handling. Becomes the core SKILL.md.
- **Blueprints** — static reference material: templates, tone guidelines, classification rules. Becomes companion files.
- **Solutions** — tasks that need deterministic code, not AI reasoning: API calls, data formatting, calculations. Becomes scripts.

**3. Feed the result into skill-creator.** Copy the DBS output, paste it into Claude Code, and run `/skill-creator`. Claude will generate the entire skill package automatically.

**4. Test and deploy.** skill-creator stress-tests the new skill with generated prompts, shows the results, and lets you iterate until it hits the quality bar.

#### The result

From vague idea to working expert AI agent backed by validated web research. Not in hours — in minutes.

### Workflow C: Memory Across Sessions

You spent three hours teaching Claude your architectural preferences, naming conventions, and project quirks. You closed the terminal. All gone.

The fix: a "wrap-up" ritual that automatically extracts session gains and saves them to a persistent NotebookLM notebook. Claude consults it at the start of every subsequent session.

#### Step by step

**1. Install the `/wrap-up` skill**, which instructs Claude to review the current session and extract:

- Your corrections (where Claude got it wrong)
- Winning patterns that worked
- Open questions and feature requests
- Key decisions and their rationale

**2. Configure the upload to NotebookLM.** Instead of saving to a local file, wrap-up pushes summaries to a dedicated "Master Brain" notebook:

```
notebooklm use master-brain-notebook-id \
  "./session-summary-2026-04-06.md"
```

**3. Run `/wrap-up` before closing every session.** Claude reviews the conversation, extracts insights, formats, and uploads.

**4. Add an instruction to CLAUDE.md.** That's the config Claude reads on session start. Add:

"Before answering questions about project architecture, historical decisions, or my preferences, query the Master Brain notebook via the NotebookLM CLI."

**5. Claude now has memory.** Over weeks the Master Brain accumulates hundreds of session summaries. NotebookLM indexes all of them and builds semantic links. Claude pulls exactly the context it needs without loading hundreds of documents into its context window.

Your AI agent actually remembers everything. Storage and retrieval happen on Google's free infrastructure. Your token budget stays intact.

### Workflow D: Visual Knowledge Management With Obsidian

Claude generates research documents, session summaries, and analysis files. They pile up as invisible files in terminal directories. You can't browse, search, or link them.

The fix: launch Claude Code from the root of an Obsidian vault so everything it creates immediately shows up in a visual knowledge graph.

#### What Obsidian is

A free notes app that operates on local Markdown files. Displays notes as an interactive graph of linked nodes. Very popular for personal knowledge management.

#### Step by step

**1. Launch Claude Code from the vault root:**

```bash
cd ~/Documents/MyVault
claude
```

Claude gets full read/write access to the entire note collection.

**2. Create a CLAUDE.md at the vault root.** That's the instruction manual for Claude on how to work with your vault:

- Folder structure (where research notes go, where logs go)
- Required metadata for new notes (dates, tags, source links)
- Link rules (wrap significant concepts in double brackets `[[like this]]` for the Obsidian graph)
- Formatting standards

**3. Build custom skills for working with the vault:**

- `/research <topic>` — Claude queries NotebookLM, downloads results, creates a note with metadata and cross-links
- `/daily` — generates a daily summary linking to everything you worked on
- `/wrap-up` — the memory skill from Workflow C, saving directly into the vault

**4. Iterate in real time.** As Claude creates files, you see them appear in Obsidian. If it categorizes a note wrong or misses a cross-link, fix it and ask Claude to update CLAUDE.md. The feedback loop trains Claude to match your preferences.

#### The result

A living, growing knowledge base. Claude sorts, tags, and links information to your spec. NotebookLM handles heavy research in the background. You see everything in the Obsidian graph.

---

## What Can Go Wrong

The stack is powerful. But it's built on an unofficial tool that could break tomorrow.

### Unofficial API — no guarantees

notebooklm-py reverse-engineers Google's internal protocols. Google doesn't endorse this. If Google changes the backend, commands will stop working. The maintainer (Teng Ling) is responsive for now, but no SLAs exist.

Treat this as a power-user tool, not production infrastructure.

### Anthropic's usage policy

Anthropic requires that automated workflows use the official Claude Code client with an appropriate plan. Don't use this stack to bypass token limits through unofficial wrappers. Make sure your usage complies with your plan.

### Data and privacy (UK, EU)

If you work with sensitive or regulated data: Claude's consumer tools process and store data in the US. GDPR implications are real. The enterprise API offers regional processing; the consumer tier does not.

### Protect the cookie file

The `storage_state.json` file contains live Google session cookies. Anyone who gets this file gets access to your NotebookLM data.

- Never commit it to a public repo
- Treat it like a password

### Cookies expire

You'll need to re-auth periodically. If commands start failing with auth errors:

```
notebooklm login
```

Takes 30 seconds.

---

## Command Quick Reference

| Command | Description |
|---------|-------------|
| `notebooklm create "Name"` | Create a notebook |
| `notebooklm source add file url ...` | Add sources |
| `notebooklm ask "question"` | Query the notebook |
| `notebooklm generate slide-deck` | Generate slides |
| `notebooklm generate flashcards` | Generate flashcards |
| `notebooklm generate mind-map` | Generate a mind map |
| `notebooklm generate audio` | Generate audio |
| `notebooklm generate data-table "..."` | Generate a table |
| `notebooklm skill install` | Install the skill |
| `notebooklm skill status` | Check skill status |
| `notebooklm login` | Re-authenticate |

---

## What to Explore Next

**Build a skill library.** Every recurring process is a skill candidate. Use skill-creator to package processes once and reuse them.

**Explore the skill ecosystem.** The community has published thousands of skills in Anthropic's official GitHub repo and on marketplaces like SkillsMP: code review, content generation, deploy pipelines.

**Combine with MCP servers.** Model Context Protocol lets Claude Code talk to external services — GitHub, Slack, databases. Layer that on top of NotebookLM for research and skills for process management, and you have a full autonomous engine.

**Add Obsidian plugins.** Dataview for dynamic queries across notes. Templater for automatic note templates. Combined with Claude file generation, the vault becomes something closer to a second brain than a notes app.

---

## Sources

- @hooeem, X / Twitter, April 9, 2026
- Jack Roberts, Chase, Universe of AI, Teng Ling
- Repo: github.com/teng-lin/notebooklm-py
