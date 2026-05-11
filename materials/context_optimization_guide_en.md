# How to Manage Context When You Keep Hitting Token Limits

## A Practical Guide: How to Reduce Token Spending by 60-80% Without Losing Quality

**Based on 100+ sources and real-world use cases**

**May 2026**

---

## Table of Contents

### INTRODUCTION
1. Why the Model Gets Dumber and Slower

### CORE MATERIAL
2. Part 1: Measure First, Then Cut
3. Part 2: Stop Paying for "Always-On" Rules
4. Part 3: Don't Drag Around Your Life's History
5. Part 4: Stop Feeding the Model Mountains of Logs
6. Part 5: Delegate Grunt Work to the "Cheap Intern"
7. Part 6: When Tools Hurt More Than They Help
8. Part 7: Make the Model "Think" Only As Much As Needed
9. Part 8: Make the Model Remember, Not Reread
10. Part 9: When You Don't Need to Optimize Anything
11. Part 10: How to Tell When Something Goes Wrong

### FINALE
12. Final Thoughts
13. Join the Community

---

## Introduction: Why the Model Gets Dumber and Slower

You open Claude Code to fix a small bug in a React component. The first 15 minutes are perfect: the model quickly reads the code, offers precise solutions, writes tests.

But an hour in, something breaks. The model starts responding in 30 seconds instead of instantly. Instead of fixing one line, it rewrites the entire file. It forgets the project rules you explained at the start of the session. If you're on a paid subscription—you've hit a limit and have to wait for a reset. If you're using the API—you look at your bill and see $5 spent on a simple task.

Why does this happen? Because the model gets overwhelmed by the volume of information.

Every time you ask Claude Code to do something, it doesn't just send your question to the server. It sends your entire conversation history, all system rules, all connected tool schemas, and the results of every command it has executed. This "context tax" grows with every step.

When context balloons to 150,000 tokens, three things happen:

1. **The model loses focus.** It sees 150,000 words and tries to account for all of them. An important instruction like "use TypeScript" gets lost somewhere between Docker logs and a previous feature discussion.

2. **You pay for garbage.** Every token costs money or counts against your limit. If the model reads 5,000 lines of `npm test` logs to find one error on line 145, you're paying for 4,999 useless lines.

3. **Speed tanks.** The server needs time to read and process this massive amount of data.

This guide isn't about what commands to type in the terminal. It's about managing the model's attention: giving it exactly the information needed for the current task, and filtering out everything else.

**Result:** The model becomes smart again, works twice as fast, and your API bills or limit consumption drop by 60-80%.

---

## Part 1: Measure First, Then Cut

### Why You Need to Measure Context

You can't optimize what you can't see. Before deleting files or changing settings, you need to understand exactly where your tokens and money are leaking. Often the problem isn't what you think: maybe it's not long code, but some hidden plugin that sends the model megabytes of logs with every request.

### What Happens If You Act Blind

If you start deleting things randomly without measuring, you might delete useful project rules but leave a heavy tool enabled. The model becomes dumber (because it forgot the rules), but doesn't get faster. You'll waste time refactoring `CLAUDE.md`, but the real problem is that the model is reading `node_modules`.

### How to Fix It

Do an audit of your environment before you start working. You don't need fancy dashboards—just a couple of commands.

1. **Use `/context` and `/usage`.** These built-in commands show you how many tokens are loaded right now and what they're spent on. If you just opened the project and already have 20,000 tokens loaded—that's a red flag.

2. **Check file sizes.** A simple command like `wc -w CLAUDE.md` shows how many words are in your rules. If there are more than 300—time to trim.

3. **Hunt for hidden garbage.** Sometimes tool logs or caches generate giant files. Use `find . -name "*.log" -size +1M` to find and delete them before the model accidentally reads them.

### What Changes

You'll know exactly your "attention budget." You'll see that disabling one unnecessary integration saves more than deleting a paragraph of rules. Optimization becomes surgical, not random.

---

## Part 2: Stop Paying for "Always-On" Rules

### Why You Need a CLAUDE.md File

When starting a new project, you want the model to immediately understand how everything works here. You create a `CLAUDE.md` file and write everything there: architecture, tech stack, variable naming rules, how to run tests, how to deploy, who owns which modules.

The result is a 500-line document. It seems right—now the model knows everything.

### What Happens If You Leave It As Is

`CLAUDE.md` is "always-on" context. The model reads it with every request.

If you ask the model to rename a variable in one file, it first reads 500 lines about architecture, deployment, and test-writing rules. Then it renames the variable.

If you make 50 requests in a session, the model reads those 500 lines 50 times. You pay for this 50 times. Most importantly—because there are too many rules, the model starts ignoring them. It can't tell the difference between a critical rule "don't use `any` in TypeScript" and reference information "deployment happens via GitHub Actions."

### How to Fix It

Split information into two categories: rules and reference.

`CLAUDE.md` should contain only rules the model should apply to every line of code it writes. This is your "constitutional minimum."

Everything else—reference information, architectural decisions, deployment guides—should live in separate files (like `docs/`). When the model needs to know how to deploy, it will find and read `docs/deployment.md` by itself. It doesn't need to keep this in its head constantly.

**What should stay in CLAUDE.md:**
- Hard prohibitions (what absolutely can't be done)
- Basic tech stack (React 18, TypeScript, Tailwind)
- Code style (functional components, not classes)
- Error handling patterns

**What should be removed from CLAUDE.md:**
- Long code examples (keep only short patterns)
- Environment setup instructions (needed only once at startup)
- History of architectural decisions
- Lists of all available scripts (the model can check `package.json` itself)

### What Changes

Your `CLAUDE.md` shrinks from 500 to 100 lines. The model stops getting distracted by irrelevant information. When you ask it to write a component, it clearly remembers the TypeScript rule because it didn't get lost among deployment instructions. And you save thousands of tokens—or limit hits—on every request.

### Visual Example: Garbage in CLAUDE.md

Here's what a typical rules file looks like on day one. It seems useful, but 80% is actually poison for the model's attention.

**❌ How NOT to do it—toxic CLAUDE.md:**

```markdown
# Project Rules: E-commerce Store

## Contacts and Resources
Project Lead: john@company.com
Documentation: https://docs.company.com
Slack Channel: #e-commerce-team
Jira Board: https://jira.company.com/e-commerce

## Architecture
We use microservices. Frontend is React 18, Backend is Node.js. Database is PostgreSQL. 
Redis for caching. We migrated from Angular to React in 2023, so legacy/ still has old components. 
Don't touch them.

## How to Build
npm run build # Production build
npm run build:dev # Development build
npm run deploy:staging # Deploy to staging
npm run deploy:production # Deploy to production
npm run migrate # Run database migrations
npm run migrate:rollback # Rollback last migration

## Performance Optimization (Important!)
- Use Code splitting with React.lazy
- Optimize images via next/image
- Use memoization (React.memo) for heavy components
- Set up lazy loading for routes
- Analyze bundle size with webpack-bundle-analyzer

## Base Code Rules
- Use TypeScript
- Don't use `any`
- Name interfaces with `I` prefix (e.g., IUserService)
- Write tests with Jest
```

**Why this is bad:** The model reads this text every time you ask it to fix a typo in a button. It absolutely doesn't need John's email or the migration rollback command to change button color. The rule "don't use `any`" is buried at the end, and the model will ignore it 50% of the time, exhausted from reading about Angular migration.

**✅ How to do it right—clean CLAUDE.md:**

```markdown
# Core Rules
- Stack: React 18, TypeScript, Tailwind.
- Types: NEVER use `any`. Prefix interfaces with `I` (e.g., `IUser`).
- Components: Functional only. Use `React.memo` for lists.
- Testing: Jest. Every new component must have a `.test.tsx` file.

# Context Pointers
- Legacy code is in `legacy/`. Do not modify it unless explicitly asked.
- For architecture decisions, read `docs/architecture.md`.
- For deployment scripts, check `package.json`.
```

**Why this is good:** Only what affects code writing right now. No contacts, no command walls. If the model needs architecture info, it will go read the specified file.

---

## Part 3: Don't Drag Around Your Life's History

### Why You Need Conversation Context

When working with the model, it's important that it remembers what you discussed 10 minutes ago. You asked it to write a function, then add error handling, then write a test. The model remembers this whole context, creating a feeling of continuous dialogue with a smart colleague.

### What Happens If You Leave It As Is

The problem is that tasks change. Say the first hour you both debugged a complex auth bug together. You tried five different approaches, read dozens of files, checked logs. You fixed it.

Now you move to the next task—fix button styling in the cart. If you just continue the dialogue, the model drags all that auth garbage with it. While fixing the button, it still has tokens of auth logic, old logs, and failed bug-fix attempts in its "head."

It's like trying to solve a geometry problem while someone yells spelling rules in your ear. The model gets confused, suggests strange solutions, and response speed tanks because it's processing all this old history. Plus you're burning limits or money on tokens you don't need.

### How to Fix It

Build a habit of "closing phases." Once one logical task is complete (bug fixed, feature written, tests pass), clean the context.

Claude Code has a `/compact` command for this. It does something genius: instead of just deleting history, it asks the model itself to write a brief summary of what was done and the current state.

Instead of 50 messages with logs, errors, and attempts, context keeps one paragraph: "We fixed the auth bug by updating JWT token in `auth.ts`. Everything works, tests are green."

**When to compress context:**
- After tests successfully pass
- Before switching to a new feature
- When the model starts acting "dumb" and suggesting strange solutions
- When model responses take 15-20+ seconds
- When you see context is filled 50%+

### What Changes

You start each new task with a "clean slate," but the model doesn't forget the global context of what you're working on. Its answers become instant and precise again. You stop paying for the model to reread your old mistakes.

---

## Part 4: Stop Feeding the Model Mountains of Logs

### Why Logs Matter to the Model

For the model to fix errors, it needs to see what went wrong. It runs tests (`npm test`), compiles code (`npm run build`), or searches files (`grep`). Tools produce output, the model reads it, understands the problem.

### What Happens If You Leave It As Is

Most tools were built for humans to read, not neural networks.

When you run `npm test` on a large project, the tool might output 5,000 lines. There will be pretty progress bars, lists of all successful tests, warnings about old library versions, and somewhere at the very end—those 10 lines with the actual error.

A human just scrolls down and looks at the error. The model can't do this. It honestly reads all 5,000 lines. Spends your money, its "attention," and time. Worst of all—the error might get lost in this volume, and the model draws wrong conclusions.

The same happens with code search. If the model searches where a function is used and gets 10,000 lines from compiled files or `node_modules`, it drowns in garbage.

### How to Fix It

Never let the model read raw tool output. Always filter information before it enters context.

Instead of just running tests, teach the model (via `CLAUDE.md`) to run them so they only show errors.

If the model searches files, it should exclude dependency and compiled code folders.

If it builds the project, it needs only the last 20 lines of logs where the build failure reason usually is.

**Real-world examples:**
- Instead of "run tests" → "run tests and show only failures"
- Instead of "find all function mentions" → "find function mentions, excluding tests and node_modules, show only filenames"
- Instead of "show commit logs" → "show last 5 commits"

### What Changes

Tool information shrinks by 90-95%. The model gets only the concentrate: "One test failed on line 145, expected 200, got 500." That's all it needs. Problem-solving speed multiplies because the model doesn't hunt for a needle in a haystack.

### Visual Example: Mountains of Logs

You ask the model to fix a failing test. It runs `npm test` and gets output. Look what it sees.

**❌ How NOT to do it—raw tool output:**

```
> e-commerce-app@1.0.0 test
> jest

PASS src/components/Header.test.tsx (45ms)
PASS src/components/Footer.test.tsx (32ms)
PASS src/components/ProductCard.test.tsx (28ms)
PASS src/components/CartItem.test.tsx (35ms)
PASS src/components/UserMenu.test.tsx (42ms)
PASS src/utils/formatCurrency.test.ts (15ms)
PASS src/utils/calculateTax.test.ts (12ms)
PASS src/hooks/useCart.test.ts (25ms)
PASS src/hooks/useAuth.test.ts (30ms)
PASS src/api/products.test.ts (55ms)
PASS src/api/users.test.ts (48ms)
PASS src/store/cartSlice.test.ts (22ms)
PASS src/store/userSlice.test.ts (20ms)

FAIL src/components/CheckoutForm.test.tsx (2341ms)
● CheckoutForm › should submit order successfully
Expected status code 200, but received 500.
Server responded with: "Missing required field: zipCode"

45 | await userEvent.click(submitButton);
46 |
> 47 | expect(mockSubmit).toHaveBeenCalledWith(200);
   | ^
48 | });

at Object.<anonymous> (src/components/CheckoutForm.test.tsx:47:24)

PASS src/components/AddressInput.test.tsx (38ms)
PASS src/components/PaymentMethod.test.tsx (41ms)
PASS src/utils/validateEmail.test.ts (10ms)

Test Suites: 16 passed, 1 failed, 17 total
Tests: 84 passed, 1 failed, 85 total
Time: 12.543 s
```

**Why this is bad:** In a real project, there are 500 files, not 17. The model reads thousands of "PASS" lines before reaching the single error. This burns tokens, time, and attention. The model might just "give up" and draw wrong conclusions about what caused the error.

**✅ How to do it right—filtered output:**

```
FAIL src/components/CheckoutForm.test.tsx
● CheckoutForm › should submit order successfully
Expected status code 200, but received 500.
Server responded with: "Missing required field: zipCode"

at src/components/CheckoutForm.test.tsx:47:24

Test Summary: 1 failed out of 85 tests.
```

**Why this is good:** The model gets only the essentials. Error on line 47, missing `zipCode` field. Solution is obvious from second one. You saved 95% of tokens on this request.

---

## Part 5: Delegate Grunt Work to the "Cheap Intern"

### Why You Need All Project Files

Sometimes a task requires broad context. For example, write documentation for all API endpoints in the project. Or find why styles break on different pages. The model needs to read dozens of files to build the full picture.

### What Happens If You Leave It As Is

You ask Claude Code to analyze 50 files. It loads them all into context. This could take 100,000 tokens.

Claude Code (especially with a powerful model like Claude Sonnet or Opus) is an expensive and smart "senior developer." Making them read 50 files just to find a list of endpoints is like hiring a $200/hour architect to copy-paste data from one Excel sheet to another.

You pay huge money (or burn limits) for a simple data extraction task. Then all those files stay in context and slow down all future work.

### How to Fix It

Use the "cheap intern" approach (cheap worker).

You have access to faster, cheaper models (like Claude Haiku). This model costs pennies and works instantly. It can't architect complex systems, but it's perfect for "read these 50 files and extract all API endpoints."

Instead of loading all files into the main session, open a separate terminal tab. Run the "intern" (Haiku) there and give a simple instruction: "Read the `src/api` folder and make a brief summary of all routes into a file `api_summary.md`."

The intern does the dirty work, reads 100,000 tokens (costing pennies), and creates a compact file with needed data.

Then you return to your main "senior" (Sonnet) and say: "Read `api_summary.md` and write documentation based on it."

### What Changes

You isolate "noisy" work from the main session. Your main context stays clean and focused. You get the same result but pay 10 times less and don't clutter the main model's "brain" with unnecessary implementation details from 50 files.

### Visual Example: Delegating to the "Cheap Intern"

You need to compile a list of all routes (endpoints) in an old project to write documentation for them.

**❌ How NOT to do it—loading the "senior":**

You open the main Claude Code session (where the expensive, smart Claude Sonnet model runs) and write:

"Read all files in `src/pages` and `src/api` and list all available URLs."

The model obediently opens file after file:
- Opens `src/pages/Home.tsx` (reads 500 lines of markup to find one URL `/home`)
- Opens `src/pages/Profile.tsx` (reads 800 lines of profile logic to find `/profile`)
- Opens `src/api/orders.ts` (reads 1,000 lines of SQL queries to find `/api/orders`)

It spends 150,000 tokens reading business logic, styles, and SQL it doesn't need at all. You pay several dollars for this. Worst—all those styles and SQL queries now permanently stay in context. When you ask it to write a new component, it might accidentally use an old SQL snippet because it's "stuck" in its memory.

**Important distinction: cheap coworker vs subagent**

Don't confuse delegating to a cheap model with using subagents.

"Cheap coworker" is when you ask a fast model (like Haiku) to read lots of text and make a summary. You save money from the price difference between models.

A subagent is when you assign a separate, isolated process to do dirty work (like "find why tests fail in this module"). The subagent works in its own context. It can read 50 files, make mistakes, reread logs, but only the final answer returns to your main context: "Problem on line 42, here's the patch."

Subagents isolate garbage. They don't always save money (sometimes they spend more tokens thinking), but they protect your main agent's attention. Your main context stays crystal clean.

**✅ How to do it right—use the "intern":**

You open a neighboring terminal window. Launch the cheap, fast model there (like Claude Haiku).

"Quickly scan the `src/` folder, find all lines mentioning URLs or routes, save them as a list in `routes_summary.md`. Ignore the actual file logic."

Haiku flies through files in seconds. Costs you 5 cents. A neat `routes_summary.md` file appears in the project root:

```markdown
# Found Routes
- `/home` (src/pages/Home.tsx)
- `/profile` (src/pages/Profile.tsx)
- `/api/orders` (src/api/orders.ts)
```

Then you return to your main window with the smart "senior" (Sonnet) and say: "Read `routes_summary.md` and write beautiful documentation in OpenAPI format."

**Why this is good:** Your main session stays crystal clean. The smart model didn't see dirty old code, it only saw a clean routes list and perfectly executed its architectural task.

---

## Part 6: When Tools Hurt More Than They Help

### Why You Need Integrations (MCP and Hooks)

Modern AI assistants can connect to external systems. They can read your GitHub, check Jira, watch Sentry stats, or call internal company APIs. This is called MCP (Model Context Protocol).

It seems logical to connect everything. More tools = smarter model, right?

### What Happens If You Leave It As Is

Every connected tool is an instruction the model must keep in mind. "You have a Jira tool. To use it, send a task ID. It returns status and description."

With 10 tools connected, the model constantly spends part of its attention remembering how to use them. Even if you're just asking it to fix CSS button styling.

Worse—sometimes tools work "in the background" (called hooks). For example, every request might automatically attach current git branch info or latest file changes. This adds hidden garbage to every request. The model gets confused: "Why did I get git diff when I just asked to rename a variable?"

### How to Fix It

Treat the model's tools like phone apps: delete everything you don't use daily.

If you're not working with Jira this session—disable it. If you don't need the model making its own commits—disable git integration.

Keep only basics: file reading, terminal command execution, code editing. Enable complex tools (analytics, databases, task trackers) only when the task directly requires them.

### What Changes

The model stops hallucinating and trying to use tools where they're not needed. Its instructions get shorter, so it focuses better on the actual code. You stop paying for "tool usage schemas" you don't need right now.

---

## Part 7: Make the Model "Think" Only As Much As Needed

### Why Thinking Levels Matter

Sometimes a task looks simple but needs deep analysis. For example, "why does this component render twice?" To answer, the model needs to trace call chains, understand React lifecycle, and find non-obvious dependencies.

For such cases, models learned to "think" before answering (reasoning effort). They generate hidden thinking tokens, analyze options, then deliver the result.

### What Happens If You Leave It As Is

If you enable maximum thinking for all tasks, the model starts philosophizing where it should just act.

You ask: "Rename function `getUser` to `fetchUser`."

High-thinking model starts: "So the user wants to rename a function. Why? Maybe it's about network patterns. If I rename it here, will it break elsewhere? Let me analyze all files..."

Instead of 2 seconds and 1 cent, you wait 20 seconds and pay 10 cents for a simple find-and-replace.

But if you disable thinking entirely, the model makes mistakes on complex tasks, trying to answer without analysis.

### How to Fix It

Control thinking level based on task type. Like with people: you don't ask an architect to plan 5-year strategy when you just need to install a lightbulb.

For 80% of daily tasks (write test, add button, fix typo), the model doesn't need to "think" deeply. It already knows patterns.

Enable "deep thinking" only for:
- Designing new feature architecture
- Can't find the reason for a flaky bug
- Need a security code review
- Complex refactoring with many dependencies

### What Changes

You find balance between speed, cost, and quality. Simple tasks solve instantly and cheaply. Complex tasks solve thoughtfully and correctly, without careless mistakes.

---

## Part 8: Make the Model Remember, Not Reread

### Why Caching Matters

Every time you send a request, the model rereads your system rules, tool schemas, and basic context. And you pay each time.

If your basic context (rules + tools + project structure) weighs 10,000 tokens, then over 50 requests daily, the model rereads 500,000 tokens of just basic info. Not only is it expensive—it's slow. Reading 10,000 tokens each time takes server processing. Your requests lag, even for simple things.

### How to Fix It

Modern models support Prompt Caching technology. The idea is simple: if part of your request doesn't change, the server saves it to fast memory. Next time it doesn't reread it, just pulls from memory. This costs 90% less and works many times faster.

But for this magic to work, you need to structure information correctly.

The server only caches if information is at the very start of the request and absolutely unchanging. As soon as the server sees changed text, it stops caching everything after that.

**How to break caching (what NOT to do):**

You put the current task ("fix bug in cart") at the start and system rules at the end. Since the task changes every time, the server sees changes at the very start and rereads everything. Cache doesn't work.

**How to fix caching (what to do):**

Always put the most stable information first:
1. System rules (never change)
2. Tool schemas (never change)
3. Project architecture (rarely changes)
4. Current task, error logs, conversation history (constantly change)

### What Changes

Once you structure context right, the magic works. Your API bills drop because you pay 10% of the cost for reading the stable part. And model responses become nearly instant because the server only needs to read the last few paragraphs of your request.

### Visual Example: Right Caching

The server tries to understand what can come from cache to avoid rereading.

**❌ How NOT to do it—cache breaks:**

```
[DYNAMIC PART—CHANGES EVERY TIME]
Current time: 14:35:22
Current task: Add indents to site header.
Last error: TypeError: Cannot read properties of undefined

[STABLE PART—NEVER CHANGES]
System instructions: You are a React expert...
Project rules: Use Tailwind, don't use inline-styles...
Available tools: [File tool schema], [Bash tool schema]...
```

**Why bad:** Server reads top-down. First lines show new time and task. Server thinks "Aha, text changed!" and honestly reads everything to the end, including huge tool schemas and rules. Caching failed.

**✅ How to do it right—cache works:**

```
[STABLE PART—NEVER CHANGES]
System instructions: You are a React expert...
Project rules: Use Tailwind, don't use inline-styles...
Available tools: [File tool schema], [Bash tool schema]...

[DYNAMIC PART—CHANGES EVERY TIME]
Current time: 14:35:22
Current task: Add indents to site header.
Last error: TypeError: Cannot read properties of undefined
```

**Why good:** Server starts reading. Sees system instructions and tool schemas. "Oh, I've seen this 5 minutes ago!" Server instantly pulls these 10,000 tokens from cache (costing pennies). Only reaching the end does it see the new task. Just 50 new tokens to read. Result—instant and cheap response.

---

## Part 9: When You Don't Need to Optimize Anything

### Why Quit Optimizing Sometimes

This entire guide tells you to trim, filter, and compress info. Seems like you should do this always. But chasing token savings can lose what matters—solution quality.

### What Happens If You Optimize Everything

Say your production server crashes. Customers can't pay. Every minute costs the company thousands.

You open Claude Code to find the cause. But strict optimization rules mean the model doesn't see full server logs, only filtered errors. It doesn't see database change history because you disabled that tool. It can't find the non-obvious link between a recent commit and the database crash because you compressed context.

You saved 50 cents on tokens but lost hours of debugging because the model was "blind."

### When to Stop Optimizing

Context optimization is a tool for everyday routine. For the 80% of tasks that are clear, predictable, and low-risk.

But there are times to "turn dials to max" and give the model absolutely everything.

**Scenarios where you should disable filters and give full context:**

1. **Production incidents.** When everything burns, you need a smart partner with the full picture. Load full logs, enable all analytics tools, give access to all commit history. Token cost doesn't matter.

2. **Security reviews.** If you ask the model to find vulnerabilities in auth code, it needs to see the full data flow. A filtered log might hide the exact detail hackers exploit.

3. **Designing new architecture.** When laying foundation for years ahead, the model needs to understand business logic, scaling plans, old system limits. "Noise" might be important context.

### What Changes

You stop treating optimization like religion. It's just a tool for budget and focus management. You learn to switch modes: from "frugal intern for routine" to "expensive architect with full access" for critical tasks.

---

## Part 10: How to Tell When Something Goes Wrong

Even if you do everything right, sometimes the system acts weird. Here's how to spot symptoms and treat them.

### Symptom 1: Model Suddenly Writing Bad Code

**How it looks:** Yesterday the model wrote perfect React components, today it suggests old approaches, forgets typing, ignores notes.

**Real problem:** You over-compressed. The model forgot important nuances from long discussions because compression made them seem "minor details."

**Treatment:** Go back a step. Add to `CLAUDE.md` those conclusions the model keeps forgetting. If it's task-specific—just describe it again in the current request.

### Symptom 2: Responses Started Taking a Minute

**How it looks:** You ask to add a console log, the model "thinks" for 60 seconds.

**Real problem:** Your caching broke, or you accidentally fed the model a huge file.

**Treatment:** Check if dynamic text snuck into the request start (like a timestamp in system prompt). Check if some tool output a giant log the model is now trying to digest.

### Symptom 3: Model Goes in Circles

**How it looks:** Model suggests a solution. Doesn't work. Apologizes, suggests another. Also doesn't work. Apologizes and suggests the first one again.

**Real problem:** Context is flooded with failed attempts. The model sees so many errors it can't build clean logic anymore.

**Treatment:** Stop immediately. Do hard compression or start fresh. Describe the problem from scratch, with only current code state and the latest error.

### Symptom 4: Model Tries Using Non-Existent Tools

**How it looks:** Model writes "now I'll check the database" even though it has no database access.

**Real problem:** You left tool usage instructions in system prompt or `CLAUDE.md` but disabled the tools.

**Treatment:** Sync `CLAUDE.md` with the real set of enabled tools. If a tool is off—remove all mentions from rules.

### Symptom 5: Model Started Writing, Then You Realize You Forgot to Say Something

**How it looks:** You press Enter, model starts generating, then you realize "Wait, I didn't tell it about the new API!"

**Why dangerous:** If you wait for the answer to finish, the wrong code gets logged to history plus your correction. Context doubles for nothing.

**Treatment:** Stop the model immediately. In Claude Code, use Esc (or Esc+Esc) to interrupt. Even better—use `/rewind` to roll back one step, as if the bad request never happened. This erases garbage from history before it sticks. For quick questions that shouldn't be in history at all (like "how does this function work?"), use `/btw`.

---

## Final Thoughts

Working with an AI assistant isn't the same as coding or Googling solutions. It's like managing a very smart employee who distracts easily.

Your main job as a developer isn't remembering JavaScript array method syntax anymore. Your job is managing context.

Whoever learns to clearly state tasks, cut noise, filter logs, and clean history on time gets an tireless partner who writes code at the speed of thought.

Whoever just dumps mountains of unreadable logs into the chat and hopes "AI figures it out" will burn company budgets and get slow, confused, broken code in return.

The choice is yours. Start cleaning your `CLAUDE.md` right now.

---

## Conclusion

This guide provides practical strategies for managing context and optimizing token usage with Claude Code. By applying these techniques, you can significantly reduce costs while maintaining code quality and model performance.

Remember: the key to working effectively with AI is not about using fancy tricks, but about being intentional with what you ask the model to process. Master context management, and you'll unlock the full potential of AI-assisted development.
