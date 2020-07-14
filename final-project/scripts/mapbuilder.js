let mapCanvas;
let mapCanvasContext;
let mousedown = false;
function showMapBuilder() {
  startContainer.style.display = "none";
  mapBuilderContainer.style.display = "block";
  mapCanvas = document.getElementById("map-builder__canvas");
  mapCanvasContext = mapCanvas.getContext("2d");
  mapCanvas.addEventListener('mousedown', function (e) {
    mousedown = true;
    let position = getCursorPosition(mapCanvas, e);
    fillCanvas(position);
  })
  mapCanvas.addEventListener('mousemove', function (e) {
    if (mousedown) {
      let position = getCursorPosition(mapCanvas, e);
      fillCanvas(position);
    }
  })
  mapCanvas.addEventListener('mouseup', function () {
    mousedown = false;
  })
  clearCanvas();
}

function fillCanvas(position) {
  let xCell = Math.floor(position.x / MAPBUILDERSCALE);
  let yCell = Math.floor(position.y / MAPBUILDERSCALE);
  if (xCell == 0 || yCell == 0 || xCell == MAPSIZE - 1 || yCell == MAPSIZE - 1) {
    return;
  }
  mapCanvasContext.fillRect(xCell * MAPBUILDERSCALE, yCell * MAPBUILDERSCALE, MAPBUILDERSCALE, MAPBUILDERSCALE);
}

function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  return { x: x, y: y };
}

function clearCanvas() {
  mapCanvasContext.fillStyle = "white";
  mapCanvasContext.fillRect(0, 0, MAPSIZE * MAPBUILDERSCALE, MAPSIZE * MAPBUILDERSCALE);
  mapCanvasContext.fillStyle = "rgb(100,100,100)";
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE * MAPSIZE, MAPBUILDERSCALE);
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE);
  mapCanvasContext.fillRect(MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE, 0, MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE);
  mapCanvasContext.fillRect(0, MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE, MAPBUILDERSCALE);
}


function fillWall() {
  mapCanvasContext.fillStyle = "rgb(100,100,100)";
}

function fillHorizontalTank() {
  mapCanvasContext.fillStyle = "rgb(0,0,0)";
}

function fillVerticalTank() {
  mapCanvasContext.fillStyle = "rgb(1,1,1)";
}

function clearBlock() {
  console.log(mapCanvasContext.fillStyle);
  mapCanvasContext.fillStyle = "white";
  console.log(mapCanvasContext.fillStyle);
}


function showCustoms() {
  startContainer.style.display = "none";
  customContainer.style.display = "block";
}

