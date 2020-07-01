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
  var timeframe = 100 - gamespeed * 10;
  if (myGameArea.frameNo == 1 || everyinterval(timeframe)) {
    createRandomObject();
  }
  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].y += 5 + gamespeed;
    myObstacles[i].update();
    if (myObstacles[i].y > 650) {
      myObstacles[i].increaseScore();
    }
  }
}

function createRandomObject() {
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
  var laneNumber = Math.floor(random * 3);
  createObstacle();

  function createObstacle() {
    var x = lanePosition[laneNumber];
    var y = -200 - gamespeed * 20;

    if (myObstacles.length > 1) {
      var prevPos = myObstacles[(obstacleNumber - 2) % 10].x;
      if (x == prevPos) {
        var randomVar = Math.round(Math.random()) == 0 ? 1 : 2;
        x = lanePosition[(laneNumber + randomVar) % 3];
      }
    }

    if (Math.floor(random * 10) == 0) {
      laneNumber = (laneNumber + Math.floor(Math.random() * 2) + 1) % 3; // Select one of the lanes other than the one with current obstacle for ammo drop
      x = lanePosition[laneNumber] - 30;
      y = -200 - gamespeed * 20;
      ammoArray.push(
        new Component(100, 100, "./images/ammo.png", x, y, "image")
      );
    } else {
      if (obstacleNumber < 10) {
        obstacleNumber++;
        myObstacles.push(
          new Component(50, 100, "./images/police-car.png", x, y, "image")
        );
      } else {
        myObstacles[obstacleNumber % 10].x = x;
        myObstacles[obstacleNumber % 10].y = y;
        myObstacles[obstacleNumber % 10].scoreFlag = false;
        obstacleNumber++;
      }
    }
  }

  if (Math.floor(Math.random() * 8) == 0) {
    laneNumber = (laneNumber + Math.floor(Math.random() * 2) + 1) % 3;
    if (checkNearbyObstacles()) {
      createObstacle();
    }
  }
}

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

function bulletsHandler() {
  userCar.updateBullet();
  bulletsList.forEach(function (bullet) {
    bullet.y -= 15 + gamespeed;
    bullet.update();
    myObstacles.forEach(function (car) {
      if (car.crashWith(bullet)) {
        car.deleteCar();
        bullet.deleteBullet();
      }
    });
  });
}

function ammoHandler() {
  ammoArray.forEach(function (ammo) {
    ammo.y += 5 + gamespeed;
    ammo.update();
    if (userCar.crashWith(ammo)) {
      bulletsCount < 8 ? bulletsCount++ : (bulletsCount = 8);
      ammo.deleteAmmo();
    }
  });
}
