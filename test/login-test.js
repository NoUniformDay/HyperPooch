/**
 * http://usejsdoc.org/
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('LoginTest');
var helper = require('../app/helper.js');

helper.login('yifan', '123456', 'org1', true).then(function(user) {
	logger.info(user);
}, function(err) {
	logger.error(err);
});