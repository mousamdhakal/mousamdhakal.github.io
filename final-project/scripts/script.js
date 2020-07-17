import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById("gameCanvas");

// loadLevels();
document.getElementById('start').addEventListener('click', loadLevels);

document.getElementById('save-map').addEventListener('click', saveMap);

function startNewGame() {
  let i = parseInt(this.id);
  game = new Game(canvas, i);
  levelContainer.style.display = "none";
  winContainer.style.display = "none";
  gameContainer.style.display = "block";
  game.init();

}

function loadLevels() {
  startContainer.style.display = "none";
  let list = document.getElementById('maps__list');
  list.innerHTML = "";
  document.getElementById('level-screen').style.display = "block";
  for (let i = 0; i < mapList.length; i++) {
    let listElement = document.createElement('li');
    let canvas = document.createElement('canvas');
    canvas.setAttribute('width', 168);
    canvas.setAttribute('height', 168);
    loadLevelCanvas(canvas, i + 1);
    canvas.setAttribute('id', i + 1);
    canvas.addEventListener('click', startNewGame);
    listElement.appendChild(canvas);
    list.appendChild(listElement);
  }
}

function loadLevelCanvas(canvas, mapIndex) {
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
      } else if (red == 254 && green == 254 && blue == 254) {
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
      } else if (red == 253 && green == 253 && blue == 253) {
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
  updateMaps();
}

function updateMaps() {
  var maps = {
    mapList: mapList,
    mapEnemies: mapEnemies
  };
  localStorage.setItem('savedMaps', JSON.stringify(maps));
  mapBuilderContainer.style.display = "none";
  levelContainer.style.display = "block";
  controlsButton.style.display = "inline";
  loadMaps();
  loadLevels();
};
