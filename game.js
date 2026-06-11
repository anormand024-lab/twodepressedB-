/* ============================================================
   CHAMBRE 404 — Moteur de jeu
   Horreur psychologique, navigation point & click
   ============================================================ */

const Game = (() => {

  /* ── STATE ─────────────────────────────────────────── */
  let state = {
    scene: 'chambre',
    sanity: 100,
    inventory: [],
    flags: {},
    dialogueQueue: [],
    dialogueIndex: 0,
    isDialogue: false,
    isChoices: false,
    typeInterval: null,
    typeText: '',
    typeTarget: '',
    typeDone: false,
  };

  /* ── CANVAS ─────────────────────────────────────────── */
  const canvas = document.getElementById('scene-canvas');
  const ctx = canvas.getContext('2d');
  const portraitCanvas = document.getElementById('portrait-canvas');
  const pCtx = portraitCanvas.getContext('2d');

  function resizeCanvas() {
    const area = document.getElementById('scene-area');
    canvas.width = area.clientWidth;
    canvas.height = area.clientHeight;
    portraitCanvas.width = 64;
    portraitCanvas.height = 64;
    renderScene(state.scene);
  }

  /* ── SCENE RENDERERS ────────────────────────────────── */

  const SCENES = {

    chambre: {
      label: 'LA CHAMBRE',
      render(w, h) {
        // Mur + sol
        ctx.fillStyle = '#0e0a0c';
        ctx.fillRect(0, 0, w, h);
        // Plancher
        ctx.fillStyle = '#130f11';
        ctx.fillRect(0, h * 0.65, w, h * 0.35);
        // Ligne sol
        ctx.strokeStyle = '#1e1618';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, h * 0.65); ctx.lineTo(w, h * 0.65); ctx.stroke();

        // Fenêtre murée
        drawWindow(w * 0.15, h * 0.12, w * 0.22, h * 0.38);

        // Lit
        drawBed(w * 0.52, h * 0.42, w * 0.42, h * 0.3);

        // Porte
        drawDoor(w * 0.75, h * 0.2, w * 0.14, h * 0.45);

        // Table de nuit
        drawNightstand(w * 0.45, h * 0.58, w * 0.08, h * 0.12);

        // Taches sur le mur (atmosphère)
        ctx.fillStyle = 'rgba(80,20,20,0.12)';
        ctx.beginPath(); ctx.ellipse(w * 0.3, h * 0.25, 30, 18, 0.3, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(w * 0.62, h * 0.4, 12, 8, -0.5, 0, Math.PI*2); ctx.fill();
      },
      exits: [],
      hotspots: [
        { id: 'fenetre', label: 'Fenêtre', x: 0.26, y: 0.35, action: 'inspect_fenetre' },
        { id: 'lit',     label: 'Lit',     x: 0.72, y: 0.6,  action: 'inspect_lit'    },
        { id: 'porte',   label: 'Porte',   x: 0.82, y: 0.52, action: 'inspect_porte'  },
        { id: 'table',   label: 'Table',   x: 0.49, y: 0.65, action: 'inspect_table'  },
      ]
    },

    couloir: {
      label: 'LE COULOIR',
      render(w, h) {
        ctx.fillStyle = '#090709';
        ctx.fillRect(0, 0, w, h);
        // Perspective corridor
        ctx.fillStyle = '#100e10';
        ctx.beginPath();
        ctx.moveTo(0, 0); ctx.lineTo(w, 0); ctx.lineTo(w, h);
        ctx.lineTo(0, h); ctx.closePath(); ctx.fill();

        // Vanishing point effect
        const vx = w * 0.5, vy = h * 0.42;
        // Floor lines
        ctx.strokeStyle = '#1a151a';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 8; i++) {
          const x = (w / 8) * i;
          ctx.beginPath(); ctx.moveTo(x, h); ctx.lineTo(vx, vy); ctx.stroke();
        }
        // Ceiling lines
        for (let i = 0; i <= 8; i++) {
          const x = (w / 8) * i;
          ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(vx, vy); ctx.stroke();
        }
        // Walls
        ctx.strokeStyle = '#221a22';
        for (let i = 1; i <= 4; i++) {
          const t = i / 5;
          const lx1 = lerp(0, vx, t), rx1 = lerp(w, vx, t);
          const ty1 = lerp(0, vy, t), by1 = lerp(h, vy, t);
          ctx.beginPath(); ctx.moveTo(lx1, ty1); ctx.lineTo(lx1, by1); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(rx1, ty1); ctx.lineTo(rx1, by1); ctx.stroke();
        }
        // Door at end
        ctx.fillStyle = '#0d0a0d';
        ctx.fillRect(w*0.42, h*0.28, w*0.16, h*0.28);
        ctx.strokeStyle = '#2a1f2a';
        ctx.strokeRect(w*0.42, h*0.28, w*0.16, h*0.28);

        // Flickering light
        const lum = 0.06 + Math.random() * 0.04;
        ctx.fillStyle = `rgba(200,180,140,${lum})`;
        ctx.beginPath();
        ctx.ellipse(vx, h * 0.05, 60, 25, 0, 0, Math.PI*2);
        ctx.fill();

        // Something on the floor
        ctx.fillStyle = 'rgba(100,20,20,0.5)';
        ctx.beginPath();
        ctx.ellipse(w * 0.5, h * 0.82, 18, 6, 0, 0, Math.PI*2);
        ctx.fill();
      },
      exits: [],
      hotspots: [
        { id: 'porte_fond', label: 'Porte du fond', x: 0.5,  y: 0.42, action: 'inspect_porte_fond' },
        { id: 'tache_sol',  label: '???',           x: 0.5,  y: 0.82, action: 'inspect_tache'       },
        { id: 'mur_gauche', label: 'Mur',           x: 0.15, y: 0.5,  action: 'inspect_mur_couloir' },
      ]
    },

    salle_bain: {
      label: 'LA SALLE DE BAIN',
      render(w, h) {
        ctx.fillStyle = '#080b0a';
        ctx.fillRect(0, 0, w, h);
        // Carrelage
        ctx.fillStyle = '#0c100f';
        ctx.fillRect(0, h * 0.6, w, h * 0.4);
        ctx.strokeStyle = '#141a18';
        ctx.lineWidth = 0.5;
        const ts = 32;
        for (let x = 0; x < w; x += ts) {
          ctx.beginPath(); ctx.moveTo(x, h*0.6); ctx.lineTo(x, h); ctx.stroke();
        }
        for (let y = h * 0.6; y < h; y += ts) {
          ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
        }

        // Miroir brisé
        drawMirror(w * 0.35, h * 0.1, w * 0.3, h * 0.45);

        // Lavabo
        drawSink(w * 0.38, h * 0.6, w * 0.24, h * 0.18);

        // Robinet qui goutte
        ctx.fillStyle = 'rgba(30,80,90,0.6)';
        ctx.beginPath();
        ctx.ellipse(w*0.5, h*0.82, 3, 5, 0, 0, Math.PI*2);
        ctx.fill();

        // Inscription sur le mur
        ctx.save();
        ctx.font = '11px monospace';
        ctx.fillStyle = 'rgba(120,40,40,0.5)';
        ctx.fillText('IL REVIENT', w * 0.07, h * 0.55);
        ctx.restore();
      },
      exits: [],
      hotspots: [
        { id: 'miroir',   label: 'Miroir',   x: 0.5,  y: 0.32, action: 'inspect_miroir'   },
        { id: 'lavabo',   label: 'Lavabo',   x: 0.5,  y: 0.72, action: 'inspect_lavabo'    },
        { id: 'mur_msg',  label: 'Inscription', x: 0.15, y: 0.55, action: 'inspect_inscription' },
      ]
    },

  };

  /* ── DESSIN HELPERS ─────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }

  function drawWindow(x, y, w, h) {
    ctx.fillStyle = '#0a0608';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#2a1f20';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);
    // Planches
    ctx.strokeStyle = '#1a1215';
    ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(x, y + h*0.25); ctx.lineTo(x+w, y + h*0.25); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x, y + h*0.6);  ctx.lineTo(x+w, y + h*0.6);  ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + w*0.3, y); ctx.lineTo(x + w*0.3, y+h); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#2a2020';
    // Peeking light behind
    ctx.fillStyle = 'rgba(50,30,20,0.15)';
    ctx.fillRect(x+3, y+3, w-6, h*0.2);
  }

  function drawBed(x, y, w, h) {
    const bx = x - w/2, by = y;
    // Frame
    ctx.fillStyle = '#1a1012';
    ctx.fillRect(bx, by, w, h);
    // Mattress
    ctx.fillStyle = '#1f1618';
    ctx.fillRect(bx + 4, by + h*0.15, w - 8, h * 0.7);
    // Pillow
    ctx.fillStyle = '#241a1c';
    ctx.fillRect(bx + 8, by + h*0.15, w * 0.35, h * 0.3);
    // Sheet (crumpled)
    ctx.strokeStyle = '#2e2022';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx + 4, by + h*0.55);
    ctx.bezierCurveTo(bx + w*0.3, by+h*0.45, bx+w*0.6, by+h*0.6, bx+w-4, by+h*0.5);
    ctx.stroke();
    // Headboard
    ctx.fillStyle = '#150e10';
    ctx.fillRect(bx, by - h*0.2, w, h*0.2);
    ctx.strokeStyle = '#2a1e20';
    ctx.lineWidth = 1;
    ctx.strokeRect(bx, by - h*0.2, w, h*0.2);
  }

  function drawDoor(x, y, w, h) {
    const dx = x - w/2;
    ctx.fillStyle = '#100c0e';
    ctx.fillRect(dx, y, w, h);
    ctx.strokeStyle = '#2a1f22';
    ctx.lineWidth = 2;
    ctx.strokeRect(dx, y, w, h);
    // Panel
    ctx.strokeStyle = '#1e1618';
    ctx.lineWidth = 1;
    ctx.strokeRect(dx+6, y+8, w-12, h*0.45);
    ctx.strokeRect(dx+6, y+8+h*0.45+6, w-12, h*0.4);
    // Handle
    ctx.fillStyle = '#3a2820';
    ctx.beginPath();
    ctx.arc(dx + w*0.75, y + h*0.55, 5, 0, Math.PI*2);
    ctx.fill();
    // Light under door
    ctx.fillStyle = 'rgba(200,160,100,0.06)';
    ctx.fillRect(dx+2, y+h, w-4, 3);
  }

  function drawNightstand(x, y, w, h) {
    ctx.fillStyle = '#130f11';
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = '#231820';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, w, h);
    // Drawer line
    ctx.beginPath(); ctx.moveTo(x, y + h*0.5); ctx.lineTo(x+w, y + h*0.5); ctx.stroke();
    // Object on top (medicine bottle?)
    ctx.fillStyle = '#1e2428';
    ctx.fillRect(x + w*0.3, y - h*0.5, w*0.2, h*0.55);
  }

  function drawMirror(x, y, w, h) {
    const mx = x - w/2;
    // Frame
    ctx.fillStyle = '#111410';
    ctx.fillRect(mx-4, y-4, w+8, h+8);
    ctx.strokeStyle = '#28321e';
    ctx.lineWidth = 2;
    ctx.strokeRect(mx-4, y-4, w+8, h+8);
    // Glass (dark reflection)
    ctx.fillStyle = '#0d0f0c';
    ctx.fillRect(mx, y, w, h);
    // Cracks
    ctx.strokeStyle = '#1e2818';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(mx + w*0.5, y);
    ctx.lineTo(mx + w*0.2, y + h*0.4);
    ctx.lineTo(mx + w*0.7, y + h*0.7);
    ctx.lineTo(mx + w*0.3, y + h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mx + w*0.5, y);
    ctx.lineTo(mx + w*0.8, y + h*0.3);
    ctx.stroke();
    // Vague reflection (silhouette)
    ctx.fillStyle = 'rgba(150,130,110,0.04)';
    ctx.beginPath();
    ctx.ellipse(mx + w*0.5, y + h*0.4, w*0.12, h*0.2, 0, 0, Math.PI*2);
    ctx.fill();
  }

  function drawSink(x, y, w, h) {
    const sx = x - w/2;
    ctx.fillStyle = '#121714';
    ctx.beginPath();
    ctx.moveTo(sx, y);
    ctx.lineTo(sx+w, y);
    ctx.lineTo(sx+w-6, y+h);
    ctx.lineTo(sx+6, y+h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#1e2820';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Drain
    ctx.fillStyle = '#0a0d0b';
    ctx.beginPath();
    ctx.ellipse(sx+w/2, y+h*0.7, 8, 5, 0, 0, Math.PI*2);
    ctx.fill();
    // Faucet
    ctx.fillStyle = '#1e2820';
    ctx.fillRect(sx+w*0.45, y-h*0.3, w*0.1, h*0.35);
  }

  /* ── PORTRAIT RENDERER ─────────────────────────────── */
  const PORTRAITS = {
    moi: (c, color) => {
      c.fillStyle = '#1a1215';
      c.fillRect(0,0,64,64);
      c.fillStyle = color || '#8b6055';
      c.beginPath(); c.arc(32, 24, 14, 0, Math.PI*2); c.fill();
      c.fillStyle = '#0e0a0c';
      c.beginPath(); c.arc(28, 22, 3, 0, Math.PI*2); c.fill();
      c.beginPath(); c.arc(36, 22, 3, 0, Math.PI*2); c.fill();
      // Corps
      c.fillStyle = color || '#8b6055';
      c.fillRect(22, 38, 20, 26);
    },
    elle: (c) => {
      c.fillStyle = '#1a1215';
      c.fillRect(0,0,64,64);
      // Silhouette sombre
      c.fillStyle = '#3a2830';
      c.beginPath(); c.arc(32, 22, 15, 0, Math.PI*2); c.fill();
      c.fillStyle = '#2a1e28';
      c.fillRect(20, 37, 24, 28);
      // Yeux brillants
      c.fillStyle = '#8b1a1a';
      c.beginPath(); c.arc(27, 21, 3, 0, Math.PI*2); c.fill();
      c.beginPath(); c.arc(37, 21, 3, 0, Math.PI*2); c.fill();
      // Cheveux longs
      c.fillStyle = '#1a1015';
      c.fillRect(16, 10, 8, 35);
      c.fillRect(40, 10, 8, 35);
    },
    voix: (c) => {
      c.fillStyle = '#0a0608';
      c.fillRect(0,0,64,64);
      c.strokeStyle = '#3a1a1a';
      c.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const amp = 6 + i * 3;
        c.beginPath();
        for (let x = 0; x < 64; x++) {
          const y = 32 + Math.sin(x * 0.3 + i) * amp * (1 - Math.abs(x-32)/32);
          if (x === 0) c.moveTo(x, y); else c.lineTo(x, y);
        }
        c.stroke();
      }
    }
  };

  function renderPortrait(who) {
    pCtx.clearRect(0, 0, 64, 64);
    const fn = PORTRAITS[who] || PORTRAITS.voix;
    fn(pCtx);
  }

  /* ── SCENE RENDER ───────────────────────────────────── */
  function renderScene(sceneId) {
    const s = SCENES[sceneId];
    if (!s) return;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    s.render(w, h);
    document.getElementById('location-label').textContent = s.label;
    buildHotspots(s.hotspots, w, h);
    buildNavExits(sceneId);
  }

  /* ── HOTSPOTS ───────────────────────────────────────── */
  function buildHotspots(hotspots, w, h) {
    const layer = document.getElementById('hotspots-layer');
    layer.innerHTML = '';
    hotspots.forEach(hs => {
      if (state.flags['used_' + hs.id]) return;
      const el = document.createElement('div');
      el.className = 'hotspot';
      el.style.left = (hs.x * 100) + '%';
      el.style.top  = (hs.y * 100) + '%';
      el.innerHTML = `<div class="hotspot-dot"></div><div class="hotspot-label">${hs.label}</div>`;
      el.addEventListener('click', () => triggerAction(hs.action, hs.id));
      layer.appendChild(el);
    });
  }

  /* ── NAV EXITS ──────────────────────────────────────── */
  const EXITS = {
    chambre:    [
      { label: '→ Couloir',      scene: 'couloir',   req: null,           reqMsg: null },
    ],
    couloir:    [
      { label: '← Chambre',      scene: 'chambre',   req: null,           reqMsg: null },
      { label: '→ Salle de bain', scene: 'salle_bain', req: 'cle_trouvee', reqMsg: 'La porte est verrouillée.' },
    ],
    salle_bain: [
      { label: '← Couloir',      scene: 'couloir',   req: null,           reqMsg: null },
    ],
  };

  function buildNavExits(sceneId) {
    const nav = document.getElementById('nav-exits');
    nav.innerHTML = '';
    (EXITS[sceneId] || []).forEach(exit => {
      const btn = document.createElement('button');
      btn.className = 'nav-btn';
      btn.textContent = exit.label;
      btn.addEventListener('click', () => {
        if (exit.req && !state.flags[exit.req]) {
          showDialogue([{ speaker: null, who: 'voix', text: exit.reqMsg }]);
        } else {
          goToScene(exit.scene);
        }
      });
      nav.appendChild(btn);
    });
  }

  function goToScene(sceneId) {
    state.scene = sceneId;
    renderScene(sceneId);
    // Trigger scene-entry dialogue
    const entryKey = 'entry_' + sceneId;
    if (!state.flags[entryKey]) {
      state.flags[entryKey] = true;
      const entry = ENTRY_DIALOGUES[sceneId];
      if (entry) showDialogue(entry);
    }
  }

  /* ── DIALOGUE ENGINE ────────────────────────────────── */
  function showDialogue(lines) {
    if (!lines || lines.length === 0) return;
    state.dialogueQueue = lines;
    state.dialogueIndex = 0;
    state.isDialogue = true;
    document.getElementById('choices-box').classList.add('hidden');
    document.getElementById('dialogue-box').classList.remove('hidden');
    displayLine(lines[0]);
  }

  function displayLine(line) {
    const box    = document.getElementById('dialogue-box');
    const speaker = document.getElementById('dialogue-speaker');
    const textEl = document.getElementById('dialogue-text');
    const cont   = document.getElementById('dialogue-continue');

    renderPortrait(line.who || 'voix');
    speaker.textContent = line.speaker || '';
    textEl.textContent  = '';
    cont.style.opacity  = '0';
    state.typeDone = false;
    state.typeTarget = line.text;

    // Typewriter
    if (state.typeInterval) clearInterval(state.typeInterval);
    let i = 0;
    const speed = line.speed || 28;
    state.typeInterval = setInterval(() => {
      if (i >= line.text.length) {
        clearInterval(state.typeInterval);
        state.typeDone = true;
        cont.style.opacity = '1';
        return;
      }
      textEl.textContent += line.text[i++];
    }, speed);
  }

  function advanceDialogue() {
    if (!state.isDialogue) return;
    // If still typing, skip to end
    if (!state.typeDone) {
      clearInterval(state.typeInterval);
      document.getElementById('dialogue-text').textContent = state.typeTarget;
      state.typeDone = true;
      document.getElementById('dialogue-continue').style.opacity = '1';
      return;
    }
    state.dialogueIndex++;
    const q = state.dialogueQueue;
    if (state.dialogueIndex < q.length) {
      const next = q[state.dialogueIndex];
      // Check for choices
      if (next.choices) {
        closeDialogue();
        showChoices(next.choices);
        return;
      }
      displayLine(next);
    } else {
      closeDialogue();
      // Check post-dialogue callback
      const lastLine = q[q.length - 1];
      if (lastLine && lastLine.onEnd) lastLine.onEnd();
    }
  }

  function closeDialogue() {
    state.isDialogue = false;
    document.getElementById('dialogue-box').classList.add('hidden');
  }

  /* ── CHOICES ENGINE ─────────────────────────────────── */
  function showChoices(choices) {
    state.isChoices = true;
    const box  = document.getElementById('choices-box');
    const list = document.getElementById('choices-list');
    list.innerHTML = '';
    box.classList.remove('hidden');
    choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = choice.text;
      btn.addEventListener('click', () => {
        box.classList.add('hidden');
        state.isChoices = false;
        if (choice.effect) choice.effect();
        if (choice.next)   showDialogue(choice.next);
      });
      list.appendChild(btn);
    });
  }

  /* ── SANITY ─────────────────────────────────────────── */
  function changeSanity(delta) {
    state.sanity = Math.max(0, Math.min(100, state.sanity + delta));
    const fill = document.getElementById('sanity-fill');
    fill.style.width = state.sanity + '%';
    const hue = state.sanity > 50 ? '#c43030' : '#8b1a1a';
    fill.style.background = hue;
    if (state.sanity <= 0) {
      setTimeout(() => triggerEnding('bad'), 800);
    }
  }

  /* ── INVENTORY ──────────────────────────────────────── */
  function addItem(id, label) {
    if (state.inventory.includes(id)) return;
    state.inventory.push(id);
    const bar = document.getElementById('inventory-items');
    const el  = document.createElement('div');
    el.className = 'inv-item';
    el.textContent = label;
    el.title = label;
    bar.appendChild(el);
  }

  /* ── ACTIONS ────────────────────────────────────────── */
  function triggerAction(actionId, hotspotId) {
    const fn = ACTIONS[actionId];
    if (fn) {
      fn(hotspotId);
    }
  }

  /* ── STORY DATA ─────────────────────────────────────── */

  const ENTRY_DIALOGUES = {
    chambre: [
      { speaker: null, who: 'voix', text: '…', speed: 80 },
      { speaker: null, who: 'voix', text: 'Quelque chose de dur. Froid. Tu es allongé sur un sol que tu ne reconnais pas.' },
      { speaker: null, who: 'voix', text: 'Non. Un lit. C\'est un lit.' },
      { speaker: 'MOI', who: 'moi', text: 'Où... où est-ce que je suis ?' },
      {
        choices: [
          {
            text: 'Rester calme et observer la pièce.',
            effect: () => changeSanity(0),
            next: [
              { speaker: null, who: 'voix', text: 'La chambre est petite. Sombre. Une fenêtre murée. Une porte.' },
              { speaker: null, who: 'voix', text: 'Et le sentiment, net comme du verre, que tu n\'es pas seul ici.' },
            ]
          },
          {
            text: 'Essayer de se lever d\'un coup.',
            effect: () => changeSanity(-10),
            next: [
              { speaker: null, who: 'voix', text: 'Tu te lèves trop vite. Ta tête tourne. Le sol vacille.' },
              { speaker: 'MOI', who: 'moi', text: '...Merde.' },
              { speaker: null, who: 'voix', text: 'Tu t\'agrippes au montant du lit et tu attends que ça passe.' },
            ]
          },
        ]
      }
    ],

    couloir: [
      { speaker: null, who: 'voix', text: 'Le couloir s\'étend devant toi comme une gorge.' },
      { speaker: null, who: 'voix', text: 'Il n\'y a pas de lumière — sauf celle qui filtre, imperceptible, par les fissures.' },
      { speaker: null, who: 'voix', text: 'À mi-chemin, tu vois quelque chose sur le sol.' },
    ],

    salle_bain: [
      { speaker: null, who: 'voix', text: 'L\'air ici est différent. Plus humide. Comme si la pièce transpirait.' },
      {
        speaker: 'ELLE', who: 'elle',
        text: 'Tu as mis du temps.',
        speed: 45,
      },
      { speaker: 'MOI', who: 'moi', text: 'Qui êtes-vous ?' },
      { speaker: 'ELLE', who: 'elle', text: 'La question n\'est pas qui je suis.', speed: 45 },
      { speaker: 'ELLE', who: 'elle', text: 'La question c\'est — pourquoi tu as mis autant de temps à venir ici.', speed: 45 },
      {
        choices: [
          {
            text: '"Je n\'avais pas la clé."',
            effect: () => changeSanity(0),
            next: [
              { speaker: 'ELLE', who: 'elle', text: 'Tu l\'avais. Tu l\'avais depuis le début.', speed: 45 },
              { speaker: null, who: 'voix', text: 'Elle te regarde fixement. Ses yeux ne cillent pas.' },
            ]
          },
          {
            text: '"Je... je ne sais pas."',
            effect: () => changeSanity(-5),
            next: [
              { speaker: 'ELLE', who: 'elle', text: 'Non. Tu ne sais pas.', speed: 45 },
              { speaker: 'ELLE', who: 'elle', text: 'C\'est justement le problème.', speed: 45 },
            ]
          },
          {
            text: '"Vous m\'avez enfermé."',
            effect: () => changeSanity(5),
            next: [
              { speaker: 'ELLE', who: 'elle', text: '...', speed: 80 },
              { speaker: 'ELLE', who: 'elle', text: 'Intéressant.', speed: 45 },
              { speaker: null, who: 'voix', text: 'Quelque chose change dans son expression. Quelque chose qui ressemble presque à de la fierté.', onEnd: () => { state.flags['confronted'] = true; } },
            ]
          },
        ]
      }
    ],
  };

  const ACTIONS = {
    inspect_fenetre() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'Des planches clouées. Pas récemment — les clous sont rouillés, le bois gris.' },
        { speaker: null, who: 'voix', text: 'Depuis combien de temps cette chambre est-elle condamnée ?' },
        { speaker: 'MOI', who: 'moi', text: 'Il n\'y a aucun moyen de sortir par là.' },
      ]);
      changeSanity(-5);
    },

    inspect_lit() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'Le lit est défait. Les draps portent encore la forme de quelqu\'un.' },
        { speaker: null, who: 'voix', text: 'Mais deux formes. Deux creux dans le matelas.' },
        { speaker: null, who: 'voix', text: 'Quelqu\'un dormait ici avec toi.' },
      ]);
      changeSanity(-8);
    },

    inspect_porte() {
      if (!state.flags['porte_essayee']) {
        state.flags['porte_essayee'] = true;
        showDialogue([
          { speaker: 'MOI', who: 'moi', text: 'La porte...' },
          { speaker: null, who: 'voix', text: 'Elle s\'ouvre.' },
          { speaker: null, who: 'voix', text: 'Simplement. Sans résistance.' },
          { speaker: null, who: 'voix', text: 'C\'est ça, le plus inquiétant. Elle n\'était pas fermée à clé.' },
          {
            speaker: null, who: 'voix', text: '',
            onEnd: () => {
              state.flags['porte_ouverte'] = true;
              buildNavExits('chambre');
            }
          }
        ]);
      } else {
        showDialogue([
          { speaker: null, who: 'voix', text: 'La porte mène au couloir.' },
        ]);
      }
    },

    inspect_table() {
      if (!state.flags['table_fouille']) {
        state.flags['table_fouille'] = true;
        showDialogue([
          { speaker: null, who: 'voix', text: 'Un flacon de médicaments. Sans étiquette.' },
          { speaker: null, who: 'voix', text: 'Et une clé. Petite, ancienne. Elle pend à un fil rouge.' },
          { speaker: 'MOI', who: 'moi', text: 'À quoi ça ouvre, ça...' },
          {
            speaker: null, who: 'voix', text: '',
            onEnd: () => {
              addItem('cle', 'Clé rouillée');
              state.flags['cle_trouvee'] = true;
              buildNavExits(state.scene);
            }
          }
        ]);
      } else {
        showDialogue([
          { speaker: null, who: 'voix', text: 'Il ne reste que le flacon de médicaments. Tu ne veux pas y toucher.' },
        ]);
      }
    },

    inspect_porte_fond() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'La porte est entrouverte d\'un centimètre.' },
        { speaker: null, who: 'voix', text: 'Derrière, l\'obscurité totale. Et quelque chose — une odeur. Humide. Familière.' },
      ]);
    },

    inspect_tache() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'Du rouge-brun sur le lino. Ancien.' },
        { speaker: null, who: 'voix', text: 'Tu le sais. Tu reconnais cette couleur.' },
        {
          speaker: null, who: 'voix', text: '',
          onEnd: () => changeSanity(-12)
        }
      ]);
    },

    inspect_mur_couloir() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'Des marques sur le papier peint. Des rayures.' },
        { speaker: null, who: 'voix', text: 'Quelqu\'un a compté les jours.' },
        { speaker: null, who: 'voix', text: 'Beaucoup de jours.' },
      ]);
      changeSanity(-6);
    },

    inspect_miroir() {
      if (state.sanity < 50) {
        showDialogue([
          { speaker: null, who: 'voix', text: 'Le miroir est brisé. Dans chaque fragment, un reflet différent.' },
          { speaker: null, who: 'voix', text: 'Aucun ne ressemble à ton visage.' },
          { speaker: 'MOI', who: 'moi', text: 'C\'est moi. C\'est... ce n\'est pas moi.' },
          {
            speaker: null, who: 'voix', text: '',
            onEnd: () => { changeSanity(-15); checkSanityEnding(); }
          }
        ]);
      } else {
        showDialogue([
          { speaker: null, who: 'voix', text: 'Le miroir est brisé en étoile. Quelqu\'un l\'a frappé fort.' },
          { speaker: null, who: 'voix', text: 'Du côté de l\'autre côté, apparemment.' },
          { speaker: 'MOI', who: 'moi', text: '...Quoi ?' },
        ]);
        changeSanity(-8);
      }
    },

    inspect_lavabo() {
      showDialogue([
        { speaker: null, who: 'voix', text: 'Le robinet goutte. L\'eau est sombre — pas de rouille, juste... sombre.' },
        { speaker: null, who: 'voix', text: 'Tu as soif. Tu ne bois pas.' },
      ]);
    },

    inspect_inscription() {
      showDialogue([
        { speaker: null, who: 'voix', text: '"IL REVIENT".' },
        { speaker: null, who: 'voix', text: 'Écrit avec quelque chose que tu préfères ne pas identifier.' },
        { speaker: null, who: 'voix', text: 'Mais le plus inquiétant, c\'est l\'écriture.' },
        { speaker: null, who: 'voix', text: 'C\'est la tienne.' },
        {
          speaker: null, who: 'voix', text: '',
          onEnd: () => {
            changeSanity(-20);
            if (!state.flags['inscription_vue']) {
              state.flags['inscription_vue'] = true;
              checkGoodEnding();
            }
          }
        }
      ]);
    },
  };

  /* ── ENDINGS ────────────────────────────────────────── */
  function checkSanityEnding() {
    if (state.sanity <= 0) triggerEnding('bad');
  }

  function checkGoodEnding() {
    if (state.flags['confronted'] && state.flags['inscription_vue']) {
      setTimeout(() => triggerEnding('revelation'), 2000);
    }
  }

  function triggerEnding(type) {
    const ENDINGS = {
      bad: {
        title: 'FIN — L\'EFFACEMENT',
        text: 'Tu n\'as plus de visage dans le miroir.\nTu n\'as plus de nom dans ta mémoire.\nQuelque chose d\'autre occupe ta chambre maintenant.',
      },
      revelation: {
        title: 'FIN — CE QUE TU SAVAIS',
        text: 'Tu l\'avais toujours su.\nLa chambre. Le couloir. L\'inscription.\nTu les avais construits toi-même, pierre par pierre, nuit après nuit.\nElle te regarde. Elle sourit.\n"Tu t\'en souviens, enfin."',
      },
    };
    const e = ENDINGS[type] || ENDINGS.bad;
    document.getElementById('end-title').textContent = e.title;
    document.getElementById('end-text').innerHTML = e.text.split('\n').join('<br>');
    showScreen('screen-end');
  }

  /* ── SCREENS ────────────────────────────────────────── */
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  /* ── PUBLIC API ─────────────────────────────────────── */
  function startGame() {
    showScreen('screen-game');
    resizeCanvas();
    state.scene = 'chambre';
    renderScene('chambre');
    setTimeout(() => {
      showDialogue(ENTRY_DIALOGUES.chambre);
    }, 500);
  }

  function restartGame() {
    state = {
      scene: 'chambre', sanity: 100, inventory: [], flags: {},
      dialogueQueue: [], dialogueIndex: 0,
      isDialogue: false, isChoices: false,
      typeInterval: null, typeText: '', typeTarget: '', typeDone: false,
    };
    document.getElementById('inventory-items').innerHTML = '';
    document.getElementById('sanity-fill').style.width = '100%';
    startGame();
  }

  /* ── EVENTS ─────────────────────────────────────────── */
  window.addEventListener('resize', () => {
    if (document.getElementById('screen-game').classList.contains('active')) resizeCanvas();
  });

  document.getElementById('dialogue-box').addEventListener('click', () => {
    advanceDialogue();
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') {
      e.preventDefault();
      if (state.isDialogue) advanceDialogue();
    }
  });

  return { startGame, restartGame };

})();