const { test, expect } = require('@playwright/test');
const { htmlFiles, read, exists } = require('./helpers');

// The whole site pointed og:image at /og-image.png, which did not exist —
// every social share preview was broken.
test('every absolute claude-guides.com asset reference resolves to a file', () => {
  const missing = new Set();

  for (const file of htmlFiles()) {
    for (const m of read(file).matchAll(/https:\/\/claude-guides\.com(\/[\w./-]+\.(?:png|jpg|jpeg|svg|ico|webmanifest|xml|json))/g)) {
      if (!exists(m[1].slice(1))) missing.add(`${m[1]} (referenced by ${file})`);
    }
  }

  expect([...missing]).toEqual([]);
});

test('declared favicons exist', () => {
  for (const f of ['favicon.svg', 'favicon.ico', 'favicon-16.png', 'favicon-32.png',
                   'favicon-96x96.png', 'apple-touch-icon.png', 'og-image.png']) {
    expect(exists(f), `${f} is missing`).toBe(true);
  }
});

test('web manifest icons exist', () => {
  const manifest = JSON.parse(read('site.webmanifest'));
  for (const icon of manifest.icons ?? []) {
    expect(exists(icon.src.replace(/^\//, '')), `${icon.src} is missing`).toBe(true);
  }
});
