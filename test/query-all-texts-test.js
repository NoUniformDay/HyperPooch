/**
 * http://usejsdoc.org/
 */
'use strict';

var log4js = require('log4js');
var logger = log4js.getLogger('QueryAllTextsTest');
var query = require('../app/query-transaction.js');

query.queryChaincode(['localhost:7051'], 'mychannel', 'fabtext', 'queryAllTexts', [], 'admin', 'org1')
.then(function(message) {
    logger.info(message);
}).catch(function(error) {
    logger.error(error);
});