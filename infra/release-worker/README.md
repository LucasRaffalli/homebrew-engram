# Worker des releases

Un seul Worker Cloudflare, `engram`, sert les releases de toutes les apps depuis un seul bucket R2, `engram-releases`, sur `release.lucasraffalli.com/<app>/*`. Chaque app a son dossier dans le bucket (`charon/…`, `kairos/…`) et sa route.

Il ne lit que par clé : pas de listing, pas d'écriture, rien d'autre que `GET` et `HEAD`. Les fichiers arrivent par le `npm run deploy` de chaque app (`wrangler r2 object put`).

## Mise à jour du Worker

Le bucket et le Worker existent déjà. Après un changement dans `index.js` ou `wrangler.jsonc` :

```bash
cd infra/release-worker
node test.mjs
npx wrangler deploy
```

Garder le nom `engram` dans `wrangler.jsonc` (un autre nom créerait un second Worker) et toutes les routes de l'app dans la liste `routes` : `wrangler deploy` aligne les routes du Worker sur elle.

Tant que `charon/latest.json` n'est pas dans le bucket, `/charon/*` continue d'être servi par l'ancien serveur (VPS) : le Worker renvoie à l'origine ce qui n'est pas dans R2.

## Ajouter une app

1. L'ajouter à `APPS` dans `index.js` (et à `test.mjs`).
2. Déclarer sa route dans `wrangler.jsonc`.
3. `npx wrangler deploy`, puis y envoyer ses fichiers sous `<app>/` dans le bucket.

## Reste de la migration de Kairos

Kairos est déjà servi par ce Worker (`kairos/…` dans `engram-releases`). L'ancien Worker `kairos-releases` et l'ancien bucket `kairos-releases` existent encore sur le compte : les supprimer quand plus rien ne s'en sert.

## En 2027

L'ancien serveur de Charon disparaît : mettre `fallbackToOrigin: false` pour `charon` dans `index.js` (ou retirer l'option), et ajuster `test.mjs`.
