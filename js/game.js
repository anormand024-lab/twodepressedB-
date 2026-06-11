/**
 * GAME ENGINE - Moteur principal du jeu
 * Gère l'état global, les transitions et le flux narratif
 */

class GameEngine {
  constructor() {
    this.currentScene = 0;
    this.state = {
      playerName: 'Vous',
      affection: { nami: 0, },
      flags: {},
      inventory: [],
      sceneGroup: null,
    };
    this.isTyping = false;
    this.dialogueText = '';
    this.typeIndex = 0;
    this.typeTimer = null;
    this.gameStarted = false;
    this.waitingForChoice = false;
  }

  /**
   * Initialise le jeu
   */
  init() {
    initCHARS();
    this.attachEventListeners();
    this.showTitleScreen();
  }

  /**
   * Attache les écouteurs d'événements
   */
  attachEventListeners() {
    document.addEventListener('click', (e) => this.handleClick(e));
    document.addEventListener('keydown', (e) => this.handleKeypress(e));
  }

  /**
   * Gère les clics souris
   */
  handleClick(e) {
    // Clic sur bouton de choix = déjà géré
    if (e.target.classList.contains('choice-btn')) {
      return;
    }
    
    // Si on est dans un dialogue et pas en train de choisir
    if (this.gameStarted && !this.waitingForChoice) {
      this.nextScene();
    }
  }

  /**
   * Gère les touches clavier
   */
  handleKeypress(e) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (this.gameStarted && !this.waitingForChoice) {
        this.nextScene();
      }
    }
  }

  /**
   * Affiche l'écran titre
   */
  showTitleScreen() {
    document.getElementById('title-screen').style.display = 'flex';
  }

  /**
   * Lance le jeu
   */
  startGame() {
    this.gameStarted = true;
    document.getElementById('title-screen').style.display = 'none';
    this.loadScene(0);
  }

  /**
   * Charge une scène
   */
  loadScene(sceneIndex) {
    if (sceneIndex >= SCENES.length) {
      this.endGame();
      return;
    }

    this.currentScene = sceneIndex;
    const scene = SCENES[sceneIndex];

    // Changement de groupe de scène → fondu noir
    if (scene.sceneGroup && scene.sceneGroup !== this.state.sceneGroup && !scene.transition) {
      this.playTransition(() => this.renderScene(scene));
      this.state.sceneGroup = scene.sceneGroup;
    } else {
      if (scene.transition) {
        this.playTransition(() => this.renderScene(scene));
      } else {
        this.renderScene(scene);
      }
      if (scene.sceneGroup) {
        this.state.sceneGroup = scene.sceneGroup;
      }
    }
  }

  /**
   * Rend une scène
   */
  renderScene(scene) {
    this.waitingForChoice = false;
    
    // Fond
    if (scene.bg) {
      this.setBackground(scene.bg);
    }

    // Personnages
    if (scene.show) {
      this.updateCharacters(scene.show, scene.active, scene.dimmed || []);
    } else if (scene.show === null || scene.show === undefined) {
      // Masquer tous les personnages si show est null
      Object.keys(CHARS).forEach(name => {
        if (CHARS[name] && CHARS[name].el) {
          CHARS[name].el.classList.add('hidden');
        }
      });
    }

    // Dialogue
    if (scene.name && scene.text) {
      this.displayDialogue(scene.name, scene.text);
    }

    // Choix
    if (scene.type === 'choice' && scene.choices) {
      this.waitingForChoice = true;
      setTimeout(() => this.displayChoices(scene.choices), 800);
    }

    // Auto-avance
    if (scene.pause && !scene.type) {
      setTimeout(() => this.nextScene(), scene.pause);
    }
  }

  /**
   * Change le fond
   */
  setBackground(bgName) {
    const bg = document.getElementById('bg');
    bg.className = `scene-${bgName}`;
  }

  /**
   * Met à jour les personnages
   */
  updateCharacters(show, active, dimmed) {
    // Masquer tous les personnages
    Object.keys(CHARS).forEach(name => {
      if (CHARS[name] && CHARS[name].el) {
        CHARS[name].el.classList.add('hidden');
      }
    });

    // Afficher les personnages demandés
    show.forEach(name => {
      if (CHARS[name] && CHARS[name].el) {
        CHARS[name].el.classList.remove('hidden');
        CHARS[name].el.classList.remove('dimmed');
        CHARS[name].el.classList.remove('active');
      }
    });

    // Marquer le personnage actif
    if (active && CHARS[active] && CHARS[active].el) {
      CHARS[active].el.classList.add('active');
    }

    // Assombrir les personnages
    dimmed.forEach(name => {
      if (CHARS[name] && CHARS[name].el) {
        CHARS[name].el.classList.add('dimmed');
      }
    });
  }

  /**
   * Affiche un dialogue avec effet de typing
   */
  displayDialogue(speaker, text) {
    const nameEl = document.getElementById('nametag');
    const dialogueEl = document.getElementById('dialogue-text');
    const cursorEl = document.getElementById('cursor');

    // Mettre le nom du speaker
    if (CHAR_NAMES[speaker]) {
      nameEl.textContent = CHAR_NAMES[speaker];
      nameEl.style.color = CHAR_COLORS[speaker] || 'var(--pink)';
    }

    // Réinitialiser
    this.isTyping = true;
    this.dialogueText = text;
    this.typeIndex = 0;
    dialogueEl.textContent = '';
    cursorEl.classList.add('show');

    // Démarrer le typing
    this.typeDialogue(dialogueEl, cursorEl);
  }

  /**
   * Effet de typing pour le dialogue
   */
  typeDialogue(textEl, cursorEl) {
    if (this.typeIndex < this.dialogueText.length) {
      textEl.textContent += this.dialogueText[this.typeIndex];
      this.typeIndex++;
      this.typeTimer = setTimeout(() => this.typeDialogue(textEl, cursorEl), 40);
    } else {
      this.isTyping = false;
      cursorEl.classList.remove('show');
    }
  }

  /**
   * Affiche les choix
   */
  displayChoices(choices) {
    const choicesEl = document.getElementById('choices');
    choicesEl.innerHTML = '';
    choicesEl.style.display = 'flex';

    choices.forEach((choice) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.onclick = () => this.selectChoice(choice);
      choicesEl.appendChild(btn);
    });
  }

  /**
   * Traite un choix
   */
  selectChoice(choice) {
    // Masquer les choix
    document.getElementById('choices').style.display = 'none';

    // Appliquer les effets du choix
    if (choice.aff) {
      Object.keys(choice.aff).forEach(char => {
        if (!this.state.affection[char]) {
          this.state.affection[char] = 0;
        }
        this.state.affection[char] += choice.aff[char];
      });
    }

    if (choice.flag) {
      this.state.flags[choice.flag] = true;
    }

    // Aller à la scène suivante
    this.loadScene(choice.next || this.currentScene + 1);
  }

  /**
   * Avance à la scène suivante
   */
  nextScene() {
    if (this.isTyping) {
      // Terminer le typing
      this.isTyping = false;
      document.getElementById('cursor').classList.remove('show');
      clearTimeout(this.typeTimer);
      const textEl = document.getElementById('dialogue-text');
      textEl.textContent = this.dialogueText;
      return;
    }

    if (this.waitingForChoice) {
      return;
    }

    this.loadScene(this.currentScene + 1);
  }

  /**
   * Transition (fondu noir)
   */
  playTransition(callback) {
    const fade = document.getElementById('fade');
    fade.classList.add('in');
    setTimeout(() => {
      callback();
      setTimeout(() => {
        fade.classList.remove('in');
      }, 100);
    }, 500);
  }

  /**
   * Fin du jeu
   */
  endGame() {
    const textEl = document.getElementById('dialogue-text');
    const nameEl = document.getElementById('nametag');
    textEl.textContent = 'FIN DU JEU';
    nameEl.textContent = '✦';
  }
}

// Données des personnages
let CHARS = {};

const CHAR_COLORS = {
  nami: '#90caf9',
  narrator: 'rgba(240,232,245,0.5)',
  system: '#ff1744',
};

const CHAR_NAMES = {
  nami: 'Nami',
  narrator: '???',
  system: '✗✗✗',
};

// Fonction globale pour démarrer le jeu
function startGame() {
  if (window.engine) {
    window.engine.startGame();
  }
}

// Initialiser CHARS une fois que le DOM est prêt
function initCHARS() {
  CHARS = {
    nami: { el: document.getElementById('char-nami'), nameEl: null },
  };
}
