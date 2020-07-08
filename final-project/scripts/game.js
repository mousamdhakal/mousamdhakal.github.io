import { drawBackground } from "./draw.js";
import { drawMiniMap, drawPlayerOnMiniMap } from "./miniMap.js";
import { castRays } from "./raycaster.js";

/**
 * Game class which contains all methods and properties of our game
 */
export class Game {
  /**
   * Initializes and sets up properties(variables) of the game
   * @param {Object} canvas DOM element canvas which will be used as main game window
   */
  constructor(canvas) {
    // Set the width and height property to that of canvas element
    this.width = canvas.width;
    this.height = canvas.height;

    // Set canvas property as the canvas argument and get it's context
    this.canvas = canvas;
    this.canvasContext = this.canvas.getContext("2d");

    // Create offscreen canvas(buffer) which will be used to increase the performance and reduce visual lag
    // All the drawing will take place on the hiddenCanvas at first and later the hiddenCanvas will be
    // cleared in each update of the screen and the data of the entire image of
    this.hiddenCanvas = document.createElement("canvas");

    // Set the dimensions equal to that of onscreen canvas
    this.hiddenCanvas.width = this.width;
    this.hiddenCanvas.height = this.height;
    this.hiddenCanvasContext = this.hiddenCanvas.getContext("2d");

    // Get imagedata, i.e- the rgba value of all the pixels  of offscreen canvas
    this.hiddenCanvasPixels = this.hiddenCanvasContext.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Set player of the game as player object from player.js
    this.player = player;

    // Initialize vairables to draw player position on the minimap
    this.miniMapX;
    this.miniMapY;

    // Set flags to handle keyboard input
    this.keyUpPressed = false;
    this.keyDownPressed = false;
    this.keyLeftPressed = false;
    this.keyRightPressed = false;

    // Set width and height of the map
    this.currentMap = [];
    this.MAP_WIDTH = 28;
    this.MAP_HEIGHT = 28;

    // Pixel information for the wall
    this.wallPixels;

    // Load image of the wall
    this.loadWallImage();

    // Set the current map
    this.currentMap = map;

    this.initSprites();
  }

  /**
   * Create a map to represent position of obstacles
   */
  initSprites() {
    spriteMap = [];
    for (var i = 0; i < this.MAP_WIDTH; i++) {
      spriteMap[i] = [];
    }
    for (var j = 0; j < mapItems.length; j++) {
      spriteMap[mapItems[j].y][mapItems[j].x] = j + 2;
    }
  }

  /**
   * Clear the list of visible obstacles and set visibility of all obstacles to false
   */
  clearSprites() {
    for (var i = 0; i < mapItems.length; i++) {
      mapItems[i].visible = false;
    }
    visibleSprites = [];
  }

  /**
   * Load image of wall and get it's data from a buffer canvas
   */
  loadWallImage() {
    // Load the image of the wall
    this.wallImage = new Image();
    this.wallImage.src = "./images/mapSmall.png";

    // After the image loads,
    this.wallImage.onload = function () {
      // Create a buffer canvas which is not shown on screen for drawing image of wall
      this.wallImageBuffer = document.createElement("canvas");

      // Set dimensions of the buffer canvas equal to that of the image so that data of all the image pixels are stored , no more no less
      this.wallImageBuffer.width = this.wallImage.width;
      this.wallImageBuffer.height = this.wallImage.height;

      // Draw the image of wall on the canvas, the image covers exactly the entire dimension of the canvas
      this.wallImageBuffer.getContext("2d").drawImage(this.wallImage, 0, 0);

      // Get rgba value of each pixel from the wallbuffer , so that we can recreate part of the image by drawing those color values
      let imageData = this.wallImageBuffer
        .getContext("2d")
        .getImageData(
          0,
          0,
          this.wallImageBuffer.width,
          this.wallImageBuffer.height
        );
      this.wallPixels = imageData.data;
    }.bind(this);
  }

  /**
   * Clears the hidden canvas
   */
  clearhiddenCanvas = function () {
    this.hiddenCanvasContext.clearRect(0, 0, this.width, this.height);
  };

  /**
   * Updates the game canvas with all the pixel data from hidden canvas
   */
  updateMainCanvas = function () {
    this.canvasContext.putImageData(this.hiddenCanvasPixels, 0, 0);
    this.renderSprites();
  };

  /**
   * Initializes the game by adding event listeners and starting the update cycle
   */
  init() {
    window.addEventListener("keydown", handleKeyDown.bind(this), false);
    window.addEventListener("keyup", handleKeyUp.bind(this), false);

    requestAnimationFrame(this.update.bind(this));
  }

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
   * Display all obstacles that are currently visible on the screen
   */
  renderSprites() {
    for (var i = 0; i < visibleSprites.length; i++) {
      var sprite = visibleSprites[i];
      // Get the image of the obstacle
      var img = new Image();
      img.src = visibleSprites[i].img;

      // Calculate distance to the sprite in both co-ordinates
      var dx = ((sprite.x * BLOCK_SIZE - player.x) / BLOCK_SIZE);
      var dy = ((sprite.y * BLOCK_SIZE - player.y) / BLOCK_SIZE);

      // Return if the sprite is out of the visibility range
      if (dx > visibleSprites[i].maxDx || dy > visibleSprites[i].maxDy || dx < -visibleSprites[i].maxDx || dy < -visibleSprites[i].maxDy) {
        return;
      }

      var dist = Math.sqrt(dx * dx + dy * dy);

      // Calculate angle of the sprite relative to the player angle
      var spriteAngle = Math.atan2(dy, dx) - player.deg;

      // Calculate size of the sprite to be drawn
      var size = VIEWDIST / (Math.cos(spriteAngle) * dist);
      if (size <= 0) {
        continue;
      }

      // x position on the screen
      var x = Math.tan(spriteAngle) * VIEWDIST;
      x = PROJECTIONPLANEWIDTH / 2 + x - size / 2;

      // y position on the screen
      var y = (PROJECTIONPLANEHEIGHT - size) / 2;

      // Offset value to make up for error in calculations
      var xOffset = visibleSprites[i].offset * size / 2;

      // Draw obstacle on the canvas
      this.canvasContext.drawImage(img, x + xOffset, y, size, size);
    }
  }

  /**
   * Recursive function that gets called FRAMERATE number of times every second
   */
  update() {
    this.clearhiddenCanvas();
    this.drawBackground();
    this.raycast();
    this.drawMiniMap();
    this.drawPlayerOnMiniMap();
    this.updateMainCanvas();
    this.clearSprites();

    handlePlayerMovement();

    // Render next frame after 1000/FRAMERATE miliseconds
    setTimeout(function () {
      requestAnimationFrame(game.update.bind(game));
    }, 1000 / FRAMERATE);
  }
}

/**
 * Handles the movement of player checking the key flags
 */
function handlePlayerMovement() {
  // If left key pressed flag is up, rotate left by 5 degrees
  if (game.keyLeftPressed) {
    game.player.arc -= ANGLE2;
    game.player.deg -= Math.PI / 90;
    // Wrap around the angle if it becomes negative
    if (game.player.arc < ANGLE0) game.player.arc += ANGLE360;
    if (game.player.deg < -2 * Math.PI) game.player.deg += 2 * Math.PI;
  }

  // If right key pressed flag is up, rotate right by 5 degrees
  else if (game.keyRightPressed) {
    game.player.arc += ANGLE2;
    game.player.deg += Math.PI / 90;
    // Wrap around the angle if it exceeds 360
    if (game.player.arc >= ANGLE360) game.player.arc -= ANGLE360;
    if (game.player.deg >= 2 * Math.PI) game.player.deg -= 2 * Math.PI;
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
      game.currentMap[playerYCell][playerXCell + 1] !=
      0 && playerXCellOffset > BLOCK_SIZE - MINDISTANCETOWALL
      || spriteMap[playerYCell][playerXCell + 1] > 1
    ) {
      // Move player back if wall crossed
      game.player.x -= playerXCellOffset - (BLOCK_SIZE - MINDISTANCETOWALL);
    }
  } else {
    // Player is moving left
    if (
      game.currentMap[playerYCell][playerXCell - 1] !=
      0 && playerXCellOffset < MINDISTANCETOWALL ||
      spriteMap[playerYCell][playerXCell - 1] > 1
    ) {
      // Move player back if wall crossed
      game.player.x += MINDISTANCETOWALL - playerXCellOffset;
    }
  }

  if (dy < 0) {
    // Player is moving up
    if (
      game.currentMap[playerYCell - 1][playerXCell] != 0 &&
      playerYCellOffset < MINDISTANCETOWALL ||
      spriteMap[playerYCell - 1][playerXCell] > 1
    ) {
      // Move player back if wall crossed
      game.player.y += MINDISTANCETOWALL - playerYCellOffset;
    }
  } else {
    // Player is moving down
    if (
      game.currentMap[playerYCell + 1][playerXCell] != 0 &&
      playerYCellOffset > BLOCK_SIZE - MINDISTANCETOWALL ||
      spriteMap[playerYCell + 1][playerXCell] > 1
    ) {
      // Move player back if wall crossed
      game.player.y -= playerYCellOffset - (BLOCK_SIZE - MINDISTANCETOWALL);
    }
  }
}
