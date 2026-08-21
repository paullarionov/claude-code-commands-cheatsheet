const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');

/** Fragments fetched and injected by JS — not standalone pages. */
const PARTIALS = new Set(['navbar.html']);

/** Every HTML file the site ships, as repo-relative paths. */
function htmlFiles() {
  const root = fs.readdirSync(ROOT).filter((f) => f.endsWith('.html') && !PARTIALS.has(f));
  const blog = fs.readdirSync(path.join(ROOT, 'blog')).filter((f) => f.endsWith('.html'));
  return [...root, ...blog.map((f) => `blog/${f}`)];
}

const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const posts = () => JSON.parse(read('blog/blog-posts.json')).posts;

/**
 * Resolve a local href/src the way a static server rooted at the repo would.
 * Returns null for anything that isn't a local file reference.
 */
function resolveRef(fromFile, ref) {
  if (/^(https?:|mailto:|tel:|data:|javascript:|#)/.test(ref)) return null;
  if (ref.includes('${')) return null; // template literal inside inline JS
  const clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
  if (!clean) return null;

  let target = clean.startsWith('/')
    ? clean.slice(1)
    : path.posix.join(path.posix.dirname(fromFile), clean);

  if (target === '' || target.endsWith('/')) target += 'index.html';
  return target;
}

/** href="..." and src="..." values in a document, deduped. */
function refsIn(html) {
  const out = new Set();
  for (const m of html.matchAll(/(?:href|src)="([^"]*)"/g)) out.add(m[1]);
  return [...out];
}

const exists = (rel) => fs.existsSync(path.join(ROOT, rel));

/** Pages worth loading in a browser: the two entry points plus every blog page. */
function pageUrls() {
  return htmlFiles().map((f) => (f === 'blog/index.html' ? '/blog/' : `/${f}`));
}

module.exports = { ROOT, PARTIALS, htmlFiles, read, posts, resolveRef, refsIn, exists, pageUrls };
