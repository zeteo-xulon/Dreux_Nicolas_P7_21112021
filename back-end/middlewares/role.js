const db = require("../models");
const User = db.user;

module.exports = (req, res, next) => {
    console.log(req.headers);
    User.findOne({ where: { id: req.token }})
    .then((e) => { if(e.role_id == 2) { req.role = 2 }})
    .catch(err => res.status(401).json({ err }))
     next()
  };