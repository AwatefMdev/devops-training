const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createApp } = require('../src/app');

let server;
let base;

before(async () => {
  server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

test('GET /health returns ok', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal((await res.json()).status, 'ok');
});

test('notes can be created, listed and deleted', async () => {
  const created = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Learn Docker' }),
  });
  assert.equal(created.status, 201);
  const note = await created.json();
  assert.equal(note.text, 'Learn Docker');

  const list = await (await fetch(`${base}/api/notes`)).json();
  assert.equal(list.length, 1);

  const del = await fetch(`${base}/api/notes/${note.id}`, { method: 'DELETE' });
  assert.equal(del.status, 204);
  assert.equal((await fetch(`${base}/api/notes/${note.id}`, { method: 'DELETE' })).status, 404);
});

test('POST /api/notes validates input', async () => {
  const res = await fetch(`${base}/api/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: '   ' }),
  });
  assert.equal(res.status, 400);
});
