// Information regarding the player
function getPlayer() {
  return {
    x: 100,
    y: 300,
    arc: 0,
    deg: 0,
    distanceToProjectionPlane: VIEWDIST,
    height: 64,
    speed: MOVEMENTSPEED,
    timeSinceLastBullet: 100,
    keySpacePressed: false
  };
}

function getEnemies() {
  // Information regarding enemies on the map
  let mapEnemies = [
    {
      type: 4,
      x: 916,
      y: 128,
      arc: 0,
      deg: 0,
      offset: 0.75,
      visible: false,
      maxDx: 20,
      maxDy: 15,
      speedX: 1,
      speedY: 0,
      moved: 0,
      timeSinceLastBullet: 100,
      keySpacePressed: true

    },
    {
      type: 4,
      x: 316,
      y: 1600,
      arc: 0,
      deg: 0,
      offset: 1,
      visible: false,
      maxDx: 20,
      maxDy: 2,
      speedX: 1,
      speedY: 0,
      moved: 0,
      timeSinceLastBullet: 100,
      keySpacePressed: true

    }
  ]
  return mapEnemies;
}

function getMapItems(index) {

  if (index == 1) {
    return [
      { x: 10, y: 14, img: "./images/armor.png", visible: false, offset: 1 },
      { x: 14, y: 10, img: "./images/armor.png", visible: false, offset: -1 },
      { x: 10, y: 13, img: "./images/dog-small.png", visible: false, offset: 1 },
      { x: 13, y: 10, img: "./images/dog-small.png", visible: false, offset: -1 }
    ];
  } else if (index == 2) {
    return [
      { x: 14, y: 16, img: "./images/armor.png", visible: false, offset: -1 },
      { x: 14, y: 6, img: "./images/armor.png", visible: false, offset: -1 },
      { x: 13, y: 16, img: "./images/dog-small.png", visible: false, offset: -1 },
      { x: 13, y: 6, img: "./images/dog-small.png", visible: false, offset: -1 }
    ];
  }
}

/**
 * Creates a bullet object
 * @returns {Object} - bullet object with x and y position and speed
 */
function createNewBullet() {
  return {
    x: 200,
    y: 160,
    speed: MOVEMENTSPEED * 6
  };
}