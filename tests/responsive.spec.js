const { test, expect } = require('@playwright/test');
const { pageUrls } = require('./helpers');

// Runs under the "mobile" project (iPhone 13, 390px).
test.describe('mobile layout', () => {
  for (const url of pageUrls()) {
    test(`${url} does not scroll horizontally`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });

      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        win: window.innerWidth,
        // Anything wider than the viewport must sit inside its own scroll container.
        offenders: [...document.querySelectorAll('body *')]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            if (r.width === 0 || r.right <= window.innerWidth + 1) return false;
            for (let p = el.parentElement; p; p = p.parentElement) {
              const ox = getComputedStyle(p).overflowX;
              if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return false;
            }
            return true;
          })
          .slice(0, 5)
          .map((el) => `${el.tagName}.${el.className}`.slice(0, 60)),
      }));

      expect(overflow.offenders, `overflowing elements on ${url}`).toEqual([]);
      expect(overflow.doc, `document scrolls horizontally on ${url}`).toBeLessThanOrEqual(overflow.win + 1);
    });

    test(`${url} keeps the navbar usable`, async ({ page }) => {
      await page.goto(url, { waitUntil: 'networkidle' });

      const nav = page.locator('nav.navbar');
      await expect(nav).toBeVisible();
      const box = await nav.boundingBox();
      expect(box.width).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth) + 1);
    });
  }
});
