const db = require("../models");
const User = db.user;

module.exports = (req, res, next) => {
    User.findOne({ where: { id: req.token }})
    .then((e) => {
        req.role = e.role_id;
        console.log(`
        _____________
        
        The ID number of this user is : ${ req.token }
        The role number of this user is : ${ req.role }
        _____________
        `);
        next()
    })
    .catch(err => res.status(401).json({ err }))
     
  };