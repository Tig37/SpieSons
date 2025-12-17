
# Mes petits sons

Un site statique minimal pour jouer tes sons. Les boutons sont générés automatiquement depuis `sounds.json`.

## Ajouter des sons
1. Place tes fichiers audio dans le dossier `sounds/` (formats conseillés: `.mp3`).
2. Édite `sounds.json` et ajoute une entrée par son:
```json
[
  { "title": "Son 1", "file": "sounds/son1.mp3" },
  { "title": "Son 2", "file": "sounds/son2.mp3" }
]
```
3. Pousse tes changements sur GitHub. GitHub Pages déploiera automatiquement.

## Déploiement sur GitHub Pages
- Paramètre: *Settings* → *Pages* → `Deploy from a branch` → Branch `main` → `/root`.
- URL: `https://<utilisateur>.github.io/<nom-du-repo>/`

## Accessibilité & Mobile
- La lecture démarre au clic (conforme aux politiques d'autoplay des navigateurs).
- Les boutons ont des `aria-label` et un statut `aria-live`.

## Licence
Tu es libre de modifier et utiliser ce projet.
