import { checkWall, checkWallBetween } from './check.js';

export function moveTanks() {
  // console.log('tank moved');
  for (i = 0; i < mapEnemies.length; i++) {
    let enemy = mapEnemies[i];
    var enemyType = enemy.type;
    var diffX = ((enemy.x - player.x) / BLOCK_SIZE);
    var diffY = ((enemy.y - player.y) / BLOCK_SIZE);

    if (diffY < -2) {
      enemyType = (enemyType + 2) % 7;
    } else if (diffY > 2) {
      enemyType = (enemyType + 6) % 7;
    }
    else if (diffX < 0) {
      enemyType = (enemyType + 4) % 7;
    }
    let tankXcell = Math.floor(enemy.x / BLOCK_SIZE);
    let tankYcell = Math.floor(enemy.y / BLOCK_SIZE);
    let playerXcell = Math.floor(game.player.x / BLOCK_SIZE);
    let playerYCell = Math.floor(game.player.y / BLOCK_SIZE);

    if ((enemyType == 0 || enemyType == 1) && !checkWallBetween(tankXcell, tankYcell, playerXcell, playerYCell)) {
      this.fireBullet(enemy);
      continue;
    }
    let moveStepX = enemy.speedX * enemyTypes[enemy.type].moveSpeed;
    let moveStepY = enemy.speedY * enemyTypes[enemy.type].moveSpeed;

    enemy.x += moveStepX;
    enemy.y += moveStepY;

    tankXcell = Math.floor(enemy.x / BLOCK_SIZE);
    tankYcell = Math.floor(enemy.y / BLOCK_SIZE);

    enemy.moved++;
    if (enemy.moved > enemyTypes[enemy.type].holdTime || checkWall(tankYcell, tankXcell)) {
      enemy.x -= moveStepX;
      enemy.y -= moveStepY;
      enemy.type++;
      if (enemy.type > 7) {
        enemy.type = 0;
      }
      enemy.moved = 0;
    }
  }
}

export function fireBullet(tank) {
  if (tank.timeSinceLastBullet > FIRINGSPEED && tank.keySpacePressed) {
    let bullet = createNewBullet();
    if (tank == player) {
      bullet.bulletXDir = cosTable[game.player.arc];
      bullet.bulletYDir = sinTable[game.player.arc];
    } else {
      var diffX = ((tank.x - player.x) / BLOCK_SIZE);
      var diffY = ((tank.y - player.y) / BLOCK_SIZE);

      let angle = Math.atan2(diffY, diffX);
      bullet.bulletXDir = Math.cos(angle);
      bullet.bulletYDir = Math.sin(angle);
    }
    bullet.x = tank.x;
    bullet.y = tank.y;
    bullet.fired = tank;
    bulletList.push(bullet);
    tank.timeSinceLastBullet = 0;
  }
}

export function moveBullets() {
  for (i = 0; i < bulletList.length; i++) {
    let bullet = bulletList[i];

    // console.log(bullet.tank == player);
    if (bullet.fired == player) {


      let dx = Math.round(bullet.bulletXDir * bullet.speed);
      let dy = Math.round(bullet.bulletYDir * bullet.speed);
      bullet.x += dx;
      bullet.y += dy;
    } else {

      let dx = Math.round(bullet.bulletXDir * bullet.speed);
      let dy = Math.round(bullet.bulletYDir * bullet.speed);
      bullet.x -= dx;
      bullet.y -= dy;
    }

  }
}