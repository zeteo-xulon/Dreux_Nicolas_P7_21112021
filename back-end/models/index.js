'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


/*==========================================
*             TABLES MODELES
==========================================*/
db.user = require("./User")(sequelize, Sequelize);
db.post = require("./Post")(sequelize, Sequelize);
db.comment = require("./Comment")(sequelize, Sequelize);
db.role = require("./Role")(sequelize, Sequelize);

/*==========================================
*             TABLES JOIN
==========================================*/
//user
db.user.hasMany(db.post);
db.user.hasMany(db.comment);

//role
db.user.hasOne(db.role);
db.role.belongsTo(db.user);

//post
db.post.hasMany(db.comment, { onDelete: "CASCADE" });
db.post.belongsTo(db.user);

//comment
db.comment.belongsTo(db.post, { onDelete: "CASCADE" });
db.comment.belongsTo(db.user);

module.exports = db;
