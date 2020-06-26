function Carousel(tansitionDuration) {
  this.imageIndex = 0;
  this.duration = tansitionDuration;
  this.stepIncrease = 10000 / this.duration;

  const carouselContainer = document.querySelector(".carousel-container");
  const carouselImageWrapper = document.querySelector(
    ".carousel-image-wrapper"
  );

  this.imageList = document.querySelectorAll(".carousel-image-wrapper img");
  const dotsgroup = document.createElement("dotsgroup");
  const buttonDiv = document.createElement("div");
  const leftButton = document.createElement("button");
  const rightButton = document.createElement("button");

  this.setCarousel = function () {
    carouselImageWrapper.style.width =
      this.imageList.length * 500 + 1000 + "px";
    carouselImageWrapper.style.left = "-500px";
    this.imageList.forEach(function (image) {
      image.classList.add("carousel-image");
    });
    this.createButtons();
    this.createDots();
    this.lastImageClone = this.imageList[this.imageList.length - 1].cloneNode(
      true
    );
    carouselImageWrapper.prepend(this.lastImageClone);
    this.firstImageClone = this.imageList[0].cloneNode(true);
    carouselImageWrapper.appendChild(this.firstImageClone);
  }.bind(this);

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

  this.createDots = function () {
    dotsgroup.classList.add("dotsgroup");
    const dotsNumber = this.imageList.length;
    for (let i = 0; i < dotsNumber; i++) {
      let dot = document.createElement("span");
      dot.classList.add("dot");
      dot.setAttribute("id", i + "-dot");
      dot.addEventListener(
        "click",
        function () {
          dotsgroup.childNodes.forEach((dot) =>
            dot.classList.remove("active-dot")
          );
          dot.classList.add("active-dot");
          let index = parseInt(dot.getAttribute("id"));
          this.animatefromDots(index);
          this.imageIndex = index;
        }.bind(this)
      );
      dotsgroup.appendChild(dot);
    }
    dotsgroup.firstChild.classList.add("active-dot");
    carouselContainer.appendChild(dotsgroup);
  }.bind(this);

  this.resetDots = function () {
    dotsgroup.childNodes.forEach((dot) => dot.classList.remove("active-dot"));
    var dot = document.getElementById(this.imageIndex + "-dot");
    dot.classList.add("active-dot");
  }.bind(this);

  this.disableButtons = function () {
    leftButton.setAttribute("disabled", true);
    rightButton.setAttribute("disabled", true);
  };

  this.enableButtons = function () {
    leftButton.removeAttribute("disabled");
    rightButton.removeAttribute("disabled");
  };

  this.startSlideLeft = function () {
    this.imageIndex--;
    this.disableButtons();
    this.animateSlide(-this.duration, -this.stepIncrease, 500);
  }.bind(this);

  this.startSlideRight = function () {
    this.imageIndex++;
    this.disableButtons();
    this.animateSlide(this.duration, this.stepIncrease, 500);
  }.bind(this);

  this.animateSlide = function (duration, stepIncrease, max) {
    const self = this;
    let currentPosition = parseFloat(carouselImageWrapper.style.left);
    let animationAmount = 0;
    let start;
    // let interval = setInterval(function () {
    //   animationAmount += step;
    //   carouselImageWrapper.style.left = currentPosition - animationAmount + "px";
    //   if (animationAmount == 500 || animationAmount == -500) {
    //     clearInterval(interval);
    //     return;
    //   }
    // }, 1000 / 60);

    function step(timestamp) {
      if (start === undefined) start = timestamp;
      const elapsed = timestamp - start;

      animationAmount += stepIncrease;
      if (stepIncrease > 0) {
        carouselImageWrapper.style.left =
          currentPosition - Math.min(animationAmount, max) + "px";
      }
      if (stepIncrease < 0) {
        carouselImageWrapper.style.left =
          currentPosition - Math.max(animationAmount, -max) + "px";
      }

      if (elapsed < Math.abs(duration)) {
        window.requestAnimationFrame(step);
      }

      if (elapsed > Math.abs(duration)) {
        self.enableButtons();
        if (self.imageIndex < 0) {
          self.imageIndex = self.imageList.length - 1;
          carouselImageWrapper.style.left = self.imageList.length * -500 + "px";
        }
        if (self.imageIndex > self.imageList.length - 1) {
          self.imageIndex = 0;
          carouselImageWrapper.style.left = "-500px";
        }
        self.resetDots();
      }
    }

    window.requestAnimationFrame(step);
  }.bind(this);

  this.animatefromDots = function (index) {
    let step = (index - this.imageIndex) * this.stepIncrease;
    let max = Math.abs(index - this.imageIndex) * 500;
    this.animateSlide(this.duration, step, max);
  }.bind(this);
}
