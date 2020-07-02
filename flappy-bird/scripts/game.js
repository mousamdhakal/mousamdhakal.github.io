/**
 * Create an instance of game on the canvas
 * @param  {Number} key - Keycode for the key pressing which the bird flies in this instance
 * @param  {Object} endContainer - DOM Container element to show on gameove
 * @param  {Object} score - DOM element where score is displayed
 * @param  {Object} bestscore - DOM element where bestscore is displayed
 * @returns {Object} An instance of the game
 */

function Game(key, endContainer, score, bestscore) {
  // Initialize variables
  this.bird = null;
  this.obstaclesList = [];
  this.interval = null;
  this.score = null;
  this.scoreCount = 0;
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.frameNo = 0;
  this.background = null;
  this.gameRunning = true; // Set to filter multiple keydown events continuously
  this.obstacleNumber = 0;
  this.key = key;
  this.endContainer = endContainer;
  this.scoreContainer = score;
  this.bestscore = bestscore;

  // Fetch the sprite sheet and start game once fetchign completed
  this.img = new Image();
  this.img.src = './images/flappyBird.png';

  this.img.onload = function () {
    this.init();
  }.bind(this);

  /**
   * Initilaize the game creating bird background and score
   */
  this.init = function () {
    this.bird = new Component(
      52,
      38,
      this.img,
      10,
      120,
      this,
      'image',
      180,
      514,
      26,
      19
    );
    this.bird.gravity = 0.05;
    this.score = new Component(
      '30px',
      'Consolas',
      'black',
      280,
      40,
      this,
      'text'
    );
    this.background = new Component(
      450,
      500,
      this.img,
      0,
      0,
      this,
      'background',
      0,
      0,
      225,
      400
    );
    this.start();
  };

  /**
   * Set the canvas
   */
  this.start = function () {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(this.canvas);
    this.updateGameArea();
  };

  /**
   * Show score on screen and stop game after game ends
   */
  this.endGame = function () {
    //Set the score on Endscreen
    this.scoreContainer.innerHTML = '' + this.scoreCount;
    this.endContainer.style.width = CANVAS_WIDTH + 'px';
    this.endContainer.style.height = CANVAS_HEIGHT + 'px';

    // Fetch the bestscore from localstorage and update if needed
    var prevBest = parseInt(localStorage.getItem('score'));
    this.scoreCount = prevBest > this.scoreCount ? prevBest : this.scoreCount;
    this.bestscore.innerHTML = '' + this.scoreCount;
    localStorage.setItem('score', this.scoreCount);
    this.endContainer.style.display = 'block';
    this.gameRunning = false;

    clearInterval(this.interval);
  };

  /**
   * Reset variables on game restart
   */
  this.resetGame = function () {
    this.bird = null;
    this.obstaclesList = [];
    this.interval = null;
    this.score = null;
    this.scoreCount = 0;
    this.frameNo = 0;
    this.background = null;
    this.gameRunning = true;
    this.obstacleNumber = 0;
    this.init();
  };

  /**
   * Clear the canvas
   */
  this.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  /**
   * Check for collision of bird and update canvas
   */
  this.updateGameArea = function () {
    if (this.checkCollision) {
      for (i = 0; i < this.obstaclesList.length; i++) {
        if (this.bird.crashWith(this.obstaclesList[i])) {
          this.endGame();
          return;
        }
      }
    }
    this.updateCanvas();
  }.bind(this);

  /**
   * Update the canvas for background,score,bird and obstacles
   */
  this.updateCanvas = function () {
    this.clearCanvas();
    this.background.update();
    this.frameNo++;
    obstacleHandler(this);
    this.scoreCount = Math.floor(this.frameNo / 100);
    this.score.text = 'SCORE: ' + this.scoreCount;
    this.score.update();
    this.bird.newPos();
    this.bird.flyBird();
    this.bird.update();
  }.bind(this);

  this.everyInterval = function (n) {
    if ((this.frameNo / n) % 1 == 0) {
      return true;
    }
    return false;
  };

  /**
   * React to keydown event
   */
  this.reactToKeyDown = function (pressedKey) {
    if (pressedKey == this.key && this.gameRunning) {
      this.bird.animateBird();
      this.updateCanvas();
      this.bird.gravitySpeed = 0;
    }
  }.bind(this);

  /**
   * React to keyup event
   */
  this.reactToKeyUp = function (pressedKey) {
    if (pressedKey == this.key) {
      this.accelerate(0.1);
    }
  }.bind(this);

  /**
   * Acceleerate the bird to simulate gravity
   */
  this.accelerate = function (n) {
    var self = this;
    if (!this.interval) {
      this.interval = setInterval(self.updateGameArea, 20);
    }

    this.bird.gravity = n;
  }.bind(this);
}
