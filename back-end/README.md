### SERVER
First you will need to install the server part of the website.
*The server use JSDoc to provide a documentation of the code. If you want to know more about JSDoc please visit : https://jsdoc.app/*

Go to :
`cd back-end/`

And write :
`npm install`

*It will install all the necesserary dependencies*

##### JUNCTION BETWEEN SERVER & DATABASE
To make the junction between the database and the server, you will need to create a folder named config.
Inside this folder, you will need to create a json file named config (config.json) and enter the information how you personalized you're database. here is an example :

```json
{
  "development": {
    "username": "username", // The username you are using for your database
    "password": "password", // your password
    "database": "database", // here groupomania
    "host": "server", // here localhost
    "dialect": "language" // the language of your database, ere mysql
  }
}
```

And you will need to use dotenv, its used to keep the token safe.

##### IMAGES
In order to stock the picture and media needed for the server, you will need to create a images folder.
Inside this folder, you will need to add a picture that will be in use as a default avatar, and name it :
*default-avatar.jpg*

##### START THE SERVER
Then to start the back end server write :
`npm start`

##### DATABASE
For the developpment of this website, I used MySQL, so you will need MySQL version 8 to make it work with the initial configuration.
This server use sequelize, so you will need to connect Sequelize (version 6) with you're database (postGres, MariaDB, etc.), and I invite you to go to the Sequelize website, if you don't manage to use MySQL, for the adjustement to do inside the code : https://sequelize.org/v6/

