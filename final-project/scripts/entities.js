// Information regarding the player
function getPlayer() {
  return {
    x: 64 * 1 + 32,
    y: 64 * 1 + 32,
    arc: 0,
    deg: 0,
    distanceToProjectionPlane: VIEWDIST,
    height: 64,
    speed: MOVEMENTSPEED,
    timeSinceLastBullet: 100,
    keySpacePressed: false
  };
}

/**
 * 
 * @param {Number} index - Index number of the map
 * @returns {Array} - array containing enemy tank objects
 */
function getEnemies(index) {
  // Create deep copy of the array and return it, so that the original one remains intact
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