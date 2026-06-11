/**
 * SCENES - Définition de la narration du jeu
 * Histoire linéaire sombre et psychologique avec 1 personnage (vous) face à Nami
 */

const SCENES = [
  // ══════════════════════════════════════════════════════════════════
  // ACTE 1 : PREMIÈRE RENCONTRE (Couloir du lycée)
  // ══════════════════════════════════════════════════════════════════

  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `C'est ta première journée au Lycée Étoile du Soir. L'air sent la craie et la pluie froide.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Sur le mur du couloir, quelqu'un a écrit en petites lettres : "Le Club de Littérature t'attend."`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Tu cherches quelque chose ? Ce couloir ne mène nulle part...`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Sauf ici. Je suis Nami. Responsable du Club de Littérature.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `On m'a dit qu'une nouvelle personne arriverait aujourd'hui. Je suppose que c'est toi.`,
  },

  // ── DIALOGUE INTERACTIF ──
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Pourquoi es-tu ici ? Au lycée ? À ce couloir précisément ?`,
    type: 'choice',
    choices: [
      {
        text: `C'est juste le hasard...`,
        flag: 'choice-random',
        aff: { nami: 0 },
        next: 6,
      },
      {
        text: `Quelque chose m'a attiré ici.`,
        flag: 'choice-drawn',
        aff: { nami: 5 },
        next: 7,
      },
      {
        text: `Je... ne sais pas vraiment.`,
        flag: 'choice-confused',
        aff: { nami: 3 },
        next: 8,
      },
    ],
  },

  // ── Réaction 1 : Hasard
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Le hasard... C'est une façon poétique de dire les choses. Mais le hasard n'existe pas vraiment.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle se tourne légèrement. Son regard perce à travers toi.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Viens. Je veux te montrer le club.`,
    next: 10,
  },

  // ── Réaction 2 : Attiré
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Intéressant. Je suppose que tu as un cœur qui sent les choses...`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle sourit légèrement. C'est étrange, presque non-humain.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Bienvenue au Club de Littérature. Je pense que tu vas t'y plaire.`,
    next: 10,
  },

  // ── Réaction 3 : Confusion
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Honnête au moins. Les gens confus sont souvent plus intéressants.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle t'observe comme si elle te voyait pour la première fois, bien qu'elle te fixe depuis le début.`,
  },
  {
    sceneGroup: 'act1-couloir',
    bg: 'classroom',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Viens. Le club est juste à côté.`,
    next: 10,
  },

  // ══════════════════════════════════════════════════════════════════
  // ACTE 2 : DANS LE CLUB (Salle du club)
  // ══════════════════════════════════════════════════════════════════

  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `La porte s'ouvre sur un petit club confortable. Des étagères remplies de livres. Une atmosphère étrange... vide.`,
    transition: true,
  },
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Bienvenue. C'est mon refuge. Ici, nous explorons la littérature... et ce qu'elle révèle de nous.`,
  },
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle s'assoit derrière une table couverte de manuscrits. Elle en attrape un, ancien et jauni.`,
  },
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Lis ceci. C'est un poème. Dis-moi ce que tu en penses.`,
    type: 'choice',
    choices: [
      {
        text: `"Sombre et perturbant. C'est magnifique."`,
        flag: 'poem-dark',
        aff: { nami: 10 },
        next: 14,
      },
      {
        text: `"C'est trop étrange pour moi."`,
        flag: 'poem-confused',
        aff: { nami: -2 },
        next: 15,
      },
    ],
  },

  // ── Réaction Poème 1
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Tu comprends. Bon. La plupart des gens ne voient que la surface. Toi... tu vas plus loin.`,
  },
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Je pense que tu vas rester longtemps. Très longtemps même.`,
    next: 17,
  },

  // ── Réaction Poème 2
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Étrange... oui. Mais ce qui est étrange est souvent la vérité maquillée.`,
  },
  {
    sceneGroup: 'act2-club',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Peut-être que tu comprendras avec le temps.`,
    next: 17,
  },

  // ══════════════════════════════════════════════════════════════════
  // ACTE 3 : CONVERSATIONS (Suite dans le club)
  // ══════════════════════════════════════════════════════════════════

  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Les heures passent. Nami parle de littérature, de sens, de ce qui "existe réellement".`,
    transition: true,
  },
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Tu sais, les personnages des livres sont plus vivants que la plupart des gens.`,
  },
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle regarde par la fenêtre du club. Dehors, il fait noir. Quand exactement est-il devenu si tard ?`,
  },
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Dis-moi... crois-tu à la réalité ? Vraiment ?`,
    type: 'choice',
    choices: [
      {
        text: `Bien sûr. Je vois le monde.`,
        flag: 'real-believer',
        aff: { nami: 5 },
        next: 21,
      },
      {
        text: `Je... ne suis pas sûr maintenant.`,
        flag: 'real-doubt',
        aff: { nami: 15 },
        next: 22,
      },
    ],
  },

  // ── Réaction Réalité 1
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Hum. Comment peux-tu être sûr ? Comment est-ce que tu sais que tu n'es pas un personnage dans une histoire ?`,
  },
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Tu ne trouves pas de réponse. Nami sourit.`,
    next: 24,
  },

  // ── Réaction Réalité 2
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Excellent. Tu commences à comprendre. Peut-être que nous ne sommes qu'une histoire que quelqu'un d'autre raconte.`,
  },
  {
    sceneGroup: 'act3-revelation',
    bg: 'club',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Elle se rapproche. Tu ne l'as pas vue bouger.`,
    next: 24,
  },

  // ══════════════════════════════════════════════════════════════════
  // ACTE 4 : CRESCENDO (La vérité commence à émerger)
  // ══════════════════════════════════════════════════════════════════

  {
    sceneGroup: 'act4-horror',
    bg: 'void',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Les murs semblent plus proches. La salle semble rétrécir. Ou tu grandis ?`,
    transition: true,
  },
  {
    sceneGroup: 'act4-horror',
    bg: 'void',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Tu voudrais partir, n'est-ce pas ? Mais tu ne peux pas. Pas maintenant.`,
  },
  {
    sceneGroup: 'act4-horror',
    bg: 'void',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Ses yeux brillent différemment. Presque... numériquement.`,
  },
  {
    sceneGroup: 'act4-horror',
    bg: 'void',
    show: ['nami'],
    active: 'nami',
    name: 'nami',
    text: `Bienvenue au Club de Littérature. Où les histoires nous possèdent autant que nous les possédons.`,
  },
  {
    sceneGroup: 'act4-horror',
    bg: 'void',
    show: ['nami'],
    active: 'nami',
    name: 'narrator',
    text: `Tu essaies de crier. Mais tu es déjà devenu un personnage. Et les personnages ne peuvent pas crier.`,
  },

  // ══════════════════════════════════════════════════════════════════
  // ÉPILOGUE
  // ══════════════════════════════════════════════════════════════════

  {
    sceneGroup: 'epilogue',
    bg: 'white',
    show: [],
    name: 'narrator',
    text: `Fin du jeu.`,
    pause: 3000,
  },
  {
    sceneGroup: 'epilogue',
    bg: 'white',
    show: [],
    name: 'narrator',
    text: `Rejoignez-nous au Club de Littérature.`,
    end: true,
  },
];
