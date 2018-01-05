
//Exportted Function to send notification to be called after tx commit
module.exports = {
	notifyWorkspace : function(donationData,URL){
	var Client = require('node-rest-client').Client;
	var client = new Client();
	
	var args = {
		    data: donationData,
		    headers: { 
		    	"Content-Type": "application/json"
		    }
		};
	
	//Creating a POST request to send to ngrok server 
	client.post(URL, args, function (data, response) {
		//console.log("\n");
		console.log(data);
	    //console.log("\n");
	    console.log(response);
	});
  }
};

