/**
 * Renders the site's Open Graph card to og-image.png (1200x630).
 * Run after changing branding: npm run og
 */
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logo = readFileSync(resolve(root, 'favicon.svg'), 'base64');

const html = `<!doctype html>
<meta charset="utf-8">
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; display: flex; flex-direction: column;
    justify-content: center; gap: 28px; padding: 88px;
    background: #FAF8F5; color: #1C1917;
    font-family: Inter, -apple-system, system-ui, sans-serif;
    border-bottom: 14px solid #C96442;
  }
  .brand { display: flex; align-items: center; gap: 18px; }
  .brand img { width: 68px; height: 68px; }
  .brand span { font-size: 38px; font-weight: 700; letter-spacing: -0.5px; }
  h1 { font-size: 72px; line-height: 1.08; font-weight: 800; letter-spacing: -2px; max-width: 15ch; }
  h1 em { font-style: normal; color: #C96442; }
  p { font-size: 30px; color: #57534E; max-width: 30ch; line-height: 1.4; }
  .url { margin-top: 8px; font-size: 26px; font-weight: 600; color: #C96442;
         font-family: 'SF Mono', ui-monospace, monospace; }
</style>
<div class="brand"><img src="data:image/svg+xml;base64,${logo}" alt=""><span>Claude Guides</span></div>
<h1>AI Cheatsheets &amp; <em>Hands-On Guides</em></h1>
<p>Every Claude Code command, shortcut, MCP server, skill and agent — in one place.</p>
<div class="url">claude-guides.com</div>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.screenshot({ path: resolve(root, 'og-image.png') });
await browser.close();
console.log('wrote og-image.png (1200x630)');
