module.exports = (sequelize, Datatypes) => {
  const Post = sequelize.define("comments", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: Datatypes.STRING,
      allowNull: false,
    },
    body: {
      type: Datatypes.TEXT,
      allowNull: false
    },
    media: {
      type : Datatypes.BLOB,
      allowNull: true
    }
  }, { timestamps : true });

  return Post;
};