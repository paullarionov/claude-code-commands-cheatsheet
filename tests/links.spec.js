const { test, expect } = require('@playwright/test');
const { htmlFiles, PARTIALS, read, refsIn, resolveRef, exists } = require('./helpers');

// Regression guard: index.html and cheatsheet-landing-page.html used to link to
// best-practices.html etc. as if they sat in the repo root, but every guide lives
// under blog/. Those were 404s in production.
test.describe('local references', () => {
  for (const file of [...htmlFiles(), ...PARTIALS]) {
    test(`${file} has no broken href/src`, () => {
      const broken = refsIn(read(file))
        .map((ref) => ({ ref, target: resolveRef(file, ref) }))
        .filter(({ target }) => target && !exists(target))
        .map(({ ref, target }) => `${ref} -> ${target}`);

      expect(broken, `broken references in ${file}`).toEqual([]);
    });
  }
});

test('guide pages are linked with their blog/ prefix', () => {
  const guides = [
    'best-practices',
    'hidden-features',
    'memory-management',
    'advanced-workflows',
    'prompt-engineering',
    'token-usage',
    'debugging-guide',
    'performance-optimization',
    'claude-code-architectural-patterns',
  ];
  const rootRelative = new RegExp(`href="/?(${guides.join('|')})\\.html"`, 'g');

  for (const file of htmlFiles()) {
    const hits = [...read(file).matchAll(rootRelative)].map((m) => m[0]);
    expect(hits, `${file} links to a guide without the blog/ prefix`).toEqual([]);
  }
});
