import { drawFillRectangle, drawLine } from './draw.js';
import { checkEnemyTank, checkBullet } from './check.js';
/**
 * Draws minimap for navigation on the right side of the main game screen
 */
export function drawMiniMap() {
  for (let r = 0; r < this.MAP_HEIGHT; r++) {
    for (let c = 0; c < this.MAP_WIDTH; c++) {
      if (this.currentMap[r][c] != 0) {
        // Draw grey square if there is a wall
        drawFillRectangle(MAPPOSITION + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 100, 100, 100, 255);
      }
      else if (checkEnemyTank(r, c)) {
        // Draw black square if there is an enemy tank
        drawFillRectangle(MAPPOSITION + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 0, 0, 0, 255);
      }
      else if (checkBullet(r, c)) {
        // Draw red square if there is a bullet
        drawFillRectangle(MAPPOSITION + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 255, 0, 0, 255);
      }
      else {
        // Draw white square if there is a blank space
        drawFillRectangle(MAPPOSITION + (c * MINIMAPSCALE),
          (r * MINIMAPSCALE), MINIMAPSCALE, MINIMAPSCALE, 255, 255, 255, 255);
      }
    }
  }


}

/**
 * Draws the player position on minimap 
 */
export function drawPlayerOnMiniMap(tank) {

  // Draw player position on the overhead map
  this.miniMapX = MAPPOSITION + ((tank.x / BLOCK_SIZE) * MINIMAPSCALE);
  this.miniMapY = ((tank.y / BLOCK_SIZE) * MINIMAPSCALE);

  // Draw a red square to show player position
  drawFillRectangle(Math.floor(this.miniMapX - 2), Math.floor(this.miniMapY - 2), 5, 5, 255, 0, 0, 255);

  // Draw a red line to show the direction of the player
  drawLine(
    Math.floor(this.miniMapX),
    Math.floor(this.miniMapY),
    Math.floor(this.miniMapX + cosTable[tank.arc] * 8),
    Math.floor(this.miniMapY + sinTable[tank.arc] * 8),
    255, 0, 0, 255);
}