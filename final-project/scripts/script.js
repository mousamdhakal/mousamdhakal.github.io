import { Game } from './game.js';

// Get the canvas element and start the game
let canvas = document.getElementById("gameCanvas");
let miniMap = document.getElementById("minimap");

game = new Game(canvas, miniMap);
game.init();