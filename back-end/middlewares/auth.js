const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require("../models");
const User = db.user;

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
    .then((user) => req.role = user.dataValues.role_id )
    .catch(err => console.log(err))
    console.log(`
    ............................
      user role = ${req.role}
    ............................
    `)
    next();
  } 
  catch (error) {
    res.status(401).json({ error: new Error('Unauthorized request!')});
  }
};