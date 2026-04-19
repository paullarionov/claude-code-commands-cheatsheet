# Why Your "AI-First" Strategy Is Probably Wrong

How we rebuilt an entire company around AI agents

CREAO, 25 employees, 99% of code written by AI

Translation: Telegram channel @prompt_design  
April 14, 2026

---

## 99% of Code Written by AI

Last Tuesday we shipped a new feature at 10 AM, ran an A/B test by noon, and killed it by 3 PM because the data said no. By 5 PM we shipped an improved version. Three months ago that cycle would have taken six weeks.

We didn't get there by adding Copilot to the IDE. We took the engineering process apart and rebuilt it around AI. We changed how we plan, build, test, deploy, and organize the team. We changed every person's role in the company.

CREAO is an agent platform. 25 employees, 10 engineers. We started building agents in November 2025, and two months ago I rebuilt the entire product architecture and engineering process from scratch.

In February 2026 OpenAI published a concept that described what we were already doing. They called it **harness engineering**: the engineering team's main job is no longer to write code. It's to give agents the ability to do useful work. When something breaks, the answer is never "try harder." The answer is: what capability is missing, and how do we make it legible and controllable to the agent?

We arrived at that conclusion independently. We just didn't have a name for it.

---

## AI-First Isn't "Use AI"

Most companies bolt AI onto an existing process. The engineer opens Cursor. The PM drafts specs in ChatGPT. QA experiments with AI test generation. The process stays the same. Efficiency goes up 10–20%. Structurally, nothing changes.

That's **AI-assisted**.

**AI-first** means: you redesign the process, architecture, and organization around the premise that AI is the primary builder. You stop asking "how can AI help our engineers?" and start asking "how do we rebuild everything so AI builds and engineers provide direction and judgment?"

The difference is multiplicative.

I see teams that call themselves AI-first but run the same sprints, the same Jira boards, the same weekly standups, the same QA sign-offs. They added AI to the loop. They didn't redesign the loop.

The typical version of this is what people call vibe coding. Open Cursor, prompt until something works, commit, repeat. That produces prototypes. A production system has to be stable, reliable, and secure. You need a system that guarantees those properties when AI writes the code. You build the system. The prompts are consumable.

---

## Why We Had to Change

Last year I looked at how the team worked and saw three bottlenecks that would kill us.

### Bottleneck: product management

Our PMs spent weeks researching, designing, and spec'ing features. Product management has worked this way for decades. But agents can implement a feature in two hours. When build time compresses from months to hours, a week-long planning cycle becomes the constraint.

It doesn't make sense to think about something for months and then build it in two hours.

PMs needed to evolve into product architects working at iteration speed, or step out of the build cycle. Design had to happen through fast "prototype — ship — test — iterate" loops, not through specs debated in committee.

### Bottleneck: QA

Same dynamic. After the agent shipped a feature, our QA team spent days testing edge cases. Build time: two hours. Test time: three days.

We replaced manual QA with AI-built testing platforms that test AI-written code. Validation has to move at the speed of implementation. Otherwise you've just created a new bottleneck three meters downstream from the old one.

### Bottleneck: headcount

Competitors had 100× or more people on comparable work. We have 25. We couldn't hire to parity. We had to design to parity.

Three systems needed AI inside them: how we design product, how we implement product, how we test product. If any one stays manual, it caps the whole pipeline.

---

## The Solution: a Unified Architecture

First we had to fix the codebase.

The old architecture was scattered across several independent systems. One change could require edits in three or four repositories. From an engineer's perspective, tolerable. From an AI agent's perspective, opaque. The agent can't see the full picture. Can't reason about cross-service consequences. Can't run integration tests locally.

I consolidated everything into a **single monorepo**. The reason is one thing: so AI can see everything.

That's harness engineering in practice. The more of your system you put in a form an agent can inspect, validate, and modify, the more leverage you have. A fragmented codebase is invisible to agents. A unified one is readable.

A week to design the new system: planning phase, implementation phase, testing phase, integration testing phase. Another week to rebuild the whole codebase with agents.

CREAO is an agent platform. We used our own agents to rebuild the platform that runs agents. If the product can build itself, it works.

---

## The Stack

### Infrastructure: AWS

AWS with container autoscaling and circuit-breaker rollback. If metrics degrade after deploy, the system rolls itself back.

CloudWatch is the central nervous system. Structured logging across every service, 25+ alerts, custom metrics that automated processes query daily. Every element of infrastructure emits structured, queryable signals. If AI can't read the logs, it can't diagnose the problem.

### CI/CD: GitHub Actions

Every code change goes through a six-phase pipeline:

**Verify CI → Build and Deploy Dev → Test Dev → Deploy Prod → Test Prod → Release**

The CI gate on every pull request checks types, linting, unit and integration tests, Docker builds, Playwright E2E tests, environment parity. None of the phases is optional. No manual overrides. The pipeline is deterministic — agents can predict outcomes and reason about failure causes.

### AI code review: Claude

Every pull request kicks off three parallel review passes via Claude Opus 4.6:

- **Pass 1: code quality.** Logic errors, performance issues, maintainability.
- **Pass 2: security.** Vulnerability scanning, auth boundary checks, injection risks.
- **Pass 3: dependencies.** Supply-chain risk, version conflicts, license issues.

These are review gates, not recommendations. They run in parallel with human review, catching what people miss at scale. When you deploy eight times a day, no human reviewer maintains attention on every PR.

Engineers also tag `@claude` in any GitHub issue or PR for implementation plans, debugging, or code analysis. The agent sees the whole monorepo. Context carries across conversations.

---

## The Self-Healing Feedback Loop

This is the central piece.

**Every morning at 9:00 UTC** an automated health-check process runs. Claude Sonnet 4.6 queries CloudWatch, analyzes error patterns across every service, and generates a summary for the team in Microsoft Teams. Nobody asked for this.

**An hour later the triage engine runs.** It clusters production errors from CloudWatch and Sentry, scores each cluster on nine severity parameters, and automatically creates investigation tickets in Linear. Each ticket includes sample logs, affected users, endpoints, and suggested investigation paths.

The system deduplicates. If an open ticket already covers the same error pattern, it updates it. If a previously closed ticket recurs, it detects a regression and reopens.

When an engineer pushes a fix, the same pipeline processes it. Three Claude passes review the PR. CI validates. The six-phase deploy progresses through dev and prod with testing at every stage. After deploy, the triage engine rechecks CloudWatch. If the original errors are resolved, the Linear ticket auto-closes.

Every tool owns one phase. No tool tries to do everything. The daily cycle creates a self-healing loop: errors are detected, prioritized, fixed, and verified with minimal manual intervention.

---

## Feature Flags and Supporting Stack

**Statsig** runs feature flags. Every feature ships behind a gate. The rollout pattern: enable for the team, then gradual percentage rollout, then full release or shutdown. The kill switch disables a feature instantly, no deploy required. If a feature hurts metrics, we pull it within hours. Bad features die the day they ship. A/B testing runs through the same system.

**Graphite** manages PR branching: merge queues rebase on main, rerun CI, merge only if green. Stacked PRs allow incremental review at high throughput.

**Sentry** reports structured exceptions across every service, joined with CloudWatch by the triage engine for cross-tool context.

**Linear** is the human layer: auto-created tickets with severity scores, sample logs, and suggested investigation. Deduplication prevents noise. Verification auto-closes resolved tickets.

---

## The Path of a Feature from Idea to Production

### New feature

1. An architect defines the task as a structured prompt with codebase context, goals, and constraints
2. The agent decomposes the task, plans implementation, writes code, and generates its own tests
3. A PR opens. Three Claude passes review it. A human checks strategic risk, not line-by-line correctness
4. CI validates: types, lint, unit tests, integration tests, E2E tests
5. Graphite's merge queue rebases, reruns CI, merges if green
6. The six-phase deploy progresses through dev and prod with testing at every stage
7. The feature gate opens for the team. Gradual rollout. Metric monitoring
8. Kill switch available if things degrade. Circuit-breaker auto-rollback for serious issues

### Bug fix

1. CloudWatch and Sentry detect errors
2. The Claude triage engine scores severity and creates a Linear ticket with full investigation context
3. An engineer investigates. AI has already diagnosed. The engineer validates and pushes a fix
4. Same pipeline for review, CI, deploy, and monitoring
5. The triage engine rechecks. If resolved, the ticket auto-closes

Both paths share one pipeline. One system. One standard.

---

## Results

Over 14 days we averaged 3–8 production deploys a day. Under the old model, that two-week window wouldn't have produced a single production release.

Bad features get pulled the same day. New features ship the day they're conceived. A/B tests validate impact in real time.

People assume we're trading quality for speed. User engagement went up. Checkout conversion went up. We ship better results than before because feedback loops got tighter. You learn more when you ship daily than monthly.

---

## The New Engineering Org

Two types of engineers will exist.

### Architect

One or two people. They design the standard operating procedures that teach AI how to work. Build test infrastructure, integration systems, triage systems. Define architecture and system boundaries. Define what "good" looks like to agents.

This role requires deep critical thinking. You critique AI. You don't follow it. When an agent proposes a plan, the architect looks for holes. What failure modes did it miss? What safety boundaries did it break? What tech debt is it accumulating?

I have a PhD in physics. The most useful thing grad school taught me was how to question assumptions and hunt for what's missing. The ability to critique AI will be more valuable than the ability to write code.

It's also the hardest role to hire for.

### Operator

Everyone else. The work matters. The shape is different.

AI assigns tasks to people. The triage system finds a bug, creates a ticket, produces diagnostics, and routes it to the right person. The human investigates, validates, and approves the fix. AI creates the PR. The human checks for risk.

Tasks include bug investigation, UI polish, CSS improvements, PR review, verification. They require skill and attention. They don't require the architectural thinking the old model required.

### Who adapts faster

I noticed a pattern I didn't expect. **Juniors adapted faster than seniors.**

Juniors with less traditional experience felt amplified. They had access to tools that multiplied their impact. They had no decade of habits to unlearn.

Seniors with strong traditional practice had the hardest time. Two months of their work could be done in an hour with AI. That's hard to accept after years building a rare skillset.

I'm not passing judgment. I'm describing what I observed. In this transition, adaptability matters more than accumulated skill.

---

## The Human Side

### Management collapsed

Two months ago I spent 60% of my time managing people. Priority sync. Meetings. Feedback. Coaching engineers.

Today: less than 10%.

The traditional CTO model says: expand the team's capabilities, train, delegate. But if the system needs only one or two architects, you have to do it yourself. I moved from managing to building. I write code from 9 AM to 3 AM most days. I design SOPs and system architecture. I maintain the harness.

More stressful. But I like building more than aligning.

### Fewer arguments, better relationships

My relationships with co-founders and engineers got better.

Before the transition, most team conversations were alignment meetings. Trade-off debates. Priority arguments. Disagreement on technical decisions. Those conversations are necessary in the traditional model. They're also exhausting.

Now I still talk to the team. We talk about different things. Not work topics. Casual conversations. We get along better because we stopped arguing about work the system now handles easily.

### The uncertainty is real

I won't pretend everyone's happy.

When I stopped talking to people every day, some felt uncertain. What does it mean that the CTO isn't talking to me? What's my value in the new world? Legitimate anxieties.

Some spend more time debating whether AI can do their job than doing the job. A transition creates anxiety. I don't have a clean answer.

There's a principle: we don't fire an engineer over a production bug. We improve the review process. Strengthen testing. Add guardrails. Same applies to AI. If AI makes a mistake, we build better validation, clearer constraints, stronger observability.

---

## Beyond Engineering

I see companies rolling out AI-first engineering and leaving everything else manual.

If engineering ships features in hours but marketing needs a week to announce, marketing becomes the bottleneck. If the product team still works on a monthly planning cycle, planning becomes the bottleneck.

At CREAO we extended AI-native operations to every function:

- **Release notes:** AI generates from changelogs and feature descriptions
- **Feature videos:** AI-generated motion graphics
- **Daily social posts:** AI orchestrates and auto-publishes
- **Health reports and analytics summaries:** AI generates from CloudWatch and production databases

Engineering, product, marketing, and growth all run in a single AI-native process. If one function runs at agent speed and another at human speed, human speed caps everything.

---

## What This Means

### For engineers

Your value shifts from producing code to quality of judgment. The ability to write code fast is worth less every month. The ability to evaluate, critique, and direct AI is worth more.

Product taste matters. Can you look at a generated UI and know it's wrong before a user tells you? Can you look at an architectural proposal and see the failure mode the agent missed?

I tell our 19-year-old interns: train critical thinking. Learn to evaluate arguments, find gaps, question assumptions. Learn what good design looks like. Those skills compound.

### For CTOs and founders

- If your PM process takes longer than the build, start there
- Build the testing harness before you scale agents. Fast AI without fast validation is fast-growing tech debt
- Start with one architect. One person builds the system and proves it works. Bring others in as operators after the system is running
- Extend AI-native operations to every function
- Expect resistance

### For the industry

OpenAI, Anthropic, and many independent teams have converged on the same principles: structured context, specialized agents, persistent memory, and execution loops. Harness engineering is becoming standard.

Model capability is the clock driving this. I attribute the whole shift at CREAO to the last two months. Opus 4.5 couldn't do what Opus 4.6 does. Next-generation models will accelerate this further.

I believe one-person companies will become common. If one architect with agents can do the work of 100 people, many companies won't need a second employee.

---

## We're at the Beginning

Most founders and engineers I talk to still work the old way. Some are thinking about the transition. Few have made it.

A reporter I know told me she'd spoken with about five people on the topic. She said we'd gone further than anyone: "I don't think anyone else has fully rebuilt their entire workflow the way you have."

The tools are available to any team. Nothing in our stack is proprietary.

The competitive edge is the decision to redesign everything around these tools and the willingness to pay the costs. The costs are real: employee uncertainty, a CTO working 18-hour days, seniors doubting their value, two weeks where the old system is already torn down and the new one isn't proven yet.

We took those costs. Two months later the numbers speak for themselves.

We're building an agent platform. We built it with agents.

---

## Sources

- CREAO (25 employees, agent platform)
- Harness engineering concept, OpenAI, February 2026
