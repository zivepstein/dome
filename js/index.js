var width = 960,
    height = 500;

var velocity = [.010, .005, 0.001],
    t0 = Date.now();

var projection = d3.geo.orthographic()
    .scale(height / 3 - 10);

var canvas = d3.select("body").append("canvas")
    .attr("width", width)
    .attr("height", height);

var context = canvas.node().getContext("2d");

context.strokeStyle = "#000";
context.lineWidth = .5;

var subdivision = 8;

var faces;

var output = d3.select("output");

var input = d3.select("input")
    .on("change", function() { geodesic(+this.value/10); })
    .each(function() { geodesic(+this.value/10); });

d3.timer(function() {
  var time = Date.now() - t0;
  projection.rotate([time * velocity[0], time * velocity[1]]);
  geodesic(0.6 + Math.sin(time * velocity[2]) / 3);
  redraw();
});

function redraw() {
  context.clearRect(0, 0, width, height);

  faces.forEach(function(d) {
    d.polygon[0] = projection(d[0]);
    d.polygon[1] = projection(d[1]);
    d.polygon[2] = projection(d[2]);
    if (d.visible = d.polygon.area() > 0) {
      context.fillStyle = d.fill;
      context.beginPath();
      drawTriangle(d.polygon);
      context.fill();
    }
  });

  context.beginPath();
  faces.forEach(function(d) {
    if (d.visible) {
      drawTriangle(d.polygon);
    }
  });
  context.stroke();
}

function drawTriangle(triangle) {
  context.moveTo(triangle[0][0], triangle[0][1]);
  context.lineTo(triangle[1][0], triangle[1][1]);
  context.lineTo(triangle[2][0], triangle[2][1]);
  context.closePath();
}

function geodesic(temp) {
  output.text(subdivision);

  faces = d3.geodesic.polygons(subdivision).map(function(d) {
    d = d.coordinates[0];
    d.pop(); // use an open polygon

    d.fill = d3.hsl(d[0][0] + Math.random()*50, 0.6, temp) + "";
    if (d[0][0] > 0){
       d.fill = d3.interpolatePlasma(0.1*Math.random() + 0.5 + temp*d[0][0]/360);
     } else{
       d.fill = d3.interpolatePlasma(1-(0.1*Math.random() + 0.5 + temp*d[0][0]/360));
     }
   
    d.polygon = d3.geom.polygon(d.map(projection));
    return d;
  });

  redraw();
}