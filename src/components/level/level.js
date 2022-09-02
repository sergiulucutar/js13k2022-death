class Level {
  constructor(game) {
    this.game = game;
    this.renderer = new LevelRenderer(game, this);
    this.isIntroPlaying = false;
  }

  init() {
    this.poem = new Poem();

    this.characters = new Characters(this.game);
    this.characters.init();
    this.characters.render(this.poem.getHtml(this.characters.selectedFamilies));
    this.deadCharacters = [];

    this.ink = 10;
    this.inkToBeSpent = 0;
    this.renderInk(this.ink);

    this.powersActive = {
      isVowelsFree: false,
      memoryDropDead: false,
      inkOnKillDead: false,
      inkOnKillAlive: false,
      killerOnKill: false,
      memoryDropAlive: false
    };

    this.killCharacter(this.characters.characters[0]);
    this.revealInfo(this.characters.characters[0]);
  }

  renderInk(value) {
    this.renderer.showInk(value);
  }

  useInk(value) {
    this.inkToBeSpent = value;
    this.renderInk(this.ink - this.inkToBeSpent);
  }

  killCharacter(character) {
    character.isDead = true;
    this.deadCharacters.push(character);
    this.characters.revealFirstName(character);
    this.characters.revealFamilyName(character);
    this.characters.showDead(character);
    this.triggerPower(character, tags.DEAD);
  }

  triggerPower(character, tag) {
    if (tag === character.power.tag) {
      switch (character.power.id) {
        case 8:
        case 1:
          this.ink += 3;
          this.renderInk(this.ink);
          break;
        case 2:
          this.powersActive.isVowelsFree = true;
          break;
        case 3:
          this.powersActive.memoryDrop = true;
          break;
        case 4:
          this.powersActive.inkOnKillDead = true;
          break;
        case 5:
          this.powersActive.killerOnKill = true;
          break;
        case 6:
          this.powersActive.inkOnKillAlive = true;
          break;
        case 7:
          this.powersActive.memoryDropAlive = true;
          break;
        case 9:
          const ink = this.characters.characters.filter(
            char => !char.isDead
          ).length;
          this.ink += ink;
          this.renderInk(this.ink);
          break;
      }
    }

    if (tag === tags.DEAD) {
      switch (true) {
        case this.powersActive.memoryDropDead:
          this.dropMemory(character);
          break;
        case this.powersActive.inkOnKillDead:
          this.ink++;
          this.renderInk(this.ink);
          break;
        case this.powersActive.killerOnKill:
          this.dropKiller();
          break;
      }
    }
  }

  dropMemory(character) {
    this.characters.revealFamilyName(character);
  }

  dropKiller() {
    this.characters.tagKiller();
  }

  revealInfo(deadChar) {
    const remainingCharacters = this.characters.characters.filter(
      chr => !chr.isDead
    );
    if (remainingCharacters.length) {
      const killer =
        remainingCharacters[Utils.random(0, remainingCharacters.length - 1)];
      this.characters.revealFirstName(killer);
    }
  }

  triggerGameOver() {
    this.isIntroPlaying = true;
    this.game.gameOver();
    // this.animateOutro(() => {});
  }

  isSolutionGood() {
    if (this.deadCharacters.length !== this.characters.characters.length) {
      return false;
    }

    let indexCount = 0;
    for (let i = 0; i < this.characters.characters.length; i++) {
      const familyIndex = this.characters.selectedFamilies.findIndex(
        selFam => selFam.name === this.deadCharacters[i].family
      );
      if (familyIndex >= indexCount) {
        indexCount = familyIndex;
      } else {
        return false;
      }
    }

    return true;
  }

  isCharactersDead() {
    return this.characters.characters.every(char => char.isDead);
  }

  revive() {
    this.characters.characters.forEach(chr => {
      this.characters.isDead = false;
      const characterEl = document.querySelector(
        `[data-charactername="${chr.name}"]`
      );
      characterEl.classList.remove('character--dead');
    });
  }

  write(valueLength) {
    this.useInk(valueLength);
    if (this.inkToBeSpent < this.ink) {
      return true;
    }

    return false;
  }

  handleSubmit(value) {
    const character = this.characters.characters.find(
      chr => chr.name.toLowerCase() === value.toLowerCase()
    );

    if (character) {
      this.killCharacter(character);
      this.revealInfo(character);
    }

    if (this.isCharactersDead()) {
      if (this.isSolutionGood()) {
        console.log('YOU WON');
      } else {
        console.log('YOU LOST');
        this.revive();
      }
    }
  }
}
