module.exports = (sequelize, Sequelize) => {
  /*
        status
        0. Declined
        1. Create 
        2. At vendor
        3. At Admin
        10. Complete
    */
  const PerbaikanHardwareInventori = sequelize.define(
    "perbaikan_hardware_inventori",
    {
      id: {
        type: Sequelize.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
      },
      perbaikan_hardware_id: {
        type: Sequelize.INTEGER,
      },
      inventori_id: {
        type: Sequelize.INTEGER,
      },
      assign_id: {
        type: Sequelize.INTEGER,
      },
      keterangan: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.INTEGER,
      },
      biaya: {
        type: Sequelize.DECIMAL,
      },
    }
  );

  return PerbaikanHardwareInventori;
};
