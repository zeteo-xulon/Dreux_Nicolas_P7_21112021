module.exports = (sequelize, Datatypes) => {
  const User = sequelize.define("users", {
    id: {
      type: Datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    email: {
      type: Datatypes.STRING(120),
      allowNull: false,
      require: true,
      validate: { 
        notNull: { msg: "L'adresse email doit contenir au minimum 7 caractères." },
        notEmpty: { msg: "L'adresse email doit contenir au minimum 7 caractères." },
        isEmail: { msg: "L'addresse email doit être valide." } 
      },
      unique: true
    },
    password: {
      type: Datatypes.STRING(150),
      allowNull: false,
      require: true
    },
    firstname: {
      type : Datatypes.STRING(100),
      allowNull: false,
      require: true
    },
    lastname: {
      type : Datatypes.STRING(100),
      allowNull: false,
      require: true
    },
    job: {
      type: Datatypes.STRING(100),
      allowNull: true
    },
    bio: {
      type : Datatypes.TEXT,
      allowNull: true
    },
    avatar: {
      type: Datatypes.STRING(200),
      allowNull: true,
      defaultValue:"http://localhost:3000/images/default-avatar.jpg"
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