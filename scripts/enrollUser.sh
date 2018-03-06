echo "POST request Enroll on Org1  ..."
echo
ORG1_TOKEN=$(curl -s -X POST \
  http://localhost:4000/users \
  -H "content-type: application/x-www-form-urlencoded" \
  -d "orgName=org1&username=eric")
echo $ORG1_TOKEN
echo
echo "ORG1 token is $ORG1_TOKEN"
echo
