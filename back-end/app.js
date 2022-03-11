/*----------------------------------------------
									REQUIRE
----------------------------------------------*/
const express = require('express');
const app = express();
const helmet = require('helmet')
const dotenv = require('dotenv').config();
const db = require("./models");
const User = db.user;
const server = require('./server');
const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const ratelimit = require('express-rate-limit')
const limiter = ratelimit({ windowMs: 1 * 60 * 1000, max: 150 }) // Limit the number of request to 150 request each minute

/*----------------------------------------------
										CORS
----------------------------------------------*/
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

/*----------------------------------------------
										APP
----------------------------------------------*/
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('', userRoutes);
app.use('', postRoutes);
app.use('', commentRoutes);

// to auto reset : { force: true }
// to modify only the specified { alter: true }
db.sequelize.sync()
.then(server)
.catch( err => console.log({err}));

// Export
module.exports = app;