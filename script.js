// ============================================================
//  VISUAL NOVEL ENGINE  —  script.js
// ============================================================

// ── 1. SCÉNARIO ─────────────────────────────────────────────
//
//  Chaque entrée a un ID unique (id: "nom_scene") que tu choisis toi-même.
//  Pour les choix, utilise cet ID dans "next" — plus besoin de compter les lignes !
//
//  { id: "nom_de_la_scene",   ← identifiant unique, tu mets ce que tu veux
//    type: "dialogue",
//    character : "Nom affiché",           ← "" pour narrateur
//    image     : "URL image personnage",  ← "" pour aucun personnage
//    background: "URL image fond",        ← "" pour ne pas changer le fond
//    text      : "Texte affiché" }
//
//  { id: "mon_choix",
//    type: "choice",
//    choices: [
//      { label: "Option A", next: "scene_a" },   ← next = id d'une autre scène
//      { label: "Option B", next: "scene_b" },
//    ]}
//
// ============================================================

const story = [

  // ── PROLOGUE ──────────────────────────────────────────────

  {
    id: "prologue_nuit",
    type: "dialogue",
    character: "",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "Une nuit froide de novembre. La ville dort sous un ciel sans étoiles…"
  },
  {
    id: "prologue_train",
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "",
    text: "Le train entre en gare à minuit pile. Sur le quai désert, une silhouette attend."
  },

  // ── SCÈNE 1 ───────────────────────────────────────────────

  {
    id: "elara_arrive",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1280&q=80",
    text: "Vous êtes enfin là. J'ai failli ne plus y croire."
  },
  {
    id: "elara_mystere",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Il y a des choses que je dois vous montrer. Des choses que personne d'autre ne peut voir."
  },

  // ── CHOIX ─────────────────────────────────────────────────

  {
    id: "choix_1",
    type: "choice",
    choices: [
      { label: "« Je vous suis. »",   next: "branche_a_suite" },
      { label: "« Pourquoi moi ? »",  next: "branche_b_question" },
    ]
  },

  // ── BRANCHE A : "Je vous suis" ────────────────────────────

  {
    id: "branche_a_suite",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1280&q=80",
    text: "Bien. La nuit n'attend pas. Suivez-moi sans bruit."
  },
  {
    id: "branche_a_fin",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Vous avez fait le bon choix. Vous verrez bientôt pourquoi."
  },
  {
    id: "fin_chapitre_a",
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "— FIN DU CHAPITRE 1 —\n\nMerci d'avoir joué ! Ajoutez vos propres scènes dans story[] pour continuer l'aventure."
  },

  // ── BRANCHE B : "Pourquoi moi ?" ─────────────────────────

  {
    id: "branche_b_question",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1280&q=80",
    text: "Parce que vous êtes le seul à pouvoir encore changer ce qui va arriver."
  },
  {
    id: "branche_b_suite",
    type: "dialogue",
    character: "Elara",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
    background: "",
    text: "Je sais que c'est difficile à croire. Mais le temps presse. Venez."
  },
  {
    id: "fin_chapitre_b",
    type: "dialogue",
    character: "Narrateur",
    image: "",
    background: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=80",
    text: "— FIN DU CHAPITRE 1 —\n\nMerci d'avoir joué ! Ajoutez vos propres scènes dans story[] pour continuer l'aventure."
  },
];


// ============================================================
//  MOTEUR — ne pas modifier sauf si tu sais ce que tu fais
// ============================================================

// Index par ID pour retrouver une scène rapidement
const storyIndex = {};
story.forEach((step, i) => { if (step.id) storyIndex[step.id] = i; });

const state = {
  index    : 0,
  autoMode : false,
  autoTimer: null,
  isTyping : false,
  log      : [],
};

// ── DOM (résolu après chargement complet) ──
let dom = {};

function initDOM() {
  const g = id => document.getElementById(id);
  dom = {
    titleScreen  : g("title-screen"),
    gameScreen   : g("game-screen"),
    background   : g("background"),
    charImg      : g("character-img"),
    charContainer: g("character-container"),
    dialogueBox  : g("dialogue-box"),
    charName     : g("character-name"),
    dialogueText : g("dialogue-text"),
    nextArrow    : g("next-arrow"),
    choices      : g("choices-container"),
    logPanel     : g("log-panel"),
    logEntries   : g("log-entries"),
    btnAuto      : g("btn-auto"),
    btnSave      : g("btn-save"),
    btnLoad      : g("btn-load"),
  };
}

// ── Navigation ──

function showStep(indexOrId) {
  const idx = typeof indexOrId === "string" ? storyIndex[indexOrId] : indexOrId;
  if (idx === undefined || idx >= story.length) return;
  state.index = idx;
  const step = story[idx];
  if (step.type === "dialogue") showDialogue(step);
  if (step.type === "choice")   showChoices(step);
}

function showDialogue(step) {
  dom.choices.classList.add("hidden");
  dom.nextArrow.style.display = "";

  if (step.background) {
    dom.background.style.backgroundImage = `url('${step.background}')`;
  }

  if (step.image) {
    dom.charImg.src = step.image;
    dom.charContainer.style.display = "";
    dom.charImg.className = "fade-in";
  } else {
    dom.charContainer.style.display = "none";
  }

  dom.charName.textContent = step.character || "";
  typeText(step.text, () => {
    if (state.autoMode) state.autoTimer = setTimeout(advance, 2200);
  });

  if (step.text) state.log.push({ name: step.character || "Narrateur", line: step.text });
}

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

function typeText(text, onDone) {
  state.isTyping = true;
  dom.dialogueText.textContent = "";
  let i = 0;
  const tick = () => {
    if (i >= text.length) { state.isTyping = false; if (onDone) onDone(); return; }
    dom.dialogueText.textContent += text[i++];
    setTimeout(tick, 28);
  };
  tick();
}

function advance() {
  if (state.isTyping) {
    const step = story[state.index];
    if (step?.type === "dialogue") { state.isTyping = false; dom.dialogueText.textContent = step.text; }
    return;
  }
  const next = state.index + 1;
  if (next < story.length) showStep(next);
}

// ── Journal ──

function openLog() {
  dom.logEntries.innerHTML = "";
  state.log.forEach(entry => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `<span class="log-name">${entry.name}</span><span class="log-line">${entry.line}</span>`;
    dom.logEntries.appendChild(div);
  });
  dom.logPanel.classList.remove("hidden");
}

// ── Sauvegarde ──

function saveGame() {
  try {
    localStorage.setItem("vn_save", JSON.stringify({ index: state.index, log: [...state.log] }));
    flash(dom.btnSave, "Sauvegardé ✓");
  } catch { alert("Impossible de sauvegarder."); }
}

function loadGame() {
  try {
    const raw = localStorage.getItem("vn_save");
    if (!raw) { alert("Aucune sauvegarde trouvée."); return; }
    const slot = JSON.parse(raw);
    state.log = slot.log || [];
    showStep(slot.index);
    flash(dom.btnLoad, "Chargé ✓");
  } catch { alert("Erreur lors du chargement."); }
}

function flash(btn, msg) {
  const orig = btn.textContent;
  btn.textContent = msg;
  setTimeout(() => { btn.textContent = orig; }, 1500);
}

// ── Init au chargement ──

document.addEventListener("DOMContentLoaded", () => {
  initDOM();

  document.getElementById("btn-start").addEventListener("click", () => {
    dom.titleScreen.classList.add("hidden");
    dom.gameScreen.classList.remove("hidden");
    showStep(0);
  });

  dom.dialogueBox.addEventListener("click", () => {
    if (!dom.choices.classList.contains("hidden")) return;
    clearTimeout(state.autoTimer);
    advance();
  });

  document.addEventListener("keydown", e => {
    if (!["Space","ArrowRight","Enter"].includes(e.code)) return;
    if (dom.gameScreen.classList.contains("hidden")) return;
    if (!dom.choices.classList.contains("hidden")) return;
    clearTimeout(state.autoTimer);
    advance();
  });

  dom.btnAuto.addEventListener("click", () => {
    state.autoMode = !state.autoMode;
    dom.btnAuto.classList.toggle("active", state.autoMode);
    if (!state.autoMode) clearTimeout(state.autoTimer);
    else if (!state.isTyping) state.autoTimer = setTimeout(advance, 2200);
  });

  document.getElementById("btn-skip").addEventListener("click", () => {
    clearTimeout(state.autoTimer);
    state.isTyping = false;
    advance();
  });

  document.getElementById("btn-log").addEventListener("click", openLog);
  document.getElementById("btn-close-log").addEventListener("click", () => dom.logPanel.classList.add("hidden"));
  dom.btnSave.addEventListener("click", saveGame);
  dom.btnLoad.addEventListener("click", loadGame);
});