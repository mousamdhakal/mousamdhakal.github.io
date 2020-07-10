// Information regarding the player
let player = {
  x: 160,
  y: 160,
  arc: 0,
  deg: 0,
  distanceToProjectionPlane: VIEWDIST,
  height: 64,
  speed: MOVEMENTSPEED,
};

var mapEnemies = [
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
    moved: 0
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
    moved: 0
  }
]
