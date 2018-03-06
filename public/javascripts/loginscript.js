/**
 * Login JS script
 * Enrolls or logs in a user for a certain organisation
 * Takes given params and posts to the REST API
 * Using Ajax requests
 */

$(document).ready(function() {

	console.log('Document ready');
	$('#enroll').click(enroll_user);

});


// ============================================================================================================================
// REST API call enroll a user in an organisation" method
// extracts data from enroll form, builds JSON object
// POST collection data to REST API
// ============================================================================================================================
var enroll_user = function() {
	console.log("inside enroll_user")
	// 1.Parse values from enroll/login
	var uname = $('#username').val();
	var oName = $('#orgName').val();
	
	console.log("username :"+username);
	console.log("org name :"+orgName);

	// 2.Create JSON object from values
	// 3.Stringify object to string
	var JSONString = JSON.stringify({
		username : uname,
		orgName : oname
	});

	// 4. POST data to API to commit to blockchain
	$.ajax({
		type : "POST",
		url : "/users",
		data : JSONString,
		contentType : "application/x-www-form-urlencoded; charset=utf-8",
		success : ajaxSuccessful //successful callback fcn
	});

	function ajaxSuccessful(message){
		
		console.log("---------------------------Users successfully enrolled into system---------------------------------");
		var transaction = JSON.parse(message);
		var txID = transaction.transaction_id; 
		// successful transaction id
		FOR()
		$('.RESPONSE_TABLE').HTML("<TR><TD>"+TRANSACTION.TRANSACTION_ID)
		console.log("Transaction : " + transaction);
		console.log("Transaction ID : " + txID);
	}
}
