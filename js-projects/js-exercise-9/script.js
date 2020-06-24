var main = document.getElementById('main');

function createAnimation(){
  var container = document.createElement('div');
  container.style.border = "1px solid black";
  container.style.width= "300px";
  container.style.height = "300px";
  container.style.position = "relative";
  main.appendChild(container);

  var circle = document.createElement("div");
  circle.style.height= "30px";
  circle.style.width= "30px";
  circle.style.backgroundColor= "red";
  circle.style.borderRadius = "50%";
  circle.style.position = "absolute";
  circle.style.left = "135px";
  container.appendChild(circle);


  var start;

  function stepdown(timestamp) {
    if (start === undefined)
      start = timestamp;
    var elapsed = timestamp - start;

    if(0.2*elapsed < 270){
      circle.style.transform = 'translateY(' + Math.min(0.2 * elapsed, 270) + 'px)';
      window.requestAnimationFrame(stepdown);
    }
    else {
      start = undefined;
      window.requestAnimationFrame(stepup);
    }

  }

  function stepup(timestamp) {
    if (start === undefined)
      start = timestamp;
    var elapsed = timestamp - start;
  
    if(0.2*elapsed < 270){
      circle.style.transform = 'translateY(' + (270 - Math.min(0.2 * elapsed, 270)) + 'px)';
      window.requestAnimationFrame(stepup);
    }
    else {
      start = undefined;
      window.requestAnimationFrame(stepdown);
    }

  }

  window.requestAnimationFrame(stepdown);
}
