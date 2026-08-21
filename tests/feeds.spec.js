const { test, expect } = require('@playwright/test');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const { ROOT, read, posts, exists } = require('./helpers');

// sitemap.xml drifted for months: 9 posts missing and 8 entries pointing at
// root URLs for pages that live under blog/. Both files are generated now.
test('feed.xml and sitemap.xml are in sync with blog-posts.json', () => {
  execFileSync('node', [path.join(ROOT, 'scripts/generate-feeds.mjs'), '--check'], {
    cwd: ROOT,
    stdio: 'pipe',
  });
});

test('every sitemap URL resolves to a file', () => {
  const locs = [...read('sitemap.xml').matchAll(/<loc>https:\/\/claude-guides\.com([^<]*)<\/loc>/g)]
    .map((m) => m[1]);

  expect(locs.length).toBeGreaterThan(30);

  const missing = locs.filter((loc) => {
    const target = loc === '/' || loc.endsWith('/') ? `${loc.slice(1)}index.html` : loc.slice(1);
    return !exists(target);
  });

  expect(missing).toEqual([]);
});

test('every published post is in the sitemap and the feed', () => {
  const sitemap = read('sitemap.xml');
  const feed = read('blog/feed.xml');

  for (const post of posts()) {
    expect(sitemap, `${post.url} missing from sitemap.xml`).toContain(`<loc>https://claude-guides.com${post.url}</loc>`);
    if (post.url.startsWith('/blog/')) {
      expect(feed, `${post.url} missing from feed.xml`).toContain(`<link>https://claude-guides.com${post.url}</link>`);
    }
  }
});

test('blog-posts.json entries are complete, unique and newest-first', () => {
  const all = posts();
  const seen = new Set();

  for (const post of all) {
    for (const field of ['url', 'title', 'excerpt', 'date', 'readTime', 'category', 'tags']) {
      expect(post[field], `${post.url} is missing "${field}"`).toBeTruthy();
    }
    expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(seen.has(post.url), `duplicate entry for ${post.url}`).toBe(false);
    seen.add(post.url);
    expect(exists(post.url.replace(/^\//, '')), `${post.url} has no HTML file`).toBe(true);
  }

  const dates = all.map((p) => p.date);
  expect(dates).toEqual([...dates].sort().reverse());
});
