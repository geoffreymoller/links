// Testacular configuration

// base path, that will be used to resolve files and exclude
basePath = '';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'public/javascripts/vendor/jquery-2.0.3.min.js',
  'public/javascripts/vendor/jquery.imagesloaded.js',
  'public/javascripts/vendor/underscore-min.js',
  'public/javascripts/vendor/angular/angular.min.js',
  'public/javascripts/vendor/angular/angular-resource.min.js',
  'public/javascripts/vendor/angular/angular-mocks.js',
  'public/javascripts/links/app.js',
  'public/javascripts/links/filter.js',
  'public/javascripts/links/pagination.js',
  'public/javascripts/links/controllers/search.js',
  'public/javascripts/links/ui/ui.js',
  'public/javascripts/links/data/data.js',
  'test/*.js',
  'test/controllers/*.js'
];

// list of files to exclude
exclude = [];

// test results reporter to use
// possible values: dots || progress
reporter = 'progress';

// web server port
port = 8081;

// cli runner port
runnerPort = 9100;

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_DEBUG;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
browsers = ['PhantomJS'];

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
