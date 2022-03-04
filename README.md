# GROUPOMANIA
*Groupomania is a social media project to help people from the company to get a better communication and relationship with each other.*

> If you only want to watch the website working, you can skip the front installation part and use the build website.

## INSTALLATION

### DATABASE
For the developpment of this website, I used MySQL, so you will need MySQL version 8 to make it work with the initial configuration.
Otherwise, you will need to connect Sequelize (version 6) with you're database (postGres, MariaDB, etc.), and I invite you to go to the Sequelize website for the adjustement to do inside the code : https://sequelize.org/v6/


### SERVER
First you will need to install the server part of the website.

Go to :
`cd back-end/`

And write :
`npm install`

*It will install all the necesserary dependencies*

Then to start the back end server write :
`npm start`

### FRONT
The front part of the website work with vue 3, so first you will need to install these dependancies.
Open a new terminal, and go to :
`cd front-end/groupomania/`

and write :
`npm install`

*It will install all the necesserary dependencies*

When all the dependencies are intalled, you can run the front by typing :
`npm run serve`