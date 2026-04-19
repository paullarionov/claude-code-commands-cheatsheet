# LLM Knowledge Base

Obsidian + Claude Code

A complete guide to building a personal knowledge base with LLMs  
From concept to launch in 15 minutes

Based on Andrej Karpathy's pattern  
April 2026

---

## 1. The Problem: Why Normal Knowledge Bases Don't Work

Most people work with documents through LLMs like this: upload files, the model finds relevant chunks on each query, generates a response. This is called RAG (Retrieval-Augmented Generation).

**Problems with the RAG approach:**

- **No accumulation** — every question starts from zero
- **No synthesis** — the LLM doesn't link information across sources
- **No updating** — new data doesn't correct old conclusions
- **No structure** — knowledge is scattered across chunks with no cross-links

"NotebookLM, ChatGPT file uploads, and most RAG systems work exactly like this. The LLM rediscovers knowledge from scratch on every question."  
— Andrej Karpathy

**The typical situation.** You collect articles, notes, transcripts. A month later there are 50+ of them. You ask the LLM a question — it finds 3 relevant chunks out of 50. Tomorrow, a similar question pulls 3 different chunks. You never have the full picture. Knowledge doesn't accumulate — it gets reinvented every time.

---

## 2. The Solution: An LLM Knowledge Base

The idea is different. Instead of searching raw documents on each query, the LLM **incrementally builds and maintains a persistent wiki** — a structured collection of markdown files with cross-references.

> **The key difference:** the wiki is a persistent, compounding artifact. The cross-links are already there. Contradictions are already flagged. The synthesis already reflects everything you've read. The wiki gets richer with every source you add and every question you ask.

### Division of Roles

| You (human) | LLM (agent) |
|---|---|
| Curates sources | Summarization and indexing |
| Sets direction | Cross-references |
| Asks questions | Updates on new data |
| Thinks about meaning | Bookkeeping and consistency |

"The boring part of maintaining a knowledge base isn't reading or thinking — it's the bookkeeping. People abandon wikis because maintenance costs grow faster than value. LLMs don't get tired and can update 15 files in one pass."  
— Andrej Karpathy

### Use Cases

- **Research** — deep study of a topic over weeks or months, accumulating papers and conclusions
- **Business** — internal wiki from Slack, meetings, calls, documents
- **Personal development** — goals, health, notes, podcasts
- **Reading books** — characters, themes, plotlines, connections
- **Competitive analysis** — products, companies, strategies

---

## 3. Architecture: 3 Layers

### System Overview

| Layer | Purpose | Writes | Reads | Rule |
|---|---|---|---|---|
| `raw/` | Raw sources | You | LLM | Never modify |
| `wiki/` | LLM-generated wiki | LLM | You | LLM owns it fully |
| `outputs/` | Reports, answers | LLM | You | Can be returned to wiki |
| `CLAUDE.md` | Schema (configuration) | You + LLM | LLM | Evolves over time |

### Folder Structure

```
my-knowledge-base/
├── raw/                <- Immutable source documents
│   ├── articles/       <- Articles, blog posts
│   ├── papers/         <- Research, academic papers
│   ├── notes/          <- Personal notes, ideas
│   ├── telegram/       <- Telegram posts
│   └── images/         <- Diagrams, screenshots
├── wiki/               <- LLM-generated wiki
│   ├── index.md        <- Catalog of all pages
│   ├── log.md          <- Chronological operation log
│   └── _templates/     <- Page templates
├── outputs/            <- Reports, analyses
└── CLAUDE.md           <- Schema for the LLM
```

### Key Files

**`wiki/index.md`** — the content catalog. A list of all pages with descriptions grouped by domain. The LLM reads it first on any query to find relevant pages.

**`wiki/log.md`** — the chronological log. An append-only record of every operation: ingest, query, lint. Format: `## [YYYY-MM-DD] operation | description`.

**`CLAUDE.md`** — the system schema. Tells the LLM how the wiki is structured, the conventions, and the workflows. Without it the LLM is just a chatbot. With it, it's a disciplined wiki maintainer.

---

## 4. Installation and Setup

### Required Tools

| Tool | For what | Where to get it |
|---|---|---|
| Obsidian | Viewing and navigating the wiki | obsidian.md |
| Claude Code | LLM agent maintaining the wiki | claude.ai/code |

### Optional

- **Obsidian Web Clipper** — save articles from the browser as `.md`
- **yt-dlp** — YouTube transcripts
- **qmd** (tobi) — local markdown search (BM25 + vector search)
- **Dataview** — Obsidian plugin for frontmatter queries

### Step 1: Create the Structure

Open a terminal in your Obsidian vault folder and run:

```bash
mkdir -p raw/articles raw/papers raw/notes raw/telegram raw/images
mkdir -p wiki/_templates outputs
```

> Tip: you can just open Claude Code in the vault folder and say: "Create the LLM Knowledge Base structure per Karpathy's pattern." It'll set everything up for you.

### Step 2: Create index.md and log.md

**`wiki/index.md`** — a catalog of all pages with sections by domain.

**`wiki/log.md`** — a chronological log. Format: `## [YYYY-MM-DD] operation | description`.

### Step 3: Configure CLAUDE.md

Add to `CLAUDE.md`:

1. **Architecture** — describe the three layers (raw, wiki, outputs)
2. **Frontmatter schema** — fields for every wiki page
3. **Naming conventions** — kebab-case for wiki pages, date-prefix for articles
4. **Operations** — Ingest, Query, Lint workflow
5. **Domains of interest** — your topics

---

## 5. CLAUDE.md — the Brain of the System

This is the most important file. Without it the LLM is just a chatbot. With it, it's a **disciplined wiki maintainer**.

### Frontmatter Schema

Every wiki page should carry this frontmatter:

```yaml
---
type: entity | concept | project | person | summary
domain: ai | communities | infrastructure | content
created: YYYY-MM-DD
updated: YYYY-MM-DD
sources: ["[[raw/articles/filename]]"]
tags: []
---
```

### Wiki Page Example

```markdown
# Page title

## Summary
1-2 paragraph overview.

## Key Details
Structured information.

## Related
- [[wiki/related-page]] --- why it's related

## Sources
- [[raw/articles/source-file]]
```

> **Important:** CLAUDE.md evolves over time. Start with a simple version and expand it as you understand what works for your domain. Karpathy: "super simple and flat."

---

## 6. Three Operations: Ingest, Query, Lint

### Operation 1: Ingest

You added a file to `raw/`. Tell the LLM:

"Process the new file in `raw/articles/2026-04-06-title.md`"

**What happens:**

1. The LLM reads the source in full
2. Discusses key takeaways with you
3. Creates or updates wiki pages in `wiki/`
4. Updates `wiki/index.md` and `wiki/log.md`
5. Adds `[[links]]` between related pages

**One source can touch 5–15 wiki pages.**

### Operation 2: Query

Once the wiki has 10+ pages, start asking questions:

- *"What are the three main trends in AI agents based on everything in wiki/?"*
- *"Compare article X and article Y. Where do they diverge?"*
- *"Write a 500-word brief on topic [X] using only materials in the base."*

The LLM reads `wiki/index.md`, finds relevant pages, and synthesizes an answer with citations.

> **Compounding:** valuable answers should be saved into `outputs/` or returned to `wiki/` as a new page. Every question makes the next answer better.

### Operation 3: Lint (Health Check)

Run this once a month:

"Check the entire `wiki/`. Find contradictions between pages. Find topics that are mentioned but not developed. Find claims without sources. Suggest 3 new articles to fill gaps."

**What Lint checks:**

- Contradictions between pages
- Outdated claims
- Orphan pages (with no inbound links)
- Concepts mentioned but without their own page
- Missing cross-references

> **Why this matters:** if the LLM wrote something incorrect and you saved it back, the next answer will be built on the error. Lint catches those problems before they pile up. It's like code review for your knowledge base.

---

## 7. Ways to Load Data

| Method | Description | Difficulty |
|---|---|---|
| Obsidian Web Clipper | Browser button → `.md` in `raw/articles/` | Easy |
| Copy-paste | Create a `.md` file manually in `raw/` | Easy |
| Claude Code | "Save this article to raw/" | Easy |
| Telegram Sync | Forward to bot → `raw/telegram/` | Medium |
| yt-dlp | YouTube transcripts via CLI | Medium |
| X/Twitter archive | Request archive → unpack into `raw/` | Medium |

### Obsidian Web Clipper (recommended)

1. Install the extension from Chrome / Firefox / Safari Web Store
2. In extension settings point it to your vault and the `raw/articles/` folder
3. Find an interesting article → click the button → file lands in `raw/articles/`

> **Downloading images:** Obsidian Settings → Hotkeys → "Download attachments" → bind it to `Ctrl+Shift+D`. After clipping, press the hotkey — all images get downloaded into `raw/images/`.

### CLI Tools

```bash
# YouTube transcripts
yt-dlp --write-auto-sub --sub-lang en \
    --skip-download -o "raw/notes/%(title)s" URL

# Summarize article by URL (steipete/summarize)
summarize https://example.com/article > raw/articles/2026-04-06-article.md
```

### Post-load Process

When a new file lands in `raw/`, tell the LLM agent: "Process new files in `raw/`" — and the Ingest operation runs.

---

## 8. Viewing in Obsidian

### Graph View

Open graph view (`Ctrl/Cmd+G`) and you see the shape of the wiki:

- **Hubs** — pages with many inbound links (key concepts)
- **Orphans** — pages with no connections (add links or delete)
- **Clusters** — groups of related topics

### Dataview

A plugin for frontmatter queries. Example:

````
```dataview
TABLE type, domain, updated
FROM "wiki"
WHERE type != null
SORT updated DESC
```
````

### Search

Up to ~100 pages, `wiki/index.md` + Obsidian's built-in search is enough.

Once the wiki grows, add **qmd** (tobi): local markdown search with BM25 + vector search and LLM re-ranking, all on-device. Has CLI and an MCP server.

---

## 9. Best Practices

### Do

- **Load sources one at a time** and participate in the LLM discussion — that produces a higher-quality wiki
- **Save valuable answers** back into wiki or outputs — that compounds knowledge
- **Run Lint** at least once a month
- **Use `[[wiki-links]]`** everywhere — they build the knowledge graph
- **Keep CLAUDE.md current** — it's the "brain" of the system, evolving over time
- **Git** — the wiki is just a git repo. You get version history for free

### Don't

- **Don't edit wiki manually** — that's the LLM's job. Want a fix? Ask the LLM
- **Don't modify files in raw/** — they're immutable
- **Don't overcomplicate** — flat files and a good schema beat a loaded plugin stack
- **Don't hoard raw/ without processing** — value lives in the processed wiki, not a pile of source files
- **Don't fixate on tooling** — Obsidian with 47 plugins = the Notion trap

"I'm trying to keep it super simple and flat. It's just a nested directory of .md files."  
— Andrej Karpathy

---

## 10. Quick Start in 5 Minutes

1. **Install Obsidian + Claude Code.** If you haven't yet.
2. **Create folders.** `mkdir -p raw/articles raw/papers raw/notes wiki/_templates outputs`
3. **Create CLAUDE.md.** Copy the template from section 5 or tell Claude Code: "Configure CLAUDE.md for an LLM Knowledge Base."
4. **Find an interesting article.** Save it into `raw/articles/` (Web Clipper, copy-paste, or via Claude Code).
5. **Run Ingest.** Tell Claude Code: "Process the new file in `raw/articles/[filename].md`."
6. **Open Obsidian.** Go to `wiki/`, read the new pages, check the graph view.
7. **Ask a question.** Ask something about the topic of the article. Save the valuable answer.
8. **Repeat.** Each cycle takes 2–5 minutes and makes the knowledge base richer.

---

## 11. FAQ

**Q: Can I use something other than Claude Code?**

A: Yes. Cursor, Codex, any LLM agent with file access. The pattern isn't tied to a specific tool.

**Q: What if the wiki gets too big for the LLM's context?**

A: At ~100 pages (~400,000 words) Karpathy says the LLM manages through `index.md` without RAG. Beyond that, add `qmd` for search.

**Q: How is this different from Notion/Obsidian with plugins?**

A: People abandon wikis because the bookkeeping (links, updates, consistency) takes more time than the value it produces. An LLM does that bookkeeping for free.

**Q: Do I need Obsidian?**

A: No. Any text editor works. Obsidian is handy for graph visualization and Dataview queries, but it's optional. Karpathy: "The AI doesn't care what app you open the files in."

**Q: Can this be used by a team?**

A: Yes. The wiki is just a git repo. You can collaborate, open PRs, create branches. The LLM updates the wiki from Slack, meetings, and calls.

**Q: What if the LLM makes a mistake?**

A: That's what Lint is for. Run the check once a month. Plus the wiki is in git — you can roll back any change.

---

## Start Today

Three folders, one schema file, and an LLM agent — that's the whole system.

41,000 people bookmarked Karpathy's post. The difference between a bookmark and actual value is one evening of setup.

*Pick a topic. Create the folders. Drop in what you already have. Let the LLM work.*

**Source:** gist.github.com/karpathy/442a6bf555914893e9891c11519de94f
