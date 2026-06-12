// ============================================================
//  VISUAL NOVEL ENGINE  —  script.js
// ============================================================

// ── 1. SCÉNARIO ─────────────────────────────────────────────
//
//  Chaque entrée du tableau `story` peut être :
//
//  { type: "dialogue",
//    character : "Nom affiché",           ← laisser "" pour narrateur
//    image     : "URL de l'image PNG",    ← laisser "" pour pas de perso
//    background: "URL de l'image fond",   ← laisser "" pour ne pas changer
//    text      : "Texte affiché" }
//
//  { type: "choice",
//    choices: [
//      { label: "Option A", next: 5 },    ← next = index dans story[]
//      { label: "Option B", next: 8 },
//    ]}
//
// ============================================================

const story = [

  // ── PROLOGUE ──
  {
    type: "dialogue",
    character: "",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "Une nuit froide de novembre. La ville dort sous un ciel sans étoiles…"
  },
  {
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "",
    text: "Le train entre en gare à minuit pile. Sur le quai désert, une silhouette attend."
  },

  // ── SCÈNE 1 ──
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1280&q=80",
    text: "Vous êtes enfin là. J'ai failli ne plus y croire."
  },
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Il y a des choses que je dois vous montrer. Des choses que personne d'autre ne peut voir."
  },

  // ── CHOIX ──
  {
    type: "choice",
    choices: [
      { label: "« Je vous suis. »",            next: 5 },
      { label: "« Pourquoi moi ? »",           next: 7 },
    ]
  },

  // ── BRANCHE A ──
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1280&q=80",
    text: "Bien. La nuit n'attend pas. Suivez-moi sans bruit."
  },
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Vous avez fait le bon choix. Vous verrez bientôt pourquoi."
  },
  {
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "— FIN DU CHAPITRE 1 —\n\nMerci d'avoir joué ! Ajoutez vos propres scènes dans story[] pour continuer l'aventure."
  },

  // ── BRANCHE B ──
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1280&q=80",
    text: "Parce que vous êtes le seul à pouvoir encore changer ce qui va arriver."
  },
  {
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Je sais que c'est difficile à croire. Mais le temps presse. Venez."
  },
  {
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "— FIN DU CHAPITRE 1 —\n\nMerci d'avoir joué ! Ajoutez vos propres scènes dans story[] pour continuer l'aventure."
  },
];


// ── 2. ÉTAT DU JEU ──────────────────────────────────────────

const state = {
  index     : 0,
  autoMode  : false,
  autoTimer : null,
  isTyping  : false,
  log       : [],           // historique des dialogues
  saves     : [],           // sauvegardes
};


// ── 3. RÉFÉRENCES DOM ──────────────────────────────────────

const $ = id => document.getElementById(id);

const dom = {
  titleScreen  : $("title-screen"),
  gameScreen   : $("game-screen"),
  background   : $("background"),
  charImg      : $("character-img"),
  charContainer: $("character-container"),
  dialogueBox  : $("dialogue-box"),
  charName     : $("character-name"),
  dialogueText : $("dialogue-text"),
  nextArrow    : $("next-arrow"),
  choices      : $("choices-container"),
  logPanel     : $("log-panel"),
  logEntries   : $("log-entries"),
  btnAuto      : $("btn-auto"),
  btnSkip      : $("btn-skip"),
};


// ── 4. MOTEUR ───────────────────────────────────────────────

/** Affiche l'entrée story[index] */
function showStep(index) {
  if (index >= story.length) return;
  state.index = index;
  const step = story[index];

  if (step.type === "dialogue") showDialogue(step);
  if (step.type === "choice")   showChoices(step);
}

/** Dialogue */
function showDialogue(step) {
  dom.choices.classList.add("hidden");
  dom.nextArrow.style.display = "";

  // Arrière-plan
  if (step.background) {
    dom.background.style.backgroundImage = `url('${step.background}')`;
  }

  // Personnage
  if (step.image) {
    dom.charImg.src = step.image;
    dom.charContainer.style.display = "";
    dom.charImg.className = "fade-in";
  } else {
    dom.charContainer.style.display = "none";
  }

  // Nom
  dom.charName.textContent = step.character || "";

  // Texte avec effet machine à écrire
  typeText(step.text, () => {
    if (state.autoMode) state.autoTimer = setTimeout(advance, 2200);
  });

  // Journal
  if (step.text) {
    state.log.push({ name: step.character || "Narrateur", line: step.text });
  }
}

/** Choix */
function showChoices(step) {
  dom.nextArrow.style.display = "none";
  dom.choices.innerHTML = "";
  dom.choices.classList.remove("hidden");

  step.choices.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = c.label;
    btn.addEventListener("click", () => {
      dom.choices.classList.add("hidden");
      showStep(c.next);
    });
    dom.choices.appendChild(btn);
  });
}

/** Effet machine à écrire */
function typeText(text, onDone) {
  state.isTyping = true;
  dom.dialogueText.textContent = "";
  let i = 0;
  const speed = 28; // ms par caractère

  function tick() {
    if (i >= text.length) {
      state.isTyping = false;
      if (onDone) onDone();
      return;
    }
    dom.dialogueText.textContent += text[i++];
    setTimeout(tick, speed);
  }
  tick();
}

/** Avancer ou compléter le texte */
function advance() {
  if (state.isTyping) {
    // Compléter immédiatement le texte en cours
    const step = story[state.index];
    if (step?.type === "dialogue") {
      state.isTyping = false;
      dom.dialogueText.textContent = step.text;
    }
    return;
  }

  const next = state.index + 1;
  if (next < story.length) showStep(next);
}


// ── 5. JOURNAL ──────────────────────────────────────────────

function openLog() {
  dom.logEntries.innerHTML = "";
  state.log.forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `<span class="log-name">${entry.name}</span>
                     <span class="log-line">${entry.line}</span>`;
    dom.logEntries.appendChild(div);
  });
  dom.logPanel.classList.remove("hidden");
}


// ── 6. SAUVEGARDE / CHARGEMENT ──────────────────────────────

function saveGame() {
  const slot = { index: state.index, log: [...state.log] };
  try {
    localStorage.setItem("vn_save", JSON.stringify(slot));
    flash(dom.btnSave, "Sauvegardé ✓");
  } catch { alert("Impossible de sauvegarder (localStorage non disponible)."); }
}

function loadGame() {
  try {
    const raw = localStorage.getItem("vn_save");
    if (!raw) { alert("Aucune sauvegarde trouvée."); return; }
    const slot = JSON.parse(raw);
    state.log = slot.log || [];
    showStep(slot.index);
    flash($("btn-load"), "Chargé ✓");
  } catch { alert("Erreur lors du chargement."); }
}

function flash(btn, msg) {
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = orig; }, 1500);
}


// ── 7. ÉVÉNEMENTS ───────────────────────────────────────────

$("btn-start").addEventListener("click", () => {
  dom.titleScreen.classList.add("hidden");
  dom.gameScreen.classList.remove("hidden");
  showStep(0);
});

dom.dialogueBox.addEventListener("click", () => {
  if (!dom.choices.classList.contains("hidden")) return; // ignorer si choix visibles
  clearTimeout(state.autoTimer);
  advance();
});

document.addEventListener("keydown", e => {
  if (e.code === "Space" || e.code === "ArrowRight" || e.code === "Enter") {
    if (dom.gameScreen.classList.contains("hidden")) return;
    if (!dom.choices.classList.contains("hidden")) return;
    clearTimeout(state.autoTimer);
    advance();
  }
});

dom.btnAuto.addEventListener("click", () => {
  state.autoMode = !state.autoMode;
  dom.btnAuto.classList.toggle("active", state.autoMode);
  if (!state.autoMode) clearTimeout(state.autoTimer);
  else if (!state.isTyping) state.autoTimer = setTimeout(advance, 2200);
});

$("btn-skip").addEventListener("click", () => {
  clearTimeout(state.autoTimer);
  state.isTyping = false;
  advance();
});

$("btn-log").addEventListener("click", openLog);
$("btn-close-log").addEventListener("click", () => dom.logPanel.classList.add("hidden"));
$("btn-save").addEventListener("click", saveGame);
$("btn-load").addEventListener("click", loadGame);