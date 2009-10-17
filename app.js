$(document).ready(function(){
  app.run();
});

var app = (function() {
  var N = 20; // number of elements
  var w, h; // width and height of the canvas
  var canvas;
  var ctx2D;

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
      var ww = Math.min(w-x, random(w * S));
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
  
  var drawShapes = function(ctx,w,h){
    var shapes = generateShapes(w,h);
    $.each(shapes, function(idx, shape) {
      drawShape(ctx, shape);
    });
  };

  var drawShape = function(ctx, shape) {
    console.log(shape);
    ctx.fillStyle = "rgba(_, _, _, 0.9)".replace(/_/g, shape.color);
    ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
    return this;
  };

  var init = function() {
  	canvas = $("#canvas").get(0);
    ctx2D = canvas.getContext("2d");
    w = canvas.width;
    h = canvas.height;
    clearCanvas(ctx2D,w,h);
    drawShapes(ctx2D,w,h);
    initEventHandlers();
  };
  
  var clearCanvas = function(ctx,w,h){
  	ctx.fillStyle = "#FFFFFF";
  	ctx.fillRect(0,0,w,h);
  	ctx.strokeRect(0,0,w,h);
  };
  
  var initEventHandlers = function(){
    var adjustParams = function(){
      N = parseInt($("#num-of-objects").val()) || N;      
    };
    
    $('#re-init').click(function(){
      adjustParams();
      clearCanvas(ctx2D,w,h);
      drawShapes(ctx2D,w,h);
    });
  };

  return {
    run: function() {    	
      init();
    }
  };
} ());

