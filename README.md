# ContactsRealmWebApp
Application to demonstrate how to use Realm Sync with a Web App to do basic operations (CRUD)

# Live Example
This is the live example of the Web application running

[![Live Example](https://i.imgur.com/TSMRjOI.gif)](https://i.imgur.com/TSMRjOI.gif)

# Description

This application will list a table of contacts added to Mongo Realm and will synchronize the data with Realm Sync.

Operations allowed:

1. Log in with Email/Password
2. Show list of contacts
3. Create a new contact
4. Update contact 
5. Delete contact

# Dependencies & Prerequisites 

This application consists of a backend made in Realm and a frontend made in HTML with CSS and Bootstrap. 

The frontend is contained in a docker with nginx, so we don't have to install any web server on our computer. You need to set several things in order to build and run this application.

1. Have an Atlas account with an M0 Cluster.
2. A MongoDB Atlas [programmatic API key](https://www.mongodb.com/docs/atlas/configure-api-access/#programmatic-api-keys) for the MongoDB Cloud account you wish to log in with. You must be a Project Owner to create a Realm app.
3. Install [Docker CE](https://docs.docker.com/get-docker/)
4. Install `node` version 16.15.0 LTS from their [website](https://nodejs.org/en/)
5. Install `realm-cli`. Follow the instructions for manual install or `npm` install at https://docs.mongodb.com/realm/deploy/realm-cli-reference

## Mongo Realm & Docker

Once all the above steps have been carried out:

1. Clone this project locally on your computer.
2. In the route `backend/Realm/data_sources/config.json`, we need to change the `clusterName` for your cluster name. The name of the cluster can be checked in your Atlas UI. 

	```json
	{
	    "name": "mongodb-atlas",
	    "type": "mongodb-atlas",
	    "config": {
	        "clusterName": "<<Cluster Name>>",
	        "readPreference": "primary",
	        "wireProtocolEnabled": false
	    },
	    "version": 1
	}
	```
3. Log in using the `realm-cli` and your API credentials created in the [previous section](#Dependencies-&-Prerequisites) using the following command

	```shell
	realm-cli login --api-key="<my api key>" --private-api-key="<my private api key>"
	```
4. Import the project. For this, you have to go to the `backend/Realm` folder and execute the following command
	
	```bash
	realm-cli push
	```
5. A prompt will ask you if you wish to create a new Realm App. You must set `y` to allow.
6. The configuration could be the following:

	```bash
	? Do you wish to create a new app? Yes
	? App Name Laboratory
	? App Location IE
	? App Deployment Model LOCAL
	? App Environment development
	```
	
7. This will create a new Realm App in your selected project.

# Run the application

1. In order to run the application we need to create a `.env` file in the folder `frontend/ContactListWebApp` and paste the values of the `.env.template` file located in the same directory. 
1. Following the previous step, in the newly created `.env` file, need to substitute the value `APP_ID` for the APP_ID of our Realm App.
2. Install the dependencies needed to run the backend. For this go to the folder `frontend/ContactListWebApp` and execute:
 
  ```bash
  npm install
  ```
3. Go to the `frontend/ContactListWebApp` folder and execute:

	```bash
	docker-compose up -d
	```
4. In the same directory `frontend/ContactListWebApp` execute:

  ```bash
  npm start
  ```
5. Go to `http://localhost:8080` in your browser.

# Packages needed 

This project is based on NodeJS and Bootstrap. These are the libraries used in this project. 

**Please note: You don't need to install this locally as they are all located in the container**

- npm
- express
- nodemon
- realm
- socket
- cors
- bson

All these libraries are in the `package.json`. 

# Step by Step

Follow the link to the [Wiki](https://github.com/josmanperez/RealmLaboratoyExercise/wiki) page for a step by step instruccionts on how to follow this laboratory.   