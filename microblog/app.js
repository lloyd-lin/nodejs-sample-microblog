
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var ejs = require('ejs');
var app = express();
var MongoStore = require('connect-mongo')(express);
var settings = require('./setting');
var flash = require("connect-flash");
// all environments

app.configure(function() {
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.engine('html',ejs.__express);
	app.set('view engine', 'html');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.json());
	app.use(express.urlencoded());

	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.cookieParser());
	app.use(express.session({
		secret:settings.cookieSecret,
		store: new MongoStore({
			db:settings.db})
	}));
	app.use(flash());
	app.use(function (req,res,next){
	res.locals.user = req.session? req.session.user: null;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
}	);	
	app.use(app.router);
});


routes(app);
user(app);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


app.get('/list', function(req,res){
	res.render('list', {title:'List',item:[1991,'Lynn','Express','node.js']});
});