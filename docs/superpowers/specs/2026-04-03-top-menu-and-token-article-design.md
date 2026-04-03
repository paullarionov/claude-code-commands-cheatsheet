# Design Spec: Top Navigation Menu & Token Usage Article

**Date:** April 3, 2026  
**Project:** Claude Code Commands Cheatsheet  
**Scope:** Add sticky top navigation bar with dropdown Articles menu + new SEO article on token optimization  

---

## Overview

This spec covers two integrated features:
1. **Top Navigation Bar** — Fixed sticky header on all pages with Main | Articles | Contact menu
2. **Token Usage Article** — New SEO article covering 13 strategies to reduce Claude token consumption

Both features maintain the existing design language and improve site navigation.

---

## Feature 1: Top Navigation Menu

### Purpose
Provide consistent, accessible navigation across all pages. The menu links to Main (index), displays article options via dropdown, and provides direct contact link to LinkedIn.

### Requirements

**Navigation Structure:**
- **Main** — Links to index.html
- **Articles** — Dropdown showing all article pages:
  - Best Practices (best-practices.html)
  - Hidden Features (hidden-features.html)
  - Reduce Token Usage (token-usage.html) — NEW
- **Contact** — External link to LinkedIn profile (target="_blank")

**Behavior:**
- Desktop: Dropdown appears on hover, keyboard-accessible
- Mobile: Dropdown accessible via tap (or simplified vertical menu)
- Navigation appears on all pages (index.html, article pages)
- Menu is sticky (fixed position) and stays visible when scrolling
- Uses existing site color scheme and typography

**Accessibility:**
- Semantic HTML (`<nav>`, `<ul>`, `<li>`, `<a>`)
- Keyboard navigation support (arrow keys, Enter, Escape)
- ARIA attributes for dropdown state (`aria-expanded`, `aria-hidden`)
- Focus visible on all interactive elements

### Implementation Details

**DOM Structure:**
```html
<nav class="navbar">
  <div class="nav-container">
    <a href="index.html" class="logo">Claude Code Cheatsheet</a>
    <ul class="nav-menu">
      <li><a href="index.html">Main</a></li>
      <li class="dropdown">
        <a href="#" class="dropdown-toggle">Articles</a>
        <ul class="dropdown-menu" role="menu">
          <li role="none"><a href="best-practices.html" role="menuitem">Best Practices</a></li>
          <li role="none"><a href="hidden-features.html" role="menuitem">Hidden Features</a></li>
          <li role="none"><a href="token-usage.html" role="menuitem">Reduce Token Usage</a></li>
        </ul>
      </li>
      <li><a href="https://linkedin.com/in/YOUR_PROFILE" target="_blank">Contact</a></li>
    </ul>
  </div>
</nav>
```

**Styling Notes:**
- Fixed position (top: 0, left: 0, right: 0), z-index sufficient to stay on top
- Background: Use existing --surface color variable
- Padding: Consistent with site spacing (16-24px)
- Typography: Inherit Inter font from site
- Dropdown: Appears on hover, positioned absolutely below parent
- Responsive: Collapses to hamburger on mobile (or simple vertical stack if simpler)
- Uses CSS variables for colors (--bg, --text, --accent)

**Mobile Considerations:**
- Hamburger menu icon for screens < 768px (or remove nav entirely if too complex)
- Dropdown touch-friendly on mobile
- No hover states (use :focus-visible instead)

---

## Feature 2: Token Usage Article

### Purpose
Provide SEO-rich, actionable guide on optimizing Claude token usage — key pain point for users hitting rate limits.

### Content Structure

**File:** `token-usage.html`

**Sections (H2 headings, one per strategy):**
1. Edit, Don't Append
2. Cycle Chats at 15 Messages
3. Batch Your Directives
4. Cache Documents via Projects
5. Bake in Your System Prompts
6. Disable Background Tools
7. Right-Size Your Models
8. Control Reasoning Effort
9. Start Fresh After Idle Time
10. Cap Your Context Window
11. Pace the 5-Hour Rolling Window
12. Bypass Peak-Hour Taxation
13. Set a Failsafe (Premium Users)

**Content Details Per Section:**
- Opening: Problem statement or motivation
- Key insight or calculation (where provided in source)
- Practical steps or examples
- Code blocks for technical strategies (e.g., environment variables)
- Optional: Tip box for pro tips or callouts
- Closing: Expected impact or next step

**SEO Metadata:**
```html
<title>How to Reduce Claude Token Usage and Avoid Hitting Limits – 13 Proven Strategies</title>
<meta name="description" content="Master token efficiency with 13 proven strategies to stretch your Claude usage limits further. Learn how to edit instead of append, cycle chats, batch directives, and more.">
<meta name="keywords" content="claude token usage, reduce token costs, token limits, usage caps, claude pro, token optimization">
<meta property="og:title" content="How to Reduce Claude Token Usage – 13 Proven Strategies">
<meta property="og:description" content="13 practical strategies to optimize Claude token usage and avoid hitting limits.">
```

### Page Structure

**Layout:**
- Consistent with best-practices.html and hidden-features.html
- Back-link to index at top: `← Back to Cheatsheet`
- Header with h1 title + intro paragraph
- Article content in semantic `<article>` wrapper
- Footer with "Last updated" date and back-link
- Max-width: 800px for readability

**Styling:**
- Inherit existing CSS variables and responsive patterns
- Use `.tip` class for tip boxes (accent color border)
- Code blocks with `<code>` elements (inline) or `<pre><code>` for blocks
- Responsive typography (h1, h2, p inherit from site)

**Navigation:**
- Back-link to index at top and bottom
- Optional: Add navigation to previous/next articles (Best Practices ← | → Hidden Features)

### Content Source
Text adapted from user's tweet/LinkedIn post. Maintain the practical, concise tone while expanding with examples and context where helpful.

---

## Implementation Order

1. **Add top navigation to index.html** (before other changes)
2. **Add top navigation to existing article pages** (best-practices.html, hidden-features.html)
3. **Create token-usage.html** (new article)
4. **Update sitemap.xml** (add new article URL)
5. **Test responsive behavior** (desktop, tablet, mobile)
6. **Commit all changes** (one commit for menu, separate commit for article)

---

## Testing Checklist

- [ ] Navigation bar appears on all pages (index, best-practices, hidden-features, token-usage)
- [ ] Dropdown opens/closes on hover (desktop) and tap (mobile)
- [ ] All links work (Main, Articles links, Contact)
- [ ] Menu is keyboard navigable (Tab, Arrow keys, Escape)
- [ ] Menu is sticky (stays visible when scrolling)
- [ ] Menu is responsive (hamburger or vertical on mobile)
- [ ] Token usage article renders correctly
- [ ] All 13 sections are present and properly formatted
- [ ] SEO metadata is correct (title, description, og:tags)
- [ ] Sitemap.xml includes new article
- [ ] Mobile layout is readable (no overflow, proper spacing)

---

## Files to Modify/Create

| File | Action | Notes |
|------|--------|-------|
| index.html | Modify | Add `<nav>` before existing header |
| best-practices.html | Modify | Add `<nav>` at top |
| hidden-features.html | Modify | Add `<nav>` at top |
| token-usage.html | Create | New article with 13 sections |
| sitemap.xml | Modify | Add token-usage.html URL |
| (optional) hamburger.js | Create | Only if implementing mobile hamburger menu |

---

## Success Criteria

✓ Users can navigate between Main, Articles dropdown, and Contact link from any page  
✓ Token usage article is complete with 13 strategies, properly formatted, and SEO-optimized  
✓ All links work (internal and external)  
✓ Design matches existing site (color scheme, typography, responsiveness)  
✓ Sitemap reflects new article  
✓ No broken navigation or styling issues  

---

## Design Decisions

**Why sticky navigation?**
- Modern standard for multi-page sites
- Keeps navigation accessible during scrolling
- Improves user experience on long article pages

**Why dropdown for Articles?**
- Clean, compact menu (doesn't expand with each article title)
- Familiar pattern (users expect hover dropdowns)
- Responsive: works on mobile with tap/focus

**Why separate article instead of index section?**
- SEO benefit: dedicated, detailed page ranks better
- Monetization: can expand into a more detailed resource
- User experience: focused reading vs. cheatsheet format

**Why fixed width (800px) for articles?**
- Optimized for readability (line length ~60-70 chars)
- Consistent with existing article pages
- Responsive scaling on smaller screens

---

## Out of Scope

- Animated menu transitions (use CSS basic hover/focus)
- Search functionality (future feature)
- Mobile app or PWA enhancements (separate work)
- Article categories or tagging (keep simple)
- User accounts or comments (static site)
