/**
 * 
 */

//WASTE TEST DATA 
	/*
	{

		"type" : "Waste",

		"supplier" : "TESCO:1234",

		"reason" : "USE-BY_EXPIRATION",

		"timestamp" : "2017-06-28T12:34:00",

		"items" : [

		{"code" : "5057008170285", "product" : "Tesco Chocolate New Potatoes 150g", "quantity" : 1, "units" : "EA", "category" : "05.2"},

		{"code" : "8000500209769", "product" : "Kinder Mini Chocolate 30g", "quantity" : 2, "units" : "EA", "category" : "05.2"}

		]

	}`
	
//COLLECTION TEST DATA 
{
	"collectionID" : "C76347",
	
	"type" : "Collection",

	"supplier" : "TESCO:1234",

	"recipient" : "FS:0x272777y",

	"timestamp" : "2017-06-28T12:34:00",

	"items" : [

				{"code" : "5057008918405", "product" : "Gingerbread Lollipop Rosie/Rory The Rabbit 61g", "quantity" : 4, "units" : "EA", "category" : "05.1"},

				{"code" : "0000003248461", "product" : "Maris Piper Potato 2kg (C)", "quantity" : 2000, "units" : "g", "category" : "04.2"},

				{"code" : "5010029220100", "product" : "Alpen Light Jaffa Cake 5 Pack 95g", "quantity" : 2, "units" : "EA", "category" : "07.2.1"},

				{"code" : "8888264688262", "product" : "Green/Yellow Bananas Loose", "quantity" : 12, "units" : "EA", "category" : "04.1"}

]

}
*/

//var sendNotification = require('./sendNotification.js');
var i = 1;
var j = 1;

//HASHMAP for workspace
var map = {
	"goal" : "5979ff66e4b0d06504b607a2",
	"oxfam" : "5979ff75e4b03d63161c2665",
	"unicef" : "5981a4ffe4b012dc2d3aeef4",
	"Irish Soup Kitchen" : "5981a50be4b096579c3e0152",
	"Saint Vincent DePaul" : "5981a5b2e4b013d32fb53b9a"
}

function test(){
	console.log("map.get(goal) returns : "+get("goal"));
	var key = "trocaire";
	console.log("Trocaire wsID : "+get(key)); //works
}

function get(k){ //HashMap getter method with key k
	  return map[k];
}

$(document).ready(function() {
	 console.log('Document ready');
	 
	getSupplierOptions();

	$('#submitWasteBtn').click(submit_waste);
	$('#submitCollectionBtn').click(submit_collection);
	$('#addProductWaste').click(addProductWasteFields);
	$('#addProductCollection').click(addProductCollectionFields);
	
	//Checking input keypress events to see if data entered
	$('input').keyup(function(event){
		var target = $(event.target);
		if($(target).val() != null && $(target).val() != ""){
			$(target).css({
				'border': '0.25px solid #ccc',
				'box-shadow' : 'none'
			});
		}else if($(target).val() != null && $(target).val() == ""){
			$(target).css({
				'border': '0.25px solid #EE4B2E',
				'box-shadow' : '0 0 10px #EE4B2E'
			});
		}
	});

	//Reset input colours after clicking onto the waste tab
	$('.waste').on('click', function(){
		$('input').css({
			'border': '0.25px solid #ccc',
			'box-shadow' : 'none'
		});
	});

	//Reset input colours after clicking onto the collection tab
	$('.collection').on('click', function(){
		$('input').css({
			'border': '0.25px solid #ccc',
			'box-shadow' : 'none'
		});
	});
});


//Remove button function
$('body').on('click', 'button.btn-danger', function() {
	$(this).parent().parent().addClass('selected');
    $('.selected').remove();
});

var timestamp = Date.now || function() { //apparently Date.now is not supported in all browsers
	  return new Date(); 
};

//============================================================================================================================
// REST API call to "addCollection" method
// extracts data from collection form, builds JSON object
// POST collection data to REST API
//============================================================================================================================
var submit_collection = function() {
	//Checks input value for null or empty values
	if($('#collection input').val() == null || $('#collection input').val() == ""){
		$('input:required').css({
			'border': '0.25px solid #ccc',
			'box-shadow' : 'none'
		});
		$('input:required:invalid').css({
			'border': '0.25px solid #EE4B2E',
			'box-shadow' : '0 0 10px #EE4B2E'
		});
		alert("Please fill in the red marked fields");
	}else{
		//1.Parse values from collection form
		var supplierText = $('#supplier').val();
	    var recipientText = $('#recipient').val();
	    
		var items = [];
	    var formData = $('.c');
	    var i = 0;
	            
	    $.each(formData, function(i, obj){
	    		
	    	 var code = $(obj).children('input[name="code"]').val();
	         var product = $(obj).children('input[name="product"]').val();
	         var quantity = $(obj).children('input[name="quantity"]').val().toString();
	         var units = $(obj).children('input[name="units"]').val();
	         var category = $(obj).children('input[name="category"]').val();
	         
	        var tempJSON = {
	        	 code : code,
	             product : product,
	             quantity : quantity,
	             units : units,
	             category : category
	        };
	        items[i] = tempJSON;
	        i++;
	        
	        //Clears all input fields when submit button clicked
	        $('input[type="text"]').val("");
	    });
	    
	    str = JSON.stringify(items);
	
		//2.Create JSON object from values
		//3.Stringify object to string
		var JSONString = JSON.stringify(
				{
					type : "Collection",
					
					recipient : recipientText,
	
					supplier : supplierText,
	
					timestamp : timestamp(),
	
					items : items
				});
		
		//Create another object with workspace ID for charity
		//POST this to REST API to notify charity in workspace
		var wsID = "5992fdd2e4b07d0b9340ae27"//get(recipient)
	
		//console.log("Charity JSON string" + charityJSONString);
	
		//4. POST data to API to commit to blockchain
		$.ajax({ 
	        type: "POST",
	        url: "/api/blockbia/addCollection",
	        data: JSONString,
	        contentType: "application/json; charset=utf-8",
	        success: ajaxSuccessful
		});
		
		function ajaxSuccessful(message){
			console.log("---------------------------Collection successfully committed to ledger---------------------------------");
			var transaction = JSON.parse(message);
			var txID = transaction.transaction_id; //successful transaction id
			console.log("Transaction : "+transaction);
			console.log("Transaction ID : "+txID);
			//Charity JSON
			var charityJSONString = JSON.stringify(
					{
						collectionID : txID,
						
						recipient : recipientText,
						
						workspaceID : wsID,
	
						supplier : supplierText,
	
						timestamp : timestamp(),
	
						items : items
			});
			
			//updateFoodCloudFeed(charityJSONString); //runs FoodCloud feed function to update and enter new collection data
			notifyCharity(charityJSONString); //notify charity of food available
			addFoodCloudStamp(txID); //add FoodClouds stamp of approval to blockchain
			document.getElementById('modalInfo').style.display = 'block';
			$('.thankyou').append('<br><br> <span id="txid">Transaction ID : '+ message +'</span>');
		    setTimeout(function() {
		        document.getElementById('modalInfo').style.display = 'none';
		    $('#txid').remove();
		    }, 10000);
		}
	}
};
//============================================================================================================================
///REST API POST call to api/blockbia/sendNotification 
//called on successful invocation of blockchain to notify charity of incoming donations for collection
//============================================================================================================================
function notifyCharity(donationData){
	//AJAX request to REST API to POST data to workspace 
	//to in turn notify charity
	$.ajax({ 
        type: "POST",
        url: "/api/blockbia/sendNotification",
        data: donationData,
        contentType: "application/json; charset=utf-8",
        success: ajaxNotifySuccess
	});
	
	function ajaxNotifySuccess(message){
		var response = message; //successful transaction id
		console.log("Charity successfully notified");
	}
}
//============================================================================================================================
//REST API POST call to api/blockbia/addStamp (FoodCloud)
//called on successful invocation of blockchain to add FoodCloud's stamp of approval as a tx on the ledger
//txID references the collectionID of the donation
//============================================================================================================================

function addFoodCloudStamp(txID){
	var fcJSONString = JSON.stringify(
			{
				type : "Stamp",
				
				collectionID : txID,

				timestamp : timestamp(),

			});

	//4. POST data to API to commit to blockchain
	$.ajax({ 
        type: "POST",
        url: "/api/blockbia/addStamp",
        data: fcJSONString,
        contentType: "application/json; charset=utf-8",
        success: ajaxSuccess,
        error: ajaxFailure
	});
	
	function ajaxSuccess(message){
		console.log("---------------------------FoodCloud successfully committed to ledger---------------------------------");
		console.log("success response message : " +message);
    }
	function ajaxFailure(message){
		console.log("FoodCloud stamp failed to commit to ledger")
		console.log("Failure response message : " +message);
    }
	
}
//============================================================================================================================
//REST API call to "addWaste" method
//extracts data from from, builds JSON object
//POST waste data to REST API
//============================================================================================================================
function submit_waste(){
	if($('#waste input').val() == null || $('#waste input').val() == ""){
		$('input:required').css({
			'border': '0.25px solid #ccc',
			'box-shadow' : 'none'
		});
		$('input:required:invalid').css({
			'border': '0.25px solid #EE4B2E',
			'box-shadow' : '0 0 10px #EE4B2E'
		});
		alert("Please fill in the red marked fields");
	}else{
		//1.Parse values from Waste form
		var supplier = $('#supplierWaste').val();
		var reason = $('#reason').val();
		
		console.log("Supplier : " +supplier)
		console.log("Reason : " +reason)
		
		var items = [];
	    var formData = $('.w');
	    var i = 0;
	            
	    $.each(formData, function(i, obj){
	    		
	    	 var code = $(obj).children('input[name="code"]').val();
	         var product = $(obj).children('input[name="product"]').val();
	         var quantity = $(obj).children('input[name="quantity"]').val();
	         var units = $(obj).children('input[name="units"]').val();
	         var category = $(obj).children('input[name="category"]').val();
	         
	        var tempJSON = {
	        	 code : code,
	             product : product,
	             quantity : quantity,
	             units : units,
	             category : category
	        };
	        items[i] = tempJSON;
	        console.log("items["+i+"] : "+items[i]);
	        i++;
	        
	        //Clears all input fields when submit button clicked
	        $('input[type="text"]').val("");
	    });
	    
	    str = JSON.stringify(items);
	  
		//2.Create JSON object from values
		//3.Stringify object to string
		var JSONString = JSON.stringify(
				{
					type : "Waste",
	
					supplier : supplier,
	
					reason : reason,
	
					timestamp : timestamp(),
	
					items : items
				});
		
		console.log("JSON string" + JSONString);
		//4. POST data to API to commit to blockchain
		$.ajax({ 
	        type: "POST",
	        url: "/api/blockbia/addWaste",
	        data: JSONString,
	        contentType: "application/json; charset=utf-8",
	        success: ajaxSuccessful
		});
		
		function ajaxSuccessful(message){
			console.log("---------------------------Waste successfully committed to ledger---------------------------------");
			document.getElementById('modalInfo').style.display = 'block';
			$('.thankyou').append('<br><br> <span id="txid">Transaction ID : '+ message +'</span>');
		    setTimeout(function() {
		        document.getElementById('modalInfo').style.display = 'none';
		    $('#txid').remove();
		    }, 10000);
		}
	}
};//end method



function addProductWasteFields(){
    i++;

    var newProductGroup = $('<div class="productDetails" id="' + i + '"><div class="form-group" id="' + i + '"><br><br><h5 class="pTitle pTitle2 ' + i + '">Product :</h5><button class="btn button btn-danger btn-danger2" id="' + i + '" type="button">Remove</button></div>'+ 
    ' <div class="form-group w ' + i + '"> <label class="col-sm-2 control-label">Code : </label> <input class="code form-control" name="code" type="text" required="required">'+ 
    ' <label class="col-sm-2 control-label">Product : </label> <input class="product form-control" name="product" type="text" required="required"> '+ 
    ' <label class="col-sm-2 control-label">Quantity : </label> <input class="quantity form-control" name="quantity" type="number" required="required" min="1" pattern="^[1-9]\d*$"">'+ 
    ' <label class="col-sm-2 control-label">Units : </label> <input class="units form-control" name="units" type="text" required="required">'+ 
    ' <label class="col-sm-2 control-label">Category : </label> <input class="category form-control" name="category" type="text" required="required"></div>');
    
    $('#additionalProducts').append(newProductGroup);
}


function addProductCollectionFields(){
	j++;
	
	var newCollectionGroup = $('<div class="collectiontDetails" id="' + j + '"><div class="form-group" id="' + j + '"><br><br><h5 class="pTitle pTitle2 ' + j + '">Collection :</h5><button class="btn button btn-danger btn-danger2" id="' + j + '" type="button">Remove</button></div>'+ 
	'<div class="form-group c ' + j + '"><label class="col-sm-2 control-label">Code : </label> <input class="code form-control" name="code" type="text" required="required">'+ 
	'<label class="col-sm-2 control-label">Product : </label> <input class="product form-control" name="product" required type="text">'+ 
	'<label class="col-sm-2 control-label">Qunatity : </label> <input class="quantity form-control" name="quantity" type="number" required="required" min="1" pattern="^[1-9]\d*$">'+ 
	'<label class="col-sm-2 control-label">Units : </label> <input class="units form-control" name="units" type="text" required="required">'+ 
	'<label class="col-sm-2 control-label">Category : </label> <input class="category form-control" name="category" type="text" required="required"></div>');
	
	$('#additionalCollections').append(newCollectionGroup);
}

function getSupplierOptions() {
	var addSupplierOptions = function(res) {
		var suppliers = JSON.parse(res);
		
		suppliers.forEach(function(supplier_item) {
			console.log(supplier_item.toString());
			
			var option = document.createElement("option");
			option.append(document.createTextNode(supplier_item));
			
			$('#supplierWaste').append(option);
		});
	}
	
	$.ajax({ 
        type: "GET",
        url: "/api/search/supplier",
        contentType: "application/json; charset=utf-8",
        success: addSupplierOptions
	});
}

function getItemByUPC(upc) {
	var completeProductField = function(res) {
		console.log(res);
	}
	
	$.ajax({ 
        type: "GET",
        url: "https://api.upcitemdb.com/prod/trial/lookup/api/search/supplier?upc=" + upc,
        contentType: "application/json; charset=utf-8",
        success: compeleteProductField
	});
}