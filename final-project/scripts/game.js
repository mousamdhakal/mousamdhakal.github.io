import { drawBackground } from './draw.js';
import { drawMiniMap, drawPlayerOnMiniMap } from './map/miniMap.js';
import { castRays } from './raycaster.js';
import { checkEnemyTank, checkWall } from './check.js';
import { renderEnemies, renderBullets, drawCanon } from './render.js';
import { initEnemies, clearEnemies, loadWallImages } from './initializers.js';
import { fireBullet, moveTanks, moveBullets } from './moves.js';

/**
 * Game class which contains all methods and properties of our game
 */
export class Game {
  /**
   * Initializes and sets up properties(variables) of the game
   * @param {Object} canvas DOM element canvas which will be used as main game window
   */
  constructor(canvas, mapIndex) {
    // Set the width and height property to that of canvas element
    this.width = canvas.width;
    this.height = canvas.height;

    // Set canvas property as the canvas argument and get it's context
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext('2d');

    // Create offscreen canvas(buffer) which will be used to increase the performance and reduce visual lag
    // All the drawing for the walls and miniMap will take place on the hiddenCanvas at first and later the hiddenCanvas will be
    // cleared in each update of the screen and the data of the entire image of hiddenCanvas will be copied to main canvas of same dimensions.
    this.hiddenCanvas = document.createElement('canvas');

    // Set the dimensions equal to that of onscreen canvas
    this.hiddenCanvas.width = this.width;
    this.hiddenCanvas.height = this.height;
    this.hiddenCanvasContext = this.hiddenCanvas.getContext('2d');

    // Get imagedata, i.e- the rgba value of all the pixels of offscreen canvas
    this.hiddenCanvasPixels = this.hiddenCanvasContext.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Set player of the game as player object from player.js
    this.player = getPlayer();

    // Initialize vairables to draw player position on the minimap
    this.miniMapX;
    this.miniMapY;

    // Set flag to check whether to keep updating the game or to pause/quit the game stopping the update cycle
    this.callTimeOut = true;

    // Set flags to handle keyboard input
    this.keyUpPressed = false;
    this.keyDownPressed = false;
    this.keyLeftPressed = false;
    this.keyRightPressed = false;

    // Set width and height of the map
    this.currentMap = [];
    this.mapIndex = mapIndex;

    // Set the current map
    this.currentMap = getMap(this.mapIndex);
    this.MAP_WIDTH = this.currentMap.length;
    this.MAP_HEIGHT = this.currentMap.length;

    // Pixel information for the wall
    this.wallPixels = [];

    //Get the enemy tanks for this map
    this.mapEnemies = getEnemies(mapIndex);

    // Load image of the wall
    this.loadWallImages();

    // Load enemy tank images
    this.initEnemies();

    // Load image of canon of user tank
    this.canonImage = new Image();
    this.canonImage.src = './images/canon.png';

    // Create sound for collsion of missile with tanks and walls
    this.wallSound = this.sound('./sounds/hit-sound.wav');
    this.tankSound = this.sound('./sounds/explode.wav');

    // Flag to check state of the game
    this.gamePlaying = true;

    // Show the play button as pressed currently
    document.getElementById('game-play').style.color = '#ff0000';
    document.getElementById('game-pause').style.color = '#2e3436';
  }

  /**
   * Clear the list of visible obstacles and set visibility of all obstacles to false
   */
  clearEnemies = clearEnemies;

  /**
   * Load image of enemy tanks and push them in an array
   */
  initEnemies = initEnemies;

  /**
   * Load image of wall and get it's data from a buffer canvas
   */
  loadWallImages = loadWallImages;

  /**
   * Draw Minimap
   */
  drawMiniMap = drawMiniMap;

  /**
   * Draw player position on the minimap
   */
  drawPlayerOnMiniMap = drawPlayerOnMiniMap;

  /**
   * Draw the sky and floor on the 3D map
   */
  drawBackground = drawBackground;

  /**
   * Cast rays from hte user to create a 3D simulation
   */
  raycast = castRays;

  /**
   * Fires bullet from a tank
   * @param {Object} tank -  The tank from which bullet is to be fired
   */
  fireBullet = fireBullet;

  /**
   * Draw the user canon on the screen
   */
  drawCanon = drawCanon;

  /**
   * Move around the enemy tank and fire bullet if the tank is facing towards player and there are no blocking walls between user and enemy tank
   */
  moveTanks = moveTanks;

  /**
   * Moves the bullet according to it's direction
   */
  moveBullets = moveBullets;

  /**
   * Display all the enemies that are currently visible on the screen
   */
  renderEnemies = renderEnemies;

  /**
   * Display all the bullets on screen if visible
   */
  renderBullets = renderBullets;

  /**
   * Restart the current game by reinitializing the variables and calling new updatecycle
   */
  restartGame = function () {
    this.initializeVariables();
    this.reDisplayGame();
  };

  /**
   * Get and set the essential variables of the game: map, player and enemies
   */
  initializeVariables = function () {
    this.currentMap = getMap(this.mapIndex);
    this.player = getPlayer();
    this.mapEnemies = getEnemies(this.mapIndex);
    bulletList = [];
    this.initEnemies();
  };

  /**
   * Display the game again from end screen due to restart
   */
  reDisplayGame = function () {
    gameContainer.style.display = 'block';
    endContainer.style.display = 'none';

    this.callTimeOut = true;
    this.update();
  };

  /**
   * Create an html audio element and embed to the page as not visible element
   * @param {String} src - string representing the source of the audio
   */
  sound = function (src) {
    let sound = document.createElement('audio');
    sound.src = src;
    sound.setAttribute('preload', 'auto');
    sound.setAttribute('controls', 'none');
    sound.volume = 0.05;
    sound.style.display = 'none';
    document.body.appendChild(sound);
    return sound;
  };

  /**
   * Pause the game and change the style of play and pause buttons
   */
  pause = function () {
    this.callTimeOut = false;
    this.gamePlaying = false;
    document.getElementById('game-pause').style.color = '#ff0000';
    document.getElementById('game-play').style.color = '#2e3436';
  };

  /**
   * Play the game and change the style of play and pause buttons
   */
  play = function () {
    // Only do if the game is already paused, (increases the number of times update is called otherwise messing up game speed)
    if (!this.gamePlaying) {
      this.callTimeOut = true;
      this.update();
      this.gamePlaying = true;
      document.getElementById('game-play').style.color = '#ff0000';
      document.getElementById('game-pause').style.color = '#2e3436';
    }
  };

  /**
   * Pause the game and go back to the home screen
   */
  quit = function () {
    this.pause();
    goHomeFromGame();
  };

  /**
   * Stop the recurrent update of the page and show game over screen
   */
  showGameOver = function () {
    this.callTimeOut = false;
    this.gamePlaying = false;
    gameContainer.style.display = 'none';
    endContainer.style.display = 'block';
  };

  /**
   * Stop the recurrent update of the page and show game won message and level selection choice
   */
  showWon = function () {
    this.callTimeOut = false;
    this.gamePlaying = false;
    gameContainer.style.display = 'none';
    winContainer.style.display = 'block';
  };

  /**
   * Shows the time after which User can fire weapon from the tank
   */
  showBulletCoolDown = function () {
    // Calculate the time remaining in floating value with one digit after decimal symbol and remove other trailing zeroes if found
    let time = (3 - this.player.timeSinceLastBullet / 30)
      .toFixed(1)
      .replace(/\.?0*$/, '');

    // If the time is less than zero that means user can fire , so set it to be 0 to be minimum
    if (time <= 0) time = 0;

    // Display the cooldown time on the screen
    let cooldown = 'Cooldown:' + time;
    this.canvasContext.font = '18px Consolas';
    this.canvasContext.fillStyle = 'black';
    this.canvasContext.fillText(cooldown, 200, 20);
  };

  /**
   * Updates the game canvas with all the pixel data from hidden canvas
   */
  updateMainCanvas = function () {
    this.canvasContext.putImageData(this.hiddenCanvasPixels, 0, 0);
    this.renderEnemies();
    this.renderBullets();
    this.drawCanon();
    this.showBulletCoolDown();
    if (this.player.keySpacePressed) {
      this.fireBullet(this.player);
    }
  };

  /**
   * Initializes the game by adding event listeners and starting the update cycle
   */
  init = function () {
    window.addEventListener('keydown', handleKeyDown.bind(this), false);
    window.addEventListener('keyup', handleKeyUp.bind(this), false);
    this.update();
  };

  /**
   * Recursive function that gets called FRAMERATE number of times every second
   */
  update = function () {
    if (this.mapEnemies.length < 1) {
      this.showWon();
    }
    this.hiddenCanvasContext.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.raycast();
    this.drawMiniMap();
    this.drawPlayerOnMiniMap(this.player);
    this.moveTanks();
    this.moveBullets();
    this.updateMainCanvas();
    this.clearEnemies();

    handlePlayerMovement();

    // Increase the timesince last bullet fired for all tanks on the map
    // Note that this happens FRAMERATE number of times
    this.player.timeSinceLastBullet++;
    for (i = 0; i < this.mapEnemies.length; i++) {
      this.mapEnemies[i].timeSinceLastBullet++;
    }

    // Render next frame after 1000/FRAMERATE miliseconds
    if (this.callTimeOut) {
      this.timeOut = setTimeout(function () {
        requestAnimationFrame(game.update.bind(game));
      }, 1000 / FRAME_RATE);
    }
  };
}

/**
 * Handles the movement of player checking the key flags
 */
function handlePlayerMovement() {
  // If left key pressed flag is up, rotate left by 5 degrees
  if (game.keyLeftPressed) {
    game.player.arc -= ANGLE2;

    // Track the degree of player and reduce a small value to account for small decrease in angle in radian while creating the tables
    game.player.deg -= Math.PI / 90 - 0.00055;

    // Wrap around the angle if it becomes negative
    if (game.player.arc < ANGLE0) game.player.arc += ANGLE360;
    if (game.player.deg < -Math.PI) game.player.deg += 2 * Math.PI;
  }

  // If right key pressed flag is up, rotate right by 5 degrees
  else if (game.keyRightPressed) {
    game.player.arc += ANGLE2;

    // Track the degree of player and reduce a small value to account for small decrease in angle in radian while creating the tables
    game.player.deg += Math.PI / 90 - 0.00055;

    // Wrap around the angle if it exceeds 360
    if (game.player.arc >= ANGLE360) game.player.arc -= ANGLE360;
    if (game.player.deg > Math.PI) game.player.deg -= 2 * Math.PI;
  }

  // Calculate the x and y direction to move by taking cos and sin angles respectively
  let playerXDir = cosTable[game.player.arc];
  let playerYDir = sinTable[game.player.arc];

  // This is the distance to be moved which is 0 if neither keyup or keydown is pressed
  let dx = 0;
  let dy = 0;

  // If keyup is pressed then, the direction calculated earlier is multiplied by the speed to find out actual movement in both x and y co-ordinates
  if (game.keyUpPressed) {
    dx = Math.round(playerXDir * game.player.speed);
    dy = Math.round(playerYDir * game.player.speed);
  }
  // Same as keyup but in opposite direction , i.e-negative values.
  else if (game.keyDownPressed) {
    dx = -Math.round(playerXDir * game.player.speed);
    dy = -Math.round(playerYDir * game.player.speed);
  }

  // Add the calculated increment or decrement in x andred y to that of player
  game.player.x += dx;
  game.player.y += dy;

  // Check if player collides with the walls on making that change in x and y position

  // compute block(cell) position of the player
  let playerXCell = Math.floor(game.player.x / BLOCK_SIZE);
  let playerYCell = Math.floor(game.player.y / BLOCK_SIZE);

  // compute the position of player inside the block(cell)
  let playerXCellOffset = game.player.x % BLOCK_SIZE;
  let playerYCellOffset = game.player.y % BLOCK_SIZE;

  // Make sure the player doesn't bump into walls
  if (dx > 0) {
    // Player is moving right
    if (
      (checkWall(playerYCell, playerXCell + 1) ||
        checkEnemyTank(playerYCell, playerXCell + 1)) &&
      playerXCellOffset > BLOCK_SIZE - MIN_DISTANCE_TO_WALL
    ) {
      // Move player back if wall crossed
      game.player.x -= playerXCellOffset - (BLOCK_SIZE - MIN_DISTANCE_TO_WALL);
    }
  } else {
    // Player is moving left
    if (
      (checkWall(playerYCell, playerXCell - 1) ||
        checkEnemyTank(playerYCell, playerXCell - 1)) &&
      playerXCellOffset < MIN_DISTANCE_TO_WALL
    ) {
      // Move player back if wall crossed
      game.player.x += MIN_DISTANCE_TO_WALL - playerXCellOffset;
    }
  }

  if (dy < 0) {
    // Player is moving up
    if (
      (checkWall(playerYCell - 1, playerXCell) ||
        checkEnemyTank(playerYCell - 1, playerXCell)) &&
      playerYCellOffset < MIN_DISTANCE_TO_WALL
    ) {
      // Move player back if wall crossed
      game.player.y += MIN_DISTANCE_TO_WALL - playerYCellOffset;
    }
  } else {
    // Player is moving down
    if (
      (checkWall(playerYCell + 1, playerXCell) ||
        checkEnemyTank(playerYCell + 1, playerXCell)) &&
      playerYCellOffset > BLOCK_SIZE - MIN_DISTANCE_TO_WALL
    ) {
      // Move player back if wall crossed
      game.player.y -= playerYCellOffset - (BLOCK_SIZE - MIN_DISTANCE_TO_WALL);
    }
  }
}
