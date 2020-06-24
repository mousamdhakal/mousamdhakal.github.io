function createPlot(){
  var main = document.getElementById("main");
  var container = document.createElement("div");

  container.style.border = "1px solid black";
  container.style.width= "500px";
  container.style.height = "500px";
  container.style.position = "relative";
  main.appendChild(container);
  
  var points = [
    {x: 10, y: 20},
    {x: 90, y: 61},
    {x: 40, y: 40},
    {x: 60, y: 20},
    {x: 50, y: 30}
];

  points.forEach(function(point){
    var spot = document.createElement("div");
    spot.style.height= "10px";
    spot.style.width= "10px";
    spot.style.backgroundColor= "red";
    spot.style.borderRadius = "50%";
    spot.style.position = "absolute";
    spot.style.left = "" +point.x *5 + "px";
    spot.style.top = "" +point.y *5 + "px";
    container.appendChild(spot);
  })
}