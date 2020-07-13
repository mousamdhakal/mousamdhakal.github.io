import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById("gameCanvas");

function startEasy() {
  // Create new object of class Game calling it's constructor function
  game = new Game(canvas, 1);
  startContainer.style.display = "none";
  controlContainer.style.display = "block";
}

function startClassic() {
  // Create new object of class Game calling it's constructor function
  game = new Game(canvas, 2);
  startContainer.style.display = "none";
  controlContainer.style.display = "block";
}

document.getElementById('easy').addEventListener('click', startEasy);
document.getElementById('classic').addEventListener('click', startClassic);

