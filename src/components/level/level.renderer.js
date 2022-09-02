const inkEl = document.querySelector('.ink');

class LevelRenderer {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.ctx = game.ctx;

    this.isIntroPlaying = false;
    this.renderHooks = {};
  }

  render() {}

  showInk(ink) {
    let html = '';
    for (let i = 0; i < ink; i++) {
      html += '<span></span>';
    }
    inkEl.innerHTML = html;
  }

  addRenderHook(callback, name) {
    this.renderHooks[name] = callback;
  }

  removeRenderHook(name) {
    delete this.renderHooks[name];
  }
}
