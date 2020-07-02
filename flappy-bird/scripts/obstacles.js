/**
 * Handles the creation and update of obstacles
 * @param {Object} parent - Instance of game from which the function is called
 */
function obstacleHandler(parent) {
  // Create a new obstacle on every 200 frames
  if (parent.frameNo == 1 || parent.everyInterval(200)) {
    x = parent.canvas.width;
    height = Math.floor(
      Math.random() * (MAXHEIGHT - MINHEIGHT + 1) + MINHEIGHT
    );
    // create new obstacle if number of obstacles is less than 10

    if (parent.obstacleNumber < 8) {
      parent.obstaclesList.push(
        new Component(
          84,
          502,
          this.img,
          x,
          PIPE_OFFSET - height,
          parent,
          'image',
          87,
          503,
          42,
          251
        )
      );
      parent.obstacleNumber++;
      parent.obstaclesList.push(
        new Component(
          84,
          501,
          this.img,
          x,
          GAP - height,
          parent,
          'image',
          43,
          503,
          42,
          251
        )
      );
      parent.obstacleNumber++;
    }
    // Reposition old obstacle if number of obstacle is more than 10
    else {
      var index = parent.obstacleNumber % 8;
      parent.obstaclesList[index].x = x;
      parent.obstaclesList[index].y = PIPE_OFFSET - height;
      parent.obstacleNumber++;
      parent.obstaclesList[index + 1].x = x;
      parent.obstaclesList[index + 1].y = GAP - height;
      parent.obstacleNumber++;
    }
  }
  // Update obstacle position on canvas
  for (i = 0; i < parent.obstaclesList.length; i++) {
    parent.obstaclesList[i].x += -1;
    parent.obstaclesList[i].update(parent);
  }
}
