// Projectionplane is the 3D screen
const PROJECTIONPLANEWIDTH = 640;
const PROJECTIONPLANEHEIGHT = 400;

// Minimum distance from the player position to the wall
const MINDISTANCETOWALL = 20;

// Half of screen height
const PROJECTIONPLANECENTERHEIGHT = PROJECTIONPLANEHEIGHT / 2;

// Number of times the screen refreshes
const FRAMERATE = 30;

// Value that scales the size of minimap
const MINIMAPSCALE = 5;

// Speed at which player movement occurs on moving forward and backward
const MOVEMENTSPEED = 8;

// Calculated as (PROJECTIONPLSNEWIDTH/2) / Math.tan((fov / 2))
const VIEWDIST = 554;
// Number of bytes stored in imagedata of canvas for each pixel
// Each pixel has 4 data : red, green, blue and alpha value, each of which is between 0 and 255,i.e- 8 bits or 1 byte
// Hence, total number of bytes for each pixel = 4  bytes
const BYTESPERPIXEL = 4;

// size of wall cube
const BLOCK_SIZE = 64;
const WALL_HEIGHT = 64;

// main game object
let game;

// var itemTypes = [
//   {  }, // 0
// ];

var mapItems = [
  // Armor in front of player
  { x: 10, y: 14, img: "./images/armor.png", visible: false, xToPut: 9, yToPut: 14 },
  { x: 17, y: 14, img: "./images/armor.png", visible: false, xToPut: 18, yToPut: 14 }
  // { x: 10, y: 15, img: "./images/armor.png", visible: false, offset: 0, drawY: 0, size: 0, xToPut: 9, yToPut: 14 }
  // { x: 6, y: 14, img: "./images/armor.png", visible: false, offset: 0, drawY: 0, size: 0 }
];

var spriteMap;

var visibleSprites = [];
