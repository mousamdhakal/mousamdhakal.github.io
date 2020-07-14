// Information regarding the player
function getPlayer() {
  return {
    x: 100,
    y: 160,
    arc: 0,
    deg: 0,
    distanceToProjectionPlane: VIEWDIST,
    height: 64,
    speed: MOVEMENTSPEED,
    timeSinceLastBullet: 100,
    keySpacePressed: false
  };
}

function getEnemies(index) {
  let thisMapEnemies = JSON.parse(JSON.stringify(mapEnemies));
  return thisMapEnemies[index - 1];
}

/**
 * Creates a bullet object
 * @returns {Object} - bullet object with x and y position and speed
 */
function createNewBullet() {
  return {
    x: 200,
    y: 160,
    speed: MOVEMENTSPEED * 4
  };
}