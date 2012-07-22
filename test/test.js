var assert = require("assert");
var pagination = require("../public/javascripts/links/pagination");

describe('pagination', function(){

  describe('No page parameter', function(){

    var p;
    before(function(){
      p = new pagination.pagination(null, 10);
    });

    it('returns proper indexes for a pagination component instantiated with no page parameter', function(){
      assert.equal(p.page, 0);
      assert.equal(p.start, 0);
      assert.equal(p.end, 9);
    })

  });

  describe('1st page', function(){

    var p;
    before(function(){
      p = new pagination.pagination(1, 10);
    });

    it('returns proper indexes for a pagination component instantiated as the first page', function(){
      assert.equal(p.page, 0);
      assert.equal(p.start, 0);
      assert.equal(p.end, 9);
    })

  });

  describe('2nd page', function(){

    var p;
    before(function(){
      p = new pagination.pagination(2, 10);
    });

    it('returns proper indexes for a pagination component instantiated as the second page', function(){
      assert.equal(p.page, 1);
      assert.equal(p.start, 10);
      assert.equal(p.end, 19);
    })

  })

})
