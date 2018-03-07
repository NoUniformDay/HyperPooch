/*
Chaincode - Eric McEvoy
*/

package main

import (
	"encoding/json"
	"errors"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
)

// ============================================================================================================================
// Get Canine - get a canine asset from ledger
// ============================================================================================================================
func get_canine(stub shim.ChaincodeStubInterface, id string) (Canine, error) {
	var canine Canine
	canineAsBytes, err := stub.GetState(id)                  //getState retreives a key/value from the ledger
	if err != nil {                                          //this seems to always succeed, even if key didn't exist
		return canine, errors.New("Failed to find canine - " + id)
	}
	json.Unmarshal(canineAsBytes, &canine)                   //un stringify it aka JSON.parse()

	if canine.Id != id {                                     //test if canine is actually here or just nil
		return canine, errors.New("canine does not exist - " + id)
	}

	return canine, nil
}

// ============================================================================================================================
// Get Owner - get the owner asset from ledger
// ============================================================================================================================
func get_owner(stub shim.ChaincodeStubInterface, id string) (Owner, error) {
	var owner Owner
	ownerAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {                                            //this seems to always succeed, even if key didn't exist
		return owner, errors.New("Failed to get owner - " + id)
	}
	json.Unmarshal(ownerAsBytes, &owner)                       //un stringify it aka JSON.parse()

	if len(owner.Name) == 0 {                              //test if owner is actually here or just nil
		return owner, errors.New("Owner does not exist - " + id + ", '" + owner.Name)
	}
	
	return owner, nil
}

// ============================================================================================================================
// Get Veterinary - get the veterinary asset from ledger
// ============================================================================================================================
func get_veterinary(stub shim.ChaincodeStubInterface, id string) (Veterinary, error) {
	var vet Veterinary
	vetAsBytes, err := stub.GetState(id)                     //getState retreives a key/value from the ledger
	if err != nil {                                            //this seems to always succeed, even if key didn't exist
		return vet, errors.New("Failed to get vet - " + id)
	}
	json.Unmarshal(vetAsBytes, &vet)                       //un stringify it aka JSON.parse()

	if len(vet.PracticeName) == 0 {                              //test if owner is actually here or just nil
		return vet, errors.New("Vet does not exist - " + id + ", '" + vet.PracticeName)
	}
	
	return vet, nil
}

// ========================================================
// Input Sanitation - dumb input checking, look for empty strings
// ========================================================
func sanitize_arguments(strs []string) error{
	for i, val:= range strs {
		if len(val) <= 0 {
			return errors.New("Argument " + strconv.Itoa(i) + " must be a non-empty string")
		}
		if len(val) > 32 {
			return errors.New("Argument " + strconv.Itoa(i) + " must be <= 32 characters")
		}
	}
	return nil
}
