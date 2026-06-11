/**
 * DIALOGUE SYSTEM - Gestion avancée des dialogues
 */

class DialogueSystem {
  constructor() {
    this.currentDialogue = null;
    this.isDisplaying = false;
  }

  /**
   * Initialise le système de dialogue
   */
  init() {
    this.textElement = document.getElementById('dialogue-text');
    this.nametagElement = document.getElementById('nametag');
    this.cursorElement = document.getElementById('cursor');
    this.textboxElement = document.getElementById('textbox');
  }

  /**
   * Affiche un dialogue avec effet typing
   */
  displayDialogue(speaker, text) {
    this.currentDialogue = {
      speaker: speaker,
      text: text,
      charIndex: 0,
    };

    // Mettre à jour le nom du speaker
    if (CHAR_NAMES[speaker]) {
      this.nametagElement.textContent = CHAR_NAMES[speaker];
      this.nametagElement.style.color = CHAR_COLORS[speaker] || 'var(--pink)';
    }

    // Réinitialiser
    this.isDisplaying = true;
    this.textElement.textContent = '';
    this.cursorElement.classList.add('show');

    // Démarrer le typing
    this.typeOut();
  }

  /**
   * Effet de typing
   */
  typeOut() {
    if (this.currentDialogue.charIndex < this.currentDialogue.text.length) {
      const char = this.currentDialogue.text[this.currentDialogue.charIndex];
      this.textElement.textContent += char;
      this.currentDialogue.charIndex++;
      
      setTimeout(() => this.typeOut(), 40);
    } else {
      this.isDisplaying = false;
      this.cursorElement.classList.remove('show');
    }
  }

  /**
   * Affiche instantanément le reste du dialogue
   */
  skipTyping() {
    if (this.isDisplaying && this.currentDialogue) {
      this.textElement.textContent = this.currentDialogue.text;
      this.currentDialogue.charIndex = this.currentDialogue.text.length;
      this.isDisplaying = false;
      this.cursorElement.classList.remove('show');
    }
  }

  /**
   * Efface le dialogue actuel
   */
  clear() {
    this.textElement.textContent = '';
    this.nametagElement.textContent = '???';
    this.cursorElement.classList.remove('show');
    this.isDisplaying = false;
  }
}
