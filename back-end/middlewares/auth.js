const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.TOKEN);
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      return res.status(403).json({ error: new Error('Unauthorized request!')})
    } else {
      next();
    }
  } 
  catch (error) {
    res.status(401).json({ error: new Error('Unauthorized request!')});
  }
};