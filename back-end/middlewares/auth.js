const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    console.log(req);
    const token = req.body.token;
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    req.token = decodedToken.userId;
    next();
  } 
  catch (error) {
    res.status(401).json({ error: new Error('Unauthorized request!')});
  }
};