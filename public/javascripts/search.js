

$(document).ready(function() {
	$("#canine_search_button").click(queryCanine);
	$("#owner_search_button").click(queryOwner);
	
});
//============================================================================================================================
//============================================================================================================================
var queryOwner = function(oID){
	//1. Extract Transaction ID from Search box
	var oID = $("#owner_search_text").val();
	console.log("search value :"+oID);
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
		updateOwnerResultsTable(parsedJSON); //updates admin table
	}
	
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}
}

//============================================================================================================================
//============================================================================================================================
var queryCanine = function(cID) {
	console.log("inside query canine")
	var cID = $("#canine_search_text").val();
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
		//console.log("canine object : "+canineObject);
		updateCanineResultsTable(canineObject);
		
	}
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}

}

//============================================================================================================================
///Function that handle data and updates veterinary information table view 
//============================================================================================================================

function updateOwnerResultsTable(obj){
	
	var ownerTable = $(
		  		' <tr><td><strong></strong>' +  obj.id + '</td>' +
				' <td>' + obj.practiceName + '</td>' +
				' <td>' + obj.contactAddress + '</td>' +
				' <td>' + obj.contactNumber + '</td>' +
				' <td>' + obj.veterinary.id + '</td><br>'); 
	 $(".ownerSearchTableBody").append(ownerTable);
			
}

function updateCanineResultsTable(obj){

  	var canineTable = $(
  		' <tr><td><strong></strong>' +  obj.id + '</td>' +
		' <td>' + obj.name + '</td>' +
		' <td>' + obj.dateOfBirth + '</td>' +
		' <td>' + obj.dateOfInsertion + '</td>' +
		' <td>' + obj.description + '</td>' +
		' <td>' + obj.sex + '</td>' +
		' <td>' + obj.owner.id + '</td>' +
		' <td>' + obj.veterinary.id + '</td><br>'); 
	        $(".canineSearchTableBody").append(canineTable);
	
}

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