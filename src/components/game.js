var levelEl = document.querySelector('.level');
var endEl = document.querySelector('.endgame');
var clipboardEl = document.querySelector('.clipboard');
var stateLifeEssenceEl = document.querySelector('.essence__life');
var stateDeathEssenceEl = document.querySelector('#essence-death');
var stateSoulEssenceEl = document.querySelector('#essence-soul');
var clipboardLifeEssenceEl = document.querySelector('.clipboard__data');
var timerEl = document.querySelector('.timer__content');
var shopWorkerEl = document.querySelector('.shop--worker');

class Game {
  constructor(canvas) {
    // this.canvas = canvas;
    // this.ctx = canvas.getContext('2d');

    // this.loopProps = {
    //   now: null,
    //   elapsed: 0,
    //   then: Date.now()
    // };

    this.timer = {
      segments: {
        count: 3,
        max: 3
      }
    };

    this.state = {
      life: 10,
      death: 0,
      soul: 0
    };

    this.clipboard = {
      life: 0
    };

    this.upgrades = {
      bloodWell: {
        isActive: false,
        life: 0
      },
      golem: {
        isActive: false,
        life: 0,
        power: 0
      },
      shroud: {
        isActive: false,
        resistance: 0
      }
    };

    this.characterIdIndex = 0;

    this.renderer = new GameRenderer();

    this.createCharacters();
    this.registerEvents();
    this.renderer.updateStateLifeEssence(this.state.life);

    this.renderer.renderTimer(this.timer);
    setInterval(() => {
      this.tick();
    }, 2000);
  }

  createCharacters() {
    this.characters = [];
    this.charactersRenderer = new CharacterRenderer();

    this.characters.push(
      new VoidGenerator(
        this.characterIdIndex++,
        this.characterDeathCallback.bind(this)
      )
    );
    this.characters.push(
      new LifeOnDeathGenerator(
        this.characterIdIndex++,
        this.characterDeathCallback.bind(this)
      )
    );

    this.characters.push(
      new SoulGenerator(
        this.characterIdIndex++,
        this.characterDeathCallback.bind(this)
      )
    );

    this.charactersRenderer.renderAll(this.characters);
  }

  tick() {
    this.timer.segments.count--;
    this.renderer.updateTimer(this.timer);
    if (this.timer.segments.count <= 0) {
      this.state.life--;
      if (this.state.life <= 0) {
        this.endGame();
      } else {
        this.timer.segments.count = this.timer.segments.max;
      }
      this.renderer.updateStateLifeEssence(this.state.life);
    }
    this.renderer.updateTimer(this.timer);

    this.characters.forEach(chr => {
      chr.tick();
      this.charactersRenderer.update(chr);
    });
  }

  characterDeathCallback(character) {
    character.abilities.forEach(({ produce }) => {
      switch (produce.type) {
        case ESSENCE_TYPE.LIFE:
          this.state.life += produce.value;
          break;
        case ESSENCE_TYPE.DEATH:
          this.state.death += produce.value;
          break;
        case ESSENCE_TYPE.SOUL:
          this.state.soul += produce.value;
          break;
      }
      produce.value = 0;
    });

    // this.state.life += output.life;
    // output.life = 0;

    // if (character.output.death !== undefined) {
    //   this.state.death += output.death;
    //   output.death = 0;
    // }

    // if (character.output.soul !== undefined) {
    //   this.state.soul += output.soul;
    //   output.soul = 0;
    // }

    this.renderer.updateStateLifeEssence(this.state.life);
    this.renderer.updateInventory(this.state);

    this.charactersRenderer.update(character);
  }

  // loop() {
  //   requestAnimationFrame(() => this.loop.call(this));
  //   this.loopProps.now = Date.now();
  //   this.loopProps.elapsed = this.loopProps.now - this.loopProps.then;

  //   if (this.loopProps.elapsed > this.loopProps.fpsInterval) {
  //     this.loopProps.then =
  //       this.loopProps.now -
  //       (this.loopProps.elapsed % this.loopProps.fpsInterval);
  //     this.update();
  //     this.draw();
  //   }
  // }

  // draw() {
  //   if (!this.isMenuShown) {
  //     this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  //     this.lvl.render();
  //   }
  // }

  // update() {
  //   if (!this.isMenuShown) {
  //     this.lvl.update();
  //   }
  // }

  endGame() {
    levelEl.classList.add('hidden');
    endEl.classList.add('endgame--active');
  }

  toggleWorkerShop() {
    shopWorkerEl.classList.add('shop--opened');

    this.generateWorkerShop();
    this.charactersRenderer.renderWorkerShop(this.shopWorkers);
  }

  generateWorkerShop() {
    this.shopWorkers = [];
    for (let i = 0; i < 3; i++) {
      const random = Utils.random(0, 2);

      switch (random) {
        case 0:
          this.shopWorkers.push(
            new VoidGenerator(
              this.characterIdIndex++,
              this.characterDeathCallback.bind(this)
            )
          );
          break;
        case 1:
          this.shopWorkers.push(
            new LifeOnDeathGenerator(
              this.characterIdIndex++,
              this.characterDeathCallback.bind(this)
            )
          );
          break;
        case 2:
          this.shopWorkers.push(
            new SoulGenerator(
              this.characterIdIndex++,
              this.characterDeathCallback.bind(this)
            )
          );
          break;
      }
    }
  }

  addEssenceToClipboard() {
    if (this.state.life <= 0) {
      return;
    }

    this.clipboard.life++;
    this.state.life--;

    this.renderer.updateClipboardLifeEssence(this.clipboard.life);
    this.renderer.updateStateLifeEssence(this.state.life);
  }

  characterClick(charId) {
    let selectedChar = this.characters.find(chr => chr.id === charId);
    if (selectedChar) {
      selectedChar.addLifeEssence(this.clipboard.life);
      this.charactersRenderer.update(selectedChar);

      this.clipboard.life = 0;
      this.renderer.updateClipboardLifeEssence(this.clipboard.life);
    } else {
      selectedChar = this.shopWorkers.find(chr => chr.id === charId);
      if (selectedChar) {
        this.closeShop();
        this.characters.push(selectedChar);
        this.shopWorkers = this.shopWorkers.filter(chr => chr !== selectedChar);
        this.charactersRenderer.renderNew(selectedChar);
      }
    }
  }

  closeShop() {
    shopWorkerEl.classList.remove('shop--opened');
  }

  registerEvents() {
    document.addEventListener('mousemove', event => {
      clipboardEl.style.left = `${event.clientX}px`;
      clipboardEl.style.top = `${event.clientY}px`;
    });

    stateLifeEssenceEl.addEventListener(
      'click',
      this.addEssenceToClipboard.bind(this)
    );
  }
}
