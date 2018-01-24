/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Routes/queryAPI');
var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');


exports.addOwner = function(req, res) {
	//var ownerAsJSONString = JSON.stringify(req.body);
	//var ownerArray = [""]
	//peer chaincode invoke -n mycc -c '{"Args":["init_owner”,”O2”, “James Maverick”, “u1”]}’ -C myc 
	var newOwner = ['O2', 'James Maverick', 'u1']
	//logger.info(donationJSONString);
	
	invoke.invokeChaincode(['localhost:7051'], 'myc', 'mycc', 'init_owner', newOwner, 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		var response_body = {};
		response_body["transaction_id"] = message;
		res.status(200).send(JSON.stringify(response_body));
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};


exports.addOwner();