/**
 * Create a map to represent position of obstacles
 */
export function initSprites() {
  spriteMap = [];
  for (var i = 0; i < this.MAP_WIDTH; i++) {
    spriteMap[i] = [];
  }
  for (var j = 0; j < mapItems.length; j++) {
    spriteMap[mapItems[j].y][mapItems[j].x] = j + 2;
  }
}

/**
 * Load image of enemy tanks and push them in an array
 */
export function initEnemies() {
  for (i = 0; i < enemyTypes.length; i++) {
    let img = new Image();
    img.src = enemyTypes[i].img;
    enemies.push(img);
  }
}

/**
 * Clear the list of visible obstacles and set visibility of all obstacles to false
 */
export function clearSprites() {
  for (var i = 0; i < mapItems.length; i++) {
    mapItems[i].visible = false;
  }
  visibleSprites = [];
}

/**
 * Clear the list of visible obstacles and set visibility of all obstacles to false
 */
export function clearEnemies() {
  for (var i = 0; i < mapEnemies.length; i++) {
    mapEnemies[i].visible = false;
  }
  visibleEnemies = [];
}

/**
 * Load image of wall and get it's data from a buffer canvas
 */
export function loadWallImage() {
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