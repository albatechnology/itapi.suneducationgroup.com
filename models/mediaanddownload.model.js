module.exports = (sequelize, Sequelize) => {
  const MediaAndDownload = sequelize.define("mediaanddownload", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    media_name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
    },
    filepath: {
      type: Sequelize.STRING,
    },
    deskripsi: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return MediaAndDownload;
};
