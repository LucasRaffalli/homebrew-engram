# Worker des releases

Un seul Worker Cloudflare, `engram-releases`, sert les releases de toutes les apps depuis un seul bucket R2, `engram-releases`, sur `release.lucasraffalli.com/<app>/*`. Chaque app a son dossier dans le bucket (`charon/…`, `kairos/…`) et sa route.

Il ne lit que par clé : pas de listing, pas d'écriture, rien d'autre que `GET` et `HEAD`. Les fichiers arrivent par le `npm run deploy` de chaque app (`wrangler r2 object put`).

## Mise en place (une fois, depuis ta machine)

```bash
cd infra/release-worker
npx wrangler login
npx wrangler r2 bucket create engram-releases
npx wrangler deploy
```

`wrangler deploy` crée le Worker et la route `release.lucasraffalli.com/charon/*`. Test : `node test.mjs`.

Tant que `charon/latest.json` n'est pas dans le bucket, `/charon/*` continue d'être servi par l'ancien serveur (VPS) : le Worker renvoie à l'origine ce qui n'est pas dans R2. On peut donc le déployer avant la release 1.4.0 sans rien casser.

## Migrer Kairos (plus tard)

Kairos est servi aujourd'hui par le Worker `kairos-releases` et le bucket `kairos-releases` (fichiers à la racine). Pour le passer ici :

1. Copier chaque fichier du bucket `kairos-releases` vers `engram-releases` sous `kairos/` (`latest.json`, les `.app.tar.gz`, `.dmg` et `.mcpb`) :
   ```bash
   npx wrangler r2 object get kairos-releases/<fichier> --file /tmp/<fichier> --remote
   npx wrangler r2 object put engram-releases/kairos/<fichier> --file /tmp/<fichier> --remote
   ```
   (`--content-type` à repasser sur `put` : `application/json` pour `latest.json`, `application/gzip`, `application/x-apple-diskimage`, `application/octet-stream`.)
2. Dans le `deploy.sh` de Kairos : bucket `engram-releases` et clés `kairos/<fichier>`.
3. Retirer la route `/kairos/*` de l'ancien Worker, la déclarer dans `wrangler.jsonc` ici (ligne commentée), puis `npx wrangler deploy`.
4. Vérifier `https://release.lucasraffalli.com/kairos/latest.json`, puis supprimer l'ancien Worker et l'ancien bucket.

## En 2027

L'ancien serveur de Charon disparaît : mettre `fallbackToOrigin: false` pour `charon` dans `index.js` (ou retirer l'option), et ajuster `test.mjs`.
