# NodeJs-Express application for login of the registered users

This is a NodeJs built using Express for allowing the registered users to login to the system. It uses an embedded UI, build using [EJS](https://ejs.co/)


There are three parts of this project.

1) Registration service

An independent service allowing user to register in the system.

URL: [registration service](https://github.com/monil-panchal/nodejs-express-ejs-registration)
    
2) Login service


An independent service allowing registered users to login to the system.
This service generates a [JWT](https://jwt.io/) token based on the user's hashed password + login time as a secret, and stores the secret in the central database (acting as a central secret manager)

3) Dashboard service
    
URL: [dashboard service](https://github.com/monil-panchal/nodejs-express-ejs-user-dashboard)

An independent service allowing registered users to to view a list of registered online users.
This service validates the [JWT](https://jwt.io/) token based on the user's hashed password + login time as a secret which is retrieved from the central database.

 
## Installation

Import this project in any IDE

Using [npm](https://www.npmjs.com/), build the project by running following command:

```
npm install
```

#### Run the project
```
npm start
```

This will spawn an embedded web server running on port: `http://localhost:8080/.`

#### Database setup


Setup a MySQL database server and execute the following commands to setup the database and tables. Add the connection details to  `connection/db-connection.js`


## Usage

Enter the user's credentials for login.