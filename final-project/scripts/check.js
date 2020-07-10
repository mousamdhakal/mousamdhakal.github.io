/**
 * Checks for the presence of enemy tank in given cell position
 * @param {Number} ycell - Y cell position to check for presence of enemy tank
 * @param {Number} xcell - X cell position to check for presence of enemy tank
 * @returns {Boolean} - true if tank is present in the cell , false otherwise
 */

export function checkEnemyTank(ycell, xcell) {
  for (i = 0; i < mapEnemies.length; i++) {
    let enemyX = Math.floor(mapEnemies[i].x / BLOCK_SIZE);
    let enemyY = Math.floor(mapEnemies[i].y / BLOCK_SIZE);
    if (xcell == enemyX && ycell == enemyY) {
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
 * @param {Number} playerX - X cell position of the player
 * @param {Number} playerY - Y cell positon of the player
 * @param {Number} objectX - X cell position of the object
 * @param {Number} objectY - Y cell position of the object
 * @returns {Boolean} - true if wall is present between the player tank and the object , false otherwise
 */
export function checkWallBetween(playerX, playerY, objectX, objectY) {
  let xDiff = objectX - playerX;
  let yDiff = objectY - playerY;
  // console.log(xDiff, yDiff);
  if (xDiff >= 0 && yDiff >= 0) {
    while (xDiff > 0 || yDiff > 0) {
      if (xDiff >= yDiff) {
        playerX++;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        xDiff--;
      } else {
        playerY++;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        yDiff--;
      }
    }
  }
  else if (xDiff >= 0 && yDiff < 0) {
    while (xDiff > 0 || yDiff < 0) {
      if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        playerX++;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        xDiff--;
      } else {
        playerY--;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        yDiff++;
      }
    }
  }
  else if (xDiff < 0 && yDiff >= 0) {
    while (xDiff < 0 || yDiff > 0) {
      if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        playerX--;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        xDiff++;
      } else {
        playerY++;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        yDiff--;
      }
    }
  }
  else if (xDiff < 0 && yDiff < 0) {
    while (xDiff < 0 || yDiff < 0) {
      if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        playerX--;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        xDiff++;
      } else {
        playerY--;
        if (checkWall(playerY, playerX)) {
          return true;
        }
        yDiff++;
      }
    }
  }

  return false;
}