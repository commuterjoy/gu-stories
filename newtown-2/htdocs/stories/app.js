
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , events = require('./routes/events')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , event = require('./models/events');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', events.readme);
app.get('/events/:id/background', events.background);
app.get('/events/:id/latest', events.latest);
app.get('/events/:id/analysis', events.analysis);
app.get('/events/:id/analysis/:filter', events.analysis);
app.get('/events/:id/pictures', events.pictures);
app.get('/events/:id/people', events.people);
app.get('/events/:id/organisations', events.orgs);
app.get('/events/:id/places', events.locations);
app.get('/events/:id/reaction', events.reaction);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
