/*----------------------------------------------------------------
													REQUIRE
----------------------------------------------------------------*/
const express = require('express');
const app = express();
const cors = require('cors');
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

app.get('/users', (req, res, next) => {
  console.log(req.body);
  User.findAll()
  .then((data) => {
    res.send(data);
  })
  .catch(err => res.send(err));
});





app.delete('/profil', (req, res, next) => {
  User.destroy({ where: { id: req.body.id }  })
  .catch(err => res.send(err));
  res.send(`User ${req.body.id} has been deleted`);
})

// to auto reset : { force: true }
db.sequelize.sync({ force: true })
.then(server)
.catch( err => console.log({err}));

// Export
module.exports = app;