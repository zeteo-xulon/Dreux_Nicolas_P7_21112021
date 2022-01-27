const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

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
    next();
  } 
  catch (error) {
    res.status(401).json({ error: new Error('Unauthorized request!')});
  }
};