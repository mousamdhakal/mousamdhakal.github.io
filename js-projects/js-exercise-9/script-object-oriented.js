var main = document.getElementById('main');

function AnimateCircle(direction,dimension,circleDimension,backgroundColor,color,speed){
  this.container = document.createElement('div');
  this.circle = document.createElement('div');
  this.direction = direction;
  this.dimension = dimension;
  this.circleDimension = circleDimension;
  this.backgroundColor = backgroundColor;
  this.color = color;
  this.speed = speed;
  this.maxPos = this.dimension - this.circleDimension;

  this.paintContainer = function(){
    let container = this.container;
    container.style.border = '1px solid black';
    container.style.width = '' + this.dimension + 'px';
    container.style.height = '' + this.dimension + 'px';
    container.style.position = 'relative';
    container.style.display = 'inline-block';
    container.style.backgroundColor = this.backgroundColor;
    main.appendChild(container);
  };

  this.paintCircle = function(){
    let circle = this.circle;
    circle.style.height= this.circleDimension + 'px';
    circle.style.width= this.circleDimension + 'px';
    circle.style.backgroundColor= this.color;
    circle.style.borderRadius = '50%';
    circle.style.position = 'absolute';
    this.container.appendChild(circle);
    if(this.direction == 'x'){
      circle.style.left = '0px';
      circle.style.top = '' + (this.dimension)/2 + 'px';
      this.animatex();
    } else {
      circle.style.left ='' + (this.dimension)/2 + 'px';
      circle.style.top = '0px';
      this.animatey();
    }
  }

  this.animatey = function(){
    let circlePos = parseInt(this.circle.style.top);
    circlePos +=this.speed;
    this.circle.style.top = circlePos + 'px';
    if(circlePos <=0||circlePos>=this.maxPos){
      this.speed*= -1;
    }
    window.requestAnimationFrame(this.animatey)
  }.bind(this);

  this.animatex = function(){
    let circlePos = parseInt(this.circle.style.left);
    circlePos +=this.speed;
    this.circle.style.left = circlePos + 'px';
    if(circlePos <=0||circlePos>=this.maxPos){
      this.speed*= -1;
    }
    window.requestAnimationFrame(this.animatex)
  }.bind(this);
}

function createAnimation(){
  var animation1 = new AnimateCircle('y',300,20,'#fff','#111',5);
  animation1.paintContainer();
  animation1.paintCircle();
  var animation2 = new AnimateCircle('x',300,20,'blue','#fff',8);
  animation2.paintContainer();
  animation2.paintCircle();
}
