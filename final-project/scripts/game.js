import { drawBackground } from "./draw.js";
import { drawMiniMap, drawPlayerOnMiniMap } from "./miniMap.js";
import { castRays } from "./raycaster.js";
import { checkEnemyTank, checkWall, checkWallBetween } from './check.js';
import { renderEnemies, renderBullets, drawCanon } from "./render.js";
import { initEnemies, clearEnemies, loadWallImages } from "./initializers.js";
import { fireBullet, moveTanks, moveBullets } from './moves.js'

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
    this.canvasContext = this.canvas.getContext("2d");

    // Create offscreen canvas(buffer) which will be used to increase the performance and reduce visual lag
    // All the drawing for the walls and miniMap will take place on the hiddenCanvas at first and later the hiddenCanvas will be
    // cleared in each update of the screen and the data of the entire image of hiddenCanvas will be copied to main canvas of same dimensions.
    this.hiddenCanvas = document.createElement("canvas");

    // Set the dimensions equal to that of onscreen canvas
    this.hiddenCanvas.width = this.width;
    this.hiddenCanvas.height = this.height;
    this.hiddenCanvasContext = this.hiddenCanvas.getContext("2d");

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

    // Settimeout method called to create animation
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

    this.mapEnemies = getEnemies();

    // Load image of the wall
    this.loadWallImages();

    this.initEnemies();

    // Load image of canon of user tank
    this.canonImage = new Image();
    this.canonImage.src = "./images/canon.png";

    this.wallSound = this.sound('./sounds/hit-sound.wav');
    this.tankSound = this.sound('./sounds/explode.wav');
  }

  restartGame() {
    gameContainer.style.display = 'block';
    endContainer.style.display = 'none';
    this.currentMap = getMap(this.mapIndex);
    this.player = getPlayer();
    this.mapEnemies = getEnemies();
    bulletList = [];
    this.initEnemies();
    this.callTimeOut = true;
    this.update();
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
   * Clears the hidden canvas
   */
  clearhiddenCanvas = function () {
    this.hiddenCanvasContext.clearRect(0, 0, this.width, this.height);
  };


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

  sound(src) {
    let sound = document.createElement("audio");
    sound.src = src;
    sound.setAttribute("preload", "auto");
    sound.setAttribute("controls", "none");
    sound.style.display = "none";
    document.body.appendChild(sound);
    return sound;
  }

  showGameOver() {
    this.callTimeOut = false;
    gameContainer.style.display = 'none';
    endContainer.style.display = 'block';
  }

  showWon() {
    this.callTimeOut = false;
    gameContainer.style.display = 'none';
    winContainer.style.display = 'block';
    startContainer.style.display = 'block';
  }

  /**
   * Updates the game canvas with all the pixel data from hidden canvas
   */
  updateMainCanvas = function () {
    this.canvasContext.putImageData(this.hiddenCanvasPixels, 0, 0);
    this.renderEnemies();
    this.renderBullets();
    this.drawCanon();
    if (this.player.keySpacePressed) {
      this.fireBullet(this.player);
    }
  };

  /**
   * Initializes the game by adding event listeners and starting the update cycle
   */
  init = function () {
    window.addEventListener("keydown", handleKeyDown.bind(this), false);
    window.addEventListener("keyup", handleKeyUp.bind(this), false);

    // Hide startscreen and show gamescreen
    controlContainer.style.display = "none";
    gameContainer.style.display = "block";

    this.update();
  }

  /**
   * Recursive function that gets called FRAMERATE number of times every second
   */
  update = function () {
    if (this.mapEnemies.length < 1) {
      this.showWon();
    }
    this.clearhiddenCanvas();
    this.drawBackground();
    this.raycast();
    this.drawMiniMap();
    this.drawPlayerOnMiniMap(this.player);
    this.moveTanks();
    this.moveBullets();
    this.updateMainCanvas();
    this.clearEnemies();

    handlePlayerMovement();

    this.player.timeSinceLastBullet++;
    for (i = 0; i < this.mapEnemies.length; i++) {
      this.mapEnemies[i].timeSinceLastBullet++;
    }

    // Render next frame after 1000/FRAMERATE miliseconds
    if (this.callTimeOut) {
      this.timeOut = setTimeout(function () {
        requestAnimationFrame(game.update.bind(game));
      }, 1000 / FRAMERATE);
    }

  }
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

  // make sure the player don't bump into walls
  if (dx > 0) {
    // Player is moving right
    if (
      (checkWall(playerYCell, playerXCell + 1) || checkEnemyTank(playerYCell, playerXCell + 1)) && playerXCellOffset > BLOCK_SIZE - MINDISTANCETOWALL
    ) {
      // Move player back if wall crossed
      game.player.x -= playerXCellOffset - (BLOCK_SIZE - MINDISTANCETOWALL);
    }
  } else {
    // Player is moving left
    if ((
      checkWall(playerYCell, playerXCell - 1) || checkEnemyTank(playerYCell, playerXCell - 1)) && playerXCellOffset < MINDISTANCETOWALL
    ) {
      // Move player back if wall crossed
      game.player.x += MINDISTANCETOWALL - playerXCellOffset;
    }
  }

  if (dy < 0) {
    // Player is moving up
    if ((
      checkWall(playerYCell - 1, playerXCell) || checkEnemyTank(playerYCell - 1, playerXCell)) &&
      playerYCellOffset < MINDISTANCETOWALL
    ) {
      // Move player back if wall crossed
      game.player.y += MINDISTANCETOWALL - playerYCellOffset;
    }
  } else {
    // Player is moving down
    if ((
      checkWall(playerYCell + 1, playerXCell) || checkEnemyTank(playerYCell + 1, playerXCell)) &&
      playerYCellOffset > BLOCK_SIZE - MINDISTANCETOWALL
    ) {
      // Move player back if wall crossed
      game.player.y -= playerYCellOffset - (BLOCK_SIZE - MINDISTANCETOWALL);
    }
  }
}
