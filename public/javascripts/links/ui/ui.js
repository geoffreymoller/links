var ui = angular.module('links.ui', [])

ui.factory('$ui', function($rootScope){

  return {

    paint: function(){
      $rootScope.loaded = false;
      if($rootScope.search && $rootScope.search.indexOf('img') !== -1){
        $rootScope.listType = 'images';
        $rootScope.pageLength = 6; 
      }
      else {
        delete $rootScope.listType;
      }
    } 

    , keydown: function(e){
      if(e.keyCode === 74 || e.keyCode === 75){
        if($(e.target).attr('id') !== 'search'){
          $rootScope.$broadcast('vim', e.keyCode);
        }
      }
      else if(_.find([37, 39, 78, 80], function(num) { return num === e.keyCode })){
        $rootScope.$broadcast('pagination', e, (e.keyCode === 37 || e.keyCode === 80) ? 0 : 1);
      }
      else if(e.keyCode === 69){
        $rootScope.$broadcast('edit', e);
      }
      else if(e.keyCode === 70 && !e.metaKey){
        $rootScope.$broadcast('follow', e);
      }
      else if(e.keyCode === 27){
        $rootScope.$broadcast('esc');
      }
      else if(e.keyCode === 13){
        $rootScope.$broadcast('enter', e);
      }
      else if(e.target.nodeName === "TEXTAREA" || e.target.nodeName === "INPUT"){
        return;
      }
      else if(e.keyCode === 191){
        e.preventDefault();
        $('#search').focus().val('');
      }

    }

    , crop: function($img, dimensions){

      if(!($img instanceof jQuery)){
        throw new Error('Please pass a jQuery object for the $img parameter');
      }

      if(typeof dimensions.w !== 'number' || typeof dimensions.h !== 'number'){
        throw new Error('yam.uiHelper::crop: both dimensions must be numbers');
      }   

      var clipRectMarginX = 0;
      var leftClip = 0;
      var rightClip = $img.width();

      var clipRectMarginY = 0;
      var topClip = 0;
      var bottomClip = $img.height();
      
      if($img.width() > dimensions.w){
        clipRectMarginX = Math.abs(dimensions.w - $img.width());
        leftClip = (clipRectMarginX / 2); 
        rightClip = (leftClip + dimensions.w);
      }

      if($img.height() > dimensions.h){
        clipRectMarginY = Math.abs(dimensions.h - $img.height());
        topClip = (clipRectMarginY / 2); 
        bottomClip = (topClip + dimensions.h);
      }

      var clipRectangle = 'rect(' + topClip + 'px,' + rightClip + 'px,' + bottomClip + 'px,' + leftClip + 'px)';

      $img.css('position', 'absolute')
      .css('left', -leftClip)
      .css('top', -topClip)
      .css('clip', clipRectangle);

      return {
        $img: $img
        , clipRectMarginX: clipRectMarginX
        , clipRectMarginY: clipRectMarginY
        , leftClip: leftClip
        , rightClip: rightClip
        , topClip: topClip
        , bottomClip: bottomClip
        , clipRectangle: clipRectangle
      }

    }

    , cropAndFrame: function($img, $container, dimensions, callback){

      //take the image out of the container while it loads to prevent janky load shimmy. 
      //After it's loaded and we have the dimensions, crop it and insert it back into the container
      $img.remove()
      .css('visibility', 'hidden')
      .appendTo($('body'));


      $img.imagesLoaded(_.bind(function($images, $proper, $broken){

        $img.css('max-width', $img.width());

        var containerPadding = {
          top: parseInt($container.css('paddingTop'))
          , left: parseInt($container.css('paddingLeft'))
          , bottom: parseInt($container.css('paddingBottom'))
          , right: parseInt($container.css('paddingRight'))
        }

        var containerBorder = {
          top: parseInt($container.css('borderTopWidth'))
          , left: parseInt($container.css('borderLeftWidth'))
          , bottom: parseInt($container.css('borderBottomWidth'))
          , right: parseInt($container.css('borderRightWidth'))
        }

        var vertOffset = containerPadding.top + containerPadding.bottom + containerBorder.top + containerBorder.bottom;
        var horizOffset = containerPadding.left + containerPadding.right + containerBorder.left + containerBorder.right;
        dimensions.h -= vertOffset; 
        dimensions.w -= horizOffset; 

        var croppedImage = this.crop($img, dimensions);

        //frame the image per container padding
        var imageHorizOffset = 0;
        var imageVertOffset = 0;
        if($img.width() > dimensions.w){
          if(containerPadding.left){
            imageHorizOffset -= (croppedImage.leftClip - containerPadding.left);
          }
        }
        else {
          imageHorizOffset = dimensions.w - $img.width(); 
          imageHorizOffset = imageHorizOffset / 2;
          imageHorizOffset += containerPadding.left;
        }
        if($img.height() > dimensions.h){
          if(containerPadding.top){
            imageVertOffset -= (croppedImage.topClip - containerPadding.top);
          }
        }
        else {
          imageVertOffset = dimensions.h - $img.height(); 
          imageVertOffset = imageVertOffset / 2;
          imageVertOffset += containerPadding.top;
        }

        $img.css('left', imageHorizOffset + 'px');
        $img.css('top', imageVertOffset + 'px');

        $container.css('position', 'relative');
        $container.css('width', dimensions.w + 'px');
        $container.css('height', dimensions.h + 'px');

        $img.remove().appendTo($container);
        $img.css('visibility', 'visible'); 

        callback && callback(croppedImage);

      }, this));

    } 
  }

})

ui.directive('gmCroppedImage', function($ui) {

  //TODO -> WHY?
  var $ui = $ui;

  return function(scope, element, attrs){
 
    if(scope.link.value.thumbnail_url){
      var $img = $(element[0]);
      var $container = $img.parent();
      $img.attr('src', scope.link.value.thumbnail_url);
      $img.height(100); 
      $ui.cropAndFrame($img, $container, {w: 100, h: 100});
    }

  }   
}); 

