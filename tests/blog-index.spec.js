const { test, expect } = require('@playwright/test');
const { posts } = require('./helpers');

test.describe('blog index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/', { waitUntil: 'networkidle' });
  });

  test('lists every post from blog-posts.json', async ({ page }) => {
    const count = posts().length;
    await expect(page.locator('.post-card')).toHaveCount(count);
    await expect(page.getByText(`${count} posts found`)).toBeVisible();
  });

  test('shows the newest post first', async ({ page }) => {
    const newest = posts()[0];
    await expect(page.locator('.post-card').first()).toContainText(newest.title);
  });

  test('every card links to a page that actually loads', async ({ page, request }) => {
    const hrefs = await page.locator('.post-card a[href], a.post-card[href]').evaluateAll(
      (nodes) => [...new Set(nodes.map((n) => n.getAttribute('href')))]
    );

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect((await request.get(href)).status(), `${href} is not reachable`).toBe(200);
    }
  });

  test('search narrows the list', async ({ page }) => {
    const search = page.locator('input[type="search"], input[placeholder*="Search" i]').first();
    await search.fill('context');
    await expect(page.locator('.post-card')).not.toHaveCount(posts().length);
    await expect(page.locator('.post-card').first()).toBeVisible();

    await search.fill('');
    await expect(page.locator('.post-card')).toHaveCount(posts().length);
  });
});
