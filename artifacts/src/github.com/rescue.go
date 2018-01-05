
//------------------------------------------------------------------------------
//------------ SAMPLE d AS JSON for reference--------------------------
/*
{

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
//----------------------------------------------------------------
//----------------------------------------------------------------

package main

import (
	"encoding/json"
	"strconv"
	"bytes"	
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type Collection struct {
	Type string `json:"type"`
	Supplier string `json:"supplier"`
	Recipient string `json:"recipient"`
	Timestamp int64 `json:"timestamp"`
	Items []struct {
		Code string `json:"code"`
		Product string `json:"product"`
		Quantity string `json:"quantity"`
		Units string `json:"units"`
		Category string `json:"category"`
	} `json:"items"`
}

var productID int = 0; //Global variable to track Products, increments each time for a uniqiue key every function call 
var collectionID int = 0//Global variable to track Collections(Donations) ,increments each time for a uniqiue key every function call 
var orderID int = 0 //OrderID tracks each of the "items" (product + quantity) donated in a collection


// ============================================================================================================================
// Add Collection - writes a Collection asset to ledger for key collectionID (generated incrementally each function call)
// Takes args []string : args[0] being the string representation of the JSON object collection (The donation)
// ============================================================================================================================
func (s *SmartContract) addCollection(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var c Collection
	json.Unmarshal([]byte(args[0]), &c) //args[0] = JSON String

	collectionAsBytes, _ := json.Marshal(c)
	APIstub.PutState("C"+strconv.Itoa(collectionID), collectionAsBytes)
	collectionID += 1 //increment global collection ID Variable 

	return shim.Success(nil)
}
// ============================================================================================================================
// Get CollectionByID - get the Collection asset from ledger from the corresponding collectionID
// ============================================================================================================================
func (s *SmartContract) getCollectionByID(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	//var collection Collection
	var id = args[0]
	collectionAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {                                           
		return shim.Error("Failed to get Collection - " + id)
	}              
	return shim.Success(collectionAsBytes) //
}

// ============================================================================================================================
// getAllCollections - gets all collections in the range specified
// ============================================================================================================================
func (s *SmartContract) getAllCollections(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "C0"
	endKey := "C5"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getAllCollections:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}











		

