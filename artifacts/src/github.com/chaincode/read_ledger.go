/*

*/

package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// Generic Read method call from the ledger using GetState()
//
// Reads a key/value pair from the blockchain ledger
//
// Inputs - Array of strings
//  0
//  key
//  "abc"
// 
// Returns - string
// ============================================================================================================================
func read(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, jsonResp string
	var err error
	fmt.Println("starting read")

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting key of the var to query")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0]
	valAsbytes, err := stub.GetState(key)           //get the var from ledger
	if err != nil {
		jsonResp = "{\"Error\":\"Failed to get state for " + key + "\"}"
		return shim.Error(jsonResp)
	}

	fmt.Println("- end read")
	return shim.Success(valAsbytes)                  //send it onward
}

// ============================================================================================================================
// Get everything we need (owners + Canines + Veterinaies)
//
// Inputs - none
//
// Returns:
// {
//	"owners": [{
//			"id": "O99999999",
//			"name": "Eric McEvoy",
//			"contactNumber": "+35385674848",
//			"contactAddress": "11 Fuchsia Park, Renmore, Galway",
//	}],
//	"Canines": [{
//		"id": "C99999",
//		"dateOfBirth": "28/09/2011",
//		"dateOfInsertion": "10/10/2011",
//		"description": "Black with brown spots",
//		"sex": "male",
//		"address": "11 Fuchsia Park, Renmore, Galway",
//		"docType" :"Canine",
//		"owner": {
//			"name": "Eric McEvoy"
//		}
//	}]
// }
// ============================================================================================================================
func read_everything(stub shim.ChaincodeStubInterface) pb.Response {
	type Everything struct {
		Owners   []Owner   `json:"owners"`
		Canines  []Canine  `json:"canines"`
	}
	var everything Everything

	// ---- Get All Canines ---- //
	resultsIterator, err := stub.GetStateByRange("C1", "C5")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()
	
	for resultsIterator.HasNext() {
		aKeyValue, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on Canine id - ", queryKeyAsStr)
		var Canine Canine
		json.Unmarshal(queryValAsBytes, &Canine)                  //un stringify it aka JSON.parse()
		everything.Canines = append(everything.Canines, Canine)   //add this Canine to the list
	}
	fmt.Println("Canine array - ", everything.Canines)

	// ---- Get All Owners ---- //
	ownersIterator, err := stub.GetStateByRange("o0", "o9999999999999999999")
	if err != nil {
		return shim.Error(err.Error())
	}
	defer ownersIterator.Close()

	for ownersIterator.HasNext() {
		aKeyValue, err := ownersIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryKeyAsStr := aKeyValue.Key
		queryValAsBytes := aKeyValue.Value
		fmt.Println("on owner id - ", queryKeyAsStr)
		var owner Owner
		json.Unmarshal(queryValAsBytes, &owner)                   //un stringify it aka JSON.parse()

		                                  
			everything.Owners = append(everything.Owners, owner)  //add this Canine to the list
		
	}
	fmt.Println("owner array - ", everything.Owners)

	//change to array of bytes
	everythingAsBytes, _ := json.Marshal(everything)              //convert to array of bytes
	return shim.Success(everythingAsBytes)
}

// ============================================================================================================================
// Get history of asset
//
// Shows Off GetHistoryForKey() - reading complete history of a key/value
//
// Inputs - Array of strings
//  0
//  id
//  "m01490985296352SjAyM"
// ============================================================================================================================
func getHistory(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	type AuditHistory struct {
		TxId    string   `json:"txId"`
		Value   Canine   `json:"value"`
	}
	var history []AuditHistory;
	var canine Canine

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	CanineId := args[0]
	fmt.Printf("- start getHistoryForCanine: %s\n", CanineId)

	// Get History
	resultsIterator, err := stub.GetHistoryForKey(CanineId)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	for resultsIterator.HasNext() {
		historyData, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		var tx AuditHistory
		tx.TxId = historyData.TxId                     //copy transaction id over
		json.Unmarshal(historyData.Value, &canine)     //un stringify it aka JSON.parse()
		if historyData.Value == nil {                  //Canine has been deleted
			var emptyCanine Canine
			tx.Value = emptyCanine                 //copy nil Canine
		} else {
			json.Unmarshal(historyData.Value, &canine) //un stringify it aka JSON.parse()
			tx.Value = canine                      //copy Canine over
		}
		history = append(history, tx)              //add this tx to the list
	}
	fmt.Printf("- getHistoryForCanine returning:\n%s", history)

	//change to array of bytes
	historyAsBytes, _ := json.Marshal(history)     //convert to array of bytes
	return shim.Success(historyAsBytes)
}

// ============================================================================================================================
// Get history of asset - performs a range query based on the start and end keys provided.
//
// Shows Off GetStateByRange() - reading a multiple key/values from the ledger
//
// Inputs - Array of strings
//       0     ,    1
//   startKey  ,  endKey
//     "C1" , 	   "C5"
// ============================================================================================================================
func getCaninesByRange(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	startKey := args[0]
	endKey := args[1]

	resultsIterator, err := stub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		aKeyValue, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		queryResultKey := aKeyValue.Key
		queryResultValue := aKeyValue.Value

		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResultKey)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResultValue))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- getCaninesByRange queryResult:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
