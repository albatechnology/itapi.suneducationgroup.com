module.exports = (sequelize, Sequelize) => {
  const TipsAndTrick = sequelize.define("tipsandtrick", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    infografik_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return TipsAndTrick;
};
