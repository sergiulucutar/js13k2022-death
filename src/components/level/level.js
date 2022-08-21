var scoreRoundEl = document.querySelector('.score-level_round');
var scoreLevelEl = document.querySelector('.score-level_text');
var scoreOverlayEl = document.querySelectorAll(
  '.score-level_indicator-overlay'
);
var turnCountEl = document.querySelector('#turnCount');

class Level {
  ACTION_TYPES = {
    PLANT: 'plant',
    HARVEST: 'harvest',
    REMOVE: 'remove'
  };

  constructor(game) {
    this.game = game;
    this.renderer = new LevelRenderer(game, this);
    this.inventory = new Inventory();
    this.inventory.render();
    this.isIntroPlaying = false;

    this.selectedAction = this.ACTION_TYPES.PLANT;
    this.isActionAvailable = true;
    this.turnCount = 5;
    turnCountEl.innerText = this.turnCount;

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
    if (!this.turnCount) {
      this.turnCount += this.getMemoriesCount();
      return;
    }

    this.turnCount--;
    turnCountEl.innerText = this.turnCount;
    this.isActionAvailable = true;
    this.maps.life.progress(1, this.maps.death);
    this.maps.death.progress(-1, this.maps.life);
    if (!this.turnCount) {
      document.body.classList.add('death');
    }
  }

  getMemoriesCount() {
    let memories = 0;
    const { life, death } = this.maps;
    for (let i = 0; i < life.gridSize.width; i++) {
      for (let j = 0; j < life.gridSize.height; j++) {
        if (life.grid[i][j].plant && death.grid[i][j].plant) {
          memories++;
        }
      }
    }

    return memories;
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

  triggerGameOver() {
    this.isIntroPlaying = true;
    this.game.gameOver();
    this.animateOutro(() => {});
  }

  getMapLocation(x, y) {
    return this.renderer.getMapLocation(x, y);
  }

  selectAction(value) {
    if (this.isActionAvailable) {
      this.selectedAction = this.ACTION_TYPES[value];
    }
  }

  handleClick(event) {
    switch (this.selectedAction) {
      case this.ACTION_TYPES.PLANT:
        this.plant(event.clientX, event.clientY);
        break;
      case this.ACTION_TYPES.HARVEST:
        this.harvest(event.clientX, event.clientY);
        break;
      case this.ACTION_TYPES.REMOVE:
        this.dispose(event.clientX, event.clientY);
        break;
    }
    // this.isActionAvailable = false;
  }

  plant(x, y) {
    if (this.inventory.canPlant()) {
      const location = this.getMapLocation(x, y);
      if (location && location.location) {
        location.location.plant = new Flower();
        this.inventory.plantSeed();
      }
    }
  }

  harvest(x, y) {
    const location = this.getMapLocation(x, y);
    if (location.location && location.location.plant.type === 'flower') {
      this.inventory.addYield(location.location.plant.yield);
      location.location.plant.yield = 0;
    }
  }

  dispose(x, y) {
    const location = this.getMapLocation(x, y);
    location.map.resetLocation(location.position[0], location.position[1]);
  }
}
