'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('StartNetwork');
var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var joinChannel = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');


Promise.resolve().then(function() {
		return createChannel.createChannel('mychannel', '../artifacts/channel/mychannel.tx', 'admin', 'org1');
	})
	.then(function(message) {
		logger.info(message);
		setTimeout(function() {
		  	Promise.resolve().then(function() {
		  		return joinChannel.joinChannel("mychannel", ['localhost:7051'], 'admin', 'org1');
		  	}, function(error) {
		  		logger.error(error);
		  	}).then(function(message) {
		  		logger.info(message);
		  		return joinChannel.joinChannel("mychannel", ['localhost:8051'], 'admin', 'org2');
			}, function(error) {
				logger.error(error);
			}).then(function(message) {
				return install.installChaincode(['localhost:7051'], 'chaincode', 'github.com/chaincode', 'v2', 'admin', 'org1');
				logger.info(message);
			}, function(error) {
			  logger.error(error);
			}).then(function(message) {
			  logger.info(message);
			  return install.installChaincode(['localhost:8051'], 'chaincode', 'github.com/chaincode', 'v2', 'admin', 'org2');
			}, function(error) {
			  logger.error(error);
			}).then(function(message) {
			  logger.info(message);
			  setTimeout(function() {
				  Promise.resolve().then(function() {
					  return instantiate.instantiateChaincode('mychannel', 'chaincode', 'v2', 'Init', [], 'admin', 'org1');
				  }).then(function(message) {
					  logger.info(message);
					  return;
				  }, function(error) {
					  logger.error(error);
				  });
			  }, 1000);
			  return;
			});
		}, 1000);
	}, function(error) {
		logger.error(error);
	});
