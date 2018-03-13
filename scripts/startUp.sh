#!/bin/bash
#
# Bash script that initialises network such as 
#

echo "POST request Enroll on Org1  ..."
echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:4000/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "orgName=org1&username=eric")
echo $ORG1_TOKEN

sleep 5

echo "POST request Create channel  ..."
echo
curl -s POST \
  http://localhost:4000/channels \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "channelName=mychannel&channelConfigPath=../artifacts/channel/mychannel.tx&orgName=org1&username=eric"
echo
echo

sleep 5

echo "POST request Join channel on Org1"
echo
curl -s -X POST \
  http://localhost:4000/channels/mychannel/peers \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "peers=peer1&peers=peer2&channelName=mychannel&orgName=org1&username=eric"
echo
echo


echo "POST Install chaincode on Org1"
echo
curl -s -X POST \
  http://localhost:4000/chaincodes \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "peers=peer1&peers=peer2&chaincodeName=mycc&chaincodePath=github.com/chaincode&chaincodeVersion=v0&orgName=org1&username=eric"

echo
echo



