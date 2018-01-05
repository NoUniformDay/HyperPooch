/**
 * http://usejsdoc.org/
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('RegisterTest');
var helper = require('../app/helper.js');

helper.register('yifan', '123456', 'org1', false).then(function(response) {
	logger.info(response);
}, function(err) {
	logger.error(err);
});