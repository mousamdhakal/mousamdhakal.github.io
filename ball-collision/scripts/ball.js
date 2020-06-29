/**
 * Create a Ball Object
 * @param  {Number} x - Initial position of the ball in x-direction in Canvas
 * @param  {Number} y - Initial position of the ball in y-direction in Canvas
 * @param  {Number} radius - Radius of the ball
 * @return {Object}      Ball Object
 */
function Ball(x, y, radius) {
  // Initialize variables
  this.x = x;
  this.y = y;
  this.size = radius;
  this.mass = this.size;
  this.color = getColor();
  this.dx = Math.ceil(Math.random() * 5);
  this.dy = Math.ceil(Math.random() * 5);

  /**
   * Draw the ball
   */
  this.drawBall = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }.bind(this);

  /**
   * Return the ball info
   * @return {Object}   Information about the ball in an object
   */
  this.ballInfo = function () {
    return {
      radius: this.size,
      x: this.x,
      y: this.y,
      vx: this.dx,
      vy: this.dy,
    };
  };

  /**
   * Checks for collision of this ball with all other balls
   */
  this.collisionChecker = function () {
    ballsArray.forEach(
      function (ball) {
        if (this != ball) {
          detectCollision(this, ball);
        }
      }.bind(this)
    );
  };

  /**
   * Checks for collision of this ball with the walls of the canvas
   */
  this.wallCollision = function () {
    // Detect right wall
    if (this.x + this.size > canvas.width) {
      this.dx = -Math.abs(this.dx);
    }

    // Detect left wall
    if (this.x - this.size < 0) {
      this.dx = Math.abs(this.dx);
    }

    // Detect bottom wall
    if (this.y + this.size > canvas.height) {
      this.dy = -Math.abs(this.dy);
    }
    // Detect top wall
    if (this.y - this.size < 0) {
      this.dy = Math.abs(this.dy);
    }
  };

  /**
   * Moves the ball by a small amount
   */
  this.moveBall = function () {
    this.wallCollision();
    this.collisionChecker();
    this.drawBall();

    this.x += this.dx;
    this.y += this.dy;
  }.bind(this);

  this.moveBall();
}

/**
 * Detect collision between two balls
 * @param  {Object} ball1 - First Ball object
 * @param  {Object} ball2 - Second Ball object
 */
function detectCollision(ball1, ball2) {
  var circle1 = ball1.ballInfo();
  var circle2 = ball2.ballInfo();
  var dx = circle2.x - circle1.x;
  var dy = circle2.y - circle1.y;
  var distance = Math.sqrt(dx * dx + dy * dy);

  // Check if collision exists
  if (distance <= circle2.radius + circle1.radius) {
    // Calculate collision vector
    var vCollision = {
      x: circle2.x - circle1.x,
      y: circle2.y - circle1.y,
    };

    // Calculate distance of the collision vecotr
    var distance = Math.sqrt(
      (circle2.x - circle1.x) * (circle2.x - circle1.x) +
        (circle2.y - circle1.y) * (circle2.y - circle1.y)
    );

    // Create normalized collisionvector to find direction
    var vCollisionNorm = {
      x: vCollision.x / distance,
      y: vCollision.y / distance,
    };

    // Calculate relative veloxity and speed
    var vRelativeVelocity = {
      x: circle1.vx - circle2.vx,
      y: circle1.vy - circle2.vy,
    };

    // Calculate the speed in which the balls are moving for collision
    var speed =
      vRelativeVelocity.x * vCollisionNorm.x +
      vRelativeVelocity.y * vCollisionNorm.y;

    // Clculate the impulse the balls have on each other
    var impulse = (2 * speed) / (ball1.mass + ball2.mass);

    // Return if speed is negative (Objects are moving away from each other)
    if (speed < 0) {
      return;
    }

    // Calculate the effect of collision on ball1 by multiplying by impulse, mass of ball2 and normalized collision vector
    ball1.dx -= impulse * ball2.mass * vCollisionNorm.x;
    ball1.dy -= impulse * ball2.mass * vCollisionNorm.y;
    ball1.wallCollision(); // Check for wall collision

    // Calculate the effect of collision on ball2 by multiplying by impulse, mass of ball1 and normalized collision vector
    ball2.dx += impulse * ball1.mass * vCollisionNorm.x;
    ball2.dy += impulse * ball1.mass * vCollisionNorm.y;
    ball2.wallCollision(); // Check for wall collision
  }
}
