module.exports = (sequelize, Sequelize) => {
  const MailingListMember = sequelize.define("mailinglistmember", {
    mailinglist_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    fullname: {
      type: Sequelize.STRING,
    },
    user_id: {
      type: Sequelize.INTEGER,
    },
  });

  return MailingListMember;
};
