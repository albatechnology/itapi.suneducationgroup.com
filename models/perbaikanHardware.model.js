module.exports = (sequelize, Sequelize) => {
  /*
        status
        0. Declined
        1. Create 
        2. At vendor
        3. At Admin
        10. Complete
    */
  const PerbaikanHardware = sequelize.define("perbaikan_hardware", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    tanggal_pengajuan: {
      type: Sequelize.DATEONLY,
    },
    vendor_id: {
      type: Sequelize.INTEGER,
    },
    catatan: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.INTEGER,
    },
    create_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  });

  return PerbaikanHardware;
};
