echo "POST instantiate chaincode on peers of Org1"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/chaincodes \
  -H "content-type: application/json" \
  -d '{
  	"orgName" : "org1",
  	"username" : "eric",
  	"channelName" : "mychannel",
	"chaincodeName":"mycc",
	"chaincodeVersion":"v0",
	"args":["a","100","b","200"]
}'
echo
echo
