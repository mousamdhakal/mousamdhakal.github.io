// Array for images of the wall
let wallsArray = [];

// Array for other images to load during startup
let startImages = [];

// variable to check if all the images are completely loaded
let noOfImageLoaded = 0;

/**
 * Loads the image for the give number of arguments after first in the first argument
 * @param {Array} -Collector array where the image objects will be stored
 */
function preload(collector) {
  for (var i = 0; i < arguments.length - 1; i++) {
    collector[i] = new Image();
    collector[i].src = preload.arguments[i + 1];
    collector[i].onload = imageLoaded;
  }
}

// Load images for start button, poster, tanks and canon
// Once these are loaded when they are used via caching when the same source for image is encountered
preload(
  startImages,
  './images/start.png',
  './images/game-poster.png',
  './images/tank-front.png',
  './images/tank-left.png',
  './images/tank-right.png',
  './images/tank-back.png',
  './images/canon.png'
);

// Load walls image
preload(wallsArray, './images/mapSmall.png');

/**
 * Checks for number of images loaded and once all images are loaded , calls the onLoadFinish function
 */
function imageLoaded() {
  noOfImageLoaded++;
  if (noOfImageLoaded == 8) {
    onLoadFinish();
  }
}

// Set the start button
document.getElementById('start').style.backgroundImage =
  'url("./images/start.png")';

/**
 * Shows the start screen hiding the loading text
 */
function onLoadFinish() {
  document.getElementById('start-screen').style.display = 'block';
  document.getElementById('initial-screen').style.display = 'none';
  document.getElementById('control-button').style.display = 'block';
}
