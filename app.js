
/**
 * Module dependencies.
 */

var express = require('express')
	, session = require('express-session')
	, index = require('./routes/index')
	, parameter = require('./routes/parameter')
	, http = require('http')
	, path = require('path')
	, bodyParser = require('body-parser')
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, blockbia = require('./routes/blockbia')
	, helper = require('./app/helper')
	, search = require('./routes/search')
	, app_login = require('./core/app_login')
	, cf_tracker = require("cf-deployment-tracker-client")
	, fcfeed = require('./routes/fcfeed');

var app = express();

// all environments
app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

//body parser
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));

//passport configuration
passport.use(new LocalStrategy(app_login.pwdAuthenticate));
passport.serializeUser(function(user, done) {
	done(null, user._name);
});
passport.deserializeUser(function(name, done) {
	helper.getUserByUsername(name, 'org1').then((user) => {
		done(null, user);
	});
});

//redirect jQuery (depended by bootstrap)
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));

// redirect bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

// redirect bootstrap dialog
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-dialog/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap-dialog/dist/js'));

// development only
if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//----------ROUTING---------------//

//app.get('/d3', index.d3);
//app.get('/gChart', index.gChart);
app.get('/', index.indexPage);
app.get('/login', index.loginPage);
app.get('/register', index.registerPage);
app.get('/logout', index.logout);
app.get('/fcfeed', fcfeed.fcfeed);

app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
	})
);
app.post('/register', index.register);

//app.get('/blockbia', app_login.isLoggedIn, blockbia.view);
app.get('/blockbia', blockbia.view);
app.post('/api/parameter', parameter.parameter);
app.get('/api/blockbia/:collectionID', blockbia.queryCollection);
app.get('/api/blockbia/:wasteID', blockbia.queryWaste);

app.post('/api/blockbia/addWaste', blockbia.addWaste);
app.post('/api/blockbia/addCollection', blockbia.addCollection);
app.post('/api/blockbia/addConfirmation', blockbia.addConfirmation);
app.post('/api/blockbia/addStamp', blockbia.addStamp);

app.post('/api/parameter', parameter.parameter);

app.get('/api/search/supplier', search.supplier);

app.get('/test/session', index.session);

//-----Send Notification to workspace-----//
app.post('/api/blockbia/sendNotification', blockbia.sendNotification)
//-----Charity space listener------//
//app.get('/api/blockbia/charityConfirmation',blockbia.charityConfirm);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

cf_tracker.track();


