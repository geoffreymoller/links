'use strict';

describe('Search Controller', function () {

  beforeEach(module('links'));

  var controller, scope;

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

      it('parses jpg images correctly', function () {
        uri = 'http://foo/foo.jpg';
        expect(scope.isImage(uri)).toBe(true);
      });

      it('parses jpeg images correctly', function () {
        uri = 'http://foo/foo.jpeg';
        expect(scope.isImage(uri)).toBe(true);
      });

      it('parses gif images correctly', function () {
        uri = 'http://foo/foo.gif';
        expect(scope.isImage(uri)).toBe(true);
      });

      it('parses png images correctly', function () {
        uri = 'http://foo/foo.png';
        expect(scope.isImage(uri)).toBe(true);
      });

      it('parses non-image uris correctly', function () {
        uri = 'http://foo';
        expect(scope.isImage(uri)).toBe(false);
      });

    });

  });

});
