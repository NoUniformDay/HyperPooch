/**
 * http://usejsdoc.org/
 */
var invoke = require('../app/invoke-transaction.js');
var query = require('../app/query-transaction.js');
var log4js = require('log4js');
var logger = log4js.getLogger('Fabtext');

//============================================================================================================================
//API POST : 'api/blockbia/addCollection' :  Add collection
//Takes data from AJAX POST request in parseForms.js and commits waste data JSON to blockchain
//============================================================================================================================
exports.addCollection = function(req, res) {
	console.log("PING1");
	var collectionJSONString = JSON.stringify(req.body);
	console.log("Collection JSON string : "+collectionJSONString);


	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addCollection', [collectionJSONString], 'admin', 'org1')
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

var timestamp = Date.now || function() { //apparently Date.now is not supported in all browsers
	  return +new Date;
};


//============================================================================================================================
// API POST : 'api/blockbia/addWaste' : Add waste
// Takes data from AJAX POST request in parseForms.js and commits waste data JSON to blockchain
//============================================================================================================================
exports.addWaste = function(req, res) {

	var wasteJSONString = JSON.stringify(req.body); //JSON data from AJAX POST request in parseForm.js
	console.log(wasteJSONString);
	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addWaste', [wasteJSONString], 'admin', 'org1')
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

//============================================================================================================================
//API POST : 'api/blockbia/addConfirmation' :  Add charity confirmation transaction
//Commits charity response to blockchain to confirm donation has been recieved
//Confirmation : charityID , collectionID, response, timestamp
//============================================================================================================================
exports.addConfirmation = function(req, res) {
	//parse JSON
	var charityConfirm = req.body;
	charityConfirm.type = "Confirmation";

	var charityResponseJSONString = JSON.stringify(charityConfirm);

	console.log("Charity response JSON String : "+charityResponseJSONString);

	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addConfirmation', [charityResponseJSONString], 'admin', 'org1')
	.then(function(message) {
		var text = true;
		console.log("---------------------------Charity successfully committed to ledger---------------------------------");
		logger.info(message);
		res.status(200).send();
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};

//============================================================================================================================
//API POST : 'api/blockbia/addStamp' :  Add FoodCloud confirmation transaction
//Commits a reference of the donation to the blockchain as FoodCloud's stamp of approval
//Stamp : collectionID, timestamp
//============================================================================================================================
exports.addStamp = function(req, res) {

	var foodCloudStampJSONString = JSON.stringify(req.body);
	console.log("FoodCloud stamp JSON string " + foodCloudStampJSONString);

	invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addStamp', [foodCloudStampJSONString], 'admin', 'org1')
	.then(function(message) {
		console.log("-----------------------FoodCloud Stamp Added--------------------------");
		logger.info(message);
		res.status(200).send(message);
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};

//============================================================================================================================
// API GET request calls this to query collection entry on blockchain based on ID supplied
//============================================================================================================================
exports.queryCollection = function(req, res) {
	var collectionID = req.params.collectionID;

	console.log(collectionID);

	if(collectionID === undefined) {
		return;
		res.status(404).send('NOT FOUND');
	}

	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getCollectionByID', [collectionID], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		if(message.length > 0) {
			res.status(200).send(message);
			return;
		} else {
			res.status(404).send('NOT FOUND');
			return;
		}

	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
		return;
	});
};

//============================================================================================================================
//API POST Function to send notification to WORKSPACE CHARITIES be called after retailer tx commit
//============================================================================================================================
exports.sendNotification = function(req, res){
	console.log("Inside send notification to charity");

	var URL = "https://watson-reporting.eu-gb.mybluemix.net/blockchain"; //Workspace Bluemix App URL
	var Client = require('node-rest-client').Client;
	var client = new Client();
	var charityJSONString = JSON.stringify(req.body);

	var args = {
		    data: charityJSONString,
		    headers: {
		    	"Content-Type": "application/json"
		    }
		};

	//Creating a POST request to send to ngrok server
	client.post(URL, args, function (data, response) {
		//console.log("\n");
		//console.log(data);
	    //console.log("\n");
	    //console.log(response);
		console.log("Charity Successfully notified");
	});
	
	res.status(200).send('OK');
};

/*
//============================================================================================================================
//API GET request calls recieving charity response through ngrok
//============================================================================================================================
exports.charityConfirmation = function(req, res) {
	var jsonString = JSON.stringify(req.body);
	console.log(jsonString);
};


*/

//============================================================================================================================
//API GET request calls this to query for waste entry on blockchain based on ID supplied
//============================================================================================================================
exports.queryWaste = function(req, res) {
	var wasteID = req.params.wasteID;

	console.log(wasteID);

	if(wasteID === undefined) {
		return;
		res.status(404).send('NOT FOUND');
	}

	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getWaste', [wasteID], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		if(message.length > 0) {
			res.status(200).send(message);
			return;
		} else {
			res.status(404).send('NOT FOUND');
			return;
		}

	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
		return;
	});
};

//============================================================================================================================
//API GET request calls this to query for all Collection entries to blockchain
//============================================================================================================================
exports.getAllCollections = function(req, res) {
	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getAllCollections', [], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		res.status(200).send(message);
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};


exports.view = function(req, res) {
	  res.render('addCollection', { title: 'addCollection' });
};

//============================================================================================================================
//API GET request calls this to query for all Waste entries to blockchain
//============================================================================================================================
exports.getAllWaste = function(req, res) {
	query.queryChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'getAllCollections', [], 'admin', 'org1')
	.then(function(message) {
		logger.info(message);
		res.status(200).send(message);
	}, function(error) {
		logger.error(error);
		res.status(500).send(error);
	});
};

// Export view to render page
exports.view = function(req, res) {
	  res.render('addView', { title: 'addView' });
};
