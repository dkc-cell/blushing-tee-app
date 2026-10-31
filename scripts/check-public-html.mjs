import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { JSDOM } from 'jsdom';

const site = 'https://blushingbirdie.com';
const sitemap = new JSDOM(await readFile('public/sitemap.xml', 'utf8'), { contentType: 'text/xml' });
const paths = [...sitemap.window.document.querySelectorAll('loc')].map(node => new URL(node.textContent).pathname);
const titles = new Set();
for (const path of [...new Set([...paths, '/app'])]) {
  const dom = new JSDOM(await readFile(`build${path === '/' ? '' : path}/index.html`, 'utf8'));
  const doc = dom.window.document;
  assert.equal(doc.querySelectorAll('link[rel="canonical"]').length, 1, path);
  assert.equal(doc.querySelector('link[rel="canonical"]').href, site + path, path);
  assert.equal(doc.querySelector('meta[property="og:url"]').content, site + path, path);
  assert.ok(doc.querySelector('meta[name="description"]').content.length > 30, path);
  assert.ok(!titles.has(doc.title), `Duplicate title: ${path}`);
  titles.add(doc.title);
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent));
  const ids = schemas.map(schema => schema['@id']).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, `Duplicate schema entity: ${path}`);
  if (path === '/app') {
    assert.equal(doc.querySelector('meta[name="robots"]').content, 'noindex,nofollow');
    assert.equal(doc.getElementById('root').textContent, '');
  } else {
    assert.equal(doc.querySelectorAll('h1').length, 1, path);
    assert.ok(doc.getElementById('root').textContent.length > 300, `Missing content: ${path}`);
    assert.equal(doc.querySelector('meta[name="robots"]').content, 'index,follow');
    if (path.startsWith('/journal/')) {
      const article = schemas.find(schema => schema['@type'] === 'BlogPosting');
      assert.ok(article, path);
      assert.equal(article.mainEntityOfPage, site + path);
      assert.equal(article.headline, doc.querySelector('h1').textContent);
      assert.ok(doc.querySelector('article').textContent.length > 500, path);
    }
  }
  for (const node of doc.querySelectorAll('img[src], script[src], link[rel="stylesheet"]')) {
    const url = node.getAttribute('src') || node.getAttribute('href');
    if (url.startsWith('/')) await access(`build${url}`);
  }
  dom.window.close();
}
sitemap.window.close();
console.log(`Verified content, metadata, schema and assets for ${titles.size} routes.`);
