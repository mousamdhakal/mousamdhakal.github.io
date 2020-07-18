// Variables for controlling the mapbuilder
let mapCanvas;
let mapCanvasContext;
let mousedown = false;
let setTank = false;

// Tank image for the canvas
let tankImage = new Image();
tankImage.src = './images/tank-mini.png';

/**
 * Display the mapBuilder screen setting up the canvas on click of the button
 */
function showMapBuilder() {
  // Manage the screen displays
  levelContainer.style.display = 'none';
  controlsButton.style.display = 'none';
  mapBuilderContainer.style.display = 'block';

  // Get mapbuilder canvas and it's context
  mapCanvas = document.getElementById('map-builder__canvas');
  mapCanvasContext = mapCanvas.getContext('2d');

  // Add event listeners for drawing on canvas
  mapCanvas.addEventListener('mousedown', function (e) {
    // Get position where mouse was clicked
    let position = getCursorPosition(mapCanvas, e);

    // Fill that position according type of object currently being drawn
    fillCanvas(position);

    // Set mousedown flag
    mousedown = true;
  });
  mapCanvas.addEventListener('mousemove', function (e) {
    // On mousemove  if the mousedown flag is set and object to fill is not tank, then fill that position of mousemove
    if (mousedown && !setTank) {
      let position = getCursorPosition(mapCanvas, e);
      fillCanvas(position);
    }
  });
  mapCanvas.addEventListener('mouseup', function () {
    // On mouseup, reset mousedown flag
    mousedown = false;
  });

  // Initialize the canvas for drawing with boundary walls and user position
  clearCanvas();
}

/**
 * Fill the specified position block/cell with respective color or image
 * @param {Object} position - object with x and y co-ordinate values of the position
 */
function fillCanvas(position) {
  // Calculate the block on mapbuilder canvas where the position falls
  let xCell = Math.floor(position.x / MAPBUILDERSCALE);
  let yCell = Math.floor(position.y / MAPBUILDERSCALE);

  // If that cell is in border wall position or user position , return
  if (
    xCell == 0 ||
    yCell == 0 ||
    xCell == MAPSIZE - 1 ||
    yCell == MAPSIZE - 1 ||
    (xCell == 1 && yCell == 1)
  ) {
    return;
  }

  // Fill the block according to respective color
  mapCanvasContext.fillRect(
    xCell * MAPBUILDERSCALE,
    yCell * MAPBUILDERSCALE,
    MAPBUILDERSCALE,
    MAPBUILDERSCALE
  );

  // If setTank flag is set, draw the tank image on that block
  if (setTank) {
    mapCanvasContext.drawImage(
      tankImage,
      xCell * MAPBUILDERSCALE,
      yCell * MAPBUILDERSCALE,
      MAPBUILDERSCALE,
      MAPBUILDERSCALE
    );
  }
}

/**
 * Get the x and y position of cursor in the canvas
 * @param {Object} canvas - DOM Canvas element where we need to find the position of cursor
 * @param {Event} event - Mouse event which gives position of the cursor relative to the page
 */
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return { x: x, y: y };
}

/**
 * Fill the map with empty white blocks and draw the bounding walls  and user tank
 */
function clearCanvas() {
  mapCanvasContext.fillStyle = 'white';
  mapCanvasContext.fillRect(
    0,
    0,
    MAPSIZE * MAPBUILDERSCALE,
    MAPSIZE * MAPBUILDERSCALE
  );
  mapCanvasContext.fillStyle = 'rgb(256,0,0)';
  mapCanvasContext.fillRect(
    MAPBUILDERSCALE,
    MAPBUILDERSCALE,
    MAPBUILDERSCALE,
    MAPBUILDERSCALE
  );
  mapCanvasContext.fillStyle = 'rgb(100,100,100)';
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE * MAPSIZE, MAPBUILDERSCALE);
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE);
  mapCanvasContext.fillRect(
    MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE,
    0,
    MAPBUILDERSCALE,
    MAPBUILDERSCALE * MAPSIZE
  );
  mapCanvasContext.fillRect(
    0,
    MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE,
    MAPBUILDERSCALE * MAPSIZE,
    MAPBUILDERSCALE
  );
  setTank = false;
}

/**
 * Set the fillstyle to be for the wall and reset setTank flag
 */
function fillWall() {
  mapCanvasContext.fillStyle = 'rgb(100,100,100)';
  setTank = false;
}

/**
 * Set the fillstyle to be for the horizontal tank and set setTank flag
 */
function fillHorizontalTank() {
  mapCanvasContext.fillStyle = 'rgb(254,254,254)';
  setTank = true;
}

/**
 * Set the fillstyle to be for the vertical tank and set setTank flag
 */
function fillVerticalTank() {
  mapCanvasContext.fillStyle = 'rgb(253,253,253)';
  setTank = true;
}

/**
 * Reset a specific block on the canvas,i.e- fill it with white and reset setTank flag
 */
function clearBlock() {
  mapCanvasContext.fillStyle = 'white';
  console.log(mapCanvasContext.fillStyle);
  setTank = false;
}
