describe('services', function(){

  describe('data', function(){

    var data;
    var rows;
  
    beforeEach(module('links.data'))  

    beforeEach(function(){
      rows = [
        {"id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","key":"javascript","value":{"_id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","_rev":"1-b3b15b43644d33ddbebbcc79681a7a0d","title":"9-Patch Quilt Generator - Jason Davies","URI":"http:\/\/www.jasondavies.com\/9patch\/","date":1326571354762,"tags":["d3"]}},
        {"id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","key":"javascript","value":{"_id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","_rev":"1-b3b15b43644d33ddbebbcc79681a7a0d","title":"9-Patch Quilt Generator - Jason Davies","URI":"http:\/\/www.jasondavies.com\/9patch\/","date":1326571354762,"tags":["javascript"]}},
        {"id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","key":"javascript","value":{"_id":"fff9ea7e-f8a7-4219-acb2-bafe0196da28","_rev":"1-b3b15b43644d33ddbebbcc79681a7a0d","title":"9-Patch Quilt Generator - Jason Davies","URI":"http:\/\/www.jasondavies.com\/9patch\/","date":1326571354762,"tags":["d3","javascript"]}}
      ]
    });

    beforeEach(function(){
      inject(function($injector) {
        data = $injector.get('$data');
      });
    });

    it('filters a rowset via ANDs', function(){
      var result = data.filter(rows, ['d3','javascript']); 
      expect(result.length).toEqual(1);
      result = data.filter(rows, ['d3']); 
      expect(result.length).toEqual(2);
    });

    it('filters a rowset via NOTS', function(){
      var result = data.filter(rows, [], ['d3']); 
      expect(result.length).toEqual(1);
    });

    it('filters a row via AND', function(){
      var found = data.filterAnd(rows[0], ['d3']); 
      expect(found).toEqual(true);
      found = data.filterAnd(rows[1], ['javascript']); 
      expect(found).toEqual(true);
      found = data.filterAnd(rows[2], ['javascript','d3']); 
      expect(found).toEqual(true);
    });

    it('filters a row via NOT', function(){
      var found = data.filterNot(rows[0], ['javascript']); 
      expect(found).toEqual(true);
      var found = data.filterNot(rows[0], ['d3']); 
      expect(found).toEqual(false);
    });

  });

});

