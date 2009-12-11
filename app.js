jQuery(document).ready(function(){
  app.run();
});

var app = (function() {
  var N = 20; // number of elements
  var shapes; // array of the rectangles
  var w, h; // width and height of the canvas
  var canvas;
  var ctx2D;
  var rTree;

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
  
  var addToTree = function(shapes){
    for (var i = 0, l = shapes.length; i < l; i++){
      var s = shapes[i];
      rTree.insert(s, new Rectangle(s.x, s.y, s.x + s.w, s.y + s.h));
    }
  }
  
  var drawShapes = function(ctx,w,h){    
    jQuery.each(shapes, function(idx, shape) {
      drawShape(ctx, shape);
    });
  };

  var drawShape = function(ctx, shape) {
    ctx.fillStyle = "rgba(_, _, _, 0.9)".replace(/_/g, shape.color);
    ctx.fillRect(shape.x, shape.y, shape.w, shape.h);
    return this;
  };

  var init = function() {
  	canvas = jQuery("#canvas").get(0);
    ctx2D = canvas.getContext("2d");
    rTree = new RTree();
    w = canvas.width;
    h = canvas.height;
    clearCanvas(ctx2D,w,h);
    shapes = generateShapes(w,h);
    addToTree(shapes);
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
      N = parseInt(jQuery("#num-of-objects").val()) || N;      
    };
    
    jQuery('#re-init').click(function(){
      adjustParams();
      init();
    });
    
    jQuery("#canvas").click(function (e) {
      var c = coords(e);
      var r = rTree.search(new Rectangle(c.x, c.y, c.x, c.y));  
      jQuery("#coord-panel")
        .html('')
        .append('coordinates: [' + c.x + ',' + c.y + ']').append('<br/>')
        .append('search results:').append('<br/>')
        .append(jQuery.map(r, function(e, i){
          return (i + 1) + '. x:' + e.x + ', y:' + e.y + ', w:' + e.w + ', h: ' + e.h;
        }).join('<br/>'));
    });
  };
  
  var coords = function(e){
    return {
      x: e.pageX - 20,
      y: e.pageY - 20
    };
  }

  return {
    run: function() {    	
      init();
    }
  };
} ());

