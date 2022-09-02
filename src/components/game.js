var levelEl = document.querySelector('.level');
var endEl = document.querySelector('.end');
var inputEl = document.querySelector('#chrname');

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.lvl = new Level(this);

    this.isMenuShown = false;
    this.showStoryending = false;

    this.loopProps = {
      now: null,
      elapsed: 0,
      then: Date.now()
    };

    this.registerEvents();

    this.lvl.init();
    this.isInputDisabled = false;
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

  resetLevel() {
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

  registerEvents() {
    // this.canvas.addEventListener('click', event => {
    //   this.lvl.handleClick(event);
    // });

    document.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        this.lvl.handleSubmit(inputEl.value);
        inputEl.value = '';
      }
    });

    inputEl.addEventListener('keyup', event => {
      const isWritten = this.lvl.write(inputEl.value.length);
      this.isInputDisabled = !isWritten;
    });

    inputEl.addEventListener('keypress', event => {
      if (this.isInputDisabled) {
        event.preventDefault();
        return false;
      }
    });
  }
}
