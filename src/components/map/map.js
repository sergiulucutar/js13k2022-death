class Map {
  constructor(game) {
    this.canvas = game.canvas;

    this.tileSize = 100;

    this.grid = [];
    this.gridSize = {
      width: 5,
      height: 5
    };
    this.generateMap();
  }

  generateMap() {
    for (let i = 0; i < this.gridSize.width; i++) {
      const row = [];
      for (let j = 0; j < this.gridSize.height; j++) {
        if (Math.random() > 0.9) {
          row.push({
            plant: 'root'
          });
        } else {
          row.push({});
        }
      }

      this.grid.push(row);
    }
  }

  getLocation(i, j) {
    return this.grid[i][j];
  }

  resetLocation(i, j) {
    this.grid[i][j] = {};
  }

  progress(direction = 1, otherMap) {
    for (let i = 0; i < this.gridSize.width; i++) {
      for (let j = 0; j < this.gridSize.height; j++) {
        const plant = this.grid[i][j].plant;
        if (
          plant &&
          plant.type === 'root' &&
          !otherMap.getLocation(i, j).plant
        ) {
          this.resetLocation(i, j);
        }

        if (plant && plant.type === 'flower') {
          plant.progress(direction);
          if (otherMap.getLocation(i, j).plant) {
            plant.progress(direction);
            plant.progress(direction);
            otherMap.resetLocation(i, j);
          }

          if (plant.isDead(!!direction)) {
            otherMap.getLocation(i, j).plant = new Flower();
            this.grid[i][j] = 'root';
          }
        }
      }
    }
  }
}
