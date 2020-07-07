import { drawFillRectangle, drawLine } from './draw.js';

/**
 * Draws minimap for navigation on the right side of the main game screen
 */
export function drawMiniMap() {
  for (let r = 0; r < this.MAP_HEIGHT; r++) {
    for (let c = 0; c < this.MAP_WIDTH; c++) {
      if (this.currentMap.charAt(r * this.MAP_WIDTH + c) != "O") {
        // Draw grey square if there is a wall
        drawFillRectangle(PROJECTIONPLANEWIDTH + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 100, 100, 100, 255);
      }
      else {
        // Draw white square if there is a blank space
        drawFillRectangle(PROJECTIONPLANEWIDTH + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 255, 255, 255, 255);
      }
    }
  }

  // Draw player position on the overhead map
  this.miniMapX = PROJECTIONPLANEWIDTH + ((this.player.x / BLOCK_SIZE) * MINIMAPSCALE);
  this.miniMapY = ((this.player.y / BLOCK_SIZE) * MINIMAPSCALE);
}

/**
 * Draws the player position on minimap 
 */
export function drawPlayerOnMiniMap() {
  // Draw a red square to show player position
  drawFillRectangle(Math.floor(this.miniMapX - 2), Math.floor(this.miniMapY - 2), 5, 5, 255, 0, 0, 255);

  // Draw a red line to show the direction of the player
  drawLine(
    Math.floor(this.miniMapX),
    Math.floor(this.miniMapY),
    Math.floor(this.miniMapX + cosTable[this.player.arc] * 8),
    Math.floor(this.miniMapY + sinTable[this.player.arc] * 8),
    255, 0, 0, 255);
}