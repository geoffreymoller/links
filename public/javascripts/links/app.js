var app = angular.module('links', ['links.filter', 'links.data', 'links.ui', 'links.pagination'], function($routeProvider, $locationProvider){
  $routeProvider.when('/search/:tag', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  }).
  when('/search/:tag/:page', {
    templateUrl: 'partials/search.html',
    controller: SearchController
  }).
  when('/viz', {
    templateUrl: 'partials/viz.html',
    controller: VizController
  }).
  otherwise({redirectTo: '/search/'});
}).run(function($rootScope){
  $(document).on('keydown', function(e){
    $rootScope.$broadcast('keydown', e);
  });
});

app.directive('notesEditor', function() {

  return function($scope, element, attrs){
    var $node = $(element);
    $scope.link.editor = new EpicEditor({
      container: $node[0]
      , focusOnLoad: true
      , clientSideStorage: false
      , file: {
        name: 'epiceditor'
        , defaultContent: $scope.link.value.notes || ""
        , autoSave: 100
      }
      , basePath: 'stylesheets'
      , theme: {
        base:'/themes/base/epiceditor.css',
        preview:'/themes/preview/github.css',
        editor:'/themes/preview/github.css'
      }
      , shortcut: {
        modifier: 18
        , fullscreen: 70
        , preview: 80
        , edit: 79
      }
    }).load().preview();

    //TODO - broadcast to consumer
    var dimensions = {w: 920, h: 50};
    $scope.$parent.resize(dimensions, $node, $scope.link.editor);  

    //TODO - disable/throttle per viewstate
    $scope.link.editor.on('save', function () {
      $scope.link.value.notes = $scope.link.editor.getFiles()['epiceditor'].content;
    });

  };

});

var VizController = function($scope) {
  $scope.page = 'Viz';
}

