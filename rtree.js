/* http://www.comp.nus.edu.sg/~tankl/cs5208/readings/r-tree.pdf
   Assumptions:
    * 2 dimensional rectangles
    * sides of the rectangles are paralell to the axes
*/

// point
var Point = Class.create({
  initialize: function(x, y){
    this.x = x;
    this.y = y;
  }
});

// rectangle
var Rectangle = Class.create({
  /**
   *  new Rectangle(p1, p2)  
   *  - p1 (Point): top-left corner of the rectangle
   *  - p2 (Point): bottom-right corner of the rectangle
   *
   *  new Rectangle(x1, y1, x2, y2)
   *  - x1 (number): x coordinate of the top-left corner
   *  - y1 (number): y coordinate of the top-left corner
   *  - x2 (number): x coordinate of the bottom-right corner
   *  - y2 (number): y coordinate of the bottom-right corner   
   **/   
  initialize: function(){    
    var args = $A(arguments),
        argsSize = args.size(),
        p;
    
    // initialize from a 4 element array
    if (argsSize == 1){
      if (!Object.isArray(args[0]) || args[0].size() != 4){
        throw new Exception("Wrong type of arguments. Should be a array of 4 elements!");
      }
      p = args[0];
    } else {
      p = args;
    }

    switch(p.size()){
      case 2:
        this.p1 = p[0];
        this.p2 = p[1];
        break;
      case 4:
        this.p1 = new Point(p[0], p[1]);
        this.p2 = new Point(p[2], p[3]);
        break;
      default:
        throw new Exception("Wrong number of arguments!");
      }      
  },
  x1: function(){return this.p1.x},
  y1: function(){return this.p1.y},
  x2: function(){return this.p2.x},
  y2: function(){return this.p2.y},
  
  width: function(){return this.p2.x - this.p1.x;},
  height: function(){return this.p2.y - this.p1.y;}
});

/**
 *  Rectangle.intersect(r1, r2) -> boolean
 *  - r1 (Rectangle): rectangle 1
 *  - r2 (Rectangle): rectangle 2
 */
Rectangle.intersect = function(a, b){
  return !(a.x1() >= b.x2() ||
           a.x2() <= b.x1() ||
           a.y1() >= b.y2() ||
           a.y2() <= b.y1());
};
