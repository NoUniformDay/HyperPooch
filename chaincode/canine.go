/*
Chaincode - Asset defintion

Canine - Animal entry into the ledger
Owner - Corresponding owner
*/

package main

import (
	"fmt"
	"strconv"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// SimpleChaincode example simple Chaincode implementation
type SimpleChaincode struct {
}

// ============================================================================================================================
// Asset Definition - The ledger will store Canines and owners details
// ============================================================================================================================

// ----- Canines ----- //
type Canine struct {
	ObjectType string        `json:"docType"` //field for couchdb
	Id       string          `json:"id"`      //the fieldtags are needed to keep case from bouncing around
	Color      string        `json:"color"`
	Size       int           `json:"size"`    //size in mm of Canine
	Owner      OwnerRelation `json:"owner"`
}

// ----- Owners ----- //
type Owner struct {
	ObjectType string `json:"docType"`     //field for couchdb
	Id         string `json:"id"`
	Username   string `json:"username"`
	Company    string `json:"company"`
	Enabled    bool   `json:"enabled"`     //disabled owners will not be visible to the application
}

type OwnerRelation struct {
	Id         string `json:"id"`
	Username   string `json:"username"`    //this is mostly cosmetic/handy, the real relation is by Id not Username
	Company    string `json:"company"`     //this is mostly cosmetic/handy, the real relation is by Id not Company
}

// ============================================================================================================================
// Main
// ============================================================================================================================
func main() {
	err := shim.Start(new(SimpleChaincode))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode - %s", err)
	}
}


// ============================================================================================================================
// Init - initialize the chaincode 
//
// Canines does not require initialization, so let's run a simple test instead.
//
// Shows off PutState() and how to pass an input argument to chaincode.
//
// Inputs - Array of strings
//  ["314"]
// 
// Returns - shim.Success or error
// ============================================================================================================================
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("HyperPooch Chaincode Is Starting Up")
	_, args := stub.GetFunctionAndParameters()
	var Aval int
	var err error
	
	fmt.Println("Init() args count:", len(args))
	fmt.Println("Init() args found:", args)

	// expecting 1 arg for instantiate or upgrade
	if len(args) == 1 {
		fmt.Println("Init() arg[0] length", len(args[0]))

		// expecting arg[0] to be length 0 for upgrade
		if len(args[0]) == 0 {
			fmt.Println("args[0] is empty... must be upgrading")
		} else {
			fmt.Println("args[0] is not empty, must be instantiating")

			// convert numeric string to integer
			Aval, err = strconv.Atoi(args[0])
			if err != nil {
				return shim.Error("Expecting a numeric string argument to Init() for instantiate")
			}

			// this is a very simple test. let's write to the ledger and error out on any errors
			// it's handy to read this right away to verify network is healthy if it wrote the correct value
			err = stub.PutState("selftest", []byte(strconv.Itoa(Aval)))
			if err != nil {
				return shim.Error(err.Error())                  //self-test fail
			}
		}
	}

	// store compaitible Canines application version
	err = stub.PutState("Canines_ui", []byte("4.0.0"))
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println(" - ready for action")                          //self-test pass
	return shim.Success(nil)
}


// ============================================================================================================================
// Invoke - Our entry point for Invocations
// ============================================================================================================================
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println(" ")
	fmt.Println("starting invoke, for - " + function)

	// Handle different functions
	if function == "init" {                    //initialize the chaincode state, used as reset
		return t.Init(stub)
	} else if function == "read" {             //generic read ledger
		return read(stub, args)
	} else if function == "write" {            //generic writes to ledger
		return write(stub, args)
	} else if function == "delete_canine" {    //deletes a Canine from state
		return delete_canine(stub, args)
	} else if function == "init_canine" {      //create a new Canine
		return init_canine(stub, args)
	} else if function == "set_owner" {        //change owner of a Canine
		return set_owner(stub, args)
	} else if function == "init_owner"{        //create a new Canine owner
		return init_owner(stub, args)
	} else if function == "read_everything"{   //read everything, (owners + Canines + companies)
		return read_everything(stub)
	} else if function == "getHistory"{        //read history of a Canine (audit)
		return getHistory(stub, args)
	} else if function == "getCaninesByRange"{ //read a bunch of Canines by start and stop id
		return getCaninesByRange(stub, args)
	} else if function == "disable_owner"{     //disable a Canine owner from appearing on the UI
		return disable_owner(stub, args)
	}

	// error out
	fmt.Println("Received unknown invoke function name - " + function)
	return shim.Error("Received unknown invoke function name - '" + function + "'")
}


// ============================================================================================================================
// Query - legacy function
// ============================================================================================================================
func (t *SimpleChaincode) Query(stub shim.ChaincodeStubInterface) pb.Response {
	return shim.Error("Unknown supported call - Query()")
}
