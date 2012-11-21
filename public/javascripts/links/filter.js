angular.module('links.filter', []).
  filter('date', function() {
    return function(value) {
      var date = value.date || value.date_created; 
      return (new Date(date)).toDateString();
    }
  }).
  filter('uri', function() {
    return function(value) {
      return value.uri || value.URI;
    }
  }).
  filter('selectedItem', function() {
    return function(value) {
      if(this.$index === this.selectedItem){
        value += ' selected';
      } 
      return value;
    }
  }).
  filter('selectedNote', function() {
    return function(value) {
      if(this.$index === this.selectedNote){
        value += ' selected';
      } 
      return value; 
    }
  }).
  filter('truncate', function () {
    return function (text, length, end) {
      if (isNaN(length)){
        length = 10;
      }
      if (end === undefined){
        end = "...";
      }
      if (text.length <= length || text.length - end.length <= length) {
        return text;
      }
      else {
        return String(text).substring(0, length-end.length) + end;
      }
    };
  }).
  filter('youTubeEmbedUrl', function () {
    return function (uri) {
      var id = uri.split('?')[1];
      id = qs.parse(id).v;
      return 'http://www.youtube.com/embed/' + id + '?hd=1';
    };
  }).
  filter('youTubeThumbnail', function () {
    return function (uri) {
      var id = uri.split('?')[1];
      id = qs.parse(id).v;
      if(id.indexOf('#') !== -1){
        id = id.split('#')[0];
      }
      return id; 
    };
  }).
  filter('vimeoEmbedUrl', function () {
    return function (uri) {
      var id = uri.split('vimeo.com/')[1];
      return 'http://player.vimeo.com/video/' + id;
    };
  })
