# 🎭 The Literary Club - Visual Novel

Un jeu de narratif sombre et psychologique dans l'esprit de *The Coffin Of Andy And Leyley*.

## 📖 Description du Jeu

Vous êtes un nouvel étudiant qui arrive au lycée Étoile du Soir. Le hasard (ou peut-être pas) vous amène à rencontrer Nami, responsable du Club de Littérature. Ce qui commence comme une simple journée de classe devient progressivement plus étrange et perturbant...

**Thème** : Métafiction, réalité ambiguë, psychologique sombre
**Format** : Visual novel textuel avec des moments de choix
**Personnages** : 1 personnage principal (Nami) que vous rencontrez
**Durée** : ~10-15 minutes pour une partie complète

## 🎮 Mécanique du Jeu

- **Clic/Espace** : Avancer dans le dialogue
- **Choix** : Cliquezdans les moments clés pour influencer l'histoire
- **Affection** : Vos choix affectent votre relation avec Nami

## 📁 Structure du Projet

```
twodepressedB-/
├── index.html          # Fichier principal
├── js/
│   ├── game.js         # Moteur de jeu
│   ├── scenes.js       # Définition de la narration
│   ├── dialogue.js     # Système de dialogue
│   └── player.js       # Gestion du joueur
├── README.md
└── index.html.backup   # Sauvegarde de l'ancienne version
```

## 🚀 Comment Lancer le Jeu

### Option 1 : Avec un serveur local (recommandé)

```bash
cd /workspaces/twodepressedB-
python3 -m http.server 8000
```

Puis ouvrez : `http://localhost:8000`

### Option 2 : Directement dans le navigateur

Ouvrez simplement `index.html` dans votre navigateur.

## 🎨 Personnalisation

Vous pouvez modifier :

- **Scènes** : Éditez `js/scenes.js` pour ajouter ou modifier des dialogues
- **Personnages** : Modifiez le SVG de Nami dans `index.html`
- **Style** : Personnalisez les couleurs et animations dans `index.html`

## 📝 Scènes Actuelles

1. **Acte 1** : Première rencontre dans le couloir
2. **Acte 2** : Visite du Club de Littérature
3. **Acte 3** : Conversation profonde avec Nami
4. **Acte 4** : Révélation et crescendo psychologique
5. **Épilogue** : Fin ambiguë

## 🔧 Développement Futur

- [ ] Ajouter des images de fond personnalisées
- [ ] Implémenter un système de sauvegarde
- [ ] Ajouter des effets sonores
- [ ] Créer des branches narratives multiples
- [ ] Ajouter des mini-jeux (poème, énigmes)

## 📜 Crédits

Créé avec ❤️ en utilisant vanilla JavaScript, HTML5, et CSS3.

Inspiré par *The Coffin Of Andy And Leyley* et les visual novels psychologiques.