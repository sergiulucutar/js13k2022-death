var scoreEl = document.querySelector('.score-level_total');
var levelEl = document.querySelector('.level');
var endEl = document.querySelector('.end');
var specialSreenEl = document.querySelector('.screen-special');

class Game {
  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value;
    scoreEl.innerText = this.score;
  }

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.lvl = new Level(this);
    this.history = new History();

    this._score = 0;
    this.isMenuShown = false;
    this.showStoryending = false;

    this.loopProps = {
      fpsInterval: 1000 / 60,
      then: Date.now(),
      startTime: Date.now(),
      now: Date.now(),
      elapsed: 0
    };

    this.registerEvents();
  }

  loop() {
    requestAnimationFrame(() => this.loop.call(this));
    this.loopProps.now = Date.now();
    this.loopProps.elapsed = this.loopProps.now - this.loopProps.then;

    if (this.loopProps.elapsed > this.loopProps.fpsInterval) {
      this.loopProps.then =
        this.loopProps.now -
        (this.loopProps.elapsed % this.loopProps.fpsInterval);
      this.update();
      this.draw();
    }
  }

  draw() {
    if (!this.isMenuShown) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.lvl.render();
    }
  }

  update() {
    if (!this.isMenuShown) {
      this.lvl.update();
    }
  }

  updateScore(value) {
    this.score += value;
    scoreEl.classList.add('pop');
    scoreLevelEl.classList.add('pop');
    setTimeout(() => scoreLevelEl.classList.remove('pop'), 1000);
    setTimeout(() => {
      scoreEl.classList.remove('pop');
    }, 210);
  }

  resetLevel() {
    this.score = 0;

    this.lvl = new Level(this);
    levelEl.classList.remove('hidden');
    endEl.classList.add('hidden');
    setTimeout(() => (endEl.getElementsByClassName.visibility = 'hidden'), 300);

    this.isMenuShown = false;
  }

  gameOver() {
    this.history.set(this.score);

    if (this.history.get()[0].score === this.score) {
      this.showStoryending = true;
      this.setEndButtonText('continue');
    } else {
      this.setEndButtonText('again');
    }

    endEl.querySelector('h2').innerText = this.score;
    endEl.querySelector('.history').innerHTML = this.getHistoryMarkup();

    levelEl.classList.add('hidden');
    endEl.getElementsByClassName.visibility = 'visible';
    endEl.classList.remove('hidden');
  }

  getHistoryMarkup() {
    let html = '';
    this.history.get().forEach(element => {
      html += `<div><span>${element.score} ${
        element.name ? element.name : ''
      }</span></div>`;
    });
    return html;
  }

  setEndButtonText(text) {
    const button = endEl.querySelector('button');
    button.innerText = text;
    button.dataset.text = text;
  }

  registerEvents() {
    this.canvas.addEventListener('click', event => {
      this.lvl.handleClick(event);
    });

    // document.addEventListener('keydown', event => {
    //   this.lvl.handleKey(event);
    // });
  }

  progress() {
    this.lvl.progress();
  }

  selectAction(value) {
    this.lvl.selectAction(value);
  }
}
