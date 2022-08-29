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

    this.killCharacter(this.characters.characters[0]);
    this.revealInfo(this.characters.characters[0]);
  }

  killCharacter(character) {
    character.isDead = true;
    this.deadCharacters.push(character);
    this.characters.revealFirstName(character);
    this.characters.revealFamilyName(character);
    this.characters.showDead(character);
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

  render() {
    this.renderer.render();
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
