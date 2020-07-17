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
  "./images/start.png",
  "./images/game-poster.png"
)

document.getElementById('start').style.backgroundImage = 'url("./images/start.png")';

// Load tank images and canon image which will be used via caching as well
preload(tankImages,
  './images/tank-front.png',
  './images/tank-left.png',
  './images/tank-back.png',
  './images/tank-back.png',
  './images/canon.png'
)

loadFontAwesome();
onLoadFinish();



function loadFontAwesome() {
  let someContainer = document.createElement('div');
  someContainer.innerHTML = '<i class="fas fa-home"></i>';
  someContainer.style.visibility = "hidden";
  document.body.appendChild(someContainer);
}

function onLoadFinish() {
  document.getElementById('start-screen').style.display = "block";
  document.getElementById('initial-screen').style.display = "none";
}




