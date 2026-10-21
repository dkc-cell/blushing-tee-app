import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
import { applyPageSeo, paths, render } from '../.prerender/prerender.mjs';

const template = await readFile('build/index.html', 'utf8');
for (const path of paths) {
  const { html, metadata } = render(path);
  const dom = new JSDOM(template);
  // Metadata writes use the same implementation as browser navigation. No scripts run.
  globalThis.document = dom.window.document;
  applyPageSeo(metadata);
  document.getElementById('root').innerHTML = html;
  const directory = path === '/' ? 'build' : `build${path}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, dom.serialize());
  dom.window.close();
}
delete globalThis.document;
await rm('.prerender', { recursive: true, force: true });
console.log(`Generated HTML and metadata for ${paths.length} routes.`);
