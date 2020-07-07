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
const MINIMAPSCALE = 10;

// Speed at which player movement occurs on moving forward and backward
const MOVEMENTSPEED = 8;

// Number of bytes stored in imagedata of canvas for each pixel
// Each pixel has 4 data : red, green, blue and alpha value, each of which is between 0 and 255,i.e- 8 bits or 1 byte
// Hence, total number of bytes for each pixel = 4  bytes
const BYTESPERPIXEL = 4;


// size of wall cube
const BLOCK_SIZE = 128;
const WALL_HEIGHT = 128;

// main game object 
let game;