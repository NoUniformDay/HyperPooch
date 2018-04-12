/**
 * JS script
 * Retrieves Owner, Vet & Canine data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc' to invoke the model chaincode
 * Using AJAX requests 
 */

var vID = "11d8b7283f38f96208a2a9e4a01a81164e717a7db60a36766ce33ba587be5110"
var oID = "316a39947b914503d134878f49feff118f08ab32f8cf6ed1f4711f6548c32b73"
var cID = "d3b50f940b2fd648e3124a89a21fcc60d866c0b43150008e0366ba8bb0769ece"
	
var numberOfClients = 0;
var numberOfCanines = 0;
var newAdditions = 0;


$(document).ready(function() {

	console.log('Document ready');
	queryVeterinaryDetails("b4a0fa6fc096f567c033ef55e9a4201c0ad85475345bf17f51a8d874a63c0719");

	//queryVeterinaryDetails(vID);
	//queryOwnerDetails(oID);
	//queryCanineDetails(oID);
	
	

});
//============================================================================================================================
//Retrieves Veterinary Practice details from the ledger
//Builds an AJAX GET request and send to the server
//GET's from endpoint channels/mychannel/transactions/  
//============================================================================================================================
var queryVeterinaryDetails = function(vID){
	// 1. Send POST request to RESR API to read Veterinary data from ledger
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+vID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Vet Read Success---------------------------------");
		console.log("Success : " +message);	
		var jsonString = JSON.stringify(message);
		var myJSON = JSON.parse(jsonString);
		var parsedJSON = JSON.parse(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);
		
		
		var vetID = parsedJSON.id;
		var practiceName = parsedJSON.practiceName;
		var address = parsedJSON.address;
		var phone = parsedJSON.contactNumber;
		
		//$(".vetTableBody").tr.
		
		console.log("Vet ID : "+vetID);
		console.log("Practice name : "+practiceName);
		console.log("Address : "+address);

		//Update UI View Table with parsed JSON data
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
	// 1. Send POST request to RESR API to read Vet data from blockchain ledger
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+oID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Vet Read Success---------------------------------");
		console.log("Success : " +message);	
		var jsonString = JSON.stringify(message);
		var myJSON = JSON.parse(jsonString);
		var parsedJSON = JSON.parse(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);
		
		var vetID = parsedJSON.id
		var practiceName = parsedJSON.practiceName;
		var address = parsedJSON.address
		
		console.log("Vet ID : "+vetID);
		console.log("Practice name : "+practiceName);
		console.log("Address : "+address);
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
	console.log("inside read canine")
	
		var fcn = "read"
		var	args = ["V1"];
		var username = "eric"
		var	orgName = "org1"
		var	peer = "peer1"
		//var tID = "e9ac272004c7840d12b6c998d0b393f93f051081f822cc1c47e48a247eb80edc"

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "GET",
		url : "http://localhost:4000/channels/mychannel/transactions/"+cID+"?peer=peer1&username=eric&orgName=org1",
		contentType : "application/json; charset=utf-8",
		success : ajaxSuccessful, //successful callback fcn
		failure : ajaxFailure
	});
	

	function ajaxSuccessful(message){
		console.log("---------------------------Vet Read Success---------------------------------");
		console.log("Success : " +message);	
		var jsonString = JSON.stringify(message);
		var myJSON = JSON.parse(jsonString);
		var parsedJSON = JSON.parse(myJSON.transactionEnvelope.payload.data.actions["0"].payload.action.proposal_response_payload.extension.results.ns_rwset[1].rwset.writes["0"].value);
		
		console.log(parsedJSON);
		//var vetID = parsedJSON.id
		//var practiceName = parsedJSON.practiceName;
		//var address = parsedJSON.address
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
  		' <tr><td><strong></strong>' +  obj.id + '</td' +
	    ' <td>' + obj.id + '</td>' +
		' <td>' + obj.practiceName + '</td>' +
		' <td>' + obj.address + '</td>' +
		' <td>' + obj.contactNumber + '</td>><br>'); 
	        $(".vetTableBody").append(vetTable);
	 });

}



/*
 * attempts of building AJAX requests to query blockchain
 * by key value 
 */

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
		
		//alert(message[0].canApprove)
		//var buf = JSON.stringify(message);
		//var temp = JSON.parse(message.toString(); 
		
		//queryResponseData = JSON.stringify(message[0]);
		//queryResponseData1 = JSON.parse(message[0]);
		//queryResponseData2 = JSON.parse(message[1]);
		//console.log(message.docType);
		//console.log(message[0]);
		//console.log(queryResponseData);
		//console.log(temp);
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
		
		//alert(message[0].canApprove)
		//var buf = JSON.stringify(message);
		//var temp = JSON.parse(message.toString(); 
		
		//queryResponseData = JSON.stringify(message[0]);
		//queryResponseData1 = JSON.parse(message[0]);
		//queryResponseData2 = JSON.parse(message[1]);
		//console.log(message.docType);
		//console.log(message[0]);
		//console.log(queryResponseData);
		//console.log(temp);
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
		
		//alert(message[0].canApprove)
		queryResponseData = JSON.stringify(message);
		//queryResponseData1 = JSON.parse(message[0]);
		//queryResponseData2 = JSON.parse(message[1]);
		//console.log(message.docType);
		//console.log(message[0]);
		//console.log(queryResponseData);
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
