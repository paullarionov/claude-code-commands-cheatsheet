// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const PORT = 8899;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: process.env.CI ? [['github'], ['list']] : [['list']],
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /responsive\.spec\.js/ },
    { name: 'mobile', use: { ...devices['iPhone 13'] }, testMatch: /responsive\.spec\.js/ },
  ],
  webServer: {
    // The site is plain static files served from the repo root, same as GitHub Pages.
    command: `python3 -m http.server ${PORT} --bind 127.0.0.1`,
    url: `http://127.0.0.1:${PORT}/index.html`,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
  },
});
