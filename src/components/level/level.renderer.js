class LevelRenderer {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.ctx = game.ctx;

    this.isIntroPlaying = false;
    this.renderHooks = {};

    this.mapRenderer = new MapRenderer(game);

    this.mapsOffset = {
      life: [game.canvas.width / 4, game.canvas.height / 2],
      death: [(game.canvas.width / 4) * 3, game.canvas.height / 2]
    };
  }

  render() {
    this.mapRenderer.render(this.level.maps.life, this.mapsOffset.life);
    this.mapRenderer.render(this.level.maps.death, this.mapsOffset.death, true);
  }

  getMapLocation(x, y) {
    const offsetLife = [
      x - this.level.maps.life.tileSize * 2.5,
      y - this.level.maps.life.tileSize * 2.5
    ];

    const offsetDeath = [
      x +
        this.level.maps.death.tileSize * 2.5 -
        (this.game.canvas.width / 4) * 3,
      y + this.level.maps.death.tileSize * 2.5 - this.game.canvas.height / 2
    ];

    if (
      offsetLife[0] > 0 &&
      offsetLife[1] > 0 &&
      offsetLife[0] < this.level.maps.life.tileSize * 5 &&
      offsetLife[1] < this.level.maps.life.tileSize * 5
    ) {
      const location = this.getMapTile(
        offsetLife[0],
        offsetLife[1],
        this.level.maps.life.tileSize
      );

      return {
        location: this.level.maps.life.grid[location[0]][location[1]],
        position: [location[0], location[1]],
        map: this.level.maps.life
      };
    }

    if (
      offsetDeath[0] > 0 &&
      offsetDeath[1] > 0 &&
      offsetDeath[0] < this.level.maps.death.tileSize * 5 &&
      offsetDeath[1] < this.level.maps.death.tileSize * 5
    ) {
      const location = this.getMapTile(
        offsetDeath[0],
        offsetDeath[1],
        this.level.maps.death.tileSize
      );

      return {
        location: this.level.maps.death.grid[location[0]][location[1]],
        position: [location[0], location[1]],
        map: this.level.maps.death
      };
    }
  }

  getMapTile(x, y, tileSize) {
    return [Math.floor(x / tileSize), Math.floor(y / tileSize)];
  }

  addRenderHook(callback, name) {
    this.renderHooks[name] = callback;
  }

  removeRenderHook(name) {
    delete this.renderHooks[name];
  }
}
