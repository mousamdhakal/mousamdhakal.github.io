function Game(key, endContainer, score, bestscore) {
  this.bird = null;
  this.obstaclesList = [];
  this.interval = null;
  this.score = null;
  this.scoreCount = 0;
  this.canvas = document.createElement('canvas');
  this.context = this.canvas.getContext('2d');
  this.frameNo = 0;
  this.background = null;
  this.gameRunning = true;
  this.obstacleNumber = 0;
  this.checkCollision = true;
  this.key = key;
  this.endContainer = endContainer;
  this.scoreContainer = score;
  this.bestscore = bestscore;

  this.img = new Image();
  this.img.src = './images/flappyBird.png';

  this.img.onload = function () {
    this.init();
  }.bind(this);

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

  this.start = function () {
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    document.body.appendChild(this.canvas);
    this.updateGameArea();
  };

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

  this.clearCanvas = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

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

  this.reactToKeyDown = function (pressedKey) {
    if (pressedKey == this.key && this.gameRunning) {
      this.bird.animateBird();
      this.updateCanvas();
      this.bird.gravitySpeed = 0;
    }
  }.bind(this);

  this.reactToKeyUp = function (pressedKey) {
    if (pressedKey == this.key) {
      this.accelerate(0.1);
    }
  }.bind(this);

  this.accelerate = function (n) {
    var self = this;
    if (!this.interval) {
      this.interval = setInterval(self.updateGameArea, 20);
    }

    this.bird.gravity = n;
  }.bind(this);
}
