/**
 * Draws the ceiling and floor of the 3D environment
 */
export function drawBackground() {
  // Initialize the color value to use to change color according to distance from user and step which is the number of pixels it paints in y direction at a time
  let color = 255;
  let row;
  let step = 4;
  // Paint the ceiling
  for (row = 0; row < PROJECTIONPLANEHEIGHT / 2; row += step) {
    drawFillRectangle(0, row, PROJECTIONPLANEWIDTH, step, color / 2, color, 255, 255);
    color -= step * 2;
  }
  // Paint the floor
  color = 40;
  for (; row < PROJECTIONPLANEHEIGHT; row += step) {
    drawFillRectangle(0, row, PROJECTIONPLANEWIDTH, step, 0, color / 2, 0, 255);
    color += step;
  }
}

/**
 * Draws a single line on the canvas
 * @param {Number} startX Starting X position for the line
 * @param {Number} startY Starting Y position for the line
 * @param {Number} endX Ending X position for the line
 * @param {Number} endY Ending Y position for the line
 * @param {Number} red red value for color in rgba format , i.e- between 0 to 255
 * @param {Number} green green value for color in rgba format , i.e- between 0 to 255
 * @param {Number} blue blue value for color in rgba format , i.e- between 0 to 255
 * @param {Number} alpha alpha value(opacity) for color in rgba format , i.e- between 0 to 255
 */
export function drawLine(startX, startY, endX, endY, red, green, blue, alpha) {

  // Changes in x and y
  let xIncrement, yIncrement;


  // Calculate Y distance	between starting and end point
  let dy = endY - startY;

  // If the y value is negative, i.e- the line is going upwards	
  if (dy < 0) {
    // get abs
    dy = -dy;
    // Movement in negative direction
    yIncrement = -game.hiddenCanvasPixels.width * BYTESPERPIXEL;
  }
  // If line going downwards
  else
    yIncrement = game.hiddenCanvasPixels.width * BYTESPERPIXEL;

  // Calculate X distance	between starting and end point	                  
  let dx = endX - startX;

  // If X value is negative, i.e- the line is going towards left
  if (dx < 0) {
    dx = -dx;
    xIncrement = -BYTESPERPIXEL;
  }
  // If line going towards right
  else
    xIncrement = BYTESPERPIXEL;

  let error = 0;
  let targetIndex = (BYTESPERPIXEL * game.hiddenCanvasPixels.width) * startY + (BYTESPERPIXEL * startX); // Desired column + desired row in the pixel data

  // If X direction has more change in value , then draw each row one by one
  if (dx > dy) {
    let length = dx;

    // For each row
    for (let i = 0; i < length; i++) {
      if (targetIndex < 0)
        break;

      // Set the color values , i.e- r,g,b and alpha value in the target pixel of hidden Canvas
      game.hiddenCanvasPixels.data[targetIndex] = red;
      game.hiddenCanvasPixels.data[targetIndex + 1] = green;
      game.hiddenCanvasPixels.data[targetIndex + 2] = blue;
      game.hiddenCanvasPixels.data[targetIndex + 3] = alpha;

      // Select next pixel
      targetIndex += xIncrement;
      // Accumulate error
      error += dy;

      // When error exceeds or equals the X distance to draw , then this row is finished drawing                 
      if (error >= dx) {
        // Reduce dy value from error
        error -= dx;
        // Select target pixel from next row
        targetIndex += yIncrement;
      }
    }
  }
  // If Y direction has more change in value(or both are equal) , then draw each row one by one
  else  // (dx<=dy)
  {
    let length = dy;

    // For each column
    for (let i = 0; i < length; i++) {
      if (targetIndex < 0)
        break;

      // Set the color values , i.e- r,g,b and alpha value in the target pixel of hidden Canvas
      game.hiddenCanvasPixels.data[targetIndex] = red;
      game.hiddenCanvasPixels.data[targetIndex + 1] = green;
      game.hiddenCanvasPixels.data[targetIndex + 2] = blue;
      game.hiddenCanvasPixels.data[targetIndex + 3] = alpha;

      // Select next pixel
      targetIndex += yIncrement;

      // Accumulate error
      error += dx;

      // When error exceeds or equals the Y distance to draw , then this column is finished drawing                 
      if (error >= dy) {
        // Reduce dy value from error amount
        error -= dy;
        // Select target pixel from next column
        targetIndex += xIncrement;
      }
    }
  }
}

/**
 * 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} width 
 * @param {Number} height 
 * @param {Number} xOffset 
 */
export function drawWallSliceRectangle(x, y, width, height, xOffset) {

  // Wait until the image loads
  if (game.wallImageBuffer == undefined)
    return;

  // Convert x,y and offset values to rounded down integers
  x = Math.floor(x);
  y = Math.floor(y);
  xOffset = Math.floor(xOffset);

  // First sourceIndex(pixel position) for the wall slice to be drawn
  let sourceIndex = (BYTESPERPIXEL * xOffset);
  // Last sourceIndex(pixel position) for the wall slice to be drawn
  let lastSourceIndex = sourceIndex + (game.wallImageBuffer.width * game.wallImageBuffer.height * BYTESPERPIXEL);

  // Destination index(pixel position) for the wall slice which is to be drawn
  let targetIndex = (game.hiddenCanvasPixels.width * BYTESPERPIXEL) * y + (BYTESPERPIXEL * x);

  // The height of the image to be drawn
  let heightToDraw = height;
  // Clip the height if the height exceeds the height of the hidden canvas
  if (y + heightToDraw > game.hiddenCanvasPixels.height)
    heightToDraw = game.hiddenCanvasPixels.height - y;


  let yError = 0;

  while (true) {

    // This error term is used to check if we need to copy some pixels multiple times or skip some pixels
    // Add height to the errorterm
    yError += height;


    // Get r,g,b,a values from the source pixel
    let red = Math.floor(game.wallPixels[sourceIndex]);
    let green = Math.floor(game.wallPixels[sourceIndex + 1]);
    let blue = Math.floor(game.wallPixels[sourceIndex + 2]);
    let alpha = Math.floor(game.wallPixels[sourceIndex + 3]);

    // For this column , keep drawing each row , until the end of drawing area, or all rows finished
    while (yError >= game.wallImageBuffer.width) {
      // Reduce the actial image width from the buffer from error term 
      yError -= game.wallImageBuffer.width;

      // Set pixel information on the destination pixel
      game.hiddenCanvasPixels.data[targetIndex] = red;
      game.hiddenCanvasPixels.data[targetIndex + 1] = green;
      game.hiddenCanvasPixels.data[targetIndex + 2] = blue;
      game.hiddenCanvasPixels.data[targetIndex + 3] = alpha;

      // Select next destination index
      targetIndex += (BYTESPERPIXEL * game.hiddenCanvasPixels.width);

      // Clip bottom (return if we reach bottom, i.e- wall slice finished drawing)
      heightToDraw--;
      if (heightToDraw < 1)
        return;
    }

    // Select next source index and limit the sourceindex at last source index
    sourceIndex += (BYTESPERPIXEL * game.wallImageBuffer.width);
    if (sourceIndex > lastSourceIndex)
      sourceIndex = lastSourceIndex;
  }

}

/**
 * 
 * @param {Number} x x co-ordinate from which drawing of rectangle starts
 * @param {Number} y y co-ordinate from which drawing of rectangle starts
 * @param {Number} width width of the rectangle
 * @param {Number} height height of the rectangle
 * @param {Number} red red value for color in rgba format , i.e- between 0 to 255
 * @param {Number} green green value for color in rgba format , i.e- between 0 to 255
 * @param {Number} blue blue value for color in rgba format , i.e- between 0 to 255
 * @param {Number} alpha alpha value (opacity) for color in rgba format , i.e- between 0 to 255
 */
export function drawFillRectangle(x, y, width, height, red, green, blue, alpha) {

  // Select targetindex from the hiddencanvas that needs to be painted
  var targetIndex = (BYTESPERPIXEL * game.hiddenCanvasPixels.width) * y + (BYTESPERPIXEL * x);
  // Iterate for all pixels from the starting x,y position for entire width and height of rectangle
  for (var h = 0; h < height; h++) {
    for (var w = 0; w < width; w++) {
      // Fill the specific pixel with given color and alpha attributes
      game.hiddenCanvasPixels.data[targetIndex] = red;
      game.hiddenCanvasPixels.data[targetIndex + 1] = green;
      game.hiddenCanvasPixels.data[targetIndex + 2] = blue;
      game.hiddenCanvasPixels.data[targetIndex + 3] = alpha;
      // Select the next target pixel in current row
      targetIndex += BYTESPERPIXEL;
    }
    // Select the next target pixel by moving to next row
    targetIndex += (BYTESPERPIXEL * (game.hiddenCanvasPixels.width - width));
  }
}