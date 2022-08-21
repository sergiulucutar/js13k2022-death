const inventoryEl = document.querySelector('.inventory');
const seedsEl = inventoryEl.querySelector('#inventory__seeds');
const petalsEl = inventoryEl.querySelector('#inventory__petals');

class Inventory {
  constructor() {
    this.state = {
      seeds: 3,
      petals: 0
    };
  }

  canPlant() {
    return this.state.seeds > 0;
  }

  plantSeed() {
    this.state.seeds--;
    this.render();
  }

  addYield(amount) {
    this.state.petals += amount;
    this.render();
  }

  render() {
    seedsEl.innerText = this.state.seeds;
    petalsEl.innerText = this.state.petals;
  }
}
