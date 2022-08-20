class MapRenderer {
  constructor(game) {
    this.canvas = game.canvas;
    this.ctx = game.ctx;
    this.gutter = 4;

    this.mainPalette = {
      primary: '#D8D8D2',
      secondary: '#34344A'
    };

    this.flippedPalette = {
      primary: '#34344A',
      secondary: '#F6F4E8'
    };
  }

  render(map, pivot, isColorFlip = false) {
    const offset = [
      pivot[0] - map.tileSize * 2.5,
      pivot[1] - map.tileSize * 2.5
    ];

    const colorPalette = isColorFlip ? this.flippedPalette : this.mainPalette;

    map.grid.forEach((row, i) => {
      row.forEach((column, j) => {
        if (!column) {
          return;
        }

        this.ctx.fillStyle = colorPalette.primary;
        this.ctx.fillRect(
          i * map.tileSize + offset[0],
          j * map.tileSize + offset[1],
          map.tileSize - this.gutter / 2,
          map.tileSize - this.gutter / 2
        );

        if (column.plant) {
          this.renderPlants(
            i * map.tileSize + offset[0],
            j * map.tileSize + offset[1],
            map.tileSize,
            column.plant,
            colorPalette
          );
        }
      });
    });
  }

  renderPlants(i, j, tileSize, plant, palette) {
    if (plant === 'root') {
      this.ctx.strokeStyle = palette.secondary;
      this.ctx.beginPath();
      this.ctx.arc(
        i + tileSize * 0.5,
        j + tileSize * 0.5,
        tileSize * 0.1,
        0,
        2 * Math.PI
      );
      this.ctx.stroke();
    }

    if (plant.type === 'flower') {
      this.ctx.fillStyle = '#80475E';
      this.ctx.fillRect(
        i + tileSize * 0.5 - tileSize * 0.25,
        j + tileSize * 0.5 - tileSize * 0.025,
        tileSize * 0.5,
        tileSize * 0.05
      );

      if (plant.stages[plant.currentStage] === 'flower') {
        for (let petalsIndex = 0; petalsIndex < plant.yield; petalsIndex++) {
          this.ctx.fillRect(
            i +
              tileSize * 0.5 -
              tileSize * 0.25 +
              tileSize * 0.07 * petalsIndex,
            j + tileSize * 0.5 - tileSize * 0.2,
            tileSize * 0.05,
            tileSize * 0.2
          );
        }
      }

      this.ctx.font = '14px serif';
      this.ctx.fillText(
        plant.currentStage,
        i + tileSize * 0.5 - 4,
        j + tileSize * 0.2
      );
    }
  }
}
