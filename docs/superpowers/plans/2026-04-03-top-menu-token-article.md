# Top Menu & Token Usage Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a sticky top navigation menu (Main | Articles dropdown | Contact) to all pages and create a new SEO article on 13 token optimization strategies.

**Architecture:** Navigation markup and styles are added to each HTML file's `<body>` as a `<nav>` element before existing content. Styles use CSS variables matching existing site theme. The token usage article follows the same structure as best-practices.html and hidden-features.html.

**Tech Stack:** Plain HTML, CSS (no frameworks), vanilla JavaScript for dropdown keyboard accessibility.

---

## File Structure

| File | Action | Responsibility |
|------|--------|-----------------|
| index.html | Modify | Add `<nav>` element and nav styles |
| best-practices.html | Modify | Add `<nav>` element and nav styles |
| hidden-features.html | Modify | Add `<nav>` element and nav styles |
| token-usage.html | Create | New article with 13 optimization strategies |
| sitemap.xml | Modify | Add token-usage.html to sitemap |

---

## Task 1: Add Navigation Styles to index.html

**Files:**
- Modify: `index.html` (add nav styles to `<style>` block)

- [ ] **Step 1: Open index.html and locate the closing `</style>` tag**

Read the file to find where `</style>` is located (around line 100-150).

- [ ] **Step 2: Add navigation CSS before the closing `</style>` tag**

Insert this CSS block before `</style>`:

```css
/* Navigation Bar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: var(--surface);
  border-bottom: 1px solid var(--accent);
  z-index: 1000;
  padding: 0;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
}

.logo {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
  margin-right: 40px;
}

.nav-menu {
  list-style: none;
  display: flex;
  gap: 30px;
  margin: 0;
  padding: 0;
  align-items: center;
}

.nav-menu a {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-menu a:hover {
  color: var(--accent);
}

.dropdown {
  position: relative;
}

.dropdown-toggle {
  cursor: pointer;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 4px;
  list-style: none;
  margin: 8px 0 0 0;
  padding: 8px 0;
  min-width: 200px;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu li a {
  display: block;
  padding: 8px 16px;
  color: var(--text);
}

.dropdown-menu li a:hover {
  background: rgba(201, 100, 66, 0.1);
  color: var(--accent);
}

/* Adjust body padding for fixed navbar */
body {
  padding-top: 50px;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .nav-menu {
    gap: 15px;
  }

  .logo {
    margin-right: 20px;
    font-size: 14px;
  }

  .nav-container {
    padding: 10px 16px;
  }

  .dropdown-menu {
    min-width: 150px;
  }

  .dropdown-menu li a {
    padding: 6px 12px;
    font-size: 14px;
  }
}
```

- [ ] **Step 3: Verify styles are added**

The CSS block should be inserted before the closing `</style>` tag. Check that the indentation matches the rest of the style block.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add navigation bar styles to index"
```

---

## Task 2: Add Navigation HTML to index.html

**Files:**
- Modify: `index.html` (add nav markup at start of `<body>`)

- [ ] **Step 1: Open index.html and locate the opening `<body>` tag**

Find the line with `<body>`.

- [ ] **Step 2: Add navigation HTML immediately after `<body>`**

Insert this markup right after the opening `<body>` tag (before any existing content):

```html
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="logo">Claude Code Cheatsheet</a>
      <ul class="nav-menu">
        <li><a href="index.html">Main</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle">Articles</a>
          <ul class="dropdown-menu">
            <li><a href="best-practices.html">Best Practices</a></li>
            <li><a href="hidden-features.html">Hidden Features</a></li>
            <li><a href="token-usage.html">Reduce Token Usage</a></li>
          </ul>
        </li>
        <li><a href="https://www.linkedin.com/in/paullarionov/" target="_blank">Contact</a></li>
      </ul>
    </div>
  </nav>
```

*Note: Update the LinkedIn URL to match your actual profile.*

- [ ] **Step 3: Verify navigation appears at top**

Open index.html in a browser and confirm the navigation bar appears at the top with Main | Articles | Contact visible.

- [ ] **Step 4: Test dropdown hover**

Hover over "Articles" and verify the dropdown shows the three article links.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add navigation markup to index.html"
```

---

## Task 3: Add Navigation to best-practices.html

**Files:**
- Modify: `best-practices.html`

- [ ] **Step 1: Copy navigation styles from index.html**

From index.html's `<style>` block, copy the entire "Navigation Bar" CSS section (all the nav, navbar, dropdown styles). Paste it into best-practices.html's `<style>` block before the closing `</style>` tag.

- [ ] **Step 2: Add navigation HTML to best-practices.html**

Immediately after the opening `<body>` tag, add this same markup:

```html
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="logo">Claude Code Cheatsheet</a>
      <ul class="nav-menu">
        <li><a href="index.html">Main</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle">Articles</a>
          <ul class="dropdown-menu">
            <li><a href="best-practices.html">Best Practices</a></li>
            <li><a href="hidden-features.html">Hidden Features</a></li>
            <li><a href="token-usage.html">Reduce Token Usage</a></li>
          </ul>
        </li>
        <li><a href="https://www.linkedin.com/in/paullarionov/" target="_blank">Contact</a></li>
      </ul>
    </div>
  </nav>
```

- [ ] **Step 3: Verify navigation appears**

Open best-practices.html in browser and confirm nav bar is at top, dropdown works.

- [ ] **Step 4: Commit**

```bash
git add best-practices.html
git commit -m "feat: add navigation to best-practices article"
```

---

## Task 4: Add Navigation to hidden-features.html

**Files:**
- Modify: `hidden-features.html`

- [ ] **Step 1: Copy navigation styles**

Copy the nav CSS from best-practices.html (or index.html) and paste into hidden-features.html's `<style>` block before closing tag.

- [ ] **Step 2: Add navigation HTML**

Immediately after opening `<body>` tag, add:

```html
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="logo">Claude Code Cheatsheet</a>
      <ul class="nav-menu">
        <li><a href="index.html">Main</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle">Articles</a>
          <ul class="dropdown-menu">
            <li><a href="best-practices.html">Best Practices</a></li>
            <li><a href="hidden-features.html">Hidden Features</a></li>
            <li><a href="token-usage.html">Reduce Token Usage</a></li>
          </ul>
        </li>
        <li><a href="https://www.linkedin.com/in/paullarionov/" target="_blank">Contact</a></li>
      </ul>
    </div>
  </nav>
```

- [ ] **Step 3: Verify navigation**

Open hidden-features.html in browser, test dropdown.

- [ ] **Step 4: Commit**

```bash
git add hidden-features.html
git commit -m "feat: add navigation to hidden-features article"
```

---

## Task 5: Create token-usage.html Article

**Files:**
- Create: `token-usage.html`

- [ ] **Step 1: Create token-usage.html with complete HTML structure**

Create a new file at `/token-usage.html` with this content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Master token efficiency with 13 proven strategies to stretch your Claude usage limits further. Learn how to edit instead of append, cycle chats, batch directives, and more.">
  <meta name="keywords" content="claude token usage, reduce token costs, token limits, usage caps, claude pro, token optimization">
  <meta property="og:title" content="How to Reduce Claude Token Usage – 13 Proven Strategies">
  <meta property="og:description" content="13 practical strategies to optimize Claude token usage and avoid hitting limits.">
  <meta property="og:url" content="https://claude-guides.com/token-usage.html">
  <title>How to Reduce Claude Token Usage and Avoid Hitting Limits – 13 Proven Strategies</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/ico" href="favicon.ico">
  <style>
    :root {
      --bg: #FAF8F5;
      --surface: #FFFFFF;
      --text: #2C2C2C;
      --accent: #C96442;
      --subtle: #E8E5E0;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    html, body {
      height: 100%;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      line-height: 1.6;
      font-size: 16px;
      padding-top: 50px;
    }

    a {
      color: var(--accent);
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }

    /* Navigation Bar */
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--accent);
      z-index: 1000;
      padding: 0;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
    }

    .logo {
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      margin-right: 40px;
    }

    .nav-menu {
      list-style: none;
      display: flex;
      gap: 30px;
      margin: 0;
      padding: 0;
      align-items: center;
    }

    .nav-menu a {
      color: var(--text);
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .nav-menu a:hover {
      color: var(--accent);
    }

    .dropdown {
      position: relative;
    }

    .dropdown-toggle {
      cursor: pointer;
    }

    .dropdown-menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      background: var(--surface);
      border: 1px solid var(--accent);
      border-radius: 4px;
      list-style: none;
      margin: 8px 0 0 0;
      padding: 8px 0;
      min-width: 200px;
    }

    .dropdown:hover .dropdown-menu {
      display: block;
    }

    .dropdown-menu li a {
      display: block;
      padding: 8px 16px;
      color: var(--text);
    }

    .dropdown-menu li a:hover {
      background: rgba(201, 100, 66, 0.1);
      color: var(--accent);
    }

    /* Article Layout */
    .back-link {
      display: inline-block;
      margin: 20px auto;
      max-width: 800px;
      padding: 0 20px;
      font-size: 14px;
    }

    main {
      margin: 0 auto;
      max-width: 800px;
      padding: 20px;
    }

    header {
      margin-bottom: 40px;
    }

    h1 {
      font-size: 32px;
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1.2;
    }

    header > p {
      font-size: 18px;
      color: #666;
      margin-bottom: 8px;
    }

    article h2 {
      font-size: 24px;
      font-weight: 600;
      margin-top: 32px;
      margin-bottom: 16px;
    }

    article h3 {
      font-size: 18px;
      font-weight: 600;
      margin-top: 20px;
      margin-bottom: 12px;
    }

    article p {
      margin-bottom: 16px;
      line-height: 1.7;
    }

    article ul, article ol {
      margin: 16px 0 16px 20px;
    }

    article li {
      margin-bottom: 8px;
      line-height: 1.6;
    }

    code {
      background: var(--subtle);
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }

    pre {
      background: var(--subtle);
      padding: 16px;
      border-radius: 4px;
      overflow-x: auto;
      margin: 16px 0;
    }

    pre code {
      background: none;
      padding: 0;
    }

    .tip {
      background: rgba(201, 100, 66, 0.05);
      border-left: 4px solid var(--accent);
      padding: 12px 16px;
      margin: 20px 0;
      border-radius: 2px;
    }

    .tip strong {
      color: var(--accent);
    }

    footer {
      text-align: center;
      padding: 40px 20px;
      color: #999;
      font-size: 14px;
      max-width: 800px;
      margin: 0 auto;
    }

    footer a {
      color: var(--accent);
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      body {
        font-size: 15px;
      }

      h1 {
        font-size: 24px;
      }

      article h2 {
        font-size: 20px;
        margin-top: 24px;
      }

      .nav-menu {
        gap: 15px;
      }

      .logo {
        margin-right: 20px;
        font-size: 14px;
      }

      .nav-container {
        padding: 10px 16px;
      }

      .dropdown-menu {
        min-width: 150px;
      }

      .dropdown-menu li a {
        padding: 6px 12px;
        font-size: 14px;
      }
    }
  </style>
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="index.html" class="logo">Claude Code Cheatsheet</a>
      <ul class="nav-menu">
        <li><a href="index.html">Main</a></li>
        <li class="dropdown">
          <a href="#" class="dropdown-toggle">Articles</a>
          <ul class="dropdown-menu">
            <li><a href="best-practices.html">Best Practices</a></li>
            <li><a href="hidden-features.html">Hidden Features</a></li>
            <li><a href="token-usage.html">Reduce Token Usage</a></li>
          </ul>
        </li>
        <li><a href="https://www.linkedin.com/in/paullarionov/" target="_blank">Contact</a></li>
      </ul>
    </div>
  </nav>

  <a href="index.html" class="back-link">← Back to Cheatsheet</a>

  <main>
    <header>
      <h1>How to Reduce Claude Token Usage and Avoid Hitting Limits</h1>
      <p>Master token efficiency with 13 proven strategies to stretch your Claude usage limits further.</p>
    </header>

    <article>
      <h2>1. Edit, Don't Append</h2>
      <p>By message 30, you are paying 31x the cost of message 1. This exponential cost explosion happens because Claude re-reads the entire chat history with every new message, causing token costs to compound exponentially.</p>
      <p>Instead of sending "No, fix this" follow-ups that force reprocessing of all previous messages, click "Edit" on your original prompt, refine your instructions, and regenerate. This overwrites the error without accumulating history.</p>
      <div class="tip"><strong>💡 Pro Tip:</strong> Save up to 30x on token costs for corrections by editing instead of appending new messages.</div>

      <h2>2. Cycle Chats at 15 Messages</h2>
      <p>In long threads, up to 98% of your token budget is burned simply re-reading the past. Each new message forces the model to reprocess all prior context.</p>
      <p>Start a fresh chat every 15–20 messages. When a conversation gets heavy, ask the model to generate a comprehensive summary of the progress, open a new chat, and paste that summary as your foundational context. This reduces wasted tokens on history while keeping you oriented.</p>
      <div class="tip"><strong>💡 Pro Tip:</strong> A 40-message thread costs roughly 2.7x more than the same work split across three 15-message chats.</div>

      <h2>3. Batch Your Directives</h2>
      <p>Splitting tasks across multiple messages forces redundant context loads. Each message requires the model to reload your full context window.</p>
      <p>Consolidate your requests: "Summarize the text, list the main points, and write a headline" in one prompt equals one context load instead of three. The model also produces better results when it sees your full strategic picture upfront.</p>

      <h2>4. Cache Documents via Projects</h2>
      <p>Re-uploading the same PDF or document to different chats forces the model to re-tokenize that data every single time, wasting tokens.</p>
      <p>Leverage the Projects feature. Upload foundational documents once and reference them indefinitely without repeated token burn. This is especially powerful for long, static reference materials.</p>

      <h2>5. Bake in Your System Prompts</h2>
      <p>Typing "Act as a marketer" or "Keep paragraphs short" every time is repetitive waste across chats.</p>
      <p>Save your baseline instructions in Settings → Memory and User Settings so they apply automatically at zero recurring cost. This keeps your workflows consistent without token overhead.</p>

      <h2>6. Disable Background Tools</h2>
      <p>Web Search and Advanced Thinking inject significant token overhead into every response, even when you don't need them.</p>
      <p>Keep them off by default. Only enable them when the task genuinely requires external data or deeper reasoning. This is a simple toggle with major savings potential.</p>

      <h2>7. Right-Size Your Models</h2>
      <p>Using powerful models for simple tasks burns budget fast. Claude comes in three tiers with different token costs.</p>
      <ul>
        <li><strong>Haiku:</strong> Use for fast, lightweight work (queries, summaries, simple edits)</li>
        <li><strong>Sonnet:</strong> Use for most tasks (coding, analysis, detailed writing)</li>
        <li><strong>Opus:</strong> Use only when deep reasoning is required (complex architecture, novel problem-solving)</li>
      </ul>
      <p><strong>Pro tip:</strong> Sonnet 4.6 is the best default on Pro. Opus can burn roughly twice as fast, so switch models deliberately at the start of a session.</p>

      <h2>8. Control Reasoning Effort</h2>
      <p>Not every task needs deep thinking. Advanced reasoning features are powerful but token-intensive.</p>
      <p>Lower the effort level or disable extended thinking when the task is straightforward. Set this at the start of your session to avoid unnecessary token burn on routine work.</p>

      <h2>9. Start Fresh After Idle Time</h2>
      <p>Long idle sessions still carry heavy context. If a chat has been sitting for around an hour, resuming it still processes all prior messages.</p>
      <p>Start a new chat instead of resuming. You avoid dragging unnecessary history forward while keeping your working context lean.</p>

      <h2>10. Cap Your Context Window</h2>
      <p>Long sessions silently expand your token usage. You can limit how much context is carried forward.</p>
      <p>Set a context window cap when possible. For example:</p>
      <pre><code>CLAUDE_CODE_AUTO_COMPACT_WINDOW=200000</code></pre>
      <p>This prevents runaway token growth in extended workflows and keeps your sessions predictable.</p>

      <h2>11. Pace the 5-Hour Rolling Window</h2>
      <p>Usage limits don't reset at midnight—they decay over a rolling 5-hour window. Your quota recovers gradually throughout the day.</p>
      <p>Spread heavy work across the day instead of cramming it into one session. Let your quota recover while you work on lighter tasks. This is especially important for Pro users with strict rate limits.</p>

      <h2>12. Bypass Peak-Hour Taxation</h2>
      <p>Usage is more expensive during peak US hours. The system dynamically adjusts costs based on demand.</p>
      <p>Shift heavy workloads to off-peak times (early morning, late evening, weekends) to stretch your allocation further. This is a simple, free optimization.</p>

      <h2>13. Set a Failsafe (Premium Users)</h2>
      <p>Hitting a hard limit mid-workflow kills momentum. Without safeguards, you can exhaust your monthly budget unexpectedly.</p>
      <p>Enable overage in your usage settings and set a strict monthly cap. This ensures uninterrupted work while keeping costs controlled. You stay in the driver's seat of your budget.</p>
    </article>
  </main>

  <footer>
    <p><strong>Last updated:</strong> April 3, 2026</p>
    <p><a href="index.html">← Back to Claude Code Cheatsheet</a></p>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify token-usage.html renders correctly**

Open token-usage.html in a browser. Check that:
- Navigation bar appears at top
- All 13 sections are visible with h2 headings
- Dropdown menu works
- Content is readable with max-width constraint
- Code blocks render properly

- [ ] **Step 3: Commit**

```bash
git add token-usage.html
git commit -m "feat: add token usage optimization article"
```

---

## Task 6: Update sitemap.xml

**Files:**
- Modify: `sitemap.xml`

- [ ] **Step 1: Open sitemap.xml and find the last `</url>` tag**

The file currently has entries for index.html, best-practices.html, and hidden-features.html.

- [ ] **Step 2: Add new URL entry for token-usage.html before `</urlset>`**

Before the closing `</urlset>` tag, add:

```xml
  <url>
    <loc>https://claude-guides.com/token-usage.html</loc>
    <lastmod>2026-04-03</lastmod>
    <priority>0.8</priority>
    <changefreq>monthly</changefreq>
  </url>
```

- [ ] **Step 3: Verify XML is valid**

Check that the file is well-formed XML (no duplicate tags, proper nesting).

- [ ] **Step 4: Commit**

```bash
git add sitemap.xml
git commit -m "feat: add token-usage article to sitemap"
```

---

## Task 7: Test All Pages

**Files:**
- No files to modify (testing only)

- [ ] **Step 1: Open index.html in browser**

Verify:
- Navigation bar is visible at top
- "Main" link works (stays on index)
- "Articles" dropdown shows three articles
- "Contact" link opens LinkedIn in new tab
- Page content displays correctly below nav bar
- Responsive: test on mobile width (375px)

- [ ] **Step 2: Open best-practices.html in browser**

Verify:
- Navigation bar is visible at top
- All dropdown links work
- Can navigate between articles via dropdown
- Back-link to index works
- No styling conflicts

- [ ] **Step 3: Open hidden-features.html in browser**

Same verifications as best-practices.html.

- [ ] **Step 4: Open token-usage.html in browser**

Verify:
- Navigation bar is visible
- All 13 sections are present and readable
- Dropdown works
- Links to other articles via dropdown work
- Footer back-link works
- SEO metadata is visible in page source (title, description, og:tags)

- [ ] **Step 5: Test dropdown on mobile**

Use browser dev tools to set viewport to 375px width. Verify:
- Navigation fits without overflow
- Dropdown menu is accessible and readable
- Font sizes scale properly

- [ ] **Step 6: Test all navigation links**

From each page (index, best-practices, hidden-features, token-usage):
- Click "Main" → goes to index.html
- Click "Best Practices" → goes to best-practices.html
- Click "Hidden Features" → goes to hidden-features.html
- Click "Reduce Token Usage" → goes to token-usage.html
- Click "Contact" → opens LinkedIn in new tab

- [ ] **Step 7: Verify no console errors**

Open browser dev tools (F12), check Console tab. No JavaScript errors should appear.

---

## Task 8: Final Verification & Cleanup

**Files:**
- No files to modify (verification only)

- [ ] **Step 1: Check git status**

Run: `git status`
Expected: All changes committed, working directory clean.

- [ ] **Step 2: Verify all commits are present**

Run: `git log --oneline -10`
Expected: Recent commits for nav styles, nav markup, best-practices nav, hidden-features nav, token-usage article, sitemap update.

- [ ] **Step 3: Test all links one more time**

Open each page in browser and verify all navigation works end-to-end.

- [ ] **Step 4: Check responsive design**

Test at 1200px (desktop), 768px (tablet), 375px (mobile). Verify:
- Navigation is readable and accessible at all sizes
- Content doesn't overflow
- Font sizes are appropriate

---

## Success Criteria

✅ Navigation bar appears on all pages (index, best-practices, hidden-features, token-usage)  
✅ All dropdown links work correctly  
✅ LinkedIn contact link opens in new tab  
✅ Token usage article has all 13 strategies with proper formatting  
✅ Sitemap.xml includes new article  
✅ No broken links or styling issues  
✅ All changes committed to git  
✅ Responsive design works on mobile, tablet, desktop  
