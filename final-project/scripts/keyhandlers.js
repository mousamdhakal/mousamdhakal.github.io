// On keydown event
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

}


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
