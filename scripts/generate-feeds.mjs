/**
 * Single source of truth: blog/blog-posts.json.
 * Regenerates blog/feed.xml and sitemap.xml from it so the three can't drift.
 *
 *   node scripts/generate-feeds.mjs          write the files
 *   node scripts/generate-feeds.mjs --check  exit 1 if the files are stale
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://claude-guides.com';

/** Pages that live outside the blog and aren't listed in blog-posts.json. */
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/blog/', priority: '0.9', changefreq: 'weekly' },
];

const escape = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** RFC-822 date at midnight UTC, which is the granularity blog-posts.json carries. */
const rfc822 = (isoDate) => new Date(`${isoDate}T00:00:00Z`).toUTCString();

const posts = JSON.parse(readFileSync(resolve(root, 'blog/blog-posts.json'), 'utf8')).posts;
const byDateDesc = [...posts].sort((a, b) => b.date.localeCompare(a.date));
const blogPosts = byDateDesc.filter((p) => p.url.startsWith('/blog/'));
const newest = byDateDesc[0].date;

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Claude Guides Blog</title>
    <link>${SITE}/blog/</link>
    <atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Practical guides, field reports, and research on Claude Code, AI agents, prompt engineering, and automation.</description>
    <language>en-us</language>
    <lastBuildDate>${rfc822(newest)}</lastBuildDate>
    <image>
      <url>${SITE}/og-image.png</url>
      <title>Claude Guides Blog</title>
      <link>${SITE}/blog/</link>
    </image>
${blogPosts
  .map(
    (p) => `
    <item>
      <title>${escape(p.title)}</title>
      <link>${SITE}${p.url}</link>
      <guid isPermaLink="true">${SITE}${p.url}</guid>
      <pubDate>${rfc822(p.date)}</pubDate>
      <category>${escape(p.category)}</category>
      <description>${escape(p.excerpt)}</description>
    </item>`
  )
  .join('\n')}

  </channel>
</rss>
`;

const urlEntry = ({ path, priority, changefreq, lastmod }) => `  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_PAGES.map((p) => urlEntry({ ...p, lastmod: newest })).join('\n')}
${byDateDesc
  .map((p) =>
    urlEntry({
      path: p.url,
      priority: p.url.startsWith('/blog/') ? '0.8' : '0.9',
      changefreq: 'monthly',
      lastmod: p.date,
    })
  )
  .join('\n')}
</urlset>
`;

const targets = [
  ['blog/feed.xml', feed],
  ['sitemap.xml', sitemap],
];

if (process.argv.includes('--check')) {
  const stale = targets.filter(([file, want]) => readFileSync(resolve(root, file), 'utf8') !== want);
  if (stale.length) {
    console.error(`Stale, run "npm run feeds": ${stale.map(([f]) => f).join(', ')}`);
    process.exit(1);
  }
  console.log('feed.xml and sitemap.xml are in sync with blog-posts.json');
} else {
  for (const [file, content] of targets) {
    writeFileSync(resolve(root, file), content);
    console.log(`wrote ${file}`);
  }
}
