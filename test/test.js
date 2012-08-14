describe('pagination', function(){

  describe('No page parameter', function(){

    var p;
    beforeEach(function(){
      p = new pagination(null, 10);
    });

    it('returns proper indexes for a pagination component instantiated with no page parameter', function(){
      expect(p.page).to.equal(0);
      expect(p.start).to.equal(0);
      expect(p.end).to.equal(9);
    })

  });

  describe('1st page', function(){

    var p;
    beforeEach(function(){
      p = new pagination(1, 10);
    });

    it('returns proper indexes for a pagination component instantiated as the first page', function(){
      expect(p.page).to.equal(0);
      expect(p.start).to.equal(0);
      expect(p.end).to.equal(9);
    })

  });

  describe('2nd page', function(){

    var p;
    beforeEach(function(){
      p = new pagination(2, 10);
    });

    it('returns proper indexes for a pagination component instantiated as the second page', function(){
      expect(p.page).to.equal(1);
      expect(p.start).to.equal(10);
      expect(p.end).to.equal(19);
    })

  })

})
