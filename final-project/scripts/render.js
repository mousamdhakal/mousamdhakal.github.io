import { checkWallBetween, checkWall } from './check.js';


/**
   * Display all obstacles that are currently visible on the screen
   */
export function renderSprites() {
  for (var i = 0; i < visibleSprites.length; i++) {
    var sprite = visibleSprites[i];

    var playerXCell = Math.floor(player.x / BLOCK_SIZE);
    var playerYCell = Math.floor(player.y / BLOCK_SIZE);

    if (!checkWallBetween(playerXCell, playerYCell, sprite.x, sprite.y)) {
      // Get the image of the obstacle
      var img = new Image();
      img.src = visibleSprites[i].img;

      // Calculate distance to the sprite in both co-ordinates
      var dx = ((sprite.x * BLOCK_SIZE - player.x) / BLOCK_SIZE);
      var dy = ((sprite.y * BLOCK_SIZE - player.y) / BLOCK_SIZE);

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
}

export function renderEnemies() {
  for (var i = 0; i < visibleEnemies.length; i++) {
    var enemy = visibleEnemies[i];
    var enemyType = enemy.type;

    var enemyXCell = Math.floor(enemy.x / BLOCK_SIZE);
    var enemyYCell = Math.floor(enemy.y / BLOCK_SIZE);
    var playerXCell = Math.floor(player.x / BLOCK_SIZE);
    var playerYCell = Math.floor(player.y / BLOCK_SIZE);
    if (!checkWallBetween(playerXCell, playerYCell, enemyXCell, enemyYCell)) {

      // Calculate distance to the sprite in both co-ordinates
      var dx = ((enemy.x - player.x) / BLOCK_SIZE);
      var dy = ((enemy.y - player.y) / BLOCK_SIZE);

      if (dy < -2) {
        enemyType = (enemyType + 2) % 7;
      } else if (dy > 2) {
        enemyType = (enemyType + 6) % 7;
      }
      else if (dx < 0) {
        enemyType = (enemyType + 4) % 7;
      }

      var img = enemies[enemyType];

      // Angle relative to player direction
      var angle = Math.atan2(dy, dx) - player.deg;


      // Make angle from +/- PI
      if (angle < -Math.PI) angle += 2 * Math.PI;
      if (angle >= Math.PI) angle -= 2 * Math.PI;

      if (angle > - Math.PI * 0.5 && angle < Math.PI * 0.5) {
        var distSquared = dx * dx + dy * dy;
        var dist = Math.sqrt(distSquared);
        var size = VIEWDIST / (Math.cos(angle) * dist);

        if (size <= 0) {
          continue;
        }

        // x position on the screen
        var x = Math.tan(angle) * VIEWDIST;
        x = PROJECTIONPLANEWIDTH / 2 + x - size / 2;

        var xOffset = enemy.offset * size / 2;

        if (dx < 0) {
          xOffset *= -1;
        }

        // y position on the screen
        var y = (PROJECTIONPLANEHEIGHT - size) / 2;

        this.canvasContext.drawImage(img, x + xOffset, y, size, size);
      }
      // console.log(img);

    }
  }
}

export function renderBullets() {
  for (var i = 0; i < bulletList.length; i++) {
    var bullet = bulletList[i];

    // Calculate distance to the sprite in both co-ordinates
    var dx = ((bullet.x - player.x) / BLOCK_SIZE);
    var dy = ((bullet.y - player.y) / BLOCK_SIZE);

    let xCell = Math.floor(bullet.x / BLOCK_SIZE);
    let yCell = Math.floor(bullet.y / BLOCK_SIZE);

    if (spriteMap[yCell][xCell] > 1) {
      bulletList.splice(i, 1);
      spriteMap[yCell][xCell] = 0;
      continue;
    }
    // Check for bullet collision with walls
    if (checkWall(yCell, xCell)) {
      bulletList.splice(i, 1);
      if ((yCell != 0 && xCell != 0 && yCell != this.currentMap.length - 1 && xCell != this.currentMap.length - 1)) {
        this.currentMap[yCell][xCell] = 0;
      }
    }


    var dist = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle of the sprite relative to the player angle
    var spriteAngle = Math.atan2(dy, dx) - player.deg;

    // Calculate size of the sprite to be drawn
    var size = VIEWDIST / (Math.cos(spriteAngle) * dist);
    if (size <= 0) {
      continue;
    }

    // Check for bullet collision with enemy tanks
    if (bullet.fired == player) {
      for (let j = 0; j < mapEnemies.length; j++) {
        let enemyXcell = Math.floor(mapEnemies[j].x / BLOCK_SIZE);
        let enemyYcell = Math.floor(mapEnemies[j].y / BLOCK_SIZE);
        if (xCell == enemyXcell && yCell == enemyYcell) {
          bulletList.splice(i, 1);
          mapEnemies.splice(j, 1);
        }
      }
      // x position on the screen
      var x = Math.tan(spriteAngle) * VIEWDIST;
      x = PROJECTIONPLANEWIDTH / 2 + x - size / 2;

      // y position on the screen
      var y = (PROJECTIONPLANEHEIGHT - size) / 2;
    } else {
      var diffX = ((bullet.fired.x - player.x) / BLOCK_SIZE);
      var diffY = ((bullet.fired.y - player.y) / BLOCK_SIZE);

      // if (diffY < -2) {
      //   enemyType = (enemyType + 2) % 7;
      // } else if (diffY > 2) {
      //   enemyType = (enemyType + 6) % 7;
      // }
      if (diffX < 0) {
        // x position on the screen
        var x = Math.tan(spriteAngle) * VIEWDIST;
        x = PROJECTIONPLANEWIDTH / 2 + x - size * 7 / 8;

        // y position on the screen
        var y = (PROJECTIONPLANEHEIGHT - size) / 3 + diffX;
      }
      else {
        // x position on the screen
        var x = Math.tan(spriteAngle) * VIEWDIST;
        x = PROJECTIONPLANEWIDTH / 2 + x - size / 4;

        // y position on the screen
        var y = (PROJECTIONPLANEHEIGHT - size) / 3 + diffX * 5 / 2;
      }
      if (Math.abs(bullet.x - game.player.x) < 32 && Math.abs(bullet.y - game.player.y) < 32) {
        alert('Game over');
      }
    }

    let canvasX = x + size / 2 - size / 32;
    let canvasY = y + size / 2 + size / 4;
    let canvasWidth = size / 16;
    this.canvasContext.fillStyle = "red";
    this.canvasContext.fillRect(canvasX, canvasY, canvasWidth, canvasWidth);
  }
}

export function drawCanon() {
  this.canvasContext.drawImage(this.canonImage, PROJECTIONPLANEWIDTH / 2 - 20, PROJECTIONPLANEHEIGHT - 80);
}