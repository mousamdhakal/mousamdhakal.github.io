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
const MOVEMENTSPEED = 6;

// Calculated as (PROJECTIONPLSNEWIDTH/2) / Math.tan((fov / 2))
const VIEWDIST = 554;
// Number of bytes stored in imagedata of canvas for each pixel
// Each pixel has 4 data : red, green, blue and alpha value, each of which is between 0 and 255,i.e- 8 bits or 1 byte
// Hence, total number of bytes for each pixel = 4  bytes
const BYTESPERPIXEL = 4;

// size of wall cube
const BLOCK_SIZE = 64;
const WALL_HEIGHT = 64;

// Main game object to be referenced in different parts of the game
let game;

// Enemies that are currently visible to the user
let visibleEnemies = [];

// Image of the differnet enemy types,i.e- different sides of the tank
let enemies = [];

// Array of bullets that are currnetly fired 
let bulletList = [];

// The duration between two bullets fired in number of frames, (90 corresponds to 3 seonds as we are running on 30FPS)
const FIRINGSPEED = 90;

// Sound of the tank canon hitting obstacles
let gameSound;

// Types of enemy, i.e- different states of the tank
let enemyTypes = [{
  img: './images/tank-front.png',
  moveSpeed: -3,
  holdTime: 100
},
{
  img: './images/tank-front.png',
  moveSpeed: 0,
  holdTime: 20
},
{
  img: './images/tank-left.png',
  moveSpeed: 0,
  holdTime: 20,
},
{
  img: './images/tank-left.png',
  moveSpeed: 0,
  holdTime: 20,
},
{
  img: './images/tank-back.png',
  moveSpeed: 3,
  holdTime: 100,
},
{
  img: './images/tank-back.png',
  moveSpeed: 0,
  holdTime: 20,
},
{
  img: './images/tank-right.png',
  moveSpeed: 0,
  holdTime: 20
},
{
  img: './images/tank-right.png',
  moveSpeed: 0,
  holdTime: 20
}
]

// Get containers for the start screen, game screen and end screen
let startContainer = document.getElementById("start-screen");
let controlContainer = document.getElementById("control-screen");
let gameContainer = document.getElementById("game-screen");
let endContainer = document.getElementById("end-screen");
let winContainer = document.getElementById("won");

