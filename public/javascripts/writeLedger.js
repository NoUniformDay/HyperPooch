/**
 * getOwner JS script
 * Retrieves Owner data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc'
 * Using Ajax requests
 */

$(document).ready(function() {

	console.log('Document ready');
	//write_owners(); 
	//write_canines();

});


// ============================================================================================================================
// Retrives data entered into Owners form
// Builds an AJAX request to the server
// POST's to the /channels/mychannel/chaincodes/mycc endpoint 
// to perform a init_owner fcn writing the details to the blockchain ledger
// ============================================================================================================================
var write_owners = function() {
	console.log("inside get_owner")
	
	var JSONString = JSON.stringify({
		    fcn : "write",
			args :[ "HYPERPOOCH","YES BOYS!"],
			username : "eric",
			orgName : "org1"
	})
	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "POST",
		url : "/channels/mychannel/chaincodes/mycc",
		data : JSONString,
		contentType : "application/json; charset=utf-8 ",
		success : ajaxSuccessful //successful callback fcn
	});
	

	function ajaxSuccessful(message){
		
		console.log("---------------------------Transaction Successful---------------------------------");
		console.log(message);
		
	}
}

var write_canines = function() {
	console.log("inside get_owner")
	
	var JSONString = JSON.stringify({
		    fcn : "init_canine",
			args :[ "CANINE0","Bruce"],
			username : "eric",
			orgName : "org1"
	})
	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "POST",
		url : "/channels/mychannel/chaincodes/mycc",
		data : JSONString,
		contentType : "application/json; charset=utf-8 ",
		success : ajaxSuccessful //successful callback fcn
	});
	

	function ajaxSuccessful(message){
		
		console.log("---------------------------Transaction Successful---------------------------------");
		console.log(message);

	}
}
