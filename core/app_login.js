/**
 * http://usejsdoc.org/
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('AppLogin');
var helper = require('../app/helper.js');

var pwdAuthenticate = function(username, password, userOrg) {
	return new Promise((resolve, reject) => {
		helper.login(username, password, userOrg, false).then((user) => {
			if(user) {
				return resolve(user);
			} else {
				return reject('User is null');
			}
		}, (err) => {
			logger.error(error);
			return '' + err;
		});
	});
}

//route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();
    // if they aren't redirect them to the home page
    res.redirect('/');
}

exports.pwdAuthenticate = pwdAuthenticate;
exports.isLoggedIn = isLoggedIn;

//pwdAuthenticate('yifan', '123456', 'org1').then((user) => {
////	if(user) {
////		login.info('User: ', user);
////	} else {
////		loggin.error('User is null');
////	}
//	logger.info(user);
//}, (err) => {
//	logger.error(err);
//});

//pwdAuthenticate('yifan', '123456', 'org1');