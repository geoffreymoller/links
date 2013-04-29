var testacular = require('testacular');

module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg:'<json:package.json>',
    meta:{},
    lint:{
      files:['grunt.js']
    }
  });

  // Default task
  grunt.registerTask('default', 'server');

  grunt.registerTask('server', 'start testacular server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start({configFile:'testacular.conf.js'});
  });

};
