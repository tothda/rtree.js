describe 'Rectangle'
  describe 'construction'
    it 'should properly initialize from x1,y1,x2,y1'
      r = new Rectangle(1,1,4,3)
      r.p1.x.should.be 1
      r.p1.y.should.be 1
      r.p2.x.should.be 4
      r.p2.y.should.be 3
    end
    
    it 'should properly initialize from a 4 element array'
      r = new Rectangle([1,1,4,3])
      r.p1.x.should.be 1
      r.p1.y.should.be 1
      r.p2.x.should.be 4
      r.p2.y.should.be 3
    end
    
    it 'should throw error, when wrong number of arguments given'
      -{new Rectangle()}.should.throw_error
      -{new Rectangle(1)}.should.throw_error
      -{new Rectangle(1,2,3)}.should.throw_error
      -{new Rectangle(1,2,3,4,5)}.should.throw_error
    end
  end
  
  describe 'intersection'      
    
    it 'should return false in case of no intersection'
      a = new Rectangle([1,1,4,3])
      b = new Rectangle([3,4,6,6])
      Rectangle.intersect(a,b).should.be_false
    end
    
    it 'should return true in case of intersection'
      a = new Rectangle([1,1,4,3])
      b = new Rectangle([3,0,6,2])
      Rectangle.intersect(a,b).should.be_true
    end
    
    it 'should return true in case of first contains the second'
      a = new Rectangle([1,1,5,4])
      b = new Rectangle([2,2,4,3])
      Rectangle.intersect(a,b).should.be_true
    end
    
    it 'should return true in case of second contains the first'
      a = new Rectangle([2,2,4,3])
      b = new Rectangle([1,1,5,4])
      Rectangle.intersect(a,b).should.be_true
    end
    
    it 'should return true in case of containment - touching'
      a = new Rectangle([1,1,5,4])
      b = new Rectangle([1,2,2,3])
      Rectangle.intersect(a,b).should.be_true
    end
    
    it 'should return false in case of no intersection - touching'
      a = new Rectangle([1,1,2,2])
      b = new Rectangle([2,1,3,2])
      Rectangle.intersect(a,b).should.be_false
    end
  end

  describe 'bounding rectangle calculation'
    it 'should be correct in case of non-overlaping rectangles'
      a = new Rectangle(1,1,3,3)
      b = new Rectangle(2,4,4,5)
      c = new Rectangle(1,1,4,5)
      Rectangle.mbr(a,b).equals(c).should.be_true
    end

    it 'should be correct in case of containing rectangles'
      a = new Rectangle(1,1,4,4)
      b = new Rectangle(2,2,3,3)
      Rectangle.mbr(a,b).equals(a).should.be_true
    end

    it 'should be correct in case of overlapping rectangles'
      a = new Rectangle(1,1,3,3)
      b = new Rectangle(2,2,5,4)
      c = new Rectangle(1,1,5,4)
      Rectangle.mbr(a,b).equals(c).should.be_true
    end

    it 'should be correct for more than two arguments'
      a = new Rectangle(1,1,3,3)
      b = new Rectangle(2,2,5,4)
      c = new Rectangle(2,5,6,6)
      r = new Rectangle(1,1,6,6)
      Rectangle.mbr(a,b,c).equals(r).should.be true      
    end
    
    it 'should work if gets an array of rectangles'
      a = new Rectangle(1,1,3,3)
      b = new Rectangle(2,2,5,4)
      c = new Rectangle(2,5,6,6)
      r = new Rectangle(1,1,6,6)
      Rectangle.mbr([a,b,c]).equals(r).should.be true      
    end
  end
  
  it 'should calculate width, height correctly'
    r = new Rectangle(1,1,4,3)
    r.width().should.be 3
    r.height().should.be 2
  end

  it 'should test equality correctly'
    a = new Rectangle(2,3,4,5)
    b = new Rectangle(2,3,4,5)
    c = new Rectangle(2,3,4,6)
    a.equals(b).should.be_true
    a.equals(c).should.be_false
  end

  it 'should calculate area correctly'
    a = new Rectangle(1,1,4,3)
    a.area().should.be 6
  end
end      

describe 'Node'
  describe 'chooseSubtree'
    before_each
      /*
           11....
           11....
           ......
           ....33
           2.....
      */
      e1 = new Entry(1, new Rectangle(0,0,2,2))
      e2 = new Entry(2, new Rectangle(0,4,1,5))
      e3 = new Entry(3, new Rectangle(4,3,6,4))
      n = new Node()
      n.entries = [e1, e2, e3]
    end

    it 'should choose subTree correectly'
      r = new Rectangle(3,4,4,5)
      n.chooseSubtree(r).should.be 2
    end

    it 'should choose subtree correctly if rect is inside of an exsisting subtree'
      r = new Rectangle(1,0,2,2)
      n.chooseSubtree(r).should.be 1
    end
  end
end

describe 'RTree'
  describe 'insert - search'

    before_each
      tree = new RTree()
      a = new Rectangle(0,0,2,2)
      b = new Rectangle(4,0,5,4)
      c = new Rectangle(1,3,3,6)
      d = new Rectangle(4,2,7,5)
      e = new Rectangle(4,6,5,7)
      f = new Rectangle(8,0,10,1)
      tree.insert('A', a)
      tree.insert('B', b)
      tree.insert('C', c)
      tree.insert('D', d)
      tree.insert('E', e)
      tree.insert('F', f)
    end

    it 'should found the only one inserted object'
      t = new RTree()
      r = new Rectangle(1,1,3,3)
      t.insert(1, r)
      t.search(new Rectangle(1,1,2,2)).size().should.be 1
    end

    it 'should found one overlaping object'
      tree.search(new Rectangle(1,1,3,3)).should.include 'A'
    end

    it 'should found two overlaping rectangle'
      var result = tree.search(new Rectangle(1,1,3,4))
      result.should.include 'A'
      result.should.include 'C'
    end

    it 'should found all of the test rectangles'
      var result = tree.search(new Rectangle(0,0,10,10))
      result.size().should.be 6
    end

    it 'should return an empty array if there is no match'
      tree.search(new Rectangle(0,2,4,3)).size().should.be_empty
    end
  end
end