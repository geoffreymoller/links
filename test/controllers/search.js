'use strict';

describe('Search Controller', function () {

  beforeEach(module('links'));

  var controller, scope, mockTabs;

  beforeEach(inject(function ($controller, $rootScope, $httpBackend) {
    scope = $rootScope.$new();
    controller = $controller('SearchController', {
      $scope: scope
    });
  }));

  describe('when the uri is accessed', function(){

    var link;

    it('normalizes uri across dirty couch data', function () {
      link = {
        value: {
          uri: 'foo bar'
        }
      }
      expect(scope.uri(link)).toBe('foo bar');
      link = {
        value: {
          URI: 'foo bar'
        }
      }
      expect(scope.uri(link)).toBe('foo bar');
      link = {
        value: { }
      }
      expect(scope.uri(link)).toBe(undefined);
    });

    describe('isImage', function(){

      var uri;

      it('parses a uri for images correctly', function () {
        uri = 'foo.gif';
        expect(scope.isImage(uri)).toBe(true);
        uri = 'foo.jpg';
        expect(scope.isImage(uri)).toBe(true);
        uri = 'foo.jpeg';
        expect(scope.isImage(uri)).toBe(true);
        uri = 'foo.png';
        expect(scope.isImage(uri)).toBe(true);
      });

    });

  });

});
