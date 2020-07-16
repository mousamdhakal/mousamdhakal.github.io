import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById("gameCanvas");

function startEasy() {
  // Create new object of class Game calling it's constructor function
  game = new Game(canvas, 1);
  startContainer.style.display = "none";
  controlContainer.style.display = "block";
  winContainer.style.display = "none";
}

function startClassic() {
  // Create new object of class Game calling it's constructor function
  game = new Game(canvas, 2);
  startContainer.style.display = "none";
  controlContainer.style.display = "block";
  winContainer.style.display = "none";
}


function setCustomScreen() {
  let list = document.getElementById('maps__list');
  list.innerHTML = "";
  document.getElementById('start-screen').style.display = "block";
  for (let i = 0; i < mapList.length; i++) {
    let listElement = document.createElement('li');
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', 168);
    canvas.setAttribute('height', 168);
    createCustomCanvas(canvas, i + 1);
    canvas.setAttribute('id', i + 1);
    canvas.addEventListener('click', startCustomGame);
    listElement.appendChild(canvas);
    list.appendChild(listElement);
  }
}

setCustomScreen();

function createCustomCanvas(canvas, mapIndex) {
  let map = getMap(mapIndex);
  let canvasContext = canvas.getContext('2d');
  canvasContext.fillStyle = "rgb(256,256,256)";
  canvasContext.fillRect(0, 0, MAPSIZE * CUSTOMMAPSCALE, MAPSIZE * CUSTOMMAPSCALE);
  canvasContext.fillStyle = "rgb(100,100,100)";
  for (let r = 0; r < MAPSIZE; r++) {
    for (let c = 0; c < MAPSIZE; c++) {
      if (map[r][c] != 0) {
        canvasContext.fillRect((c * CUSTOMMAPSCALE), (r * CUSTOMMAPSCALE), CUSTOMMAPSCALE, CUSTOMMAPSCALE);
      }
    }
  }
}

function startCustomGame() {
  let i = parseInt(this.id);
  game = new Game(canvas, i);
  startContainer.style.display = "none";
  controlContainer.style.display = "block";
  winContainer.style.display = "none";
}


function saveMap() {
  let newMap = [];
  let newEnemeies = [];
  let mapData = mapCanvasContext.getImageData(0, 0, 640, 640).data;
  for (let i = 0; i < MAPSIZE; i++) {
    newMap[i] = [];
    for (let j = 0; j < MAPSIZE; j++) {
      let sourceIndex = BYTESPERPIXEL * i * MAPBUILDERSCALE * 640 + BYTESPERPIXEL * MAPBUILDERSCALE * j;
      // console.log(sourceIndex);
      let red = mapData[sourceIndex];
      let green = mapData[sourceIndex + 1];
      let blue = mapData[sourceIndex + 2];
      if (red == 100 && green == 100 && blue == 100) {
        newMap[i][j] = 1;
      } else if (red == 0 && green == 0 && blue == 0) {
        newEnemeies.push({
          type: 4,
          x: 64 * j + 32,
          y: 64 * i + 32,
          arc: 0,
          deg: 0,
          visible: false,
          speedX: 1,
          speedY: 0,
          moved: 0,
          timeSinceLastBullet: 100,
          keySpacePressed: true
        });
        newMap[i][j] = 0;
      } else if (red == 1 && green == 1 && blue == 1) {
        newEnemeies.push({
          type: 4,
          x: 64 * j + 32,
          y: 64 * i + 32,
          arc: 0,
          deg: 0,
          visible: false,
          speedX: 0,
          speedY: 1,
          moved: 0,
          timeSinceLastBullet: 100,
          keySpacePressed: true
        });
        newMap[i][j] = 0;
      }
      else {
        newMap[i][j] = 0;
      }
      // newMap[i][j]
    }

  }
  mapList.push(newMap);
  mapEnemies.push(newEnemeies);
  saveMaps();
}

document.getElementById('save-map').addEventListener('click', saveMap);

let saveMaps = function () {
  var maps = {
    mapList: mapList,
    mapEnemies: mapEnemies
  };
  localStorage.setItem('savedMaps', JSON.stringify(maps));
  mapBuilderContainer.style.display = "none";
  startContainer.style.display = "block";
  loadMaps();
  setCustomScreen();
};
