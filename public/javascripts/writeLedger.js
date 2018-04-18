/**
 * getOwner JS script
 * Retrieves Owner data from the blockchain
 * Using to the REST API endpoint 'http://localhost:4000/channels/mychannel/chaincodes/mycc'
 * Using Ajax requests
 */

 //

$(document).ready(function() {
	console.log('Document ready');
	
    $("#closeModal").click(close_modal);
	$("#owner_submit").click(write_owners);
	$("#canine_submit").click(write_canines);
	
});



// ============================================================================================================================
// Retrives data entered into Owners form
// Builds an AJAX request to the server
// POST's to the /channels/mychannel/chaincodes/mycc endpoint 
// to perform a init_owner fcn writing the details to the blockchain ledger
// ============================================================================================================================
var write_owners = function() {
	console.log("inside get_owner")
	
	var ownerID =  $('#ownerID').val();
	var ownerName =  $('#ownerName').val();
	var ownerPhoneNumber =  $('#ownerPhoneNumber').val();
	var ownerAddress =  $('#ownerAddress').val();
	var vetID = $('#vetID').val();
	
	console.log("inside write owner")
	var JSONString = JSON.stringify({
		fcn : "init_owner",
		args : [ownerID,ownerName,ownerPhoneNumber,ownerAddress,vetID],
		username : "eric",
		orgName : "org1",
		peers : ["peer1","peer2"]
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
		console.log("---------------------------Owner Write Transaction Successful---------------------------------");
		console.log(message);
		incrementOwnerCount();
		incrementNewAdditions();
		show_modal(message);
		queryOwnerDetails(message);
	}
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}

}
var write_canines = function() {
	console.log("inside write_canines")
	
	var canineID =  $('#canineID').val();
	var canineName =  $('#canineName').val();
	var dateOfBirth =  $('#dateOfBirth').val();
	var dateOfChipInsertion =  $('#dateOfChipInsertion').val();
	var description =  $('#description').val();
	var gender =  $('#gender').val();
	var premiseAddress =  $('#premiseAddress').val();
	var ownerID =  $('#ownerID').val();
	var vetID = $('#vetID').val();

	var JSONString = JSON.stringify({
		fcn : "init_canine",
		args : [canineID,canineName,dateOfBirth,dateOfChipInsertion,description,gender,premiseAddress,ownerID,vetID],
		username : "eric",
		orgName : "org1",
		peers : ["peer1","peer2"]
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
		incrementCanineCount();
		incrementNewAdditions();
		show_modal(message);
		
	}
}

//============================================================================================================================
//Retrives data entered into Owners form
//Builds an AJAX request to the server
//POST's to the /channels/mychannel/chaincodes/mycc endpoint 
//to perform a init_owner fcn writing the details to the blockchain ledger
//============================================================================================================================
var write_vet = function() {
	console.log("inside write_vet")
	
	var vetID =  "V1";
	var practiceName = "Glenina Veterinary"
	var address = "Renmore, Galway"
	var contactNumber = "+353858469400"
	
		
	var JSONString = JSON.stringify({
		fcn : "init_vet",
		args : [vetID,practiceName,address,contactNumber],
		username : "eric",
		orgName : "org1",
		peers : ["peer1","peer2"]
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
		console.log("---------------------------Vet Write Transaction Successful---------------------------------");
		console.log(message);
		queryVeterinaryDetails(message);	
	}
	function ajaxFailure(message){
		console.log("---------------------------Transaction Failure---------------------------------");
		console.log(message);
	}

}

//============================================================================================================================
// UTILITY FUNCTIONS
// Functions for showing and hiding model, incrementing counters 
//============================================================================================================================
var show_modal = function(message){
	$('#txmodal').show();
	$('<p> Transaction ID : '+message+'</p>').appendTo('.modal-body');
	$('html, body').animate({ scrollTop: $('#txmodal').offset().top }, 'slow');
}

var close_modal = function(message){
	$('.modal-body').empty();
	$('#txmodal').hide();	
}

var incrementOwnerCount = function(){
	var val = $("#clientCount").text();
	var newval = parseInt(val);
	newval = newval +1
	$("#clientCount").empty();
	$("#clientCount").text(newval);
}

var incrementCanineCount = function(){
	var val = $("#canineCount").text();
	var newval = parseInt(val);
	newval = newval +1
	$("#canineCount").text(newval);
}

var incrementNewAdditions = function(){
	var val = $("#newAdditionsCount").text();
	var newval = parseInt(val);
	newval = newval +1;
	$("#newAdditionsCount").text(newval);
}
var checkVetAdded = function(){
	console.log("check vet")
	if($(".vetTableBody").length == 1){
		return true;
	}
	return false;
}
