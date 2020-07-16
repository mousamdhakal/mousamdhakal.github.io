/**
 * Responds to keydown event
 */
function handleKeyDown() {
  e = window.event;

  // If 'W' key is pressed, set the corresponding flag
  if (e.keyCode == '87') {
    game.keyUpPressed = true;

  }
  // If 'S' key is pressed, set the corresponding flag
  else if (e.keyCode == '83') {
    game.keyDownPressed = true;
  }
  // If 'A' key is pressed, set the corresponding flag
  else if (e.keyCode == '65') {
    game.keyLeftPressed = true;
  }
  // If 'D' key is pressed, set the corresponding flag
  else if (e.keyCode == '68') {
    game.keyRightPressed = true;
  }
  // If 'Spacebar key is pressed, set the corresponding flag
  else if (e.keyCode == '32') {
    game.player.keySpacePressed = true;
  }
  // Play the game on pressing J key
  else if (e.keyCode == '74') {
    game.play();
  }
  //Pause the game on pressing K key
  else if (e.keyCode == '75') {
    game.pause();
  }
  // Quit the game on pressing Q key
  else if (e.keyCode == '81' && gameContainer.style.display == "block") {
    game.quit();
  }

}

/**
 * Responds to keyup event
 */
function handleKeyUp() {
  e = window.event;

  // If 'W' key is released, clear the corresponding flag
  if (e.keyCode == '87') {
    game.keyUpPressed = false;

  }
  // If 'S' key is released, clear the corresponding flag
  else if (e.keyCode == '83') {
    game.keyDownPressed = false;
  }
  // If 'A' key is released, clear the corresponding flag
  else if (e.keyCode == '65') {
    game.keyLeftPressed = false;
  }
  // If 'D' key is released, clear the corresponding flag
  else if (e.keyCode == '68') {
    game.keyRightPressed = false;
  }
  // If 'Spacebar' key is released, clear the corresponding flag

  else if (e.keyCode == '32') {
    game.player.keySpacePressed = false;
  }
}

function showLevels() {
  game.initializeVariables();
  endContainer.style.display = "none";
  startContainer.style.display = "block";
}

function goLevelsFromControls() {
  controlContainer.style.display = "none";
  startContainer.style.display = "block";
}

function goLevelsFromCustoms() {
  customContainer.style.display = "none";
  startContainer.style.display = "block";
}

function goLevelsFromGame() {
  gameContainer.style.display = "none";
  startContainer.style.display = "block";
}

function goLevelsFromMapBuilder() {
  clearCanvas();
  mapBuilderContainer.style.display = "none";
  startContainer.style.display = "block";
}