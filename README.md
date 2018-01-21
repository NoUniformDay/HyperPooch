HyperPooch is a decentralised software application that uses blockchain technology as an alternative to the conventional centralised databases already in place to store pet information. This tool alleviates many problems of identification, traceability and accountability faced by all parties involved in the care and handling of pets from pet owners and veterinarians to animal wellness organisations and government bodies.

According to a press release from the then Minister for Agriculture, Food and the Marine, Simon Coveney T.D, in Ireland alone, there are currently four individual authorised databases Animark, Fido, The Irish Coursing Club and the Irish Kennel Club [1]. That’s four different places the data on a pet’s microchip has to be stored, maintained and regulated by people. It can be a timely process for a Veterinary to access this data as they need to contact each individual administrator to find relevant owner and medical information of a lost pet. Blockchain removes the need for these costly resources and provides a trusted, secured unified registry that any body involved with pets can easily access what’s relevant to them. A decentralised blockchain network ensures lowered costs and increased speed in identifying lost, stolen or abandoned pets.

A blockchain database is an immutable ledger. This means that through clever cryptography, once data has been written to it, no one, not even a system administrator, can change it. HyperPooch is thus a better alternative to tracking an animal’s ancestry over time, such that every time a pet is born its records [2] are securely stored in the ledger linking to parents before it. HyperPooch digitizes the cumbersome paper process guaranteeing the authenticity and traceability of a pet’s pedigree as well as the accountability of an owner in the case of an abandoned animal. 

Like so much that has come before, HyperPooch leverages the ever-increasing capacity of computer systems to provide a new way of replacing humans with code. And once it’s been written and debugged, code tends to be an awful lot cheaper [3]. HyperPooch provides a platform of trust for parties like pet show judges, insurance companies, breeding auditors and even border controls living the the world of ever increasing industrial scale breeding and illegal trading of designer puppies.

There are 3 distinct core technological components in the system. They are isolated environments that communicate with each other separately.

The Chaincode  - This is GoLang code that runs on/with a peer on the blockchain network. All HyperPooch blockchain ledger interactions ultimately happen here, including reading and writing directly to the ledger

The Client Side JS - This is JavaScript code running in the user's web browser. User interface interaction happens here. This may appear very similar to existing systems

The Server Side JS  - This is JavaScript code running our application's backend. i.e Node.js code which is the heart of the system! Sometimes referred to as our node or server code. Functions as the glue between the web admin and the blockchain ledger. 

These are 3 isolated components that are separated. They do not share variables nor functions. They will communicate via a networking protocol such as gRPC or WebSockets.

[1] http://www.agriculture.gov.ie/press/pressreleases/2016/march/title,95964,en.html
[2] http://www.irishstatutebook.ie/eli/2015/si/63/made/en/pdf
[3] https://www.multichain.com/blog/2016/03/blockchains-vs-centralized-databases/
