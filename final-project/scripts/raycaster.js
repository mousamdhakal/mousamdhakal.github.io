import { drawWallSliceRectangle } from './draw.js';

export function castRays() {
  // Horizontal or vertical co-ordinate of intersection
  var verticalGrid;
  var horizontalGrid;

  // distance to next grid , needed to account for different direction in which rays move
  var distToNextVerticalGrid;
  var distToNextHorizontalGrid;

  // x and y intersection points
  var xIntersection;
  var yIntersection;
  var distToNextXIntersection;
  var distToNextYIntersection;

  let wallType = 0;

  // Current block/tile of the map that the ray is in
  var xGridIndex;
  var yGridIndex;

  // Distance of x and y ray intersections from the viewpoint
  var distToVerticalGridBeingHit;
  var distToHorizontalGridBeingHit;

  var castArc, castColumn;

  // Get the angle the player is facing towards
  castArc = this.player.arc;
  // Subtract it by 30 degrees as we are using FOV of 60 degrees, the starting point will be current angle of player - half of FOV
  castArc -= ANGLE30;

  // If this angle goes to negative, add 360 degrees to bring it into one of the four quadrants.
  if (castArc < 0) {
    castArc = ANGLE360 + castArc;
  }

  for (castColumn = 0; castColumn < PROJECTIONPLANEWIDTH; castColumn += 1) {
    // If the ray is between 0 and 180 degrees, ray is facing down
    if (castArc > ANGLE0 && castArc < ANGLE180) {
      // Get co-ordinate of first grid in front of player in pixel unit rounded down
      horizontalGrid =
        Math.floor(this.player.y / BLOCK_SIZE) * BLOCK_SIZE + BLOCK_SIZE;

      // Compute distance to next horizontal grid
      distToNextHorizontalGrid = BLOCK_SIZE;

      // This is the horizontal distance to grid which is found by 1/tan(arc) * verticalDistance
      var xtemp = tanITable[castArc] * (horizontalGrid - this.player.y);

      // X point of intersection to the grid
      xIntersection = xtemp + this.player.x;
    }
    // Else, ray is facing up
    else {
      // Same process as above but as the y co-ordinate goes from top to bottom, when the ray is going upwards we need to account for negative direction
      horizontalGrid = Math.floor(this.player.y / BLOCK_SIZE) * BLOCK_SIZE;
      distToNextHorizontalGrid = -BLOCK_SIZE;

      var xtemp = tanITable[castArc] * (horizontalGrid - this.player.y);
      xIntersection = xtemp + this.player.x;

      // Reduce the horizontalGrid by 1 as the intersection is taking place on lower part of the wall and not the upper part
      horizontalGrid--;
    }

    /** Look for horizontal wall */

    // If ray is directly facing left or right then ignore it
    if (castArc == ANGLE0 || castArc == ANGLE180) {
      distToHorizontalGridBeingHit = Number.MAX_VALUE;
    }
    // Else move the ray until it hits a horizontal wall
    else {
      // Distance to next X intersection is constant which depends on cast angle which is extracted from generated table
      distToNextXIntersection = xStepTable[castArc];
      while (true) {
        // Calculate the grid where the ray currently hits to look in the map
        xGridIndex = Math.floor(xIntersection / BLOCK_SIZE);
        yGridIndex = Math.floor(horizontalGrid / BLOCK_SIZE);

        // Stop if we've looked as far as outside the map index
        if (
          xGridIndex >= this.MAP_WIDTH ||
          yGridIndex >= this.MAP_HEIGHT ||
          xGridIndex < 0 ||
          yGridIndex < 0
        ) {
          distToHorizontalGridBeingHit = Number.MAX_VALUE;
          break;
        }

        // Check if the grid is opening or wall
        else if (this.currentMap[yGridIndex][xGridIndex] != 0) {
          distToHorizontalGridBeingHit =
            (xIntersection - this.player.x) * cosITable[castArc];
          wallType = this.currentMap[yGridIndex][xGridIndex];
          break;
        }

        // Else, keep looking.The ray is not blocked at this point as the ckecking for wall is already passed, so extend the ray to the next grid
        else {
          // Check for presence of static sprites and enemy tanks in the current position
          checkObjects(yGridIndex, xGridIndex);
          xIntersection += distToNextXIntersection;
          horizontalGrid += distToNextHorizontalGrid;
        }
      }
    }

    // FOLLOW X RAY
    // Ray is facing right
    if (castArc < ANGLE90 || castArc > ANGLE270) {
      // Get co-ordinate of first grid in front of player in pixel unit rounded down
      verticalGrid =
        BLOCK_SIZE + Math.floor(this.player.x / BLOCK_SIZE) * BLOCK_SIZE;

      // Compute distance to next vertical grid
      distToNextVerticalGrid = BLOCK_SIZE;

      // This is the vertical distance to grid which is found by 1/tan(arc) * horizontalDistance
      var ytemp = tanTable[castArc] * (verticalGrid - this.player.x);
      yIntersection = ytemp + this.player.y;
    }
    // Ray is facing left
    else {
      // Same process as above but as the x co-ordinate goes from left to right, when the ray is going leftwards we need to account for negative direction
      verticalGrid = Math.floor(this.player.x / BLOCK_SIZE) * BLOCK_SIZE;
      distToNextVerticalGrid = -BLOCK_SIZE;

      var ytemp = tanTable[castArc] * (verticalGrid - this.player.x);
      yIntersection = ytemp + this.player.y;

      // Reduce the verticalGrid by 1 as the intersection is taking place on left part of the grid and not on the right part
      verticalGrid--;
    }

    /** Look for vertical wall */
    // If ray is directly facing up or down then ignore it
    if (castArc == ANGLE90 || castArc == ANGLE270) {
      distToVerticalGridBeingHit = Number.MAX_VALUE;
    } else {
      // Distance to next Y intersection is constant which depends on cast angle which is extracted from generated table
      distToNextYIntersection = yStepTable[castArc];
      while (true) {
        // Calculate the grid where the ray currently hits to look in the map
        xGridIndex = Math.floor(verticalGrid / BLOCK_SIZE);
        yGridIndex = Math.floor(yIntersection / BLOCK_SIZE);

        // Stop if we've looked as far as outside the map index
        if (
          xGridIndex >= this.MAP_WIDTH ||
          yGridIndex >= this.MAP_HEIGHT ||
          xGridIndex < 0 ||
          yGridIndex < 0
        ) {
          distToVerticalGridBeingHit = Number.MAX_VALUE;
          break;
        }

        // Check if the grid is opening or wall
        else if (this.currentMap[yGridIndex][xGridIndex] != 0) {
          distToVerticalGridBeingHit =
            (yIntersection - this.player.y) * sinITable[castArc];
          wallType = this.currentMap[yGridIndex][xGridIndex];

          break;
        }

        // Else, keep looking.The ray is not blocked at this point as the ckecking for wall is already passed, so extend the ray to the next grid
        else {
          // Check for presence of static sprites and tank in the current position
          checkObjects(yGridIndex, xGridIndex);
          yIntersection += distToNextYIntersection;
          verticalGrid += distToNextVerticalGrid;
        }
      }
    }
    // Draw the part of the wall
    var dist;
    var xOffset;
    var topOfWall; // used to find bottom of the ceiling
    var bottomOfWall; // used to find starting position of the floor

    let isWallVertical = false;
    // If horizontal wall is closer than vertical wall
    if (distToHorizontalGridBeingHit < distToVerticalGridBeingHit) {
      // Set the distance to be equal to horizontalgridhit
      dist = distToHorizontalGridBeingHit;
      xOffset = xIntersection % BLOCK_SIZE;
    }
    // else,vertical wall is closer than horizontal wall
    else {
      // Set the distance to be equal to verticalgridhit
      isWallVertical = true;
      dist = distToVerticalGridBeingHit;
      xOffset = yIntersection % BLOCK_SIZE;
    }

    // correct distance (compensate for the fishbowl effect) by correction from constant value for each angle extracted from generated table
    dist /= fishEyeCorrectionTable[castColumn];
    // projected_wall_height/wall_height = fPlayerDistToProjectionPlane/dist;
    var projectedWallHeight =
      (WALL_HEIGHT * this.player.distanceToProjectionPlane) / dist;
    bottomOfWall = PROJECTIONPLANECENTERHEIGHT + projectedWallHeight * 0.5;
    topOfWall = PROJECTIONPLANECENTERHEIGHT - projectedWallHeight * 0.5;

    dist = Math.floor(dist);
    // Draw the wall slice in the correct position

    if (isWallVertical) {
      drawWallSliceRectangle(
        castColumn,
        topOfWall,
        bottomOfWall - topOfWall + 1,
        xOffset,
        wallType - 1,
        160 / dist
      );
    } else {
      drawWallSliceRectangle(
        castColumn,
        topOfWall,
        bottomOfWall - topOfWall + 1,
        xOffset,
        wallType - 1,
        100 / dist
      );
    }

    // Trace the next ray
    castArc += 1;
    // Wrap around the ray if necessary
    if (castArc >= ANGLE360) castArc -= ANGLE360;
  }
}

/**
 *
 * @param {Number} yGridIndex - y Grid index to check
 * @param {Number} xGridIndex - x Grid index to check
 */
function checkObjects(yGridIndex, xGridIndex) {
  // Check if there is an enemy tank in the given position
  for (i = 0; i < game.mapEnemies.length; i++) {
    let xGrid = Math.floor(game.mapEnemies[i].x / BLOCK_SIZE);
    let yGrid = Math.floor(game.mapEnemies[i].y / BLOCK_SIZE);
    // If enemy tank is found and visibility flag is down, set the visibility to true and push in visibleEnemies array
    if (
      xGrid == xGridIndex &&
      yGrid == yGridIndex &&
      !game.mapEnemies[i].visible
    ) {
      game.mapEnemies[i].visible = true;
      visibleEnemies.push(game.mapEnemies[i]);
    }
  }
}
