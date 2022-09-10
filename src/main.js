var levelEl = document.querySelector('.level');
var canvas = document.querySelector('canvas');
var game;

window.onload = () => {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;

  game = new Game(canvas);
  // startGame();
};

function startGame() {
  game.loop();
}

window.characterClick = charId => game.characterClick(charId);
window.toggleWorkerShop = () => game.toggleWorkerShop();
