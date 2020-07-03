// Fetch canvas element and set the context
var canvas = document.getElementById("animatedCanvas");
var ctx = canvas.getContext("2d");

/**
 * Clears everything on canvas
 */
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Create new instance of the Helix constructor
var helix1 = new Helix();
helix1.updateCanvas();
