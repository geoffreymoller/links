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
  grunt.registerTask('default', 'lint test');

  grunt.registerTask('server', 'start testacular server', function () {
    //Mark the task as async but never call done, so the server stays up
    var done = this.async();
    testacular.server.start({configFile:'testacular.conf.js'});
  });

  grunt.registerTask('test', 'run tests', function () {

    var testCmd = process.platform === 'win32' ? 'testacular.cmd' : 'testacular';
    var testArgs = process.env.TRAVIS ? ['start', '--single-run', '--no-auto-watch', '--reporter=dots', '--browsers=Firefox'] : ['run'];

    var specDone = this.async();
    var child = grunt.utils.spawn({cmd:testCmd, args:testArgs}, function (err, result, code) {
      if (code) {
        grunt.fail.fatal("Test failed...", code);
      } else {
        specDone();
      }
    });

    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

};
