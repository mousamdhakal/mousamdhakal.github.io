/**
 * Constants used throughout the game
 */

// Projectionplane is the 3D screen
const PROJECTION_PLANE_WIDTH = 640;
const PROJECTION_PLANE_HEIGHT = 400;

// Position on canvas from where to start drawing the minimap
const MAP_POSITION = 500;

// Size of the map (number of rows or number of columns)
const MAP_SIZE = 28;

// Value that scales the size of size of canvas for mapbuilder
const MAPBUILDER_SCALE = 20;

// Minimum distance from the player position to the wall
const MIN_DISTANCE_TO_WALL = 32;

// Half of screen height
const PROJECTION_PLANE_CENTER_HEIGHT = PROJECTION_PLANE_HEIGHT / 2;

// Number of times the screen refreshes
const FRAME_RATE = 30;

// Value that scales the size of minimap
const MINIMAP_SCALE = 5;

// Value that scales the size of canvas for level selection screen
const CUSTOMMAP_SCALE = 6;

// Speed at which player movement occurs on moving forward and backward
const MOVEMENT_SPEED = 6;

// Calculated as (PROJECTIONPLSNEWIDTH/2) / Math.tan((fov / 2))
const VIEW_DIST = 554;

// Number of bytes stored in imagedata of canvas for each pixel
// Each pixel has 4 data : red, green, blue and alpha value, each of which is between 0 and 255,i.e- 8 bits or 1 byte
// Hence, total number of bytes for each pixel = 4  bytes
const BYTES_PER_PIXEL = 4;

// size of wall cube
const BLOCK_SIZE = 64;
const WALL_HEIGHT = 64;

// Range of fire from the tank
const FRONT_RANGE = 20;
const SIDE_RANGE = 4;

// The duration between two bullets fired in number of frames, (90 corresponds to 3 seonds as we are running on 30FPS)
const FIRING_SPEED = 90;

/**
 * Variables that are used throughout the game
 */

// Main game object to be referenced in different parts of the game
let game;

// Enemies that are currently visible to the user
let visibleEnemies = [];

// Image of the different enemy types,i.e- different sides of the tank
let enemies = [];

// Array of bullets that are currnetly fired
let bulletList = [];

// Sound of the tank canon hitting obstacles
let gameSound;

// Store different DOM elements that are frequently referenced in variables
let levelContainer = document.getElementById('level-screen');
let startContainer = document.getElementById('start-screen');
let gameContainer = document.getElementById('game-screen');
let endContainer = document.getElementById('end-screen');
let winContainer = document.getElementById('win-screen');
let mapBuilderContainer = document.getElementById('map-builder');
let controlsButton = document.getElementById('control-button');

// Types of enemy, i.e- different states of the tank
let enemyTypes = [
  {
    img: './images/tank-front.png',
    moveSpeed: -3,
    holdTime: 100,
  },
  {
    img: './images/tank-front.png',
    moveSpeed: 0,
    holdTime: 20,
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
    holdTime: 20,
  },
  {
    img: './images/tank-right.png',
    moveSpeed: 0,
    holdTime: 20,
  },
];
