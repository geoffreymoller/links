// base path, that will be used to resolve files and exclude
basePath = '.'

// list of files / patterns to load in the browser
files = [

  JASMINE,
  JASMINE_ADAPTER,

  'public/javascripts/vendor/underscore-min.js',

  'public/javascripts/vendor/angular/angular-1.0.0.js',
  'public/javascripts/vendor/angular/angular-resource-1.0.1.min.js',
  'public/javascripts/vendor/angular/angular-mocks-1.0.1.js',

  'public/javascripts/links/pagination.js',
  'public/javascripts/links/data/data.js',

  'test/*.js'

];

// list of files to exclude
exclude = [];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots' || 'progress'
reporter = 'progress';

// web server port
port = 9876;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = true;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = ['PhantomJS'];
//browsers = ['Chrome', 'Firefox', 'Opera', 'Safari', 'PhantomJS'];

// Auto run tests on start (when browsers are captured) and exit
singleRun = true;
