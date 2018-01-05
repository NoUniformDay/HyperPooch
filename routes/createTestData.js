'use strict'

var invoke = require('../app/invoke-transaction.js');

//Function for waiting a parametric number of milliseconds before executing
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

//List of retailers in the mock data
var supplierArray = ["TESCO", "SAINSBURYS", "ALDI", "DUNNES"];
//List of charities in the mock data
var charityArray = ["SVP", "TWIST", "IRISHSOUP", "FOCUS", "HUMANSTOO"];
//List of products in the mock data
var productArray = ["banana", "bread", "cereal", "soup", "apple", "tea", "biscuits"]
//Imports code for committing waste JSON data to the block chain 
//var wasteAdder = require('./invokeAddWaste.js');
//Import code for committing collection JSON data to the block chain 
//var donationAdder = require('./invokeAddDonation.js');

//The maximum number of a single item generated within a mock record
var maxQuantity = 100;
//THe minimum number of a single item generated within a mock record
var minQuantity = 1;
//The maximum number of different items generated within a mock record
var maxNumItems = 5;
//The minimum number of different items generated within a mock record
var minNumItems = 1;
//The number of mock records to be generated
var numRecords = 50;
//maximum UPC code
var maxCode = 9999999;
//The maximum wait time before attempting a transaction
var maxWait = 10000;
//The minimum wait time before attempting a transaction
var minWait = 100;

//Function generates random integer between minimum and maximum parameters
function randInt(min, max){
  return Math.floor(Math.random() * (max - min) + min);
}

//Function generates random date within a specified range of years before an end date
function randomDateBefore(end, range) {
  var start = new Date(end - Math.floor(Math.random()
		  				* 1000		//milliseconds in a second
		  				* 60		//seconds in a minute
		  				* 60		//minutes in an hour
		  				* 24 		//hours in a day
		  				* 365		//days in a ear
		  				* range));	//num years
  return start;
}

function createData(numRecords){
	var invokePromise;
	sleep(Math.floor((Math.random() * (maxWait - minWait)) + minWait)).then(() => {
		if(numRecords == 0){
			return;
		}else{
				var numItems = Math.floor(Math.random() * (maxNumItems - minNumItems)) + maxNumItems;
				console.log(numItems);
				var items = new Array();
				for(var j = 0; j < numItems; j++){
					var quantity = Math.floor(Math.random() * (maxQuantity - minQuantity)) +minQuantity;
					var productIndex = Math.floor(Math.random()*productArray.length);
					items.push({
							product: productArray[productIndex],
							units: "kg",
							category: "ea",
							quantity: quantity.toString(),
							code: Math.floor(Math.random() * maxCode).toString()
							
					});
				}
				//console.log(JSON.stringify(items));
				console.log("&&&&&&&&&&&&&&&&&&&&", randomDateBefore(Date.now(), 2));
				var dataToWrite = {
						supplier: supplierArray[Math.floor(Math.random() * supplierArray.length)],
						timestamp: randomDateBefore(Date.now(), 2).getTime(),
						items: items
				}
				var selection = 1;// Math.round(Math.random() * (1));
				if(selection == 0){
					dataToWrite.type = "Waste";
					dataToWrite.reason = "USE-BY-EXPIRATION";
					
					invokePromise = new Promise(function(resolve, reject){
						Promise.resolve(invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addWaste', [JSON.stringify(dataToWrite)], 'admin', 'org1'))
					});
					
					console.log("DATA:--", JSON.stringify(dataToWrite));
				}else{
					dataToWrite.type = "Collection";
					dataToWrite.recipient = charityArray[Math.floor(Math.random() * charityArray.length)];
					
					console.log("DATA:--", JSON.stringify(dataToWrite));
					invokePromise = //new Promise(function(resolve, reject){
						invoke.invokeChaincode(['localhost:7051'], 'mychannel', 'chaincode', 'addCollection', [JSON.stringify(dataToWrite)], 'admin', 'org1');
					//});
				}
			}
			invokePromise.then(createData(--numRecords));
	});
}

createData(numRecords);
