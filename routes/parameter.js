/**
 * http://usejsdoc.org/
 */
var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');
var log4js = require('log4js');
var logger = log4js.getLogger('Parameter');

var queryBuilder = require('../sql/query-builder');
var queryPoster = require('../sql/query-poster');

exports.parameter = function(req, res) {

	logger.info(req.body);
	
	queryBuilder.loadJSON(req.body).then(function(message) {
		logger.info(message);
		return queryBuilder.buildQuery();
	}).then(function(sql) {
		console.log(sql);
		var query_json = {};
		query_json['query'] = sql;
		console.log(JSON.stringify(query_json));
		return queryPoster.postQuery(JSON.stringify(query_json));
	}).then(function(result) {
		logger.info(result);
	    res.status(200).send(result);
	});
};