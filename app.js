
/**
 * Module dependencies.
 */

var express = require('express')
  , sys = require('util')
  , routes = require('./routes')
  , cradle = require('cradle')
  , port
  , connection = new(cradle.Connection)('https://geoffreymoller.cloudant.com', 443, {
        auth: { username: process.env.DB_API_KEY, password: process.env.DB_API_SECRET }
    });

var db = connection.database('collect');
var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  port = 3000;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  port = 80;
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);

app.get('/getURIByKey', function(req, res){
  var query = req.query;
  var URI = query.URI;
  var callback = getCallback('Link Retrieved!', res);
  db.view('uri/uriPlain', {key: URI}, callback)
});

function getCallback(message, response){
  return function(er, ok){
    if (er) {
      response.send(er);
      throw new Error(JSON.stringify(er));
    }
    else{
      sys.puts(message);
      sys.puts(ok);
      response.send(ok);
    }
  }
}

port = process.env.PORT || port;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
