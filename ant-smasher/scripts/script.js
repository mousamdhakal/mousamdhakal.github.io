// Get the canvas element to draw on it
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Initialize ansArray which contains all ant
var antsArray = [];

// Number of ants
var antsCount = 10;

/**
 * Initialize the game
 * Creates ant objects and pushes to antsArray
 */
function init() {
  // Create ant objects according to antsCount
  for (var i = 0; i < antsCount; i++) {
    var x = Math.floor(Math.random() * 944) + 28; // Choose random x-co-ordinate
    var y = Math.floor(Math.random() * 562) + 19; // Choose random y-co-ordinate

    //Check if a ant already exists in a place for collision
    antsArray.forEach(function (ant) {
      var antDimension = ant.antInfo();
      while (
        Math.abs(antDimension.x - x) < 57 &&
        Math.abs(antDimension.y - y) < 39
      ) {
        x = Math.floor(Math.random() * 944) + 28;
        y = Math.floor(Math.random() * 562) + 19;
      }
    });

    var ant = new Ant(x, y);

    antsArray.push(ant);
  }
}

/**
 * Recursively create Animation
 */
function repaintDOM() {
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.height);

  // Text on animation finish
  if (antsArray.length == 0) {
    ctx.font = "30px Arial";
    ctx.fillText("You have smashed all ants :(", 10, 50);
  }

  antsArray.forEach(function (ant) {
    ant.moveant();
  });

  requestAnimationFrame(repaintDOM);
}

/**
 * Check if the ant object exists in the provided co-ordinate
 * @param  {Object} point - Co-ordinates of a point in screen
 * @param  {Object} ant - An ant object
 * @return {Boolean}      true if ant object exists , false otherwise
 */
function isIntersect(point, ant) {
  var antDetails = ant.antInfo();
  var clicked = false;

  // Check if the point clicked falls within the image boundary
  if (
    antDetails.x <= point.x &&
    point.x <= antDetails.x + antDetails.w &&
    antDetails.y <= point.y &&
    point.y <= antDetails.y + antDetails.h
  ) {
    clicked = true;
  }
  return clicked;
}

/**
 * Add eventlistener on the canvas to remove an ant element if clicked upon
 */

canvas.addEventListener("click", function (e) {
  // Get the point co-ordinates where mouse ic clicked
  var mousePoint = {
    x: e.clientX,
    y: e.clientY,
  };

  // Check if the point falls in the boundary of every ant
  antsArray.forEach(function (ant) {
    if (isIntersect(mousePoint, ant)) {
      // Remove an ant from antsArray if the point clicked falls in it's boundary
      antsArray = antsArray.filter(function (someAnt) {
        return ant != someAnt;
      });
    }
  });
});

init(); // Start the game
repaintDOM(); // Start the animation
