package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (

	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)
//Global variables used to generate unique keys on the fly.
var maxWasteID = 0

//type Item struct{
//	product 	string `json:"product"` //name
//	units 		string  `json:"units"` //e.g grams
//	category 	string `json:"category"` //e.g bread, chilled
//	quantity 	string `json:"quantity"`
//	code		string `json:"code"` // i.e UPC code
//}

type Waste struct{ //key is wasteID generated within the chaincode
	Type 		string `json:"type"`
	Supplier 	string `json:"supplier"`
	Reason 		string `json:"reason"`
	Timestamp 	int64 `json:"timestamp"`
	Items       []struct{
		Product 	string `json:"product"` //name
		Units 		string  `json:"units"` //e.g grams
		Category 	string `json:"category"` //e.g bread, chilled
		Quantity 	string `json:"quantity"`
		Code		string `json:"code"` // i.e UPC code
	} `json:"items"`
}


func (s *SmartContract) getWaste(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

    fmt.Print(args)
	wasteAsBytes, _ := APIstub.GetState(args[0]) //key
	fmt.Print("Key : ", args[0])
	return shim.Success(wasteAsBytes)
}

func (s *SmartContract) addWaste(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args[0]) < 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1 or more")
	}

	fmt.Println(args[0]);

	var waste Waste
	json.Unmarshal([]byte(args[0]), &waste)

	// fmt.Print("\n\n##%s,", waste.Type, "---")
	// fmt.Print("\n\n##%s,", waste.Supplier, "---")
	// fmt.Print("\n\n##%s,", waste.Reason, "---")
	// fmt.Print("\n\n##%s,", waste.Timestamp, "---")
	// fmt.Print("\n\n##%s,", waste.Items, "---")

	wasteAsBytes, _ := json.Marshal(waste)
	APIstub.PutState("W" + strconv.Itoa(maxWasteID) , wasteAsBytes)

	maxWasteID += 1

	return shim.Success(nil)
}

func (s *SmartContract) getAllWaste(APIstub shim.ChaincodeStubInterface) sc.Response {

	startKey := "W0"
	endKey := "W" + strconv.Itoa(maxWasteID);

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

	fmt.Printf("- getAllWaste:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
