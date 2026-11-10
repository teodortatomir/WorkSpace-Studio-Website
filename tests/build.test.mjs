import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createRenderer, resolveInside, buildSite } from '../scripts/lib/build.mjs';

async function fixture(t, files) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'workspace-build-test-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [relative, text] of Object.entries(files)) {
    const file = path.join(root, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, text);
  }
  return root;
}

test('nested includes preserve scope, whitespace, CRLF and parameter characters', async t => {
  const root = await fixture(t, {
    'page.html': 'before\r\n<!--@include {"file":"layout.html","values":{"title":"$& <title>","root":"../../"}} -->after',
    'layout.html': '<title>{{title}}</title>\r\n<!--@include {"file":"nav.html"} -->',
    'nav.html': '<a href="{{root}}index.html">Home</a>\r\n',
  });
  assert.equal(await createRenderer(root)('page.html'), 'before\r\n<title>$& <title></title>\r\n<a href="../../index.html">Home</a>\r\nafter');
});

test('invalid includes fail clearly instead of silently changing generated pages', async t => {
  const root = await fixture(t, {
    'cycle.html': '<!--@include {"file":"cycle.html"} -->',
    'missing-value.html': '{{title}}',
    'missing-file.html': '<!--@include {"file":"absent.html"} -->',
    'invalid.html': '<!--@include {broken} -->',
    'escape.html': '<!--@include {"file":"../outside.html"} -->',
  });
  const render = createRenderer(root);
  await assert.rejects(render('cycle.html'), /Circular include/);
  await assert.rejects(render('missing-value.html'), /Missing string parameter/);
  await assert.rejects(render('missing-file.html'), /ENOENT/);
  await assert.rejects(render('invalid.html'), /Invalid include JSON/);
  await assert.rejects(render('escape.html'), /escapes/);
  assert.throws(() => resolveInside(root, '/absolute.html'), /relative path/);
});

test('failed build preserves the previous output and URL collisions are rejected', async t => {
  const root = await fixture(t, {
    'config/build.json': JSON.stringify({ output: 'dist', public: 'public', sources: [{ directory: 'src/pages', extensions: ['.html'] }] }),
    'public/image.svg': '<svg/>',
    'src/pages/index.html': '<!--@include {"file":"absent.html"} -->',
    'dist/index.html': 'previous working version',
  });
  await assert.rejects(buildSite({ root }), /ENOENT/);
  assert.equal(await readFile(path.join(root, 'dist/index.html'), 'utf8'), 'previous working version');
  await writeFile(path.join(root, 'public/index.html'), 'collision');
  await assert.rejects(buildSite({ root }), /Duplicate output URL/);
});

test('simultaneous dev and manual builds publish complete outputs without deleting each other', async t => {
  const root = await fixture(t, {
    'config/build.json': JSON.stringify({ output: 'dist', public: 'public', sources: [{ directory: 'src/pages', extensions: ['.html'] }] }),
    'public/image.svg': '<svg/>',
    'src/pages/index.html': 'unchanged homepage',
    'src/pages/nested/page.html': 'unchanged nested page',
  });
  const results = await Promise.all([buildSite({ root }), buildSite({ root })]);
  assert.deepEqual(results.map(result => result.total), [3, 3]);
  assert.equal(await readFile(path.join(root, 'dist/index.html'), 'utf8'), 'unchanged homepage');
  assert.equal(await readFile(path.join(root, 'dist/nested/page.html'), 'utf8'), 'unchanged nested page');
  assert.equal(await readFile(path.join(root, 'dist/image.svg'), 'utf8'), '<svg/>');
});
