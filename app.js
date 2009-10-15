$(document).ready(function(){
  app.run();
});

var app = (function() {
  var N = 100; // number of elements
  var w, h; // width and height of the canvas

  // generate a random integer
  var random = function(low, up) {
    if (!up) {
      up = low;
      low = 0;
    }
    return Math.round(Math.random() * (up-low)) + low;
  }

  var generateShapes = function(w,h) {
    S = 0.3;
    S2 = S;
    var shapes = [];
    for (var i = 0; i < N; i++) {
      var x = random(w);
      var y = random(h);
      var ww = random((w-x) * S);
      var hh = random(Math.floor(ww * S2)) + Math.ceil(ww * (1 - S2));
      shapes.push({
        x: x,
        y: y,
        w: ww,
        h: hh,
        color: random(100,200) // grayscale color
      });
    }
    return shapes;
  };

  var drawShape = function(ctx, shape) {
    ctx.fillStyle = "rgba(_, _, _, 0.9)".replace(/_/g, shape.color);
    ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
    return this;
  };

  var init = function() {
    var canvas = $("#canvas").get(0);
    var ctx = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    ctx.strokeRect(0,0,w,h);
    var shapes = generateShapes(w,h);
    $.each(shapes, function(idx, shape) {
      drawShape(ctx, shape);
    });
  };

  return {
    run: function() {
      init();
    }
  };
} ());

