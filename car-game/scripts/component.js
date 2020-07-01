/**
 * Create an component on the canvas
 * @param  {Number} width - Width of the canvas element or font-size for text element
 * @param  {Number} height - Height of the canvas element or font-family for text element
 * @param  {string} color - specifies color for shape and text or source for image files
 * @param  {Number} x - x co-ordinate to draw on canvas
 * @param  {Number} y - y co-ordinate to draw on canvas
 * @param  {string} type - (optional) specifies type of the element, required if element is text, image or background-image
 * @returns {Object} A component that can be rendered on the canvas
 */

function Component(width, height, color, x, y, type) {
  // Initializes the values for the component
  this.width = width;
  this.height = height;
  this.x = x;
  this.y = y;
  this.speedX = 0;
  this.speedY = 0;
  this.type = type;

  // Set scoreflag to increase score and lastBullet to calculate the duration from last bullet fired
  this.scoreFlag = false;
  this.lastBullet = 500; // Initially set to 500

  // If component is an image or background image , set the image source
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }

  /**
   * Function that gets called in each iteration to create animated effect
   */
  this.update = function () {
    ctx = myGameArea.context;

    // Set styles for text element
    if (this.type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    }
    // Draw images and background
    else if (this.type == "image" || this.type == "background") {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

      // Continuoulsy loop the background images
      if (this.type == "background") {
        ctx.drawImage(
          this.image,
          this.x,
          this.y - this.height,
          this.width,
          this.height
        );
      }
    }

    // Simple styling for shapes
    else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  };

  /**
   * Calculate new position of the object
   */
  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.type == "background") {
      if (this.y >= this.height) {
        this.y = 0;
      }
    }
  };

  /**
   * Calculate if this object crashes with another provided object
   * @param {Object} otherObj - Another object
   * @returns {boolean} - True if there is a crash , false otherwise
   */
  this.crashWith = function (otherObj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherObj.x;
    var otherright = otherObj.x + otherObj.width;
    var othertop = otherObj.y;
    var otherbottom = otherObj.y + otherObj.height;
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
   * Slide the car from one lane to another using animation
   * @param  {Number} position - Current position of the car
   * @param  {Number} stepIncrease - Direction in which car needs to be moved 1 for right and -1 for left
   */
  this.animateCar = function (position, stepIncrease) {
    // if the car is moving or the car is trying to move right from third lane or left from first lane , return
    if (
      this.x != position ||
      (position == lanePosition[0] && stepIncrease < 0) ||
      (position == lanePosition[2] && stepIncrease > 0)
    ) {
      return;
    }
    var max = 150;
    carPosition += stepIncrease;
    stepIncrease *= 5 + gamespeed; // Set speed of animation relative to speed of the game
    var self = this;
    var currentPosition = position; // Current position of car
    var animationAmount = 0;

    /**
     * Function that gets called recursively to create animation
     */
    function step() {
      animationAmount += stepIncrease;

      // Slide left gradually if stepIncrease is negative
      if (stepIncrease > 0) {
        self.x = currentPosition + Math.min(animationAmount, max);
        if (Math.min(animationAmount, max) != max) {
          window.requestAnimationFrame(step);
        }
      }

      // Slide right gradually if stepIncrease is positive
      if (stepIncrease < 0) {
        self.x = currentPosition + Math.max(animationAmount, -max);
        if (Math.max(animationAmount, -max) != -max) {
          window.requestAnimationFrame(step);
        }
      }
    }

    window.requestAnimationFrame(step); // Start the animation
  }.bind(this);

  /**
   * Deletes obstacle car, i.e- moves out of the canvas (for implementation on bullet collision)
   */
  this.deleteCar = function () {
    this.y = 1000;
  };

  /**
   * Deletes bullet (for implementation on bullet collision)
   */
  this.deleteBullet = function () {
    var self = this;
    bulletsList = bulletsList.filter(function (bullet) {
      return bullet != self;
    });
  };

  /**
   * Deletes ammo (for implementation on collision with userCar)
   */
  this.deleteAmmo = function () {
    var self = this;
    ammoArray = ammoArray.filter(function (ammo) {
      return ammo != self;
    });
  };

  /**
   * Increases score on passing a car or destroying it with bullet
   */
  this.increaseScore = function () {
    // Checks score flag so that one car can only increase score once
    if (!this.scoreFlag) {
      scoreCount++;
      this.scoreFlag = true;
    }
  }.bind(this);

  /**
   * Fires bullet ahead of the userCar
   */
  this.fireBullet = function () {
    // Check if car is in correct position
    if (
      this.x != lanePosition[0] &&
      this.x != lanePosition[1] &&
      this.x != lanePosition[2]
    ) {
      return;
    }

    // Check the position of previous bullet and return if anotheer bullet was fired recently
    if (
      (bulletsList.length > 0 &&
        bulletsList[bulletsList.length - 1].y + 400 > this.y) ||
      bulletsCount <= 0 ||
      this.lastBullet < 200
    ) {
      return;
    }

    // Create a new bullet and reduce the number of bullets
    bullet = new Component(5, 10, "red", this.x + 25, this.y - 10);
    bulletsCount--;
    bulletsList.push(bullet);
    this.lastBullet = 0; // Reset the duration of last bullet fired.
  };

  /**
   * Update the duration for last bullet fired
   */
  this.updateBullet = function () {
    this.lastBullet += 15;
  };
}
