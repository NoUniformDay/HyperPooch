/**
 * getOwner JS script
 * Retrieves Owner data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc'
 * Using Ajax requests
 */

$(document).ready(function() {

	console.log('Document ready');
	get_owners(); //pin

});


// ============================================================================================================================
// REST API call enroll a user in an organisation" method
// extracts data from enroll form, builds JSON object
// POST collection data to REST API
// ============================================================================================================================
var get_owners = function() {
	console.log("inside get_owner")
	

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "POST",
		url : "/channels/mychannel/chaincodes/mycc",
		data : {
			"peers" : "peer1",
			"peers" : "peer2",
			"fcn":"write",
			"args":["testwrite","44444444"]
		},
		contentType : "application/json",
		success : ajaxSuccessful //successful callback fcn
	});

	function ajaxSuccessful(message){
		
		console.log("---------------------------getOwner Successful---------------------------------");
		var transaction = JSON.parse(message);
		console.log(transaction);
		
		//var txID = transaction.transaction_id; 
		
		// successful transaction id
		//FOR()
		//$('.RESPONSE_TABLE').HTML("<TR><TD>"+TRANSACTION.TRANSACTION_ID)
		//console.log("Transaction : " + transaction);
		//console.log("Transaction ID : " + txID);
	}
}
