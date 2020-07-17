let mapCanvas;
let mapCanvasContext;
let mousedown = false;
let setTank = false;
let tankImage = new Image();
tankImage.src = "./images/tank-mini.png";

function showMapBuilder() {
  levelContainer.style.display = "none";
  controlsButton.style.display = "none";
  mapBuilderContainer.style.display = "block";
  mapCanvas = document.getElementById("map-builder__canvas");
  mapCanvasContext = mapCanvas.getContext("2d");
  mapCanvas.addEventListener('mousedown', function (e) {
    let position = getCursorPosition(mapCanvas, e);
    fillCanvas(position);
    mousedown = true;
  })
  mapCanvas.addEventListener('mousemove', function (e) {
    if (mousedown && !setTank) {
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
  if (xCell == 0 || yCell == 0 || xCell == MAPSIZE - 1 || yCell == MAPSIZE - 1 || (xCell == 1 && yCell == 1)) {
    return;
  }
  mapCanvasContext.fillRect(xCell * MAPBUILDERSCALE, yCell * MAPBUILDERSCALE, MAPBUILDERSCALE, MAPBUILDERSCALE);
  if (setTank) {
    mapCanvasContext.drawImage(tankImage, xCell * MAPBUILDERSCALE, yCell * MAPBUILDERSCALE, MAPBUILDERSCALE, MAPBUILDERSCALE);
  }
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
  mapCanvasContext.fillStyle = "rgb(256,0,0)";
  mapCanvasContext.fillRect(MAPBUILDERSCALE, MAPBUILDERSCALE, MAPBUILDERSCALE, MAPBUILDERSCALE);
  mapCanvasContext.fillStyle = "rgb(100,100,100)";
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE * MAPSIZE, MAPBUILDERSCALE);
  mapCanvasContext.fillRect(0, 0, MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE);
  mapCanvasContext.fillRect(MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE, 0, MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE);
  mapCanvasContext.fillRect(0, MAPSIZE * MAPBUILDERSCALE - MAPBUILDERSCALE, MAPBUILDERSCALE * MAPSIZE, MAPBUILDERSCALE);
  setTank = false;
}


function fillWall() {
  mapCanvasContext.fillStyle = "rgb(100,100,100)";
  setTank = false;
}

function fillHorizontalTank() {
  mapCanvasContext.fillStyle = "rgb(254,254,254)";
  setTank = true;
}

function fillVerticalTank() {
  mapCanvasContext.fillStyle = "rgb(253,253,253)";
  setTank = true;
}

function clearBlock() {
  console.log(mapCanvasContext.fillStyle);
  mapCanvasContext.fillStyle = "white";
  console.log(mapCanvasContext.fillStyle);
  setTank = false;
}


function showCustoms() {
  levelContainer.style.display = "none";
  customContainer.style.display = "block";
}

