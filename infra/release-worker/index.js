// Sert le bucket R2 « engram-releases » sur release.lucasraffalli.com/<app>/*,
// pour toutes les apps (un seul Worker, un seul bucket, un préfixe par app).
//
// Une route Cloudflare par app (voir wrangler.jsonc) : le reste du domaine ne
// passe jamais par ici. Le Worker ne fait que lire un objet par sa clé : jamais
// de listing du bucket, jamais d'écriture (les fichiers arrivent par le
// `npm run deploy` de chaque app, avec les identifiants de Lucas).
//
// Dans le bucket, chaque app a son dossier : kairos/…, charon/…
//
// fallbackToOrigin : jusqu'en 2027, Charon garde son ancien serveur (VPS) pour
// les versions ≤ 1.3.0. Ce qui n'est pas dans R2 y est renvoyé : sans objet, la
// requête continue vers l'origine au lieu de répondre 404. À retirer, avec
// l'ancien serveur, quand il disparaît.
const APPS = {
  kairos: { fallbackToOrigin: false },
  charon: { fallbackToOrigin: true },
};

export default {
  async fetch(request, env) {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Méthode non autorisée', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }

    const { pathname } = new URL(request.url);
    const [, appName, ...rest] = pathname.split('/');
    const app = Object.hasOwn(APPS, appName) ? APPS[appName] : undefined;
    if (!app) {
      return notFound();
    }

    let name;
    try {
      name = decodeURIComponent(rest.join('/'));
    } catch {
      return notFound();
    }
    // Un nom vide (listing), un `..` ou un `//` : jamais un fichier de release.
    if (!name || name.split('/').some((part) => part === '' || part === '.' || part === '..')) {
      return notFound();
    }

    const object = await env.RELEASES.get(`${appName}/${name}`);
    if (!object) {
      return app.fallbackToOrigin ? fetch(request) : notFound();
    }

    const headers = new Headers();
    object.writeHttpMetadata?.(headers);
    headers.set('ETag', object.httpEtag ?? `"${object.etag}"`);
    if (name === 'latest.json') {
      // Le manifeste ne se met JAMAIS en cache : c'est lui qui annonce la version.
      headers.set('Content-Type', 'application/json');
      headers.set('Cache-Control', 'no-cache');
    } else if (!headers.has('Cache-Control')) {
      // Les fichiers portent leur version dans leur nom : une heure de cache est sûre.
      headers.set('Cache-Control', 'public, max-age=3600');
    }
    return new Response(request.method === 'HEAD' ? null : object.body, { status: 200, headers });
  },
};

function notFound() {
  return new Response('Introuvable', { status: 404, headers: { 'Cache-Control': 'no-store' } });
}
