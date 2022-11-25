module.exports = (sequelize, Sequelize) => {
  const HardwareSpec = sequelize.define("hardware_spesifikasi", {
    id: {
      type: Sequelize.INTEGER,
      unique: true,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_hardware: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    kode_inventori: {
      type: Sequelize.STRING,
      unique: true,
    },
    seq_inventori: {
      type: Sequelize.INTEGER,
    },
    consumable: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    stock_qty: {
      type: Sequelize.INTEGER,
    },
    deskripsi: {
      type: Sequelize.STRING,
    },
    spesifikasi: {
      type: Sequelize.TEXT,
    },
  });

  return HardwareSpec;
};
