/**
 * Create an component on the canvas
 * @param  {Number} width - Width of the canvas element or font-size for text element
 * @param  {Number} height - Height of the canvas element or font-family for text element
 * @param  {string} color - specifies color for shape and text or source for image files
 * @param  {Number} x - x co-ordinate to draw on canvas
 * @param  {Number} y - y co-ordinate to draw on canvas
 * @param  {object} parent - the parent game object from where component is created
 * @param  {string} type - (optional) specifies type of the element, required if element is text, image or background-image
 * @param  {Number} sx - (optional) The x position of the spritesheet where image starts
 * @param  {Number} sy - (optional) The y position of the spritesheet where image starts
 * @param  {Number} sWidth - (optional) The width of the image on the spritesheet
 * @param  {Number} sHeight - (optional) The height of the image on the spritesheet
 * @returns {Object} A component that can be rendered on the canvas
 */
function Component(
  width,
  height,
  color,
  x,
  y,
  parent,
  type,
  sx,
  sy,
  sWidth,
  sHeight
) {
  // Initializes the value for the component
  this.type = type;
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.parent = parent;
  this.sx = sx;
  this.sy = sy;
  this.sWidth = sWidth * SCALEBACKGROUND;
  this.sHeight = sHeight * SCALEBACKGROUND;

  // Initiate variables to animate if the component is a bird
  this.birdPositions = [0, 1, 0, 2];
  this.birdPosition = 0;
  /**
   * Function that gets called in each iteration to create animated effect
   */
  this.update = function () {
    ctx = this.parent.context;

    // Set styles for text element
    if (this.type == 'text') {
      this.setText();
    }
    // Draw images and background
    else if (this.type == 'image' || this.type == 'background') {
      this.setImage();
    }

    // Simple styling for shapes
    else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  /**
   * Sets the text element on canvas
   */
  this.setText = function () {
    ctx.font = this.width + ' ' + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);
  };

  /**
   * Sets the image element on canvas
   */
  this.setImage = function () {
    ctx.drawImage(
      this.parent.img,
      this.sx,
      this.sy,
      this.sWidth,
      this.sHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  };

  /**
   * Ceates new position for the component and checks if boundary is hit
   */
  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBoundary();
  };

  /**
   * Checks if component has hit the boundary
   */
  this.hitBoundary = function () {
    var bottom = this.parent.canvas.height - this.height;
    var top = 0;
    if (this.y > bottom || this.y < top) {
      parent.endGame();
    }
  };

  /**
   * Checks if this object(bird) has crashed with another object
   */
  this.crashWith = function (otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };

  /**
   * Creates flying animation on bird changing image posiiton from spritesheet in every three frames
   */
  this.flyBird = function () {
    if (parent.everyInterval(3)) {
      this.sy = BIRDINITIAL + this.birdPositions[this.birdPosition] * BIRDGAP;
      this.birdPosition++;
      if (this.birdPosition > 3) {
        this.birdPosition = 0;
      }
    }
  };

  /**
   * Animates bird on hitting the key to fly
   */
  this.animateBird = function () {
    var max = 30;
    var stepIncrease = -3;
    var self = this;
    var currentPosition = this.y; // Current position of bord
    var animationAmount = 0;

    /**
     * Function that gets called recursively to create animation
     */
    function step() {
      animationAmount += stepIncrease;

      self.y = currentPosition + Math.max(animationAmount, -max);
      if (Math.max(animationAmount, -max) != -max) {
        window.requestAnimationFrame(step);
      }
    }

    window.requestAnimationFrame(step); // Start the animation
  }.bind(this);
}
