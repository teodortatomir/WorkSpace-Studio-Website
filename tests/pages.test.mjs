import test from 'node:test';
import assert from 'node:assert/strict';
import { adaptHomepageLinks } from '../scripts/lib/pages.mjs';

test('GitHub Pages logo links resolve to the homepage under a project prefix at every depth', () => {
  const html = `<img onclick="window.location.href='/index.html'"><a href="https://shop.workspaces.ro/en/catalog">Shop</a>`;
  for (const route of ['index.html', 'about/about.html', 'projects/Adobe/adobe.html']) {
    const adapted = adaptHomepageLinks(html, route);
    const target = /window.location.href='([^']+)'/.exec(adapted)[1];
    assert.equal(new URL(target, 'https://example.github.io/WorkSpace-Studio-Website/' + route).pathname, '/WorkSpace-Studio-Website/index.html');
    assert.ok(adapted.includes('href="https://shop.workspaces.ro/en/catalog"'));
    assert.equal(adaptHomepageLinks(adapted, route), adapted);
  }
});
