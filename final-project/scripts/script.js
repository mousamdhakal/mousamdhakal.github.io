import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById('gameCanvas');

// Show levels on clicking the start button
document.getElementById('start').addEventListener('click', loadLevels);

// Save map on mapbuilderscreen
document.getElementById('save-map').addEventListener('click', saveMap);

/**
 * Starts new game when a map canvas is clicked on level selection screen
 */
function startNewGame() {
  // Get the id of the element that is the map number and pass that and the main game canvas to Game class to create a game object
  let i = parseInt(this.id);
  game = new Game(canvas, i);

  // Hide level screen and show game screen
  levelContainer.style.display = 'none';
  winContainer.style.display = 'none';
  gameContainer.style.display = 'block';

  // Start the game
  game.init();
}

/**
 * Load all the levels(maps) in canvases and add eventlistenere to start the game on clicking them respectively
 */
function loadLevels() {
  // Show levelscreen and hide startscreen
  startContainer.style.display = 'none';
  levelContainer.style.display = 'block';

  // Get and empty the list where the canvases are appended
  let list = document.getElementById('maps__list');
  list.innerHTML = '';

  // For all the existing maps
  for (let i = 0; i < mapList.length; i++) {
    // Create canvas and list item elements
    let listElement = document.createElement('li');
    let canvas = document.createElement('canvas');

    // Set the canvas dimensions according to mapsize and custom map scale
    canvas.setAttribute('width', MAPSIZE * CUSTOMMAPSCALE);
    canvas.setAttribute('height', MAPSIZE * CUSTOMMAPSCALE);

    // Pain that canvas
    loadLevelCanvas(canvas, i + 1);

    // Set id attribute for access to mapIndex to start the game
    canvas.setAttribute('id', i + 1);

    // Start the game on click
    canvas.addEventListener('click', startNewGame);

    // Append the canvas to list item
    listElement.appendChild(canvas);

    // Append the list item to the list
    list.appendChild(listElement);
  }
}

/**
 * Paint the map of provided mapindex onto the provided canvas
 * @param {Object} canvas - DOM canvas element where the map is to be drawn
 * @param {Number} mapIndex - Map index number
 */
function loadLevelCanvas(canvas, mapIndex) {
  // Get the map
  let map = getMap(mapIndex);
  let canvasContext = canvas.getContext('2d');

  // Fill the canvas with white color initially
  canvasContext.fillStyle = 'rgb(256,256,256)';
  canvasContext.fillRect(
    0,
    0,
    MAPSIZE * CUSTOMMAPSCALE,
    MAPSIZE * CUSTOMMAPSCALE
  );

  // Set fillstyle to grey for painitng the walls
  canvasContext.fillStyle = 'rgb(100,100,100)';
  for (let r = 0; r < MAPSIZE; r++) {
    for (let c = 0; c < MAPSIZE; c++) {
      // Whenever a number other than 0 is encountered on any position of the map, fill that block
      if (map[r][c] != 0) {
        canvasContext.fillRect(
          c * CUSTOMMAPSCALE,
          r * CUSTOMMAPSCALE,
          CUSTOMMAPSCALE,
          CUSTOMMAPSCALE
        );
      }
    }
  }
}

/**
 * Save the current map and enemies and reload maps and show levels on clicking save map button on mapbuilder screen
 */
function saveMap() {
  // Initialize map and enemies for this map
  let newMap = [];
  let newEnemeies = [];

  // Get pixel data from the mapBuilder canvas
  let mapData = mapCanvasContext.getImageData(0, 0, 640, 640).data;
  for (let i = 0; i < MAPSIZE; i++) {
    // Create a new row
    newMap[i] = [];
    for (let j = 0; j < MAPSIZE; j++) {
      // The first pixel falling in this block
      let sourceIndex =
        BYTESPERPIXEL * i * MAPBUILDERSCALE * 640 +
        BYTESPERPIXEL * MAPBUILDERSCALE * j;

      // Get color values of this pixel position
      let red = mapData[sourceIndex];
      let green = mapData[sourceIndex + 1];
      let blue = mapData[sourceIndex + 2];

      // If the color matches to the color set for the wall, set the value in this mapPosition to 1
      if (red == 100 && green == 100 && blue == 100) {
        newMap[i][j] = 1;
      }
      // If the color matches to the color set for the horizontal patrol, push a enemy tank on the enemies listwith speedX set to 1 and speedY 0
      // Also set the value in this map position to 0 to indicate there is not a wall in that position
      else if (red == 254 && green == 254 && blue == 254) {
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
          keySpacePressed: true,
        });
        newMap[i][j] = 0;
      }
      // If the color matches to the color set for the vertical patrol, push a enemy tank on the enemies listwith speedX set to 0 and speedY 1
      // Also set the value in this map position to 0 to indicate there is not a wall in that position
      else if (red == 253 && green == 253 && blue == 253) {
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
          keySpacePressed: true,
        });
        newMap[i][j] = 0;
      }
      // Otherwise the block is emepty, so set this position to 0
      else {
        newMap[i][j] = 0;
      }
    }
  }
  // Push the map and enemies for this map to their respective arrays
  mapList.push(newMap);
  mapEnemies.push(newEnemeies);

  // Update the level in localStorage and screen
  updateMaps();
}

/**
 * Updates the level in localstorage and redisplays all the levels by fetching information from the localStorage
 */
function updateMaps() {
  // Combine the maps and enemies into an maps object which will be saved in localStorage
  var maps = {
    mapList: mapList,
    mapEnemies: mapEnemies,
  };
  //  Save the levels as a JSON string
  localStorage.setItem('savedMaps', JSON.stringify(maps));

  // Load the maps and enemies again from localStorage and update the levels in levelscreen
  loadMaps();
  loadLevels();

  // Hide mapBuilder screen and show levels screen
  mapBuilderContainer.style.display = 'none';
  levelContainer.style.display = 'block';
  controlsButton.style.display = 'inline';
}
