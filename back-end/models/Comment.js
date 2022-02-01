module.exports = (sequelize, Datatypes) => {
  const Post = sequelize.define("comments", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    body: {
      type: Datatypes.TEXT,
      allowNull: false
    },
    media: {
      type : Datatypes.STRING,
      allowNull: true
    }
  }, { timestamps : true });

  return Post;
};