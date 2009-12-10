/* http://www.comp.nus.edu.sg/~tankl/cs5208/readings/r-tree.pdf
   Assumptions:
    * 2 dimensional rectangles
    * sides of the rectangles are paralell to the axes
*/

/**
 * class Point
 * 
 **/
var Point = Class.create({
  initialize: function(x, y){
    this.x = x;
    this.y = y;
  }
});

/**
 * class Rectangle
 * 
 **/
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
  height: function(){return this.p2.y - this.p1.y;},

  equals: function(r) {
    return r.x1() == this.x1() &&
           r.x2() == this.x2() &&
           r.y1() == this.y1() &&
           r.y2() == this.y2();
  },

  area: function() {
    return this.width() * this.height();
  }
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

/**
 *  Rectangle.mbr(a, b) -> Rectangle
 *  - a (Rectangle): rectangle 1
 *  - b (Rectangle): rectangle 2
 *
 *  Returns the minimum bounding rectangle of the given rectangles.
 **/
Rectangle.mbr = function() {
  var args = $A(arguments),
      rectangles;

  if (args[0] && Object.isArray(args[0])) rectangles = args[0];
  else rectangles = args;

  var x1array = rectangles.map(function(r) {return r.x1();});
  var x2array = rectangles.map(function(r) {return r.x2();});
  var y1array = rectangles.map(function(r) {return r.y1();});
  var y2array = rectangles.map(function(r) {return r.y2();});

  return new Rectangle(
    x1array.min(),
    y1array.min(),
    x2array.max(),
    y2array.max()
  );
}

/**
 *  class Entry
 *
 **/
var Entry = Class.create({
  node: null,

  initialize: function(obj, rect) {
    this.obj = obj;
    this.rect = rect;
  },

  setNode: function(node) {
    this.node = node;
  },
  setRect: function(rect) { this.rect = rect; },
  getRect: function() { return this.rect; },
  getObj: function() {return this.obj},
  setObj: function(obj) {this.obj = obj; }
});

/**
 *  class Node
 *
 **/
var Node = Class.create({
  leaf: null,
  entries: null,
  parentEntry: null,

  /**
   * new Node(leaf, [parentEntry = null])
   * - leaf (boolean): whether leaf or branch node
   * - parentEntry (Entry): the entry in the parent node whose
   *   bounding rectangle contains all rectangles of this node
   **/
  initialize: function(leaf, parentEntry) {
    this.leaf = leaf;
    this.parentEntry = parentEntry;
    this.entries = [];
  },
  isLeaf: function() {
    return this.leaf;
  },
  setLeaf: function(leaf) { this.leaf = leaf; },
  isRoot: function() {
    return !!!this.parentEntry;
  },
  isBranch: function() {
    return !this.isLeaf();
  },
  addEntry: function(entry) {
    entry.setNode(this);
    this.entries.push(entry);
  },
  getEntries: function() {return this.entries;},
  getEntryCount: function() {return this.getEntries().size();},
  getRectangles: function() {
    return this.entries.map(function(entry) {return entry.getRect();});
  },
  getParentEntry: function() {return this.parentEntry;},
  setParentEntry: function(parentEntry) {this.parentEntry = parentEntry;},
  /**
   *  Node#chooseSubtree(rect) -> Node
   *  - rect (Rectangle): a rectangle
   *
   *  Returns the subtree whose bounding rectangle needs the smallest
   *  enlargement to include rect.
   **/
  chooseSubtree: function(rect) {
    var accumlator = {
      enlargement: Infinity,
      candidate: null
    };
    var result = this.entries.inject(accumlator, function(acc, entry) {
      var areaEntry = entry.getRect().area();
      var mbr = Rectangle.mbr(entry.getRect(), rect);
      var areaMbr = mbr.area();
      var enlargement = areaMbr - areaEntry;
      if (enlargement < acc.enlargement) {
        acc.enlargement = enlargement;
        acc.candidate = entry;
      }
      return acc;
    });
    return result.candidate.getObj();
  }
});

/**
 * class RTree
 * 
 **/
var RTree = Class.create({
  _root: null,
  M: 3,
  m: 1,

  initialize: function() {
    this._root = new Node(true);
  },
  /**
   *  RTree#insert(obj, rect) -> RTree
   *  - rect (Rectangle): bounding rectangle of the inserted object
   *  - obj (Object): reference of the object whose bounding rectangle
   *    is rect
   **/
  insert:function(obj, rect) {
    var entry = new Entry(obj, rect);
    var leaf = this._chooseLeaf(entry);
    if (leaf.getEntryCount() < this.M) {
      leaf.addEntry(entry);
      this._adjustTree(leaf);
    } else { // split
      var nodes = this._splitNode(leaf, entry);      
      var rootNodes = this._adjustTree(nodes[0], nodes[1]);
      if (!!rootNodes[1]) { // root split
        var newRoot = new Node(false);
        var root0 = rootNodes[0];        
        var root1 = rootNodes[1];                
        var mbr0 = Rectangle.mbr(root0.getRectangles());
        var mbr1 = Rectangle.mbr(root1.getRectangles());
        var entry0 = new Entry(root0, mbr0);
        var entry1 = new Entry(root1, mbr1);
        newRoot.addEntry(entry0);
        newRoot.addEntry(entry1);
        root0.setParentEntry(entry0);
        root1.setParentEntry(entry1);
        this._root = newRoot; // install new root
      }
    }
  },
  /**
   *  RTree#search(rect) -> Array
   *  - rect (Rectangle): search rectangle
   *
   *  Given a search rectangle, it returns the Array of object ids,
   *  whose bounding rectangle overlaps the search bounding rectangle
   **/
  search:function(rect) {
    return this.searchTree(this._root, rect).map(function(e) {
      return e.getObj();
    });
  },

  searchTree:function(root, queryRect) {
    var matches = root.getEntries().filter(function(entry) {
      return Rectangle.intersect(queryRect, entry.getRect());
    });
    if (root.isLeaf()) return matches;
    return matches.map(function(m) {
      return this.searchTree(m.getObj(), queryRect);
    }, this).flatten();
  },

  _chooseLeaf: function(entry) {
    var n = this._root;
    while (n.isBranch()) {
      n = n.chooseSubtree(entry.getRect());
    }
    return n;
  },
  _splitNode: function(node, newEntry) {
    var o = this._pickSeeds(node.getEntries().concat(newEntry));
    var node1 = new Node(node.isLeaf(), node.getParentEntry());
    var node2 = new Node(node.isLeaf());
    node1.addEntry(o.seed1);
    node2.addEntry(o.seed2);
    var node1mbr = o.seed1.getRect();
    var node2mbr = o.seed2.getRect();
    var node1area = node1mbr.area();
    var node2area = node2mbr.area();
    o.remaining.each(function(entry) {
      var d1 = Rectangle.mbr(node1mbr, entry.getRect()).area() - node1area;
      var d2 = Rectangle.mbr(node2mbr, entry.getRect()).area() - node2area;
      if (d1 < d2) {
        node1.addEntry(entry);
        node1mbr = Rectangle.mbr(node1mbr, entry.getRect());
        node1area = node1mbr.area();
      } else {
        node2.addEntry(entry);
        node2mbr = Rectangle.mbr(node2mbr, entry.getRect());
        node2area = node2mbr.area();
      }
    });
    return [node1, node2];
  },
  _pickSeeds: function(entries) {
    return {
      seed1: entries[0],
      seed2: entries[1],
      remaining: entries.slice(2, entries.length)
    };
  },
  _adjustTree: function(node, newNode) {
    if (node.isRoot()) {
      return [node, newNode];
    }
    var parentEntry = node.parentEntry;
    parentEntry.setRect(Rectangle.mbr(node.getRectangles()));
    parentEntry.setObj(node);
    var parentNode = parentEntry.node;
    if (newNode) {
      var newNodeMbr = Rectangle.mbr(newNode.getRectangles());
      var newEntry = new Entry(newNode, newNodeMbr);
      if (parentNode.getEntryCount() < this.M) {
        parentNode.addEntry(newEntry);
        return this._adjustTree(parentNode);
      } else {
        var parents = this._splitNode(parentNode, newEntry);
        return this._adjustTree(parents[0], parents[1]);
      }
    }
  }
});
