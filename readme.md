# 🎭 Visual Novel — Base de départ

Un moteur de visual novel léger, jouable directement dans le navigateur, sans dépendances.

## 🚀 Mise en ligne sur GitHub Pages

1. Crée un nouveau dépôt sur GitHub (ex. `mon-visual-novel`)
2. Upload les 3 fichiers/dossiers :
   ```
   index.html
   css/style.css
   js/script.js
   ```
3. Va dans **Settings → Pages → Source : `main` / `root`**
4. Ton jeu est en ligne sur `https://TON-PSEUDO.github.io/mon-visual-novel/`

---

## ✍️ Écrire ton scénario

Tout le scénario se trouve dans le tableau `story[]` au début de `js/script.js`.

### Dialogue simple

```js
{
  type      : "dialogue",
  character : "Elara",                          // nom affiché (vide = narrateur)
  image     : "https://example.com/elara.png", // image du personnage (PNG transparent conseillé)
  background: "https://example.com/foret.jpg", // arrière-plan (vide = pas de changement)
  text      : "Bienvenue dans cette forêt mystérieuse."
}
```

### Choix (embranchement)

```js
{
  type: "choice",
  choices: [
    { label: "« Entrer dans la forêt »", next: 5 },  // next = index dans story[]
    { label: "« Faire demi-tour »",      next: 9 },
  ]
}
```

> **Astuce :** numérote tes scènes en commentaires (`// scène 5`) pour repérer facilement les index.

---

## ⚙️ Personnaliser le titre

Dans `index.html`, modifie :
```html
<h1 id="game-title">Mon Visual Novel</h1>
<p id="game-subtitle">Une histoire à découvrir…</p>
```

---

## 🎨 Personnaliser les couleurs

Dans `css/style.css`, change les variables CSS au début du fichier :
```css
:root {
  --accent    : #a08cff;   /* couleur principale (violet par défaut) */
  --text-name : #c9b8ff;   /* couleur du nom du personnage */
  ...
}
```

---

## 🕹️ Contrôles du jeu

| Action | Clavier | Souris |
|--------|---------|--------|
| Avancer | `Espace` / `→` / `Entrée` | Clic sur la boîte |
| Compléter le texte | idem | idem |
| Auto | — | Bouton ⏵ Auto |
| Passer | — | Bouton ⏭ Passer |
| Journal | — | Bouton 📜 Log |
| Sauvegarder | — | Bouton 💾 Save |
| Charger | — | Bouton 📂 Load |

---

## 📁 Structure du projet

```
index.html        ← structure de la page
css/style.css     ← tout le style
js/script.js      ← moteur + scénario (story[])
```

---

## 💡 Conseils pour les images

- **Personnages :** PNG avec fond transparent, hauteur ~800–1000 px
- **Arrière-plans :** JPG/WEBP, résolution 1280×720 minimum
- **Hébergement gratuit :** [Unsplash](https://unsplash.com), [imgur.com](https://imgur.com), ou dans un dossier `assets/` de ton dépôt GitHub