/**
 * http://usejsdoc.org/
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('GetTest');
var helper = require('../app/helper.js');

helper.getRegisteredUsers('jade', 'org1', true).then(function(response) {
	logger.info(response);
}, function(err) {
	logger.error(err);
});