/*
 Chaincode - Eric McEvoy
*/

package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// ============================================================================================================================
// write() - genric write variable into ledger
// 
// Shows Off PutState() - writing a key/value into the ledger
//
// Inputs - Array of strings
//    0   ,    1
//   key  ,  value
//  "abc" , "test"
// ============================================================================================================================
func write(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var key, value string
	var err error
	fmt.Println("starting write")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2. key of the variable and value to set")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	key = args[0]                                   //rename for funsies
	value = args[1]
	err = stub.PutState(key, []byte(value))         //write the variable into the ledger
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end write")
	return shim.Success(nil)
}


/// ============================================================================================================================
// Init Vet - create a new vet aka end user, store into chaincode state
//
// Shows off building key's value from GoLang Structure
//
// Inputs - Array of Strings
//     0          1         2				    3
//  owner id     name   contactNumber    contactAddress
// "O212"        "bob" "+3530861700129"  "11 fuchsia park"
// ============================================================================================================================
func init_vet(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_vet")

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}
	
	

	var vet Veterinary
	vet.ObjectType = "canine_owner"
	vet.Id =  args[0]
	vet.PracticeName = args[1]
	vet.Address = args[2]
	vet.ContactNumber = args[3]
	fmt.Println(vet)

	//store vet
	vetAsBytes, _ := json.Marshal(vet)                         //convert to array of bytes
	err = stub.PutState(vet.Id, vetAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store vet")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_vet")
	return shim.Success(nil)
}
// ============================================================================================================================
// Init canine - create a new canine, store into chaincode state
//
// Shows off building a key's JSON value manually
//
// Inputs - Array of strings
//      0           1   			 2                       3                    5          6				7
//     id         dateOfBirth  	dateOfInsertion     description             sex      address        owner_id
//    "C1"        "28/09/2011"  "10/10/2011"    "brown with white spots"    "male"  "11 fuchisa park" "O5"
// ============================================================================================================================
func init_canine(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
	var err error
	fmt.Println("starting init_canine")

	if len(args) != 8 {
		return shim.Error("Incorrect number of arguments. Expecting 8")
	}

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]
	name := args[1]
	dateOfBirth := args[2] //strings.ToLower(args[1])
	dateOfInsertion := args[3]
	description := args[4]
	sex := args[5]
	address := args[6]
	owner_id := args[7]
	
	//check if new owner exists
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		fmt.Println("Failed to find owner - " + owner_id)
		return shim.Error(err.Error())
	}

	//check if canine id already exists
	canine, err := get_canine(stub, id)
	if err == nil {
		fmt.Println("This canine already exists - " + id)
		fmt.Println(canine)
		return shim.Error("This canine already exists - " + id)  //all stop a canine by this id exists
	}

	//build the canine json string manually
	str := `{
		"docType":"canine", 
		"id": "` + id + `", 
		"name": "` + name + `", 
		"dateOfBirth": "` + dateOfBirth + `", 
		"dateOfInsertion": ` + dateOfInsertion + `, 
		"description": ` + description + `, 
		"sex": ` + sex + `, 
		"address": ` + address + `, 
		"owner": {
			"id": "` + owner_id + `", 
			"contactNumber": "` + owner.ContactNumber + `", 
			"contactAddress": "` + owner.ContactAddress + `"
		}
	}`
	err = stub.PutState(id, []byte(str))                         //store canine with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_canine")
	return shim.Success(nil)
}

// ============================================================================================================================
// Init Owner - create a new owner aka end user, store into chaincode state
//
// Shows off building key's value from GoLang Structure
//
// Inputs - Array of Strings
//     0          1         2				    3
//  owner id     name   contactNumber    contactAddress
// "O212"        "bob" "+3530861700129"  "11 fuchsia park"
// ============================================================================================================================
func init_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting init_owner")

	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4")
	}

	//input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var owner Owner
	owner.ObjectType = "canine_owner"
	owner.Id =  args[0]
	owner.Name = args[1]
	owner.ContactNumber = args[2]
	owner.ContactAddress = args[3]
	fmt.Println(owner)

	//check if user already exists
	_, err = get_owner(stub, owner.Id)
	if err == nil {
		fmt.Println("This owner already exists - " + owner.Id)
		return shim.Error("This owner already exists - " + owner.Id)
	}

	//store user
	ownerAsBytes, _ := json.Marshal(owner)                         //convert to array of bytes
	err = stub.PutState(owner.Id, ownerAsBytes)                    //store owner by its Id
	if err != nil {
		fmt.Println("Could not store user")
		return shim.Error(err.Error())
	}

	fmt.Println("- end init_owner canine")
	return shim.Success(nil)
}

// ============================================================================================================================
// Set Owner on canine
//
// Shows off GetState() and PutState()
//
// Inputs - Array of Strings
//       0             1             
//  canine id    to owner id  
// "C43664" 			"O2342" 		
// ============================================================================================================================
func set_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting set_owner")

	// this is quirky
	// todo - get the "company that authed the transfer" from the certificate instead of an argument
	// should be possible since we can now add attributes to the enrollment cert
	// as is.. this is a bit broken (security wise), but it's much much easier to demo! holding off for demos sake

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var canine_id = args[0]
	var new_owner_id = args[1]
	fmt.Println(canine_id + "->" + new_owner_id)

	// check if user already exists
	owner, err := get_owner(stub, new_owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + new_owner_id)
	}

	// get canine's current state
	canineAsBytes, err := stub.GetState(canine_id)
	if err != nil {
		return shim.Error("Failed to get canine")
	}
	res := Canine{}
	json.Unmarshal(canineAsBytes, &res)           //un stringify it aka JSON.parse()


	// transfer the canine
	res.Owner.Id = new_owner_id                   //change the owner
	res.Owner.Name = owner.Name
	jsonAsBytes, _ := json.Marshal(res)           //convert to array of bytes
	err = stub.PutState(args[0], jsonAsBytes)     //rewrite the canine with id as key
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end set owner")
	return shim.Success(nil)
}

// ============================================================================================================================
// Disable canine Owner
//
// Shows off PutState()
//
// Inputs - Array of Strings
//       0       
//  owner id    
// "o9999999999999"
// ============================================================================================================================
func disable_owner(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	fmt.Println("starting disable_owner")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// input sanitation
	err = sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	var owner_id = args[0]

	// get the canine owner data
	owner, err := get_owner(stub, owner_id)
	if err != nil {
		return shim.Error("This owner does not exist - " + owner_id)
	}

	jsonAsBytes, _ := json.Marshal(owner)         //convert to array of bytes
	err = stub.PutState(args[0], jsonAsBytes)     //rewrite the owner
	if err != nil {
		return shim.Error(err.Error())
	}

	fmt.Println("- end disable_owner")
	return shim.Success(nil)
}

// ============================================================================================================================
// delete_canine() - remove a canine from state and from canine index
// 
// Shows Off DelState() - "removing"" a key/value from the ledger
//
// Inputs - Array of strings
//      0      ,         1
//     id      ,  authed_by_company
// "m999999999", "united canines"
// ============================================================================================================================
func delete_canine(stub shim.ChaincodeStubInterface, args []string) (pb.Response) {
	fmt.Println("starting delete_canine")

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	// input sanitation
	err := sanitize_arguments(args)
	if err != nil {
		return shim.Error(err.Error())
	}

	id := args[0]

	// get the canine
	canine, err := get_canine(stub, id)
	if err != nil{
		fmt.Println("Failed to find canine by id " + id)
		return shim.Error(err.Error())
	}else{
		fmt.Println("Canine ID : "+canine.Id)
	}
	// remove the canine
	err = stub.DelState(id)                                                 //remove the key from chaincode state
	if err != nil {
		return shim.Error("Failed to delete state")
	}

	fmt.Println("- end delete_canine")
	return shim.Success(nil)
}
