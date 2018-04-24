/**
 * JS script
 * Retrieves Owner, Vet & Canine data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc' to invoke the model chaincode
 * Using AJAX requests 
 */

	
var numberOfClients = 0;
var numberOfCanines = 0;
var newAdditions = 0;


$(document).ready(function() {

	updateVeterinary(vID);

});
//============================================================================================================================
//Retrieves Veterinary Practice details from the ledger
//Builds an AJAX GET request and send to the server
//GET's from endpoint channels/mychannel/transactions/  
//============================================================================================================================
var updateVeterinary = function(vID){
	// 1. Send POST request to RESR API to read Veterinary data from ledger
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+vID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Veterinary Read Success---------------------------------");	
		var jsonString = JSON.stringify(message);
		var myJSON = JSON.parse(jsonString);
		var parsedJSON = JSON.parse(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);
		
		var vetID = parsedJSON.id;
		var practiceName = parsedJSON.practiceName;
		var address = parsedJSON.address;
		var phone = parsedJSON.contactNumber;
		
		updateVeterinaryTable(parsedJSON);
		
	}
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}


//============================================================================================================================
//Retrieves Owner/Client details from the ledger
//Builds an AJAX GET request and send to the server
//GET's from endpoint channels/mychannel/transactions/  
//============================================================================================================================
var queryOwnerDetails = function(oID){
	// 1. Send POST request to RESR API to read owner data from blockchain ledger
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+oID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Owner Read Success---------------------------------");
		console.log("Success : " +message);	
		var jsonString = JSON.stringify(message);
		var myJSON = JSON.parse(jsonString);
		var parsedJSON = JSON.parse(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);
		
		var ownerID = parsedJSON.id;
		var name = parsedJSON.practiceName;
		var ownerPhoneNumber = parsedJSON.ownerPhoneNumber;
		var ownerAddress = parsedJSON.ownerAddress;
		var vetID = parsedJSON.vetID;
		
		updateOwnerTable(parsedJSON); //updates admin table
	}
	
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}

//============================================================================================================================
//Retrieves Canine details from the ledger
//Builds an AJAX GET request and send to the server
//GET's from endpoint channels/mychannel/transactions/  
//============================================================================================================================
var queryCanineDetails = function(cID) {
	console.log("inside query canine")
	
		var fcn = "read"
		var	args = ["V1"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+cID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Canine Read Success---------------------------------");
		console.log("Success : " +message);	
		var jsonString = JSON.stringify(message);
	
		var myJSON = jQuery.parseJSON(jsonString);
		var canineObject = jQuery.parseJSON(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);

		updateCanineTable(canineObject);
		
	}
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}

}

//============================================================================================================================
///Function that handle data and updates veterinary information table view 
//============================================================================================================================

function updateVeterinaryTable(obj){
	var i = 0;
	var parsedJSON = [];
	
	$(obj).each(function( i ){
  	var vetTable = $(
  		' <tr><td><strong></strong>' +  obj.id + '</td>' +
		' <td>' + obj.practiceName + '</td>' +
		' <td>' + obj.address + '</td>' +
		' <td>' + obj.contactNumber + '</td><br>'); 
	        $(".vetTableBody").append(vetTable);
	 });

}
//============================================================================================================================
///Function that handle data and updates Canine information table view 
//============================================================================================================================

function updateCanineTable(obj){
	var i = 0;
	var parsedJSON = [];
	//console.log("obj canine"+obj);
	
	$(obj).each(function( i ){
  	var canineTable = $(
  		' <tr><td><strong></strong>' +  obj.id + '</td>' +
		' <td>' + obj.name + '</td>' +
		' <td>' + obj.dateOfBirth + '</td>' +
		' <td>' + obj.dateOfInsertion + '</td>' +
		' <td>' + obj.description + '</td>' +
		' <td>' + obj.sex + '</td>' +
		' <td>' + obj.owner.id + '</td>' +
		' <td>' + obj.veterinary.id + '</td><br>'); 
	        $(".canineTableBody").append(canineTable);
	 });
}
//============================================================================================================================
///Function that handle data and updates veterinary information table view 
//============================================================================================================================

function updateOwnerTable(obj){
	var i = 0;
	var parsedJSON = [];
	console.log("obj owner"+obj);
	console.log("owner.name"+obj.name);
	
	$(obj).each(function( i ){
  	var ownerTable = $(
  		' <tr><td><strong></strong>' +  obj.id + '</td>' +
		' <td>' + obj.practiceName + '</td>' +
		' <td>' + obj.contactAddress + '</td>' +
		' <td>' + obj.contactNumber + '</td>' +
		' <td>' + obj.veterinary.id + '</td><br>'); 
	        $(".ownerTableBody").append(ownerTable);
	 });
}



//============================================================================================================================
///Other attempts of reading and writing to the ledger
//============================================================================================================================

var read_vet = function(range) {
	console.log("inside read vet")
	
		var fcn = "read"
		var	args = ["V1"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "/channels/mychannel/chaincodes/mycc?fcn="+fcn+"&args[]="+args+"&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Read Success---------------------------------");
		console.log("Success : " +message);
		console.log(typeof message);
  }
	

	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}



var read_vet = function(range) {
	console.log("inside read vet")
	
		var fcn = "read"
		var	args = ["V1"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "/channels/mychannel/chaincodes/mycc?fcn="+fcn+"&args[]="+args+"&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Read Success---------------------------------");
		console.log("Success : " +message);
		console.log(typeof message);
    }
	

	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}

var read_owners = function(range) {
	console.log("inside read")
	
		var fcn = "read"
		var	args = ["V1"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "/channels/mychannel/chaincodes/mycc?fcn="+fcn+"&args[]="+args+"&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Read Success---------------------------------");
		console.log("Success : " +message);
		console.log(typeof message);
	
		queryResponseData = JSON.stringify(message);
	
		console.log(queryResponseData);
    }
	

	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}



// ============================================================================================================================
// Retrieves data entered into Owners form
// Builds an AJAX request to the server
// POST's to the /channels/mychannel/chaincodes/mycc endpoint 
// to perform a init_owner fcn writing the details to the blockchain ledger
// ============================================================================================================================
var get_owners = function() {
	console.log("inside read_everything")
	
	var JSONOwnerString = JSON.stringify({
		    fcn : "",
		    peers : ["peer1","peer2"],
		    args : ["C0","C5"],
			username : "eric",
			orgName : "org1"
	})
	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "POST",
		url : "/channels/mychannel/chaincodes/mycc",
		data : JSONOwnerString,
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Queried All Collections---------------------------------");
		console.log("Success : " +message);
		console.log("Type of object : "+typeOf(message));
		queryResponseData = JSON.parse(message[0]);
    }
	
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}

var get_canines = function() {
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
		console.log("---------------------------Queried Owner Success---------------------------------");
		console.log("Success : " +message);
		console.log("Type of object : "+typeOf(message));
		queryResponseData = JSON.parse(message[0]);
    }
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}




var read = function() {
	console.log("inside read")
		var fcn = "read"
		var	args = ["HYPER"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "/channels/mychannel/chaincodes/mycc?fcn="+fcn+"&args[]="+args+"&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Read Success---------------------------------");
		console.log("Success : " +message);
		console.log(typeof message);
		
		//alert(message[0].canApprove)
		queryResponseData = JSON.stringify(message);
		queryResponseData1 = JSON.parse(queryResponseData);
		//console.log(message[0]);
		console.log(queryResponseData1);
    }
	

	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}

var vID = "1dabcbd3266d819b3090044087593724092e0cefefc36f7171c1806b63b56c7d"
var oID = "c4ac5832e366eaedcc79f56bbd5428a5d844d6150005f94dc0228058e0a6d8a6"
var cID = "9e01cf7d41d5616213b50a2e84f9c468336475648f3d4e37821dbe6363acd6b3"
