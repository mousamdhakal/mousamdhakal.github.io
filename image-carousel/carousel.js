/**
 * Create a Carousel Object, Call Carousel.setCarousel to paint on DOM
 * @param  {Number} transitionDuration  Amount of time it takes to move from one slide to another
 * @return {Object}      Carousel Object
 */
function Carousel(tansitionDuration) {
  // Initialize variables
  this.imageIndex = 0;
  this.duration = tansitionDuration;
  this.stepIncrease = 10000 / this.duration; // amount of pixels that get shifted on each step of animation

  // Fetch carousel divs and images from DOM
  const carouselContainer = document.querySelector(".carousel-container");
  const carouselImageWrapper = document.querySelector(
    ".carousel-image-wrapper"
  );
  this.imageList = document.querySelectorAll(".carousel-image-wrapper img");

  // Create elements buttons and dots
  const dotsgroup = document.createElement("dotsgroup");
  const buttonDiv = document.createElement("div");
  const leftButton = document.createElement("button");
  const rightButton = document.createElement("button");

  /**
   * Show the Carousel and it's elements on DOM
   */
  this.setCarousel = function () {
    carouselImageWrapper.style.width =
      this.imageList.length * 500 + 1000 + "px";
    carouselImageWrapper.style.left = "-500px"; // Set the width of the images wrapper dynamically according to number of images
    this.imageList.forEach(function (image) {
      image.classList.add("carousel-image");
    }); // Add style for images to float left
    this.createButtons();
    this.createDots();
    this.lastImageClone = this.imageList[this.imageList.length - 1].cloneNode(
      true
    );
    carouselImageWrapper.prepend(this.lastImageClone); //Create and append the clone of last iamge on first for infinite slides
    this.firstImageClone = this.imageList[0].cloneNode(true);
    carouselImageWrapper.appendChild(this.firstImageClone); //Create and append the clone of first iamge on last for infinite slides
  }.bind(this);

  /**
   * Creates left and right button, adds images and eventlisteners on them and adds on DOM
   */
  this.createButtons = function () {
    leftButton.innerHTML = '<img src="./images/left.png" alt="left button">';
    leftButton.classList.add("button__carousel", "button-left");
    rightButton.innerHTML = '<img src="./images/right.png" alt="Right button">';
    rightButton.classList.add("button__carousel", "button-right");
    buttonDiv.classList.add("button__group");
    buttonDiv.appendChild(leftButton);
    buttonDiv.appendChild(rightButton);
    carouselContainer.appendChild(buttonDiv);

    leftButton.addEventListener("click", this.startSlideLeft);
    rightButton.addEventListener("click", this.startSlideRight);
  };

  /**
   * Creates dots and puts them on the DOM
   */
  this.createDots = function () {
    dotsgroup.classList.add("dotsgroup");
    const dotsNumber = this.imageList.length;
    for (let i = 0; i < dotsNumber; i++) {
      let dot = document.createElement("span");
      dot.classList.add("dot"); // Add styling for the dot element
      dot.setAttribute("id", i + "-dot"); // Add id for selecting them
      dot.addEventListener(
        "click",
        function () {
          let index = parseInt(dot.getAttribute("id"));
          this.animatefromDots(index); // Animate to the slide of the dot clicked
          this.imageIndex = index;
        }.bind(this) // Add eventlistener to slide on click
      );
      dotsgroup.appendChild(dot);
    }
    dotsgroup.firstChild.classList.add("active-dot"); // Make first dot as active at the start
    carouselContainer.appendChild(dotsgroup);
  }.bind(this);

  /**
   * Animate to slide to one image left
   */
  this.startSlideLeft = function () {
    this.imageIndex--;
    this.disableButtons(); //Disable buttons while animation is running
    this.animateSlide(-this.stepIncrease, 500);
  }.bind(this);

  /**
   * Animate to slide to one image right
   */
  this.startSlideRight = function () {
    this.imageIndex++;
    this.disableButtons(); //Disable buttons while animation is running
    this.animateSlide(this.stepIncrease, 500);
  }.bind(this);

  /**
   * Slide the image from one to another using animation
   * @param  {Number} stepIncrease  Amount of pixels that get shifted on each step of animation
   * @param  {Number} max  Total amount of pixels that need to be shifted
   */
  this.animateSlide = function (stepIncrease, max) {
    const self = this; //Reference this object as self
    let currentPosition = parseFloat(carouselImageWrapper.style.left); //Calculate current position of the slide
    let animationAmount = 0;
    let start;

    /**
     * Function that gets called recursively to create animation
     * @param  {Number} timestamp  Current time
     */
    function step(timestamp) {
      if (start === undefined) start = timestamp;
      const elapsed = timestamp - start;

      animationAmount += stepIncrease;

      //Slide left gradually if stepIncrease is negative
      if (stepIncrease > 0) {
        carouselImageWrapper.style.left =
          currentPosition - Math.min(animationAmount, max) + "px";
      }

      //Slide right gradually if stepIncrease is positive
      if (stepIncrease < 0) {
        carouselImageWrapper.style.left =
          currentPosition - Math.max(animationAmount, -max) + "px";
      }

      //Recusrive call to animate during the duration of animation
      if (elapsed < self.duration) {
        window.requestAnimationFrame(step);
      }

      // Tasks to do after animation finishes
      if (elapsed > self.duration) {
        self.enableButtons(); //enable buttons

        //Move to last image on slide left from first
        if (self.imageIndex < 0) {
          self.imageIndex = self.imageList.length - 1;
          carouselImageWrapper.style.left = self.imageList.length * -500 + "px";
        }

        //Move to first image on slide right from last
        if (self.imageIndex > self.imageList.length - 1) {
          self.imageIndex = 0;
          carouselImageWrapper.style.left = "-500px";
        }
        self.resetDots(); //Reset the dots
      }
    }

    window.requestAnimationFrame(step); //Start the animation
  }.bind(this);

  /**
   * Create animation when the dots are clicked
   * @param  {Number} index  Dot or slide number
   */
  this.animatefromDots = function (index) {
    let step = (index - this.imageIndex) * this.stepIncrease;
    let max = Math.abs(index - this.imageIndex) * 500;
    this.animateSlide(step, max);
  }.bind(this);

  /**
   * Resets dots on click of left and right button
   */
  this.resetDots = function () {
    dotsgroup.childNodes.forEach((dot) => dot.classList.remove("active-dot")); //Remove active-dot class from all dots
    var dot = document.getElementById(this.imageIndex + "-dot");
    dot.classList.add("active-dot"); // Add active-dot class to selected dot
  }.bind(this);

  /**
   * Disable buttons
   */
  this.disableButtons = function () {
    leftButton.setAttribute("disabled", true);
    rightButton.setAttribute("disabled", true);
  };

  /**
   * Enable buttons
   */
  this.enableButtons = function () {
    leftButton.removeAttribute("disabled");
    rightButton.removeAttribute("disabled");
  };
}
