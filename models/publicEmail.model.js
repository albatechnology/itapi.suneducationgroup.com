module.exports = (sequelize, Sequelize) => {
  const PublicEmail = sequelize.define("public_email", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    admin: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    deskripsi: {
      type: Sequelize.STRING,
    },
  });

  return PublicEmail;
};
