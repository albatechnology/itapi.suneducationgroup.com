module.exports = (sequelize, Sequelize) => {
  /*
  status
  0. Not Assign
  1. Assign

*/
  const HardwareInventoriLisence = sequelize.define(
    "hardware_inventori_lisence",
    {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      hardware_inventori_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      software_lisence_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      tanggal_assign: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggal_unsign: {
        type: Sequelize.DATEONLY,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    }
  );

  return HardwareInventoriLisence;
};
