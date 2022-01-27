module.exports = (sequelize, Datatypes) => {
  const Post = sequelize.define("posts", {
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
    text: {
      type: Datatypes.TEXT,
      allowNull: false
    },
    media: {
      type : Datatypes.STRING,
      allowNull: true
    },
    media_description: {
      type : Datatypes.STRING,
      allowNull: true
    }
  }, { timestamps : true });

  return Post;
};