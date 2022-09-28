module.exports = (sequelize, Sequelize) => {
  const FAQ = sequelize.define("faq", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    question: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return FAQ;
};
