# Claude Managed Agents

A Practical Playbook

From concept to production in one day

Based on Anthropic's official documentation, engineering blog, and practical guides  
April 2026

Translation: Telegram channel @prompt_design  
April 9, 2026

---

## What Claude Managed Agents Is

If you're building agents on the Messages API, you know the pain: you have to write tool-call orchestration yourself, manage context, spin up sandboxes, handle errors, store secrets. That's months of engineering work before the agent does anything useful.

**Claude Managed Agents** is ready-made infrastructure from Anthropic where all of that is already done for you. You describe an agent (model, system prompt, tools), and Anthropic runs it in a managed cloud: secure containers, long-lived sessions, built-in code execution, event streaming.

Key difference from the Messages API:

|  | Messages API | Managed Agents |
|--|-------------|----------------|
| **What it is** | Direct model access | Ready-made agent platform with infrastructure |
| **For what** | Custom agent loops, full control | Long tasks, async work, fast launch |
| **Infrastructure** | You build it | Provided by Anthropic |

### Why you want this

Two main problems Managed Agents solves:

**1. Agent harnesses go stale.** Any self-written harness bakes in assumptions about what Claude *can't* do. Those assumptions get stale with every model update and become a bottleneck. Managed Agents updates the harness automatically — the agent always uses the latest Claude capabilities.

**2. Claude works longer and longer.** The task horizon is growing exponentially — on the METR benchmark, Claude already exceeds 10 person-hours of work. That pressures infrastructure: it has to be fault-tolerant, secure, and scalable. Anthropic expects future Claude versions to work for days, weeks, or months on the hardest tasks.

### Who's already using it

- **Notion** — agents inside the workspace for parallel task execution
- **Rakuten** — enterprise agents across departments, each launched in under a week
- **Asana** — AI Teammates working in Asana alongside humans
- **Sentry** — the Seer debugger finds a bug, the agent writes a patch and opens a PR
- **Vibecode** — Managed Agents as default infrastructure

### Status and access

Managed Agents is in open beta. All endpoints require the `managed-agents-2026-04-01` header (the SDK adds it automatically). Access is on by default for every account with an API key.

Individual features — Outcomes (completion criteria), Multiagent, and Memory — are in research preview; request access separately.

---

## Four Key Concepts

The entire system is built on four concepts. Understand them and you understand the platform.

### Agent — the agent configuration

A versioned configuration: model, system prompt, tools, MCP servers, skills. Create it once, reference it by ID. One agent can have any number of sessions.

Available models: `claude-sonnet-4-6`, `claude-opus-4-6`.

### Environment — the container template

A description of the sandbox where the agent's tools run: environment type, networking rules, preinstalled packages (Python, Node.js, Go, etc.). Each session gets an isolated container from this template.

### Session — a task execution

A running instance of the agent inside an environment. A session stores conversation history, filesystem, and status. Sessions can run for hours. You can attach files and GitHub repos at startup; secrets live in a secure vault.

### Events — message exchange

Messages between your application and the agent: you send user messages; the agent streams responses, tool calls, and status updates via Server-Sent Events (SSE). The full event history is fetchable at any time.

---

## Quick Start: Your First Agent in 10 Minutes

### Step 0: Install tools

**CLI (ant):**

```bash
# macOS
brew install anthropics/tap/ant

# Linux/WSL
VERSION=1.0.0
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m | sed -e 's/x86_64/amd64/' -e 's/aarch64/arm64/')
curl -fsSL \
  "https://github.com/anthropics/anthropic-cli/releases/\
download/v${VERSION}/ant_${VERSION}_${OS}_${ARCH}.tar.gz" \
  | sudo tar -xz -C /usr/local/bin ant
```

**SDK:**

```bash
# Python
pip install anthropic

# TypeScript
npm install @anthropic-ai/sdk
```

**API key:**

```bash
export ANTHROPIC_API_KEY="your-api-key-here"
```

**Fast path through Claude Code:**

```
claude update
claude
/claude-api managed-agents-onboarding
```

The built-in `claude-api` skill walks you through the full onboarding.

### Step 1: Create an agent

```python
from anthropic import Anthropic

client = Anthropic()

agent = client.beta.agents.create(
    name="Coding Assistant",
    model="claude-sonnet-4-6",
    system="You are a helpful coding assistant. "
           "Write clean, well-documented code.",
    tools=[{"type": "agent_toolset_20260401"}],
)
print(f"Agent ID: {agent.id}")
```

`agent_toolset_20260401` is the full bundle of built-in tools at once: bash, file read/write, web search, grep, glob. Save `agent.id`.

**Via CLI:**

```bash
ant beta:agents create \
  --name "Coding Assistant" \
  --model claude-sonnet-4-6 \
  --system "You are a helpful coding assistant." \
  --tool '{type: agent_toolset_20260401}'
```

**Via curl:**

```bash
curl -sS https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Coding Assistant",
    "model": "claude-sonnet-4-6",
    "tools": [{"type": "agent_toolset_20260401"}]
  }'
```

### Step 2: Create an environment

```python
environment = client.beta.environments.create(
    name="dev-env",
    config={
        "type": "cloud",
        "networking": {"type": "unrestricted"},
    },
)
print(f"Environment ID: {environment.id}")
```

Need specific packages? Add them to the config:

```json
{
  "type": "cloud",
  "networking": {"type": "unrestricted"},
  "packages": {"pip": ["pandas", "numpy"]}
}
```

### Step 3: Start a session

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="My first session",
)
print(f"Session ID: {session.id}")
```

### Step 4: Send a task and receive the result

```python
with client.beta.sessions.events.stream(session.id) as stream:
    client.beta.sessions.events.send(
        session.id,
        events=[{
            "type": "user.message",
            "content": [{
                "type": "text",
                "text": "Create a Python script that generates "
                        "the first 20 Fibonacci numbers "
                        "and saves them to fibonacci.txt",
            }],
        }],
    )

    for event in stream:
        match event.type:
            case "agent.message":
                for block in event.content:
                    print(block.text, end="")
            case "agent.tool_use":
                print(f"\n[Tool: {event.name}]")
            case "session.status_idle":
                print("\n\nDone.")
                break
```

What's happening under the hood:

1. A container is spun up from the environment template
2. Claude decides which tools to use
3. Tool calls execute inside the container
4. Results stream back to you in real time
5. When the task is done — the `session.status_idle` event fires

No Docker, no orchestration code, no tool execution layer.

---

## Built-in Tools

With `agent_toolset_20260401` attached, the agent gets access to the full set:

| Tool | Description |
|------|-------------|
| **bash** | Run shell commands in the container |
| **read** | Read files |
| **write** | Write files |
| **edit** | Replace strings in files |
| **glob** | Find files by pattern |
| **grep** | Search text with regex |
| **web_fetch** | Fetch content by URL |
| **web_search** | Search the web |

### Tool configuration

Disable specific tools:

```json
{
  "type": "agent_toolset_20260401",
  "configs": [
    {"name": "web_fetch", "enabled": false},
    {"name": "web_search", "enabled": false}
  ]
}
```

Enable only the ones you need (everything else off):

```json
{
  "type": "agent_toolset_20260401",
  "default_config": {"enabled": false},
  "configs": [
    {"name": "bash", "enabled": true},
    {"name": "read", "enabled": true},
    {"name": "write", "enabled": true}
  ]
}
```

### Custom tools

Beyond the built-ins, you can define your own tools. Claude emits a structured request, your code performs the operation, and the result comes back:

```python
agent = client.beta.agents.create(
    name="Weather Agent",
    model="claude-sonnet-4-6",
    tools=[
        {"type": "agent_toolset_20260401"},
        {
            "type": "custom",
            "name": "get_weather",
            "description": "Get current weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name",
                    }
                },
                "required": ["location"],
            },
        },
    ],
)
```

Recommendations for custom tools:

- **Detailed descriptions** are the most important factor. 3–4 sentences per tool: what it does, when to use it, its limits
- **Bundle related operations** into one tool with an `action` parameter
- **Namespace names** — `db_query`, `storage_read`
- **Return only the important info** — stable identifiers, not internal links

---

## Permissions

Managed Agents has two permission modes for tools:

**`always_allow`** — tools execute automatically. For trusted internal agents.

**`always_ask`** — the session pauses and waits for approval from your application before each call. For user-facing agents.

You can combine them: file reads and web search auto, bash with approval. MCP tools are `always_ask` by default.

This makes Managed Agents more production-ready than most open-source frameworks (LangGraph, CrewAI, AutoGen) — none of them provides tool permissions out of the box.

---

## Usage Patterns

### Event-triggered

An external service triggers the agent. The system detects a bug — the agent writes a patch and opens a PR. No human between detection and action. That's how Sentry works.

### Scheduled

The agent runs on a schedule. Typical example: daily digests — GitHub activity, team task review, an X (Twitter) summary.

### Fire-and-forget

A human files a task via Slack or Teams — gets back a result: a table, a presentation, an app. That's how Asana AI Teammates works.

### Long-horizon

Tasks running for hours. Research projects, large-scale code migrations, deep analysis. Sessions preserve state — files, history, context — across the run.

### Typical pairing: CLI for setup, SDK for runtime

Agent templates live as YAML in git (model, system prompt, tools, MCP servers). The CLI applies them in the deploy pipeline. The SDK runs sessions at runtime.

---

## Outcomes: Completion Criteria (research preview)

Outcomes turn a session from a conversation into a job. You define what the result should look like and by which criteria to grade quality. The agent works until it hits the goal, grading and iterating itself.

### How it works

When you set an outcome, the system creates a **grader** — a separate evaluation process running in its own context so it isn't biased by the main agent's decisions. The grader returns criterion-by-criterion scoring: what's done, what isn't. The feedback goes to the agent for the next iteration.

### The rubric

Structure the rubric as concrete, checkable criteria:

- Good: "CSV contains a price column with numeric values"
- Bad: "Data looks good"

Example rubric for a DCF model:

```
# DCF Model Rubric

## Revenue Projections
- Uses historical revenue data from the last 5 fiscal years
- Projects revenue for at least 5 years forward
- Growth rate assumptions are explicitly stated

## Output Quality
- All figures are in a single .xlsx file with labeled sheets
- Key assumptions are on a separate "Assumptions" sheet
- Sensitivity analysis on WACC and terminal growth rate
```

### Launch with an outcome

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    title="Financial analysis",
)

client.beta.sessions.events.send(
    session_id=session.id,
    events=[{
        "type": "user.define_outcome",
        "description": "Build a DCF model for Costco in .xlsx",
        "rubric": {"type": "text", "content": RUBRIC},
        "max_iterations": 5,  # default 3, max 20
    }],
)
```

The agent starts work immediately — no extra message needed.

### Grading outcomes

| Result | What happens next |
|--------|-------------------|
| `satisfied` | Session goes idle |
| `needs_revision` | Agent starts another cycle |
| `max_iterations_reached` | Final attempt, then idle |
| `failed` | Rubric doesn't fit the task |

The agent saves output files to `/mnt/session/outputs/` inside the container. Pull them via the Files API:

```python
files = client.beta.files.list(scope_id=session.id)
for f in files.data:
    print(f"{f.id}: {f.filename} ({f.size_bytes} bytes)")

content = client.beta.files.download(files.data[0].id)
content.write_to_file("costco_dcf.xlsx")
```

---

## Multiagent (research preview)

A single coordinator agent can delegate work to other agents. Each runs in its own thread with isolated context, but they all share one container and filesystem.

### When to delegate

- **Code review** — a separate agent with read-only tools
- **Test generation** — an agent that writes and runs tests without touching production code
- **Research** — an agent with web tools to collect and summarize information

### Setup

```python
orchestrator = client.beta.agents.create(
    name="Engineering Lead",
    model="claude-sonnet-4-6",
    system="You coordinate engineering work. "
           "Delegate code review to the reviewer "
           "and test writing to the test agent.",
    tools=[{"type": "agent_toolset_20260401"}],
    callable_agents=[
        {
            "type": "agent",
            "id": reviewer_agent.id,
            "version": reviewer_agent.version,
        },
        {
            "type": "agent",
            "id": test_writer_agent.id,
            "version": test_writer_agent.version,
        },
    ],
)
```

Limitation: only one level of delegation. The coordinator calls agents, but they can't call further agents.

### Threads

- **Main thread** — the coordinator's session stream with the big picture
- **Agent threads** — detailed events for each sub-agent

```python
# List threads
for thread in client.beta.sessions.threads.list(session.id):
    print(f"[{thread.agent_name}] {thread.status}")

# Stream a specific thread
with client.beta.sessions.threads.stream(
    thread.id, session_id=session.id,
) as stream:
    for event in stream:
        if event.type == "agent.message":
            for block in event.content:
                if block.type == "text":
                    print(block.text, end="")
```

Threads preserve context — you can send additional instructions to a thread that's already running.

---

## Architecture: How It Works Under the Hood

Anthropic's engineering team intentionally did not build a specific agent harness — they expect harnesses to keep evolving. Instead, the system splits into three independent components:

- **"Brain"** — Claude and its harness (agent loop, tool selection)
- **"Hands"** — sandboxes and the tools executing actions
- **"Session"** — an event log

Each component is an interface with minimal assumptions about the others. Each can fail or be replaced independently. This yields:

- **Reliability** — one component's failure doesn't kill the system
- **Security** — execution is isolated from context
- **Flexibility** — you can plug in new harnesses, sandboxes, and infrastructure

Built-in optimizations: prompt caching, compaction (context compression), automatic recovery from infrastructure failures.

---

## Cost

Standard Claude API token rates plus **$0.08 per active session hour.** For reference: a 10-minute coding-agent session costs a few cents for compute.

If you're on the Max plan ($100–200/mo) and use Claude Code, the built-in `claude-api` skill walks you through onboarding for free. But API usage under heavy load will add up noticeably — worth monitoring.

---

## Launch Checklist

1. Get an API key at console.anthropic.com
2. Install the CLI (ant) or the SDK (Python/TypeScript)
3. Export the key: `export ANTHROPIC_API_KEY="..."`
4. Create an agent (model + prompt + tools)
5. Create an environment (container + packages + networking)
6. Start a session and send a task
7. Handle the event stream in your application

Or: open Claude Code and say `start onboarding for managed agents in Claude API` — the built-in skill will walk you through it step by step.

Or: go to platform.claude.com and use the visual agent builder in the console.

---

## Limits

| Operation | Limit |
|-----------|-------|
| Resource creation (agents, sessions, environments) | 60 requests/min |
| Reads (get, list, streaming) | 600 requests/min |

Organization- and plan-level limits also apply.

---

## Sources

- Anthropic blog: Claude Managed Agents — claude.com/blog/claude-managed-agents
- Documentation: platform.claude.com/docs/en/managed-agents/overview
- Engineering blog: designing Claude Managed Agents
- Practical first-deploy guide (Return My Time)
