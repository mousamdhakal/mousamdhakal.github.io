// The sine and cos values of angles are used a lot of the time in each frame update, thus lookup tables are created for finding values of angles
// The angles are rounded down , so we only acccount for 360 angles.( I am choosing this for increase in performance over a small loss of accuracy)

// FOV or field of vision of 60 degrees is used which needs to account for all rays cast in projection plane width
const ANGLE60 = PROJECTION_PLANE_WIDTH;

// Since we are going to use lookup tables the values need to be integers, thus the floor functions are used
const ANGLE30 = Math.floor(ANGLE60 / 2);
const ANGLE15 = Math.floor(ANGLE30 / 2);
const ANGLE90 = Math.floor(ANGLE30 * 3);
const ANGLE180 = Math.floor(ANGLE90 * 2);
const ANGLE270 = Math.floor(ANGLE90 * 3);
const ANGLE360 = Math.floor(ANGLE60 * 6);
const ANGLE0 = 0;
const ANGLE5 = Math.floor(ANGLE30 / 6);
const ANGLE10 = Math.floor(ANGLE5 * 2);
const ANGLE2 = Math.floor(ANGLE10 / 5);
const ANGLE45 = Math.floor(ANGLE15 * 3);

// Trignometric lookup tables which are to be generated

let i;
let radian;

// Initialize lookup tables for size  1 to 360 degrees and 0 degree ,i.e- total of 361 degrees but the number of values to be generated depends on projection plane width

const sinTable = new Array(ANGLE360 + 1); // Table for sine angles values
const sinITable = new Array(ANGLE360 + 1); // Table for sine inverse angles values
const cosTable = new Array(ANGLE360 + 1); // Table for cos angles values
const cosITable = new Array(ANGLE360 + 1); // Table for cos inverse angles values
const tanTable = new Array(ANGLE360 + 1); // Table for tan angles values
const tanITable = new Array(ANGLE360 + 1); // Table for tan inverse angles values
const fishEyeCorrectionTable = new Array(ANGLE360 + 1); // Table for correcting fisheye effect on the wall image
const xStepTable = new Array(ANGLE360 + 1);
const yStepTable = new Array(ANGLE360 + 1);

for (i = 0; i <= ANGLE360; i++) {
  // Fill the lookup tables by calculating the values
  // Add 0.0001  to avoid division by 0 which creates holes on walls at 0,90,270,180 degrees angles.
  radian = arcToRad(i) + 0.0001;
  sinTable[i] = Math.sin(radian);
  sinITable[i] = 1.0 / sinTable[i];
  cosTable[i] = Math.cos(radian);
  cosITable[i] = 1.0 / cosTable[i];
  tanTable[i] = Math.tan(radian);
  tanITable[i] = 1.0 / tanTable[i];

  // Generate lookup tables to speedup wall lookups, once we know the angle, the distance between the walls is always same.

  // Facing LEFT
  if (i >= ANGLE90 && i < ANGLE270) {
    xStepTable[i] = BLOCK_SIZE / tanTable[i];
    if (xStepTable[i] > 0) xStepTable[i] = -xStepTable[i];
  }
  // facing RIGHT
  else {
    xStepTable[i] = BLOCK_SIZE / tanTable[i];
    if (xStepTable[i] < 0) xStepTable[i] = -xStepTable[i];
  }

  // FACING DOWN
  if (i >= ANGLE0 && i < ANGLE180) {
    yStepTable[i] = BLOCK_SIZE * tanTable[i];
    if (yStepTable[i] < 0) yStepTable[i] = -yStepTable[i];
  }
  // FACING UP
  else {
    yStepTable[i] = BLOCK_SIZE * tanTable[i];
    if (yStepTable[i] > 0) yStepTable[i] = -yStepTable[i];
  }
}

// Create table for fixing FISHBOWL distortion
for (i = -ANGLE30; i <= ANGLE30; i++) {
  radian = arcToRad(i);
  // we don't have negative angle, so make it start at 0 by adding 30 degrees aftwerwards
  // which will give range from column 0 to 639 (PROJECTONPLANEWIDTH) since we only will need to use those range
  fishEyeCorrectionTable[i + ANGLE30] = 1.0 / Math.cos(radian);
}

/**
 * Convert arc to radian
 */
function arcToRad(arcAngle) {
  return (arcAngle * Math.PI) / ANGLE180;
}
