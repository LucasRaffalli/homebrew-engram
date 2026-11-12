// Vérifie le Worker avec un faux bucket : `node infra/release-worker/test.mjs`.
import assert from 'node:assert/strict';
import worker from './index.js';

const store = {
  'kairos/latest.json': '{"app":"kairos"}',
  'kairos/Kairos_1.1.0.dmg': 'dmg-k',
  'charon/latest.json': '{"app":"charon"}',
  'charon/Charon_1.4.0_aarch64.dmg': 'dmg-c',
};
const env = {
  RELEASES: {
    get: async (key) =>
      key in store ? { body: store[key], etag: 'e', httpEtag: '"e"', writeHttpMetadata() {} } : null,
  },
};
globalThis.fetch = async (request) => new Response(`ORIGIN ${new URL(request.url).pathname}`);

async function call(method, path) {
  const res = await worker.fetch(new Request(`https://release.lucasraffalli.com${path}`, { method }), env);
  return { status: res.status, cache: res.headers.get('cache-control'), body: method === 'HEAD' ? null : await res.text() };
}

let r = await call('GET', '/charon/latest.json');
assert.deepEqual([r.status, r.cache, r.body], [200, 'no-cache', '{"app":"charon"}']);
r = await call('GET', '/kairos/latest.json');
assert.deepEqual([r.status, r.body], [200, '{"app":"kairos"}']);
r = await call('GET', '/charon/Charon_1.4.0_aarch64.dmg');
assert.deepEqual([r.status, r.cache, r.body], [200, 'public, max-age=3600', 'dmg-c']);
// Une app ne lit jamais le dossier d'une autre.
r = await call('GET', '/charon/Kairos_1.1.0.dmg');
assert.equal(r.body, 'ORIGIN /charon/Kairos_1.1.0.dmg');
// Charon : absent de R2 → l'ancien serveur ; Kairos : 404.
r = await call('GET', '/charon/Charon_1.3.0_aarch64.dmg');
assert.equal(r.body, 'ORIGIN /charon/Charon_1.3.0_aarch64.dmg');
r = await call('GET', '/kairos/absent.dmg');
assert.equal(r.status, 404);
// Refus : listing, traversée, méthode, app inconnue ou clé d'objet prototype.
for (const path of ['/charon/', '/charon/%2e%2e/latest.json', '/charon//x', '/other/x', '/__proto__/x', '/constructor/x', '/']) {
  assert.equal((await call('GET', path)).status, 404, path);
}
assert.equal((await call('POST', '/charon/latest.json')).status, 405);
assert.equal((await call('HEAD', '/charon/latest.json')).body, null);
console.log('Worker : OK');
