var express           = require('express'),
    hbs               = require('hbs'),
    redis             = require('redis'),
    mongoose          = require('mongoose'),
    expressValidator  = require('express-validator'),
    mongooseAuth      = require('mongoose-auth'),
    RedisStore        = require('connect-redis')(express);

var settings = require('./lib/settings');

mongoose.connect(settings.app.db);

var User     = require('./lib/models/User.js');

var app = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set("view options", { layout: true });
  app.set('view engine', 'hbs');
  app.use(express.bodyParser({uploadDir:__dirname + '/uploads'}));
  app.use(expressValidator);
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.favicon(__dirname + '/public/images/favicon.ico', { maxAge: 
2592000000 })); 
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({
    secret: 'some secret',
    store: new RedisStore
  }));
  app.use(mongooseAuth.middleware());
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var port = process.argv[2] || 3000;

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);