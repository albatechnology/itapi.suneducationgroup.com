module.exports = (sequelize, Sequelize) => {
  const Software = sequelize.define("software", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_software: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: Sequelize.STRING,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return Software;
};
