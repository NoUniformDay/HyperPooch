/**
 * JS script
 * Retrieves Owner data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc'
 * Using Ajax requests
 */

$(document).ready(function() {

	console.log('Document ready');
	//get_owners();  //retrieves owners from the ledger
	//get_canines();
	read_owners(); //basic read test
	read_vet();
	//read();

});

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
