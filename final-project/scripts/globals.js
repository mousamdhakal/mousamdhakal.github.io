// Projectionplane is the 3D screen
const PROJECTIONPLANEWIDTH = 640;
const PROJECTIONPLANEHEIGHT = 400;

const MAPPOSITION = 500;

// Minimum distance from the player position to the wall
const MINDISTANCETOWALL = 32;

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

// Obstacles in front of player
let mapItems = [
  { x: 10, y: 14, img: "./images/armor.png", visible: false, offset: 1 },
  { x: 14, y: 10, img: "./images/armor.png", visible: false, offset: -1 },
  { x: 10, y: 13, img: "./images/dog-small.png", visible: false, offset: 1 },
  { x: 13, y: 10, img: "./images/dog-small.png", visible: false, offset: -1 }
];


//Map to represent the obstacles
let spriteMap;

// Obstacles that are currently visible to the user
let visibleSprites = [];
let visibleEnemies = [];

var enemyTypes = [{
  img: './images/tank-front.png',
  moveSpeed: -3,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 100
},
{
  img: './images/tank-front.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20
},
{
  img: './images/tank-left.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20,
},
{
  img: './images/tank-left.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20,
},
{
  img: './images/tank-back.png',
  moveSpeed: 3,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 100,
},
{
  img: './images/tank-back.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20,
},
{
  img: './images/tank-right.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20
},
{
  img: './images/tank-right.png',
  moveSpeed: 0,
  rotSpeed: 3,
  totalStates: 1,
  holdTime: 20
}
]



var enemies = [];

let someAngle;

