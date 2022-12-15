module.exports = (sequelize, Sequelize) => {
  const Channel = sequelize.define("channels", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    code: {
      type: Sequelize.STRING,
    },
    is_franchise: {
      type: Sequelize.INTEGER,
    },
  });
  return Channel;
};
