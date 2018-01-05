/**
 * 
 */

var queryResponseData;
$(document).ready(function() {
	console.log('txFeedScript ready');
	queryCollections();
	
	console.log("Data from query : " +queryResponseData);
	/*
	$(data).each(function( i ){
		var record = data.Record;
		console.log("Record "+i+" : "+record);
	});
	*/
});


//============================================================================================================================
///Function that handle data and updates fcfeed view with the new collection and waste transaaction
//============================================================================================================================

function updateFoodCloudFeed(obj){
	var i = 0;
	var jsonFromRetailer = [];
	
	$(obj).each(function( i ) {
    	var transactionStart = $(' <div class="transaction"><div class="header"><strong> Transaction id:</strong>' +  obj.collectionID + '</div>' +
	    ' <p><em> Type : </em>' + obj.type + '</p>' +
		' <p><em> Recipient : </em>' + obj.recipient + '</p>' +
		' <p><em> Supplier : </em>' + obj.supplier + '</p>' +
		' <p><em> Timestamp : </em>' + obj.timestamp + '</p><br>');
    	
    	for(var k = 0; k < obj.items.length; k++){
	        var code = obj.items[k].code;
	        var product = obj.items[k].product;
	        var quantity = obj.items[k].quantity;
	        var units = obj.items[k].units;
	        var category = obj.items[k].category;
	        
	        var tempJSON = {
	             code : code,
	             product : product,
	             quantity : quantity,
	             units : units,
	             category : category
	        };
	
	        var transactionItems = $('<p class="code"><em> Code : </em>' + code + '</p>' +
    		'<p><em>Product : </em>' + product + '</p>' +
    		'<p><em>Quantity : </em>' + quantity + '</p>' +
    		'<p><em>Units : </em>' + units + '</p>' +
    		'<p><em>Category : </em>' + category + '</p><br>');
	        
	        $(transactionStart).append(transactionItems);
	        
	        jsonFromRetailer[i] = tempJSON;
	        i++;
    	}
	    	var transactionEnd = $('<hr><center><button type="button" class="btn btn-default approve">Approve</button></center><br></div>');
	    	$(transactionStart).append(transactionEnd);
	    	$('.flex-container').append(transactionStart);	    	
	});

    var str2 = JSON.stringify(jsonFromRetailer);
	var JSONString = JSON.stringify({
		items : jsonFromRetailer
	});
}

//============================================================================================================================
///Function that calls uses AJAX to call the  REST API to query all the collection data in Blockchain
//This data is then iterated through to populate feed in fcFeed.jade 
//============================================================================================================================
function queryCollections(){
	$.ajax({ 
        type: "POST",
        url: "/api/blockbia/getAllCollections",
        success: ajaxSuccessful,
        failure : ajaxFailure
	});
	
	function ajaxSuccessful(message){
		console.log("---------------------------Queried All Collections---------------------------------");
		console.log("Success : " +message);
		console.log("Type of object : "+typeOf(message));
		queryResponseData = JSON.parse(message[0]);
    }
	function ajaxFailure(message){
		console.log("---------------------------FAILED Querying All Collections---------------------------------")
		console.log("Failure response message : " +message);
    }
}

function typeOf (obj) {
	  return {}.toString.call(obj).split(' ')[1].slice(0, -1).toLowerCase();
}

