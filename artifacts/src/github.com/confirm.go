package main

/**
* Chaincode for invoking two confirmation transactions to the Blockchain
**/


/*--------------EXAMPLE JSON--------------//
//--------------Confirmation--------------//
{
"type" : "Confirmation",

"charityID" : "GOAL:24324",

"collectionID" : "C3323234",

"response" : "true",

"timestamp" : 3453453455,
}

//--------------Stamp(FoodCloud)--------------//
{

"type" : "Stamp",

"collectionID" : "C3323234",

"timestamp" : 453453453,

}
*/

import (
	"encoding/json"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

//Confirmation from Charity
type Confirmation struct{
	Type 			string `json:"type"` //Type of tx
	CharityID 		string `json:"charityID"` //Identifier of confirming Charity
	CollectionID 	string `json:"collectionID"`//Reference to collection donation 
	Response 		bool `json:"response"` //True : recieved, False : not recieved
	Timestamp 		int64 `json:"timestamp"` 
}

//Stamp of approval from FoodCloud 
type Stamp struct{
	Type 			string `json:"type"` //Type of tx
	CollectionID    string `json:"collectionID"` //Reference to collection donation
	Timestamp 	    int64 `json:"timestamp"`
}

var confirmationID = 0; //Global variable for tracking confirmations assigned incrementally per confirmation
var stampID = 0 //Global variable for tracking FoodCloud transactions assigned incrementally per confirmation
// ============================================================================================================================
// Add Confirmation : commits transaction to the blockchain on Charity's behalf to confirm donation received
// Takes args []string : args[0] being the string representation of the JSON object containing ID of charity confirming,
// the ID of collection they are confirming and their response : true or false (recieved or not)
// ============================================================================================================================
func(s *SmartContract) addConfirmation(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
	var jsonString = args[0]
	var conf Confirmation
	json.Unmarshal([]byte(jsonString), &conf)
	confirmationAsBytes, _ := json.Marshal(conf)
	APIstub.PutState("CF"+strconv.Itoa(confirmationID), confirmationAsBytes)
	confirmationID += 1
	
	return shim.Success(nil)
}

// ============================================================================================================================
// get ConfirmationByID :  returns confirmation as bytes corresponding to key stated
// ============================================================================================================================
func(s *SmartContract) getConfirmationByID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
	var id = args[0] //confirmation ID
	var err error
	confirmationAsBytes, _ := APIstub.GetState(id)
	if err != nil {                                           
		return shim.Error("Failed to get confirmation - " + id)
	}  
	return shim.Success(confirmationAsBytes)
}

// ============================================================================================================================
// Add Stamp : commits transaction to the blockchain on FoodCloud's behalf as a stamp of approval/acknowledgement 
// Takes args []string : args[0] being the string representation of the JSON object containing ID of collection
// ============================================================================================================================
func(s *SmartContract) addStamp(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
	var jsonString = args[0]
	var stamp Stamp
	json.Unmarshal([]byte(jsonString), &stamp)
	stampAsBytes,_ := json.Marshal(stamp)
	APIstub.PutState("STMP"+strconv.Itoa(confirmationID), stampAsBytes)
	stampID += 1
	
	return shim.Success(nil)
}

// ============================================================================================================================
// get stampByID:  returns stamp as bytes corresponding to key stated
// ============================================================================================================================
func(s *SmartContract) getStampByID(APIstub shim.ChaincodeStubInterface, args []string) sc.Response{
	var id = args[0] //stamp ID
	var err error
	stampAsBytes, _ := APIstub.GetState(id)
	if err != nil {                                           
		return shim.Error("Failed to get stamp - " + id)
	}  
	return shim.Success(stampAsBytes)
}
