class LevelRenderer {
  constructor(game, level) {
    this.game = game;
    this.level = level;
    this.ctx = game.ctx;

    this.isIntroPlaying = false;
    this.renderHooks = {};
  }

  render() {}

  addRenderHook(callback, name) {
    this.renderHooks[name] = callback;
  }

  removeRenderHook(name) {
    delete this.renderHooks[name];
  }
}
