/**
 * Checks for the presence of enemy tank in given cell position
 * @param {Number} ycell - Y cell position to check for presence of enemy tank
 * @param {Number} xcell - X cell position to check for presence of enemy tank
 * @returns {Boolean} - true if tank is present in the cell , false otherwise
 */

export function checkEnemyTank(ycell, xcell) {
  for (i = 0; i < game.mapEnemies.length; i++) {
    let enemyX = Math.floor(game.mapEnemies[i].x / BLOCK_SIZE);
    let enemyY = Math.floor(game.mapEnemies[i].y / BLOCK_SIZE);
    if (xcell == enemyX && ycell == enemyY) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if player tank is in the firing range of enemy tank
 * @param {Number} enemyX - X position in pixels for enemy tank
 * @param {Number} enemyY - Y position in pixels for enemy tank
 * @param {Number} playerX - X position in pixels for player tank
 * @param {Number} playerY - Y position in pixels for player tank
 * @param {Number} speedX - X speed of the tank to determine if tank is moving horizontal or vertical
 * @returns {Boolean} - returns true if player tank is in range of enemy tank, false otherwise
 */
export function checkRange(enemyX, enemyY, playerX, playerY, speedX) {
  // If tank is moving horizontal
  if (speedX == 1) {
    if ((enemyX - playerX) < (FRONTRANGE * BLOCK_SIZE) && (enemyY - playerY) < (SIDERANGE * BLOCK_SIZE)) {
      return true;
    }
    return false;
  }
  // If tank is moving vertical
  else {
    if ((enemyX - playerX) < (SIDERANGE * BLOCK_SIZE) && (enemyY - playerY) < (FRONTRANGE * BLOCK_SIZE)) {
      return true;
    }
    return false;
  }
}

/**
 * Checks for the presence of enemy tank in given cell position
 * @param {Number} ycell - Y cell position to check for presence of enemy tank
 * @param {Number} xcell - X cell position to check for presence of enemy tank
 * @returns {Boolean} - true if tank is present in the cell , false otherwise
 */

export function checkBullet(ycell, xcell) {
  for (i = 0; i < bulletList.length; i++) {
    let buleltX = Math.floor(bulletList[i].x / BLOCK_SIZE);
    let bulletY = Math.floor(bulletList[i].y / BLOCK_SIZE);
    if (xcell == buleltX && ycell == bulletY) {
      return true;
    }
  }
  return false;
}


/**
 * Checks for presence of wall in given cell position 
 * @param {Number} ycell - Y cell position to check for presence of wall
 * @param {Number} xcell - X cell position ot check for presence of wall
 * @returns {Boolean} - true if wall is present in the cell false otherwise
 */
export function checkWall(ycell, xcell) {
  if (game.currentMap[ycell][xcell] != 0) {
    return true;
  }
  return false;
}

/**
 * Checks for the presence of wall in between the player and the object
 * @param {Number} playerX - X position of the first object
 * @param {Number} playerY - Y positon of the first object
 * @param {Number} objectX - X position of the second object
 * @param {Number} objectY - Y position of the second object
 * @returns {Boolean} - true if wall is present between the player tank and the object , false otherwise
 */
export function checkAbsWallBetween(playerX, playerY, objectX, objectY) {
  let xDiff = objectX - playerX;
  let yDiff = objectY - playerY;
  let dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
  let xStep = xDiff / dist;
  let yStep = yDiff / dist;

  // Do for second cell on the first quadrant relative to first cell
  while (Math.abs(xDiff) > BLOCK_SIZE || Math.abs(yDiff) > BLOCK_SIZE) {
    playerX += xStep;
    playerY += yStep;
    xDiff -= xStep;
    yDiff -= yStep
    let yCell = Math.floor(playerY / BLOCK_SIZE);
    let xCell = Math.floor(playerX / BLOCK_SIZE);
    if (checkWall(yCell, xCell)) {
      return true;
    }
  }

  return false;
}