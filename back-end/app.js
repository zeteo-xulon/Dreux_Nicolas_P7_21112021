/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const express = require('express');
const app = express();
const dotenv = require('dotenv').config();
const db = require("./models");
const User = db.user;
const server = require('./server');
const userRoutes = require('./routes/user');

/*----------------------------------------------------------------
													USE
----------------------------------------------------------------*/
app.use(express.json());
// CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

app.use('', userRoutes);


// to auto reset : { force: true }
db.sequelize.sync({ force: true })
.then(server)
.catch( err => console.log({err}));

// Export
module.exports = app;