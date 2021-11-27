/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv').config();
const db = require("./models");
const User = db.user;
const server = require('./server');
const userRoutes = require('./routes/user');

/*----------------------------------------------------------------
													USE
----------------------------------------------------------------*/
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use('', userRoutes);


// to auto reset : { force: true }
db.sequelize.sync({ force: true })
.then(server)
.catch( err => console.log({err}));

// Export
module.exports = app;