// Initialize DOM variables
var keyPressed = false;
var mainContainer = document.getElementById('main');
var startContainer = document.getElementById('start-wrapper');
var score1 = document.getElementById('score-1');
var score2 = document.getElementById('score-2');
var bestscore1 = document.getElementById('bestscore-1');
var bestscore2 = document.getElementById('bestscore-2');
var endContainer1 = document.getElementById('end-wrapper-1');
var endContainer2 = document.getElementById('end-wrapper-2');
var game1;

/**
 * Start the game on click of the button creating two instances of the game
 */
function startGame() {
  startContainer.style.display = 'none';
  game1 = new Game(32, endContainer1, score1, bestscore1);
  game2 = new Game(87, endContainer2, score2, bestscore2);
  endContainer2.style.marginLeft = CANVAS_WIDTH + 'px';

  // Add event handlers to control the game
  document.addEventListener('keydown', function (e) {
    if (!keyPressed) {
      game1.reactToKeyDown(e.keyCode);
      game2.reactToKeyDown(e.keyCode);
      keyPressed = true;
    }
  });

  document.addEventListener('keyup', function (e) {
    game1.reactToKeyUp(e.keyCode);
    game2.reactToKeyUp(e.keyCode);
    pressedKey = null;
    keyPressed = false;
  });
}

// Restart the first game on click of the button
function restartGame1() {
  game1.endContainer.style.display = 'none';
  game1.resetGame();
  endContainer1.style.marginLeft = CANVAS_WIDTH + 'px';
  endContainer2.style.marginLeft = '0px';
}

// Restart the second instance of the game on click of the button
function restartGame2() {
  game2.endContainer.style.display = 'none';
  game2.resetGame();
  endContainer2.style.marginLeft = CANVAS_WIDTH + 'px';
  endContainer1.style.marginLeft = '0px';
}
