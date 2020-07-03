/**
 * Creates a new helix object
 * @returns {Object} - helix object
 */
function Helix() {
  this.type = 0;
  this.frameNo = 0;
  this.y;
  this.verticalGap;

  this.updateCanvas = function () {
    clearCanvas();
    this.frameNo++;
    this.colDistance = 0;
    this.type = this.frameNo * SPEED;

    // For every type
    for (var count = 0; count < TYPES; count++) {
      // If this is the first type of animation then set currentType to what it is (i.e- 0 at start)
      if (count === 0) {
        var currentType = this.type;
      }

      // Other wise set currentType by multiplying the type number(count) and Pi to make the circles of different type synchronous with each other
      else {
        var currentType = this.type + count * Math.PI;
      }

      var x = 0;

      // For every column
      for (var col = 0; col < NOOFCOLUMNS; col++) {
        // Set x position for all the circles of this column and calculate verticalGap value for this column
        x = x + 30;
        this.verticalGap = (col * Math.PI) / 10;

        // For every row in this column
        for (var row = 0; row < NOOFROWS; row += 1) {
          // Calculate y value which depends on current row and a sinusoidal function
          var y =
            canvas.height / 2.5 +
            row * 11 +
            Math.sin(currentType + this.verticalGap) * 50;

          // calculate the required sizeDifference on radius of circle which depends on cosine function of current row and others
          var sizeDifference =
            (Math.cos(currentType - row * 0.1 + this.verticalGap) + 1) * 0.5;
          var radius = sizeDifference * MAXRADIUS;

          // Draw the circle on the calculated position
          this.drawCircle(x, y, radius);
        }
      }
    }

    // Creates animation recursively
    window.requestAnimationFrame(this.updateCanvas);
  }.bind(this);

  /**
   * Draws a circle based on given x,y xo-ordinates and radius
   */
  this.drawCircle = function (x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#fea57c";
    ctx.fill();
    ctx.closePath();
  };
}
