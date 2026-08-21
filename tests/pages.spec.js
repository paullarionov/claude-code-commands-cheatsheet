const { test, expect } = require('@playwright/test');
const { pageUrls } = require('./helpers');

/** Collects console errors and failed requests while a page loads. */
async function loadClean(page, url) {
  const consoleErrors = [];
  const failed = [];

  page.on('console', (msg) => msg.type() === 'error' && consoleErrors.push(msg.text()));
  page.on('response', (res) => res.status() >= 400 && failed.push(`${res.status()} ${res.url()}`));

  await page.goto(url, { waitUntil: 'networkidle' });
  return { consoleErrors, failed };
}

test.describe('every page', () => {
  for (const url of pageUrls()) {
    test(`${url} loads without console or network errors`, async ({ page }) => {
      const { consoleErrors, failed } = await loadClean(page, url);

      // 11 blog pages loaded js/navbar-loader.js relative to blog/, which 404'd.
      expect(failed, `failed requests on ${url}`).toEqual([]);
      expect(consoleErrors, `console errors on ${url}`).toEqual([]);
    });

    test(`${url} renders exactly one navbar`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });

      // navbar-loader used to inject navbar.html's first *element* — a <link> tag —
      // instead of the <nav>, and would duplicate the header once that was fixed.
      await expect(page.locator('nav.navbar')).toHaveCount(1);
      await expect(page.locator('body > link')).toHaveCount(0);
      await expect(page.locator('nav.navbar a[href="/blog/"], nav.navbar a[href$="/blog/"]')).toHaveCount(1);
    });
  }
});

test.describe('page metadata', () => {
  for (const url of pageUrls()) {
    test(`${url} has a title, description and canonical`, async ({ page }) => {
      await page.goto(url);

      await expect(page).toHaveTitle(/\S/);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https:\/\/claude-guides\.com\//);
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\S/);
      await expect(page.locator('h1')).toHaveCount(1);
    });
  }
});
