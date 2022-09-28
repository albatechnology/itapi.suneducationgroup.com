module.exports = (sequelize, Sequelize) => {
  const UoM = sequelize.define("uom", {
    uom_value: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
    },
  });

  return UoM;
};
