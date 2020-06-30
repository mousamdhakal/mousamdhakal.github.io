// Get the canvas element to draw on it
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

/**
 * Choose a random color
 * @return {string}   Color in rgb format
 */
function getColor() {
  var r = Math.floor(Math.random() * 200);
  var g = Math.floor(Math.random() * 200);
  var b = Math.floor(Math.random() * 200);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}

var ballsArray = [];

// Number of balls
// Successfully passed stress test for 1000 balls, set minRadius to 3 and radiusRange to 7, to see all balls on the canvas
var ballsCount = 1000;
var minRadius = 3; // Minimum radius of the ball
var radiusRange = 7; // Range of difference in radius between the balls

function init() {
  // Create the balls and push it to ballsArray
  for (let i = 0; i < ballsCount; i++) {
    var x = Math.floor(Math.random() * 940) + 30; // Choose random x-co-ordinate
    var y = Math.floor(Math.random() * 540) + 30; // Choose random y-co-ordinate
    var radius = Math.floor(Math.random() * radiusRange) + minRadius; // Choose random radius of the ball

    //Check if a ball already exists in a place for collision
    ballsArray.forEach(function (ball) {
      var ballDimension = ball.ballInfo();
      while (
        Math.abs(ballDimension.x - x) < 60 &&
        Math.abs(ballDimension.y - y) < 60
      ) {
        x = Math.floor(Math.random() * 940) + 30;
        y = Math.floor(Math.random() * 540) + 30;
      }
    });

    var ball = new Ball(x, y, radius);

    ballsArray.push(ball);
  }
}

//function to create animation
function repaintDOM() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

  ballsArray.forEach(function (ball) {
    ball.moveBall();
  });

  requestAnimationFrame(repaintDOM);
}

init();
repaintDOM();
