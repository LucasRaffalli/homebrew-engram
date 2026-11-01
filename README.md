# engram, le tap Homebrew de Lucas Raffalli

Les apps de Lucas Raffalli pour macOS, en une commande.

```bash
brew install --cask lucasraffalli/engram/kairos
brew install --cask lucasraffalli/engram/charon
```

| App | Ce que c'est |
| --- | --- |
| [Kairos](https://github.com/LucasRaffalli/kairos) | Chronomètre de barre de menus : un lot, une tâche, une journée à saisir. Apple Silicon. |
| Charon | Client SFTP et FTP natif. |

Les apps se mettent à jour toutes seules : ce tap ne sert qu'à la première installation.

Les casks (`Casks/*.rb`) sont générées par les scripts de déploiement de chaque app : ne pas les modifier à la main.

## Tu avais installé avant le tap `engram` ?

Les anciens taps (`lucasraffalli/kairos`, `lucasraffalli/charon`) sont remplacés par celui-ci :

```bash
brew untap lucasraffalli/kairos   # ou lucasraffalli/charon
brew install --cask lucasraffalli/engram/kairos
```
