const inventoryEl = document.querySelector('.inventory');
const seedsEl = inventoryEl.querySelector('#inventory__seeds');

class Inventory {
  constructor() {
    this.state = {
      seeds: 6
    };
  }

  canPlant() {
    return this.state.seeds > 0;
  }

  plantSeed() {
    this.state.seeds--;
    this.render();
  }

  render() {
    seedsEl.innerText = this.state.seeds;
  }
}
