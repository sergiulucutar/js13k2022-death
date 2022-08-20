class Plant {
  type = '';
  minYield = 2;
  maxYield = 7;
  stages = ['seed', 'grow', 'flower', 'weathered', 'seed'];
  currentStage = 0;
  yield = null;

  progress(step = 1) {
    this.currentStage =
      (this.currentStage + this.maxYield + step) % this.stages.length;
  }
}

class Flower extends Plant {
  stages = ['seed', 'grow', 'grow', 'grow', 'flower', 'weathered', 'seed'];
  type = 'flower';

  setYield() {
    this.yield = Utils.random(this.minYield, this.maxYield);
  }

  progress(step = 1) {
    super.progress(step);
    if (this.stages[this.currentStage] === 'flower') {
      this.setYield();
    }
  }
}
