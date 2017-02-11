------------------------------------
BACKEND : Documentation
------------------------------------

IP Address
---------------------
10.136.22.201

Commands
---------------------
1)  To start the backend application
	$ nodemon server.js

Modules
---------------------
1) Controllers
	clientController: Manages all functions for storing and retrieving clients.
		- addClient
		- deleteClient
		- editClient
		- oneClient
		- allClients

	 photoController: Manages all functions for storing and retrieving photos.
	 	- savePhoto

2) Models
	clientModel: The model for the client object in the DB
		- ClientSchema

3) Server: The Node.js server itself. 
	