const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require("../models");
const User = db.user;

/** 
 * The auth is a middleware who cast Json Web Token to authentificate the user, return the ID {Number} and the Role {Number}
 * @param {Object} req - The request, with all the data from the front
 * @param {Object} res - The response the server will send to the front
 * @param {Function} next - The next function drive to pursue to the next step in the code flow
 */
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    req.token = decodedToken.userId;
    console.log(`
    ________________________
      user ID = ${req.token}
      ______________________
    `)
    User.findOne({ where: { id: req.token }})
    .then((user) => { 
      req.role = user.dataValues.role_id
      console.log(`
      ............................
        user role = ${req.role}
      ............................
      `)
      next();
    })
    .catch(err => console.log(err))
  } 
  catch (error) {
    res.status(401).json({ error: new Error('Unauthorized request!')});
  }
};