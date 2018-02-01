
/*
 * GET home page.
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Routes/Index');
var passport = require('passport');
var helper = require('../app/helper');

exports.indexPage = function(req, res) {
	if(req.isAuthenticated()) {
		res.render('index', { title: 'Express', user: req.user });
	} else {
		res.render('index', { title: 'Express'});
	}
};

exports.loginPage = function(req, res) {
	res.render('login', { title: 'Login' });

};

exports.registerPage = function(req, res) {
	res.render('register', { title: 'Register' });
};

exports.register = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;
	var userOrg = req.body.userOrg;
	
	if(username === undefined || password === undefined || userOrg === undefined) {
		res.status(500).send('OK');
		return;
	}
	
	logger.info('username: ', username);
	logger.info('passport: ', password);
	logger.info('organization: ', userOrg);
	
	helper.register(username, password, userOrg, false).then((user) => {
    	logger.info('Register: ', user);
//        passport.authenticate('local') (req, res, function() {
//        	res.redirect('/');
//        });
	}, (err) => {
		logger.error(err);
		res.redirect('/register');
	});
}


exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.session = function(req, res) {
	if(req.session.page_views) {
		req.session.page_views++;
		res.send("Your visited this page " + req.session.page_views + " times");
	} else {
		req.session.page_views = 1;
		res.send("Welcome to this page for the first time!");
	}
};

