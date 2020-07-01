/**
 * Updates the obstacles position or creates them if needed
 */
function obstacleHandler() {
  // Loop through all the obstacles
  for (i = 0; i < myObstacles.length; i += 1) {
    // Check if the obstacle Car collides with userCar
    if (userCar.crashWith(myObstacles[i])) {
      //Set the score on Endscreen
      score.innerHTML = "" + scoreCount;

      // Fetch the bestscore from localstorage and update if needed
      var prevBest = parseInt(localStorage.getItem("score"));
      scoreCount = prevBest > scoreCount ? prevBest : scoreCount;
      bestscore.innerHTML = "" + scoreCount;
      localStorage.setItem("score", scoreCount);
      endContainer.style.display = "block";
      myGameArea.stop();
      return;
    }
  }
  myGameArea.frameNo += 1;
  var timeframe = 100 - gamespeed * 10; // Update the timeframe according to game speed to spawn cars faster

  // Create an obstacle in every timeframe number of frame
  if (myGameArea.frameNo == 1 || everyinterval(timeframe)) {
    createRandomObject();
  }

  // Update the position of obstacles on the screen
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].y += 5 + gamespeed;
    myObstacles[i].update();
    if (myObstacles[i].y > 650) {
      myObstacles[i].increaseScore();
    }
  }
}

/**
 * Creates an obstacle on the road
 */
function createRandomObject() {
  // Leave one position blank to indicate change in speed of game or level which happens in every 10 obstacle until 70
  if (
    obstacleNumber == 10 ||
    obstacleNumber == 20 ||
    obstacleNumber == 30 ||
    obstacleNumber == 40 ||
    obstacleNumber == 50 ||
    obstacleNumber == 60 ||
    obstacleNumber == 70
  ) {
    obstacleNumber++;
    return;
  }

  var random = Math.random();
  var laneNumber = Math.floor(random * 3); // Choose a random lane
  createObstacle(); // create an obstacle

  /**
   * Creates an obstacle
   */
  function createObstacle() {
    var x = lanePosition[laneNumber]; // x co-ordinate for obstacle according to the random lane selected
    var y = -200 - gamespeed * 20; // y co-ordinate which is calculated according to gamespeed

    if (myObstacles.length > 1) {
      var prevPos = myObstacles[(obstacleNumber - 2) % 10].x;
      // If there are more than two obstacle in same ane already, choost another lane
      if (x == prevPos) {
        var randomVar = Math.round(Math.random()) == 0 ? 1 : 2;
        x = lanePosition[(laneNumber + randomVar) % 3];
      }
    }

    // Create an ammodrop instead of obstacle with a probability of 1/10
    if (Math.floor(random * 10) == 0) {
      laneNumber = (laneNumber + Math.floor(Math.random() * 2) + 1) % 3; // Choose another lane
      x = lanePosition[laneNumber] - 30; // Set the x position to be on centre
      y = -200 - gamespeed * 20;
      ammoArray.push(
        new Component(100, 100, "./images/ammo.png", x, y, "image")
      );
    } else {
      // create new obstacle if number of obstacles is less than 10
      if (obstacleNumber < 10) {
        obstacleNumber++;
        myObstacles.push(
          new Component(50, 100, "./images/police-car.png", x, y, "image")
        );
      }
      // Reposition old obstacle if number of obstacle is more than 10
      else {
        myObstacles[obstacleNumber % 10].x = x;
        myObstacles[obstacleNumber % 10].y = y;
        myObstacles[obstacleNumber % 10].scoreFlag = false;
        obstacleNumber++;
      }
    }
  }

  // Create second obstacle in the same x position as first obstacle with probability 1/8
  if (Math.floor(Math.random() * 8) == 0) {
    laneNumber = (laneNumber + Math.floor(Math.random() * 2) + 1) % 3;
    // Minimize unfair situations
    if (checkNearbyObstacles()) {
      createObstacle();
    }
  }
}

// Check for unfair situation with userCar stuck
function checkNearbyObstacles() {
  if (myObstacles.length > 2) {
    var prevPos = myObstacles[(obstacleNumber - 2) % 10].x;
    var twoPrev = myObstacles[(obstacleNumber - 3) % 10].x;
    if (prevPos == lanePosition[0] && twoPrev == lanePosition[1]) {
      return false;
    } else if (prevPos == lanePosition[2] && twoPrev == lanePosition[1]) {
      return false;
    } else if (prevPos == lanePosition[1] && twoPrev == lanePosition[1]) {
      return false;
    }
  }
  return true;
}

/**
 * update bullet and check if the bullet hits obstacle
 */
function bulletsHandler() {
  userCar.updateBullet();
  bulletsList.forEach(function (bullet) {
    bullet.y -= 15 + gamespeed;
    bullet.update();
    myObstacles.forEach(function (car) {
      if (car.crashWith(bullet)) {
        car.deleteCar(); // Delete obstacle when hit by bullet
        bullet.deleteBullet(); // Delete bullet on colliding with obstacle
      }
    });
  });
}

/**
 * Update ammo and check if ammo hits userCar
 */
function ammoHandler() {
  ammoArray.forEach(function (ammo) {
    ammo.y += 5 + gamespeed;
    ammo.update();
    if (userCar.crashWith(ammo)) {
      bulletsCount < 8 ? bulletsCount++ : (bulletsCount = 8); // If ammo hits userCar increase the bullet number by 1 maintaining 8 as maximum number of bullets
      ammo.deleteAmmo(); // Delete ammo on hitting the user Car
    }
  });
}
