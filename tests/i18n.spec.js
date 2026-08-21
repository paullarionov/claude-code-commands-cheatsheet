const { test, expect } = require('@playwright/test');

const LANGS = ['en', 'ru', 'zh', 'ja', 'es'];

test.describe('cheatsheet translations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('every data-i18n key used in the markup is defined', async ({ page }) => {
    const undefinedKeys = await page.evaluate(() =>
      [...new Set([...document.querySelectorAll('[data-i18n]')].map((el) => el.dataset.i18n))]
        .filter((key) => !(key in T))
    );

    expect(undefinedKeys).toEqual([]);
  });

  test('no dictionary entry is orphaned', async ({ page }) => {
    const orphans = await page.evaluate(() => {
      const used = new Set([...document.querySelectorAll('[data-i18n]')].map((el) => el.dataset.i18n));
      return Object.keys(T).filter((key) => !used.has(key));
    });

    expect(orphans).toEqual([]);
  });

  test('every entry covers all five languages', async ({ page }) => {
    const incomplete = await page.evaluate((langs) =>
      Object.entries(T)
        .map(([key, value]) => [key, langs.filter((l) => !value[l])])
        .filter(([, missing]) => missing.length)
        .map(([key, missing]) => `${key}: ${missing.join(',')}`),
    LANGS);

    expect(incomplete).toEqual([]);
  });

  for (const lang of LANGS) {
    test(`switching to ${lang} leaves no untranslated node`, async ({ page }) => {
      const empty = await page.evaluate((l) => {
        setLang(l);
        return [...document.querySelectorAll('[data-i18n]')]
          .filter((el) => !el.textContent.trim())
          .map((el) => el.dataset.i18n);
      }, lang);

      expect(empty).toEqual([]);
    });
  }

  test('rows added for the summer 2026 update render and translate', async ({ page }) => {
    const keys = ['d-fork-copy', 'd-subtask', 'd-code-review-bg', 'd-automode-default',
                  'd-sandbox-allowlist', 'd-max-spawn-depth', 'd-dataviz', 'd-bg-default',
                  'd-nested-depth', 'd-screen-reader'];

    for (const key of keys) {
      await expect(page.locator(`[data-i18n="${key}"]`)).toHaveCount(1);
    }

    await page.evaluate(() => setLang('ru'));
    await expect(page.locator('[data-i18n="d-subtask"]')).toHaveText('Запуск субагента в сессии');
  });
});
