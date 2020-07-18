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
  else if (e.keyCode == '81' && gameContainer.style.display == 'block') {
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

// Response function to different button clicks

/**
 * Go back to level screen to select another level after game ends
 */
function showLevels() {
  // Re-initialize variables for this map
  game.initializeVariables();

  // Hide end screen and show level screen
  endContainer.style.display = 'none';
  levelContainer.style.display = 'block';
}

/**
 * Go back to the home screen from levels screen on pressing home button
 */
function goHomeFromLevels() {
  startContainer.style.display = 'block';
  levelContainer.style.display = 'none';
}

/**
 * Go back to the home screen while playing the game
 * Can be called by either clicking the button or pressing the key 'Q'
 */
function goHomeFromGame() {
  gameContainer.style.display = 'none';
  startContainer.style.display = 'block';
}

/**
 * Go back to levels from mapbuilder screen without saving the map
 */
function goLevelsFromMapBuilder() {
  // Clear this canvas
  clearCanvas();

  // Hide mapbuilder screen and show levels screen and the controls button
  mapBuilderContainer.style.display = 'none';
  controlsButton.style.display = 'inline';
  levelContainer.style.display = 'block';
}
