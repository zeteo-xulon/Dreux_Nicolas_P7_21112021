module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define("users", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Datatypes.STRING,
      allowNull: false,
      require: true,
      unique: true
    },
    password: {
      type: Datatypes.STRING,
      allowNull: false,
      require: true
    },
    firstname: {
      type : Datatypes.STRING(100),
      allowNull: true
    },
    lastname: {
      type : Datatypes.STRING(100),
      allowNull: true
    },
    job: {
      type: Datatypes.STRING(100),
      allowNull: true
    },
    bio: {
      type : Datatypes.TEXT,
      allowNull: true
    },
    role_id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
      }
    }, 
    { timestamps : false });

  return User;
};