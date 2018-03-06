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

echo "POST request Create channel  ..."
echo
curl -s POST \
  http://localhost:4000/channels \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "channelName=mychannel&channelConfigPath=../artifacts/channel/mychannel.tx&orgName=org1&username=eric"
echo
echo

