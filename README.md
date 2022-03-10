# GROUPOMANIA
*Groupomania is a social media project to help people from the company to get a better communication and relationship with each other.*

> If you only want to watch the website working, you can skip the front installation part and use the build website.

## INSTALLATION

### DATABASE
For the developpment of this website, I used MySQL, so you will need MySQL version 8 to make it work with the initial configuration.
This server use sequelize, so you will need to connect Sequelize (version 6) with you're database (postGres, MariaDB, etc.), and I invite you to go to the Sequelize website, if you don't manage to use MySQL, for the adjustement to do inside the code : https://sequelize.org/v6/


### SERVER
First you will need to install the server part of the website.

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



### FRONT
The front part of the website work with vue 3 CLI, so first you will need to install these dependancies.
Open a new terminal, and go to :
`cd front-end/groupomania/`

and write :
`npm install`

*It will install all the necesserary dependencies*

When all the dependencies are intalled, you can run the front by typing :
`npm run serve`

For the build version, please tip : 
`npm run build`

##### Previewing Locally
The ``dist`` directory is meant to be served by an HTTP server (unless you've configured ``publicPath`` to be a relative value), so it will not work if you open ``dist/index.html`` directly over ``file://`` protocol. The easiest way to preview your production build locally is using a Node.js static file server, for example serve:
```sh
npm install -g serve
# -s flag means serve it in Single-Page Application mode
# which deals with the routing problem below
serve -s dist
```
And it will need a publicPath to be fullfill with your own relative path.

You can find more information here :
[link here](https://cli.vuejs.org/guide/deployment.html#general-guidelines)
