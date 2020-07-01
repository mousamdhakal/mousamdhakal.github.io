//Initialize variables for the game

var lanePosition = [75, 225, 375]; // The positions for the cars , bullets and obstacles to exist
var carPosition = 1; // current position of the player's car
var myObstacles = []; // Array containing the obstacles
var obstacleNumber = 0; // Number of obstacles created from the start till now
var userCar = null; // Car of the player
var myScore = null;
var myBullet = null;
var scoreCount = 0;
var myBackground = null;
var speedtoAdd = null;
var gamespeed = 0;
var mainContainer = document.getElementById("main");
var startContainer = document.getElementById("start-wrapper");
var score = document.getElementById("score");
var bestscore = document.getElementById("bestscore");
var endContainer = document.getElementById("end-wrapper");
var bulletsList = [];
var bulletsCount = 3;
var ammoArray = [];

/**
 * Start the game by initializing the user and background
 */
function startGame() {
  // Fetch usercar
  userCar = new Component(
    50,
    100,
    "./images/user-car.png",
    lanePosition[carPosition],
    550,
    "image"
  );

  //Fetch road
  myBackground = new Component(
    500,
    700,
    "./images/road.png",
    0,
    0,
    "background"
  );

  //Setup score and bullet and hide the start screen
  myScore = new Component("20px", "Consolas", "white", 350, 40, "text");
  myBullet = new Component("20px", "Consolas", "White", 40, 40, "text");
  startContainer.style.display = "none";
  myGameArea.start();
}

// GameArea object which setsup canvas
var myGameArea = {
  // Create canvas
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = 500;
    this.canvas.height = 700;
    this.canvas.classList.add("center");
    this.frameNo = 0;
    this.context = this.canvas.getContext("2d");
    mainContainer.appendChild(this.canvas);

    // Main function to update the game every 20 ms, i.e- 50 frames per second.
    this.interval = setInterval(updateGameArea, 20);

    // Add eventlistener to get keyboard keys
    document.addEventListener("keydown", function (e) {
      myGameArea.key = e.keyCode;
    });
    document.addEventListener("keyup", function (e) {
      myGameArea.key = false;
    });
  },

  // Clear the canvas
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },

  // Stop the game
  stop: function () {
    clearInterval(this.interval);
  },
};

// Returns true if framnumber corresponds with given interval
function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

// Function that gets called 50 times per second to update the canvas.
function updateGameArea() {
  // Clear game area and increase the frame number
  myGameArea.clear();
  myGameArea.frameNo += 1;

  // Move car to left and right on pressing arrow keys
  if (myGameArea.key && myGameArea.key == 37) {
    if (carPosition < 0) {
      carPosition = 0;
    }
    userCar.animateCar(lanePosition[carPosition], -1);
  }
  if (myGameArea.key && myGameArea.key == 39) {
    if (carPosition > 2) {
      carPosition = 2;
    }
    userCar.animateCar(lanePosition[carPosition], 1);
  }

  // Fire bullet on pressing spacebar
  if (myGameArea.key && myGameArea.key == 32) {
    userCar.fireBullet();
  }

  // Update the score and bullet text
  myScore.text = "SCORE: " + scoreCount;
  myBullet.text = "Bullets: " + bulletsCount;

  // Calculate the gamespeed which is increased after every 10 obstacles by 1 where 7 being the maximum gamespeed
  speedtoAdd = Math.floor(obstacleNumber / 10);
  gamespeed = speedtoAdd < 7 ? speedtoAdd : 7;

  // Move the background image of road
  myBackground.speedY = 10 + gamespeed;
  myBackground.newPos();
  myBackground.update();

  // Update userCar position for case of movement
  userCar.newPos();
  userCar.update();

  // Handles the obstacles, bullets and ammo on each iteration
  obstacleHandler();
  bulletsHandler();
  ammoHandler();

  // Update the score and bullet number on cavas
  myScore.update();
  myBullet.update();
}

/**
 * Restart the game
 */
function restartGame() {
  carPosition = 1;
  myObstacles = [];
  obstacleNumber = 0;
  userCar;
  myScore;
  myBullet;
  scoreCount = 0;
  myBackground;
  speedtoAdd;
  gamespeed = 0;
  bulletsList = [];
  bulletsCount = 3;
  ammoArray = [];
  myGameArea.canvas.parentElement.removeChild(myGameArea.canvas);
  endContainer.style.display = "none";
  startGame();
}
