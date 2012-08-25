describe('Pagination', function(){

  beforeEach(module('links.pagination'));

  var p;
  beforeEach(function(){
    inject(function($injector) {
      p = $injector.get('$pagination');
    });
  });

  describe('component', function(){

    it('returns proper indexes for a pagination component instantiated with no page parameter', function(){
      p.seed(10, null);
      expect(p.page).toEqual(0);
      expect(p.start).toEqual(0);
      expect(p.end).toEqual(9);
    })

  });

  describe('component', function(){

    it('returns proper indexes for a pagination component instantiated as the first page', function(){
      p.seed(10, 1);
      expect(p.page).toEqual(0);
      expect(p.start).toEqual(0);
      expect(p.end).toEqual(9);
    })

  });

  describe('component', function(){

    it('returns proper indexes for a pagination component instantiated as the second page', function(){
      p.seed(10, 2);
      expect(p.page).toEqual(1);
      expect(p.start).toEqual(10);
      expect(p.end).toEqual(19);
    })

  })

  describe('component', function(){

    it('returns proper indexes and updates state across multiple pagination calls', function(){
      p.seed(10, null);
      expect(p.page).toEqual(0);
      expect(p.start).toEqual(0);
      expect(p.end).toEqual(9);
      p.seed(10, 1);
      expect(p.page).toEqual(0);
      expect(p.start).toEqual(0);
      expect(p.end).toEqual(9);
      p.seed(10, 2);
      expect(p.page).toEqual(1);
      expect(p.start).toEqual(10);
      expect(p.end).toEqual(19);
      p.seed(10, null);
      expect(p.page).toEqual(0);
      expect(p.start).toEqual(0);
      expect(p.end).toEqual(9);
    })

  })

})
