import { checkAbsWallBetween, checkWall } from './check.js';

/**
 * Display all the enemies that are currently visible on the screen
 */
export function renderEnemies() {
  for (let i = 0; i < visibleEnemies.length; i++) {
    // Store current enemy in enemy variable
    let enemy = visibleEnemies[i];

    // Get the type of enemy
    let enemyType = enemy.type;

    // If there is no wall from player's cell position to the cell position of the enemy tank
    if (!checkAbsWallBetween(this.player.x, this.player.y, enemy.x, enemy.y)) {
      // Calculate distance to the enemy tank in both co-ordinates
      let dx = (enemy.x - this.player.x) / BLOCK_SIZE;
      let dy = (enemy.y - this.player.y) / BLOCK_SIZE;

      // check for horizontal patrol tank
      if (enemy.speedX == 1) {
        // Check for difference in x and y to change the tank face(image), i.e- to show front , back ro side view accordingly
        if (dy < -SIDE_RANGE && Math.abs(dy) >= Math.abs(dx)) {
          enemyType = (enemyType + 2) % 7;
        } else if (dy > SIDE_RANGE && Math.abs(dy) >= Math.abs(dx)) {
          enemyType = (enemyType + 6) % 7;
        } else if (dx < 0) {
          enemyType = (enemyType + 4) % 7;
        }
      } else if (enemy.speedY == 1) {
        // Check for difference in x and y to change the tank face(image), i.e- to show front , back ro side view accordingly
        if (dx < -SIDE_RANGE && Math.abs(dx) >= Math.abs(dy)) {
          enemyType = (enemyType + 6) % 7;
        } else if (dx > SIDE_RANGE && Math.abs(dx) >= Math.abs(dy)) {
          enemyType = (enemyType + 2) % 7;
        } else if (dy < 0) {
          enemyType = (enemyType + 4) % 7;
        }
      }

      // Get the image to display according to enemy Type
      let img = enemies[enemyType];

      // Angle relative to player direction
      let angle = Math.atan2(dy, dx) - this.player.deg;

      // Make angle from +/- PI
      if (angle < -Math.PI) angle += 2 * Math.PI;
      if (angle >= Math.PI) angle -= 2 * Math.PI;

      if (angle >= -Math.PI * 0.5 && angle < Math.PI * 0.5) {
        // Calculate the mean distance and size
        let distSquared = dx * dx + dy * dy;
        let dist = Math.sqrt(distSquared);
        let size = VIEW_DIST / (Math.cos(angle) * dist);

        if (size <= 0) {
          continue;
        }

        // X position on the screen
        let x = Math.tan(angle) * VIEW_DIST;
        x = PROJECTION_PLANE_WIDTH / 2 + x - size / 2;

        // Y position on the screen
        let y = (PROJECTION_PLANE_HEIGHT - size) / 2;

        // Draw the tank
        this.canvasContext.drawImage(img, x, y, size, size);
      }
    }
  }
}

/**
 * Display all bullets on screen if visible
 */
export function renderBullets() {
  for (let i = 0; i < bulletList.length; i++) {
    // Get curent bullet
    let bullet = bulletList[i];

    // Calculate distance to the bullet from player in both co-ordinates
    let dx = (bullet.x - this.player.x) / BLOCK_SIZE;
    let dy = (bullet.y - this.player.y) / BLOCK_SIZE;

    // Calculate x and y cell of the bullet
    let xCell = Math.floor(bullet.x / BLOCK_SIZE);
    let yCell = Math.floor(bullet.y / BLOCK_SIZE);

    // Check for bullet collision with walls
    if (checkWall(yCell, xCell)) {
      // Destroy bullet after collision with wall
      bulletList.splice(i, 1);
      // Play collision sound
      this.wallSound.play();

      // If the wall is not in boundary destroy the wall on collision with bullet
      if (
        yCell != 0 &&
        xCell != 0 &&
        yCell != this.currentMap.length - 1 &&
        xCell != this.currentMap.length - 1
      ) {
        this.currentMap[yCell][xCell] = 0;
      }
    }

    let dist = Math.sqrt(dx * dx + dy * dy);

    // Calculate angle of the sprite relative to the player angle
    let spriteAngle = Math.atan2(dy, dx) - this.player.deg;

    // Calculate size of the sprite to be drawn
    let size = VIEW_DIST / (Math.cos(spriteAngle) * dist);
    if (size <= 0) {
      continue;
    }

    let x;
    let y;

    // Check for bullet collision with enemy tanks if fired by player
    if (bullet.fired == this.player) {
      for (let j = 0; j < this.mapEnemies.length; j++) {
        let enemyXcell = Math.floor(this.mapEnemies[j].x / BLOCK_SIZE);
        let enemyYcell = Math.floor(this.mapEnemies[j].y / BLOCK_SIZE);

        // If hits other tanks, destroy that tank and the buller
        if (xCell == enemyXcell && yCell == enemyYcell) {
          // Play collision sound
          this.wallSound.play();
          bulletList.splice(i, 1);
          this.mapEnemies.splice(j, 1);
        }
      }
      // X position on the screen
      x = Math.tan(spriteAngle) * VIEW_DIST;
      x = PROJECTION_PLANE_WIDTH / 2 + x - size / 2;

      // Y position on the screen
      y = (PROJECTION_PLANE_HEIGHT - size) / 2;
    } else {
      // Calculate difference in distance between bullet and player if fired by enemy tank in number of cells
      let diffX = (bullet.fired.x - this.player.x) / BLOCK_SIZE;
      let diffY = (bullet.fired.y - this.player.y) / BLOCK_SIZE;

      if (bullet.fired.speedX == 1) {
        // If tank from which fired is in negative distance
        if (diffX < 0) {
          // x position on the screen
          x = Math.tan(spriteAngle) * VIEW_DIST;
          x = PROJECTION_PLANE_WIDTH / 2 + x - (size * 5) / 8;

          // y position on the screen
          y = (PROJECTION_PLANE_HEIGHT - size) / 3 - (diffX * 5) / 2;
        } else {
          // x position on the screen
          x = Math.tan(spriteAngle) * VIEW_DIST;
          x = PROJECTION_PLANE_WIDTH / 2 + x - size / 2.5;

          // y position on the screen
          y = (PROJECTION_PLANE_HEIGHT - size) / 3 + (diffX * 5) / 2;
        }
      } else {
        // If tank from which fired is in negative distance
        if (diffY < 0) {
          // x position on the screen
          x = Math.tan(spriteAngle) * VIEW_DIST;
          x = PROJECTION_PLANE_WIDTH / 2 + x - (size * 5) / 8;

          // y position on the screen
          y = (PROJECTION_PLANE_HEIGHT - size) / 3 - (diffY * 6) / 2;
        } else {
          // x position on the screen
          x = Math.tan(spriteAngle) * VIEW_DIST;
          x = PROJECTION_PLANE_WIDTH / 2 + x - size / 2.5;

          // y position on the screen
          y = (PROJECTION_PLANE_HEIGHT - size) / 3 + (diffY * 5) / 2;
        }
      }

      // Check for bullet hit with player
      if (
        Math.abs(bullet.x - game.player.x) < 32 &&
        Math.abs(bullet.y - game.player.y) < 32
      ) {
        this.showGameOver();
      }
    }

    // Calculate bullet position and size on canvas
    let canvasX = x + size / 2 - size / 32;
    let canvasY = y + size / 2 + size / 4;
    let canvasWidth = size / 16;
    this.canvasContext.fillStyle = 'red';
    this.canvasContext.fillRect(canvasX, canvasY, canvasWidth, canvasWidth);
  }
}

/**
 * Draw the user canon on the screen
 */
export function drawCanon() {
  this.canvasContext.drawImage(
    this.canonImage,
    PROJECTION_PLANE_WIDTH / 2 - 20,
    PROJECTION_PLANE_HEIGHT - 80
  );
}
