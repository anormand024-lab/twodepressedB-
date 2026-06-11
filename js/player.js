/**
 * PLAYER SYSTEM - Gestion du personnage joueur et de ses interactions
 */

class PlayerSystem {
  constructor() {
    this.name = 'Vous';
    this.affection = {};
    this.flags = {};
    this.inventory = [];
    this.position = null;
  }

  /**
   * Initialise le système du joueur
   */
  init() {
    // Initialiser les affinités avec les personnages
    this.affection = {
      nami: 0,
    };

    // Initialiser les flags
    this.flags = {};

    // Initialiser l'inventaire
    this.inventory = [];
  }

  /**
   * Augmente l'affinité avec un personnage
   */
  increaseAffection(character, amount = 1) {
    if (this.affection.hasOwnProperty(character)) {
      this.affection[character] += amount;
      this.updateAffectionUI(character);
    }
  }

  /**
   * Diminue l'affinité avec un personnage
   */
  decreaseAffection(character, amount = 1) {
    this.increaseAffection(character, -amount);
  }

  /**
   * Met à jour l'UI des affinités
   */
  updateAffectionUI(character) {
    const fillEl = document.getElementById(`aff-${character}`);
    if (fillEl) {
      const percentage = Math.min(100, Math.max(0, this.affection[character]));
      fillEl.style.width = percentage + '%';
    }
  }

  /**
   * Ajoute un objet à l'inventaire
   */
  addItem(item) {
    this.inventory.push(item);
  }

  /**
   * Supprime un objet de l'inventaire
   */
  removeItem(item) {
    const index = this.inventory.indexOf(item);
    if (index > -1) {
      this.inventory.splice(index, 1);
    }
  }

  /**
   * Vérifie si un objet est dans l'inventaire
   */
  hasItem(item) {
    return this.inventory.includes(item);
  }

  /**
   * Défini un flag
   */
  setFlag(flagName) {
    this.flags[flagName] = true;
  }

  /**
   * Vérifie un flag
   */
  hasFlag(flagName) {
    return this.flags.hasOwnProperty(flagName) && this.flags[flagName];
  }

  /**
   * Réinitialise le joueur
   */
  reset() {
    this.init();
  }
}
