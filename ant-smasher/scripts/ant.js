/**
 * Create an Ant Object
 * @param  {Number} x - Initial position of the ant in x-direction in Canvas
 * @param  {Number} y - Initial position of the ant in y-direction in Canvas
 * @return {Object}      Ant Object
 */
function Ant(x, y) {
  // Initialize variables
  this.x = x;
  this.y = y;
  this.width = 57;
  this.height = 39;
  this.dx = Math.round(Math.random()) * 3 + -1.5;
  this.dy = Math.round(Math.random()) * 3 + -1.5;

  // Fetch images to display when moving to forward and backward direction
  var imgFront = new Image();
  var imgBack = new Image();
  imgFront.src = "./images/ant.gif";
  imgBack.src = "./images/ant-back.gif";
  var img;

  // Set initial image moving to forward direction
  this.dx > 0 ? (img = imgFront) : (img = imgBack);

  // Change image to simulate reverse movement on hitting wall and other ants
  this.changeDirection = function () {
    img == imgFront ? (img = imgBack) : (img = imgFront);
  };

  /**
   * Draw the ant
   */
  this.drawant = function () {
    ctx.beginPath();
    ctx.drawImage(img, this.x, this.y);
  }.bind(this);

  /**
   * Return the ant info
   * @return {Object}   Information about the ant in an object
   */
  this.antInfo = function () {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height,
      vx: this.dx,
      vy: this.dy,
    };
  };

  /**
   * Checks for collision of this ant with all other ants
   */
  this.collisionChecker = function () {
    antsArray.forEach(
      function (ant) {
        if (this != ant) {
          detectCollision(this, ant);
        }
      }.bind(this)
    );
  };

  /**
   * Checks for collision of this ant with the walls of the canvas
   */
  this.wallCollision = function () {
    // Detect right wall
    if (this.x + this.width > canvas.width) {
      this.dx = -Math.abs(this.dx);
      this.changeDirection();
    }

    // Detect left wall
    if (this.x < 0) {
      this.dx = Math.abs(this.dx);
      this.changeDirection();
    }

    // Detect bottom wall
    if (this.y + this.height > canvas.height) {
      this.dy = -Math.abs(this.dy);
    }
    // Detect top wall
    if (this.y < 0) {
      this.dy = Math.abs(this.dy);
    }
  };

  /**
   * Moves the ant by a small amount
   */
  this.moveant = function () {
    this.wallCollision();
    this.collisionChecker();
    this.drawant();

    this.x += this.dx;
    this.y += this.dy;
  }.bind(this);

  this.moveant();
}

/**
 * Detect collision between two ants
 * @param  {Object} ant1 - First ant object
 * @param  {Object} ant2 - Second ant object
 */
function detectCollision(ant1, ant2) {
  var shape1 = ant1.antInfo();
  var shape2 = ant2.antInfo();

  // Check if collision exists
  if (
    shape2.x < shape1.w + shape1.x &&
    shape1.x < shape2.w + shape2.x &&
    shape2.y < shape1.h + shape1.y &&
    shape1.y < shape2.h + shape2.y
  ) {
    // Check the major direction in which collision occurs to change either of the directions
    if (shape2.x - shape1.x > shape2.y - shape1.y) {
      ant1.dx *= -1;
      ant2.dx *= -1;

      // Change direction if collision occurs in x-direction
      ant1.changeDirection();
      ant2.changeDirection();
    } else {
      ant1.dy *= -1;
      ant2.dy *= -1;
    }

    // Check for wall collision
    ant1.wallCollision();
    ant2.wallCollision();
  }
}
