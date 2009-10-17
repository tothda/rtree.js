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
  
  it 'should calculate width, height correctly'
    r = new Rectangle(1,1,4,3)
    r.width().should.be 3
    r.height().should.be 2
  end
end      
