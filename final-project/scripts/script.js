import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById("gameCanvas");

game = new Game(canvas);
game.init();