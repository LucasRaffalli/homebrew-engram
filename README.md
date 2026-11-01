# engram

Le tap Homebrew de Lucas Raffalli : mes apps pour macOS, installées en une commande.

## Installer

```bash
brew tap lucasraffalli/engram
brew trust lucasraffalli/engram
brew install --cask lucasraffalli/engram/kairos
```

> **Pourquoi `brew trust` ?** Depuis Homebrew 7, un tap qui n'est pas officiel doit être approuvé une fois avant qu'on puisse en installer quoi que ce soit. C'est une ligne, à faire une seule fois.

## Les apps

| App | À quoi ça sert | Installer |
| --- | --- | --- |
| **[Kairos](https://github.com/LucasRaffalli/kairos)** | Un chronomètre dans la barre de menus : tu lances un lot sur une tâche, il compte, et le soir la journée est prête à saisir. | `brew install --cask lucasraffalli/engram/kairos` |
| **Charon** | Un client SFTP et FTP natif : un onglet par serveur, avec son terminal, ses transferts et son éditeur. | `brew install --cask lucasraffalli/engram/charon` |

Apple Silicon uniquement.

## Pourquoi passer par Homebrew ?

Ces apps ne sont pas encore notarisées par Apple. Téléchargées à la main, macOS peut afficher « l'app est endommagée ». Via Homebrew, l'installation retire ce blocage à la fin de la pose, et la commande en ligne de l'app (`kairos`, par exemple) est ajoutée à ton `PATH` en même temps.

## Mises à jour

Chaque app se met à jour toute seule : ce tap ne sert qu'à la première installation, `brew upgrade` n'a rien à faire.

## Désinstaller

```bash
brew uninstall --cask kairos
```

Ajoute `--zap` pour effacer aussi les données de l'app.

## Tu avais l'ancien tap ?

`lucasraffalli/kairos` et `lucasraffalli/charon` sont remplacés par celui-ci :

```bash
brew untap lucasraffalli/kairos   # ou lucasraffalli/charon
brew tap lucasraffalli/engram && brew trust lucasraffalli/engram
brew reinstall --cask lucasraffalli/engram/kairos
```

---

Les casks (`Casks/*.rb`) sont générées par le déploiement de chaque app : ne pas les modifier à la main.
