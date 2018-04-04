
package main

import (
	"encoding/json"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type VeterinaryNew struct {
	ObjectType string        `json:"docType"` //field for couchdb
	Id         string        `json:"id"`      //unique identifier (ID) practice
	PracticeName string      `json:"practiceName"`    //Name of practice
	Address    string        `json:"address"` //address of the practice premises
}

var transactionID int = 0; //incremental value assigned to transactions

// ============================================================================================================================
// Add Donation - writes a Collection asset to ledger for key collectionID (generated incrementally each function call)
// Takes args []string : args[0] being the string representation of the JSON object collection (The donation)
// ============================================================================================================================
func (s *SmartContract) addVetNew(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var v VeterinaryNew
	json.Unmarshal([]byte(args[0]), &v) //args[0] = JSON String
	vetAsBytes, _ := json.Marshal(v)
	APIstub.PutState("V"+strconv.Itoa(transactionID), vetAsBytes)
	transactionID += 1
	return shim.Success(nil)
}
// ============================================================================================================================
// Get CollectionByID - get the Collection asset from ledger from the corresponding collectionID
// ============================================================================================================================
func (s *SmartContract) getVetByID(stub shim.ChaincodeStubInterface, args []string) sc.Response {
	var id = args[0] //barcode/donationID
	transactionAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {                                           
		return shim.Error("Failed to get NEW VET - " + id)
	}              
	return shim.Success(transactionAsBytes) //
}












		


