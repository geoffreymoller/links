describe('ui', function () {

  var c, p;

  beforeEach(module('links.ui'));
  beforeEach(module('links.pagination'));

  beforeEach(function(){
    inject(function($injector) {
      c = $injector.get('$ui');
      p = $injector.get('$pagination');
    });
  });

  describe('ui.crop', function() {

    var crop, bigImagePath, smallImagePath, wideShortImage, dimensions, img, $img;

    beforeEach(function() {
      crop = c.crop;
      bigImagePath = 'https://geoffreymoller-collect.s3.amazonaws.com/2012/9/18/surprised-long-neck-surprise-l.png';
      smallImagePath = 'https://i.embed.ly/1/image/resize?key=4d90b544096f11e084894040444cdc60&url=http%3A%2F%2F4.bp.blogspot.com%2F-lKl1cyEpkMY%2FUIk34XKW_3I%2FAAAAAAAAJuM%2Fw-FkB8u6X-Q%2Fs1600%2Fgreen%2Blantern%2Brobot%2Bmodle%2Bkit%2Bbase%2B2011%2Bmoebius%2Baurora%2Bsilver%2Bage%2Bb.jpg&grow=false&height=100';
      wideShortImage = 'https://s3.amazonaws.com/geoffreymoller/wide_skinny.png';
      dimensions = {
        w: 70
        , h: 150
      }
      img = new Image();
    });

    describe('validation', function(){

      it('should expect a wrapped jQuery object as the image parameter', function() {
        expect(function (){ 
          crop(img, dimensions);
        }).toThrow('Please pass a jQuery object for the $img parameter');
      });

      it('should validate the dimensions parameter', function() {
        expect(function (){ 
          var dimensions = {
            w: 'foo' 
            , w: 'bar' 
          }
          crop($(img), dimensions);
        }).toThrow('yam.uiHelper::crop: both dimensions must be numbers');
      });

    });

    describe('crop', function(){

      function parseClipDeclaration(declaration){
        var parts = declaration.replace(/rect\((.*)\)/, '$1').split(' ');
        return {
          top: parseInt(parts[0])
          , right: parseInt(parts[1])
          , bottom: parseInt(parts[2])
          , left: parseInt(parts[3])
        }
      }

      function vetImageCropping(img, cropped){
        var $img = $(img);

        expect(cropped.$img[0]).toBe($img[0]);

        // IE8 will always return undefined for .css('clip') under jquery 1.7.1
        var rawClip = $img.css('clip') || img.style.clip.replace(/,/g, ' ')
          , parsedClip = parseClipDeclaration(rawClip);

        expect(cropped.topClip).toBe(parsedClip.top);
        expect(cropped.rightClip).toBe(parsedClip.right);
        expect(cropped.bottomClip).toBe(parsedClip.bottom);
        expect(cropped.leftClip).toBe(parsedClip.left);

        expect($img.css('position')).toBe('absolute');
        expect(parseInt($img.css('left'))).toBe(-cropped.leftClip);
        expect(parseInt($img.css('top'))).toBe(-cropped.topClip);

        if(cropped.clipRectMarginX > 0){
          expect(cropped.clipRectMarginX).toBe($img.width() - dimensions.w);
          expect(cropped.rightClip - cropped.leftClip).toBe(dimensions.w);
        }

        if(cropped.clipRectMarginY > 0){
          expect(cropped.bottomClip - cropped.topClip).toBe(dimensions.h);
          expect(cropped.clipRectMarginY).toBe($img.height() - dimensions.h);
        }
      }

      it('should crop a larger image and offset image coordinates', function() {

        var cropped, loaded = false;
        img.src = bigImagePath; 

        $(img).imagesLoaded(function(){
          $('body').append(img);
          cropped = c.crop($(img), dimensions);
          loaded = true;
        });

        waitsFor(function(){
          return loaded;
        }, 5000);

        runs(function(){
          vetImageCropping(img, cropped);
        }); 

      });

      it('should not crop a smaller image, but offset image coordinates', function() {

        var cropped, loaded = false;
        img.src = smallImagePath; 

        $(img).imagesLoaded(function(){
          $('body').append(img);
          cropped = c.crop($(img), dimensions);
          loaded = true;
        });

        waitsFor(function(){
          return loaded;
        }, 5000);

        runs(function(){
          vetImageCropping(img, cropped);
        }); 

      });

    });

    describe('cropAndFrame', function(){

      var cropped, timeout, $container, frame, loaded, $img;

      beforeEach(function(){

        timeout = 5000;
        $container = $('<div>');
        $container.css('padding', '10px');
        $container.css('border', '5px solid black');

        cropped = null;
        loaded = false;
        $img = $(img);
        $container.append($img);
        $('body').append($container);

      });

      function vetContainerOffset(cropped, $img){
        expect(cropped.rightClip - cropped.leftClip).toBe(20);
        expect(cropped.bottomClip - cropped.topClip).toBe(20);

        var leftClip = cropped.leftClip;
        var leftPadding = parseInt($container.css('padding-left'));
        expect(parseInt($img.css('left'))).toBe(-(leftClip - leftPadding));

        var topClip = cropped.topClip;
        var topPadding = parseInt($container.css('padding-top'));
        expect(parseInt($img.css('top'))).toBe(-(topClip - topPadding));
      }

      it('should adjust the cropped image\'s left and top coordinates per the container padding', function(){

        img.src = bigImagePath; 

        function loader(croppedImage){
          cropped = croppedImage; 
          loaded = true;
        }

        c.cropAndFrame($img, $container, { w: 50, h: 50 }, loader);

        waitsFor(function(){
          return loaded;
        }, timeout);

        runs(function(){
          vetContainerOffset(cropped, $img);
        });

      });

      it('should adjust the cropped image\'s left and top coordinates per the container padding with a wide, short image', function(){

        img.src = wideShortImage; 

        function loader(croppedImage){
          cropped = croppedImage; 
          loaded = true;
        }

        c.cropAndFrame($img, $container, { w: 50, h: 50 }, loader);

        waitsFor(function(){
          return loaded;
        }, timeout);

        runs(function(){
          vetContainerOffset(cropped, $img);
        });

      });

    });

  });

});
