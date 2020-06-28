/**
 * Create a Carousel Object
 * @param  {String} containerId - Id of the container of the carousel
 * @param  {Number} [transitionDuration = 500] - Amount of time it takes to move from one slide to another
 * @param  {Number} [holdTime = 2000] - Amount of time it holds on one slide before moving on to next slide
 * @return {Object}      Carousel Object
 */
function Carousel(containerId, tansitionDuration, holdTime) {
  // Initialize variables
  this.imageIndex = 0;
  this.imageWidth = 500;
  this.imageHeight = 300;
  this.holdTime = holdTime || 2000; // Set holdTime with default value of 2 seconds
  this.duration = tansitionDuration || 500; // Set transitionTime with default value of 0.5 seconds
  this.interval = null;
  this.containerId = "#" + containerId;
  this.carouselContainer = null;
  this.carouselImageWrapper = null;
  this.stepIncrease = 10000 / this.duration; // Amount of pixels that get shifted on each step of animation

  // Create elements buttons and dots
  this.dotsgroup = document.createElement("dotsgroup");
  this.buttonDiv = document.createElement("div");
  this.leftButton = document.createElement("button");
  this.rightButton = document.createElement("button");

  /**
   * Show the Carousel and it's elements on DOM
   */
  this.setCarousel = function () {
    // Fetch carousel divs and images from DOM
    this.carouselContainer = document.querySelector(this.containerId);
    this.carouselImageWrapper = document.querySelector(
      this.containerId + " .carousel-image-wrapper"
    );

    // Set width of image
    this.imageList = document.querySelectorAll(this.containerId + " img");
    this.imageWidth = this.imageList[0].clientWidth;

    this.carouselImageWrapper.style.width =
      this.imageList.length * this.imageWidth + this.imageWidth * 2 + "px";
    this.carouselImageWrapper.style.left = "-" + this.imageWidth + "px"; // Set the width of the images wrapper dynamically according to number of images
    this.imageList.forEach(function (image) {
      image.classList.add("carousel-image");
    }); // Add style for images to float left

    this.createButtons();
    this.createDots();

    this.lastImageClone = this.imageList[this.imageList.length - 1].cloneNode(
      true
    );
    this.carouselImageWrapper.prepend(this.lastImageClone); // Create and append the clone of last iamge on first for infinite slides
    this.firstImageClone = this.imageList[0].cloneNode(true);
    this.carouselImageWrapper.appendChild(this.firstImageClone); // Create and append the clone of first iamge on last for infinite slides
    this.autoSlider();
  }.bind(this);

  /**
   * Automatically slides to right direction.
   */
  this.autoSlider = function () {
    this.interval = setInterval(
      function () {
        this.animateSlide(this.stepIncrease, this.imageWidth);
        this.imageIndex++;
      }.bind(this),
      this.holdTime
    );
  }.bind(this);

  /**
   * Make the slider reset to wait hold time on the current slide before moving to next on clicking button or dot
   */
  this.restartSlider = function () {
    clearInterval(this.interval);
    this.autoSlider();
  }.bind(this);

  /**
   * Creates left and right button, adds images and eventlisteners on them and adds on DOM
   */
  this.createButtons = function () {
    this.leftButton.innerHTML =
      '<img src="./images/left.png" alt="left button">';
    this.leftButton.classList.add("button__carousel", "button-left");
    this.rightButton.innerHTML =
      '<img src="./images/right.png" alt="Right button">';
    this.rightButton.classList.add("button__carousel", "button-right");
    this.buttonDiv.classList.add("button__group");

    this.buttonDiv.appendChild(this.leftButton);
    this.buttonDiv.appendChild(this.rightButton);
    this.carouselContainer.appendChild(this.buttonDiv);

    // Add listeners on button to start slide on click
    this.leftButton.addEventListener("click", this.startSlideLeft);
    this.rightButton.addEventListener("click", this.startSlideRight);
  };

  /**
   * Creates dots and puts them on the DOM
   */
  this.createDots = function () {
    var self = this;
    this.dotsgroup.classList.add("dotsgroup");
    var dotsNumber = this.imageList.length; // Dynamically calculate number of dots to create

    this.dotsgroup.style.marginLeft = -(dotsNumber * 20) / 2 + "px"; // Place the dots to the middle of image
    var dots = []; // Array that contains dot elements

    for (var i = 0; i < dotsNumber; i++) {
      dots[i] = document.createElement("span");
      dots[i].classList.add("dot"); // Add styling for the dot element
      dots[i].setAttribute("id", i + "-dot"); // Add id for selecting them
      dots[i].addEventListener(
        "click",
        function () {
          var index = parseInt(this.getAttribute("id"));
          self.animatefromDots(index); // Animate to the slide of the dot clicked
          self.imageIndex = index;
        } // Add eventlistener to slide on click
      );
      this.dotsgroup.appendChild(dots[i]);
    }
    this.dotsgroup.firstChild.classList.add("active-dot"); // Make first dot as active at the start
    this.carouselContainer.appendChild(this.dotsgroup);
  }.bind(this);

  /**
   * Animate to slide to one image left
   */
  this.startSlideLeft = function () {
    this.animateSlide(-this.stepIncrease, this.imageWidth);
    this.imageIndex--;
    this.restartSlider();
  }.bind(this);

  /**
   * Animate to slide to one image right
   */
  this.startSlideRight = function () {
    this.animateSlide(this.stepIncrease, this.imageWidth);
    this.imageIndex++;
    this.restartSlider();
  }.bind(this);

  /**
   * Slide the image from one to another using animation
   * @param  {Number} stepIncrease - Amount of pixels that get shifted on each step of animation
   * @param  {Number} max - Total amount of pixels that need to be shifted
   */
  this.animateSlide = function (stepIncrease, max) {
    var self = this;
    var currentPosition = -this.imageWidth - this.imageIndex * this.imageWidth; // Calculate the static position of slide after the animation finishes on current slide
    var animationAmount = 0;

    /**
     * Function that gets called recursively to create animation
     */
    function step() {
      animationAmount += stepIncrease;

      // Slide left gradually if stepIncrease is negative
      if (stepIncrease > 0) {
        self.carouselImageWrapper.style.left =
          currentPosition - Math.min(animationAmount, max) + "px";
        if (Math.min(animationAmount, max) == max) {
          resetOnAnimationEnd(); // Resets dots and creates infinite slide effect
        } else {
          window.requestAnimationFrame(step);
        }
      }

      // Slide right gradually if stepIncrease is positive
      if (stepIncrease < 0) {
        self.carouselImageWrapper.style.left =
          currentPosition - Math.max(animationAmount, -max) + "px";
        if (Math.max(animationAmount, -max) == -max) {
          resetOnAnimationEnd(); // Resets dots and creates infinite slide effect
        } else {
          window.requestAnimationFrame(step);
        }
      }

      // Tasks to do after animation finishes
      function resetOnAnimationEnd() {
        // Move to last image on slide left from first
        if (self.imageIndex < 0) {
          self.imageIndex = self.imageList.length - 1;
          self.carouselImageWrapper.style.left =
            self.imageList.length * -self.imageWidth + "px";
        }

        // Move to first image on slide right from last
        if (self.imageIndex > self.imageList.length - 1) {
          self.imageIndex = 0;
          self.carouselImageWrapper.style.left = -self.imageWidth + "px";
        }
        self.resetDots(); // Reset the dots
      }
    }

    window.requestAnimationFrame(step); // Start the animation
  }.bind(this);

  /**
   * Create animation when the dots are clicked
   * @param  {Number} index - Dot or slide number
   */
  this.animatefromDots = function (index) {
    var step = (index - this.imageIndex) * this.stepIncrease;
    var max = Math.abs(index - this.imageIndex) * this.imageWidth;
    this.animateSlide(step, max);
    this.restartSlider();
  }.bind(this);

  /**
   * Resets dots on click of left and right button
   */
  this.resetDots = function () {
    this.dotsgroup.childNodes.forEach((dot) =>
      dot.classList.remove("active-dot")
    ); // Remove active-dot class from all dots
    var dot = this.dotsgroup.childNodes[this.imageIndex];
    dot.classList.add("active-dot"); // Add active-dot class to selected dot
  }.bind(this);

  this.setCarousel(); // Set the carousel, buttons and dots
}
