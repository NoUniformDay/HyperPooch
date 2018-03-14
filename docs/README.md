## HyperPooch
# HyperPooch is a decentralised software application that uses blockchain technology as an alternative to the conventional centralised databases already in place to store pet information. This tool hopes to alleviate many problems of identification, traceability and accountability faced by all parties involved in the care and handling of pets from pet owners and veterinarians to animal wellness organisations and government bodies.

# According to a press release from the then Minister for Agriculture, Food and the Marine, Simon Coveney T.D, in Ireland alone, there are currently four individual authorised databases Animark, Fido, The Irish Coursing Club and the Irish Kennel Club. That’s four different places the data on a pet’s microchip has to be stored, maintained and regulated by people. It can be a timely process for a Veterinary to access this data as they need to contact each individual administrator to find relevant owner and medical information of a lost pet. Blockchain removes the need for these costly resources and provides a trusted, secured unified registry that any body involved with pets can easily access what’s relevant to them. A decentralised blockchain network ensures lowered costs and increased speed in identifying lost, stolen or abandoned pets.

# A blockchain database is an immutable ledger. This means that through clever cryptography, once data has been written to it, no one, not even a system administrator, can change it. HyperPooch is thus a better alternative to tracking an animal’s ancestry over time, such that every time a pet is born its records are securely stored in the ledger linking to parents before it. HyperPooch digitizes the cumbersome paper process guaranteeing the authenticity and traceability of a pet’s pedigree as well as the accountability of an owner in the case of an abandoned animal. 

# Like so much that has come before, HyperPooch leverages the ever-increasing capacity of computer systems to provide a new way of replacing humans with code. And once it’s been written and debugged, code tends to be an awful lot cheaper. HyperPooch provides a platform of trust for parties like pet show judges, insurance companies, breeding auditors and even border controls living the the world of ever increasing industrial scale breeding and illegal trading of designer puppies.

## There are 3 distinct core technological components in the system. They are isolated environments that communicate with each other separately.
## The Chaincode  - This is GoLang code that runs on/with a peer on the blockchain network. All HyperPooch blockchain ledger interactions ultimately happen here, including reading and writing directly to the ledger
## The Client Side JS - This is JavaScript code running in the user's web browser. User interface interaction happens here. This may appear very similar to existing systems
## The Server Side JS  - This is JavaScript code running our application's backend. i.e Node.js code which is the heart of the system! Sometimes referred to as our node or server code. Functions as the glue between the web admin and the blockchain ledger. 
These are 3 isolated components that are separated. They do not share variables nor functions. They will communicate via a networking protocol such as gRPC or WebSockets.

### Prerequisites and setup:

* [Docker](https://www.docker.com/products/overview) - v1.12 or higher
* [Docker Compose](https://docs.docker.com/compose/overview/) - v1.8 or higher
* [Git client](https://git-scm.com/downloads) - needed for clone commands
* **Node.js** v6.9.0 - 6.10.0 ( __Node v7+ is not supported__ )
* [Download Docker images](http://hyperledger-fabric.readthedocs.io/en/latest/samples.html#binaries)



## Running the sample program


##### Terminal Window 1 

* Launch the network using by running script

```
chmod +x runApp.sh //if permission errors
./runApp.sh
```
##### Terminal Window 2

* Enroll users, Create channel, Join channel, Install chaincode by running startUp.sh script 
* followed by the instantiateChaincode script, separated incase of a time out

```
cd scripts
./startUp.sh
./instantiateChaincode.sh
```
* This launches the required network on your local machine
* Installs the fabric-client and fabric-ca-client node modules
* And, starts the Nodejs server on localhost port 4000

## Sample REST APIs Requests

### Login Request

* Register and enroll new users in Organization - **Org1**:

`curl -s -X POST http://localhost:4000/users -H "content-type: application/x-www-form-urlencoded" -d 'username=Eric&orgName=org1'`

**OUTPUT:**

```
{
  "success": true,
  "secret": "RaxhMgevgJcm",
  "message": "Eric enrolled Successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE0OTQ4NjU1OTEsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Im9yZzEiLCJpYXQiOjE0OTQ4NjE5OTF9.yWaJhFDuTvMQRaZIqg20Is5t-JJ_1BP58yrNLOKxtNI"
}
```

