module.exports = (sequelize, Datatypes) => {
  const Role = sequelize.define("roles", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: Datatypes.STRING(50),
      allowNull: false
    },
   },
    { timestamps : false }
  );

  return Role;
};