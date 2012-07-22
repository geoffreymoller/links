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
  filter('selectedNote', function() {
    return function(value) {
      if(this.$index === this.active){
        value += ' active';
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
  });
