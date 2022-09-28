module.exports = (sequelize, Sequelize) => {
  const JenisPerbaikan = sequelize.define("jenis_perbaikan", {
    jenis_perbaikan_value: {
      type: Sequelize.STRING,
      unique: true,
      primaryKey: true,
    },
  });

  return JenisPerbaikan;
};
