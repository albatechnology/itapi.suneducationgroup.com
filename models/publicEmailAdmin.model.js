module.exports = (sequelize, Sequelize) => {
  const PublicEmailAdmin = sequelize.define("publicemailadmin", {
    publicemail_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return PublicEmailAdmin;
};
