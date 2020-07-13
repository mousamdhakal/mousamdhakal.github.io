import { checkWall, checkWallBetween } from './check.js';

/**
 * Move around the enemy tank and fire bullet if the tank is facing towards player and there are no blocking walls between user and enemy tank
 */
export function moveTanks() {
  for (i = 0; i < this.mapEnemies.length; i++) {
    let enemy = this.mapEnemies[i];
    var enemyType = enemy.type;
    var diffX = ((enemy.x - this.player.x) / BLOCK_SIZE);
    var diffY = ((enemy.y - this.player.y) / BLOCK_SIZE);

    // Set the type of tank that is which face of tank to show according to it's position from user
    if (diffY < -2) {
      enemyType = (enemyType + 2) % 7;
    } else if (diffY > 2) {
      enemyType = (enemyType + 6) % 7;
    }
    else if (diffX < 0) {
      enemyType = (enemyType + 4) % 7;
    }

    // Calculate the cell positions for user tank and enemy tank
    let tankXcell = Math.floor(enemy.x / BLOCK_SIZE);
    let tankYcell = Math.floor(enemy.y / BLOCK_SIZE);
    let playerXcell = Math.floor(game.player.x / BLOCK_SIZE);
    let playerYCell = Math.floor(game.player.y / BLOCK_SIZE);

    // If tank is facing towards user and no walls between fire bullet and skip the movement
    if ((enemyType == 0 || enemyType == 1) && !checkWallBetween(tankXcell, tankYcell, playerXcell, playerYCell)) {
      this.fireBullet(enemy);
      continue;
    }

    // Calculate the step to be moved in both axises
    let moveStepX = enemy.speedX * enemyTypes[enemy.type].moveSpeed;
    let moveStepY = enemy.speedY * enemyTypes[enemy.type].moveSpeed;

    // Change x and y position by movestep
    enemy.x += moveStepX;
    enemy.y += moveStepY;

    // Calculate new position for the tank
    tankXcell = Math.floor(enemy.x / BLOCK_SIZE);
    tankYcell = Math.floor(enemy.y / BLOCK_SIZE);

    // Increase the enemy.moved by one
    enemy.moved++;

    // If enemy.moved has crossed the holdtime , or it is in collision with wall then reverse
    // the move and change the state of tank for rotation to move in opposite direction

    if (enemy.moved > enemyTypes[enemy.type].holdTime || checkWall(tankYcell, tankXcell)) {
      enemy.x -= moveStepX;
      enemy.y -= moveStepY;
      enemy.type++;

      // If type of enemy has crossed 7, move back to 0  
      if (enemy.type > 7) {
        enemy.type = 0;
      }
      enemy.moved = 0;
    }
  }
}

/**
 * Fires bullet from a tank 
 * @param {Object} tank -  The tank from which bullet is to be fired
 */
export function fireBullet(tank) {
  // Check the time from which the last bullet was fired from this tank and 
  // if it is above the minimum time between two bullets
  if (tank.timeSinceLastBullet > FIRINGSPEED && tank.keySpacePressed) {

    // Create new bullet object
    let bullet = createNewBullet();

    // If bullet is fired from user tank, calculate the direction of bullet according to player's direction
    if (tank == game.player) {
      bullet.bulletXDir = cosTable[game.player.arc];
      bullet.bulletYDir = sinTable[game.player.arc];
    }
    // If the bullet is fired from enemy tank, calculated the direction of bullet according to the angle between the tank and user tank.
    else {
      var diffX = ((tank.x - game.player.x) / BLOCK_SIZE);
      var diffY = ((tank.y - game.player.y) / BLOCK_SIZE);

      let angle = Math.atan2(diffY, diffX);
      bullet.bulletXDir = Math.cos(angle);
      bullet.bulletYDir = Math.sin(angle);
    }

    // Set the initial position of bullet equal to the tank from which it is fired from
    bullet.x = tank.x;
    bullet.y = tank.y;

    // Set the fired property of bullet to the tank from which it was fired for easy access later
    bullet.fired = tank;
    bulletList.push(bullet);

    // Set time since last bullet fired to 0 for this tank 
    tank.timeSinceLastBullet = 0;
  }
}

/**
 * Moves the bullet according to it's direction
 */
export function moveBullets() {
  for (i = 0; i < bulletList.length; i++) {
    // Set bullet as current bullet from the array
    let bullet = bulletList[i];
    let dx = (bullet.bulletXDir * bullet.speed);
    let dy = (bullet.bulletYDir * bullet.speed);
    // If bullet fired from player
    if (bullet.fired == game.player) {
      // Change x and y position by addition as bullet is to be moved away from player
      bullet.x += dx;
      bullet.y += dy;
    } else {
      // Change x and y position by subtraction as bullet is to be moved towards the player
      bullet.x -= dx;
      bullet.y -= dy;
    }

  }
}