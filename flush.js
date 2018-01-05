'use strict';

/**
 * ------------READ ME------------
 * To interact with the CLI through this node
 * you will need to npm install shelljs
 * this node flushes the app of data, downs docker containers and resets network
 * then it rebuilds them
 */
var log4js = require('log4js');
var logger = log4js.getLogger('StartNetwork');
var helper = require('./app/helper.js');
var createChannel = require('./app/create-channel.js');
var joinChannel = require('./app/join-channel.js');
var install = require('./app/install-chaincode.js');
var instantiate = require('./app/instantiate-chaincode.js');
var shell = require('shelljs')


Promise.resolve().then(function() {
	shell.exec('./clear.sh') //Clear docker containers and network by calling clear script
	}).then(function (){
		shell.cd('artifacts'); //change directory to artifacts where docker compose file resides
	}).then(function(){
		shell.exec('docker-compose -f docker-compose.yaml up -d'); //build docker-compose config file to run containers and network
	}).then(function(){
		return createChannel.createChannel('mychannel', '../artifacts/channel/mychannel.tx', 'admin', 'org1');
	})
	.then(function(message) {
		logger.info(message);
		setTimeout(function() {
		  	Promise.resolve().then(function() {
		  		return joinChannel.joinChannel("mychannel", ['localhost:7051', 'localhost:7056'], 'admin', 'org1');
		  	}, function(error) {
		  		logger.error(error);
		  	}).then(function(message) {
		  		logger.info(message);
		  		return joinChannel.joinChannel("mychannel", ['localhost:8051', 'localhost:8056'], 'admin', 'org2');
			}, function(error) {
				logger.error(error);
			}).then(function(message) {
				return install.installChaincode(['localhost:7051', 'localhost:7056'], 'chaincode', 'github.com/chaincode', 'v2', 'admin', 'org1');
				logger.info(message);
			}, function(error) {
			  logger.error(error);
			}).then(function(message) {
			  logger.info(message);
			  return install.installChaincode(['localhost:8051', 'localhost:8056'], 'chaincode', 'github.com/chaincode', 'v2', 'admin', 'org2');
			}, function(error) {
			  logger.error(error);
			}).then(function(message) {
			  logger.info(message);
			  setTimeout(function() {
				  Promise.resolve().then(function() {
					  return instantiate.instantiateChaincode('mychannel', 'chaincode', 'v2', 'Init', [], 'admin', 'org1');
				  }).then(function(message) {
					  shell.cd('../routes');
					  console.log("Recreating test data");
					  shell.exec('node createTestData.js');
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

