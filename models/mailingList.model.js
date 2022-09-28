module.exports = (sequelize, Sequelize) => {
  const MailingList = sequelize.define("mailinglist", {
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
    member: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    deskripsi: {
      type: Sequelize.STRING,
    },
  });

  return MailingList;
};
