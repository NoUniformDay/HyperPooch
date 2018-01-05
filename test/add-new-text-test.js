'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('AddNewTextTest');
var invoke = require('../app/invoke-transaction.js');

invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'fabtext', 'addNewText', ['Hello', 'Hello World!'], 'admin', 'org1')
.then(function(message) {
    logger.info(message);
}).catch(function(error) {
    logger.error(error);
});
