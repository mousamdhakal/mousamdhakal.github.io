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

  this.setText = function () {
    ctx.font = this.width + ' ' + this.height;
    ctx.fillStyle = color;
    ctx.fillText(this.text, this.x, this.y);
  };

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

    // Continuoulsy loop the background images
    // if (this.type == "background") {
    //   ctx.drawImage(
    //     this.parent.img,
    //     this.sx,
    //     this.sy,
    //     this.sWidth,
    //     this.sHeight,
    //     this.x + 220,
    //     this.y,
    //     this.width,
    //     this.height
    //   );
    // }
  };

  this.newPos = function () {
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBoundary();
  };

  this.hitBoundary = function () {
    var bottom = this.parent.canvas.height - this.height;
    var top = 0;
    if (this.y > bottom || this.y < top) {
      parent.endGame();
    }
  };

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
   * Slide the car from one lane to another using animation
   * @param  {Number} position - Current position of the car
   * @param  {Number} stepIncrease - Direction in which car needs to be moved 1 for right and -1 for left
   */
  this.animateBird = function () {
    // // if the car is moving or the car is trying to move right from third lane or left from first lane , return
    // if (
    //   this.x != position ||
    //   (position == lanePosition[0] && stepIncrease < 0) ||
    //   (position == lanePosition[2] && stepIncrease > 0)
    // ) {
    //   return;
    // }
    var max = 30;
    var stepIncrease = -3;
    var self = this;
    var currentPosition = this.y; // Current position of car
    var animationAmount = 0;

    /**
     * Function that gets called recursively to create animation
     */
    function step() {
      animationAmount += stepIncrease;
      // self.gravitySpeed = 0;

      // Slide left gradually if stepIncrease is negative
      // if (stepIncrease > 0) {
      // self.x = currentPosition + Math.min(animationAmount, max);
      // if (Math.min(animationAmount, max) != max) {
      //   window.requestAnimationFrame(step);
      // }
      // }

      // // Slide right gradually if stepIncrease is positive
      // if (stepIncrease < 0) {
      self.y = currentPosition + Math.max(animationAmount, -max);
      if (Math.max(animationAmount, -max) != -max) {
        window.requestAnimationFrame(step);
      }
      // }
    }

    window.requestAnimationFrame(step); // Start the animation
  }.bind(this);
}
