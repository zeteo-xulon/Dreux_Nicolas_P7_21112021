'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

/* ==========================================
 *
 * This file is configured throught the default Sequelize (version 6) CLI.
 * All the documentation can be found at :
 * https://sequelize.org/v6/manual/migrations.html
 * 
 ========================================== */
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


/* ==========================================
 *             TABLES MODELS
 *
 * Documentation: https://sequelize.org/v6/manual/model-instances.html
 ========================================== */
db.user = require("./User")(sequelize, Sequelize);
db.post = require("./Post")(sequelize, Sequelize);
db.comment = require("./Comment")(sequelize, Sequelize);
db.role = require("./Role")(sequelize, Sequelize);

/** ==========================================
 *             TABLES ASSOCIATIONS
 *
 * Documentation: https://sequelize.org/v6/manual/assocs.html
 * @params {instance} db. - The db. contain an instance of Sequelize and of each models.
 * @params {options} option - The option possible to specify the customization of the association.
 ========================================== */
//user
db.user.hasMany(db.post);
db.user.hasMany(db.comment);
db.user.hasOne(db.role);

//role
db.role.belongsTo(db.user);

//post
db.post.hasMany(db.comment, { onDelete: "CASCADE" });
db.post.belongsTo(db.user);

//comment
db.comment.belongsTo(db.post, { onDelete: "CASCADE" });
db.comment.belongsTo(db.user);

module.exports = db;