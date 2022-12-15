module.exports = (sequelize, Sequelize) => {
  const Software = sequelize.define("specifications", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
    },
    created_at: {
      type: Sequelize.DATE,
    },
    created_at: {
      type: Sequelize.DATE,
    },
  });

  return Software;
};
