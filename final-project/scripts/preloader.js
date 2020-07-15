// Array for images of the wall
let wallsArray = [];

let startImages = [];

let tankImages = [];

function preload() {
  for (var i = 0; i < arguments.length - 1; i++) {
    preload.arguments[0][i] = new Image();
    preload.arguments[0][i].src = preload.arguments[i + 1];
  }
}

// Load walls image
preload(wallsArray,
  "./images/mapSmall.png"
)

// Load images for start button which will be used via caching
preload(startImages,
  "../images/easy-map.png",
  "../images/classic-map.png",
  "../images/start.png"
)
document.getElementById('easy').style.backgroundImage = startImages[0];
document.getElementById('classic').style.backgroundImage = startImages[1];
document.getElementById('start').style.backgroundImage = startImages[2];


// Load tank images and canon image which will be used via caching as well
preload(tankImages,
  './images/tank-front.png',
  './images/tank-left.png',
  './images/tank-back.png',
  './images/tank-back.png',
  './images/canon.png'
)

onLoadFinish();

function onLoadFinish() {
  document.getElementById('start-screen').style.display = "block";
  document.getElementById('initial-screen').style.display = "none";
}




