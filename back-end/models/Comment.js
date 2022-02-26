module.exports = (sequelize, Datatypes) => {
  const Comment = sequelize.define("comments", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    text: {
      type: Datatypes.TEXT,
      allowNull: false
    }
  }, { timestamps : true });

  return Comment;
};