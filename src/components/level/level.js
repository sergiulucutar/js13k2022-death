var scoreRoundEl = document.querySelector('.score-level_round');
var scoreLevelEl = document.querySelector('.score-level_text');
var scoreOverlayEl = document.querySelectorAll(
  '.score-level_indicator-overlay'
);

class Level {
  constructor(game) {
    this.game = game;
    this.renderer = new LevelRenderer(game, this);

    this.actions = {
      max: 3,
      taken: 0
    };
    this.inventory = new Inventory();
    this.inventory.render();

    this.isIntroPlaying = false;
    this.timeOffset = 0;

    this.rounds = 0;
    this.nextRound();
  }

  nextRound() {
    this.rounds++;
    this.maps = {
      life: new Map(this.game),
      death: new Map(this.game)
    };
  }
  progress() {
    this.maps.life.progress(1, this.maps.death);
    this.maps.death.progress(-1, this.maps.life);
  }

  reset() {
    this.rounds = 0;
    this.extras = [];
    this.nextRound();
  }

  render() {
    this.renderer.render();
  }

  update() {}

  handleOptionSelected(event) {
    if (this.isIntroPlaying) {
      return;
    }

    const selectedOption = parseInt(event.target.dataset.optionid);
    if (this.puzzle.solutionPosition === selectedOption) {
      this.isIntroPlaying = true;
      event.target.classList.add('correct');

      this.puzzle.characters.find(
        character => character.isPlaceholder
      ).isPlaceholder = false;

      this.game.updateScore(Math.round(this.points));

      new Promise(resolve => {
        this.renderer.addRenderHook(this.animateVictory(resolve), 'victory');
      })
        .then(() => {
          return new Promise(resolve => {
            this.animateOutro(resolve);
          });
        })
        .then(() => this.nextRound());
    } else {
      event.target.classList.add('incorrect');
      this.triggerGameOver();
    }
  }

  show(done, character, index) {
    if (character.alpha > 0.98) {
      this.renderer.removeRenderHook(`portal${index}`);
      this.renderer.removeRenderHook(`character${index}`);
      done();
    }

    character.alpha += (1 - character.alpha) * 0.1;
  }

  triggerGameOver() {
    this.isIntroPlaying = true;
    this.game.gameOver();
    this.animateOutro(() => {});
  }

  getMapLocation(x, y) {
    return this.renderer.getMapLocation(x, y);
  }

  handleClick(event) {
    if (this.inventory.canPlant()) {
      const location = this.getMapLocation(event.clientX, event.clientY);
      if (location) {
        location.location.plant = new Flower();
        this.inventory.plantSeed();
      }
    }
  }
}
