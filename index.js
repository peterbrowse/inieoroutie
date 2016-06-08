var express 			= require('express')
,	pug					= require('pug')
,	sass				= require('node-sass')
,   sassMiddleware		= require('node-sass-middleware')
,	errorhandler		= require('errorhandler')
,	morgan 				= require('morgan')
,   dotenv				= require('dotenv').config({silent: true});

var app = express();

if ('development' == app.get('env')) {
	app.use(sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		debug: true,
		outputStyle: 'extended'
	}));
	app.use(errorhandler({ dumpExceptions: true, showStack: true })); 
}

if ('production' == app.get('env')) {
	app.use(sassMiddleware({
		src: __dirname + '/sass',
		dest: __dirname + '/public',
		debug: false,
		outputStyle: 'compressed'
	}));
}

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined'));

//Set up routes
require('./app/routes.js')(app);

var listener = app.listen(process.env.PORT || 8080, function () {
	console.log('Example app listening on port ' + listener.address().port + ' in ' + process.env.NODE_ENV + ' mode.');
});